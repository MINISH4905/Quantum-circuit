---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/measurement.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/measurement.py
license: Apache-2.0
---

## Module `pennylane/estimator/measurement.py`

This module contains the functions needed for estimating the number of measurements and the error
for computing expectation values.

## `estimate_shots`

```python
def estimate_shots(coeffs, variances=None, error=0.0016)
```

Estimate the number of measurements required to compute an expectation value with a target
error.

.. seealso::
    :func:`estimate_error`

Args:
    coeffs (list[tensor_like]): list of coefficient groups
    variances (list[float]): variances of the Pauli word groups
    error (float): target error in computing the expectation value

Returns:
    int: the number of measurements

**Example**

>>> coeffs = [np.array([-0.32707061, 0.7896887]), np.array([0.18121046])]
>>> qp.estimator.estimate_shots(coeffs)
419218

.. details::
    :title: Theory

    An estimation for the number of measurements :math:`M` required to predict the expectation
    value of an observable :math:`H = \sum_i A_i`, with :math:`A = \sum_j c_j O_j` representing
    a linear combination of Pauli words, can be obtained following Eq. (34) of
    [`PRX Quantum 2, 040320 (2021) <https://journals.aps.org/prxquantum/abstract/10.1103/PRXQuantum.2.040320>`_]
    as

    .. math::

        M = \frac{\left ( \sum_i \sqrt{\text{Var}(A_i)} \right )^2}{\epsilon^2},

    with :math:`\epsilon` and :math:`\text{Var}(A)` denoting the target error in computing
    :math:`\left \langle H \right \rangle` and the variance in computing
    :math:`\left \langle A \right \rangle`, respectively. It has been shown in Eq. (10) of
    [`arXiv:2201.01471v3 <https://arxiv.org/abs/2201.01471v3>`_] that
    the variances can be computed from the covariances between the Pauli words as

    .. math::

        \text{Var}(A_i) = \sum_{jk} c_j c_k \text{Cov}(O_j, O_k),

    where

    .. math::

        \text{Cov}(O_j, O_k) = \left \langle O_j O_k \right \rangle - \left \langle O_j \right \rangle \left \langle O_k \right \rangle.

    The values of :math:`\text{Cov}(O_j, O_k)` are not known a priori and should be either
    computed from affordable classical methods, such as the configuration interaction with
    singles and doubles (CISD), or approximated with other methods. If the variances are not
    provided to the function as input, they will be approximated following Eqs. (6-7) of
    [`Phys. Rev. Research 4, 033154, 2022 <https://journals.aps.org/prresearch/abstract/10.1103/PhysRevResearch.4.033154>`_]
    by assuming
    :math:`\text{Cov}(O_j, O_k) =0` for :math:`j \neq k` and using :math:`\text{Var}(O_i) \leq 1`
    from

    .. math::

        \text{Var}(O_i) = \left \langle O_i^2 \right \rangle - \left \langle O_i \right \rangle^2 = 1 - \left \langle O_i \right \rangle^2.

    This approximation gives

    .. math::

        M \approx \frac{\left ( \sum_i \sqrt{\sum_j c_{ij}^2} \right )^2}{\epsilon^2},

    where :math:`i` and :math:`j` run over the observable groups and the Pauli words inside the
    group, respectively.

## `estimate_error`

```python
def estimate_error(coeffs, variances=None, shots=1000)
```

Estimate the error in computing an expectation value with a given number of measurements.

.. seealso::
    :func:`estimate_shots`

Args:
    coeffs (list[tensor_like]): list of coefficient groups
    variances (list[float]): variances of the Pauli word groups
    shots (int): the number of measurements

Returns:
    float: target error in computing the expectation value

**Example**

>>> coeffs = [np.array([-0.32707061, 0.7896887]), np.array([0.18121046])]
>>> qp.estimator.estimate_error(coeffs, shots=100000)
np.float64(0.0032759684708248507)

.. details::
    :title: Theory

    An estimation for the error :math:`\epsilon` in predicting the expectation
    value of an observable :math:`H = \sum_i A_i` with :math:`A = \sum_j c_j O_j` representing a
    linear combination of Pauli words can be obtained following Eq. (34) of
    [`PRX Quantum 2, 040320 (2021) <https://journals.aps.org/prxquantum/abstract/10.1103/PRXQuantum.2.040320>`_]
    as

    .. math::

        \epsilon = \frac{\sum_i \sqrt{\text{Var}(A_i)}}{\sqrt{M}},

    with :math:`M` and :math:`\text{Var}(A)` denoting the number of measurements and the
    variance in computing :math:`\left \langle A \right \rangle`, respectively. It has been
    shown in Eq. (10) of
    [`arXiv:2201.01471v3 <https://arxiv.org/abs/2201.01471v3>`_] that the variances can be
    computed from the covariances between the Pauli words as

    .. math::

        \text{Var}(A_i) = \sum_{jk} c_j c_k \text{Cov}(O_j, O_k),

    where

    .. math::

        \text{Cov}(O_j, O_k) = \left \langle O_j O_k \right \rangle - \left \langle O_j \right \rangle \left \langle O_k \right \rangle.

    The values of :math:`\text{Cov}(O_j, O_k)` are not known a priori and should be either
    computed from affordable classical methods, such as the configuration interaction with
    singles and doubles (CISD), or approximated with other methods. If the variances are not
    provided to the function as input, they will be approximated following Eqs. (6-7) of
    [`Phys. Rev. Research 4, 033154, 2022 <https://journals.aps.org/prresearch/abstract/10.1103/PhysRevResearch.4.033154>`_]
    by assuming
    :math:`\text{Cov}(O_j, O_k) =0` for :math:`j \neq k` and using :math:`\text{Var}(O_i) \leq 1`
    from

    .. math::

        \text{Var}(O_i) = \left \langle O_i^2 \right \rangle - \left \langle O_i \right \rangle^2 = 1 - \left \langle O_i \right \rangle^2.

    This approximation gives

    .. math::

        \epsilon \approx \frac{\sum_i \sqrt{\sum_j c_{ij}^2}}{\sqrt{M}},

    where :math:`i` and :math:`j` run over the observable groups and the Pauli words inside the
    group, respectively.
