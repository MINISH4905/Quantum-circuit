---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/result/distributions/probability.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/result/distributions/probability.py
license: Apache-2.0
---

## Module `qiskit/result/distributions/probability.py`

Class for probability distributions.

## `ProbDistribution`

```python
class ProbDistribution(dict)
```

A generic dict-like class for probability distributions.

### `__init__`

```python
def __init__(self, data, shots=None)
```

Builds a probability distribution object.

Args:
    data (dict): Input probability data. Where the keys
        represent a measured classical value and the value is a
        float for the probability of that result.
        The keys can be one of several formats:

            * A hexadecimal string of the form ``"0x4a"``
            * A bit string e.g. ``'0b1011'`` or ``"01011"``
            * An integer

    shots (int): Number of shots the distribution was derived from.

Raises:
    TypeError: If the input keys are not a string or int
    ValueError: If the string format of the keys is incorrect

### `binary_probabilities`

```python
def binary_probabilities(self, num_bits=None)
```

Build a probabilities dictionary with binary string keys

Args:
    num_bits (int): number of bits in the binary bitstrings (leading
        zeros will be padded). If None, a default value will be used.
        If keys are given as integers or strings with binary or hex prefix,
        the default value will be derived from the largest key present.
        If keys are given as bitstrings without prefix,
        the default value will be derived from the largest key length.

Returns:
    dict: A dictionary where the keys are binary strings in the format
        ``"0110"``

### `hex_probabilities`

```python
def hex_probabilities(self)
```

Build a probabilities dictionary with hexadecimal string keys

Returns:
    dict: A dictionary where the keys are hexadecimal strings in the
        format ``"0x1a"``
