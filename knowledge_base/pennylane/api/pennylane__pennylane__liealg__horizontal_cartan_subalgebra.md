---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/liealg/horizontal_cartan_subalgebra.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/liealg/horizontal_cartan_subalgebra.py
license: Apache-2.0
---

## Module `pennylane/liealg/horizontal_cartan_subalgebra.py`

Functionality to compute the Cartan subalgebra

## `horizontal_cartan_subalgebra`

```python
def horizontal_cartan_subalgebra(k, m, adj=None, start_idx=0, tol=1e-10, verbose=0, return_adjvec=False, is_orthogonal=True)
```

Compute a Cartan subalgebra (CSA) :math:`\mathfrak{a} \subseteq \mathfrak{m}`.

A non-unique CSA is a maximal Abelian subalgebra in the horizontal subspace :math:`\mathfrak{m}` of a Cartan decomposition.
Note that this is sometimes called a horizontal CSA, and is different from the `other definitions of a CSA <https://en.wikipedia.org/wiki/Cartan_subalgebra>`__.

The final decomposition yields

.. math:: \mathfrak{g} = \mathfrak{k} \oplus (\tilde{\mathfrak{m}} \oplus \mathfrak{a}),

where :math:`\mathfrak{a})` is the CSA and :math:`\tilde{\mathfrak{m}}` is the remainder of the horizontal subspace :math:`\mathfrak{m}`.

.. seealso::
    :func:`~cartan_decomp`,
    :func:`~structure_constants`,
    :doc:`The KAK decomposition in theory (demo) <demo:demos/tutorial_kak_decomposition>`,
    :doc:`The KAK decomposition in practice (demo) <demo:demos/tutorial_fixed_depth_hamiltonian_simulation_via_cartan_decomposition>`.

Args:
    k (List[Union[PauliSentence, TensorLike]]): Vertical space :math:`\mathfrak{k}` from Cartan decomposition :math:`\mathfrak{g} = \mathfrak{k} \oplus \mathfrak{m}`.
    m (List[Union[PauliSentence, TensorLike]]): Horizontal space :math:`\mathfrak{m}` from Cartan decomposition :math:`\mathfrak{g} = \mathfrak{k} \oplus \mathfrak{m}`.
    adj (Array): The :math:`|\mathfrak{g}| \times |\mathfrak{g}| \times |\mathfrak{g}|` dimensional adjoint representation of :math:`\mathfrak{g}`.
        When ``None`` is provided, :func:`~structure_constants` is used internally by default to compute the adjoint representation.
    start_idx (bool): Indicates from which element in ``m`` the CSA computation starts.
    tol (float): Numerical tolerance for linear independence check.
    verbose (bool): Whether or not to output progress during computation.
    return_adjvec (bool): Determine the output format. If ``False``, returns operators in their original
        input format (matrices or :class:`~.PauliSentence`). If ``True``, returns the spaces as adjoint representation vectors (see :func:`~op_to_adjvec` and :func:`~adjvec_to_op`).
    is_orthogonal (bool): Whether the basis elements are all orthogonal, both within
        and between ``g``, ``k`` and ``m``.

Returns:
    Tuple(TensorLike, TensorLike, TensorLike, TensorLike, TensorLike): A tuple of adjoint vector representations
    ``(newg, k, mtilde, a, new_adj)``, corresponding to
    :math:`\mathfrak{g}`, :math:`\mathfrak{k}`, :math:`\tilde{\mathfrak{m}}`, :math:`\mathfrak{a}` and the new adjoint representation.
    The dimensions are ``(|g|, |g|)``, ``(|k|, |g|)``, ``(|mtilde|, |g|)``, ``(|a|, |g|)`` and ``(|g|, |g|, |g|)``, respectively.

**Example**

A quick example computing a Cartan subalgebra of :math:`\mathfrak{su}(4)` using the Cartan involution :func:`~even_odd_involution`.

>>> g = list(qp.pauli.pauli_group(2)) # u(4)
>>> g = g[1:] # remove identity -> su(4)
>>> g = [op.pauli_rep for op in g] # optional; turn to PauliSentence for convenience
>>> k, m = qp.liealg.cartan_decomp(g, qp.liealg.even_odd_involution)
>>> g = k + m # re-order g to separate k and m
>>> newg, k, mtilde, a, new_adj = qp.liealg.horizontal_cartan_subalgebra(k, m)
>>> newg == k + mtilde + a
True
>>> a # doctest: +SKIP
[-1.0 * Z(0) @ Z(1), -1.0 * Y(0) @ Y(1), 1.0 * X(0) @ X(1)]

We can confirm that these all commute with each other, as the CSA is Abelian (i.e., all operators commute).

>>> qp.liealg.check_abelian(a)
True

We can opt-in to return what we call adjoint vectors of dimension :math:`|\mathfrak{g}|`, where each component corresponds to an entry in (the ordered) ``g``.
The adjoint vectors for the Cartan subalgebra are in ``np_a``.

.. code-block:: python

    from pennylane.liealg import horizontal_cartan_subalgebra
    np_newg, np_k, np_mtilde, np_a, new_adj = horizontal_cartan_subalgebra(k, m, return_adjvec=True)

We can reconstruct an operator by computing :math:`\hat{O}_v = \sum_i v_i g_i` for an adjoint vector :math:`v` and :math:`g_i \in \mathfrak{g}`.

>>> v = np_a[0]
>>> op = sum(v_i * g_i for v_i, g_i in zip(v, g))
>>> op.simplify()
>>> op
-1.0 * Z(0) @ Z(1)

For convenience, we provide a helper function :func:`~adjvec_to_op` for conversion of the returned collections of adjoint vectors.

>>> a = qp.liealg.adjvec_to_op(np_a, g)
>>> a # doctest: +SKIP
[-1.0 * Z(0) @ Z(1), -1.0 * Y(0) @ Y(1), 1.0 * X(0) @ X(1)]

.. details::
    :title: Usage Details

    Let us walk through an example of computing the Cartan subalgebra. The basis for computing
    the Cartan subalgebra is having the Lie algebra :math:`\mathfrak{g}`, a Cartan decomposition
    :math:`\mathfrak{g} = \mathfrak{k} \oplus \mathfrak{m}` and its adjoint representation.

    We start by computing these ingredients using :func:`~cartan_decomp` and :func:`~structure_constants`.
    As an example, we take the Lie algebra of the Heisenberg model with generators :math:`\{X_i X_{i+1}, Y_i Y_{i+1}, Z_i Z_{i+1}\}`.

    >>> from pennylane.liealg import cartan_decomp
    >>> from pennylane import X, Y, Z
    >>> n = 3
    >>> gens = [X(i) @ X(i+1) for i in range(n-1)]
    >>> gens += [Y(i) @ Y(i+1) for i in range(n-1)]
    >>> gens += [Z(i) @ Z(i+1) for i in range(n-1)]
    >>> g = qp.lie_closure(gens, matrix=True)

    Taking the Heisenberg Lie algebra, we can perform the Cartan decomposition. We take the :func:`~even_odd_involution` as a valid Cartan involution.
    The resulting vertical and horizontal subspaces :math:`\mathfrak{k}` and :math:`\mathfrak{m}` need to fulfill the commutation relations
    :math:`[\mathfrak{k}, \mathfrak{k}] \subseteq \mathfrak{k}`, :math:`[\mathfrak{k}, \mathfrak{m}] \subseteq \mathfrak{m}` and :math:`[\mathfrak{m}, \mathfrak{m}] \subseteq \mathfrak{k}`,
    which we can check using the helper function :func:`~check_cartan_decomp`.

    >>> from pennylane.liealg import even_odd_involution, check_cartan_decomp
    >>> k, m = cartan_decomp(g, even_odd_involution)
    >>> check_cartan_decomp(k, m) # check commutation relations of Cartan decomposition
    True

    Our life is easier when we use a canonical ordering of the operators. This is why we re-define ``g`` with the new ordering in terms of operators in ``k`` first, and then
    all remaining operators from ``m``.

    >>> g = np.vstack([k, m]) # re-order g to separate k and m operators
    >>> adj = qp.structure_constants(g, matrix=True) # compute adjoint representation of g

    Finally, we can compute a Cartan subalgebra :math:`\mathfrak{a}`, a maximal Abelian subalgebra of :math:`\mathfrak{m}`.

    >>> newg, k, mtilde, a, new_adj = horizontal_cartan_subalgebra(k, m, adj, start_idx=3)

    The new DLA ``newg`` is just the concatenation of ``k``, ``mtilde``, ``a``. Each component is returned in the original input format.
    Here we obtain collections of :math:`8\times 8` matrices (``numpy`` arrays), as this is what we started from.

    >>> newg.shape, k.shape, mtilde.shape, a.shape, new_adj.shape
    ((15, 8, 8), (6, 8, 8), (6, 8, 8), (3, 8, 8), (15, 15, 15))

    We can also let the function return what we call adjoint representation vectors.

    >>> kwargs = {"start_idx": 3, "return_adjvec": True}
    >>> np_newg, np_k, np_mtilde, np_a, new_adj = horizontal_cartan_subalgebra(k, m, adj, **kwargs)
    >>> np_newg.shape, np_k.shape, np_mtilde.shape, np_a.shape, new_adj.shape
    ((15, 15), (6, 15), (6, 15), (3, 15), (15, 15, 15))

    These are dense vector representations of dimension :math:`|\mathfrak{g}|`, in which each entry corresponds to the respective operator in :math:`\mathfrak{g}`.
    Given an adjoint representation vector :math:`v`, we can reconstruct the respective operator by simply computing :math:`\hat{O}_v = \sum_i v_i g_i`, where
    :math:`g_i \in \mathfrak{g}` (hence the need for a canonical ordering).

    We provide a convenience function :func:`~adjvec_to_op` that works with both ``g`` represented as dense matrices or PL operators.
    Because we used dense matrices in this example, we transform the operators back to PennyLane operators using :func:`~pauli_decompose`.

    >>> from pennylane.liealg import adjvec_to_op
    >>> a = adjvec_to_op(np_a, g)
    >>> h_op = [qp.pauli_decompose(op).pauli_rep for op in a]
    >>> h_op # doctest: +SKIP
    [-1.0 * Y(1) @ Y(2), -1.0 * Z(1) @ Z(2), 1.0 * X(1) @ X(2)]

    In that case we chose a Cartan subalgebra from which we can readily see that it is commuting, but we also provide a small helper function to check that.

    >>> from pennylane.liealg import check_abelian
    >>> check_abelian(h_op)
    True

    Last but not least, the adjoint representation ``new_adj`` is updated to represent the new basis and its ordering of ``g``.

## `adjvec_to_op`

```python
def adjvec_to_op(adj_vecs, basis, is_orthogonal=True)
```

Transform adjoint vector representations back into operator format.

This function simply reconstructs :math:`\hat{O} = \sum_j c_j \hat{b}_j` given the adjoint vector
representation :math:`c_j` and basis :math:`\hat{b}_j`.

.. seealso:: :func:`~op_to_adjvec`

Args:
    adj_vecs (TensorLike): collection of vectors with shape ``(batch, len(basis))``
    basis (List[Union[PauliSentence, Operator, TensorLike]]): collection of basis operators
    is_orthogonal (bool): Whether the ``basis`` consists of orthogonal elements.

Returns:
    list: collection of operators corresponding to the input vectors read in the input basis.
    The operators are in the format specified by the elements in ``basis``.

**Example**

>>> from pennylane.liealg import adjvec_to_op
>>> c = np.array([[0.5, 0.3, 0.7]])
>>> basis = [qp.X(0), qp.Y(0), qp.Z(0)]
>>> adjvec_to_op(c, basis)
[0.5 * X(0) + 0.3 * Y(0) + 0.7 * Z(0)]

## `op_to_adjvec`

```python
def op_to_adjvec(ops: Iterable[PauliSentence | Operator | TensorLike], basis: PauliSentence | Operator | TensorLike, is_orthogonal: bool=True)
```

Decompose a batch of operators into a given operator basis.

The adjoint vector representation is provided by the coefficients :math:`c_j` in a given operator
basis of the operator :math:`\hat{b}_j` such that the input operator can be written as
:math:`\hat{O} = \sum_j c_j \hat{b}_j`.

.. seealso:: :func:`~adjvec_to_op`

Args:
    ops (Iterable[Union[PauliSentence, Operator, TensorLike]]): List of operators to decompose.
    basis (Iterable[Union[PauliSentence, Operator, TensorLike]]): Operator basis.
    is_orthogonal (bool): Whether the basis is orthogonal with respect to the trace inner
        product. Defaults to ``True``, which allows to skip some computations.

Returns:
    TensorLike: The batch of coefficient vectors of the operators' ``ops`` expressed in
    ``basis``. The shape is ``(len(ops), len(basis)``.

The format of the resulting operators is determined by the ``type`` in ``basis``.
If ``is_orthogonal=True`` (the default), only normalization is taken into account
in the projection. For ``is_orthogonal=False``, orthogonalization also is considered.

**Example**

The basis can be numerical or operators.

>>> from pennylane.liealg import op_to_adjvec
>>> op = qp.X(0) + 0.5 * qp.Y(0)
>>> basis = [qp.X(0), qp.Y(0), qp.Z(0)]
>>> op_to_adjvec([op], basis)
array([[1. , 0.5, 0. ]])
>>> op_to_adjvec([op], [op.matrix() for op in basis])
array([[1. , 0.5, 0. ]])

Note how the function always expects an ``Iterable`` of operators as input.

The ``ops`` can also be numerical, but then ``basis`` has to be numerical as well.

>>> op = op.matrix()
>>> op_to_adjvec([op], [op.matrix() for op in basis])
array([[1. , 0.5, 0. ]])

## `change_basis_ad_rep`

```python
def change_basis_ad_rep(adj: TensorLike, basis_change: TensorLike)
```

Apply a ``basis_change`` between bases of operators to the adjoint representation ``adj``.

Assume the adjoint repesentation is given in terms of a basis :math:`\{b_j\}`,
:math:`\text{ad}^\mu_{\alpha \beta} \propto \text{tr}\left(b_\mu \cdot [b_\alpha, b_\beta] \right)`.
We can represent the adjoint representation in terms of a new basis :math:`c_i = \sum_j T_{ij} b_j`
with the basis transformation matrix :math:`T` using ``change_basis_ad_rep``.

Args:
    adj (TensorLike): Adjoint representation in old basis.
    basis_change (TensorLike): Basis change matrix from old to new basis.

Returns:
    TensorLike: Adjoint representation in new basis.

.. seealso: :func:`~liealg.structure_constants`

**Example**

We choose a basis of a Lie algebra, compute its adjoint representation.

>>> from pennylane.liealg import change_basis_ad_rep
>>> basis = [qp.X(0), qp.Y(0), qp.Z(0)]
>>> adj = qp.structure_constants(basis)

Now we change the basis and re-compute the adjoint representation in that new basis.

>>> basis_change = np.array([[1., 1., 0.], [0., 1., 1.], [0., 1., 1.]])
>>> new_ops = [qp.sum(*[basis_change[i,j] * basis[j] for j in range(3)]) for i in range(3)]
>>> new_adj = qp.structure_constants(new_ops)

We confirm that instead of re-computing the adjoint representation (typically expensive), we can
transform the old adjoint representation with the change of basis matrix.

>>> new_adj_re = change_basis_ad_rep(adj, basis_change)
>>> np.allclose(new_adj, new_adj_re)
True

## `check_abelian`

```python
def check_abelian(ops: list[PauliSentence | TensorLike | Operator])
```

Helper function to check if all operators in ``ops`` commute, i.e., form an Abelian set of operators.

.. warning:: This function is expensive to compute

Args:
    ops (List[Union[PauliSentence, TensorLike, Operator]]): List of operators to check for mutual commutation

Returns:
    bool: Whether or not all operators commute with each other

**Example**

>>> from pennylane.liealg import check_abelian
>>> from pennylane import X
>>> ops = [X(i) for i in range(10)]
>>> check_abelian(ops)
True

Operators on different wires (trivially) commute with each other.
