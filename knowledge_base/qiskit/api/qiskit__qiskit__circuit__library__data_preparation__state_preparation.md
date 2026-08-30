---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/data_preparation/state_preparation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/data_preparation/state_preparation.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/data_preparation/state_preparation.py`

Prepare a quantum state from the state where all qubits are 0.

## `StatePreparation`

```python
class StatePreparation(Gate)
```

Complex amplitude state preparation.

Class that implements the (complex amplitude) state preparation of some
flexible collection of qubit registers.

### `__init__`

```python
def __init__(self, params: str | list | int | Statevector, num_qubits: int | None=None, inverse: bool=False, label: str | None=None, normalize: bool=False)
```

Args:
    params:
        * Statevector: Statevector to initialize to.
        * list: vector of complex amplitudes to initialize to.
        * string: labels of basis states of the Pauli eigenstates Z, X, Y. See
          :meth:`.Statevector.from_label`.
          Notice the order of the labels is reversed with respect to the qubit index to
          be applied to. Example label '01' initializes the qubit zero to :math:`|1\rangle`
          and the qubit one to :math:`|0\rangle`.
        * int: an integer that is used as a bitmap indicating which qubits to initialize
          to :math:`|1\rangle`. Example: setting params to 5 would initialize qubit 0 and qubit 2
          to :math:`|1\rangle` and qubit 1 to :math:`|0\rangle`.
    num_qubits: This parameter is only used if params is an int. Indicates the total
        number of qubits in the `initialize` call. Example: `initialize` covers 5 qubits
        and params is 3. This allows qubits 0 and 1 to be initialized to :math:`|1\rangle`
        and the remaining 3 qubits to be initialized to :math:`|0\rangle`.
    inverse: if True, the inverse state is constructed.
    label: An optional label for the gate
    normalize (bool): Whether to normalize an input array to a unit vector.

Raises:
    QiskitError: ``num_qubits`` parameter used when ``params`` is not an integer

When a Statevector argument is passed the state is prepared based on the
:class:`~.library.Isometry` synthesis described in [1].

References:

[1] Iten et al., Quantum circuits for isometries (2016).
`Phys. Rev. A 93, 032318
<https://journals.aps.org/pra/abstract/10.1103/PhysRevA.93.032318>`__.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverted StatePreparation

### `validate_parameter`

```python
def validate_parameter(self, parameter)
```

StatePreparation instruction parameter can be str, int, float, and complex.

## `UniformSuperpositionGate`

```python
class UniformSuperpositionGate(Gate)
```

Implements a uniform superposition state.

This gate is used to create the uniform superposition state
:math:`\frac{1}{\sqrt{M}} \sum_{j=0}^{M-1}  |j\rangle` when it acts on an input
state :math:`|0...0\rangle`. Note, that `M` is not required to be
a power of 2, in which case the uniform superposition could be
prepared by a single layer of Hadamard gates.

.. note::

    This class uses the Shukla-Vedula algorithm [1], which only needs
    :math:`O(\log_2 (M))` qubits and :math:`O(\log_2 (M))` gates,
    to prepare the superposition.

References:

[1]: A. Shukla and P. Vedula (2024), An efficient quantum algorithm for preparation
of uniform quantum superposition states, `Quantum Inf Process 23, 38
<https://link.springer.com/article/10.1007/s11128-024-04258-4>`_.

### `__init__`

```python
def __init__(self, num_superpos_states: int=2, num_qubits: int | None=None)
```

Args:
    num_superpos_states (int):
        A positive integer M = num_superpos_states (> 1) representing the number of computational
        basis states with an amplitude of 1/sqrt(M) in the uniform superposition
        state (:math:`\frac{1}{\sqrt{M}} \sum_{j=0}^{M-1}  |j\rangle`, where
        :math:`1< M <= 2^n`). Note that the remaining (:math:`2^n - M`) computational basis
        states have zero amplitudes. Here M need not be an integer power of 2.

    num_qubits (int):
        A positive integer representing the number of qubits used.  If num_qubits is None
        or is not specified, then num_qubits is set to ceil(log2(num_superpos_states)).

Raises:
    ValueError: num_qubits must be an integer greater than or equal to log2(num_superpos_states).
