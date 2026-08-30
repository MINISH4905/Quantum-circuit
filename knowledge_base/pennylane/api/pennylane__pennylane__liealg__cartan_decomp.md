---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/liealg/cartan_decomp.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/liealg/cartan_decomp.py
license: Apache-2.0
---

## Module `pennylane/liealg/cartan_decomp.py`

Functionality for Cartan decomposition

## `cartan_decomp`

```python
def cartan_decomp(g: list[PauliSentence | Operator], involution: callable) -> tuple[list[PauliSentence | Operator], list[PauliSentence | Operator]]
```

Compute the Cartan Decomposition :math:`\mathfrak{g} = \mathfrak{k} \oplus \mathfrak{m}` of a Lie algebra :math:`\mathfrak{g}`.

Given a Lie algebra :math:`\mathfrak{g}`, the Cartan decomposition is a decomposition
:math:`\mathfrak{g} = \mathfrak{k} \oplus \mathfrak{m}` into orthogonal complements.
This is realized by an involution :math:`\Theta(g)` that maps each operator :math:`g \in \mathfrak{g}`
back to itself after two consecutive applications, i.e., :math:`\Theta(\Theta(g)) = g \ \forall g \in \mathfrak{g}`.

The ``involution`` argument can be any function that maps the operators in the provided ``g`` to a boolean output.
``True`` for operators that go into :math:`\mathfrak{k}` and ``False`` for operators in :math:`\mathfrak{m}`.
It is assumed that all operators in the input ``g`` belong to either :math:`\mathfrak{k}` or
:math:`\mathfrak{m}`.

The resulting subspaces fulfill the Cartan commutation relations

.. math:: [\mathfrak{k}, \mathfrak{k}] \subseteq \mathfrak{k} \text{ ; } [\mathfrak{k}, \mathfrak{m}] \subseteq \mathfrak{m} \text{ ; } [\mathfrak{m}, \mathfrak{m}] \subseteq \mathfrak{k}

Args:
    g (List[Union[PauliSentence, Operator]]): the (dynamical) Lie algebra to decompose.
    involution (callable): Involution function :math:`\Theta(\cdot)` to act on the input operator, should return ``0/1`` or ``False/True``.
        E.g., :func:`~even_odd_involution` or :func:`~concurrence_involution`.

Returns:
    Tuple(List[Union[PauliSentence, Operator]], List[Union[PauliSentence, Operator]]): Tuple ``(k, m)`` containing the even
    parity subspace :math:`\Theta(\mathfrak{k}) = \mathfrak{k}` and the odd
    parity subspace :math:`\Theta(\mathfrak{m}) = -\mathfrak{m}`.

.. seealso:: :func:`~even_odd_involution`, :func:`~concurrence_involution`, :func:`~check_cartan_decomp`

**Example**

We first construct a Lie algebra.

>>> from pennylane import X, Z
>>> from pennylane.liealg import concurrence_involution, even_odd_involution, cartan_decomp
>>> generators = [X(0) @ X(1), Z(0), Z(1)]
>>> g = qp.lie_closure(generators)
>>> g
[X(0) @ X(1), Z(0), Z(1), -1.0 * (Y(0) @ X(1)), -1.0 * (X(0) @ Y(1)), Y(0) @ Y(1)]

We compute the Cartan decomposition with respect to the :func:`~concurrence_involution`.

>>> k, m = cartan_decomp(g, concurrence_involution)
>>> k, m
([-1.0 * (Y(0) @ X(1)), -1.0 * (X(0) @ Y(1))], [X(0) @ X(1), Z(0), Z(1), Y(0) @ Y(1)])

We can check the validity of the decomposition using :func:`~check_cartan_decomp`.

>>> check_cartan_decomp(k, m)
True

There are other Cartan decomposition induced by other involutions. For example using :func:`~even_odd_involution`.

>>> from pennylane.liealg import check_cartan_decomp
>>> k, m = cartan_decomp(g, even_odd_involution)
>>> k, m
 ([Z(0), Z(1)], [X(0) @ X(1), -1.0 * (Y(0) @ X(1)), -1.0 * (X(0) @ Y(1)), Y(0) @ Y(1)])
>>> check_cartan_decomp(k, m)
True

## `check_commutation_relation`

```python
def check_commutation_relation(ops1: list[PauliSentence | TensorLike], ops2: list[PauliSentence | TensorLike], vspace: PauliVSpace | list[PauliSentence | TensorLike])
```

Helper function to check :math:`[\text{ops1}, \text{ops2}] \subseteq \text{vspace}`.

.. warning:: This function is expensive to compute.

Args:
    ops1 (List[Union[PauliSentence, TensorLike]]): First set of operators.
    ops2 (List[Union[PauliSentence, TensorLike]]): Second set of operators.
    vspace (Union[PauliVSpace, List[Union[PauliSentence, TensorLike]]]): The vector space in form of a :class:`~PauliVSpace` that the operators should map to.

Returns:
    bool: Whether or not :math:`[\text{ops1}, \text{ops2}] \subseteq \text{vspace}`.

**Example**

>>> from pennylane.liealg import check_commutation_relation
>>> ops1 = [qp.X(0)]
>>> ops2 = [qp.Y(0)]
>>> vspace1 = [qp.X(0), qp.Y(0)]

Because :math:`[X_0, Y_0] = 2i Z_0`, the commutators do not map to the selected vector space.

>>> check_commutation_relation(ops1, ops2, vspace1)
False

Instead, we need the full :math:`\mathfrak{su}(2)` space.

>>> vspace2 = [qp.X(0), qp.Y(0), qp.Z(0)]
>>> check_commutation_relation(ops1, ops2, vspace2)
True

## `check_cartan_decomp`

```python
def check_cartan_decomp(k: list[PauliSentence | TensorLike], m: list[PauliSentence | TensorLike], verbose=True)
```

Helper function to check the validity of a Cartan decomposition :math:`\mathfrak{g} = \mathfrak{k} \oplus \mathfrak{m}.`

Check whether of not the following properties are fulfilled.

.. math::

        [\mathfrak{k}, \mathfrak{k}] \subseteq \mathfrak{k} & \text{ (subalgebra)}\\
        [\mathfrak{k}, \mathfrak{m}] \subseteq \mathfrak{m} & \text{ (reductive property)}\\
        [\mathfrak{m}, \mathfrak{m}] \subseteq \mathfrak{k} & \text{ (symmetric property)}

.. warning:: This function is expensive to compute

Args:
    k (List[Union[PauliSentence, TensorLike]]): List of operators of the vertical subspace.
    m (List[Union[PauliSentence, TensorLike]]): List of operators of the horizontal subspace.
    verbose: Whether failures to meet one of the criteria should be printed.

Returns:
    bool: Whether or not all of the Cartan commutation relations are fulfilled.

.. seealso:: :func:`~cartan_decomp`

**Example**

We first construct a Lie algebra.

>>> from pennylane import X, Z
>>> from pennylane.liealg import concurrence_involution, even_odd_involution, cartan_decomp
>>> generators = [X(0) @ X(1), Z(0), Z(1)]
>>> g = qp.lie_closure(generators)
>>> g
[X(0) @ X(1), Z(0), Z(1), -1.0 * (Y(0) @ X(1)), -1.0 * (X(0) @ Y(1)), Y(0) @ Y(1)]

We compute the Cartan decomposition with respect to the :func:`~concurrence_involution`.

>>> k, m = cartan_decomp(g, concurrence_involution)
>>> k, m
([-1.0 * (Y(0) @ X(1)), -1.0 * (X(0) @ Y(1))], [X(0) @ X(1), Z(0), Z(1), Y(0) @ Y(1)])

We can check the validity of the decomposition using ``check_cartan_decomp``.

>>> from pennylane.liealg import check_cartan_decomp
>>> check_cartan_decomp(k, m)
True
