---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/time_evolution/qdrift.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/time_evolution/qdrift.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/time_evolution/qdrift.py`

Contains template for QDrift subroutine.

## `QDrift`

```python
class QDrift(Operation)
```

An operation representing the QDrift approximation for the complex matrix exponential
of a given Hamiltonian.

The QDrift subroutine provides a method to approximate the matrix exponential of a Hamiltonian
expressed as a linear combination of terms which in general do not commute. For the Hamiltonian
:math:`H = \Sigma_j h_j H_{j}`, the product formula is constructed by random sampling from the
terms of the Hamiltonian with the probability :math:`p_j = h_j / \sum_{j} hj` as:

.. math::

    \prod_{j}^{n} e^{i \lambda H_j \tau / n},

where :math:`\tau` is time, :math:`\lambda = \sum_j |h_j|` and :math:`n` is the total number of
terms to be sampled and added to the product. Note, the terms :math:`H_{j}` are assumed to be
normalized such that the "impact" of each term is fully encoded in the magnitude of :math:`h_{j}`.

The number of samples :math:`n` required for a given error threshold can be approximated by:

.. math::

    n \ \approx \ \frac{2\lambda^{2}t^{2}}{\epsilon}

For more details see `Phys. Rev. Lett. 123, 070503 (2019) <https://arxiv.org/abs/1811.08017>`_.

Args:
    hamiltonian (Union[.Hamiltonian, .Sum]): The Hamiltonian written as a sum of operations
    time (float): The time of evolution, namely the parameter :math:`t` in :math:`e^{iHt}`
    n (int): An integer representing the number of exponentiated terms.
    seed (int): The seed for the random number generator.

Raises:
    TypeError: The ``hamiltonian`` is not of type :class:`~.Sum`
    QuantumFunctionError: If the coefficients of ``hamiltonian`` are trainable and are used
        in a differentiable workflow.
    ValueError: If there is only one term in the Hamiltonian.

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
        qp.QDrift(H, time=1.2, n=10, seed=10)

        # Measure some quantity
        return qp.probs()

>>> my_circ()
array([0.653..., 0.        , 0.346..., 0.        ])

.. note::

    The option to pass a custom ``decomposition`` to ``QDrift`` has been removed.
    Instead, the custom decomposition can be applied using :func:`~.pennylane.apply`
    on all operations in the decomposition.

.. details::
    :title: Usage Details

    We currently **Do NOT** support computing gradients with respect to the
    coefficients of the input Hamiltonian. We can however compute the gradient
    with respect to the evolution time:

    .. code-block:: python

        dev = qp.device("default.qubit", wires=2)

        @qp.qnode(dev)
        def my_circ(time):
            # Prepare H:
            H = qp.dot([0.2, -0.1], [qp.Y(0), qp.Z(1)])

            # Prepare some state
            qp.Hadamard(0)

            # Evolve according to H
            qp.QDrift(H, time, n=10, seed=10)

            # Measure some quantity
            return qp.expval(qp.Z(0) @ qp.Z(1))


    >>> time = qp.numpy.array(1.23)
    >>> print(qp.grad(my_circ)(time))
    0.279...

    The error in the approximation of time evolution with the QDrift protocol is
    directly related to the number of samples used in the product. We provide a
    method to upper-bound the error:

    >>> H = qp.dot([0.25, 0.75], [qp.X(0), qp.Z(0)])
    >>> print(qp.QDrift.error(H, time=1.2, n=10))
    0.3661197552925645

### `__init__`

```python
def __init__(self, hamiltonian, time, n=1, seed=None, id=None)
```

Initialize the QDrift class

### `compute_decomposition`

```python
def compute_decomposition(*args, **kwargs)
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

.. note::

    Operations making up the decomposition should be queued within the
    ``compute_decomposition`` method.

.. seealso:: :meth:`~.Operator.decomposition`.

Args:
    *params (list): trainable parameters of the operator, as stored in the ``parameters`` attribute
    wires (Iterable[Any], Wires): wires that the operator acts on
    **hyperparams (dict): non-trainable hyperparameters of the operator, as stored in the ``hyperparameters`` attribute

Returns:
    list[Operator]: decomposition of the operator

### `error`

```python
def error(hamiltonian, time, n=1)
```

A method for determining the upper-bound for the error in the approximation of
the true matrix exponential.

The error is bounded according to the following expression:

.. math::

    \epsilon \ \leq \ \frac{2\lambda^{2}t^{2}}{n}  e^{\frac{2 \lambda t}{n}},

where :math:`t` is time, :math:`\lambda = \sum_j |h_j|` and :math:`n` is the total number of
terms to be added to the product. For more details see `Phys. Rev. Lett. 123, 070503 (2019) <https://arxiv.org/abs/1811.08017>`_.

Args:
    hamiltonian (Sum): The Hamiltonian written as a sum of operations
    time (float): The time of evolution, namely the parameter :math:`t` in :math:`e^{-iHt}`
    n (int): An integer representing the number of exponentiated terms. default is 1

Raises:
    TypeError: The given operator must be a PennyLane .Hamiltonian or .Sum

Returns:
    float: upper bound on the precision achievable using the QDrift protocol
