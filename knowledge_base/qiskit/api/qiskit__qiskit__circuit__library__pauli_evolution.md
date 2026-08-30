---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/pauli_evolution.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/pauli_evolution.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/pauli_evolution.py`

A gate to implement time-evolution of operators.

## `PauliEvolutionGate`

```python
class PauliEvolutionGate(Gate)
```

Time-evolution of an operator consisting of Paulis.

For an Hermitian operator :math:`H` consisting of Pauli terms and (real) evolution time :math:`t`
this gate represents the unitary

.. math::

    U(t) = e^{-itH}.

The evolution gates are related to the Pauli rotation gates by a factor of 2. For example
the time evolution of the Pauli :math:`X` operator is connected to the Pauli :math:`X` rotation
:math:`R_X` by

.. math::

    U(t) = e^{-itX} = R_X(2t).

Compilation:

This gate represents the exact evolution :math:`U(t)`. Implementing this operation exactly,
however, generally requires an exponential number of gates. The compiler therefore typically
implements an *approximation* of the unitary :math:`U(t)`, e.g. using a product formula such
as defined by :class:`.LieTrotter`. By passing the ``synthesis`` argument, you can specify
which method the compiler should use, see :mod:`qiskit.synthesis` for the available options.

Note that the order in which the approximation and methods like :meth:`control` and
:meth:`power` are called matters. Changing the order can lead to different unitaries.

Commutation checks:

Qiskit supports efficient commutation checks of :class:`PauliEvolutionGate` instances
with other Pauli-based gates, such as :class:`.PauliGate` or :class:`.PauliProductMeasurement`.
However, these checks require conversion of the operator into :class:`.SparseObservable` format,
hence we strongly suggest to build operators using this operator class if a large number
of commutation checks are expected (e.g. if you have a circuit with a large number of
sequential :class:`PauliEvolutionGate`\ s).

Examples:

.. plot::
   :include-source:
   :nofigs:

    from qiskit.circuit import QuantumCircuit
    from qiskit.circuit.library import PauliEvolutionGate
    from qiskit.quantum_info import SparsePauliOp

    X = SparsePauliOp("X")
    Z = SparsePauliOp("Z")
    I = SparsePauliOp("I")

    # build the evolution gate
    operator = (Z ^ Z) - 0.1 * (X ^ I)
    evo = PauliEvolutionGate(operator, time=0.2)

    # plug it into a circuit
    circuit = QuantumCircuit(2)
    circuit.append(evo, range(2))
    print(circuit.draw())

The above will print (note that the ``-0.1`` coefficient is not printed!):

.. code-block:: text

         ┌──────────────────────────┐
    q_0: ┤0                         ├
         │  exp(-it (ZZ + XI))(0.2) │
    q_1: ┤1                         ├
         └──────────────────────────┘


References:

[1] G. Li et al. Paulihedral: A Generalized Block-Wise Compiler Optimization
Framework For Quantum Simulation Kernels (2021).
`arXiv:2109.03371 <https://arxiv.org/abs/2109.03371>`__

### `__init__`

```python
def __init__(self, operator: qiskit.quantum_info.Pauli | SparsePauliOp | SparseObservable | list[qiskit.quantum_info.Pauli | SparsePauliOp | SparseObservable], time: ParameterValueType=1.0, label: str | None=None, synthesis: EvolutionSynthesis | None=None) -> None
```

Args:
    operator: The operator to evolve. Can also be provided as list of non-commuting
        operators where the elements are sums of commuting operators.
        For example: ``[XY + YX, ZZ + ZI + IZ, YY]``.
    time: The evolution time.
    label: A label for the gate to display in visualizations. Per default, the label is
        set to ``exp(-it <operators>)`` where ``<operators>`` is the sum of the Paulis.
        Note that the label does not include any coefficients of the Paulis. See the
        class docstring for an example.
    synthesis: A synthesis strategy. If None, the default synthesis is the Lie-Trotter
        product formula with a single repetition.

### `time`

```python
def time(self) -> ParameterValueType
```

Return the evolution time as stored in the gate parameters.

Returns:
    The evolution time.

### `time`

```python
def time(self, time: ParameterValueType) -> None
```

Set the evolution time.

Args:
    time: The evolution time.

### `to_matrix`

```python
def to_matrix(self) -> np.ndarray
```

Return the matrix :math:`e^{-it H}` as ``numpy.ndarray``.

Returns:
    The matrix this gate represents.

Raises:
    ValueError: If the ``time`` parameters is not numeric.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return the inverse, which is obtained by flipping the sign of the evolution time.

### `power`

```python
def power(self, exponent: float, annotated: bool=False) -> Gate
```

Raise this gate to the power of ``exponent``.

The outcome represents :math:`e^{-i tp H}` where :math:`p` equals ``exponent``.

Args:
    exponent: The power to raise the gate to.
    annotated: Not applicable to this class. Usually, when this is ``True`` we return an
        :class:`.AnnotatedOperation` with a power modifier set instead of a concrete
        :class:`.Gate`. However, we can efficiently represent powers of Pauli evolutions
        as :class:`.PauliEvolutionGate`, which is used here.

Returns:
    An operation implementing ``gate^exponent``.

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: int | str | None=None, annotated: bool | None=None) -> Gate
```

Return the controlled version of itself.

The outcome is the specified controlled version of :math:`e^{-itH}`.
The returned gate represents :math:`e^{-it H_C}`, where :math:`H_C` is the original
operator :math:`H`, tensored with :math:`|0\rangle\langle 0|` and
:math:`|1\rangle\langle 1|` projectors (depending on the control state).

The controlled gate is implemented as :class:`.PauliEvolutionGate`,
regardless of the value of ``annotated``.

Args:
    num_ctrl_qubits: Number of controls to add. Defaults to ``1``.
    label: A label for the resulting Pauli evolution gate, to display in visualizations.
        Per default, the label is set to ``exp(-it <operators>)`` where ``<operators>``
        is the sum of the Paulis. Note that the label does not include any coefficients
        of the Paulis. See the class docstring for an example.
    ctrl_state: The control state of the gate, specified either as an integer or a bitstring
        (e.g. ``"110"``). If ``None``, defaults to the all-ones state ``2**num_ctrl_qubits - 1``.
    annotated: Ignored.

Returns:
    A controlled version of this gate.

### `validate_parameter`

```python
def validate_parameter(self, parameter: ParameterValueType) -> ParameterValueType
```

Gate parameters should be int, float, or ParameterExpression
