---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/hilbert_schmidt.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/hilbert_schmidt.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/hilbert_schmidt.py`

This submodule contains the templates for the Hilbert-Schmidt tests.

## `HilbertSchmidt`

```python
class HilbertSchmidt(Operation)
```

Create a Hilbert-Schmidt template that can be used to compute the Hilbert-Schmidt Test (HST).

The HST is a useful quantity to compile a target unitary `U` with an approximate unitary `V`. The HST
is used as a distance between `U` and `V`. The result of executing the HST is 0 if and only if `V` is equal to
`U` (up to a global phase). As suggested in [1], we can define a cost function using the Hilbert-Schmidt inner product
between the unitaries `U` and `V` as follows:

.. math::
    C_{HST} = 1 - \frac{1}{d^2} \left|Tr(V^{\dagger}U)\right|^2,

where `d` is the dimension of the space in which the unitaries `U` and `V` act.
The quantity :math:`\frac{1}{d^2} \left|Tr(V^{\dagger}U)\right|^2` is obtained by executing the Hilbert-Schmidt Test.

It is equivalent to taking the outcome probability of the state :math:`|0 ... 0\rangle`
for the following circuit:

.. figure:: ../../_static/templates/subroutines/hst.png
    :align: center
    :width: 80%
    :target: javascript:void(0);

It defines our decomposition for the Hilbert-Schmidt Test template.

Args:
    V (Operator or Iterable[Operator]): The operators that represent the unitary `V`.
    U (Operator or Iterable[Operator]): The operators that represent the unitary `U`.
    id (str or None): Optional identifier for the operation.

Raises:
    ValueError: ``V`` is not an Operator or an iterable of Operators.
    ValueError: ``U`` is not an Operator or an iterable of Operators.
    ValueError: ``U`` and ``V`` do not have the same number of wires.
    ValueError: Operators in ``U`` must act on distinct wires from those in ``v_wires``.

**Reference**

[1] Sumeet Khatri, Ryan LaRose, Alexander Poremba, Lukasz Cincio, Andrew T. Sornborger and Patrick J. Coles
Quantum-assisted Quantum Compiling.
`arxiv/1807.00800 <https://arxiv.org/pdf/1807.00800.pdf>`_

.. seealso:: :class:`~.LocalHilbertSchmidt`

.. details::
    :title: Usage Details

    Consider that we want to evaluate the Hilbert-Schmidt Test cost between the unitary ``U`` and an approximate
    unitary ``V``. If the approximate unitary has fewer wires than the target unitary, a placeholder identity can be included.
    We need to define some functions where it is possible to use the :class:`~.HilbertSchmidt`
    template. In the example below, the considered unitary is ``Hadamard`` and we try to compute the cost for the approximate
    unitary ``RZ``. For an angle that is equal to ``0`` (``Identity``), we have the maximal cost, which is ``1``.

    .. code-block:: python

        U = qp.Hadamard(0)
        V = qp.RZ(0, wires=1)

        dev = qp.device("default.qubit", wires=2)

        @qp.qnode(dev)
        def hilbert_test(V, U):
            qp.HilbertSchmidt(V, U)
            return qp.probs()

        def cost_hst(V, U):
            return 1 - hilbert_test(V, U)[0]

    Now that the cost function has been defined it can be called as follows:

    >>> cost_hst(V, U)
    np.float64(1.0)

### `data`

```python
def data(self)
```

Flattened list of operator data in this HilbertSchmidt operation.

### `compute_decomposition`

```python
def compute_decomposition(*params: TensorLike, wires: int | Iterable[int | str] | Wires, U: Operator | Iterable[Operator], V: Operator | Iterable[Operator]) -> list[Operator]
```

Representation of the operator as a product of other operators.

## `LocalHilbertSchmidt`

```python
class LocalHilbertSchmidt(HilbertSchmidt)
```

Create a Local Hilbert-Schmidt template that can be used to compute the Local Hilbert-Schmidt Test (LHST).

The result of the LHST is a useful quantity for compiling a unitary `U` with an approximate unitary `V`. The
LHST is used as a distance between `U` and `V`. It is similar to the Hilbert-Schmidt test, but the measurement is
made only on one qubit at the end of the circuit. The LHST cost is always smaller than the HST cost and is useful
for large unitaries.

.. figure:: ../../_static/templates/subroutines/lhst.png
    :align: center
    :width: 80%
    :target: javascript:void(0);

Args:
    V (Operator or Iterable[Operator]): The operators that represent the approximate compiled unitary `V`.
    U (Operator or Iterable[Operator]): The operators that represent the unitary `U`.
    id (str or None): Optional identifier for the operation.

Raises:
    ValueError: ``V`` is not an Operator or an iterable of Operators.
    ValueError: ``U`` is not an Operator or an iterable of Operators.
    ValueError: ``U`` and ``V`` do not have the same number of wires.
    ValueError: Operators in ``U`` must act on distinct wires from those in ``v_wires``.

**Reference**

[1] Sumeet Khatri, Ryan LaRose, Alexander Poremba, Lukasz Cincio, Andrew T. Sornborger and Patrick J. Coles
Quantum-assisted Quantum Compiling.
`arxiv/1807.00800 <https://arxiv.org/pdf/1807.00800.pdf>`_

.. seealso:: :class:`~.HilbertSchmidt`

.. details::
    :title: Usage Details

    Consider that we want to evaluate the Local Hilbert-Schmidt Test cost between the unitary ``U`` and an
    approximate unitary ``V``. We need to define some functions where it is possible to use the
    :class:`~.LocalHilbertSchmidt` template. Here the considered unitary is ``CZ`` and we try to compute the
    cost for the approximate unitary.

    .. code-block:: python

        import numpy as np

        params = [3 * np.pi / 2, 3 * np.pi / 2, np.pi / 2]

        U = qp.CZ(wires=(0, 1))

        V = [qp.RZ(params[0], wires=2),
            qp.RZ(params[1], wires=3),
            qp.CNOT(wires=[2, 3]),
            qp.RZ(params[2], wires=3),
            qp.CNOT(wires=[2, 3])]

        dev = qp.device("default.qubit", wires=4)

        @qp.qnode(dev)
        def local_hilbert_test(V, U):
            qp.LocalHilbertSchmidt(V, U)
            return qp.probs()

        def cost_lhst(V, U):
            return 1 - local_hilbert_test(V, U)[0]

    Now that the cost function has been defined it can be called for specific parameters:

    >>> cost_lhst(V, U)
    np.float64(0.5...)

### `compute_decomposition`

```python
def compute_decomposition(*params: TensorLike, wires: int | Iterable[int | str] | Wires, U: Operator | Iterable[Operator], V: Operator | Iterable[Operator]) -> list[Operator]
```

Representation of the operator as a product of other operators (static method).
