---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/templates/subroutines/time_evolution/trotter.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/time_evolution/trotter.py
license: Apache-2.0
---

## Error surface of `pennylane/templates/subroutines/time_evolution/trotter.py`

### Exceptions

## `TrotterProduct`

```python
class TrotterProduct(ErrorOperation, ResourcesOperation)
```

An operation representing the Suzuki-Trotter product approximation for the complex matrix
exponential of a given Hamiltonian.

The Suzuki-Trotter product formula provides a method to approximate the matrix exponential of
Hamiltonian expressed as a linear combination of operands which in general do not commute.
Consider the Hamiltonian :math:`H = \Sigma^{N}_{j=0} O_{j}`, the product formula is constructed
using symmetrized products of the terms in the Hamiltonian. The symmetrized products of order
:math:`m \in [1, 2, 4, ..., 2k]` with :math:`k \in \mathbb{N}` are given by:

.. math::

    \begin{align}
        S_{1}(t) &= \Pi_{j=0}^{N} \ e^{i t O_{j}} \\
        S_{2}(t) &= \Pi_{j=0}^{N} \ e^{i \frac{t}{2} O_{j}} \cdot \Pi_{j=N}^{0} \ e^{i \frac{t}{2} O_{j}} \\
        &\vdots \\
        S_{m}(t) &= S_{m-2}(p_{m}t)^{2} \cdot S_{m-2}((1-4p_{m})t) \cdot S_{m-2}(p_{m}t)^{2},
    \end{align}

where the coefficient is :math:`p_{m} = 1 / (4 - \sqrt[m - 1]{4})`. The :math:`m^{\text{th}}` order,
:math:`n`\ -step Suzuki-Trotter approximation is then defined as:

.. math:: e^{iHt} \approx \left [S_{m}(t / n)  \right ]^{n}.

For more details see `J. Math. Phys. 32, 400 (1991) <https://pubs.aip.org/aip/jmp/article-abstract/32/2/400/229229>`_.

Args:
    hamiltonian (Union[.Hamiltonian, .Sum, .SProd]): The Hamiltonian written as a linear combination
        of operators with known matrix exponentials.
    time (float): The time of evolution, namely the parameter :math:`t` in :math:`e^{iHt}`
    n (int): An integer representing the number of Trotter steps to perform
    order (int): An integer (:math:`m`) representing the order of the approximation (must be 1 or even)
    check_hermitian (bool): A flag to enable the validation check to ensure this is a valid unitary operator

Raises:
    TypeError: The ``hamiltonian`` is not of type :class:`~.Sum`.
    ValueError: The ``hamiltonian`` has only one term or no terms.
    ValueError: One or more of the terms in ``hamiltonian`` are not verified to be Hermitian. 
        (only for ``check_hermitian=True``)
    ValueError: The ``order`` is not one or a positive even integer.

**Example**

.. code-block:: python

    coeffs = [0.25, 0.75]
    ops = [qp.X(0), qp.Z(0)]
    H = qp.dot(coeffs, ops)

    dev = qp.device("default.qubit", wires=2)
    @qp.qnode(dev)
    def my_circ():
        # Prepare some state
        qp.Hadamard(0)

        # Evolve according to H
        qp.TrotterProduct(H, time=2.4, order=2)

        # Measure some quantity
        return qp.state()

>>> my_circ()
array([-0.132...+0.597...j,  0.        +0.j        , -0.132...-0.779...j,  0.        +0.j        ])

.. warning::

    The Trotter-Suzuki decomposition depends on the order of the summed observables. Two
    mathematically identical :class:`~.LinearCombination` objects may undergo different time
    evolutions due to the order in which those observables are stored. The order of observables
    can be queried using the :attr:`~.Sum.operands` attribute. Also see the advanced example
    below.

.. warning::

    ``TrotterProduct`` does not automatically simplify the input Hamiltonian. This allows
    for a more fine-grained control over the decomposition but also risks an increased
    runtime and/or number of gates. Simplification can be performed manually by
    applying :func:`~.simplify` to your Hamiltonian before using it in ``TrotterProduct``.

.. details::
    :title: Usage Details

    An *upper-bound* for the error in approximating time-evolution using this operator can be
    computed by calling :func:`~.TrotterProduct.error()`. It is computed using two different
    methods; the "one-norm-bound" scaling method and the "commutator-bound" scaling method.
    (see `Childs et al. (2021) <https://arxiv.org/abs/1912.08854>`_)

    >>> hamiltonian = qp.dot([1.0, 0.5, -0.25], [qp.X(0), qp.Y(0), qp.Z(0)])
    >>> op = qp.TrotterProduct(hamiltonian, time=0.01, order=2)
    >>> op.error(method="one-norm-bound")
    SpectralNormError(8.039062500000003e-06)
    >>> op.error(method="commutator-bound")
    SpectralNormError(6.166666666666668e-06)

    This operation is similar to the :class:`~.ApproxTimeEvolution`. One can recover the behaviour
    of :class:`~.ApproxTimeEvolution` by taking the adjoint:

    >>> qp.adjoint(qp.TrotterProduct(hamiltonian, time, order=1, n=n)) # doctest: +SKIP

    The grouping of terms in the ``operands`` attribute of the ``hamiltonian`` impacts
    the structure of the gates created by ``TrotterProduct``. To understand this, first
    consider this simple two-qubit Hamiltonian with four Pauli word terms:

    >>> coeffs = [0.5, 0.2, 0.1, -0.6]
    >>> ops = [qp.X(0), qp.Y(1), qp.Y(0) @ qp.Z(1), qp.X(0) @ qp.Y(1)]
    >>> H_flat = qp.dot(coeffs, ops)
    >>> H_flat
    (
        0.5 * X(0)
    + 0.2 * Y(1)
    + 0.1 * (Y(0) @ Z(1))
    + -0.6 * (X(0) @ Y(1))
    )
    >>> print(*H_flat.operands, sep="\n")
    0.5 * X(0)
    0.2 * Y(1)
    0.1 * (Y(0) @ Z(1))
    -0.6 * (X(0) @ Y(1))

    As we can see, each Pauli word contributes an individual operand. As a result, the
    ``TrotterProduct`` (of first order, for simplicity) of this Hamiltonian will contain four
    exponentials per Trotter step:

    >>> qp.TrotterProduct(H_flat, 1., n=1, order=1).decomposition()
    [Evolution(1j -0.6 * (X(0) @ Y(1))), Evolution(1j 0.1 * (Y(0) @ Z(1))), Evolution(1j 0.2 * Y(1)), Evolution(1j 0.5 * X(0))]

    If we first create two operands with two Pauli words each and then sum those, this is
    reflected in the structure of the operator:

    >>> H_grouped = qp.sum(qp.dot(coeffs[:2], ops[:2]), qp.dot(coeffs[2:], ops[2:]))
    >>> print(*H_grouped.operands, sep="\n")
    0.5 * X(0) + 0.2 * Y(1)
    0.1 * (Y(0) @ Z(1)) + -0.6 * (X(0) @ Y(1))

    The ``TrotterProduct`` accordingly has a different structure as well:

    >>> qp.TrotterProduct(H_grouped, 1., n=1, order=1).decomposition()
    [Evolution(1j 0.1 * (Y(0) @ Z(1)) + -0.6 * (X(0) @ Y(1))), Evolution(1j 0.5 * X(0) + 0.2 * Y(1))]


    As we can see, the ``operands`` structure of the Hamiltonian directly impacts the
    constructed Trotter circuit, and in general, those circuits will be different
    approximations to the true time evolution.

    We can also compute the gradient with respect to the coefficients of the Hamiltonian and the
    evolution time. Note that this is currently only possible with backprop. 

    .. code-block:: python

        @qp.qnode(dev, diff_method="backprop")
        def my_circ(c1, c2, time):
            # Prepare H:
            H = qp.dot([c1, c2], [qp.X(0), qp.Z(0)])

            # Prepare some state
            qp.Hadamard(0)

            # Evolve according to H
            qp.TrotterProduct(H, time, order=2)

            # Measure some quantity
            return qp.expval(qp.Z(0) @ qp.Z(1))

    >>> args = qp.numpy.array([1.23, 4.5, 0.1])
    >>> qp.grad(my_circ)(*tuple(args))
    (tensor(0.077..., requires_grad=True), tensor(0.015..., requires_grad=True), tensor(1.642..., requires_grad=True))
