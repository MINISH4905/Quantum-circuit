---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/trotter_error/realspace/ho_state.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/trotter_error/realspace/ho_state.py
license: Apache-2.0
---

## Module `pennylane/labs/trotter_error/realspace/ho_state.py`

Contains the HOState class which represents a wavefunction in the harmonic oscillator basis

## `HOState`

```python
class HOState
```

Represent a wavefunction in the harmonic oscillator basis.

Args:
    modes (int): the number of vibrational modes
    gridpoints (int): the number of gridpoints used to discretize the state
    state: (Union[scipy.sparse.csr_array, Dict[Tuple[int], float]]): a sparse state vector for the full wavefunction or a dictionary containing the interacting modes and their non-zero coefficients


**Examples**

Building an :class:`~.pennylane.labs.trotter_error.HOState` from a dictionary

>>> from pennylane.labs.trotter_error import HOState
>>> n_modes = 3
>>> gridpoints = 5
>>> state_dict = {(1, 2, 3): 1, (0, 3, 2): 1}
>>> HOState(n_modes, gridpoints, state_dict)
HOState(modes=3, gridpoints=5, <Compressed Sparse Row sparse array of dtype 'int64'
    with 2 stored elements and shape (125, 1)>
  Coords    Values
  (17, 0)   1
  (38, 0)   1)

Building an :class:`~.pennylane.labs.trotter_error.HOState` from a ``scipy.sparse.csr_array``

>>> from scipy.sparse import csr_array
>>> import numpy as np
>>> gridpoints = 2
>>> n_modes = 2
>>> state_vector = csr_array(np.array([0, 1, 0, 0]))
>>> HOState(n_modes, gridpoints, state_vector)
HOState(modes=2, gridpoints=2, <COOrdinate sparse array of dtype 'int64'
    with 1 stored elements and shape (4, 1)>
  Coords    Values
  (1, 0)    1)

### `zero_state`

```python
def zero_state(cls, modes: int, gridpoints: int) -> HOState
```

Construct an :class:`~.pennylane.labs.trotter_error.HOState` whose vector is zero.

Args:
    modes (int): the number of vibrational modes
    gridpoints(int): the number of gridpoints used to discretize the state

Returns:
    HOState: an :class:`~.pennylane.labs.trotter_error.HOState` representing the zero state

**Example**

>>> from pennylane.labs.trotter_error import HOState
>>> HOState.zero_state(5, 10)
HOState(modes=5, gridpoints=10, <Compressed Sparse Row sparse array of dtype 'float64'
    with 0 stored elements and shape (100000, 1)>)

### `dot`

```python
def dot(self, other: HOState) -> float
```

Return the dot product of two :class:`~.pennylane.labs.trotter_error.HOState` objects.

Args:
    other (HOState): the state to take the dot product with

Returns:
    float: the dot product of the two states

**Example**

>>> from pennylane.labs.trotter_error import HOState
>>> n_modes = 3
>>> gridpoints = 5
>>> state_dict = {(1, 2, 3): 1, (0, 3, 2): 1}
>>> state1 = HOState(n_modes, gridpoints, state_dict)
>>> state1.dot(state1)
2

## `VibronicHO`

```python
class VibronicHO
```

Represent the tensor product of harmonic oscillator states.

Args:
    states (int): the number of electronic states
    modes (int): the number of vibrational modes
    gridpoints (int): the number of gridpoints used to discretize the state
    ho_states (Sequence[HOState]): a sequence of :class:`~.pennylane.labs.trotter_error.HOState` objects representing the harmonic oscillator states

**Example**

>>> from pennylane.labs.trotter_error import HOState, VibronicHO
>>> n_modes = 3
>>> n_states = 2
>>> gridpoints = 5
>>> state_dict = {(1, 2, 3): 1, (0, 3, 2): 1}
>>> state = HOState(n_modes, gridpoints, state_dict)
>>> VibronicHO(n_states, n_modes, gridpoints, [state, state])
VibronicHO([HOState(modes=3, gridpoints=5, <Compressed Sparse Row sparse array of dtype 'int64'
    with 2 stored elements and shape (125, 1)>
  Coords    Values
  (17, 0)   1
  (38, 0)   1), HOState(modes=3, gridpoints=5, <Compressed Sparse Row sparse array of dtype 'int64'
    with 2 stored elements and shape (125, 1)>
  Coords    Values
  (17, 0)   1
  (38, 0)   1)])

### `zero_state`

```python
def zero_state(cls, states: int, modes: int, gridpoints: int) -> VibronicHO
```

Construct a :class:`~.pennylane.labs.trotter_error.VibronicHO` representing the zero state.

Args:
    states (int): the number of electronic states
    modes (int): the number of vibrational modes
    gridpoints(int): the number of gridpoints used to discretize the state

Returns:
    VibronicHO: a :class:`~.pennylane.labs.trotter_error.VibronicHO` representing the zero state

**Example**

>>> from pennylane.labs.trotter_error import VibronicHO
>>> VibronicHO.zero_state(2, 3, 5)
VibronicHO([HOState(modes=3, gridpoints=5, <Compressed Sparse Row sparse array of dtype 'float64'
    with 0 stored elements and shape (125, 1)>), HOState(modes=3, gridpoints=5, <Compressed Sparse Row sparse array of dtype 'float64'
    with 0 stored elements and shape (125, 1)>)])

### `dot`

```python
def dot(self, other: VibronicHO)
```

Return the dot product of two :class:`~.pennylane.labs.trotter_error.VibronicHO` objects.

Args:
    other (VibronicHO): the state to take the dot product with

Returns:
    float: the dot product of the two states

**Example**

>>> from pennylane.labs.trotter_error import HOState, VibronicHO
>>> n_modes = 3
>>> n_states = 2
>>> gridpoints = 5
>>> state_dict = {(1, 2, 3): 1, (0, 3, 2): 1}
>>> state = HOState(n_modes, gridpoints, state_dict)
>>> vo_state = VibronicHO(n_states, n_modes, gridpoints, [state, state])
>>> vo_state.dot(vo_state)
4
