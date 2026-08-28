"""
Lightweight, deterministic circuit analysis for the AI tutor. These are pure
functions over the Circuit IR (no simulation, no network) that catch obvious
beginner mistakes reliably — the LLM (see llm_provider.py) is used to phrase
and elaborate on these, not to detect them from scratch, so a warning here
can never be silently dropped by a hallucinating model.
"""

from __future__ import annotations

from .models import QuantumCircuitModel, QuantumOperationModel

# Gates that are their own inverse: applying the same one twice in a row on
# the same single qubit is equivalent to doing nothing.
SELF_INVERSE_SINGLE_QUBIT_GATES = {"h", "x", "y", "z"}

# Gates that can move a qubit off a classical basis state into superposition.
SUPERPOSITION_GATES = {"h", "rx", "ry"}


def _ordered(circuit: QuantumCircuitModel) -> list[QuantumOperationModel]:
    return sorted(circuit.operations, key=lambda op: (op.timeStep, op.id))


def find_measurement_before_entanglement(circuit: QuantumCircuitModel) -> list[str]:
    """A qubit is measured, then later used in a two-qubit entangling gate —
    the entangling gate can no longer affect the already-collapsed result."""
    ordered = _ordered(circuit)
    measured_at: dict[int, int] = {}
    issues: list[str] = []

    for op in ordered:
        if op.gate == "measure":
            q = op.targets[0]
            measured_at.setdefault(q, op.timeStep)
        elif op.gate in ("cx", "cz", "swap"):
            involved = [*(op.controls or []), *op.targets]
            for q in involved:
                if q in measured_at and op.timeStep > measured_at[q]:
                    others = [str(x) for x in involved if x != q]
                    issues.append(
                        f"Qubit {q} is measured at step {measured_at[q]}, but a {op.gate.upper()} "
                        f"entangling it with qubit {', '.join(others) if others else '?'} happens later "
                        f"at step {op.timeStep} — that gate can no longer affect the already-collapsed result."
                    )

    return issues


def find_gates_after_measurement(circuit: QuantumCircuitModel) -> list[str]:
    """A gate is applied to a qubit after it was already measured — it has
    no effect on the reported outcome in this simulator."""
    ordered = _ordered(circuit)
    measured_at: dict[int, int] = {}
    issues: list[str] = []

    for op in ordered:
        if op.gate == "measure":
            q = op.targets[0]
            measured_at.setdefault(q, op.timeStep)
            continue
        involved = [*(op.controls or []), *op.targets]
        for q in involved:
            if q in measured_at and op.timeStep > measured_at[q]:
                issues.append(
                    f"A {op.gate.upper()} gate is applied to qubit {q} at step {op.timeStep}, after it "
                    f"was already measured at step {measured_at[q]} — this gate has no effect on the "
                    f"reported measurement outcome."
                )

    return issues


def find_missing_superposition_before_control(circuit: QuantumCircuitModel) -> list[str]:
    """A CX/CZ's control qubit was never put into superposition (no H/RX/RY
    beforehand) — the gate then behaves as a deterministic flip rather than
    creating entanglement, a common beginner misconception."""
    ordered = _ordered(circuit)
    prepared: set[int] = set()
    issues: list[str] = []

    for op in ordered:
        if op.gate in SUPERPOSITION_GATES:
            prepared.add(op.targets[0])
        elif op.gate in ("cx", "cz"):
            control = (op.controls or [None])[0]
            if control is not None and control not in prepared:
                issues.append(
                    f"{op.gate.upper()} at step {op.timeStep} uses qubit {control} as the control, but "
                    f"qubit {control} was never put into superposition (no H/RX/RY beforehand). Without "
                    f"superposition this gate just deterministically flips (or doesn't flip) the target "
                    f"— it won't create entanglement. Consider adding H(q{control}) first."
                )

    return issues


def find_redundant_self_inverse_pairs(circuit: QuantumCircuitModel) -> list[str]:
    """Two identical self-inverse single-qubit gates back-to-back on the
    same qubit, with nothing else touching that qubit in between, cancel out
    to the identity and can be removed."""
    ordered = _ordered(circuit)
    last_op_on_qubit: dict[int, QuantumOperationModel] = {}
    issues: list[str] = []

    for op in ordered:
        involved = [*(op.controls or []), *op.targets]
        if op.gate in SELF_INVERSE_SINGLE_QUBIT_GATES and len(involved) == 1:
            q = involved[0]
            prev = last_op_on_qubit.get(q)
            if prev is not None and prev.gate == op.gate:
                issues.append(
                    f"{op.gate.upper()} on qubit {q} at step {op.timeStep} immediately cancels the "
                    f"{prev.gate.upper()} on the same qubit at step {prev.timeStep} — the pair is "
                    f"equivalent to doing nothing and can be removed."
                )
            last_op_on_qubit[q] = op
        else:
            for q in involved:
                last_op_on_qubit[q] = op

    return issues


def analyze_circuit(circuit: QuantumCircuitModel) -> list[str]:
    """Run every deterministic check and return the combined list of
    human-readable issue descriptions (empty if none found)."""
    issues: list[str] = []
    issues += find_measurement_before_entanglement(circuit)
    issues += find_gates_after_measurement(circuit)
    issues += find_missing_superposition_before_control(circuit)
    issues += find_redundant_self_inverse_pairs(circuit)
    return issues
