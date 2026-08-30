---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/functions/dot.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/functions/dot.py
license: Apache-2.0
---

## Module `pennylane/ops/functions/dot.py`

This file contains the definition of the dot function, which computes the dot product between
a vector and a list of operators.

## `dot`

```python
def dot(coeffs: Sequence[float | Callable], ops: Sequence[Operator | PauliWord | PauliSentence], pauli=False, grouping_type=None, method='lf') -> Operator | ParametrizedHamiltonian | PauliSentence
```

Returns the dot product between the ``coeffs`` vector and the ``ops`` list of operators.

This function returns the following linear combination: :math:`\sum_{k} c_k O_k`, where
:math:`c_k` and :math:`O_k` are the elements inside the ``coeffs`` and ``ops`` arguments, respectively.

Args:
    coeffs (Sequence[float, Callable]): sequence containing the coefficients of the linear combination
    ops (Sequence[Operator, PauliWord, PauliSentence]): sequence containing the operators of the linear combination.
       Can also be ``PauliWord`` or ``PauliSentence`` instances.
    pauli (bool, optional): If ``True``, a :class:`~.PauliSentence`
        operator is used to represent the linear combination. If False, a :class:`Sum` operator
        is returned. Defaults to ``False``. Note that when ``ops`` consists solely of ``PauliWord``
        and ``PauliSentence`` instances, the function still returns a PennyLane operator when ``pauli=False``.
    grouping_type (str): The type of binary relation between Pauli words used to compute
        the grouping. Can be ``'qwc'``, ``'commuting'``, or ``'anticommuting'``. Note that if
        ``pauli=True``, the grouping will be ignored.
    method (str): The graph colouring heuristic to use in solving minimum clique cover for
        grouping, which can be ``'lf'`` (Largest First), ``'rlf'`` (Recursive Largest First),
        ``'dsatur'`` (Degree of Saturation), or ``'gis'`` (Greedy Independent Set).
        This keyword argument is ignored if ``grouping_type`` is ``None``. Defaults to ``'lf'`` if no method is provided.

Raises:
    ValueError: if the number of coefficients and operators does not match or if they are empty

Returns:
    Operator or ParametrizedHamiltonian: operator describing the linear combination

.. note::

    If grouping is requested, the computed groupings are stored as a list of list of indices
    in ``Sum.grouping_indices``. The indices refer to the operators and coefficients returned
    by ``Sum.terms()``, not ``Sum.operands``, as these are not guaranteed to be equivalent.

**Example**

>>> coeffs = np.array([1.1, 2.2])
>>> ops = [qp.X(0), qp.Y(0)]
>>> qp.dot(coeffs, ops)
1.1 * X(0) + 2.2 * Y(0)
>>> qp.dot(coeffs, ops, pauli=True)
1.1 * X(0)
+ 2.2 * Y(0)

Note that additions of the same operator are not executed by default.

>>> qp.dot([1., 1.], [qp.X(0), qp.X(0)])
X(0) + X(0)

You can obtain a cleaner version by simplifying the resulting expression.

>>> qp.dot([1., 1.], [qp.X(0), qp.X(0)]).simplify()
2.0 * X(0)

``pauli=True`` can be used to construct a more efficient, simplified version of the operator.
Note that it returns a :class:`~.PauliSentence`, which is not an :class:`~.Operator`. This
specialized representation can be converted to an operator:

>>> qp.dot([1, 2], [qp.X(0), qp.X(0)], pauli=True).operation()
3.0 * X(0)

Using ``pauli=True`` and then converting the result to an :class:`~.Operator` is much faster
than using ``pauli=False``, but it only works for pauli words
(see :func:`~.is_pauli_word`).

If any of the parameters listed in ``coeffs`` are callables, the resulting dot product will be a
:class:`~.ParametrizedHamiltonian`:

>>> coeffs = [lambda p, t: p * jnp.sin(t) for _ in range(2)]
>>> ops = [qp.X(0), qp.Y(0)]
>>> qp.dot(coeffs, ops)
(
    <lambda>(params_0, t) * X(0)
  + <lambda>(params_1, t) * Y(0)
)

.. details::
    :title: Grouping

    Grouping information can be collected during construction using the ``grouping_type`` and ``method``
    keyword arguments. For example:

    .. code-block:: python

        import pennylane as qp

        a = qp.X(0)
        b = qp.prod(qp.X(0), qp.X(1))
        c = qp.Z(0)
        obs = [a, b, c]
        coeffs = [1.0, 2.0, 3.0]

        op = qp.dot(coeffs, obs, grouping_type="qwc")

    >>> op.grouping_indices
    ((0, 1), (2,))

    ``grouping_type`` can be ``"qwc"`` (qubit-wise commuting), ``"commuting"``, or ``"anticommuting"``, and
    ``method`` can be ``'lf'`` (Largest First), ``'rlf'`` (Recursive Largest First),
    ``'dsatur'`` (Degree of Saturation), or ``'gis'`` (Greedy Independent Set).
    To see more details about how these affect grouping, see :ref:`Pauli Graph Colouring<graph_colouring>` and
    :func:`~pennylane.pauli.compute_partition_indices`.
