---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/unitary/aqc/fast_gradient/layer.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/unitary/aqc/fast_gradient/layer.py
license: Apache-2.0
---

## Module `qiskit/synthesis/unitary/aqc/fast_gradient/layer.py`

Layer classes for the fast gradient implementation.

## `LayerBase`

```python
class LayerBase(ABC)
```

Base class for any layer implementation. Each layer here is represented
by a 2x2 or 4x4 gate matrix ``G`` (applied to 1 or 2 qubits respectively)
interleaved with the identity ones:
``Layer = I kron I kron ... kron G kron ... kron I kron I``

### `set_from_matrix`

```python
def set_from_matrix(self, mat: np.ndarray)
```

Updates this layer from an external gate matrix.

Args:
    mat: external gate matrix that initializes this layer's one.

### `get_attr`

```python
def get_attr(self) -> tuple[np.ndarray, np.ndarray, np.ndarray]
```

Returns gate matrix, direct and inverse permutations.

Returns:
    (1) gate matrix; (2) direct permutation; (3) inverse permutations.

## `Layer1Q`

```python
class Layer1Q(LayerBase)
```

Layer represents a simple circuit where 1-qubit gate matrix (of size 2x2)
interleaves with the identity ones.

### `__init__`

```python
def __init__(self, num_qubits: int, k: int, g2x2: np.ndarray | None=None)
```

Args:
    num_qubits: number of qubits.
    k: index of the bit where gate is applied.
    g2x2: 2x2 matrix that makes up this layer along with identity ones,
          or None (should be set up later).

### `set_from_matrix`

```python
def set_from_matrix(self, mat: np.ndarray)
```

See base class description.

### `get_attr`

```python
def get_attr(self) -> tuple[np.ndarray, np.ndarray, np.ndarray]
```

See base class description.

## `Layer2Q`

```python
class Layer2Q(LayerBase)
```

Layer represents a simple circuit where 2-qubit gate matrix (of size 4x4)
interleaves with the identity ones.

### `__init__`

```python
def __init__(self, num_qubits: int, j: int, k: int, g4x4: np.ndarray | None=None)
```

Args:
    num_qubits: number of qubits.
    j: index of the first (control) bit.
    k: index of the second (target) bit.
    g4x4: 4x4 matrix that makes up this layer along with identity ones,
          or None (should be set up later).

### `set_from_matrix`

```python
def set_from_matrix(self, mat: np.ndarray)
```

See base class description.

### `get_attr`

```python
def get_attr(self) -> tuple[np.ndarray, np.ndarray, np.ndarray]
```

See base class description.

## `init_layer1q_matrices`

```python
def init_layer1q_matrices(thetas: np.ndarray, dst: np.ndarray) -> np.ndarray
```

Initializes 2x2 matrices of 1-qubit gates defined in the paper.

Args:
    thetas: n x 3 matrix of gate parameters for every qubit, where
            "n" is the number of qubits.
    dst: destination array of size n x 2 x 2 that will receive gate
         matrices of each qubit.

Returns:
    Returns the "dst" array.

## `init_layer1q_deriv_matrices`

```python
def init_layer1q_deriv_matrices(thetas: np.ndarray, dst: np.ndarray) -> np.ndarray
```

Initializes 2x2 derivative matrices of 1-qubit gates defined in the paper.

Args:
    thetas: n x 3 matrix of gate parameters for every qubit, where
            "n" is the number of qubits.
    dst: destination array of size n x 3 x 2 x 2 that will receive gate
         derivative matrices of each qubit; there are 3 parameters per gate,
         hence, 3 derivative matrices per qubit.

Returns:
    Returns the "dst" array.

## `init_layer2q_matrices`

```python
def init_layer2q_matrices(thetas: np.ndarray, dst: np.ndarray) -> np.ndarray
```

Initializes 4x4 matrices of 2-qubit gates defined in the paper.

Args:
    thetas: depth x 4 matrix of gate parameters for every layer, where
            "depth" is the number of layers.
    dst: destination array of size depth x 4 x 4 that will receive gate
         matrices of each layer.

Returns:
    Returns the "dst" array.

## `init_layer2q_deriv_matrices`

```python
def init_layer2q_deriv_matrices(thetas: np.ndarray, dst: np.ndarray) -> np.ndarray
```

Initializes 4 x 4 derivative matrices of 2-qubit gates defined in the paper.

Args:
    thetas: depth x 4 matrix of gate parameters for every layer, where
            "depth" is the number of layers.
    dst: destination array of size depth x 4 x 4 x 4 that will receive gate
         derivative matrices of each layer; there are 4 parameters per gate,
         hence, 4 derivative matrices per layer.

Returns:
    Returns the "dst" array.
