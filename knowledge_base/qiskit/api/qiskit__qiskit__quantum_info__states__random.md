---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/states/random.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/states/random.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/states/random.py`

Random state generation.

## `random_statevector`

```python
def random_statevector(dims: int | tuple, seed: int | np.random.Generator | None=None) -> Statevector
```

Generate a random Statevector.

The statevector is sampled from the uniform distribution. This is the measure
induced by the Haar measure on unitary matrices.

Args:
    dims (int or tuple): the dimensions of the state.
    seed (int or np.random.Generator): Optional. Set a fixed seed or
                                       generator for RNG.

Returns:
    Statevector: the random statevector.

Reference:
    K. Zyczkowski and H. Sommers (2001), "Induced measures in the space of mixed quantum states",
    `J. Phys. A: Math. Gen. 34 7111 <https://arxiv.org/abs/quant-ph/0012101>`__.

## `random_density_matrix`

```python
def random_density_matrix(dims: int | tuple, rank: int | None=None, method: Literal['Hilbert-Schmidt', 'Bures']='Hilbert-Schmidt', seed: int | np.random.Generator | None=None) -> DensityMatrix
```

Generate a random density matrix.

Args:
    dims (int or tuple): the dimensions of the DensityMatrix.
    rank (int or None):  the rank of the density matrix.
                        The default value is full-rank.
    method (string): Optional. The method to use.
        'Hilbert-Schmidt': (Default) sample from the Hilbert-Schmidt metric.
        'Bures': sample from the Bures metric.
    seed (int or np.random.Generator): Optional. Set a fixed seed or
                                       generator for RNG.

Returns:
    DensityMatrix: the random density matrix.

Raises:
    QiskitError: if the method is not valid.
