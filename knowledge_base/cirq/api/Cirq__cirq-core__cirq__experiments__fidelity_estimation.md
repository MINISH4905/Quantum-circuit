---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/experiments/fidelity_estimation.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/experiments/fidelity_estimation.py
license: Apache-2.0
---

## Module `cirq-core/cirq/experiments/fidelity_estimation.py`

Estimation of fidelity associated with experimental circuit executions.

## `linear_xeb_fidelity_from_probabilities`

```python
def linear_xeb_fidelity_from_probabilities(hilbert_space_dimension: int, probabilities: Sequence[float]) -> float
```

Linear XEB fidelity estimator.

Estimates fidelity from ideal probabilities of observed bitstrings.

This estimator makes two assumptions. First, it assumes that the circuit
used in experiment is sufficiently scrambling that its output probabilities
follow the Porter-Thomas distribution. This assumption holds for typical
instances of random quantum circuits of sufficient depth. Second, it assumes
that the circuit uses enough qubits so that the Porter-Thomas distribution
can be approximated with the exponential distribution.

In practice the validity of these assumptions can be confirmed by plotting
a histogram of output probabilities and comparing it to the exponential
distribution.

The mean of this estimator is the true fidelity f and the variance is

    (1 + 2f - f^2) / M

where f is the fidelity and M the number of observations, equal to
len(probabilities). This is better than logarithmic XEB (see below)
when fidelity is f < 0.32. Since this estimator is unbiased, the
variance is equal to the mean squared error of the estimator.

The estimator is intended for use with xeb_fidelity() below.

Args:
    hilbert_space_dimension: Dimension of the Hilbert space on which
       the channel whose fidelity is being estimated is defined.
    probabilities: Ideal probabilities of bitstrings observed in
        experiment.
Returns:
    Estimate of fidelity associated with an experimental realization
    of a quantum circuit.

## `log_xeb_fidelity_from_probabilities`

```python
def log_xeb_fidelity_from_probabilities(hilbert_space_dimension: int, probabilities: Sequence[float]) -> float
```

Logarithmic XEB fidelity estimator.

Estimates fidelity from ideal probabilities of observed bitstrings.

See `linear_xeb_fidelity_from_probabilities` for the assumptions made
by this estimator.

The mean of this estimator is the true fidelity f and the variance is

    (pi^2/6 - f^2) / M

where f is the fidelity and M the number of observations, equal to
len(probabilities). This is better than linear XEB (see above) when
fidelity is f > 0.32. Since this estimator is unbiased, the variance
is equal to the mean squared error of the estimator.

The estimator is intended for use with xeb_fidelity() below.

Args:
    hilbert_space_dimension: Dimension of the Hilbert space on which
       the channel whose fidelity is being estimated is defined.
    probabilities: Ideal probabilities of bitstrings observed in
        experiment.
Returns:
    Estimate of fidelity associated with an experimental realization
    of a quantum circuit.

## `hog_score_xeb_fidelity_from_probabilities`

```python
def hog_score_xeb_fidelity_from_probabilities(hilbert_space_dimension: int, probabilities: Sequence[float]) -> float
```

XEB fidelity estimator based on normalized HOG score.

Estimates fidelity from ideal probabilities of observed bitstrings.

See `linear_xeb_fidelity_from_probabilities` for the assumptions made
by this estimator.

The mean of this estimator is the true fidelity f and the variance is

    (1/log(2)^2 - f^2) / M

where f is the fidelity and M the number of observations, equal to
len(probabilities). This is always worse than log XEB (see above).
Since this estimator is unbiased, the variance is equal to the mean
squared error of the estimator.

The estimator is intended for use with xeb_fidelity() below. It is
based on the HOG problem defined in https://arxiv.org/abs/1612.05903.

Args:
    hilbert_space_dimension: Dimension of the Hilbert space on which
       the channel whose fidelity is being estimated is defined.
    probabilities: Ideal probabilities of bitstrings observed in
        experiment.
Returns:
    Estimate of fidelity associated with an experimental realization
    of a quantum circuit.

## `xeb_fidelity`

```python
def xeb_fidelity(circuit: cirq.Circuit, bitstrings: Sequence[int], qubit_order: QubitOrderOrList=QubitOrder.DEFAULT, amplitudes: Mapping[int, complex] | np.ndarray | None=None, estimator: Callable[[int, Sequence[float]], float]=linear_xeb_fidelity_from_probabilities) -> float
```

Estimates XEB fidelity from one circuit using user-supplied estimator.

Fidelity quantifies the similarity of two quantum states. Here, we estimate
the fidelity between the theoretically predicted output state of circuit and
the state produced in its experimental realization. Note that we don't know
the latter state. Nevertheless, we can estimate the fidelity between the two
states from the knowledge of the bitstrings observed in the experiment.

In order to make the estimate more robust one should average the estimates
over many random circuits. The API supports per-circuit fidelity estimation
to enable users to examine the properties of estimate distribution over
many circuits.

See https://arxiv.org/abs/1608.00263 for more details.

Args:
    circuit: Random quantum circuit which has been executed on quantum
        processor under test.
    bitstrings: Results of terminal all-qubit measurements performed after
        each circuit execution as integer array where each integer is
        formed from measured qubit values according to `qubit_order` from
        most to least significant qubit, i.e. in the order consistent with
        `cirq.final_state_vector`.
    qubit_order: Qubit order used to construct bitstrings enumerating
        qubits starting with the most significant qubit.
    amplitudes: Optional mapping from bitstring to output amplitude or
        an array of amplitudes at bitstring indices.
        If provided, simulation is skipped. Useful for large circuits
        when an offline simulation had already been performed.
    estimator: Fidelity estimator to use, see above. Defaults to the
        linear XEB fidelity estimator.
Returns:
    Estimate of fidelity associated with an experimental realization of
    circuit which yielded measurements in bitstrings.
Raises:
    ValueError: Circuit is inconsistent with qubit order or one of the
        bitstrings is inconsistent with the number of qubits.

## `linear_xeb_fidelity`

```python
def linear_xeb_fidelity(circuit: cirq.Circuit, bitstrings: Sequence[int], qubit_order: QubitOrderOrList=QubitOrder.DEFAULT, amplitudes: Mapping[int, complex] | np.ndarray | None=None) -> float
```

Estimates XEB fidelity from one circuit using linear estimator.

## `log_xeb_fidelity`

```python
def log_xeb_fidelity(circuit: cirq.Circuit, bitstrings: Sequence[int], qubit_order: QubitOrderOrList=QubitOrder.DEFAULT, amplitudes: Mapping[int, complex] | np.ndarray | None=None) -> float
```

Estimates XEB fidelity from one circuit using logarithmic estimator.
