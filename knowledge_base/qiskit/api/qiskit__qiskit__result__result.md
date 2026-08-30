---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/result/result.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/result/result.py
license: Apache-2.0
---

## Module `qiskit/result/result.py`

Model for schema-conformant Results.

## `Result`

```python
class Result
```

Model for Results.

Attributes:
    backend_name (str): backend name.
    backend_version (str): backend version, in the form X.Y.Z.
    job_id (str): unique execution id from the backend.
    success (bool): True if complete input executed correctly. (Implies
        each experiment success)
    results (list[ExperimentResult]): corresponding results for array of
        experiments of the input
    date (str): optional date field
    status (str): optional status field
    header (dict): an optional free form dictionary header

### `to_dict`

```python
def to_dict(self)
```

Return a dictionary format representation of the Result

Returns:
    dict: The dictionary form of the Result

### `from_dict`

```python
def from_dict(cls, data)
```

Create a new :class:`~.Result` object from a dictionary.

Args:
    data (dict): A dictionary representing the Result to create. It
                 will be in the same format as output by
                 :meth:`to_dict`.
Returns:
    Result: The ``Result`` object from the input dictionary.

### `data`

```python
def data(self, experiment=None)
```

Get the raw data for an experiment.

Note this data will be a single classical and quantum register and in a
format required by the results schema. We recommend that most users use
the get_xxx method, and the data will be post-processed for the data type.

Args:
    experiment (str or QuantumCircuit or int or None): the index of the
        experiment. Several types are accepted for convenience::
        * str: the name of the experiment.
        * QuantumCircuit: the name of the circuit instance will be used.
        * int: the position of the experiment.
        * None: if there is only one experiment, returns it.

Returns:
    dict: A dictionary of results data for an experiment. The data
    depends on the backend it ran on and the settings of `meas_level`,
    `meas_return` and `memory`.

    OpenQASM backends return a dictionary of dictionary with the key
    'counts' and  with the counts, with the second dictionary keys
    containing a string in hex format (``0x123``) and values equal to
    the number of times this outcome was measured.

    Statevector backends return a dictionary with key 'statevector' and
    values being a list[list[complex components]] list of 2^num_qubits
    complex amplitudes. Where each complex number is represented as a 2
    entry list for each component. For example, a list of
    [0.5+1j, 0-1j] would be represented as [[0.5, 1], [0, -1]].

    Unitary backends return a dictionary with key 'unitary' and values
    being a list[list[list[complex components]]] list of
    2^num_qubits x 2^num_qubits complex amplitudes in a two entry list for
    each component. For example if the amplitude is
    [[0.5+0j, 0-1j], ...] the value returned will be
    [[[0.5, 0], [0, -1]], ...].

    The simulator backends also have an optional key 'snapshots' which
    returns a dict of snapshots specified by the simulator backend.
    The value is of the form dict[slot: dict[str: array]]
    where the keys are the requested snapshot slots, and the values are
    a dictionary of the snapshots.

Raises:
    QiskitError: if data for the experiment could not be retrieved.

### `get_memory`

```python
def get_memory(self, experiment=None)
```

Get the sequence of memory states (readouts) for each shot
The data from the experiment is a list of format
['00000', '01000', '10100', '10100', '11101', '11100', '00101', ..., '01010']

Args:
    experiment (str or QuantumCircuit or int or None): the index of the
        experiment, as specified by ``data()``.

Returns:
    List[str] or np.ndarray: Either the list of each outcome, formatted according to
    registers in circuit or a complex numpy np.ndarray with shape:

        ============  =============  =====
        `meas_level`  `meas_return`  shape
        ============  =============  =====
        0             `single`       np.ndarray[shots, memory_slots, memory_slot_size]
        0             `avg`          np.ndarray[memory_slots, memory_slot_size]
        1             `single`       np.ndarray[shots, memory_slots]
        1             `avg`          np.ndarray[memory_slots]
        2             `memory=True`  list
        ============  =============  =====

Raises:
    QiskitError: if there is no memory data for the circuit.

### `get_counts`

```python
def get_counts(self, experiment=None)
```

Get the histogram data of an experiment.

Args:
    experiment (str or QuantumCircuit or int or None): the index of the
        experiment, as specified by ``data([experiment])``.

Returns:
    dict[str, int] or list[dict[str, int]]: a dictionary or a list of
    dictionaries. A dictionary has the counts for each qubit with
    the keys containing a string in binary format and separated
    according to the registers in circuit (e.g. ``0100 1110``).
    The string is little-endian (cr[0] on the right hand side).

Raises:
    QiskitError: if there are no counts for the experiment.

### `get_statevector`

```python
def get_statevector(self, experiment=None, decimals=None)
```

Get the final statevector of an experiment.

Args:
    experiment (str or QuantumCircuit or int or None): the index of the
        experiment, as specified by ``data()``.
    decimals (int): the number of decimals in the statevector.
        If None, does not round.

Returns:
    list[complex]: list of 2^num_qubits complex amplitudes.

Raises:
    QiskitError: if there is no statevector for the experiment.

### `get_unitary`

```python
def get_unitary(self, experiment=None, decimals=None)
```

Get the final unitary of an experiment.

Args:
    experiment (str or QuantumCircuit or int or None): the index of the
        experiment, as specified by ``data()``.
    decimals (int): the number of decimals in the unitary.
        If None, does not round.

Returns:
    list[list[complex]]: list of 2^num_qubits x 2^num_qubits complex
        amplitudes.

Raises:
    QiskitError: if there is no unitary for the experiment.
