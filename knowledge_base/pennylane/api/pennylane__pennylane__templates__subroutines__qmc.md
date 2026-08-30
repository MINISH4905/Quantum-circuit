---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/qmc.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/qmc.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/qmc.py`

Contains the QuantumMonteCarlo template and utility functions.

## `probs_to_unitary`

```python
def probs_to_unitary(probs)
```

Calculates the unitary matrix corresponding to an input probability distribution.

For a given distribution :math:`p(i)`, this function returns the unitary :math:`\mathcal{A}`
that transforms the :math:`|0\rangle` state as

.. math::

    \mathcal{A} |0\rangle = \sum_{i} \sqrt{p(i)} |i\rangle,

so that measuring the resulting state in the computational basis will give the state
:math:`|i\rangle` with probability :math:`p(i)`. Note that the returned unitary matrix is
real and hence an orthogonal matrix.

Args:
    probs (array): input probability distribution as a flat array

Returns:
    array: unitary

Raises:
    ValueError: if the input array is not flat or does not correspond to a probability
        distribution

**Example:**

>>> p = np.ones(4) / 4
>>> probs_to_unitary(p) # doctest: +SKIP
array([[ 0.5   ,  0.5   ,  0.5   ,  0.5   ],
       [ 0.5   , -0.8333,  0.1667,  0.1667],
       [ 0.5   ,  0.1667, -0.8333,  0.1667],
       [ 0.5   ,  0.1667,  0.1667, -0.8333]])

## `func_to_unitary`

```python
def func_to_unitary(func, M)
```

Calculates the unitary that encodes a function onto an auxiliary qubit register.

Consider a function defined on the set of integers :math:`X = \{0, 1, \ldots, M - 1\}` whose
output is bounded in the interval :math:`[0, 1]`, i.e., :math:`f: X \rightarrow [0, 1]`.

The ``func_to_unitary`` function returns a unitary :math:`\mathcal{R}` that performs the
transformation:

.. math::

    \mathcal{R} |i\rangle \otimes |0\rangle = |i\rangle\otimes \left(\sqrt{1 - f(i)}|0\rangle +
    \sqrt{f(i)} |1\rangle\right).

In other words, for a given input state :math:`|i\rangle \otimes |0\rangle`, this unitary
encodes the amplitude :math:`\sqrt{f(i)}` onto the :math:`|1\rangle` state of the auxiliary qubit.
Hence, measuring the auxiliary qubit will result in the :math:`|1\rangle` state with probability
:math:`f(i)`.

Args:
    func (callable): a function defined on the set of integers
        :math:`X = \{0, 1, \ldots, M - 1\}` with output value inside :math:`[0, 1]`
    M (int): the number of integers that the function is defined on

Returns:
    array: the :math:`\mathcal{R}` unitary

Raises:
    ValueError: if func is not bounded with :math:`[0, 1]` for all :math:`X`

**Example:**

>>> func = lambda i: np.sin(i) ** 2
>>> M = 16
>>> func_to_unitary(func, M) # doctest: +SKIP
array([[ 1.    ,  0.    ,  0.    , ...,  0.    ,  0.    ,  0.    ],
       [ 0.    , -1.    ,  0.    , ...,  0.    ,  0.    ,  0.    ],
       [ 0.    ,  0.    ,  0.5403, ...,  0.    ,  0.    ,  0.    ],
       ...,
       [ 0.    ,  0.    ,  0.    , ..., -0.1367,  0.    ,  0.    ],
       [ 0.    ,  0.    ,  0.    , ...,  0.    ,  0.7597,  0.6503],
       [ 0.    ,  0.    ,  0.    , ...,  0.    ,  0.6503, -0.7597]],
      shape=(32, 32))

## `make_Q`

```python
def make_Q(A, R)
```

Calculates the :math:`\mathcal{Q}` matrix that encodes the expectation value according to
the probability unitary :math:`\mathcal{A}` and the function-encoding unitary
:math:`\mathcal{R}`.

Following `this <https://journals.aps.org/pra/abstract/10.1103/PhysRevA.98.022321>`__ paper,
the expectation value is encoded as the phase of an eigenvalue of :math:`\mathcal{Q}`. This
phase can be estimated using quantum phase estimation using the
:func:`~.QuantumPhaseEstimation` template. See :func:`~.QuantumMonteCarlo` for more details,
which loads ``make_Q()`` internally and applies phase estimation.

Args:
    A (array): The unitary matrix of :math:`\mathcal{A}` which encodes the probability
        distribution
    R (array): The unitary matrix of :math:`\mathcal{R}` which encodes the function

Returns:
    array: the :math:`\mathcal{Q}` unitary

## `QuantumMonteCarlo`

```python
class QuantumMonteCarlo(Operation)
```

Performs the `quantum Monte Carlo estimation <https://arxiv.org/abs/1805.00109>`__
algorithm.

Given a probability distribution :math:`p(i)` of dimension :math:`M = 2^{m}` for some
:math:`m \geq 1` and a function :math:`f: X \rightarrow [0, 1]` defined on the set of
integers :math:`X = \{0, 1, \ldots, M - 1\}`, this function implements the algorithm that
allows the following expectation value to be estimated:

.. math::

    \mu = \sum_{i \in X} p(i) f(i).

.. figure:: ../../_static/templates/subroutines/qmc.svg
    :align: center
    :width: 60%
    :target: javascript:void(0);

Args:
    probs (array): input probability distribution as a flat array
    func (callable): input function :math:`f` defined on the set of integers
        :math:`X = \{0, 1, \ldots, M - 1\}` such that :math:`f(i)\in [0, 1]` for :math:`i \in X`
    target_wires (Union[Wires, Sequence[int], or int]): the target wires
    estimation_wires (Union[Wires, Sequence[int], or int]): the estimation wires

Raises:
    ValueError: if ``probs`` is not flat or has a length that is not compatible with
        ``target_wires``

.. note::

    This template is only compatible with simulators because the algorithm is performed using
    unitary matrices. Additionally, this operation is not differentiable. To implement the
    quantum Monte Carlo algorithm on hardware requires breaking down the unitary matrices into
    hardware-compatible gates, check out the :func:`~.quantum_monte_carlo` transformation for
    more details.

.. details::
    :title: Usage Details

    The algorithm proceeds as follows:

    #. The probability distribution :math:`p(i)` is encoded using a unitary :math:`\mathcal{A}`
       applied to the first :math:`m` qubits specified by ``target_wires``.
    #. The function :math:`f(i)` is encoded onto the last qubit of ``target_wires`` using a unitary
       :math:`\mathcal{R}`.
    #. The unitary :math:`\mathcal{Q}` is defined with eigenvalues
       :math:`e^{\pm 2 \pi i \theta}` such that the phase :math:`\theta` encodes the expectation
       value through the equation :math:`\mu = (1 + \cos (\pi \theta)) / 2`. The circuit in steps 1
       and 2 prepares an equal superposition over the two states corresponding to the eigenvalues
       :math:`e^{\pm 2 \pi i \theta}`.
    #. The :func:`~.QuantumPhaseEstimation` circuit is applied so that :math:`\pm\theta` can be
       estimated by finding the probabilities of the :math:`n` estimation wires. This in turn allows
       for the estimation of :math:`\mu`.

    Visit `Rebentrost et al. (2018) <https://arxiv.org/abs/1805.00109>`__ for further details. In
    this algorithm, the number of applications :math:`N` of the :math:`\mathcal{Q}` unitary scales
    as :math:`2^{n}`. However, due to the use of quantum phase estimation, the error
    :math:`\epsilon` scales as :math:`\mathcal{O}(2^{-n})`. Hence,

    .. math::

        N = \mathcal{O}\left(\frac{1}{\epsilon}\right).

    This scaling can be compared to standard Monte Carlo estimation, where :math:`N` samples are
    generated from the probability distribution and the average over :math:`f` is taken. In that
    case,

    .. math::

        N =  \mathcal{O}\left(\frac{1}{\epsilon^{2}}\right).

    Hence, the quantum Monte Carlo algorithm has a quadratically improved time complexity with
    :math:`N`. An example use case is given below.

    Consider a standard normal distribution :math:`p(x)` and a function
    :math:`f(x) = \sin ^{2} (x)`. The expectation value of :math:`f(x)` is
    :math:`\int_{-\infty}^{\infty}f(x)p(x)dx \approx 0.432332`. This number can be approximated by
    discretizing the problem and using the quantum Monte Carlo algorithm.

    First, the problem is discretized:

    .. code-block:: python

        from scipy.stats import norm

        m = 5
        M = 2 ** m

        xmax = np.pi  # bound to region [-pi, pi]
        xs = np.linspace(-xmax, xmax, M)

        probs = np.array([norm().pdf(x) for x in xs])
        probs /= np.sum(probs)

        func = lambda i: np.sin(xs[i]) ** 2

    The ``QuantumMonteCarlo`` template can then be used:

    .. code-block:: python

        n = 10
        N = 2 ** n

        target_wires = range(m + 1)
        estimation_wires = range(m + 1, n + m + 1)

        dev = qp.device("default.qubit", wires=(n + m + 1))

        @qp.qnode(dev)
        def circuit():
            qp.templates.QuantumMonteCarlo(
                probs,
                func,
                target_wires=target_wires,
                estimation_wires=estimation_wires,
            )
            return qp.probs(estimation_wires)

        phase_estimated = np.argmax(circuit()[:int(N / 2)]) / N

    The estimated value can be retrieved using the formula :math:`\mu = (1-\cos(\pi \theta))/2`

    >>> (1 - np.cos(np.pi * phase_estimated)) / 2
    np.float64(0.4327...)

### `compute_decomposition`

```python
def compute_decomposition(A, R, Q, wires, estimation_wires, target_wires)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.QuantumMonteCarlo.decomposition`.

Args:
    A (array): unitary matrix corresponding to an input probability distribution
    R (array): unitary that encodes the function applied to the auxiliary qubit register
    Q (array): matrix that encodes the expectation value according to the probability unitary
        and the function-encoding unitary
    wires (Any or Iterable[Any]): full set of wires that the operator acts on
    target_wires (Iterable[Any]): the target wires
    estimation_wires (Iterable[Any]): the estimation wires

Returns:
    list[.Operator]: decomposition of the operator
