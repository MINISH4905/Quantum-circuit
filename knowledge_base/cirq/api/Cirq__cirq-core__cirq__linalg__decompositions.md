---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/linalg/decompositions.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/linalg/decompositions.py
license: Apache-2.0
---

## Module `cirq-core/cirq/linalg/decompositions.py`

Utility methods for breaking matrices into useful pieces.

## `deconstruct_single_qubit_matrix_into_angles`

```python
def deconstruct_single_qubit_matrix_into_angles(mat: np.ndarray) -> tuple[float, float, float]
```

Breaks down a 2x2 unitary into ZYZ angle parameters.

Given a unitary U, this function returns three angles: $\phi_0, \phi_1, \phi_2$,
such that:  $U = Z^{\phi_2 / \pi} Y^{\phi_1 / \pi} Z^{\phi_0/ \pi}$
for the Pauli matrices Y and Z.  That is, phasing around Z by $\phi_0$ radians,
then rotating around Y by $\phi_1$ radians, and then phasing again by
$\phi_2$ radians will produce the same effect as the original unitary.
(Note that the matrices are applied right to left.)

Args:
    mat: The 2x2 unitary matrix to break down.

Returns:
    A tuple containing the amount to phase around Z, then rotate around Y,
    then phase around Z (all in radians).

## `unitary_eig`

```python
def unitary_eig(matrix: np.ndarray, check_preconditions: bool=True, atol: float=1e-08) -> tuple[np.ndarray, np.ndarray]
```

Gives the guaranteed unitary eigendecomposition of a normal matrix.

All Hermitian and unitary matrices are normal matrices. This method was
introduced as for certain classes of unitary matrices (where the eigenvalues
are close to each other) the eigenvectors returned by `numpy.linalg.eig` are
not guaranteed to be orthogonal.
For more information, see https://github.com/numpy/numpy/issues/15461.

Args:
    matrix: A normal matrix. If not normal, this method is not
        guaranteed to return correct eigenvalues.  A normal matrix
        is one where $A A^\dagger = A^\dagger A$.
    check_preconditions: When true and matrix is not unitary,
        a `ValueError` is raised when the matrix is not normal.
    atol: The absolute tolerance when checking whether the original matrix
        was unitary.

Returns:
    A tuple of
        eigvals: The eigenvalues of `matrix`.
        V: The unitary matrix with the eigenvectors as columns.

Raises:
    ValueError: if the input matrix is not normal.

## `map_eigenvalues`

```python
def map_eigenvalues(matrix: np.ndarray, func: Callable[[complex], complex], *, atol: float=1e-08) -> np.ndarray
```

Applies a function to the eigenvalues of a matrix.

Given M = sum_k a_k |v_k><v_k|, returns f(M) = sum_k f(a_k) |v_k><v_k|.

Args:
    matrix: The matrix to modify with the function.
    func: The function to apply to the eigenvalues of the matrix.
    atol: Absolute threshold used when separating eigenspaces.

Returns:
    The transformed matrix.

## `kron_factor_4x4_to_2x2s`

```python
def kron_factor_4x4_to_2x2s(matrix: np.ndarray, rtol=1e-05, atol=1e-08) -> tuple[complex, np.ndarray, np.ndarray]
```

Splits a 4x4 matrix U = kron(A, B) into A, B, and a global factor.

Requires the matrix to be the kronecker product of two 2x2 unitaries.
Requires the matrix to have a non-zero determinant.

Args:
    matrix: The 4x4 unitary matrix to factor.
    rtol: Per-matrix-entry relative tolerance on equality.
    atol: Per-matrix-entry absolute tolerance on equality.

Returns:
    A scalar factor and a pair of 2x2 unit-determinant matrices. The
    kronecker product of all three is equal to the given matrix.

Raises:
    ValueError:
        The given matrix can't be tensor-factored into 2x2 pieces.

## `so4_to_magic_su2s`

```python
def so4_to_magic_su2s(mat: np.ndarray, *, rtol: float=1e-05, atol: float=1e-08, check_preconditions: bool=True) -> tuple[np.ndarray, np.ndarray]
```

Finds 2x2 special-unitaries A, B where mat = Mag.H @ kron(A, B) @ Mag.

Mag is the magic basis matrix:

    1  0  0  i
    0  i  1  0
    0  i -1  0     (times sqrt(0.5) to normalize)
    1  0  0 -i

Args:
    mat: A real 4x4 orthogonal matrix.
    rtol: Per-matrix-entry relative tolerance on equality.
    atol: Per-matrix-entry absolute tolerance on equality.
    check_preconditions: When set, the code verifies that the given
        matrix is from SO(4). Defaults to set.

Returns:
    A pair (A, B) of matrices in SU(2) such that Mag.H @ kron(A, B) @ Mag
    is approximately equal to the given matrix.

Raises:
    ValueError: Bad matrix.

## `AxisAngleDecomposition`

```python
class AxisAngleDecomposition
```

Represents a unitary operation as an axis, angle, and global phase.

The unitary $U$ is decomposed as follows:

    $$U = g e^{-i \theta/2 (xX + yY + zZ)}$$

where \theta is the rotation angle, (x, y, z) is a unit vector along the
rotation axis, and g is the global phase.

### `canonicalize`

```python
def canonicalize(self, atol: float=1e-08) -> AxisAngleDecomposition
```

Returns a standardized AxisAngleDecomposition with the same unitary.

Ensures the axis (x, y, z) satisfies x+y+z >= 0.
Ensures the angle theta satisfies -pi + atol < theta <= pi + atol.

Args:
    atol: Absolute tolerance for errors in the representation and the
        canonicalization. Determines how much larger a value needs to
        be than pi before it wraps into the negative range (so that
        approximation errors less than the tolerance do not cause sign
        instabilities).

Returns:
    The canonicalized AxisAngleDecomposition.

## `axis_angle`

```python
def axis_angle(single_qubit_unitary: np.ndarray) -> AxisAngleDecomposition
```

Decomposes a single-qubit unitary into axis, angle, and global phase.

Args:
    single_qubit_unitary: The unitary of the single-qubit operation to
        decompose.

Returns:
    An AxisAngleDecomposition equivalent to the given unitary.

## `KakDecomposition`

```python
class KakDecomposition
```

A convenient description of an arbitrary two-qubit operation.

Any two qubit operation U can be decomposed into the form

    U = g · (a1 ⊗ a0) · exp(i·(x·XX + y·YY + z·ZZ)) · (b1 ⊗ b0)

This class stores g, (b0, b1), (x, y, z), and (a0, a1).

Attributes:
    global_phase: g from the above equation.
    single_qubit_operations_before: b0, b1 from the above equation.
    interaction_coefficients: x, y, z from the above equation.
    single_qubit_operations_after: a0, a1 from the above equation.

References:
    'An Introduction to Cartan's KAK Decomposition for QC Programmers'
    https://arxiv.org/abs/quant-ph/0507171

### `__init__`

```python
def __init__(self, *, global_phase: complex=complex(1), single_qubit_operations_before: tuple[np.ndarray, np.ndarray] | None=None, interaction_coefficients: tuple[float, float, float], single_qubit_operations_after: tuple[np.ndarray, np.ndarray] | None=None)
```

Initializes a decomposition for a two-qubit operation U.

U = g · (a1 ⊗ a0) · exp(i·(x·XX + y·YY + z·ZZ)) · (b1 ⊗ b0)

Args:
    global_phase: g from the above equation.
    single_qubit_operations_before: b0, b1 from the above equation.
    interaction_coefficients: x, y, z from the above equation.
    single_qubit_operations_after: a0, a1 from the above equation.

## `scatter_plot_normalized_kak_interaction_coefficients`

```python
def scatter_plot_normalized_kak_interaction_coefficients(interactions: Iterable[np.ndarray | cirq.SupportsUnitary | KakDecomposition], *, include_frame: bool=True, ax: mplot3d.axes3d.Axes3D | None=None, **kwargs) -> mplot3d.axes3d.Axes3D
```

Plots the interaction coefficients of many two-qubit operations.

Plots:
    A point for the (x, y, z) normalized interaction coefficients of
    each interaction from the given interactions. The (x, y, z) coordinates
    are normalized so that the maximum value is at 1 instead of at pi/4.

    If `include_frame` is set to True, then a black wireframe outline of the
    canonicalized normalized KAK coefficient space. The space is defined by
    the following two constraints:

        0 <= abs(z) <= y <= x <= 1
        if x = 1 then z >= 0

    The wireframe includes lines along the surface of the space at z=0.

    The space is a prism with the identity at the origin, a crease along
    y=z=0 leading to the CZ/CNOT at x=1 and a vertical triangular face that
    contains the iswap at x=y=1,z=0 and the swap at x=y=z=1:

                             (x=1,y=1,z=0)
                         swap___iswap___swap (x=1,y=1,z=+-1)
                           _/\    |    /
                         _/   \   |   /
                       _/      \  |  /
                     _/         \ | /
                   _/            \|/
    (x=0,y=0,z=0) I---------------CZ (x=1,y=0,z=0)

Args:
    interactions: An iterable of two qubit unitary interactions. Each
        interaction can be specified as a raw 4x4 unitary matrix, or an
        object with a 4x4 unitary matrix according to `cirq.unitary` (
        (e.g. `cirq.CZ` or a `cirq.KakDecomposition` or a `cirq.Circuit`
        over two qubits).
    include_frame: Determines whether or not to draw the kak space
        wireframe. Defaults to `True`.
    ax: A matplotlib 3d axes object to plot into. If not specified, a new
        figure is created, plotted, and shown.

    **kwargs: Arguments forwarded into the call to `scatter` that plots the
        points. Working arguments include color `c='blue'`, scale `s=2`,
        labelling `label="theta=pi/4"`, etc. For reference see the
        `matplotlib.pyplot.scatter` documentation:
        https://matplotlib.org/3.1.1/api/_as_gen/matplotlib.pyplot.scatter.html

Returns:
    The matplotlib 3d axes object that was plotted into.

Examples:
    >>> ax = None
    >>> for y in np.linspace(0, 0.5, 4):
    ...     a, b = cirq.LineQubit.range(2)
    ...     circuits = [
    ...         cirq.Circuit(
    ...             cirq.CZ(a, b)**0.5,
    ...             cirq.X(a)**y, cirq.X(b)**x,
    ...             cirq.CZ(a, b)**0.5,
    ...             cirq.X(a)**x, cirq.X(b)**y,
    ...             cirq.CZ(a, b) ** 0.5,
    ...         )
    ...         for x in np.linspace(0, 1, 25)
    ...     ]
    ...     ax = cirq.scatter_plot_normalized_kak_interaction_coefficients(
    ...         circuits,
    ...         include_frame=ax is None,
    ...         ax=ax,
    ...         s=1,
    ...         label=f'y={y:0.2f}')
    >>> _ = ax.legend()
    >>> import matplotlib.pyplot as plt
    >>> plt.show()

## `kak_canonicalize_vector`

```python
def kak_canonicalize_vector(x: float, y: float, z: float, atol: float=1e-09) -> KakDecomposition
```

Canonicalizes an XX/YY/ZZ interaction by swap/negate/shift-ing axes.

Args:
    x: The strength of the XX interaction.
    y: The strength of the YY interaction.
    z: The strength of the ZZ interaction.
    atol: How close x2 must be to π/4 to guarantee z2 >= 0

Returns:
    The canonicalized decomposition, with vector coefficients (x2, y2, z2)
    satisfying:

        0 ≤ abs(z2) ≤ y2 ≤ x2 ≤ π/4
        if x2 = π/4, z2 >= 0

    Guarantees that the implied output matrix:

        g · (a1 ⊗ a0) · exp(i·(x2·XX + y2·YY + z2·ZZ)) · (b1 ⊗ b0)

    is approximately equal to the implied input matrix:

        exp(i·(x·XX + y·YY + z·ZZ))

## `kak_decomposition`

```python
def kak_decomposition(unitary_object: np.ndarray | cirq.SupportsUnitary | cirq.Gate | cirq.Operation | KakDecomposition, *, rtol: float=1e-05, atol: float=1e-08, check_preconditions: bool=True) -> KakDecomposition
```

Decomposes a 2-qubit unitary into 1-qubit ops and XX/YY/ZZ interactions.

Args:
    unitary_object: The value to decompose. Can either be a 4x4 unitary
        matrix, or an object that has a 4x4 unitary matrix (via the
        `cirq.SupportsUnitary` protocol).
    rtol: Per-matrix-entry relative tolerance on equality.
    atol: Per-matrix-entry absolute tolerance on equality.
    check_preconditions: If set, verifies that the input corresponds to a
        4x4 unitary before decomposing.

Returns:
    A `cirq.KakDecomposition` canonicalized such that the interaction
    coefficients x, y, z satisfy:

        0 ≤ abs(z2) ≤ y2 ≤ x2 ≤ π/4
        if x2 = π/4, z2 >= 0

Raises:
    ValueError: Bad matrix.
    ArithmeticError: Failed to perform the decomposition.

References:
    'An Introduction to Cartan's KAK Decomposition for QC Programmers'
    https://arxiv.org/abs/quant-ph/0507171

## `kak_vector`

```python
def kak_vector(unitary: Iterable[np.ndarray] | np.ndarray, *, rtol: float=1e-05, atol: float=1e-08, check_preconditions: bool=True) -> np.ndarray
```

Compute the KAK vectors of one or more two qubit unitaries.

Any 2 qubit unitary may be expressed as

$$ U = k_l A k_r $$
where $k_l, k_r$ are single qubit (local) unitaries and

$$ A= \exp \left(i \sum_{s=x,y,z} k_s \sigma_{s}^{(0)} \sigma_{s}^{(1)}
             \right) $$

The vector entries are ordered such that
    $$ 0 ≤ |k_z| ≤ k_y ≤ k_x ≤ π/4 $$
if $k_x$ = π/4, $k_z \geq 0$.

References:
    The appendix section of "Lower bounds on the complexity of simulating
    quantum gates".
    http://arxiv.org/abs/quant-ph/0307190v1

Examples:
    >>> cirq.kak_vector(np.eye(4))
    array([0., 0., 0.])
    >>> unitaries = [cirq.unitary(cirq.CZ),cirq.unitary(cirq.ISWAP)]
    >>> cirq.kak_vector(unitaries) * 4 / np.pi
    array([[ 1.,  0., -0.],
           [ 1.,  1.,  0.]])

Args:
    unitary: A unitary matrix, or a multi-dimensional array of unitary
        matrices. Must have shape (..., 4, 4), where the last two axes are
        for the unitary matrix and other axes are for broadcasting the kak
        vector computation.
    rtol: Per-matrix-entry relative tolerance on equality. Used in unitarity
        check of input.
    atol: Per-matrix-entry absolute tolerance on equality. Used in unitarity
        check of input. This also determines how close $k_x$ must be to π/4
        to guarantee $k_z$ ≥ 0. Must be non-negative.
    check_preconditions: When set to False, skips verifying that the input
        is unitary in order to increase performance.

Returns:
    The KAK vector of the given unitary or unitaries. The output shape is
    the same as the input shape, except the two unitary matrix axes are
    replaced by the kak vector axis (i.e. the output has shape
    `unitary.shape[:-2] + (3,)`).

Raises:
    ValueError: If `atol` is negative or if the unitary has the wrong shape.

## `num_cnots_required`

```python
def num_cnots_required(u: np.ndarray, atol: float=1e-08) -> int
```

Returns the min number of CNOT/CZ gates required by a two-qubit unitary.

See Proposition III.1, III.2, III.3 in Shende et al. “Recognizing Small-
Circuit Structure in Two-Qubit Operators and Timing Hamiltonians to Compute
Controlled-Not Gates”.  https://arxiv.org/abs/quant-ph/0308045

Args:
    u: A two-qubit unitary.
    atol: The absolute tolerance used to make this judgement.

Returns:
    The number of CNOT or CZ gates required to implement the unitary.

Raises:
    ValueError: If the shape of `u` is not 4 by 4.

## `extract_right_diag`

```python
def extract_right_diag(u: np.ndarray) -> np.ndarray
```

Extract a diagonal unitary from a 3-CNOT two-qubit unitary.

Returns a 2-CNOT unitary D that is diagonal, so that U @ D needs only
two CNOT gates in case the original unitary is a 3-CNOT unitary.

See Proposition V.2 in Minimal Universal Two-Qubit CNOT-based Circuits.
https://arxiv.org/abs/quant-ph/0308033

Args:
    u: three-CNOT two-qubit unitary
Returns:
    diagonal extracted from U
