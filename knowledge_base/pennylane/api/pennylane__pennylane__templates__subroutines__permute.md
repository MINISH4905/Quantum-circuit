---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/permute.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/permute.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/permute.py`

Contains the Permute template.

## `Permute`

```python
class Permute(Operation)
```

Applies a permutation to a set of wires.

Args:
    permutation (Sequence): A list of wire labels that represents the new ordering of wires
        after the permutation. The list may consist of integers or strings, so long as
        they match the labels of ``wires``.
    wires (Iterable or Wires): Wires that the permutation acts on. Accepts an iterable
        of numbers or strings, or a Wires object.

Raises:
    ValueError: if inputs do not have the correct format

**Example**

.. code-block:: python

    import pennylane as qp

    dev = qp.device('default.qubit', wires=5)

    @qp.qnode(dev)
    def apply_perm():
        # Send contents of wire 4 to wire 0, of wire 2 to wire 1, etc.
        qp.templates.Permute([4, 2, 0, 1, 3], wires=dev.wires)
        return qp.expval(qp.Z(0))

See "Usage Details" for further examples.

.. details::
    :title: Usage Details

    As a simple example, suppose we have a 4-qubit device with wires labeled
    by the integers ``[0, 1, 2, 3]``. We apply a permutation to shuffle the
    order to ``[3, 2, 0, 1]`` (i.e., the qubit state that was previously on
    wire 3 is now on wire 0, the one from 2 is on wire 1, etc.).

    .. code-block:: python

        dev = qp.device('default.qubit', wires=4)

        @qp.qnode(dev)
        def apply_perm():
            qp.Permute([3, 2, 0, 1], dev.wires)
            return qp.expval(qp.Z(0))

    >>> print(qp.draw(apply_perm, level="device")())
    0: ─╭SWAP─────────────┤  <Z>
    1: ─│─────╭SWAP───────┤
    2: ─│─────╰SWAP─╭SWAP─┤
    3: ─╰SWAP───────╰SWAP─┤

    ``Permute`` can also be used with quantum tapes. For example, suppose we
    have a tape with 5 wires ``[0, 1, 2, 3, 4]``, and we'd like to reorder them
    so that wire 4 is moved to the location of wire 0, wire 2 is moved to the
    original location of wire 1, and so on.

    .. code-block:: python

        import pennylane as qp

        op = qp.Permute([4, 2, 0, 1, 3], wires=[0, 1, 2, 3, 4])
        tape = qp.tape.QuantumTape([op])

    >>> [tape_expanded], _ = qp.decompose(tape, gate_set={qp.SWAP})
    >>> print(qp.drawer.tape_text(tape_expanded, wire_order=range(5)))
    0: ─╭SWAP───────────────────┤
    1: ─│─────╭SWAP─────────────┤
    2: ─│─────╰SWAP─╭SWAP───────┤
    3: ─│───────────│─────╭SWAP─┤
    4: ─╰SWAP───────╰SWAP─╰SWAP─┤

    ``Permute`` can also be applied to wires with arbitrary labels, like so:

    .. code-block:: python

        wire_labels = [3, 2, "a", 0, "c"]

        dev = qp.device('default.qubit', wires=wire_labels)

        @qp.qnode(dev)
        def circuit():
            qp.Permute(["c", 3,"a",2,0], wires=wire_labels)
            return qp.expval(qp.Z("c"))

    The permuted circuit is:

    >>> print(qp.draw(circuit, level="device")())
    3: ─╭SWAP─────────────┤
    2: ─│─────╭SWAP───────┤
    0: ─│─────│─────╭SWAP─┤
    c: ─╰SWAP─╰SWAP─╰SWAP─┤  <Z>

    It is also possible to permute a subset of wires by
    specifying a subset of labels. For example,

    .. code-block:: python

        wire_labels = [3, 2, "a", 0, "c"]

        dev = qp.device('default.qubit', wires=wire_labels)

        @qp.qnode(dev)
        def circuit():
            # Only permute the order of 3 of them
            qp.Permute(["c", 2, 0], wires=[2, 0, "c"])
            return qp.expval(qp.Z("c"))

    will permute only the second, third, and fifth wires as follows:

    >>> print(qp.draw(circuit, level="device", show_all_wires=True)())
    3: ─────────────┤
    2: ─╭SWAP───────┤
    a: ─│───────────┤
    0: ─│─────╭SWAP─┤
    c: ─╰SWAP─╰SWAP─┤  <Z>

### `compute_decomposition`

```python
def compute_decomposition(wires, permutation)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.Permute.decomposition`.

Args:
    wires (Any or Iterable[Any]): wires that the operator acts on
    permutation (list[Any]): A list of wire labels that represents the new ordering of wires
        after the permutation.

Returns:
    list[.Operator]: decomposition of the operator
