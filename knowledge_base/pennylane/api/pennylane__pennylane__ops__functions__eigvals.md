---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/functions/eigvals.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/functions/eigvals.py
license: Apache-2.0
---

## Module `pennylane/ops/functions/eigvals.py`

This module contains the qp.eigvals function.

## `eigvals`

```python
def eigvals(op: qp.operation.Operator, k=1, which='SA') -> TensorLike
```

The eigenvalues of one or more operations.

.. note::

    - For a :class:`~.SparseHamiltonian` object, the eigenvalues are computed with the efficient
      ``scipy.sparse.linalg.eigsh`` method which returns :math:`k` eigenvalues. The default value
      of :math:`k` is :math:`1`. For an :math:`N \times N` sparse matrix, :math:`k` must be
      smaller than :math:`N - 1`, otherwise ``scipy.sparse.linalg.eigsh`` fails. If the requested
      :math:`k` is equal or larger than :math:`N - 1`, the regular ``qp.math.linalg.eigvalsh``
      is applied on the dense matrix. For more details see the ``scipy.sparse.linalg.eigsh``
      `documentation <https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.linalg.eigsh.html#scipy.sparse.linalg.eigsh>`_.
    - A second-quantized :mod:`molecular Hamiltonian <pennylane.qchem.molecular_hamiltonian>` is
      independent of the number of electrons and its eigenspectrum contains the energies of the
      neutral and charged molecules. Therefore, the `smallest` eigenvalue returned by ``qp.eigvals``
      for a molecular Hamiltonian might not always correspond to the neutral molecule.

Args:
    op (Operator or QNode or QuantumTape or Callable): A quantum operator or quantum circuit.
    k (int): The number of eigenvalues to be returned for a :class:`~.SparseHamiltonian`.
    which (str): Method for computing the eigenvalues of a :class:`~.SparseHamiltonian`. The
        possible methods are ``'LM'`` (largest in magnitude), ``'SM'`` (smallest in magnitude),
        ``'LA'`` (largest algebraic), ``'SA'`` (smallest algebraic) and ``'BE'`` (:math:`k/2`
        from each end of the spectrum).

Returns:
    TensorLike or qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]:

    If an operator is provided as input, the eigenvalues are returned directly in the form of a tensor.
    Otherwise, the transformed circuit is returned as described in :func:`qp.transform <pennylane.transform>`.
    Executing this circuit will provide the eigenvalues as a tensor.

**Example**

Given an operation, ``qp.eigvals`` returns the eigenvalues:

>>> op = qp.Z(0) @ qp.X(1) - 0.5 * qp.Y(1)
>>> qp.eigvals(op)
array([-1.11803399, -1.11803399,  1.11803399,  1.11803399])

It can also be used in a functional form:

>>> x = torch.tensor(0.6, requires_grad=True)
>>> eigval_fn = qp.eigvals(qp.RX)
>>> eigval_fn(x, wires=0)
tensor([0.9553+0.2955j, 0.9553-0.2955j], grad_fn=<LinalgEigBackward0>)

In its functional form, it is fully differentiable with respect to gate arguments:

>>> loss = torch.real(torch.sum(eigval_fn(x, wires=0)))
>>> loss.backward()
>>> x.grad
tensor(-0.2955)

This operator transform can also be applied to QNodes, tapes, and quantum functions
that contain multiple operations; see Usage Details below for more details.

.. details::
    :title: Usage Details

    ``qp.eigvals`` can also be used with QNodes, tapes, or quantum functions that
    contain multiple operations. However, in this situation, **eigenvalues may
    be computed numerically**. This can lead to a large computational overhead
    for a large number of wires.

    Consider the following quantum function:

    .. code-block:: python

        def circuit(theta):
            qp.RX(theta, wires=1)
            qp.Z(0)

    We can use ``qp.eigvals`` to generate a new function that returns the eigenvalues
    corresponding to the function ``circuit``:

    >>> eigvals_fn = qp.eigvals(circuit)
    >>> theta = np.pi / 4
    >>> eigvals_fn(theta)
    array([ 0.92387953+0.38268343j, -0.92387953-0.38268343j,
        0.92387953-0.38268343j, -0.92387953+0.38268343j])
