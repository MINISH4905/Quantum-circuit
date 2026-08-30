---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/result/models.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/result/models.py
license: Apache-2.0
---

## Module `qiskit/result/models.py`

Schema and helper models for schema-conformant Results.

## `MeasReturnType`

```python
class MeasReturnType(str, Enum)
```

meas_return allowed values defined by legacy PulseQobjConfig object but still used by Result.

## `MeasLevel`

```python
class MeasLevel(IntEnum)
```

MeasLevel allowed values defined by legacy PulseQobjConfig object but still used by Result.

## `ExperimentResultData`

```python
class ExperimentResultData
```

Class representing experiment result data

### `__init__`

```python
def __init__(self, counts=None, snapshots=None, memory=None, statevector=None, unitary=None, **kwargs)
```

Initialize an ExperimentResultData class

Args:
    counts (dict): A dictionary where the keys are the result in
        hexadecimal as string of the format "0xff" and the value
        is the number of counts for that result
    snapshots (dict): A dictionary where the key is the snapshot
        slot and the value is a dictionary of the snapshots for
        that slot.
    memory (list): A list of results per shot if the run had
        memory enabled
    statevector (list or numpy.array): A list or numpy array of the
        statevector result
    unitary (list or numpy.array): A list or numpy array of the
        unitary result
    kwargs (any): additional data key-value pairs.

### `to_dict`

```python
def to_dict(self)
```

Return a dictionary format representation of the ExperimentResultData

Returns:
    dict: The dictionary form of the ExperimentResultData

### `from_dict`

```python
def from_dict(cls, data)
```

Create a new ExperimentResultData object from a dictionary.

Args:
    data (dict): A dictionary representing the ExperimentResultData to
                 create. It will be in the same format as output by
                 :meth:`to_dict`
Returns:
    ExperimentResultData: The ``ExperimentResultData`` object from the
                          input dictionary.

## `ExperimentResult`

```python
class ExperimentResult
```

Class representing an Experiment Result.

Attributes:
    shots (int or tuple): the starting and ending shot for this data.
    success (bool): if true, we can trust results for this experiment.
    data (ExperimentResultData): results information.
    meas_level (int): Measurement result level.

### `__init__`

```python
def __init__(self, shots, success, data, meas_level=MeasLevel.CLASSIFIED, status=None, seed=None, meas_return=None, header=None, **kwargs)
```

Initialize an ExperimentResult object.

Args:
    shots(int or tuple): if an integer the number of shots or if a
        tuple the starting and ending shot for this data
    success (bool): True if the experiment was successful
    data (ExperimentResultData): The data for the experiment's
        result
    meas_level (int): Measurement result level
    status (str): The status of the experiment
    seed (int): The seed used for simulation (if run on a simulator)
    meas_return (str): The type of measurement returned
    header (dict): A free form dictionary header for the experiment
    kwargs: Arbitrary extra fields

Raises:
    QiskitError: If meas_return or meas_level are not valid values

### `to_dict`

```python
def to_dict(self)
```

Return a dictionary format representation of the ExperimentResult

Returns:
    dict: The dictionary form of the ExperimentResult

### `from_dict`

```python
def from_dict(cls, data)
```

Create a new ExperimentResult object from a dictionary.

Args:
    data (dict): A dictionary representing the ExperimentResult to
                 create. It will be in the same format as output by
                 :meth:`to_dict`

Returns:
    ExperimentResult: The ``ExperimentResult`` object from the input
                      dictionary.
