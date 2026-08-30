---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/result/utils.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/result/utils.py
license: Apache-2.0
---

## Module `qiskit/result/utils.py`

Utility functions for working with Results.

## `marginal_counts`

```python
def marginal_counts(result: dict | Result, indices: list[int] | None=None, inplace: bool=False, format_marginal: bool=False, marginalize_memory: bool | None=True) -> dict[str, int] | Result
```

Marginalize counts from an experiment over some indices of interest.

Args:
    result: result to be marginalized
        (a Result object or a dict(str, int) of counts).
    indices: The bit positions of interest
        to marginalize over. If ``None`` (default), do not marginalize at all.
    inplace: Default: False. Operates on the original Result
        argument if True, leading to loss of original Job Result.
        It has no effect if ``result`` is a dict.
    format_marginal: Default: False. If True, takes the output of
        marginalize and formats it with placeholders between cregs and
        for non-indices.
    marginalize_memory: If True, then also marginalize the memory field (if present).
        If False, remove the memory field from the result.
        If None, leave the memory field as is.

Returns:
    Result or dict(str, int): A Result object or a dictionary with
        the observed counts, marginalized to only account for frequency
        of observations of bits of interest.

Raises:
    QiskitError: in case of invalid indices to marginalize over.

## `marginal_memory`

```python
def marginal_memory(memory: list[str] | np.ndarray, indices: list[int] | None=None, int_return: bool=False, hex_return: bool=False, avg_data: bool=False, parallel_threshold: int=1000) -> list[str] | np.ndarray
```

Marginalize shot memory

This function is multithreaded and will launch a thread pool with threads equal to the number
of CPUs by default. You can tune the number of threads with the ``RAYON_NUM_THREADS``
environment variable. For example, setting ``RAYON_NUM_THREADS=4`` would limit the thread pool
to 4 threads.

Args:
    memory: The input memory list, this is either a list of hexadecimal strings to be marginalized
        representing measure level 2 memory or a numpy array representing level 0 measurement
        memory (single or avg) or level 1 measurement memory (single or avg).
    indices: The bit positions of interest to marginalize over. If
        ``None`` (default), do not marginalize at all.
    int_return: If set to ``True`` the output will be a list of integers.
        By default the return type is a bit string. This and ``hex_return``
        are mutually exclusive and can not be specified at the same time. This option only has an
        effect with memory level 2.
    hex_return: If set to ``True`` the output will be a list of hexadecimal
        strings. By default the return type is a bit string. This and
        ``int_return`` are mutually exclusive and can not be specified
        at the same time. This option only has an effect with memory level 2.
    avg_data: If a 2 dimensional numpy array is passed in for ``memory`` this can be set to
        ``True`` to indicate it's a avg level 0 data instead of level 1
        single data.
    parallel_threshold: The number of elements in ``memory`` to start running in multiple
        threads. If ``len(memory)`` is >= this value, the function will run in multiple
        threads. By default this is set to 1000.

Returns:
    marginal_memory: The list of marginalized memory

Raises:
    ValueError: if both ``int_return`` and ``hex_return`` are set to ``True``

## `marginal_distribution`

```python
def marginal_distribution(counts: dict, indices: Sequence[int] | None=None, format_marginal: bool=False) -> dict[str, int]
```

Marginalize counts from an experiment over some indices of interest.

Unlike :func:`~.marginal_counts` this function respects the order of
the input ``indices``. If the input ``indices`` list is specified then the order
the bit indices are specified will be the output order of the bitstrings
in the marginalized output.

Args:
    counts: result to be marginalized
    indices: The bit positions of interest
        to marginalize over. If ``None`` (default), do not marginalize at all.
    format_marginal: Default: False. If True, takes the output of
        marginalize and formats it with placeholders between cregs and
        for non-indices.
Returns:
    dict(str, int): A marginalized dictionary
Raises:
    QiskitError: If any value in ``indices`` is invalid or the ``counts`` dict
    is invalid.
