---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/aqft.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/aqft.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/aqft.py`

This submodule contains the template for AQFT.

## `AQFT`

```python
class AQFT(Operation)
```

AQFT(order, wires)
Apply an approximate quantum Fourier transform (AQFT).

The `AQFT <https://arxiv.org/abs/1803.04933>`_ method helps to reduce the number of ``ControlledPhaseShift`` operations required
for QFT by only using a maximum of ``order`` number of ``ControlledPhaseShift`` gates per qubit.

.. seealso:: :class:`~.QFT`

Args:
    order (int): the order of approximation
    wires (int or Iterable[Number, str]]): the wire(s) the operation acts on

**Example**

The approximate quantum Fourier transform is applied by specifying the corresponding wires and
the order of approximation:

.. code-block:: python

    wires = 3
    dev = qp.device('default.qubit', wires=wires)

    @qp.qnode(dev)
    def circuit_aqft():
        qp.X(0)
        qp.Hadamard(1)
        qp.AQFT(order=1,wires=range(wires))
        return qp.state()


>>> np.round(circuit_aqft(), 8)
array([ 0.5 +0.j  , -0.25-0.25j,  0.  +0.j  , -0.25+0.25j,  0.5 +0.j  ,
    -0.25-0.25j,  0.  +0.j  , -0.25+0.25j])


.. details::
    :title: Usage Details

    **Order**

    The order of approximation must be a whole number less than :math:`n-1`
    where :math:`n` is the number of wires the operation is being applied on.
    This creates four cases for different ``order`` values:

    * ``order`` :math:`< 0`
        This will raise a ``ValueError``

    * ``order`` :math:`= 0`
        This will warn the user that only a Hadamard transform is being applied.

        .. code-block:: python

            @qp.qnode(qp.device('default.qubit'))
            def circ():
                qp.AQFT(order=0, wires=range(6))
                return qp.probs()

        The resulting circuit is:

        >>> print(qp.draw(circ, level='device')()) # doctest: +SKIP
        UserWarning: order=0, applying Hadamard transform warnings.warn("order=0, applying Hadamard transform")
        0: ──H─╭SWAP─────────────┤ ╭Probs
        1: ──H─│─────╭SWAP───────┤ ├Probs
        2: ──H─│─────│─────╭SWAP─┤ ├Probs
        3: ──H─│─────│─────╰SWAP─┤ ├Probs
        4: ──H─│─────╰SWAP───────┤ ├Probs
        5: ──H─╰SWAP─────────────┤ ╰Probs

    * :math:`0 <` ``order`` :math:`< n-1`
        This is the intended AQFT use case.

        .. code-block:: python

            @qp.qnode(qp.device('default.qubit'))
            def circ():
                qp.AQFT(order=2, wires=range(4))
                return qp.probs()

        The resulting circuit is:

        >>> print(qp.draw(circ, level='device')())
        0: ──H─╭Rϕ(1.57)─╭Rϕ(0.79)────────────────────────────────────────╭SWAP───────┤  Probs
        1: ────╰●────────│──────────H─╭Rϕ(1.57)─╭Rϕ(0.79)─────────────────│─────╭SWAP─┤  Probs
        2: ──────────────╰●───────────╰●────────│──────────H─╭Rϕ(1.57)────│─────╰SWAP─┤  Probs
        3: ─────────────────────────────────────╰●───────────╰●─────────H─╰SWAP───────┤  Probs

    * ``order`` :math:`\geq n-1`
        Using the QFT class is recommended in this case. The AQFT operation here is
        equivalent to QFT.

### `compute_decomposition`

```python
def compute_decomposition(wires, order)
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.AQFT.decomposition`.

Args:
    wires (Iterable, Wires): wires that the operator acts on
    order (int): order of approximation

Returns:
    list[Operator]: decomposition of the operator

**Example:**

>>> qp.AQFT.compute_decomposition((0, 1, 2), order=1)
[H(0), ControlledPhaseShift(1.57..., wires=Wires([1, 0])), H(1), ControlledPhaseShift(1.57..., wires=Wires([2, 1])), H(2), SWAP(wires=[0, 2])]
