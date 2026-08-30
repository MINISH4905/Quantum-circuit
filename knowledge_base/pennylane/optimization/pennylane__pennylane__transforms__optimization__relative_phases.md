---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/optimization/relative_phases.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/optimization/relative_phases.py
license: Apache-2.0
---

## Module `pennylane/transforms/optimization/relative_phases.py`

Transforms lowering gates and series of gates involving relative phases.
Transformations first published in:

Maslov, Dmitri. "On the Advantages of Using Relative Phase Toffolis with an Application to
Multiple Control Toffoli Optimization", arXiv:1508.03273, arXiv, 2016.
doi:10.48550/arXiv.1508.03273.

Giles, Brett, and Peter Selinger. "Exact Synthesis of Multiqubit Clifford+T Circuits",
arXiv:1212.0506, arXiv, 2013. doi:10.48550/arXiv.1212.0506.

## `match_relative_phase_toffoli`

```python
def match_relative_phase_toffoli(tape: QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Replace 4-qubit relative phase Toffoli gates with their equivalent circuit.

The equivalence is given in Maslov, Dmitri. "On the Advantages of Using Relative Phase Toffolis
with an Application to Multiple Control Toffoli Optimization", arXiv:1508.03273, arXiv, 2016.
`doi:10.48550/arXiv.1508.03273 <https://doi.org/10.48550/arXiv.1508.03273>`_.

.. note::

    This transform will also replace any subcircuits from the full pattern (composed of the
    4-qubit relative phase Toffoli and its decomposition) that can be replaced by the rest of the pattern.

Args:
    tape (QNode or QuantumScript or Callable): A quantum circuit.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[.QuantumScript], function]:
    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

**Example**

.. code-block:: python

    import pennylane as qp

    @qp.transforms.match_relative_phase_toffoli
    @qp.qnode(qp.device("default.qubit"))
    def circuit():
        qp.Hadamard(wires=0)
        qp.Hadamard(wires=1)
        qp.X(0)

        # begin relative phase 4-qubit Toffoli

        qp.CCZ(wires=[0, 1, 3])
        qp.ctrl(qp.S(wires=[1]), control=[0])
        qp.ctrl(qp.S(wires=[2]), control=[0, 1])
        qp.MultiControlledX(wires=[0, 1, 2, 3])

        # end relative phase 4-qubit Toffoli

        qp.Hadamard(wires=1)
        qp.X(0)
        return qp.expval(qp.Z(0))

The circuit (containing a 4-qubit relative phase Toffoli) before decomposition:

>>> print(qp.draw(circuit, level=0)())
0: ──H──X─╭●─╭●─╭●─╭●──X─┤  <Z>
1: ──H────├●─╰S─├●─├●──H─┤
2: ───────│─────╰S─├●────┤
3: ───────╰Z───────╰X────┤

The 4-qubit relative phase Toffoli pattern is replaced after the transform:

>>> print(qp.draw(circuit, level=1)())
0: ──H──X───────────╭●───────────╭●──X────────────────────────┤  <Z>
1: ──H──────────────│─────╭●─────│─────╭●──H──────────────────┤
2: ───────╭●────────│─────│──────│─────│────────────╭●────────┤
3: ──H──T─╰X──T†──H─╰X──T─╰X──T†─╰X──T─╰X──T†──H──T─╰X──T†──H─┤

## `match_controlled_iX_gate`

```python
def match_controlled_iX_gate(tape: QuantumScript, num_controls=1) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Quantum transform to replace controlled iX gates with their equivalent circuit.

A controlled-iX gate is a controlled-S and a Toffoli. The equivalence used is given in Giles, Brett,
and Peter Selinger. "Exact Synthesis of Multiqubit Clifford+T Circuits", arXiv:1212.0506,
arXiv, 2013. `doi:10.48550/arXiv.1212.0506 <https://doi.org/10.48550/arXiv.1212.0506>`_.

.. note::

    This transform will also replace any subcircuits from the full pattern (composed of
    the controlled iX gate and its decomposition) that can replaced by the rest of the pattern.

Args:
    tape (QNode or QuantumScript or Callable): A quantum circuit.
    num_controls (int): The number of controls on the CS gate.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[.QuantumScript], function]:
        The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

**Example**

Consider the following quantum function:

.. code-block:: python

    import pennylane as qp

    @qp.transforms.match_controlled_iX_gate(num_controls=2)
    @qp.qnode(qp.device("default.qubit"))
    def circuit():
        qp.Hadamard(wires=0)
        qp.Hadamard(wires=1)
        qp.X(0)

        # begin multi-controlled iX gate

        qp.ctrl(qp.S(wires=[2]), control=[0, 1])
        qp.MultiControlledX(wires=[0, 1, 2, 3])

        # end multi-controlled iX gate

        qp.Hadamard(wires=1)
        qp.X(0)

        return qp.expval(qp.Z(0))

The circuit (containing a controlled iX gate) before decomposition:

>>> print(qp.draw(circuit, level=0)())
0: ──H──X─╭●─╭●──X─┤  <Z>
1: ──H────├●─├●──H─┤
2: ───────╰S─├●────┤
3: ──────────╰X────┤

The multi-controlled iX gate is replaced after the transform:

>>> print(qp.draw(circuit, level=1)())
0: ──H──X────────╭●───────────╭●──X─┤  <Z>
1: ──H───────────├●───────────├●──H─┤
2: ────────╭●────│──────╭●────│─────┤
3: ──H──T†─╰X──T─╰X──T†─╰X──T─╰X──H─┤
