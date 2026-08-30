---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/result/distributions/quasi.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/result/distributions/quasi.py
license: Apache-2.0
---

## Module `qiskit/result/distributions/quasi.py`

Quasidistribution class

## `QuasiDistribution`

```python
class QuasiDistribution(dict)
```

A dict-like class for representing quasi-probabilities.

### `__init__`

```python
def __init__(self, data, shots=None, stddev_upper_bound=None)
```

Builds a quasiprobability distribution object.

.. note::

    The quasiprobability values might include floating-point errors.
    ``QuasiDistribution.__repr__`` rounds using :meth:`numpy.round`
    and the parameter ``ndigits`` can be manipulated with the
    class attribute ``__ndigits__``. The default is ``15``.

Args:
    data (dict): Input quasiprobability data. Where the keys
        represent a measured classical value and the value is a
        float for the quasiprobability of that result.
        The keys can be one of several formats:

            * A hexadecimal string of the form ``"0x4a"``
            * A bit string e.g. ``'0b1011'`` or ``"01011"``
            * An integer

    shots (int): Number of shots the distribution was derived from.
    stddev_upper_bound (float): An upper bound for the standard deviation

Raises:
    TypeError: If the input keys are not a string or int
    ValueError: If the string format of the keys is incorrect

### `nearest_probability_distribution`

```python
def nearest_probability_distribution(self, return_distance=False)
```

Takes a quasiprobability distribution and maps
it to the closest probability distribution as defined by
the L2-norm.

Args:
    return_distance (bool): Return the L2 distance between distributions.

Returns:
    ProbDistribution: Nearest probability distribution.
    float: Euclidean (L2) distance of distributions.

Notes:
    Method from Smolin et al., Phys. Rev. Lett. 108, 070502 (2012).

### `binary_probabilities`

```python
def binary_probabilities(self, num_bits=None)
```

Build a quasi-probabilities dictionary with binary string keys

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

Build a quasi-probabilities dictionary with hexadecimal string keys

Returns:
    dict: A dictionary where the keys are hexadecimal strings in the
        format ``"0x1a"``

### `stddev_upper_bound`

```python
def stddev_upper_bound(self)
```

Return an upper bound on standard deviation of expval estimator.
