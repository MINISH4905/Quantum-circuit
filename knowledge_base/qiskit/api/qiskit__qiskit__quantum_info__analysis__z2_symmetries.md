---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/analysis/z2_symmetries.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/analysis/z2_symmetries.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/analysis/z2_symmetries.py`

Z2Symmetries for SparsePauliOp.

## `Z2Symmetries`

```python
class Z2Symmetries
```

The $Z_2$ symmetry converter identifies symmetries from the problem hamiltonian and uses them to
provide a tapered - more efficient - representation of operators as Paulis for this problem. For each
identified symmetry, one qubit can be eliminated in the Pauli representation at the cost of having to
test two symmetry sectors (for the two possible eigenvalues - tapering values - of the symmetry).
In certain problems such as the finding of the main operator's ground state, one can a priori
identify the symmetry sector of the solution and thus effectively reduce the computational overhead.

The following attributes can be read and updated once the ``Z2Symmetries`` object has been
constructed.

Attributes:
    tapering_values (list[int] or None): Values determining the sector.
    tol (float): The tolerance threshold for ignoring real and complex parts of a coefficient.

References:
    [1]: Bravyi, S., et al, "Tapering off qubits to simulate fermionic Hamiltonians"
        `arXiv:1701.08213 <https://arxiv.org/abs/1701.08213>`__

### `__init__`

```python
def __init__(self, symmetries: Iterable[Pauli], sq_paulis: Iterable[Pauli], sq_list: Iterable[int], tapering_values: Iterable[int] | None=None, *, tol: float=1e-14)
```

Args:
    symmetries: Object representing the list of $Z_2$ symmetries. These correspond to
        the generators of the symmetry group $\langle \tau_1, \tau_2\dots \rangle>$.
    sq_paulis: Object representing the list of single-qubit Pauli $\sigma^x_{q(i)}$
        anti-commuting with the symmetry $\tau_i$ and commuting with all the other symmetries
        $\tau_{j\neq i}$. These operators are used to construct the unitary Clifford operators.
    sq_list: The list of indices $q(i)$ of the single-qubit Pauli operators used to build the
        Clifford operators.
    tapering_values: List of eigenvalues determining the symmetry sector for each symmetry.
    tol: Tolerance threshold for ignoring real and complex parts of a coefficient.

Raises:
    QiskitError: Invalid paulis. The lists of symmetries, single-qubit paulis support paulis
        and tapering values must be of equal length. This length is the number of applied
        symmetries and translates directly to the number of eliminated qubits.

### `symmetries`

```python
def symmetries(self) -> list[Pauli]
```

Return symmetries.

### `sq_paulis`

```python
def sq_paulis(self) -> list[Pauli]
```

Return sq paulis.

### `cliffords`

```python
def cliffords(self) -> list[SparsePauliOp]
```

Get clifford operators, built based on symmetries and single-qubit X.

Returns:
    A list of unitaries used to diagonalize the Hamiltonian.

### `sq_list`

```python
def sq_list(self) -> list[int]
```

Return sq list.

### `settings`

```python
def settings(self) -> dict
```

Return operator settings.

### `is_empty`

```python
def is_empty(self) -> bool
```

Check the z2_symmetries is empty or not.

Returns:
    Empty or not.

### `find_z2_symmetries`

```python
def find_z2_symmetries(cls, operator: SparsePauliOp) -> Z2Symmetries
```

Finds Z2 Pauli-type symmetries of a :class:`.SparsePauliOp`.

Returns:
    A ``Z2Symmetries`` instance.

### `convert_clifford`

```python
def convert_clifford(self, operator: SparsePauliOp) -> SparsePauliOp
```

This method operates the first part of the tapering.
It converts the operator by composing it with the clifford unitaries defined in the current
symmetry.

Args:
    operator: The to-be-tapered operator.

Returns:
    ``SparsePauliOp`` corresponding to the converted operator.

### `taper_clifford`

```python
def taper_clifford(self, operator: SparsePauliOp) -> SparsePauliOp | list[SparsePauliOp]
```

Operate the second part of the tapering.
This function assumes that the input operators have already been transformed using
:meth:`convert_clifford`. The redundant qubits due to the symmetries are dropped and
replaced by their two possible eigenvalues.

Args:
    operator: Partially tapered operator resulting from a call to :meth:`convert_clifford`.

Returns:
    If tapering_values is None: [:class:`SparsePauliOp`]; otherwise, :class:`SparsePauliOp`.

### `taper`

```python
def taper(self, operator: SparsePauliOp) -> SparsePauliOp | list[SparsePauliOp]
```

Taper an operator based on the z2_symmetries info and sector defined by `tapering_values`.
Returns operator if the symmetry object is empty.

The tapering is a two-step algorithm which first converts the operator into a
:class:`SparsePauliOp` with same eigenvalues but where some qubits are only acted upon
with the Pauli operators I or X.
The number M of these redundant qubits is equal to the number M of identified symmetries.

The second step of the reduction consists in replacing these qubits with the possible
eigenvalues of the corresponding Pauli X, giving 2^M new operators with M less qubits.
If an eigenvalue sector was previously identified for the solution, then this reduces to
1 new operator with M less qubits.

Args:
    operator: The to-be-tapered operator.

Returns:
    If tapering_values is None: [:class:`SparsePauliOp`]; otherwise, :class:`SparsePauliOp`.

### `__eq__`

```python
def __eq__(self, other: Z2Symmetries) -> bool
```

Overload `==` operation to evaluate equality between Z2Symmetries.

Args:
    other: The `Z2Symmetries` to compare to self.

Returns:
    A bool equal to the equality of self and other.
