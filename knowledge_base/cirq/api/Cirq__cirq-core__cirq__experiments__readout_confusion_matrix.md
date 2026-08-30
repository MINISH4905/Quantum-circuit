---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/experiments/readout_confusion_matrix.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/experiments/readout_confusion_matrix.py
license: Apache-2.0
---

## Module `cirq-core/cirq/experiments/readout_confusion_matrix.py`

Utilities to compute readout confusion matrix and use it for readout error mitigation.

## `TensoredConfusionMatrices`

```python
class TensoredConfusionMatrices
```

Store and use confusion matrices for readout error mitigation on sets of qubits.

The confusion matrix (CM) for one qubit is:

    [ Pr(0|0) Pr(0|1) ]
    [ Pr(1|0) Pr(1|1) ]

where Pr(i | j) = Probability of observing state "i" given state "j" was prepared.

Similarly, the confusion matrix for two qubits is:

    ⎡ Pr(00|00) Pr(01|00) Pr(10|00) Pr(11|00) ⎤
    ⎢ Pr(00|01) Pr(01|01) Pr(10|01) Pr(11|01) ⎥
    ⎢ Pr(00|10) Pr(01|10) Pr(10|10) Pr(11|10) ⎥
    ⎣ Pr(00|11) Pr(01|11) Pr(10|11) Pr(11|11) ⎦

where Pr(ij | pq) = Probability of observing “ij” given state “pq” was prepared.

This class can be used to
 - Store a list of confusion matrices computed for a list of qubit patterns.
 - Build a single confusion / correction matrix for entire set of calibrated qubits using the
   smaller individual confusion matrices for specific qubit patterns.
 - Apply readout corrections to observed frequencies / output probabilities.

Use `cirq.measure_confusion_matrix(sampler, qubits, repetitions)` to perform
an experiment on `sampler` and construct the `cirq.TensoredConfusionMatrices` object.

### `__init__`

```python
def __init__(self, confusion_matrices: np.ndarray | Sequence[np.ndarray], measure_qubits: Sequence[cirq.Qid] | Sequence[Sequence[cirq.Qid]], *, repetitions: int, timestamp: float)
```

Initializes `cirq.TensoredConfusionMatrices`.

`confusion_matrices[i]` should correspond to the qubit sequence `measure_qubits[i]`.

Args:
    confusion_matrices: Sequence of confusion matrices, computed for qubit patterns present
                        in `measure_qubits`. A single confusion matrix is also accepted.
    measure_qubits: Sequence of smaller qubit patterns, for which the confusion matrices
                    were computed. A single qubit pattern is also accepted. Note that
                    each qubit pattern is a sequence of qubits used to label the axes of
                    the corresponding confusion matrix.
    repetitions:    The number of repetitions that were used to estimate the confusion
                    matrices.
    timestamp:      The time the data was taken, in seconds since the epoch. This will be
                    zero for fake data (i.e. data not generated from an experiment).

Raises:
    ValueError: If length of `confusion_matrices` and `measure_qubits` is different or if
                the shape of any confusion matrix does not match the corresponding qubit
                pattern.

### `from_measurement`

```python
def from_measurement(cls, gate: ops.MeasurementGate, qubits: Sequence[cirq.Qid]) -> TensoredConfusionMatrices
```

Generates TCM for the confusion map in a MeasurementGate.

This ignores any invert_mask defined for the gate - it only replicates the confusion map.

Args:
    gate: the MeasurementGate to match.
    qubits: qubits the gate is applied to.

Returns:
    TensoredConfusionMatrices matching the confusion map of the given gate.

Raises:
    ValueError: if the gate has no confusion map.

### `repetitions`

```python
def repetitions(self) -> int
```

The number of repetitions that were used to estimate the confusion matrices.

### `timestamp`

```python
def timestamp(self) -> float
```

The time the data for confusion matrix estimation was taken, in seconds since epoch.

### `confusion_matrices`

```python
def confusion_matrices(self) -> tuple[np.ndarray, ...]
```

List of confusion matrices corresponding to `measure_qubits` qubit pattern.

### `measure_qubits`

```python
def measure_qubits(self) -> tuple[tuple[cirq.Qid, ...], ...]
```

Calibrated qubit pattern for which individual confusion matrices were computed.

### `qubits`

```python
def qubits(self) -> tuple[cirq.Qid, ...]
```

Sorted list of all calibrated qubits.

### `confusion_matrix`

```python
def confusion_matrix(self, qubits: Sequence[cirq.Qid] | None=None) -> np.ndarray
```

Returns a single confusion matrix constructed for the given set of qubits.

The single `2 ** len(qubits) x 2 ** len(qubits)` confusion matrix is constructed
using the individual smaller `self.confusion_matrices` by applying necessary
matrix transpose / kron / partial trace operations.

Args:
    qubits: The qubits representing the subspace for which a confusion matrix should be
            constructed. By default, uses all qubits in sorted order, i.e. `self.qubits`.
            Note that ordering of qubits sets the basis ordering of the returned matrix.

Returns:
    Confusion matrix for subspace corresponding to `qubits`.

Raises:
    ValueError: If `qubits` is not a subset of `self.qubits`.

### `correction_matrix`

```python
def correction_matrix(self, qubits: Sequence[cirq.Qid] | None=None) -> np.ndarray
```

Returns a single correction matrix constructed for the given set of qubits.

A correction matrix is the inverse of confusion matrix and can be used to apply corrections
to observed frequencies / probabilities to compensate for the readout error.
A Moore–Penrose Pseudo inverse of the confusion matrix is computed to get the correction
matrix.

Args:
    qubits: The qubits representing the subspace for which a correction matrix should be
            constructed. By default, uses all qubits in sorted order, i.e. `self.qubits`.
            Note that ordering of qubits sets the basis ordering of the returned matrix.

Returns:
    Correction matrix for subspace corresponding to `qubits`.

Raises:
    ValueError: If `qubits` is not a subset of `self.qubits`.

### `apply`

```python
def apply(self, result: np.ndarray, qubits: Sequence[cirq.Qid] | None=None, *, method='least_squares') -> np.ndarray
```

Applies corrections to the observed `result` to compensate for readout error on qubits.

The compensation can applied by the following methods:
 1. 'pseudo_inverse': The result is multiplied by the correction matrix, which is pseudo
                      inverse of confusion matrix corresponding to the subspace defined by
                      `qubits`.
 2. 'least_squares': Solves a constrained minimization problem to find optimal `x` s.t.
                        a) x >= 0
                        b) sum(x) == sum(result) and
                        c) sum((result - x @ confusion_matrix) ** 2) is minimized.

Args:
    result: `(2 ** len(qubits), )` shaped numpy array containing observed frequencies /
            probabilities.
    qubits: Sequence of qubits used for sampling to get `result`. By default, uses all
            qubits in sorted order, i.e. `self.qubits`. Note that ordering of qubits sets
            the basis ordering for the `result` argument.
    method: Correction Method. Should be either 'pseudo_inverse' or 'least_squares'.
            Equal to `least_squares` by default.

Returns:
      `(2 ** len(qubits), )` shaped numpy array corresponding to `result` with corrections.

Raises:
    ValueError: If `result.shape` != `(2 ** len(qubits),)`.
    ValueError: If `least_squares` constrained minimization problem does not converge.

### `readout_mitigation_pauli_uncorrelated`

```python
def readout_mitigation_pauli_uncorrelated(self, qubits: Sequence[cirq.Qid], measured_bitstrings: np.ndarray) -> tuple[float, float]
```

Uncorrelated readout error mitigation for a multi-qubit Pauli operator.

This function scalably performs readout error mitigation on an arbitrary-length Pauli
operator. It is a reimplementation of https://github.com/eliottrosenberg/correlated_SPAM
but specialized to the case in which readout is uncorrelated. We require that the confusion
matrix is a tensor product of single-qubit confusion matrices. We then invert the confusion
matrix by inverting each of the $C^{(q)}$ Then, in a bit-by-bit fashion, we apply the
inverses of the single-site confusion matrices to the bits of the measured bitstring,
contract them with the single-site Pauli operator, and take the product over all of the
bits. This could be generalized to tensor product spaces that are larger than single qubits,
but the essential simplification is that each tensor product space is small, so that none of
the response matrices is exponentially large.

This can result in mitigated Pauli operators that are not in the range [-1, 1], but if
the readout error is indeed uncorrelated and well-characterized, then it should converge
to being within this range. Results are improved both by a more precise characterization
of the response matrices (whose statistical uncertainty is not accounted for in the error
propagation here) and by increasing the number of measured bitstrings.

Args:
    qubits: The qubits on which the Pauli operator acts.
    measured_bitstrings: The experimentally measured bitstrings in the eigenbasis of the
        Pauli operator. measured_bitstrings[i,j] is the ith bitstring, qubit j.

Returns:
    The error-mitigated expectation value of the Pauli operator and its statistical
    uncertainty (not including the uncertainty in the confusion matrices for now).

Raises:
    NotImplementedError: If the confusion matrix is not a tensor product of single-qubit
                         confusion matrices for all of `qubits`.

## `measure_confusion_matrix`

```python
def measure_confusion_matrix(sampler: cirq.Sampler, qubits: Sequence[cirq.Qid] | Sequence[Sequence[cirq.Qid]], repetitions: int=1000) -> TensoredConfusionMatrices
```

Prepares `TensoredConfusionMatrices` for the n qubits in the input.

The confusion matrix (CM) for two qubits is the following matrix:

    ⎡ Pr(00|00) Pr(01|00) Pr(10|00) Pr(11|00) ⎤
    ⎢ Pr(00|01) Pr(01|01) Pr(10|01) Pr(11|01) ⎥
    ⎢ Pr(00|10) Pr(01|10) Pr(10|10) Pr(11|10) ⎥
    ⎣ Pr(00|11) Pr(01|11) Pr(10|11) Pr(11|11) ⎦

where Pr(ij | pq) = Probability of observing “ij” given state “pq” was prepared.

Args:
    sampler: Sampler to collect the data from.
    qubits: Qubits for which the confusion matrix should be measured.
    repetitions: Number of times to sample each circuit for a confusion matrix row.
