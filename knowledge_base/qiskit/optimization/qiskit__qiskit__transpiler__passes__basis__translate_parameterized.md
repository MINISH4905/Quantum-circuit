---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/basis/translate_parameterized.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/basis/translate_parameterized.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/basis/translate_parameterized.py`

Translate parameterized gates only, and leave others as they are.

## `TranslateParameterizedGates`

```python
class TranslateParameterizedGates(TransformationPass)
```

Translate parameterized gates to a supported basis set.

Once a parameterized instruction is found that is not in the ``supported_gates`` list,
the instruction is decomposed one level and the parameterized sub-blocks are recursively
decomposed. The recursion is stopped once all parameterized gates are in ``supported_gates``,
or if a gate has no definition and a translation to the basis is attempted (this might happen
e.g. for the ``UGate`` if it's not in the specified gate list).

Example:

    The following, multiply nested circuit::

        from qiskit.circuit import QuantumCircuit, ParameterVector
        from qiskit.transpiler.passes import TranslateParameterizedGates

        x = ParameterVector("x", 4)
        block1 = QuantumCircuit(1)
        block1.rx(x[0], 0)

        sub_block = QuantumCircuit(2)
        sub_block.cx(0, 1)
        sub_block.rz(x[2], 0)

        block2 = QuantumCircuit(2)
        block2.ry(x[1], 0)
        block2.append(sub_block.to_gate(), [0, 1])

        block3 = QuantumCircuit(3)
        block3.ccx(0, 1, 2)

        circuit = QuantumCircuit(3)
        circuit.append(block1.to_gate(), [1])
        circuit.append(block2.to_gate(), [0, 1])
        circuit.append(block3.to_gate(), [0, 1, 2])
        circuit.cry(x[3], 0, 2)

        supported_gates = ["rx", "ry", "rz", "cp", "crx", "cry", "crz"]
        unrolled = TranslateParameterizedGates(supported_gates)(circuit)

    is decomposed to::

             ┌──────────┐     ┌──────────┐┌─────────────┐
        q_0: ┤ Ry(x[1]) ├──■──┤ Rz(x[2]) ├┤0            ├─────■──────
             ├──────────┤┌─┴─┐└──────────┘│             │     │
        q_1: ┤ Rx(x[0]) ├┤ X ├────────────┤1 circuit-92 ├─────┼──────
             └──────────┘└───┘            │             │┌────┴─────┐
        q_2: ─────────────────────────────┤2            ├┤ Ry(x[3]) ├
                                          └─────────────┘└──────────┘

### `__init__`

```python
def __init__(self, supported_gates: list[str] | None=None, equivalence_library: EquivalenceLibrary | None=None, target: Target | None=None) -> None
```

Args:
    supported_gates: A list of supported basis gates specified as string. If ``None``,
        a ``target`` must be provided.
    equivalence_library: The equivalence library to translate the gates. Defaults
        to the equivalence library of all Qiskit standard gates.
    target: A :class:`.Target` containing the supported operations. If ``None``,
        ``supported_gates`` must be set. Note that this argument takes precedence over
        ``supported_gates``, if both are set.

Raises:
    ValueError: If neither of ``supported_gates`` and ``target`` are passed.

### `run`

```python
def run(self, dag: DAGCircuit) -> DAGCircuit
```

Run the transpiler pass.

Args:
    dag: The DAG circuit in which the parameterized gates should be unrolled.

Returns:
    A DAG where the parameterized gates have been unrolled.

Raises:
    QiskitError: If the circuit cannot be unrolled.
