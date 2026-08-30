---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/resolve_dynamic_wires.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/resolve_dynamic_wires.py
license: Apache-2.0
---

## Module `pennylane/transforms/resolve_dynamic_wires.py`

This submodule contains a transform for resolving dynamic wires into real wires.

## `null_postprocessing`

```python
def null_postprocessing(results: ResultBatch) -> Result
```

An empty postprocessing function returned by resolve_dynamic_wires

## `resolve_dynamic_wires`

```python
def resolve_dynamic_wires(tape: QuantumScript, zeroed: Sequence[Hashable]=(), any_state: Sequence[Hashable]=(), min_int: int | None=None, allow_resets: bool=True) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Map dynamic wires to concrete values determined by the provided ``zeroed`` and ``any_state`` registers.

Args:
    tape (QuantumScript): A circuit that may contain dynamic wire allocations and deallocations
    zeroed (Sequence[Hashable]): a register of wires known to be in the :math:`|0\rangle` state
    any_state (Sequence[Hashable]): a register of wires with any state
    min_int (Optional[int]): If not ``None``, new wire labels can be created starting at this
        integer and incrementing whenever a new wire is needed.
    allow_resets (boo): Whether or not mid circuit measurements with ``reset=True`` can be added
        to turn any state wires into zeroed wires.

Returns:
    tuple[QuantumScript], Callable[[ResultBatch], Result]: A batch of tapes and a postprocessing function

.. note::

    This transform currently uses a "Last In, First Out" (LIFO) stack based approach to distributing wires.
    This minimizes the total number of wires used, at the cost of higher depth and more resets. Other
    approaches could be taken as well, such as a "First In, First out" algorithm that minimizes depth.

    This approach also means we pop wires from the *end* of the stack first.

For a dynamic wire requested to be in the zero state (``state="zero"``), we try three things before raising an error:

  #. If wires exist in the ``zeroed`` register, we take one from that register
  #. If no ``zeroed`` wires exist and we are allowed to use resets, we pull one from ``any_state`` and apply a reset operation
  #. If no wires exist in the ``zeroed`` or ``any_state`` registers and ``min_int`` is not ``None``,
     we increment ``min_int`` and add a new wire.

For a dynamic wire with ``state="any"``, we try:

  #. If wires exist in the ``any_state`` register, we take one from there
  #. If no wires exist in ``any_state``, we pull one from ``zeroed``
  #. If no wires exist in the ``zeroed`` or ``any_state`` registers and ``min_int`` is not ``None``,
     we increment ``min_int`` and add a new wire

This transform uses a combination of two different modes: one with fixed registers specified by ``zeroed`` and
``any_state``, and one with a dynamically sized register characterized by the integer ``min_int``.  We assume
that the upfront cost associated with using more wires has already been paid for anything in ``zeroed`` and
``any_state``. Whether or not we use them, they will still be there. In this case, using a fresh wire is cheaper
than reset.  For the dynamically sized register, we assume that we have to pay an
additional cost each time we allocate a new wire. For the dynamically sized register, applying a reset
operation is therefor cheaper than allocating a new wire.

This approach minimizes the width of the circuit at the cost of more reset operations.

.. code-block:: python

    def circuit(state="zero"):
        with qp.allocation.allocate(1, state=state) as wires:
            qp.X(wires)
        with qp.allocation.allocate(1, state=state) as wires:
            qp.Y(wires)

>>> print(qp.draw(circuit)())
<DynamicWire>: ──Allocate──X──Deallocate─┤
<DynamicWire>: ──Allocate──Y──Deallocate─┤

If we provide two zeroed qubits to the transform, we can see that the two operations have been
assigned to both wires known to be in the zero state.

>>> from pennylane.transforms import resolve_dynamic_wires
>>> assigned_two_zeroed = resolve_dynamic_wires(circuit, zeroed=("a", "b"))
>>> print(qp.draw(assigned_two_zeroed)())
a: ──Y─┤
b: ──X─┤

If we only provide one zeroed wire, we perform a reset on that wire before reusing for the ``Y`` operation.

>>> assigned_one_zeroed = resolve_dynamic_wires(circuit, zeroed=("a",))
>>> print(qp.draw(assigned_one_zeroed)())
a: ──X──┤↗│  │0⟩──Y─┤

This reset behavior can be turned off with ``allow_resets=False``.

>>> no_resets = resolve_dynamic_wires(circuit, zeroed=("a",), allow_resets=False)
>>> print(qp.draw(no_resets)())
Traceback (most recent call last):
    ...
pennylane.exceptions.AllocationError: no wires left to allocate.

If we only provide ``any_state`` qubits with unknown states, then they will be reset to zero before being used
in an operation that requires a zero state.

>>> assigned_any_state = resolve_dynamic_wires(circuit, any_state=("a", "b"))
>>> print(qp.draw(assigned_any_state)())
b: ──┤↗│  │0⟩──X──┤↗│  │0⟩──Y─┤


Note that the last provided wire with label ``"b"`` is used first.
If the wire allocations had ``state="any"``, no reset operations would occur:

>>> print(qp.draw(assigned_any_state)(state="any"))
b: ──X──Y─┤

Instead of registers of available wires, a ``min_int`` can be specified instead.  The ``min_int`` indicates
the first integer to start allocating wires to.  Whenever we have no qubits available to allocate, we increment the integer
and add a new wire to the pool:

>>> circuit_integers = resolve_dynamic_wires(circuit, min_int=0)
>>> print(qp.draw(circuit_integers)())
0: ──X──┤↗│  │0⟩──Y─┤

Note that we still prefer using already created wires over creating new wires.

.. code-block:: python

    def multiple_allocations():
        with qp.allocation.allocate(1) as wires:
            qp.X(wires)
        with qp.allocation.allocate(3) as wires:
            qp.Toffoli(wires)

>>> circuit_integers2 = resolve_dynamic_wires(multiple_allocations, min_int=0)
>>> print(qp.draw(circuit_integers2)())
0: ──X──┤↗│  │0⟩─╭●─┤
1: ──────────────├●─┤
2: ──────────────╰X─┤

If both an explicit register and ``min_int`` are specified, ``min_int`` will be used once all available
explicit wires are loaned out. Below, ``"a"`` is extracted and used first, but then wires
are extracted starting from ``0``.

>>> zeroed_and_min_int = resolve_dynamic_wires(multiple_allocations, zeroed=("a",), min_int=0)
>>> print(qp.draw(zeroed_and_min_int)())
a: ──X──┤↗│  │0⟩─╭●─┤
0: ──────────────├●─┤
1: ──────────────╰X─┤
