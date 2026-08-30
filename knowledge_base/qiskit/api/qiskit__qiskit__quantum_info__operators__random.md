---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/random.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/random.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/random.py`

Methods to create random operators.

## `random_unitary`

```python
def random_unitary(dims: int | tuple, seed: int | np.random.Generator | None=None)
```

Return a random unitary Operator.

The operator is sampled from the unitary Haar measure.

Args:
    dims (int or tuple): the input dimensions of the Operator.
    seed (int or np.random.Generator): Optional. Set a fixed seed or
                                       generator for RNG.

Returns:
    Operator: a unitary operator.

## `random_hermitian`

```python
def random_hermitian(dims: int | tuple, traceless: bool=False, seed: int | np.random.Generator | None=None)
```

Return a random hermitian Operator.

The operator is sampled from Gaussian Unitary Ensemble.

Args:
    dims (int or tuple): the input dimension of the Operator.
    traceless (bool): Optional. If True subtract diagonal entries to
                      return a traceless hermitian operator
                      (Default: False).
    seed (int or np.random.Generator): Optional. Set a fixed seed or
                                       generator for RNG.

Returns:
    Operator: a Hermitian operator.

## `random_quantum_channel`

```python
def random_quantum_channel(input_dims: int | tuple | None=None, output_dims: int | tuple | None=None, rank: int | None=None, seed: int | np.random.Generator | None=None)
```

Return a random CPTP quantum channel.

This constructs the Stinespring operator for the quantum channel by
sampling a random isometry from the unitary Haar measure.

Args:
    input_dims (int or tuple): the input dimension of the channel.
    output_dims (int or tuple): the output dimension of the channel.
    rank (int): Optional. The rank of the quantum channel Choi-matrix.
    seed (int or np.random.Generator): Optional. Set a fixed seed or
                                       generator for RNG.

Returns:
    Stinespring: a quantum channel operator.

Raises:
    QiskitError: if rank or dimensions are invalid.
