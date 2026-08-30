---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/transpile.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/transpile.py
license: Apache-2.0
---

## Module `pennylane/transforms/transpile.py`

Contains the transpiler transform.

## `state_transposition`

```python
def state_transposition(results, mps, new_wire_order, original_wire_order)
```

Transpose the order of any state return.

Args:
    results (ResultBatch): the result of executing a batch of length 1

Keyword Args:
    mps (List[MeasurementProcess]): A list of measurements processes. At least one is a ``StateMP``
    new_wire_order (Sequence[Any]): the wire order after transpile has been called
    original_wire_order (.Wires): the devices wire order

Returns:
    Result: The result object with state dimensions transposed.

## `transpile`

```python
def transpile(tape: QuantumScript, coupling_map, device=None) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Transpile a circuit according to a desired coupling map

.. warning::

    This transform does not yet support measurements of Hamiltonians or tensor products of observables. If a circuit
    is passed which contains these types of measurements, a ``NotImplementedError`` will be raised.

Args:
    tape (QNode or QuantumTape or Callable): A quantum circuit (QNode or quantum function).
    coupling_map: Data specifying the couplings between different qubits. This data can be any format accepted by ``nx.to_networkx_graph()``,
        currently including edge list, dict of dicts, dict of lists, NetworkX graph, 2D NumPy array, SciPy sparse matrix, or PyGraphviz graph.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[.QuantumTape], function]: The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

**Example**

Consider the following example circuit

.. code-block:: python

    def circuit():
        qp.CNOT(wires=[0, 1])
        qp.CNOT(wires=[2, 3])
        qp.CNOT(wires=[1, 3])
        qp.CNOT(wires=[1, 2])
        qp.CNOT(wires=[2, 3])
        qp.CNOT(wires=[0, 3])
        return qp.probs(wires=[0, 1, 2, 3])

which, before transpiling it looks like this:

.. code-block:: text

    0: ──╭●──────────────╭●──╭┤ Probs
    1: ──╰X──╭●──╭●──────│───├┤ Probs
    2: ──╭●──│───╰X──╭●──│───├┤ Probs
    3: ──╰X──╰X──────╰X──╰X──╰┤ Probs

Suppose we have a device which has connectivity constraints according to the graph:

.. code-block:: text

    0 --- 1
    |     |
    2 --- 3

We encode this in a coupling map as a list of the edges which are present in the graph, and then pass this, together
with the circuit, to the transpile function to get a circuit which can be executed for the specified coupling map:

>>> dev = qp.device('default.qubit', wires=[0, 1, 2, 3])
>>> transpiled_circuit = qp.transforms.transpile(circuit, coupling_map=[(0, 1), (1, 3), (3, 2), (2, 0)])
>>> transpiled_qnode = qp.QNode(transpiled_circuit, dev)
>>> print(qp.draw(transpiled_qnode)())
0: ─╭●────────────────╭●─┤ ╭Probs
1: ─╰X─╭●───────╭●────│──┤ ├Probs
2: ─╭●─│──╭SWAP─│──╭X─╰X─┤ ├Probs
3: ─╰X─╰X─╰SWAP─╰X─╰●────┤ ╰Probs

A swap gate has been applied to wires 2 and 3, and the remaining gates have been adapted accordingly
