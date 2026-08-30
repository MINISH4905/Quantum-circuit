---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/tape_expand.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/tape_expand.py
license: Apache-2.0
---

## Module `pennylane/transforms/tape_expand.py`

This module contains tape expansion functions and stopping criteria to
generate such functions from.

## `create_expand_fn`

```python
def create_expand_fn(depth, stop_at=None, device=None, docstring=None)
```

.. warning::
    Please use the :func:`qp.transforms.decompose <.transforms.decompose>` function for decomposing circuits.

Create a function for expanding a tape to a given depth, and
with a specific stopping criterion. This is a wrapper around
:meth:`~.QuantumTape.expand`.

Args:
    depth (int): Depth for the expansion
    stop_at (callable): Stopping criterion. This must be a function with signature
        ``stop_at(obj)``, where ``obj`` is a *queueable* PennyLane object such as
        :class:`~.Operation` or :class:`~.MeasurementProcess`. It must return a
        boolean, indicating if the expansion should stop at this object.
    device (pennylane.devices.LegacyDevice): Ensure that the expanded tape only uses native gates of the
        given device.
    docstring (str): docstring for the generated expansion function

Returns:
    callable: Tape expansion function. The returned function accepts a :class:`~.QuantumTape`,
    and returns an expanded :class:`~.QuantumTape`.

**Example**

Let us construct an expansion function that expands a tape in order to
decompose trainable multi-parameter gates. We allow for up to five expansion
steps, which can be controlled with the argument ``depth``.
The stopping criterion is easy to write as

>>> def stop_at(obj):
...     return not (len(obj.data) > 1 and any(qp.math.requires_grad(d) for d in obj.data))

Then the expansion function can be obtained via

>>> expand_fn = qp.transforms.create_expand_fn(depth=5, stop_at=stop_at)  # doctest: +SKIP

We can test the newly generated function on an example tape:

.. code-block:: python

    ops = [
        qp.RX(0.2, wires=0),
        qp.RX(qp.numpy.array(-2.4, requires_grad=True), wires=1),
        qp.Rot(1.7, 0.92, -1.1, wires=0),
        qp.Rot(*qp.numpy.array([-3.1, 0.73, 1.36], requires_grad=True), wires=1)
    ]
    tape = qp.tape.QuantumTape(ops)

>>> new_tape = expand_fn(tape)  # doctest: +SKIP
>>> print(qp.drawer.tape_text(tape, decimals=1))  # doctest: +SKIP
0: ──RX(0.2)───Rot(1.7,0.9,-1.1)─┤
1: ──RX(-2.4)──Rot(-3.1,0.7,1.4)─┤
>>> print(qp.drawer.tape_text(new_tape, decimals=1))  # doctest: +SKIP
0: ──RX(0.2)───Rot(1.7,0.9,-1.1)───────────────────┤
1: ──RX(-2.4)──RZ(-3.1)───────────RY(0.7)──RZ(1.4)─┤

## `create_expand_trainable_multipar`

```python
def create_expand_trainable_multipar(tape, use_tape_argnum=False)
```

Creates the expand_trainable_multipar expansion transform with an option to include argnums.

## `expand_nonunitary_gen`

```python
def expand_nonunitary_gen(*args, **kwargs)
```

Expands until all ops have unitary generators.

## `expand_invalid_trainable`

```python
def expand_invalid_trainable(*args, **kwargs)
```

Expands until all ops are trainable.
