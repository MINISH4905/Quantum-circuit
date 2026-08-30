---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/factorization.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/factorization.py
license: Apache-2.0
---

## Module `pennylane/qchem/factorization.py`

This module contains the functions needed for two-electron tensor factorization.

## `factorize`

```python
def factorize(two_electron, tol_factor=1e-05, tol_eigval=1e-05, cholesky=False, compressed=False, regularization=None, **compression_kwargs)
```

Return the double-factorized form of a two-electron integral tensor in spatial basis.

The two-electron tensor :math:`V`, in the
`chemist notation <http://vergil.chemistry.gatech.edu/notes/permsymm/permsymm.pdf>`_,
can be decomposed in terms of orthonormal matrices :math:`U` (leaf tensors) and
symmetric matrices :math:`Z` (core tensors) such that
:math:`V_{ijkl} \approx \sum_r^R \sum_{pq} U_{ip}^{(r)} U_{jp}^{(r)} Z_{pq}^{(r)} U_{kq}^{(r)} U_{lq}^{(r)}`,
where the rank :math:`R` is determined by a threshold error.

For explicit double factorization, i.e., when ``compressed=False``, the above decomposition
is done using an eigenvalue or Cholesky decomposition to obtain symmetric matrices
:math:`L^{(r)}` such that :math:`V_{ijkl} = \sum_r^R L_{ij}^{(r)} L_{kl}^{(r) T}`,
where core and leaf tensors are obtained by further diagonalizing each matrix :math:`L^{(r)}`
and truncating its eigenvalues (and the corresponding eigenvectors) at a threshold error.
See theory section for more details.

For compressed double factorization (CDF), i.e., when ``compressed=True``, the above
decomposition is done by optimizing the following cost function :math:`\mathcal{L}`
in a greedy layered-wise manner:

.. math::

   \mathcal{L}(U, Z) = \frac{1}{2} \bigg|V_{ijkl} - \sum_r^R \sum_{pq} U_{ip}^{(r)} U_{jp}^{(r)} Z_{pq}^{(r)} U_{kq}^{(r)} U_{lq}^{(r)}\bigg|_{\text{F}} + \rho \sum_r^R \sum_{pq} \bigg|Z_{pq}^{(r)}\bigg|^{\gamma},

where leaf tensors :math:`U` are defined by the antisymmetric orbital rotations :math:`X` such
that :math:`U^{(r)} = \exp{(X^{(r)})}`, :math:`|\cdot|_{\text{F}}` computes the Frobenius norm,
:math:`\rho` is a constant scaling factor, and :math:`|\cdot|^\gamma` specifies the optional L1
and L2 regularization. See references `arXiv:2104.08957 <https://arxiv.org/abs/2104.08957>`__
and `arxiv:2212.07957 <https://arxiv.org/pdf/2212.07957>`__ for more details.

.. note::

    Packages JAX and Optax are required when performing CDF with ``compressed=True``.
    Install them using ``pip install jax optax``.

Args:
    two_electron (array[array[float]]): Two-electron integral tensor in the molecular orbital
        basis arranged in chemist notation.
    tol_factor (float): Threshold error value for discarding the negligible factors.
        This will be used only when ``compressed=False``.
    tol_eigval (float): Threshold error value for discarding the negligible factor eigenvalues.
        This will be used only when ``compressed=False``.
    cholesky (bool): Use Cholesky decomposition for obtaining the symmetric matrices
        :math:`L^{(r)}` instead of eigendecomposition. Default is ``False``.
    compressed (bool): Use compressed double factorization to optimize the factors returned
        in the decomposition. Look at the keyword arguments (``compression_kwargs``) for
        the available options which must be provided only when ``compressed=True``.
    regularization (string | None): Type of regularization (``"L1"`` or ``"L2"``) to be
        used for optimizing the factors. Default is to not include any regularization term.

Keyword Args:
    num_factors (int): Maximum number of factors that should be optimized for compressed
        double factorization. Default is :math:`2\times N`, where `N` is the number of
        dimensions of two-electron tensor.
    num_steps (int): Maximum number of epochs for optimizing each factor. Default is ``1000``.
    optimizer (optax.optimizer): An optax optimizer instance. If not provided, `Adam
        <https://optax.readthedocs.io/en/latest/api/optimizers.html#optax.adam>`_ is
        used with ``0.001`` learning rate.
    init_params (dict[str, TensorLike] | None): Intial values of the orbital rotations
        (:math:`X`) and core tensors (:math:`Z`) of shape ``(num_factors, N, N)`` given as
        a dictionary with keys ``"X"`` and ``"Z"``, where `N` is the number of dimension of
        two-electron tensor. If not given, zero matrices will be used if ``cholesky=False``
        and the core and leaf tensors corresponding to the first ``num_factors`` will be
        used if ``cholesky=True``.
    norm_prefactor (float): Prefactor for scaling the regularization term. Default is ``1e-5``.

Returns:
    tuple(TensorLike, TensorLike, TensorLike): Tuple containing symmetric matrices (factors)
    approximating the two-electron integral tensor and core tensors and leaf tensors of
    the generated factors. In the explicit case where the core and leaf tensors could be
    truncated, they will be returned as a list.

Raises:
    ValueError: If the specified regularization type is not supported.
    ImportError: If the specified packages are not installed when ``compressed=True``.

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0],
...                      [1.398397361, 0.0, 0.0]], requires_grad=False)
>>> mol = qp.qchem.Molecule(symbols, geometry)
>>> core, one, two = qp.qchem.electron_integrals(mol)()
>>> two = np.swapaxes(two, 1, 3) # convert to chemist notation
>>> factors, cores, leaves = qp.qchem.factorize(two, 1e-5, 1e-5)
>>> print(factors)
[[[-1.06723440e-01  6.42958741e-15]
  [ 7.71977824e-15  1.04898533e-01]]
 [[ 1.71099288e-13 -4.25688222e-01]
  [-4.25688222e-01  2.31561666e-13]]
 [[-8.14472856e-01 -3.89054708e-13]
  [-3.88994463e-13 -8.28642140e-01]]]

.. details::
    :title: Theory

    The second quantized electronic Hamiltonian is constructed in terms of fermionic creation,
    :math:`a^{\dagger}` , and annihilation, :math:`a`, operators as
    [`arXiv:1902.02134 <https://arxiv.org/abs/1902.02134>`_]

    .. math::

        H = \sum_{\alpha \in \{\uparrow, \downarrow \} } \sum_{pq} h_{pq} a_{p,\alpha}^{\dagger}
        a_{q, \alpha} + \frac{1}{2} \sum_{\alpha, \beta \in \{\uparrow, \downarrow \} } \sum_{pqrs}
        h_{pqrs} a_{p, \alpha}^{\dagger} a_{q, \beta}^{\dagger} a_{r, \beta} a_{s, \alpha},

    where :math:`h_{pq}` and :math:`h_{pqrs}` are the one- and two-electron integrals computed
    as

    .. math::

        h_{pq} = \int \phi_p(r)^* \left ( -\frac{\nabla_r^2}{2} - \sum_i \frac{Z_i}{|r-R_i|} \right)
        \phi_q(r) dr,

    and

    .. math::

        h_{pqrs} = \int \frac{\phi_p(r_1)^* \phi_q(r_2)^* \phi_r(r_2) \phi_s(r_1)}{|r_1 - r_2|}
        dr_1 dr_2.

    The two-electron integrals can be rearranged in the so-called chemist notation which gives

    .. math::

        V_{pqrs} = \int \frac{\phi_p(r_1)^* \phi_q(r_1)^* \phi_r(r_2) \phi_s(r_2)}{|r_1 - r_2|}
        dr_1 dr_2,

    and the molecular Hamiltonian can be rewritten as

    .. math::

        H = \sum_{\alpha \in \{\uparrow, \downarrow \} } \sum_{pq} T_{pq} a_{p,\alpha}^{\dagger}
        a_{q, \alpha} + \frac{1}{2} \sum_{\alpha, \beta \in \{\uparrow, \downarrow \} } \sum_{pqrs}
        V_{pqrs} a_{p, \alpha}^{\dagger} a_{q, \alpha} a_{r, \beta}^{\dagger} a_{s, \beta},

    with

    .. math::

        T_{pq} = h_{pq} - \frac{1}{2} \sum_s h_{pssq}.


    This notation allows a low-rank factorization of the two-electron integral. The objective of
    the factorization is to find a set of symmetric matrices, :math:`L^{(r)}`, such that

    .. math::

           V_{ijkl} = \sum_r^R L_{ij}^{(r)} L_{kl}^{(r) T},

    with the rank :math:`R \leq n^2` where :math:`n` is the number of molecular orbitals.
    The matrices :math:`L^{(r)}` are diagonalized and for each matrix the eigenvalues that
    are smaller than a given threshold (and their corresponding eigenvectors) are discarded.
    These can be used to further decompose :math:`V_{ijkl}` in terms of orthonormal matrices
    :math:`U` (leaf tensors) and symmetric matrices :math:`Z` (core tensors), such that

    .. math::

        V_{ijkl} = \sum_r^R \sum_{pq} U_{ip}^{(r)} U_{jp}^{(r)} Z_{pq}^{(r)} U_{kq}^{(r)} U_{lq}^{(r)},

    where :math:`U^{(r)}` are the eigenvectors of :math:`L^{(r)}` and
    :math:`Z^{(r)}` are the outer product of the eigenvalues of :math:`L^{(r)}`.

    The factorization algorithm has the following steps
    [`arXiv:1902.02134 <https://arxiv.org/abs/1902.02134>`_]:

    - Reshape the :math:`n \times n \times n \times n` two-electron tensor to a
      :math:`n^2 \times n^2` matrix where :math:`n` is the number of orbitals.

    - Decompose the resulting matrix either via eigendecomposition or
      Cholesky decomposition.

    - For the eigendecomposition, keep the :math:`r` eigenvectors with
      corresponding eigenvalues larger than the threshold. Multiply these
      eigenvectors by the square root of the eigenvalues and reshape them
      to :math:`r \times n \times n` matrices to obtain :math:`L^{(r)}`.

    - Whereas for the Cholesky decomposition, keep the first :math:`r` Cholesky
      vectors that result in an residual error below the threshold and reshape
      them to :math:`r \times n \times n` matrices to obtain :math:`L^{(r)}`.

    - Diagonalize the :math:`L^{(r)}` (:math:`n \times n`) matrices and for
      each matrix keep the eigenvalues (and their corresponding eigenvectors)
      that are larger than a threshold.

    - Compute the orthonormal matrices :math:`U` and the symmetric matrices :math:`Z`
      from the retained eigenvalues and eigenvectors to get the core and leaf tensors.

## `basis_rotation`

```python
def basis_rotation(one_electron, two_electron, tol_factor=1e-05, **factorization_kwargs)
```

Return the grouped coefficients and observables of a molecular Hamiltonian and the basis
rotation unitaries obtained with the basis rotation grouping method.

Args:
    one_electron (array[float]): One-electron integral matrix in the molecular orbital basis.
    two_electron (array[array[float]]): Two-electron integral tensor in the molecular orbital
        basis arranged in chemist notation.
    tol_factor (float): Threshold error value for discarding the negligible factors.

Keyword Args:
    tol_eigval (float): Threshold error value for discarding the negligible factor
        eigenvalues. This can be used only when ``compressed=False``.
    cholesky (bool): Use Cholesky decomposition for the ``two_electron`` instead of
        eigendecomposition. Default is ``False``.
    compressed (bool): Use compressed double factorization for decomposing the ``two_electron``.
    regularization (string | None): Type of regularization (``"L1"`` or ``"L2"``) to be
        used for optimizing the factors. Default is to not include any regularization term.
    **compression_kwargs: Look at the keyword arguments (``compression_kwargs``) in the
        :func:`~.factorize` method for all the available options with ``compressed=True``.

Returns:
    tuple(list[array[float]], list[list[Operator]], list[array[float]]): Tuple containing
    grouped coefficients, grouped observables and basis rotation transformation matrices.

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0],
...                      [1.398397361, 0.0, 0.0]], requires_grad=False)
>>> mol = qp.qchem.Molecule(symbols, geometry)
>>> core, one, two = qp.qchem.electron_integrals(mol)()
>>> coeffs, ops, unitaries = basis_rotation(one, two, tol_factor=1.0e-5)
>>> print(coeffs)
[array([-2.59579282,  0.84064649,  0.84064649,  0.45724992,  0.45724992]),
 array([ 5.60006390e-03, -9.73801723e-05, -9.73801723e-05,  2.84747318e-03,
         9.57150297e-05, -2.79878310e-03,  9.57150297e-05, -2.79878310e-03,
        -2.79878310e-03, -2.79878310e-03,  2.75092558e-03]),
 array([ 0.09060523,  0.04530262, -0.04530262, -0.04530262, -0.04530262,
        -0.04530262,  0.04530262]),
 array([ 1.6874169 , -0.68077716, -0.68077716,  0.17166195, -0.66913628,
         0.16872663, -0.66913628,  0.16872663,  0.16872663,  0.16872663,
         0.16584151])]

.. details::
    :title: Theory

    A second-quantized molecular Hamiltonian can be constructed in the
    `chemist notation <http://vergil.chemistry.gatech.edu/notes/permsymm/permsymm.pdf>`_ format
    following Eq. (1) of
    [`PRX Quantum 2, 030305, 2021 <https://journals.aps.org/prxquantum/abstract/10.1103/PRXQuantum.2.030305>`_]
    as

    .. math::

        H = \sum_{\alpha \in \{\uparrow, \downarrow \} } \sum_{pq} T_{pq} a_{p,\alpha}^{\dagger}
        a_{q, \alpha} + \frac{1}{2} \sum_{\alpha, \beta \in \{\uparrow, \downarrow \} } \sum_{pqrs}
        V_{pqrs} a_{p, \alpha}^{\dagger} a_{q, \alpha} a_{r, \beta}^{\dagger} a_{s, \beta},

    where :math:`V_{pqrs}` denotes a two-electron integral in the chemist notation and
    :math:`T_{pq}` is obtained from the one- and two-electron integrals, :math:`h_{pq}` and
    :math:`h_{pqrs}`, as

    .. math::

        T_{pq} = h_{pq} - \frac{1}{2} \sum_s h_{pssq}.

    The tensor :math:`V` can be converted to a matrix which is indexed by the indices :math:`pq`
    and :math:`rs` and eigendecomposed up to a rank :math:`R` to give

    .. math::

        V_{pqrs} = \sum_r^R L_{pq}^{(r)} L_{rs}^{(r) T},

    where :math:`L` denotes the matrix of eigenvectors of the matrix :math:`V`. The molecular
    Hamiltonian can then be rewritten following Eq. (7) of
    [`Phys. Rev. Research 3, 033055, 2021 <https://journals.aps.org/prresearch/abstract/10.1103/PhysRevResearch.3.033055>`_]
    as

    .. math::

        H = \sum_{\alpha \in \{\uparrow, \downarrow \} } \sum_{pq} T_{pq} a_{p,\alpha}^{\dagger}
        a_{q, \alpha} + \frac{1}{2} \sum_r^R \left ( \sum_{\alpha \in \{\uparrow, \downarrow \} } \sum_{pq}
        L_{pq}^{(r)} a_{p, \alpha}^{\dagger} a_{q, \alpha} \right )^2.

    The orbital basis can be rotated such that each :math:`T` and :math:`L^{(r)}` matrix is
    diagonal. The Hamiltonian can then be written following Eq. (2) of
    [`npj Quantum Information, 7, 23 (2021) <https://www.nature.com/articles/s41534-020-00341-7>`_]
    as

    .. math::

        H = U_0 \left ( \sum_p d_p n_p \right ) U_0^{\dagger} + \sum_r^R U_r \left ( \sum_{pq}
        d_{pq}^{(r)} n_p n_q \right ) U_r^{\dagger},

    where the coefficients :math:`d` are obtained by diagonalizing the :math:`T` and
    :math:`L^{(r)}` matrices. The number operators :math:`n_p = a_p^{\dagger} a_p` can be
    converted to qubit operators using

    .. math::

        n_p = \frac{1-Z_p}{2},

    where :math:`Z_p` is the Pauli :math:`Z` operator applied to qubit :math:`p`. This gives
    the qubit Hamiltonian

    .. math::

       H = U_0 \left ( \sum_p O_p^{(0)} \right ) U_0^{\dagger} + \sum_r^R U_r \left ( \sum_{q} O_q^{(r)} \right ) U_r^{\dagger},

    where :math:`O = \sum_i c_i P_i` is a linear combination of Pauli words :math:`P_i` that are
    a tensor product of Pauli :math:`Z` and Identity operators. This allows all the Pauli words
    in each of the :math:`O` terms to be measured simultaneously. This function returns the
    coefficients and the Pauli words grouped for each of the :math:`O` terms as well as the
    basis rotation transformation matrices that are constructed from the eigenvectors of the
    :math:`T` and :math:`L^{(r)}` matrices. Each column of the transformation matrix is an
    eigenvector of the corresponding :math:`T` or :math:`L^{(r)}` matrix.

## `symmetry_shift`

```python
def symmetry_shift(core, one_electron, two_electron, n_elec, method='L-BFGS-B', **method_kwargs)
```

Performs a block-invariant symmetry shift on the electronic integrals.

The block-invariant symmetry shift (BLISS) method [`arXiv:2304.13772
<https://arxiv.org/pdf/2304.13772>`_] decreases the one-norm and the
spectral range of a molecular Hamiltonian :math:`\hat{H}` defined by
its one-body :math:`T_{pq}` and two-body components. It constructs
a shifted Hamiltonian (:math:`\hat{H}^{\prime}`), such that:

.. math::

    H^{\prime}(k_1, k_2, \vec{\xi}) = \hat{H} - k_1 (\hat{N}_e - N_e) - k_2 (\hat{N}_e^2 - \hat{N}_e^2) + \sum_{ij}\xi_{ij} T_{ij} (\hat{N}_e - N_e),

where :math:`\hat{N}_e` is the electron number operator, :math:`N_e` is the
number of electrons of the molecule and :math:`k_u, \xi_{ij} \in \mathbb{R}` are
the parameters that are optimized with the constraint :math:`\xi_{ij} = \xi_{ji}`
to minimize the overall one-norm of the :math:`\hat{H}^{\prime}`.

Args:
    core (array[float]): the contribution of the core orbitals and nuclei
    one_electron (array[float]): a one-electron integral tensor
    two_electron (array[float]): a two-electron integral tensor in the chemist notation
    n_elec (bool): number of electrons in the molecule
    method (str | callable): solver method used by ``scipy.optimize.minimize``
        to optimize the parameters. Please refer to its `documentation
        <https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.minimize.html#scipy.optimize.minimize>`_
        for the list of all available solvers. Default solver is ``"L-BFGS-B"``.
    **method_kwargs: keyword arguments to pass when calling ``scipy.optimize.minimize`` with ``method=method``

Returns:
    tuple(array[float], array[float], array[float]): symmetry shifted core, one-body tensor and two-body tensor for the provided terms

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = qp.numpy.array([[0.0, 0.0, 0.0],
...                             [1.398397361, 0.0, 0.0]], requires_grad=False)
>>> mol = qp.qchem.Molecule(symbols, geometry, basis_name="STO-3G")
>>> core, one, two = qp.qchem.electron_integrals(mol)()
>>> ctwo = np.swapaxes(two, 1, 3)
>>> s_core, s_one, s_two = symmetry_shift(core, one, ctwo, n_elec=mol.n_electrons)
>>> print(s_two)
[[[[ 1.12461110e-02 -1.70030746e-09]
  [-1.70030746e-09 -1.12461660e-02]]
 [[-1.70030746e-09  1.81210462e-01]
  [ 1.81210462e-01 -1.70032620e-09]]]
 [[[-1.70030763e-09  1.81210462e-01]
  [ 1.81210462e-01 -1.70032598e-09]]
 [[-1.12461660e-02 -1.70032620e-09]
  [-1.70032620e-09  1.12461854e-02]]]]
