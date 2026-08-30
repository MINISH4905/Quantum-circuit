---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/states/stabilizerstate.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/states/stabilizerstate.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/states/stabilizerstate.py`

Stabilizer state class.

## `StabilizerState`

```python
class StabilizerState(QuantumState)
```

StabilizerState class.
Stabilizer simulator using the convention from reference [1].
Based on the internal class :class:`~qiskit.quantum_info.Clifford`.

.. plot::
   :include-source:
   :nofigs:

    from qiskit import QuantumCircuit
    from qiskit.quantum_info import StabilizerState, Pauli

    # Bell state generation circuit
    qc = QuantumCircuit(2)
    qc.h(0)
    qc.cx(0, 1)
    stab = StabilizerState(qc)

    # Print the StabilizerState
    print(stab)

    # Calculate the StabilizerState measurement probabilities dictionary
    print (stab.probabilities_dict())

    # Calculate expectation value of the StabilizerState
    print (stab.expectation_value(Pauli('ZZ')))

.. code-block:: text

    StabilizerState(StabilizerTable: ['+XX', '+ZZ'])
    {'00': 0.5, '11': 0.5}
    1

Given a list of stabilizers, :meth:`qiskit.quantum_info.StabilizerState.from_stabilizer_list`
returns a state stabilized by the list

.. plot::
   :include-source:
   :nofigs:

    from qiskit.quantum_info import StabilizerState

    stabilizer_list = ["ZXX", "-XYX", "+ZYY"]
    stab = StabilizerState.from_stabilizer_list(stabilizer_list)


References:
    1. S. Aaronson, D. Gottesman, *Improved Simulation of Stabilizer Circuits*,
       Phys. Rev. A 70, 052328 (2004).
       `arXiv:quant-ph/0406196 <https://arxiv.org/abs/quant-ph/0406196>`_

### `__init__`

```python
def __init__(self, data: StabilizerState | Clifford | Pauli | QuantumCircuit | circuit.instruction.Instruction, validate: bool=True)
```

Initialize a StabilizerState object.

Args:
    data: Data from which the stabilizer state can be constructed.
    validate: validate that the stabilizer state data is a valid Clifford.

### `from_stabilizer_list`

```python
def from_stabilizer_list(cls, stabilizers: Collection[str], allow_redundant: bool=False, allow_underconstrained: bool=False) -> StabilizerState
```

Create a stabilizer state from the collection of stabilizers.

Args:
    stabilizers (Collection[str]): list of stabilizer strings
    allow_redundant (bool): allow redundant stabilizers (i.e., some stabilizers
        can be products of the others)
    allow_underconstrained (bool): allow underconstrained set of stabilizers (i.e.,
        the stabilizers do not specify a unique state)

Return:
    StabilizerState: a state stabilized by stabilizers.

### `clifford`

```python
def clifford(self)
```

Return StabilizerState Clifford data

### `is_valid`

```python
def is_valid(self, atol=None, rtol=None)
```

Return True if a valid StabilizerState.

### `trace`

```python
def trace(self) -> float
```

Return the trace of the stabilizer state as a density matrix,
which equals to 1, since it is always a pure state.

Returns:
    float: the trace (should equal 1).

Raises:
    QiskitError: if input is not a StabilizerState.

### `purity`

```python
def purity(self) -> float
```

Return the purity of the quantum state,
which equals to 1, since it is always a pure state.

Returns:
    float: the purity (should equal 1).

Raises:
    QiskitError: if input is not a StabilizerState.

### `to_operator`

```python
def to_operator(self) -> Operator
```

Convert state to matrix operator class

### `conjugate`

```python
def conjugate(self)
```

Return the conjugate of the operator.

### `tensor`

```python
def tensor(self, other: StabilizerState) -> StabilizerState
```

Return the tensor product stabilizer state self ⊗ other.

Args:
    other (StabilizerState): a stabilizer state object.

Returns:
    StabilizerState: the tensor product operator self ⊗ other.

Raises:
    QiskitError: if other is not a StabilizerState.

### `expand`

```python
def expand(self, other: StabilizerState) -> StabilizerState
```

Return the tensor product stabilizer state other ⊗ self.

Args:
    other (StabilizerState): a stabilizer state object.

Returns:
    StabilizerState: the tensor product operator other ⊗ self.

Raises:
    QiskitError: if other is not a StabilizerState.

### `evolve`

```python
def evolve(self, other: Clifford | QuantumCircuit | Instruction, qargs: list | None=None) -> StabilizerState
```

Evolve a stabilizer state by a Clifford operator.

Args:
    other (Clifford or QuantumCircuit or qiskit.circuit.Instruction):
        The Clifford operator to evolve by.
    qargs (list): a list of stabilizer subsystem positions to apply the operator on.

Returns:
    StabilizerState: the output stabilizer state.

Raises:
    QiskitError: if other is not a StabilizerState.
    QiskitError: if the operator dimension does not match the
                 specified StabilizerState subsystem dimensions.

### `expectation_value`

```python
def expectation_value(self, oper: Pauli | SparsePauliOp, qargs: None | list=None) -> complex
```

Compute the expectation value of a Pauli or SparsePauliOp operator.

Args:
    oper: A Pauli or SparsePauliOp operator to evaluate the expectation value.
    qargs: Subsystems to apply the operator on.

Returns:
    The expectation value.

Raises:
    QiskitError: if oper is not a Pauli or SparsePauliOp operator.

### `equiv`

```python
def equiv(self, other: StabilizerState) -> bool
```

Return True if the two generating sets generate the same stabilizer group.

Args:
    other (StabilizerState): another StabilizerState.

Returns:
    bool: True if other has a generating set that generates the same StabilizerState.

### `probabilities`

```python
def probabilities(self, qargs: None | list=None, decimals: None | int=None) -> np.ndarray
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

### `probabilities_dict_from_bitstring`

```python
def probabilities_dict_from_bitstring(self, outcome_bitstring: str, qargs: None | list=None, decimals: None | int=None) -> dict[str, float]
```

Return the subsystem measurement probability dictionary utilizing
a targeted outcome_bitstring to perform the measurement for. This
will calculate a probability for only a single targeted
outcome_bitstring value, giving a performance boost over calculating
all possible outcomes.

Measurement probabilities are with respect to measurement in the
computation (diagonal) basis.

This dictionary representation uses a Ket-like notation where the
dictionary keys are qudit strings for the subsystem basis vectors.
If any subsystem has a dimension greater than 10 comma delimiters are
inserted between integers so that subsystems can be distinguished.

Args:
    outcome_bitstring (None or str): targeted outcome bitstring
        to perform a measurement calculation for, this will significantly
        reduce the number of calculation performed (Default: None)
    qargs (None or list): subsystems to return probabilities for,
            if None return for all subsystems (Default: None).
    decimals (None or int): the number of decimal places to round
            values. If None no rounding is done (Default: None)

Returns:
    dict[str, float]: The measurement probabilities in dict (ket) form.

### `probabilities_dict`

```python
def probabilities_dict(self, qargs: None | list=None, decimals: None | int=None) -> dict[str, float]
```

Return the subsystem measurement probability dictionary.

Measurement probabilities are with respect to measurement in the
computation (diagonal) basis.

This dictionary representation uses a Ket-like notation where the
dictionary keys are qudit strings for the subsystem basis vectors.
If any subsystem has a dimension greater than 10 comma delimiters are
inserted between integers so that subsystems can be distinguished.

Args:
    qargs (None or list): subsystems to return probabilities for,
        if None return for all subsystems (Default: None).
    decimals (None or int): the number of decimal places to round
        values. If None no rounding is done (Default: None).

Returns:
    dict: The measurement probabilities in dict (key) form.

### `reset`

```python
def reset(self, qargs: list | None=None) -> StabilizerState
```

Reset state or subsystems to the 0-state.

Args:
    qargs (list or None): subsystems to reset, if None all
                          subsystems will be reset to their 0-state
                          (Default: None).

Returns:
    StabilizerState: the reset state.

Additional Information:
    If all subsystems are reset this will return the ground state
    on all subsystems. If only some subsystems are reset this
    function will perform a measurement on those subsystems and
    evolve the subsystems so that the collapsed post-measurement
    states are rotated to the 0-state. The RNG seed for this
    sampling can be set using the :meth:`seed` method.

### `measure`

```python
def measure(self, qargs: list | None=None) -> tuple
```

Measure subsystems and return outcome and post-measure state.

Note that this function uses the QuantumStates internal random
number generator for sampling the measurement outcome. The RNG
seed can be set using the :meth:`seed` method.

Args:
    qargs (list or None): subsystems to sample measurements for,
                          if None sample measurement of all
                          subsystems (Default: None).

Returns:
    tuple: the pair ``(outcome, state)`` where ``outcome`` is the
           measurement outcome string label, and ``state`` is the
           collapsed post-measurement stabilizer state for the
           corresponding outcome.

### `sample_memory`

```python
def sample_memory(self, shots: int, qargs: None | list=None) -> np.ndarray
```

Sample a list of qubit measurement outcomes in the computational basis.

Args:
    shots (int): number of samples to generate.
    qargs (None or list): subsystems to sample measurements for,
                        if None sample measurement of all
                        subsystems (Default: None).

Returns:
    np.array: list of sampled counts in the order sampled.

Additional Information:

    This function implements the measurement :meth:`measure` method.

    The seed for random number generator used for sampling can be
    set to a fixed value by using the state's :meth:`seed` method.
