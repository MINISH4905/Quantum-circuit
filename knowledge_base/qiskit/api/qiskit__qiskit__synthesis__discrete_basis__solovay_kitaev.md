---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/discrete_basis/solovay_kitaev.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/discrete_basis/solovay_kitaev.py
license: Apache-2.0
---

## Module `qiskit/synthesis/discrete_basis/solovay_kitaev.py`

Synthesize a single qubit gate to a discrete basis set.

## `SolovayKitaevDecomposition`

```python
class SolovayKitaevDecomposition
```

The Solovay Kitaev discrete decomposition algorithm.

This class is called recursively by the transpiler pass, which is why it is separated.
See :class:`~qiskit.transpiler.passes.SolovayKitaev` for more information.

### `__init__`

```python
def __init__(self, basic_approximations: str | dict[str, np.ndarray] | list[GateSequence] | None=None, *, basis_gates: list[str | Gate] | None=None, depth: int=12, check_input: bool=False) -> None
```

.. note::

    If ``basic_approximations`` is passed as ``.npy`` file, pickle is used internally
    to load the data. This is a potential security vulnerability and only trusted files
    should be loaded.

Args:
    basic_approximations: A specification of the basic SO(3) approximations in terms
        of discrete gates. At each iteration of this algorithm, the remaining error is
        approximated with the closest sequence of gates in this set.
        If a ``str``, this specifies a filename from which to load the
        approximation. If a ``dict``, then this contains
        ``{gates: effective_SO3_matrix}`` pairs,
        e.g. ``{"h t": np.array([[0, 0.7071, -0.7071], [0, -0.7071, -0.7071], [-1, 0, 0]]}``.
        If a list, this contains the same information as the dict, but already converted to
        :class:`.GateSequence` objects, which contain the SO(3) matrix and gates.

        Either this parameter, or ``basis_gates`` and ``depth`` can be specified.
    basis_gates: A list of discrete (i.e., non-parameterized) standard gates.
        Defaults to ``["h", "t", "tdg"]``.
    depth: The number of basis gate combinations to consider in the basis set. This
        determines how fast (and if) the algorithm converges and should be chosen
        sufficiently high.
    check_input: If ``True``, perform intermediate steps checking whether the matrices
        are of expected form.

### `depth`

```python
def depth(self) -> int
```

The maximum gate depth of the basic approximations.

### `check_input`

```python
def check_input(self) -> bool
```

Whether to perform runtime checks on the internal data.

### `basis_gates`

```python
def basis_gates(self) -> list[str] | None
```

The basis gate set of the basic approximations.

If ``None``, defaults to ``["h", "t", "tdg"]``.

### `load_basic_approximations`

```python
def load_basic_approximations(data: list | str | dict) -> list[GateSequence]
```

Load basic approximations.

.. note::

    If ``data`` is given as string, this method internally relies on pickle to load
    the file. This is a potential security vulnerability and only trusted files should be
    loaded.

Args:
    data: If a string, specifies the path to the file from where to load the data.
        If a dictionary, directly specifies the decompositions as ``{gates: matrix}``
        or ``{gates: (matrix, global_phase)}``. There, ``gates`` are the names of the gates
        producing the SO(3) matrix ``matrix``, e.g.
        ``{"h t": np.array([[0, 0.7071, -0.7071], [0, -0.7071, -0.7071], [-1, 0, 0]]}``
        and the ``global_phase`` can be given to account for a global phase difference
        between the U(2) matrix of the quantum gates and the stored SO(3) matrix.
        If not given, the ``global_phase`` will be assumed to be 0.

Returns:
    A list of basic approximations as type ``GateSequence``.

Raises:
    ValueError: If the number of gate combinations and associated matrices does not match.

### `save_basic_approximations`

```python
def save_basic_approximations(self, filename: str)
```

Save the basic approximations into a file.

This can then be loaded again via the class initializer (preferred) or
via :meth:`load_basic_approximations`::

    filename = "approximations.bin"
    sk.save_basic_approximations(filename)

    new_sk = SolovayKitaevDecomposition(filename)

Args:
    filename: The filename to store the approximations in.

Raises:
    ValueError: If the filename has a `.npy` extension. The format is not `.npy`,
        and storing as such can cause errors when loading the file again.

### `run`

```python
def run(self, gate_matrix: np.ndarray | Gate, recursion_degree: int, return_dag: bool=False, check_input: bool=True) -> QuantumCircuit | DAGCircuit
```

Run the algorithm.

Args:
    gate_matrix: The single-qubit gate to approximate. Can either be a :class:`.Gate`, where
        :meth:`.Gate.to_matrix` returns the matrix, or a :math:`2\times 2` unitary matrix
        representing the gate.
    recursion_degree: The recursion degree, called :math:`n` in the paper.
    return_dag: If ``True`` return a :class:`.DAGCircuit`, else a :class:`.QuantumCircuit`.
    check_input: If ``True`` check that the input matrix is valid for the decomposition.
        Overrides the class attribute with the same name, but only for this function call.

Returns:
    A one-qubit circuit approximating the ``gate_matrix`` in the specified discrete basis.

### `query_basic_approximation`

```python
def query_basic_approximation(self, gate: np.ndarray | Gate) -> QuantumCircuit
```

Query a basic approximation of a matrix.

### `find_basic_approximation`

```python
def find_basic_approximation(self, sequence: GateSequence) -> GateSequence
```

Find ``GateSequence`` in ``self._basic_approximations`` that approximates ``sequence``.

Args:
    sequence: ``GateSequence`` to find the approximation to.

Returns:
    ``GateSequence`` in that approximates ``sequence``.

## `normalize_gates`

```python
def normalize_gates(gates: list[Gate | str]) -> list[Gate]
```

Normalize a list[Gate | str] into list[Gate].
