---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/data_preparation/initializer.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/data_preparation/initializer.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/data_preparation/initializer.py`

Initialize qubit registers to desired arbitrary state.

## `Initialize`

```python
class Initialize(Instruction)
```

Complex amplitude initialization.

Class that initializes some flexible collection of qubit registers, implemented by calling
the :class:`~.library.StatePreparation` class.
Note that ``Initialize`` is an :class:`~.circuit.Instruction` and not a :class:`.Gate` since it
contains a reset instruction, which is not unitary.

The initial state is prepared based on the :class:`~.library.Isometry` synthesis described in [1].

References:

[1] Iten et al., Quantum circuits for isometries (2016).
`Phys. Rev. A 93, 032318
<https://journals.aps.org/pra/abstract/10.1103/PhysRevA.93.032318>`__.

### `__init__`

```python
def __init__(self, params: Statevector | Sequence[complex] | str | int, num_qubits: int | None=None, normalize: bool=False) -> None
```

Args:
    params: The state to initialize to, can be either of the following.

        * Statevector or vector of complex amplitudes to initialize to.
        * Labels of basis states of the Pauli eigenstates Z, X, Y. See
          :meth:`.Statevector.from_label`. Notice the order of the labels is reversed with
          respect to the qubit index to be applied to. Example label '01' initializes the
          qubit zero to :math:`|1\rangle` and the qubit one to :math:`|0\rangle`.
        * An integer that is used as a bitmap indicating which qubits to initialize to
          :math:`|1\rangle`. Example: setting params to 5 would initialize qubit 0 and qubit
          2 to :math:`|1\rangle` and qubit 1 to :math:`|0\rangle`.

    num_qubits: This parameter is only used if params is an int. Indicates the total
        number of qubits in the `initialize` call. Example: `initialize` covers 5 qubits
        and params is 3. This allows qubits 0 and 1 to be initialized to :math:`|1\rangle`
        and the remaining 3 qubits to be initialized to :math:`|0\rangle`.
    normalize: Whether to normalize an input array to a unit vector.

### `gates_to_uncompute`

```python
def gates_to_uncompute(self) -> QuantumCircuit
```

Call to create a circuit with gates that take the desired vector to zero.

Returns:
    QuantumCircuit: circuit to take ``self.params`` vector to :math:`|{00\ldots0}\rangle`

### `params`

```python
def params(self)
```

Return initialize params.

### `params`

```python
def params(self, parameters: Statevector | Sequence[complex] | str | int) -> None
```

Set initialize params.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Raises an error as Initialize cannot be inverted.
