---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/kernels/postprocessing.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/kernels/postprocessing.py
license: Apache-2.0
---

## Module `pennylane/kernels/postprocessing.py`

This file contains functionalities for postprocessing of kernel matrices.

## `threshold_matrix`

```python
def threshold_matrix(K)
```

Remove negative eigenvalues from the given kernel matrix.

This method yields the closest positive semi-definite matrix in
any unitarily invariant norm, e.g. the Frobenius norm.

Args:
    K (array[float]): Kernel matrix, assumed to be symmetric.

Returns:
    array[float]: Kernel matrix with cropped negative eigenvalues.

**Example:**

Consider a symmetric matrix with both positive and negative eigenvalues:

>>> K = np.array([[0, 1, 0], [1, 0, 0], [0, 0, 2]])
>>> np.linalg.eigvalsh(K)
array([-1.,  1.,  2.])

We then can threshold/truncate the eigenvalues of the matrix via

>>> K_thresh = qp.kernels.threshold_matrix(K)
>>> np.linalg.eigvalsh(K_thresh)
array([0.,  1.,  2.])

If the input matrix does not have negative eigenvalues, ``threshold_matrix``
does not have any effect.

## `displace_matrix`

```python
def displace_matrix(K)
```

Remove negative eigenvalues from the given kernel matrix by adding a multiple
of the identity matrix.

This method keeps the eigenvectors of the matrix intact.

Args:
    K (array[float]): Kernel matrix, assumed to be symmetric.

Returns:
    array[float]: Kernel matrix with eigenvalues offset by adding the identity.

**Example:**

Consider a symmetric matrix with both positive and negative eigenvalues:

>>> K = np.array([[0, 1, 0], [1, 0, 0], [0, 0, 2]])
>>> np.linalg.eigvalsh(K)
array([-1.,  1.,  2.])

We then can shift all eigenvalues of the matrix by adding the identity matrix
multiplied with the absolute value of the smallest (the most negative, that is)
eigenvalue:

>>> K_displaced = qp.kernels.displace_matrix(K)
>>> np.linalg.eigvalsh(K_displaced)
array([0.,  2.,  3.])

If the input matrix does not have negative eigenvalues, ``displace_matrix``
does not have any effect.

## `flip_matrix`

```python
def flip_matrix(K)
```

Remove negative eigenvalues from the given kernel matrix by taking the absolute value.

This method keeps the eigenvectors of the matrix intact.

Args:
    K (array[float]): Kernel matrix, assumed to be symmetric.

Returns:
    array[float]: Kernel matrix with flipped negative eigenvalues.

Reference:
    This method is introduced in
    `Wang, Du, Luo & Tao (2021) <https://doi.org/10.22331/q-2021-08-30-531>`_.

**Example:**

Consider a symmetric matrix with both positive and negative eigenvalues:

>>> K = np.array([[0, 1, 0], [1, 0, 0], [0, 0, 2]])
>>> np.linalg.eigvalsh(K)
array([-1.,  1.,  2.])

We then can invert the sign of all negative eigenvalues of the matrix, obtaining
non-negative eigenvalues only:

>>> K_flipped = qp.kernels.flip_matrix(K)
>>> np.linalg.eigvalsh(K_flipped)
array([1.,  1.,  2.])

If the input matrix does not have negative eigenvalues, ``flip_matrix``
does not have any effect.

## `closest_psd_matrix`

```python
def closest_psd_matrix(K, fix_diagonal=False, solver=None, **kwargs)
```

Return the closest positive semi-definite matrix to the given kernel matrix.

This method either fixes the diagonal entries to be 1
(``fix_diagonal=True``) or keeps the eigenvectors intact (``fix_diagonal=False``),
in which case it reduces to the method :func:`~.kernels.threshold_matrix`.
For ``fix_diagonal=True`` a semi-definite program is solved.

Args:
    K (array[float]): Kernel matrix, assumed to be symmetric.
    fix_diagonal (bool): Whether to fix the diagonal to 1.
    solver (str, optional): Solver to be used by cvxpy. Defaults to CVXOPT.
    kwargs (kwarg dict): Passed to cvxpy.Problem.solve().

Returns:
    array[float]: closest positive semi-definite matrix in Frobenius norm.

Comments:
    Requires cvxpy and the used solver (default CVXOPT) to be installed if ``fix_diagonal=True``.

Reference:
    This method is introduced in `arXiv:2105.02276 <https://arxiv.org/abs/2105.02276>`_.

**Example:**

Consider a symmetric matrix with both positive and negative eigenvalues:

>>> K = np.array([[0.9, 1.], [1., 0.9]])
>>> np.linalg.eigvalsh(K)
array([-0.1, 1.9])

The positive semi-definite matrix that is closest to this matrix in any unitarily
invariant norm is then given by the matrix with the eigenvalues thresholded at 0,
as computed by :func:`~.kernels.threshold_matrix`:

>>> K_psd = qp.kernels.closest_psd_matrix(K)
>>> K_psd
array([[0.95, 0.95],
        [0.95, 0.95]])
>>> np.linalg.eigvalsh(K_psd)
array([0. , 1.9])
>>> np.allclose(K_psd, qp.kernels.threshold_matrix(K))
True

However, for quantum kernel matrices we may want to restore the value 1 on the
diagonal:

>>> K_psd = qp.kernels.closest_psd_matrix(K, fix_diagonal=True) # doctest: +SKIP
>>> K_psd # doctest: +SKIP
array([[1.        , 0.99998008],
        [0.99998008, 1.        ]])
>>> np.linalg.eigvalsh(K_psd) # doctest: +SKIP
array([1.99162415e-05, 1.99998008e+00])

If the input matrix does not have negative eigenvalues and ``fix_diagonal=False``,
``closest_psd_matrix`` does not have any effect.

## `mitigate_depolarizing_noise`

```python
def mitigate_depolarizing_noise(K, num_wires, method, use_entries=None)
```

Estimate depolarizing noise rate(s) using on the diagonal entries of a kernel
matrix and mitigate the noise, assuming a global depolarizing noise model.

Args:
    K (array[float]): Noisy kernel matrix.
    num_wires (int): Number of wires/qubits of the quantum embedding kernel.
    method (``'single'`` | ``'average'`` | ``'split_channel'``): Strategy for mitigation

        * ``'single'``: An alias for ``'average'`` with ``len(use_entries)=1``.
        * ``'average'``: Estimate a global noise rate based on the average of the diagonal
          entries in ``use_entries``, which need to be measured on the quantum computer.
        * ``'split_channel'``: Estimate individual noise rates per embedding, requiring
          all diagonal entries to be measured on the quantum computer.
    use_entries (array[int]): Diagonal entries to use if method in ``['single', 'average']``.
        If ``None``, defaults to ``[0]`` (``'single'``) or ``range(len(K))`` (``'average'``).

Returns:
    array[float]: Mitigated kernel matrix.

Reference:
    This method is introduced in Section V in
    `arXiv:2105.02276 <https://arxiv.org/abs/2105.02276>`_.

**Example:**

For an example usage of ``mitigate_depolarizing_noise`` please refer to the
:doc:`PennyLane demo on the kernel module <demo:demos/tutorial_kernel_based_training>`
or `the post-processing demo for arXiv:2105.02276 <https://github.com/thubregtsen/qhack/blob/master/paper/post_processing_demo.py>`_.
