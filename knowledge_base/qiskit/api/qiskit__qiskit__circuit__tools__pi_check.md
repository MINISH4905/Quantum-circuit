---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/tools/pi_check.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/tools/pi_check.py
license: Apache-2.0
---

## Module `qiskit/circuit/tools/pi_check.py`

Check if number close to values of PI

## `pi_check`

```python
def pi_check(inpt, eps=1e-09, output='text', ndigits=None)
```

Computes if a number is close to an integer
fraction or multiple of PI and returns the
corresponding string.

Args:
    inpt (float): Number to check.
    eps (float): EPS to check against.
    output (str): Options are 'text' (default),
                  'latex', 'mpl', and 'qasm'.
    ndigits (int or None): Number of digits to print
                           if returning raw inpt.
                           If `None` (default), Python's
                           default float formatting is used.

Returns:
    str: string representation of output.

Raises:
    QiskitError: if output is not a valid option.
