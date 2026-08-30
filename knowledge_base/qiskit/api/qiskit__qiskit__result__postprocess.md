---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/result/postprocess.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/result/postprocess.py
license: Apache-2.0
---

## Module `qiskit/result/postprocess.py`

Post-processing of raw result.

## `format_counts_memory`

```python
def format_counts_memory(shot_memory, header=None)
```

Format a single bitstring (memory) from a single shot experiment.

- The hexadecimals are expanded to bitstrings

- Spaces are inserted at register divisions.

Args:
    shot_memory (str): result of a single experiment.
    header (dict): the experiment header dictionary containing
        useful information for postprocessing. creg_sizes
        are a nested list where the inner element is a list
        of creg name, creg size pairs. memory_slots is an integer
        specifying the number of total memory_slots in the experiment.

Returns:
    str: a formatted memory

## `format_level_0_memory`

```python
def format_level_0_memory(memory)
```

Format an experiment result memory object for measurement level 0.

Args:
    memory (list): Memory from experiment with `meas_level==0`. `avg` or
        `single` will be inferred from shape of result memory.

Returns:
    np.ndarray: Measurement level 0 complex numpy array

Raises:
    QiskitError: If the returned numpy array does not have 2 (avg) or 3 (single)
        indices.

## `format_level_1_memory`

```python
def format_level_1_memory(memory)
```

Format an experiment result memory object for measurement level 1.

Args:
    memory (list): Memory from experiment with `meas_level==1`. `avg` or
        `single` will be inferred from shape of result memory.

Returns:
    np.ndarray: Measurement level 1 complex numpy array

Raises:
    QiskitError: If the returned numpy array does not have 1 (avg) or 2 (single)
        indices.

## `format_level_2_memory`

```python
def format_level_2_memory(memory, header=None)
```

Format an experiment result memory object for measurement level 2.

Args:
    memory (list): Memory from experiment with `meas_level==2` and `memory==True`.
    header (dict): the experiment header dictionary containing
        useful information for postprocessing.

Returns:
    list[str]: List of bitstrings

## `format_counts`

```python
def format_counts(counts, header=None)
```

Format a single experiment result coming from backend to present
to the Qiskit user.

Args:
    counts (dict): counts histogram of multiple shots
    header (dict): the experiment header dictionary containing
        useful information for postprocessing.

Returns:
    dict: a formatted counts

## `format_statevector`

```python
def format_statevector(vec, decimals=None)
```

Format statevector coming from the backend to present to the Qiskit user.

Args:
    vec (list): a list of [re, im] complex numbers.
    decimals (int): the number of decimals in the statevector.
        If None, no rounding is done.

Returns:
    list[complex]: a list of python complex numbers.

## `format_unitary`

```python
def format_unitary(mat, decimals=None)
```

Format unitary coming from the backend to present to the Qiskit user.

Args:
    mat (list[list]): a list of list of [re, im] complex numbers
    decimals (int): the number of decimals in the statevector.
        If None, no rounding is done.

Returns:
    list[list[complex]]: a matrix of complex numbers
