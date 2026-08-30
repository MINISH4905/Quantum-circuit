---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/meta.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/meta.py
license: Apache-2.0
---

## Module `pennylane/ops/meta.py`

This submodule contains the discrete-variable quantum operations that do
not depend on any parameters.

## `Barrier`

```python
class Barrier(Operation)
```

Barrier(wires)
The Barrier operator, used to separate the compilation process into blocks or as a visual tool.

**Details:**

* Number of wires: AnyWires
* Number of parameters: 0

Args:
    only_visual (bool): True if we do not want it to have an impact on the compilation process. Default is False.
    wires (Sequence[int] or int): the wires the operation acts on

### `compute_decomposition`

```python
def compute_decomposition(wires, only_visual=False)
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.Barrier.decomposition`.

``Barrier`` decomposes into an empty list for all arguments.

Args:
    wires (Iterable, Wires): wires that the operator acts on
    only_visual (Bool): True if we do not want it to have an impact on the compilation process. Default is False.

Returns:
    list: decomposition of the operator

**Example:**

>>> print(qp.Barrier.compute_decomposition(0))
[]

## `WireCut`

```python
class WireCut(Operation)
```

WireCut(wires)
The wire cut operation, used to manually mark locations for wire cuts.

.. note::

    This operation is designed for use as part of the circuit cutting workflow.
    Check out the :func:`qp.cut_circuit() <pennylane.cut_circuit>` transform for more details.

**Details:**

* Number of wires: AnyWires
* Number of parameters: 0

Args:
    wires (Sequence[int] or int): the wires the operation acts on

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike)
```

Representation of the operator as a product of other operators (static method).

Since this operator is a placeholder inside a circuit, it decomposes into an empty list.

Args:
    wires (Any, Wires): Wire that the operator acts on.

Returns:
    list[Operator]: decomposition of the operator

**Example:**

>>> print(qp.WireCut.compute_decomposition(0))
[]

## `Snapshot`

```python
class Snapshot(Operation)
```

The Snapshot operation saves the internal execution state of the quantum function
at a specific point in the execution pipeline. As such, it is a pseudo operation
with no effect on the quantum state. Arbitrary measurements are supported
in snapshots via the keyword argument ``measurement``.

**Details:**

* Number of wires: AnyWires
* Number of parameters: 0

Args:
    tag (str or None): An optional custom tag for the snapshot, used to index it
        in the snapshots dictionary.

    measurement (MeasurementProcess or None): An optional argument to record arbitrary
        measurements during execution. If None, the measurement defaults to `qp.state`
        on the available wires.

    shots (Literal["workflow"], None, int, Sequence[int]): shots to use for the snapshot.
        ``"workflow"`` indicates the same number of shots as for the final measurement.

.. warning::

    ``Snapshot`` captures the internal execution state at a point in the circuit, but compilation transforms
    (e.g., ``combine_global_phases``, ``merge_rotations``) may reorder or modify operations across the snapshot.
    As a result, the captured state may differ from the original intent.

**Example**

.. code-block:: python

    dev = qp.device("default.qubit", seed=42)

    @qp.qnode(dev)
    def circuit():
        qp.Snapshot(measurement=qp.expval(qp.Z(0)))
        qp.Hadamard(wires=0)
        qp.Snapshot("very_important_state")
        qp.CNOT(wires=[0, 1])
        qp.Snapshot()
        m = qp.Snapshot("samples", qp.sample(), shots=5)
        return qp.expval(qp.X(0))

>>> from pprint import pprint
>>> pprint(qp.snapshots(circuit)())  # doctest: +SKIP
{0: np.float64(1.0),
 2: array([ 0.70710678+0.j,  0.        +0.j, -0.        +0.j,  0.70710678+0.j]),
 'execution_results': np.float64(0.0),
 'samples': array([[1, 1],
       [0, 0],
       [1, 1],
       [1, 1],
       [0, 0]]),
 'very_important_state': array([ 0.70710678+0.j,  0.        +0.j,  0.70710678+0.j, -0.        +0.j])}

.. seealso:: :func:`~.snapshots`

### `tag`

```python
def tag(self) -> None | str | int
```

The tag for the snapshot.

### `update_tag`

```python
def update_tag(self, new_tag: int | None | str)
```

Create a new snapshot with an updated tag.
