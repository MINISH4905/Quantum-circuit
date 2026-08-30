---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/unitary/aqc/fast_gradient/fast_grad_utils.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/unitary/aqc/fast_gradient/fast_grad_utils.py
license: Apache-2.0
---

## Module `qiskit/synthesis/unitary/aqc/fast_gradient/fast_grad_utils.py`

Utility functions in the fast gradient implementation.

## `is_permutation`

```python
def is_permutation(x: np.ndarray) -> bool
```

Checks if array is really an index permutation.

Args:
    x: 1D-array of integers that supposedly represents a permutation.

Returns:
    True, if array is really a permutation of indices.

## `reverse_bits`

```python
def reverse_bits(x: int | np.ndarray, nbits: int, enable: bool) -> int | np.ndarray
```

Reverses the bit order in a number of ``nbits`` length.
If ``x`` is an array, then operation is applied to every entry.

Args:
    x: either a single integer or an array of integers.
    nbits: number of meaningful bits in the number x.
    enable: apply reverse operation, if enabled, otherwise leave unchanged.

Returns:
    a number or array of numbers with reversed bits.

## `swap_bits`

```python
def swap_bits(num: int, a: int, b: int) -> int
```

Swaps the bits at positions 'a' and 'b' in the number 'num'.

Args:
    num: an integer number where bits should be swapped.
    a: index of the first bit to be swapped.
    b: index of the second bit to be swapped.

Returns:
    the number with swapped bits.

## `bit_permutation_1q`

```python
def bit_permutation_1q(n: int, k: int) -> np.ndarray
```

Constructs index permutation that brings a circuit consisting of a single
1-qubit gate to "standard form": ``kron(I(2^n/2), G)``, as we call it. Here n
is the number of qubits, ``G`` is a 2x2 gate matrix, ``I(2^n/2)`` is the identity
matrix of size ``(2^n/2)x(2^n/2)``, and the full size of the circuit matrix is
``(2^n)x(2^n)``. Circuit matrix in standard form becomes block-diagonal (with
sub-matrices ``G`` on the main diagonal). Multiplication of such a matrix and
a dense one is much faster than generic dense-dense product. Moreover,
we do not need to keep the entire circuit matrix in memory but just 2x2 ``G``
one. This saves a lot of memory when the number of qubits is large.

Args:
    n: number of qubits.
    k: index of qubit where single 1-qubit gate is applied.

Returns:
    permutation that brings the whole layer to the standard form.

## `bit_permutation_2q`

```python
def bit_permutation_2q(n: int, j: int, k: int) -> np.ndarray
```

Constructs index permutation that brings a circuit consisting of a single
2-qubit gate to "standard form": ``kron(I(2^n/4), G)``, as we call it. Here ``n``
is the number of qubits, ``G`` is a 4x4 gate matrix, ``I(2^n/4)`` is the identity
matrix of size ``(2^n/4)x(2^n/4)``, and the full size of the circuit matrix is
``(2^n)x(2^n)``. Circuit matrix in standard form becomes block-diagonal (with
sub-matrices ``G`` on the main diagonal). Multiplication of such a matrix and
a dense one is much faster than generic dense-dense product. Moreover,
we do not need to keep the entire circuit matrix in memory but just 4x4 ``G``
one. This saves a lot of memory when the number of qubits is large.

Args:
    n: number of qubits.
    j: index of control qubit where single 2-qubit gate is applied.
    k: index of target qubit where single 2-qubit gate is applied.

Returns:
    permutation that brings the whole layer to the standard form.

## `inverse_permutation`

```python
def inverse_permutation(perm: np.ndarray) -> np.ndarray
```

Returns inverse permutation.

Args:
    perm: permutation to be reversed.

Returns:
    inverse permutation.

## `make_rx`

```python
def make_rx(phi: float, out: np.ndarray) -> np.ndarray
```

Makes a 2x2 matrix that corresponds to X-rotation gate.
This is a fast implementation that does not allocate the output matrix.

Args:
    phi: rotation angle.
    out: placeholder for the result (2x2, complex-valued matrix).

Returns:
    rotation gate, same object as referenced by "out".

## `make_ry`

```python
def make_ry(phi: float, out: np.ndarray) -> np.ndarray
```

Makes a 2x2 matrix that corresponds to Y-rotation gate.
This is a fast implementation that does not allocate the output matrix.

Args:
    phi: rotation angle.
    out: placeholder for the result (2x2, complex-valued matrix).

Returns:
    rotation gate, same object as referenced by "out".

## `make_rz`

```python
def make_rz(phi: float, out: np.ndarray) -> np.ndarray
```

Makes a 2x2 matrix that corresponds to Z-rotation gate.
This is a fast implementation that does not allocate the output matrix.

Args:
    phi: rotation angle.
    out: placeholder for the result (2x2, complex-valued matrix).

Returns:
    rotation gate, same object as referenced by "out".
