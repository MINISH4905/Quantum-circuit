---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/fourier/utils.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/fourier/utils.py
license: Apache-2.0
---

## Module `pennylane/fourier/utils.py`

Contains utility functions for the Fourier module.

## `format_nvec`

```python
def format_nvec(nvec)
```

Nice strings representing tuples of integers.

## `get_spectrum`

```python
def get_spectrum(op, decimals)
```

Extract the frequencies contributed by an input-encoding gate to the
overall Fourier representation of a quantum circuit.

If :math:`G` is the generator of the input-encoding gate :math:`\exp(-i x G)`,
the frequencies are the differences between any two of :math:`G`'s eigenvalues.
We only compute non-negative frequencies in this subroutine.

Args:
    op (~pennylane.operation.Operation): Operation to extract
        the frequencies for
    decimals (int): Number of decimal places to round the frequencies to

Returns:
    set[float]: non-negative frequencies contributed by this input-encoding gate

## `join_spectra`

```python
def join_spectra(spec1, spec2)
```

Join two sets of frequencies that belong to the same input.

Since :math:`\exp(i a x)\exp(i b x) = \exp(i (a+b) x)`, the spectra of two gates
encoding the same :math:`x` are joined by computing the set of sums and absolute
values of differences of their elements.
We only compute non-negative frequencies in this subroutine and assume the inputs
to be non-negative frequencies as well.

Args:
    spec1 (set[float]): first spectrum
    spec2 (set[float]): second spectrum
Returns:
    set[float]: joined spectrum
