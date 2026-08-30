---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/qmc.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/qmc.py
license: Apache-2.0
---

## Module `pennylane/transforms/qmc.py`

Contains the quantum_monte_carlo transform.

## `apply_controlled_Q`

```python
def apply_controlled_Q(tape: QuantumScript, wires, target_wire, control_wire, work_wires) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Applies the transform that performs a controlled version of the :math:`\mathcal{Q}` unitary
defined in `this <https://arxiv.org/abs/1805.00109>`__ paper.

The input ``tape`` should be the quantum circuit corresponding to the :math:`\mathcal{F}` unitary
in the paper above. This function transforms this circuit into a controlled version of the
:math:`\mathcal{Q}` unitary, which forms part of the quantum Monte Carlo algorithm. The
:math:`\mathcal{Q}` unitary encodes the target expectation value as a phase in one of its
eigenvalues. This phase can be estimated using quantum phase estimation (see
:class:`~.QuantumPhaseEstimation` for more details).

Args:
    tape (QNode or QuantumTape or Callable): the quantum circuit that applies quantum operations
        according to the :math:`\mathcal{F}` unitary used as part of quantum Monte Carlo estimation
    wires (Union[Wires or Sequence[int]]): the wires acted upon by the ``fn`` circuit
    target_wire (Union[Wires, int]): The wire in which the expectation value is encoded. Must be
        contained within ``wires``.
    control_wire (Union[Wires, int]): the control wire from the register of phase estimation
        qubits
    work_wires (Union[Wires, Sequence[int], or int]): additional work wires used when
        decomposing :math:`\mathcal{Q}`

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`. Executing this circuit
    will perform control on :math:`\mathcal{Q}` unitary.

Raises:
    ValueError: if ``target_wire`` is not in ``wires``

## `quantum_monte_carlo`

```python
def quantum_monte_carlo(tape: QuantumScript, wires, target_wire, estimation_wires) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Applies the transform
`quantum Monte Carlo estimation <https://arxiv.org/abs/1805.00109>`__ algorithm.

The input `tape`` should be the quantum circuit corresponding to the :math:`\mathcal{F}` unitary
in the paper above. This unitary encodes the probability distribution and random variable onto
``wires`` so that measurement of the ``target_wire`` provides the expectation value to be
estimated. The quantum Monte Carlo algorithm then estimates the expectation value using quantum
phase estimation (check out :class:`~.QuantumPhaseEstimation` for more details), using the
``estimation_wires``.

.. note::

    A complementary approach for quantum Monte Carlo is available with the
    :class:`~.QuantumMonteCarlo` template.

    The ``quantum_monte_carlo`` transform is intended for
    use when you already have the circuit for performing :math:`\mathcal{F}` set up, and is
    compatible with resource estimation and potential hardware implementation. The
    :class:`~.QuantumMonteCarlo` template is only compatible with
    simulators, but may perform faster and is suited to quick prototyping.

Args:
    tape (QNode or QuantumTape or Callable): the quantum circuit that applies quantum operations according to the
        :math:`\mathcal{F}` unitary used as part of quantum Monte Carlo estimation
    wires (Union[Wires or Sequence[int]]): the wires acted upon by the ``fn`` circuit
    target_wire (Union[Wires, int]): The wire in which the expectation value is encoded. Must be
        contained within ``wires``.
    estimation_wires (Union[Wires, Sequence[int], or int]): the wires used for phase estimation

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`. Executing this circuit
    will perform the quantum Monte Carlo estimation.


Raises:
    ValueError: if ``wires`` and ``estimation_wires`` share a common wire

.. details::
    :title: Usage Details

    Consider an input quantum circuit ``fn`` that performs the unitary

    .. math::

        \mathcal{F} = \mathcal{R} \mathcal{A}.

    .. figure:: ../../_static/ops/f.svg
        :align: center
        :width: 15%
        :target: javascript:void(0);

    Here, the unitary :math:`\mathcal{A}` prepares a probability distribution :math:`p(i)` of
    dimension :math:`M = 2^{m}` over :math:`m \geq 1` qubits:

    .. math::

        \mathcal{A}|0\rangle^{\otimes m} = \sum_{i \in X} p(i) |i\rangle,

    where :math:`X = \{0, 1, \ldots, M - 1\}` and :math:`|i\rangle` is the basis state
    corresponding to :math:`i`. The :math:`\mathcal{R}` unitary imprints the
    result of a function :math:`f: X \rightarrow [0, 1]` onto an auxiliary qubit:

    .. math::

        \mathcal{R}|i\rangle |0\rangle = |i\rangle \left(\sqrt{1 - f(i)} |0\rangle + \sqrt{f(i)}|1\rangle\right).

    Following `this <https://arxiv.org/abs/1805.00109>`__ paper,
    the probability of measuring the state :math:`|1\rangle` in the final
    qubit is

    .. math::

        \mu = \sum_{i \in X} p(i) f(i).

    However, it is possible to measure :math:`\mu` more efficiently using quantum Monte Carlo
    estimation. This function transforms an input quantum circuit ``fn`` that performs the
    unitary :math:`\mathcal{F}` to a larger circuit for measuring :math:`\mu` using the quantum
    Monte Carlo algorithm.

    .. figure:: ../../_static/ops/qmc.svg
        :align: center
        :width: 60%
        :target: javascript:void(0);

    The algorithm proceeds as follows:

    #. The probability distribution :math:`p(i)` is encoded using a unitary :math:`\mathcal{A}`
       applied to the first :math:`m` qubits specified by ``wires``.
    #. The function :math:`f(i)` is encoded onto the ``target_wire`` using a unitary
       :math:`\mathcal{R}`.
    #. The unitary :math:`\mathcal{Q}` is defined with eigenvalues
       :math:`e^{\pm 2 \pi i \theta}` such that the phase :math:`\theta` encodes the expectation
       value through the equation :math:`\mu = (1 + \cos (\pi \theta)) / 2`. The circuit in
       steps 1 and 2 prepares an equal superposition over the two states corresponding to the
       eigenvalues :math:`e^{\pm 2 \pi i \theta}`.
    #. The circuit returned by this function is applied so that :math:`\pm\theta` can be
       estimated by finding the probabilities of the :math:`n` estimation wires. This in turn
       allows for the estimation of :math:`\mu`.

    Visit `Rebentrost et al. (2018)
    <https://arxiv.org/abs/1805.00109>`__ for further details.
    In this algorithm, the number of applications :math:`N` of the :math:`\mathcal{Q}` unitary
    scales as :math:`2^{n}`. However, due to the use of quantum phase estimation, the error
    :math:`\epsilon` scales as :math:`\mathcal{O}(2^{-n})`. Hence,

    .. math::

        N = \mathcal{O}\left(\frac{1}{\epsilon}\right).

    This scaling can be compared to standard Monte Carlo estimation, where :math:`N` samples are
    generated from the probability distribution and the average over :math:`f` is taken. In that
    case,

    .. math::

        N =  \mathcal{O}\left(\frac{1}{\epsilon^{2}}\right).

    Hence, the quantum Monte Carlo algorithm has a quadratically improved time complexity with
    :math:`N`.

    **Example**

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
        r_rotations = np.array([2 * np.arcsin(np.sqrt(func(i))) for i in range(M)])

    The ``quantum_monte_carlo`` transform can then be used:

    .. code-block:: python

        from pennylane.templates.state_preparations.mottonen import (
            _apply_uniform_rotation_dagger as r_unitary,
        )

        n = 6
        N = 2 ** n

        a_wires = range(m)
        wires = range(m + 1)
        target_wire = m
        estimation_wires = range(m + 1, n + m + 1)

        dev = qp.device("default.qubit", wires=(n + m + 1))

        def fn():
            qp.templates.MottonenStatePreparation(np.sqrt(probs), wires=a_wires)
            r_unitary(qp.RY, r_rotations, control_wires=a_wires[::-1], target_wire=target_wire)

        @qp.qnode(dev)
        def qmc():
            qp.quantum_monte_carlo(fn, wires, target_wire, estimation_wires)()
            return qp.probs(estimation_wires)

        phase_estimated = np.argmax(qmc()[:int(N / 2)]) / N

    The estimated value can be retrieved using the formula :math:`\mu = (1-\cos(\pi \theta))/2`

    >>> (1 - np.cos(np.pi * phase_estimated)) / 2
    np.float64(0.426...)

    It is also possible to explore the resources required to perform the quantum Monte Carlo
    algorithm

    >>> specs = qp.specs(qmc, level="device")()
    >>> from pprint import pprint
    >>> pprint(specs)
    CircuitSpecs(device_name='default.qubit',
                 num_device_wires=12,
                 shots=Shots(total_shots=None, shot_vector=()),
                 level='device',
                 resources=SpecsResources(gate_types={'Adjoint(CNOT)': 7812,
                                                      'Adjoint(QFT)': 1,
                                                      'Adjoint(RY)': 3150,
                                                      'CNOT': 7874,
                                                      'CZ': 126,
                                                      'Hadamard': 258,
                                                      'MultiControlledX': 126,
                                                      'PauliX': 252,
                                                      'RY': 3175},
                                          gate_sizes={1: 6835,
                                                      2: 15812,
                                                      6: 1,
                                                      7: 126},
                                          measurements={'probs(6 wires)': 1},
                                          num_allocs=12,
                                          depth=21502))
