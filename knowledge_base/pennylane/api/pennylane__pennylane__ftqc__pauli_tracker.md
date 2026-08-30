---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ftqc/pauli_tracker.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ftqc/pauli_tracker.py
license: Apache-2.0
---

## Module `pennylane/ftqc/pauli_tracker.py`

This module contains Pauli Tracking functions.

## `pauli_to_xz`

```python
def pauli_to_xz(op: Operator) -> tuple[int, int]
```

Convert a `Pauli` operator to its `xz` representation up to a global phase, i.e., :math:`encode_{xz}(Pauli)=(x,z)=X^xZ^z`, where
:math:`x` is the exponent of the :class:`~pennylane.X` and :math:`z` is the exponent of
the :class:`~pennylane.Z`, meaning :math:`encode_{xz}(I) = (0, 0)`, :math:`encode_{xz}(X) = (1, 0)`,
:math:`encode_{xz}(Y) = (1, 1)` and :math:`encode_{xz}(Z) = (0, 1)`.

Args:
    op (qp.operation.Operator): A Pauli operator.

Return:
    A tuple of xz encoding data, :math:`x` is the exponent of the :class:`~pennylane.X`, :math:`z` is the exponent of
    the :class:`~pennylane.Z`.

**Example:**
    The following example shows how the Pauli to XZ works.

    >>> from pennylane.ftqc.pauli_tracker import pauli_to_xz
    >>> from pennylane import I
    >>> pauli_to_xz(I(0))
    (0, 0)

    A xz tuple representation is returned for a given Pauli operator.

## `xz_to_pauli`

```python
def xz_to_pauli(x: int, z: int) -> Operator
```

Convert x, z to a Pauli operator class.

Args:
    x (int) : Exponent of :class:`~pennylane.X` in the Pauli record.
    z (int) : Exponent of :class:`~pennylane.Z` in the Pauli record.

Return:
    A Pauli operator class.

**Example:**
    The following example shows how the XZ to Pauli works.

    >>> from pennylane.ftqc.pauli_tracker import xz_to_pauli
    >>> xz_to_pauli(0, 0)(wires=0)
    I(0)

    A Pauli operator class is returned for a given xz tuple.

## `pauli_prod`

```python
def pauli_prod(ops: list[Operator]) -> tuple[int, int]
```

Get the result of a product of a list of Pauli operators. The result is a new Pauli operator up to a global phase.
Mathematically, this function returns :math:`\prod_{i=0}^{n} ops[i]`.

Args:
    ops (List[qp.operation.Operator]): A list of Pauli operators with the same target wire.

Return:
    A xz tuple representing a new Pauli operator.

**Example:**
    The following example shows how the `pauli_prod` works.

    >>> from pennylane.ftqc.pauli_tracker import pauli_prod
    >>> from pennylane import I, X, Y, Z
    >>> pauli_prod([I(0),X(0),Y(0),Z(0)])
    (0, 0)

    The result is a new Pauli operator in the xz-encoding representation.

## `commute_clifford_op`

```python
def commute_clifford_op(clifford_op: Operator, xz: list[tuple[int, int]]) -> list[tuple[int, int]]
```

Gets the list of xz-encoded bits representing the list of input Pauli ops after being commuted through the given Clifford op.
Mathematically, this function applies the following equation: :math:`new\_xz \cdot clifford\_op = clifford\_op \cdot xz`
up to a global phase to move the :math:`xz` through the :math:`clifford\_op` and returns the :math:`new\_xz`. Note that :math:`xz` and
:math:`new\_xz` represent a list of Pauli operations.

Args:
    clifford_op (Operator): A Clifford operator class. Supported operators are: :class:`qp.S`, :class:`qp.H`, :class:`qp.CNOT`.
    xz (list(tuple)): A list of xz tuples which map to Pauli operators

Return:
    A list of new xz tuples that the clifford_op commute the xz to.

**Example:**
    The following example shows how the `commute_clifford_op` works.

    >>> from pennylane.ftqc.pauli_tracker import commute_clifford_op
    >>> from pennylane import I, CNOT
    >>> commute_clifford_op(CNOT(wires=[0,1]), [(1, 1), (1, 0)])
    [(1, 1), (0, 0)]

    A list of Pauli operators in the xz representation is returned.

## `get_byproduct_corrections`

```python
def get_byproduct_corrections(tape: QuantumScript, mid_meas: list, measurement_vals: list)
```

Correct sample results offline based on the executed quantum script and the mid-circuit measurement results for each shot.
The mid measurement results are first parsed with the quantum script to get the byproduct operations for each Clifford
and non-Clifford gates. Note that byproduct operations are stored as a list and accessed in a stack manner. The calculation iteratively
pops out the first operation in the tape and applies commutation rules for the first byproduct ops in the byproduct stack and
then the results are commutated to the byproduct of the current operations in the tape if it is a Clifford gate. The calculation
starts from applying commutate rules for :class:`qp.I` gate or :math:`encode\_xz(x,z)=(0,0)` to the first gate in the tape. The
measurement corrections are returned based on the observable operators and the xz recorded.

Args:
    tape (tape: qp.tape.QuantumScript): A Clifford quantum tape with :class:`~pennylane.X`, :class:`~pennylane.Y`, :class:`~pennylane.Z`,
        :class:`~pennylane.I`, :class:`~pennylane.H`, :class:`~pennylane.S`, :class:`~pennylane.CNOT` and non-Clifford gates (:class:`~pennylane.RZ`
        and :class:`~pennylane.ftqc.RotXZX`) at the beginning of circuit in the standard circuit formalism. Note that one non-Clifford gate per wire
        at most is supported.
    mid_meas (list): MidMeasurement results per shot.
    measurement_vals (list): Raw measurement results.

Return:
    A list of corrected measurement results.


**Note**
This work is to be integrated into the MBQC transform pipeline.

**Example:**

    .. code-block:: python

        from pennylane.ftqc import diagonalize_mcms, generate_lattice, measure_x, measure_y
        from pennylane.ftqc import GraphStatePrep

        from pennylane.ftqc.pauli_tracker import get_byproduct_corrections

        def generate_random_state(n):
            seed_value = 42  # You can use any integer as the seed
            np.random.seed(seed_value)
            input_state = np.random.random(2**n) + 1j * np.random.random(2**n)
            return input_state / np.linalg.norm(input_state)


        def generate_rot_gate_graph():
            lattice = generate_lattice([4], "chain")
            return lattice.graph


        num_shots = 1000
        dev = qp.device("lightning.qubit")

        @qp.set_shots(num_shots)
        @diagonalize_mcms
        @qp.qnode(dev, mcm_method="one-shot")
        def circ(start_state):
            qp.StatePrep(start_state, wires=[0])
            GraphStatePrep(generate_rot_gate_graph(), wires=[1, 2, 3, 4])
            qp.CZ(wires=[0, 1])
            m0 = measure_x(0, reset=True)
            m1 = measure_y(1, reset=True)
            m2 = measure_y(2, reset=True)
            m3 = measure_y(3, reset=True)

            GraphStatePrep(generate_rot_gate_graph(), wires=[3, 2, 1, 0])
            qp.CZ(wires=[3, 4])
            m4 = measure_x(4, reset=True)
            m5 = measure_y(3, reset=True)
            m6 = measure_y(2, reset=True)
            m7 = measure_y(1, reset=True)

            GraphStatePrep(generate_rot_gate_graph(), wires=[1, 2, 3, 4])
            qp.CZ(wires=[0, 1])
            m8 = measure_x(0, reset=True)
            m9 = measure_y(1, reset=True)
            m10 = measure_y(2, reset=True)
            m11 = measure_y(3, reset=True)

            return (
                qp.sample(wires=[4]),
                qp.sample(m0),
                qp.sample(m1),
                qp.sample(m2),
                qp.sample(m3),
                qp.sample(m4),
                qp.sample(m5),
                qp.sample(m6),
                qp.sample(m7),
                qp.sample(m8), qp.sample(m9), qp.sample(m10), qp.sample(m11)
            )

        init_state = generate_random_state(1)
        res = circ(init_state)

        ops = [qp.H(wires=[0]), qp.H(wires=[0]), qp.H(wires=[0])]
        measurements = [qp.sample(qp.Z(0))]

        meas_res = res[0]
        mid_meas_res = res[1:]
        corrected_meas_res = []

        script = qp.tape.QuantumScript(ops, measurements, shots=num_shots)

        for i in range(num_shots):
            mid_meas = [row[i] for row in mid_meas_res]
            corrected_meas_res.extend(get_byproduct_corrections(script, mid_meas, [meas_res[i]]))

        res_corrected = 1 - 2*np.sum(corrected_meas_res) / num_shots

        dev_ref = qp.device("default.qubit")

        @diagonalize_mcms
        @qp.qnode(dev)
        def circ_ref(start_state):
            qp.StatePrep(start_state, wires=[0])
            qp.H(0)
            qp.H(0)
            qp.H(0)
            return qp.expval(qp.Z(0))

        np.allclose(res_corrected, circ_ref(init_state))
