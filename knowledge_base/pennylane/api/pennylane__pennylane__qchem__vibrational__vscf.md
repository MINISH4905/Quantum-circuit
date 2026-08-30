---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/vibrational/vscf.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/vibrational/vscf.py
license: Apache-2.0
---

## Module `pennylane/qchem/vibrational/vscf.py`

This module contains functions to perform VSCF calculation.

## `vscf_integrals`

```python
def vscf_integrals(h_integrals, d_integrals=None, modals=None, cutoff=None, cutoff_ratio=1e-06)
```

Generates vibrational self-consistent field rotated integrals.

This function converts the Christiansen vibrational Hamiltonian integrals obtained in the harmonic
oscillator basis to integrals in the vibrational self-consistent field (VSCF) basis.
The implementation is based on the method described in
`J. Chem. Theory Comput. 2010, 6, 235–248 <https://pubs.acs.org/doi/10.1021/ct9004454>`_.

Args:
    h_integrals (list[TensorLike[float]]): List of Hamiltonian integrals for up to 3 coupled vibrational modes.
        Look at the Usage Details for more information.
    d_integrals (list[TensorLike[float]]): List of dipole integrals for up to 3 coupled vibrational modes.
        Look at the Usage Details for more information.
    modals (list[int]): list containing the maximum number of modals to consider for each vibrational mode.
        Default value is the maximum number of modals.
    cutoff (float): threshold value for including matrix elements into operator
    cutoff_ratio (float): ratio for discarding elements with respect to biggest element in the integrals.
        Default value is ``1e-6``.

Returns:
    tuple: a tuple containing:
        - list[TensorLike[float]]: List of Hamiltonian integrals in VSCF basis for up to 3 coupled vibrational modes.
        - list[TensorLike[float]]: List of dipole integrals in VSCF basis for up to 3 coupled vibrational modes.

    ``None`` is returned if ``d_integrals`` is ``None``.

**Example**

>>> h1 = np.array([[[0.00968289, 0.00233724, 0.0007408,  0.00199125],
...                 [0.00233724, 0.02958449, 0.00675431, 0.0021936],
...                 [0.0007408,  0.00675431, 0.0506012,  0.01280986],
...                 [0.00199125, 0.0021936,  0.01280986, 0.07282307]]])
>>> qp.qchem.vscf_integrals(h_integrals=[h1], modals=[4,4,4])
([array([[[ 9.36124041e-03, -4.20128342e-19,  3.25260652e-19,
        1.08420217e-18],
        [-9.21571847e-19,  2.77803512e-02, -3.46944695e-18,
        5.63785130e-18],
        [-3.25260652e-19, -8.67361738e-19,  4.63297357e-02,
        -1.04083409e-17],
        [ 1.30104261e-18,  5.20417043e-18, -1.38777878e-17,
        7.92203227e-02]]])],
None)


.. details::
    :title: Usage Details

    The ``h_integral`` tensor must have one of these dimensions:

    - 1-mode coupled integrals: `(n, m, m)`
    - 2-mode coupled integrals: `(n, n, m, m, m, m)`
    - 3-mode coupled integrals: `(n, n, n, m, m, m, m, m, m)`

    where ``n`` is the number of vibrational modes in the molecule and ``m`` represents the number
    of modals.

    The ``d_integral`` tensor must have one of these dimensions:

    - 1-mode coupled integrals: `(3, n, m)`
    - 2-mode coupled integrals: `(3, n, n, m, m, m, m)`
    - 3-mode coupled integrals: `(3, n, n, n, m, m, m, m, m, m)`

    where ``n`` is the number of vibrational modes in the molecule, ``m`` represents the number
    of modals and the first axis represents the ``x, y, z`` component of the dipole. Default is ``None``.
