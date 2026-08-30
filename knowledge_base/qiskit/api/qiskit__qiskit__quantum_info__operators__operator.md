---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/operator.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/operator.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/operator.py`

Matrix Operator class.

## `Operator`

```python
class Operator(LinearOp)
```

Matrix operator class

This represents a matrix operator :math:`M` that will
:meth:`~Statevector.evolve` a :class:`Statevector` :math:`|\psi\rangle`
by matrix-vector multiplication

.. math::

    |\psi\rangle \mapsto M|\psi\rangle,

and will :meth:`~DensityMatrix.evolve` a :class:`DensityMatrix` :math:`\rho`
by left and right multiplication

.. math::

    \rho \mapsto M \rho M^\dagger.

For example, the following operator :math:`M = X` applied to the zero state
:math:`|\psi\rangle=|0\rangle (\rho = |0\rangle\langle 0|)` changes it to the
one state :math:`|\psi\rangle=|1\rangle (\rho = |1\rangle\langle 1|)`:

.. plot::
   :include-source:
   :nofigs:

    >>> import numpy as np
    >>> from qiskit.quantum_info import Operator
    >>> op = Operator(np.array([[0.0, 1.0], [1.0, 0.0]]))  # Represents Pauli X operator

    >>> from qiskit.quantum_info import Statevector
    >>> sv = Statevector(np.array([1.0, 0.0]))
    >>> sv.evolve(op)
    Statevector([0.+0.j, 1.+0.j],
                dims=(2,))

    >>> from qiskit.quantum_info import DensityMatrix
    >>> dm = DensityMatrix(np.array([[1.0, 0.0], [0.0, 0.0]]))
    >>> dm.evolve(op)
    DensityMatrix([[0.+0.j, 0.+0.j],
                [0.+0.j, 1.+0.j]],
                dims=(2,))

### `__init__`

```python
def __init__(self, data: QuantumCircuit | Operation | BaseOperator | np.ndarray, input_dims: tuple | None=None, output_dims: tuple | None=None)
```

Initialize an operator object.

Args:
    data: data to initialize operator.
    input_dims: the input subsystem dimensions.
    output_dims: the output subsystem dimensions.

Raises:
    QiskitError: if input data cannot be initialized as an operator.

Additional Information:
    If the input or output dimensions are None, they will be
    automatically determined from the input data. If the input data is
    a Numpy array of shape (2**N, 2**N) qubit systems will be used. If
    the input operator is not an N-qubit operator, it will assign a
    single subsystem with dimension specified by the shape of the input.
    Note that two operators initialized via this method are only considered equivalent if they
    match up to their canonical qubit order (or: permutation). See :meth:`.Operator.from_circuit`
    to specify a different qubit permutation.

### `__eq__`

```python
def __eq__(self, other)
```

Test if two Operators are equal.

### `data`

```python
def data(self)
```

The underlying Numpy array.

### `settings`

```python
def settings(self)
```

Return operator settings.

### `draw`

```python
def draw(self, output=None, **drawer_args)
```

Return a visualization of the Operator.

**repr**: String of the state's ``__repr__``.

**text**: ASCII TextMatrix that can be printed in the console.

**latex**: An IPython Latex object for displaying in Jupyter Notebooks.

**latex_source**: Raw, uncompiled ASCII source to generate array using LaTeX.

Args:
    output (str): Select the output method to use for drawing the
        state. Valid choices are `repr`, `text`, `latex`, `latex_source`,
        Default is `repr`.
    drawer_args: Arguments to be passed directly to the relevant drawing
        function or constructor (`TextMatrix()`, `array_to_latex()`).
        See the relevant function under `qiskit.visualization` for that function's
        documentation.

Returns:
    :class:`str` or :class:`TextMatrix` or :class:`IPython.display.Latex`:
    Drawing of the Operator.

Raises:
    ValueError: when an invalid output method is selected.
    MissingOptionalLibrary: If SymPy isn't installed and ``'latex'`` or
        ``'latex_source'`` is selected for ``output``.

### `from_label`

```python
def from_label(cls, label: str) -> Operator
```

Return a tensor product of single-qubit operators.

Args:
    label (string): single-qubit operator string.

Returns:
    Operator: The N-qubit operator.

Raises:
    QiskitError: if the label contains invalid characters, or the
                 length of the label is larger than an explicitly
                 specified num_qubits.

Additional Information:
    The labels correspond to the single-qubit matrices:
    'I': [[1, 0], [0, 1]]
    'X': [[0, 1], [1, 0]]
    'Y': [[0, -1j], [1j, 0]]
    'Z': [[1, 0], [0, -1]]
    'H': [[1, 1], [1, -1]] / sqrt(2)
    'S': [[1, 0], [0 , 1j]]
    'T': [[1, 0], [0, (1+1j) / sqrt(2)]]
    '0': [[1, 0], [0, 0]]
    '1': [[0, 0], [0, 1]]
    '+': [[0.5, 0.5], [0.5 , 0.5]]
    '-': [[0.5, -0.5], [-0.5 , 0.5]]
    'r': [[0.5, -0.5j], [0.5j , 0.5]]
    'l': [[0.5, 0.5j], [-0.5j , 0.5]]

### `apply_permutation`

```python
def apply_permutation(self, perm: list, front: bool=False) -> Operator
```

Modifies operator's data by composing it with a permutation.

Args:
    perm (list): permutation pattern, describing which qubits
        occupy the positions 0, 1, 2, etc. after applying the permutation.
    front (bool): When set to ``True`` the permutation is applied before the
        operator, when set to ``False`` the permutation is applied after the
        operator.
Returns:
    Operator: The modified operator.

Raises:
    QiskitError: if the size of the permutation pattern does not match the
        dimensions of the operator.

### `from_circuit`

```python
def from_circuit(cls, circuit: QuantumCircuit, ignore_set_layout: bool=False, layout: Layout | None=None, final_layout: Layout | None=None) -> Operator
```

Create a new Operator object from a :class:`.QuantumCircuit`

While a :class:`~.QuantumCircuit` object can passed directly as ``data``
to the class constructor this provides no options on how the circuit
is used to create an :class:`.Operator`. This constructor method lets
you control how the :class:`.Operator` is created so it can be adjusted
for a particular use case.

By default this constructor method will permute the qubits based on a
configured initial layout (i.e. after it was transpiled). It also
provides an option to manually provide a :class:`.Layout` object
directly.

Args:
    circuit (QuantumCircuit): The :class:`.QuantumCircuit` to create an Operator
        object from.
    ignore_set_layout (bool): When set to ``True`` if the input ``circuit``
        has a layout set it will be ignored
    layout (Layout): If specified this kwarg can be used to specify a
        particular layout to use to permute the qubits in the created
        :class:`.Operator`. If this is specified it will be used instead
        of a layout contained in the ``circuit`` input. If specified
        the virtual bits in the :class:`~.Layout` must be present in the
        ``circuit`` input.
    final_layout (Layout): If specified this kwarg can be used to represent the
        output permutation caused by swap insertions during the routing stage
        of the transpiler.
Returns:
    Operator: An operator representing the input circuit

### `is_unitary`

```python
def is_unitary(self, atol=None, rtol=None)
```

Return True if operator is a unitary matrix.

### `to_operator`

```python
def to_operator(self) -> Operator
```

Convert operator to matrix operator class

### `to_instruction`

```python
def to_instruction(self)
```

Convert to a UnitaryGate instruction.

### `power`

```python
def power(self, n: float, branch_cut_rotation=cmath.pi * 1e-12, assume_unitary=False) -> Operator
```

Return the matrix power of the operator.

Non-integer powers of operators with an eigenvalue whose complex phase is :math:`\pi` have
a branch cut in the complex plane, which makes the calculation of the principal root around
this cut subject to precision / differences in BLAS implementation.  For example, the square
root of Pauli Y can return the :math:`\pi/2` or :math:`-\pi/2` Y rotation depending on
whether the -1 eigenvalue is found as ``complex(-1, tiny)`` or ``complex(-1, -tiny)``. Such
eigenvalues are really common in quantum information, so this function first phase-rotates
the input matrix to shift the branch cut to a far less common point.  The underlying
numerical precision issues around the branch-cut point remain, if an operator has an
eigenvalue close to this phase.  The magnitude of this rotation can be controlled with the
``branch_cut_rotation`` parameter.

The choice of ``branch_cut_rotation`` affects the principal root that is found.  For
example, the square root of :class:`.ZGate` will be calculated as either :class:`.SGate` or
:class:`.SdgGate` depending on which way the rotation is done::

    from qiskit.circuit import library
    from qiskit.quantum_info import Operator

    z_op = Operator(library.ZGate())
    assert z_op.power(0.5, branch_cut_rotation=1e-3) == Operator(library.SGate())
    assert z_op.power(0.5, branch_cut_rotation=-1e-3) == Operator(library.SdgGate())

Args:
    n (float): the power to raise the matrix to.
    branch_cut_rotation (float): The rotation angle to apply to the branch cut in the
        complex plane.  This shifts the branch cut away from the common point of :math:`-1`,
        but can cause a different root to be selected as the principal root.  The rotation
        is anticlockwise, following the standard convention for complex phase.
    assume_unitary (bool): if ``True``, the operator is assumed to be unitary. In this case,
        for fractional powers we employ a faster implementation based on Schur's decomposition.

Returns:
    Operator: the resulting operator ``O ** n``.

Raises:
    QiskitError: if the input and output dimensions of the operator
                 are not equal.

.. note::
    It is only safe to set the argument ``assume_unitary`` to ``True`` when the operator
    is unitary (or, more generally, normal). Otherwise, the function will return an
    incorrect output.

### `equiv`

```python
def equiv(self, other: Operator, rtol: float | None=None, atol: float | None=None) -> bool
```

Return True if operators are equivalent up to global phase.

Args:
    other (Operator): an operator object.
    rtol (float): relative tolerance value for comparison.
    atol (float): absolute tolerance value for comparison.

Returns:
    bool: True if operators are equivalent up to global phase.

### `reverse_qargs`

```python
def reverse_qargs(self) -> Operator
```

Return an Operator with reversed subsystem ordering.

For a tensor product operator this is equivalent to reversing
the order of tensor product subsystems. For an operator
:math:`A = A_{n-1} \otimes ... \otimes A_0`
the returned operator will be
:math:`A_0 \otimes ... \otimes A_{n-1}`.

Returns:
    Operator: the operator with reversed subsystem order.

### `to_matrix`

```python
def to_matrix(self)
```

Convert operator to NumPy matrix.
