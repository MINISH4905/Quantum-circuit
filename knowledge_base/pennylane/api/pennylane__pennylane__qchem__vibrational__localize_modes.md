---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/vibrational/localize_modes.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/vibrational/localize_modes.py
license: Apache-2.0
---

## Module `pennylane/qchem/vibrational/localize_modes.py`

This module contains functions to localize normal modes.

## `localize_normal_modes`

```python
def localize_normal_modes(freqs, vecs, bins=[2600])
```

Computes spatially localized vibrational normal modes.

The vibrational normal modes are localized using a localizing unitary following the procedure
described in `J. Chem. Phys. 141, 104105 (2014)
<https://pubs.aip.org/aip/jcp/article-abstract/141/10/104105/74317/
Efficient-anharmonic-vibrational-spectroscopy-for?redirectedFrom=fulltext>`_. The localizing
unitary :math:`U` is defined in terms of the normal and local coordinates, :math:`q` and
:math:`\tilde{q}`, respectively as:

.. math::

    \tilde{q} = \sum_{j=1}^M U_{ij} q_j,

where :math:`M` is the number of modes. The normal modes
can be separately localized, to prevent mixing between specific groups of normal modes, by
defining frequency ranges in ``bins``. For instance, ``bins = [2600]`` allows to separately
localize modes that have frequencies above and below :math:`2600` reciprocal centimetre (:math:`\text{cm}^{-1}`).
Similarly, ``bins = [1300, 2600]`` allows to separately localize modes in three groups that have
frequencies below :math:`1300`, between :math:`1300-2600` and above :math:`2600`.

Args:
    freqs (TensorLike[float]): normal mode frequencies in reciprocal centimetre (:math:`\text{cm}^{-1}`).
    vecs (TensorLike[float]): displacement vectors of the normal modes
    bins (List[float]): grid of frequencies for grouping normal modes.
        Default is ``[2600]``.

Returns:
    tuple: A tuple containing the following:
     - TensorLike[float] : localized frequencies in reciprocal centimetre (:math:`\text{cm}^{-1}`).
     - List[TensorLike[float]] : localized displacement vectors
     - TensorLike[float] : localization matrix describing the relationship between the
       original and the localized modes

**Example**

>>> freqs = np.array([1326.66001461, 2297.26736859, 2299.65032901])
>>> vectors = np.array([[[ 5.71518696e-18, -4.55642350e-01,  5.20920552e-01],
...                      [ 1.13167924e-17,  4.55642350e-01,  5.20920552e-01],
...                      [-1.23163569e-17,  5.09494945e-12, -3.27565762e-02]],
...                     [[-4.53008817e-17,  4.90364125e-01,  4.90363894e-01],
...                      [-1.98591028e-16,  4.90361513e-01, -4.90361744e-01],
...                      [-2.78235498e-18, -3.08350419e-02, -6.75886679e-08]],
...                     [[ 5.75393451e-17,  5.37047963e-01,  4.41957355e-01],
...                      [ 6.53049347e-17, -5.37050348e-01,  4.41959740e-01],
...                      [-5.49709883e-17,  7.49851221e-08, -2.77912798e-02]]])
>>> freqs_loc, vecs_loc, uloc = qp.qchem.localize_normal_modes(freqs, vectors)
>>> freqs_loc
array([1332.62013257, 2296.73453455, 2296.73460655])
