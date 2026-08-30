---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/states/densitymatrix.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/states/densitymatrix.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/states/densitymatrix.py`

DensityMatrix quantum state class.

## `DensityMatrix`

```python
class DensityMatrix(QuantumState, TolerancesMixin)
```

DensityMatrix class

### `__init__`

```python
def __init__(self, data: np.ndarray | list | QuantumCircuit | circuit.instruction.Instruction | QuantumState, dims: int | tuple | list | None=None)
```

Initialize a density matrix object.

Args:
    data: A statevector, quantum instruction or an object with a ``to_operator`` or
        ``to_matrix`` method from which the density matrix can be constructed.
        If a vector the density matrix is constructed as the projector of that vector.
        If a quantum instruction, the density matrix is constructed by assuming all
        qubits are initialized in the zero state.
    dims: The subsystem dimension of the state (See additional information).

Raises:
    QiskitError: if input data is not valid.

Additional Information:
    The ``dims`` kwarg can be None, an integer, or an iterable of
    integers.

    * ``Iterable`` -- the subsystem dimensions are the values in the list
      with the total number of subsystems given by the length of the list.

    * ``Int`` or ``None`` -- the leading dimension of the input matrix
      specifies the total dimension of the density matrix. If it is a
      power of two the state will be initialized as an N-qubit state.
      If it is not a power of two the state will have a single
      d-dimensional subsystem.

### `settings`

```python
def settings(self)
```

Return settings.

### `draw`

```python
def draw(self, output: str | None=None, **drawer_args)
```

Return a visualization of the density matrix.

**repr**: ASCII TextMatrix of the state's ``__repr__``.

**text**: ASCII TextMatrix that can be printed in the console.

**latex**: An IPython Latex object for displaying in Jupyter Notebooks.

**latex_source**: Raw, uncompiled ASCII source to generate array using LaTeX.

**qsphere**: Matplotlib figure, rendering of density matrix using `plot_state_qsphere()`.

**hinton**: Matplotlib figure, rendering of density matrix using `plot_state_hinton()`.

**bloch**: Matplotlib figure, rendering of density matrix using `plot_bloch_multivector()`.

Args:
    output (str): Select the output method to use for drawing the
        state. Valid choices are `repr`, `text`, `latex`, `latex_source`,
        `qsphere`, `hinton`, or `bloch`. Default is `repr`. Default can
        be changed by adding the line ``state_drawer = <default>`` to
        ``~/.qiskit/settings.conf`` under ``[default]``.
    drawer_args: Arguments to be passed directly to the relevant drawing
        function or constructor (`TextMatrix()`, `array_to_latex()`,
        `plot_state_qsphere()`, `plot_state_hinton()` or `plot_bloch_multivector()`).
        See the relevant function under `qiskit.visualization` for that function's
        documentation.

Returns:
    :class:`matplotlib.Figure` or :class:`str` or
    :class:`TextMatrix` or :class:`IPython.display.Latex`:
    Drawing of the density matrix.

Raises:
    ValueError: when an invalid output method is selected.

### `data`

```python
def data(self)
```

Return data.

### `is_valid`

```python
def is_valid(self, atol=None, rtol=None)
```

Return True if trace 1 and positive semidefinite.

### `to_operator`

```python
def to_operator(self) -> Operator
```

Convert to Operator

### `conjugate`

```python
def conjugate(self)
```

Return the conjugate of the density matrix.

### `trace`

```python
def trace(self)
```

Return the trace of the density matrix.

### `purity`

```python
def purity(self)
```

Return the purity of the quantum state.

### `tensor`

```python
def tensor(self, other: DensityMatrix) -> DensityMatrix
```

Return the tensor product state self ⊗ other.

Args:
    other (DensityMatrix): a quantum state object.

Returns:
    DensityMatrix: the tensor product operator self ⊗ other.

Raises:
    QiskitError: if other is not a quantum state.

### `expand`

```python
def expand(self, other: DensityMatrix) -> DensityMatrix
```

Return the tensor product state other ⊗ self.

Args:
    other (DensityMatrix): a quantum state object.

Returns:
    DensityMatrix: the tensor product state other ⊗ self.

Raises:
    QiskitError: if other is not a quantum state.

### `evolve`

```python
def evolve(self, other: Operator | QuantumChannel | circuit.instruction.Instruction | QuantumCircuit, qargs: list[int] | None=None) -> DensityMatrix
```

Evolve a quantum state by an operator.

Args:
    other: The operator to evolve by.
    qargs: a list of QuantumState subsystem positions to apply the operator on.

Returns:
    The output density matrix.

Raises:
    QiskitError: if the operator dimension does not match the
                 specified QuantumState subsystem dimensions.

### `reverse_qargs`

```python
def reverse_qargs(self) -> DensityMatrix
```

Return a DensityMatrix with reversed subsystem ordering.

For a tensor product state this is equivalent to reversing the order
of tensor product subsystems. For a density matrix
:math:`\rho = \rho_{n-1} \otimes ... \otimes \rho_0`
the returned state will be
:math:`\rho_0 \otimes ... \otimes \rho_{n-1}`.

Returns:
    DensityMatrix: the state with reversed subsystem order.

### `expectation_value`

```python
def expectation_value(self, oper: Operator, qargs: None | list[int]=None) -> complex
```

Compute the expectation value of an operator.

Args:
    oper (Operator): an operator to evaluate expval.
    qargs (None or list): subsystems to apply the operator on.

Returns:
    complex: the expectation value.

### `probabilities`

```python
def probabilities(self, qargs: None | list[int]=None, decimals: None | int=None) -> np.ndarray
```

Return the subsystem measurement probability vector.

Measurement probabilities are with respect to measurement in the
computation (diagonal) basis.

Args:
    qargs (None or list): subsystems to return probabilities for,
        if None return for all subsystems (Default: None).
    decimals (None or int): the number of decimal places to round
        values. If None no rounding is done (Default: None).

Returns:
    np.array: The Numpy vector array of probabilities.

Examples:

    Consider a 2-qubit product state :math:`\rho=\rho_1\otimes\rho_0`
    with :math:`\rho_1=|+\rangle\!\langle+|`,
    :math:`\rho_0=|0\rangle\!\langle0|`.

    .. plot::
       :include-source:
       :nofigs:

        from qiskit.quantum_info import DensityMatrix

        rho = DensityMatrix.from_label('+0')

        # Probabilities for measuring both qubits
        probs = rho.probabilities()
        print('probs: {}'.format(probs))

        # Probabilities for measuring only qubit-0
        probs_qubit_0 = rho.probabilities([0])
        print('Qubit-0 probs: {}'.format(probs_qubit_0))

        # Probabilities for measuring only qubit-1
        probs_qubit_1 = rho.probabilities([1])
        print('Qubit-1 probs: {}'.format(probs_qubit_1))

    .. code-block:: text

        probs: [0.5 0.  0.5 0. ]
        Qubit-0 probs: [1. 0.]
        Qubit-1 probs: [0.5 0.5]

    We can also permute the order of qubits in the ``qargs`` list
    to change the qubit position in the probabilities output

    .. plot::
       :include-source:
       :nofigs:

        from qiskit.quantum_info import DensityMatrix

        rho = DensityMatrix.from_label('+0')

        # Probabilities for measuring both qubits
        probs = rho.probabilities([0, 1])
        print('probs: {}'.format(probs))

        # Probabilities for measuring both qubits
        # but swapping qubits 0 and 1 in output
        probs_swapped = rho.probabilities([1, 0])
        print('Swapped probs: {}'.format(probs_swapped))

    .. code-block:: text

        probs: [0.5 0.  0.5 0. ]
        Swapped probs: [0.5 0.5 0.  0. ]

### `reset`

```python
def reset(self, qargs: list[int] | None=None) -> DensityMatrix
```

Reset state or subsystems to the 0-state.

Args:
    qargs (list or None): subsystems to reset, if None all
                          subsystems will be reset to their 0-state
                          (Default: None).

Returns:
    DensityMatrix: the reset state.

Additional Information:
    If all subsystems are reset this will return the ground state
    on all subsystems. If only some subsystems are reset this
    function will perform evolution by the reset
    :class:`~qiskit.quantum_info.SuperOp` of the reset subsystems.

### `from_label`

```python
def from_label(cls, label: str) -> DensityMatrix
```

Return a tensor product of Pauli X,Y,Z eigenstates.

.. list-table:: Single-qubit state labels
   :header-rows: 1

   * - Label
     - Statevector
   * - ``"0"``
     - :math:`\begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}`
   * - ``"1"``
     - :math:`\begin{pmatrix} 0 & 0 \\ 0 & 1 \end{pmatrix}`
   * - ``"+"``
     - :math:`\frac{1}{2}\begin{pmatrix} 1 & 1 \\ 1 & 1 \end{pmatrix}`
   * - ``"-"``
     - :math:`\frac{1}{2}\begin{pmatrix} 1 & -1 \\ -1 & 1 \end{pmatrix}`
   * - ``"r"``
     - :math:`\frac{1}{2}\begin{pmatrix} 1 & -i \\ i & 1 \end{pmatrix}`
   * - ``"l"``
     - :math:`\frac{1}{2}\begin{pmatrix} 1 & i \\ -i & 1 \end{pmatrix}`

Args:
    label (string): an eigenstate string ket label (see table for
                    allowed values).

Returns:
    DensityMatrix: The N-qubit basis state density matrix.

Raises:
    QiskitError: if the label contains invalid characters, or the length
                 of the label is larger than an explicitly specified num_qubits.

### `from_int`

```python
def from_int(i: int, dims: int | tuple | list) -> DensityMatrix
```

Return a computational basis state density matrix.

Args:
    i (int): the basis state element.
    dims (int or tuple or list): The subsystem dimensions of the statevector
                                 (See additional information).

Returns:
    DensityMatrix: The computational basis state :math:`|i\rangle\!\langle i|`.

Additional Information:
    The ``dims`` kwarg can be an integer or an iterable of integers.

    * ``Iterable`` -- the subsystem dimensions are the values in the list
      with the total number of subsystems given by the length of the list.

    * ``Int`` -- the integer specifies the total dimension of the
      state. If it is a power of two the state will be initialized
      as an N-qubit state. If it is not a power of two the state
      will have a single d-dimensional subsystem.

### `from_instruction`

```python
def from_instruction(cls, instruction: circuit.instruction.Instruction | QuantumCircuit) -> DensityMatrix
```

Return the output density matrix of an instruction.

The statevector is initialized in the state :math:`|{0,\ldots,0}\rangle` of
the same number of qubits as the input instruction or circuit, evolved
by the input instruction, and the output statevector returned.

Args:
    instruction: instruction or circuit

Returns:
    The final density matrix.

Raises:
    QiskitError: if the instruction contains invalid instructions for
                 density matrix simulation.

### `to_dict`

```python
def to_dict(self, decimals: None | int=None) -> dict
```

Convert the density matrix to dictionary form.

This dictionary representation uses a Ket-like notation where the
dictionary keys are qudit strings for the subsystem basis vectors.
If any subsystem has a dimension greater than 10 comma delimiters are
inserted between integers so that subsystems can be distinguished.

Args:
    decimals (None or int): the number of decimal places to round
                            values. If None no rounding is done
                            (Default: None).

Returns:
    dict: the dictionary form of the DensityMatrix.

Examples:

    The ket-form of a 2-qubit density matrix
    :math:`rho = |-\rangle\!\langle -|\otimes |0\rangle\!\langle 0|`

    .. plot::
       :include-source:
       :nofigs:

        from qiskit.quantum_info import DensityMatrix

        rho = DensityMatrix.from_label('-0')
        print(rho.to_dict())

    .. code-block:: text

       {
           '00|00': (0.4999999999999999+0j),
           '10|00': (-0.4999999999999999-0j),
           '00|10': (-0.4999999999999999+0j),
           '10|10': (0.4999999999999999+0j)
       }

    For non-qubit subsystems the integer range can go from 0 to 9. For
    example in a qutrit system

    .. plot::
       :include-source:
       :nofigs:

        import numpy as np
        from qiskit.quantum_info import DensityMatrix

        mat = np.zeros((9, 9))
        mat[0, 0] = 0.25
        mat[3, 3] = 0.25
        mat[6, 6] = 0.25
        mat[-1, -1] = 0.25
        rho = DensityMatrix(mat, dims=(3, 3))
        print(rho.to_dict())

    .. code-block:: text

        {'00|00': (0.25+0j), '10|10': (0.25+0j), '20|20': (0.25+0j), '22|22': (0.25+0j)}

    For large subsystem dimensions delimiters are required. The
    following example is for a 20-dimensional system consisting of
    a qubit and 10-dimensional qudit.

    .. plot::
       :include-source:
       :nofigs:

        import numpy as np
        from qiskit.quantum_info import DensityMatrix

        mat = np.zeros((2 * 10, 2 * 10))
        mat[0, 0] = 0.5
        mat[-1, -1] = 0.5
        rho = DensityMatrix(mat, dims=(2, 10))
        print(rho.to_dict())

    .. code-block:: text

        {'00|00': (0.5+0j), '91|91': (0.5+0j)}

### `to_statevector`

```python
def to_statevector(self, atol: float | None=None, rtol: float | None=None) -> Statevector
```

Return a statevector from a pure density matrix.

Args:
    atol (float): Absolute tolerance for checking operation validity.
    rtol (float): Relative tolerance for checking operation validity.

Returns:
    Statevector: The pure density matrix's corresponding statevector.
        Corresponds to the eigenvector of the only non-zero eigenvalue.

Raises:
    QiskitError: if the state is not pure.

### `partial_transpose`

```python
def partial_transpose(self, qargs: list[int]) -> DensityMatrix
```

Return partially transposed density matrix.

Args:
    qargs (list): The subsystems to be transposed.

Returns:
    DensityMatrix: The partially transposed density matrix.
