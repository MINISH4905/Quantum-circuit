---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/states/statevector.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/states/statevector.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/states/statevector.py`

Statevector quantum state class.

## `Statevector`

```python
class Statevector(QuantumState, TolerancesMixin)
```

Statevector class

### `__init__`

```python
def __init__(self, data: np.ndarray | list | Statevector | Operator | QuantumCircuit | circuit.instruction.Instruction, dims: int | tuple | list | None=None)
```

Initialize a statevector object.

Args:
    data: Data from which the statevector can be constructed. This can be either a complex
        vector, another statevector, a ``Operator`` with only one column or a
        ``QuantumCircuit`` or ``Instruction``.  If the data is a circuit or instruction,
        the statevector is constructed by assuming that all qubits are initialized to the
        zero state.
    dims: The subsystem dimension of the state (See additional information).

Raises:
    QiskitError: if input data is not valid.

Additional Information:
    The ``dims`` kwarg can be None, an integer, or an iterable of
    integers.

    * ``Iterable`` -- the subsystem dimensions are the values in the list
      with the total number of subsystems given by the length of the list.

    * ``Int`` or ``None`` -- the length of the input vector
      specifies the total dimension of the state. If it is a
      power of two the state will be initialized as an N-qubit state.
      If it is not a power of two the state will have a single
      d-dimensional subsystem.

### `from_circuit`

```python
def from_circuit(cls, circuit: QuantumCircuit, ignore_set_layout: bool=False) -> Statevector
```

Create a Statevector from a quantum circuit.

Args:
    circuit (QuantumCircuit): A quantum circuit
    ignore_set_layout (bool): When set to ``True``, if the input ``circuit``
        has a layout set, it will be ignored. Defaults to ``False``.

Returns:
    The statevector obtained by applying the circuit on the all-zero
    input state.

Example:
    Create a statevector from a transpiled circuit:

    .. plot::
       :include-source:
       :nofigs:

        from qiskit import QuantumCircuit, transpile
        from qiskit.quantum_info import Statevector
        from qiskit.providers.basic_provider import BasicSimulator

        qc = QuantumCircuit(3)
        qc.h(0)
        qc.cx(0, 1)
        qc.swap(1, 2)

        backend = BasicSimulator()
        transpiled1 = transpile(qc, backend, optimization_level=0)
        transpiled2 = transpile(qc, backend, optimization_level=2)

        # Get statevectors accounting for layout changes
        sv1 = Statevector.from_circuit(transpiled1)
        sv2 = Statevector.from_circuit(transpiled2)

        # These will be equivalent up to global phase
        print(sv1.equiv(sv2))  # True

### `settings`

```python
def settings(self) -> dict
```

Return settings.

### `draw`

```python
def draw(self, output: str | None=None, **drawer_args)
```

Return a visualization of the Statevector.

**repr**: ASCII TextMatrix of the state's ``__repr__``.

**text**: ASCII TextMatrix that can be printed in the console.

**latex**: An IPython Latex object for displaying in Jupyter Notebooks.

**latex_source**: Raw, uncompiled ASCII source to generate array using LaTeX.

**qsphere**: Matplotlib figure, rendering of statevector using `plot_state_qsphere()`.

**hinton**: Matplotlib figure, rendering of statevector using `plot_state_hinton()`.

**bloch**: Matplotlib figure, rendering of statevector using `plot_bloch_multivector()`.

**city**: Matplotlib figure, rendering of statevector using `plot_state_city()`.

**paulivec**: Matplotlib figure, rendering of statevector using `plot_state_paulivec()`.

Args:
    output (str): Select the output method to use for drawing the
        state. Valid choices are `repr`, `text`, `latex`, `latex_source`,
        `qsphere`, `hinton`, `bloch`, `city`, or `paulivec`. Default is `repr`.
        Default can be changed by adding the line ``state_drawer = <default>`` to
        ``~/.qiskit/settings.conf`` under ``[default]``.
    drawer_args: Arguments to be passed directly to the relevant drawing
        function or constructor (`TextMatrix()`, `array_to_latex()`,
        `plot_state_qsphere()`, `plot_state_hinton()` or `plot_bloch_multivector()`).
        See the relevant function under `qiskit.visualization` for that function's
        documentation.

Returns:
    :class:`matplotlib.Figure` or :class:`str` or
    :class:`TextMatrix` or :class:`IPython.display.Latex`:
    Drawing of the Statevector.

Raises:
    ValueError: when an invalid output method is selected.

Examples:

    Plot one of the Bell states

    .. plot::
       :alt: Output from the previous code.
       :include-source:

        from numpy import sqrt
        from qiskit.quantum_info import Statevector
        sv=Statevector([1/sqrt(2), 0, 0, -1/sqrt(2)])
        sv.draw(output='hinton')

### `__getitem__`

```python
def __getitem__(self, key: int | str) -> np.complex128
```

Return Statevector item either by index or binary label
Args:
    key (int or str): index or corresponding binary label, e.g. '01' = 1.

Returns:
    numpy.complex128: Statevector item.

Raises:
    QiskitError: if key is not valid.

### `data`

```python
def data(self) -> np.ndarray
```

Return data.

### `is_valid`

```python
def is_valid(self, atol: float | None=None, rtol: float | None=None) -> bool
```

Return True if a Statevector has norm 1.

### `to_operator`

```python
def to_operator(self) -> Operator
```

Convert state to a rank-1 projector operator

### `conjugate`

```python
def conjugate(self) -> Statevector
```

Return the conjugate of the operator.

### `trace`

```python
def trace(self) -> np.float64
```

Return the trace of the quantum state as a density matrix.

### `purity`

```python
def purity(self) -> np.float64
```

Return the purity of the quantum state.

### `tensor`

```python
def tensor(self, other: Statevector) -> Statevector
```

Return the tensor product state self ⊗ other.

Args:
    other (Statevector): a quantum state object.

Returns:
    Statevector: the tensor product operator self ⊗ other.

Raises:
    QiskitError: if other is not a quantum state.

### `inner`

```python
def inner(self, other: Statevector) -> np.complex128
```

Return the inner product of self and other as
:math:`\langle self| other \rangle`.

Args:
    other (Statevector): a quantum state object.

Returns:
    np.complex128: the inner product of self and other, :math:`\langle self| other \rangle`.

Raises:
    QiskitError: if other is not a quantum state or has different dimension.

### `expand`

```python
def expand(self, other: Statevector) -> Statevector
```

Return the tensor product state other ⊗ self.

Args:
    other (Statevector): a quantum state object.

Returns:
    Statevector: the tensor product state other ⊗ self.

Raises:
    QiskitError: if other is not a quantum state.

### `evolve`

```python
def evolve(self, other: Operator | QuantumCircuit | Instruction, qargs: list[int] | None=None) -> Statevector
```

Evolve a quantum state by the operator.

Args:
    other (Operator | QuantumCircuit | circuit.Instruction): The operator to evolve by.
    qargs (list): a list of Statevector subsystem positions to apply
                   the operator on.

Returns:
    Statevector: the output quantum state.

Raises:
    QiskitError: if the operator dimension does not match the
                 specified Statevector subsystem dimensions.

### `equiv`

```python
def equiv(self, other: Statevector, rtol: float | None=None, atol: float | None=None) -> bool
```

Return True if other is equivalent as a statevector up to global phase.

.. note::

    If other is not a Statevector, but can be used to initialize a statevector object,
    this will check that Statevector(other) is equivalent to the current statevector up
    to global phase.

Args:
    other (Statevector): an object from which a ``Statevector`` can be constructed.
    rtol (float): relative tolerance value for comparison.
    atol (float): absolute tolerance value for comparison.

Returns:
    bool: True if statevectors are equivalent up to global phase.

### `reverse_qargs`

```python
def reverse_qargs(self) -> Statevector
```

Return a Statevector with reversed subsystem ordering.

For a tensor product state this is equivalent to reversing the order
of tensor product subsystems. For a statevector
:math:`|\psi \rangle = |\psi_{n-1} \rangle \otimes ... \otimes |\psi_0 \rangle`
the returned statevector will be
:math:`|\psi_{0} \rangle \otimes ... \otimes |\psi_{n-1} \rangle`.

Returns:
    Statevector: the Statevector with reversed subsystem order.

### `expectation_value`

```python
def expectation_value(self, oper: BaseOperator | QuantumCircuit | Instruction, qargs: None | list[int]=None) -> complex
```

Compute the expectation value of an operator.

Args:
    oper (Operator): an operator to evaluate expval of.
    qargs (None or list): subsystems to apply operator on.

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

    Consider a 2-qubit product state
    :math:`|\psi\rangle=|+\rangle\otimes|0\rangle`.

    .. plot::
       :include-source:
       :nofigs:

        from qiskit.quantum_info import Statevector

        psi = Statevector.from_label('+0')

        # Probabilities for measuring both qubits
        probs = psi.probabilities()
        print('probs: {}'.format(probs))

        # Probabilities for measuring only qubit-0
        probs_qubit_0 = psi.probabilities([0])
        print('Qubit-0 probs: {}'.format(probs_qubit_0))

        # Probabilities for measuring only qubit-1
        probs_qubit_1 = psi.probabilities([1])
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

        from qiskit.quantum_info import Statevector

        psi = Statevector.from_label('+0')

        # Probabilities for measuring both qubits
        probs = psi.probabilities([0, 1])
        print('probs: {}'.format(probs))

        # Probabilities for measuring both qubits
        # but swapping qubits 0 and 1 in output
        probs_swapped = psi.probabilities([1, 0])
        print('Swapped probs: {}'.format(probs_swapped))

    .. code-block:: text

        probs: [0.5 0.  0.5 0. ]
        Swapped probs: [0.5 0.5 0.  0. ]

### `reset`

```python
def reset(self, qargs: list[int] | None=None) -> Statevector
```

Reset state or subsystems to the 0-state.

Args:
    qargs (list or None): subsystems to reset, if None all
                          subsystems will be reset to their 0-state
                          (Default: None).

Returns:
    Statevector: the reset state.

Additional Information:
    If all subsystems are reset this will return the ground state
    on all subsystems. If only some subsystems are reset this
    function will perform a measurement on those subsystems and
    evolve the subsystems so that the collapsed post-measurement
    states are rotated to the 0-state. The RNG seed for this
    sampling can be set using the :meth:`seed` method.

### `from_label`

```python
def from_label(cls, label: str) -> Statevector
```

Return a tensor product of Pauli X,Y,Z eigenstates.

.. list-table:: Single-qubit state labels
   :header-rows: 1

   * - Label
     - Statevector
   * - ``"0"``
     - :math:`[1, 0]`
   * - ``"1"``
     - :math:`[0, 1]`
   * - ``"+"``
     - :math:`[1 / \sqrt{2},  1 / \sqrt{2}]`
   * - ``"-"``
     - :math:`[1 / \sqrt{2},  -1 / \sqrt{2}]`
   * - ``"r"``
     - :math:`[1 / \sqrt{2},  i / \sqrt{2}]`
   * - ``"l"``
     - :math:`[1 / \sqrt{2},  -i / \sqrt{2}]`

Args:
    label (string): an eigenstate string ket label (see table for
                    allowed values).

Returns:
    Statevector: The N-qubit basis state statevector.

Raises:
    QiskitError: if the label contains invalid characters, or the
                 length of the label is larger than an explicitly
                 specified num_qubits.

### `from_int`

```python
def from_int(i: int, dims: int | tuple | list) -> Statevector
```

Return a computational basis statevector.

Args:
    i (int): the basis state element.
    dims (int or tuple or list): The subsystem dimensions of the statevector
                                 (See additional information).

Returns:
    Statevector: The computational basis state :math:`|i\rangle`.

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
def from_instruction(cls, instruction: Instruction | QuantumCircuit) -> Statevector
```

Return the output statevector of an instruction.

The statevector is initialized in the state :math:`|{0,\ldots,0}\rangle` of the
same number of qubits as the input instruction or circuit, evolved
by the input instruction, and the output statevector returned.

Args:
    instruction (qiskit.circuit.Instruction or QuantumCircuit): instruction or circuit

Returns:
    Statevector: The final statevector.

Raises:
    QiskitError: if the instruction contains invalid instructions for
                 the statevector simulation.

### `to_dict`

```python
def to_dict(self, decimals: None | int=None) -> dict
```

Convert the statevector to dictionary form.

This dictionary representation uses a Ket-like notation where the
dictionary keys are qudit strings for the subsystem basis vectors.
If any subsystem has a dimension greater than 10 comma delimiters are
inserted between integers so that subsystems can be distinguished.

Args:
    decimals (None or int): the number of decimal places to round
                            values. If None no rounding is done
                            (Default: None).

Returns:
    dict: the dictionary form of the Statevector.

Example:

    The ket-form of a 2-qubit statevector
    :math:`|\psi\rangle = |-\rangle\otimes |0\rangle`

    .. plot::
       :include-source:
       :nofigs:

        from qiskit.quantum_info import Statevector

        psi = Statevector.from_label('-0')
        print(psi.to_dict())

    .. code-block:: text

        {'00': (0.7071067811865475+0j), '10': (-0.7071067811865475+0j)}

    For non-qubit subsystems the integer range can go from 0 to 9. For
    example in a qutrit system

    .. plot::
       :include-source:
       :nofigs:

        import numpy as np
        from qiskit.quantum_info import Statevector

        vec = np.zeros(9)
        vec[0] = 1 / np.sqrt(2)
        vec[-1] = 1 / np.sqrt(2)
        psi = Statevector(vec, dims=(3, 3))
        print(psi.to_dict())

    .. code-block:: text

        {'00': (0.7071067811865475+0j), '22': (0.7071067811865475+0j)}

    For large subsystem dimensions delimiters are required. The
    following example is for a 20-dimensional system consisting of
    a qubit and 10-dimensional qudit.

    .. plot::
       :include-source:
       :nofigs:

        import numpy as np
        from qiskit.quantum_info import Statevector

        vec = np.zeros(2 * 10)
        vec[0] = 1 / np.sqrt(2)
        vec[-1] = 1 / np.sqrt(2)
        psi = Statevector(vec, dims=(2, 10))
        print(psi.to_dict())

    .. code-block:: text

        {'00': (0.7071067811865475+0j), '91': (0.7071067811865475+0j)}
