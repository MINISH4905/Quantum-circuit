---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/compact_hamiltonian.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/compact_hamiltonian.py
license: Apache-2.0
---

## Module `pennylane/estimator/compact_hamiltonian.py`

Contains classes used to compactly store the metadata of various Hamiltonians which are relevant for resource estimation.

## `CDFHamiltonian`

```python
class CDFHamiltonian
```

For a compressed double-factorized (CDF) Hamiltonian, stores the minimum necessary information pertaining to resource estimation.

The form of this Hamiltonian is described in `arXiv:2506.15784 <https://arxiv.org/abs/2506.15784>`_.

Args:
    num_orbitals (int): number of spatial orbitals
    num_fragments (int): number of fragments in the compressed double-factorized (CDF) representation
    one_norm (float | None): the one-norm of the Hamiltonian

Raises:
    TypeError: if ``num_orbitals``, or ``num_fragments`` is not a positive integer
    TypeError: if ``one_norm`` is provided but is not a non-negative float or integer

.. seealso::
    :class:`~.estimator.templates.trotter.TrotterCDF`

### `__post_init__`

```python
def __post_init__(self)
```

Checks the types of the inputs.

## `THCHamiltonian`

```python
class THCHamiltonian
```

For a tensor hypercontracted (THC) Hamiltonian, stores the minimum necessary information pertaining to resource estimation.

The form of this Hamiltonian is described in `arXiv:2407.04432 <https://arxiv.org/abs/2407.04432>`_.

Args:
    num_orbitals (int): number of spatial orbitals
    tensor_rank (int):  tensor rank of two-body integrals in the tensor hypercontracted (THC) representation
    one_norm (float | None): the one-norm of the Hamiltonian

Raises:
    TypeError: if ``num_orbitals``, or ``tensor_rank`` is not a positive integer
    TypeError: if ``one_norm`` is provided but is not a non-negative float or integer


.. seealso::
    :class:`~.estimator.templates.trotter.TrotterTHC`

### `__post_init__`

```python
def __post_init__(self)
```

Checks the types of the inputs.

## `VibrationalHamiltonian`

```python
class VibrationalHamiltonian
```

For a vibrational Hamiltonian, stores the minimum necessary information pertaining to resource estimation.

The form of this Hamiltonian is described in `arXiv:2504.10602 <https://arxiv.org/pdf/2504.10602>`_.

Args:
    num_modes (int): number of vibrational modes
    grid_size (int): number of grid points used to discretize each mode
    taylor_degree (int): degree of the Taylor expansion used in the vibrational representation
    one_norm (float | None): the one-norm of the Hamiltonian

Raises:
    TypeError: if ``num_modes``, ``grid_size``, or ``taylor_degree`` is not a positive integer
    TypeError: if ``one_norm`` is provided but is not a non-negative float or integer

.. seealso::
    :class:`~.estimator.templates.trotter.TrotterVibrational`

### `__post_init__`

```python
def __post_init__(self)
```

Checks the types of the inputs.

## `VibronicHamiltonian`

```python
class VibronicHamiltonian
```

For a vibronic Hamiltonian, stores the minimum necessary information pertaining to resource estimation.

The form of this Hamiltonian is described in `arXiv:2411.13669 <https://arxiv.org/abs/2411.13669>`_.

Args:
    num_modes (int): number of vibronic modes
    num_states (int): number of vibronic states
    grid_size (int): number of grid points used to discretize each mode
    taylor_degree (int): degree of the Taylor expansion used in the vibronic representation
    one_norm (float | None): the one-norm of the Hamiltonian

Raises:
    TypeError: if ``num_modes``, ``num_states``, ``grid_size``, or ``taylor_degree`` is not a positive integer
    TypeError: if ``one_norm`` is provided but is not a non-negative float or integer

.. seealso::
    :class:`~.estimator.templates.trotter.TrotterVibronic`

### `__post_init__`

```python
def __post_init__(self)
```

Checks the types of the inputs.

## `PauliHamiltonian`

```python
class PauliHamiltonian
```

Stores the minimum necessary information required to estimate resources for a Hamiltonian
expressed as a linear combination of tensor products of Pauli operators.

Args:
    num_qubits (int): total number of qubits the Hamiltonian acts on
    pauli_terms (dict[str, int] | Iterable[dict]): A dictionary representing the Hamiltonian terms
        where the keys are Pauli strings, e.g ``"XY"``, and the values are integers denoting
        how frequently a Pauli string appears in the Hamiltonian. When a list of dictionaries is
        provided, each dictionary is interpreted as a commuting group of terms. See the
        Usage Details section for more information.
    one_norm (float | int | None): the one-norm of the Hamiltonian

Raises:
    TypeError: if ``pauli_terms`` is not a dictionary
    ValueError: if ``one_norm`` is provided but is not a non-negative float or integer
    ValueError: if ``pauli_terms`` contains invalid keys (not Pauli strings) or values (not integers)

.. seealso::
    :class:`~.estimator.templates.trotter.TrotterPauli`, :class:`~.estimator.templates.select.SelectPauli`

**Example**

A ``PauliHamiltonian`` is a compact representation which can be used with compatible templates
to obtain resource estimates. Consider for example the Hamiltonian:

.. math::

    \hat{H} = 0.1 \cdot \Sigma^{30}_{j=1} \hat{X}_{j} \hat{X}_{j+1}
    - 0.05 \cdot \Sigma^{30}_{k=1} \hat{Y}_{k} \hat{Y}_{k+1} + 0.25 \cdot \Sigma^{40}_{l=1} \hat{X}_{l}

This Hamiltonian is represented in a compact form using ``PauliHamiltonian``:

>>> import pennylane.estimator as qre
>>> pauli_ham = qre.PauliHamiltonian(
...     num_qubits = 40,
...     pauli_terms = {"X":40, "XX":30, "YY":30},
...     one_norm = 14.5,  # (|0.1| * 30) + (|-0.05| * 30) + (|0.25| * 40)
... )
>>> pauli_ham
PauliHamiltonian(num_qubits=40, one_norm=14.5, pauli_terms={'X': 40, 'XX': 30, 'YY': 30})

The Hamiltonian can be used as input for other subroutines, like
:class:`~.estimator.templates.trotter.TrotterPauli`:

>>> num_steps, order = (10, 2)
>>> res = qre.estimate(qre.TrotterPauli(pauli_ham, num_steps, order))
>>> print(res)
--- Resources: ---
 Total wires: 40
   algorithmic wires: 40
   allocated wires: 0
     zero state: 0
     any state: 0
 Total gates : 9.400E+4
   'T': 8.800E+4,
   'CNOT': 2.400E+3,
   'Z': 1.200E+3,
   'S': 2.400E+3

.. details::
    :title: Usage Details

    The terms of the Hamiltonian can also be separated into groups such that all operators in
    the group commute. Users can instantiate the ``PauliHamiltonian`` by specifying these
    groups of terms directly.

    >>> import pennylane.estimator as qre
    >>> commuting_groups = [
    ...     {"X": 40, "XX": 30}, # first commuting group
    ...     {"YY": 30}, # second commuting group
    ... ]
    >>> pauli_ham = qre.PauliHamiltonian(
    ...     num_qubits = 40,
    ...     pauli_terms = commuting_groups,
    ...     one_norm = 14.5,  # (|0.1| * 30) + (|-0.05| * 30) + (|0.25| * 40)
    ... )
    >>> pauli_ham
    PauliHamiltonian(num_qubits=40, one_norm=14.5, pauli_terms=[{'X': 40, 'XX': 30}, {'YY': 30}])

    Note that providing more information will generally lead to more accurate resource estimates.

    >>> num_steps, order = (10, 2)
    >>> res = qre.estimate(qre.TrotterPauli(pauli_ham, num_steps, order))
    >>> print(res)
    --- Resources: ---
     Total wires: 40
       algorithmic wires: 40
       allocated wires: 0
         zero state: 0
         any state: 0
     Total gates : 5.014E+4
       'T': 4.708E+4,
       'CNOT': 1.260E+3,
       'Z': 600,
       'S': 1.200E+3

### `__repr__`

```python
def __repr__(self)
```

The repr dunder method for the PauliHamiltonian class.

### `__eq__`

```python
def __eq__(self, other: 'PauliHamiltonian')
```

Check if two PauliHamiltonians are identical

### `__hash__`

```python
def __hash__(self)
```

Hash function for the compact Hamiltonian representation

### `num_qubits`

```python
def num_qubits(self)
```

The number of qubits the Hamiltonian acts on

### `one_norm`

```python
def one_norm(self)
```

The one-norm of the Hamiltonian

### `pauli_terms`

```python
def pauli_terms(self)
```

A dictionary representing the distribution of Pauli words in the Hamiltonian

### `num_terms`

```python
def num_terms(self) -> int
```

The total number of Pauli words in the Hamiltonian
