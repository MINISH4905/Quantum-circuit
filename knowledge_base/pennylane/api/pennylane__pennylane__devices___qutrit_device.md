---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/_qutrit_device.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/_qutrit_device.py
license: Apache-2.0
---

## Module `pennylane/devices/_qutrit_device.py`

This module contains the :class:`QutritDevice` abstract base class.

## `QutritDevice`

```python
class QutritDevice(QubitDevice)
```

Abstract base class for PennyLane qutrit devices.

The following abstract method **must** be defined:

* :meth:`~.apply`: append circuit operations, compile the circuit (if applicable),
  and perform the quantum computation.

Devices that generate their own samples (such as hardware) may optionally
overwrite :meth:`~.probability`. This method otherwise automatically
computes the probabilities from the generated samples, and **must**
overwrite the following method:

* :meth:`~.generate_samples`: Generate samples from the device from the
  exact or approximate probability distribution.

Analytic devices **must** overwrite the following method:

* :meth:`~.analytic_probability`: returns the probability or marginal probability from the
  device after circuit execution. :meth:`~.marginal_prob` may be used here.

This device contains common utility methods for qutrit-based devices. These
do not need to be overwritten. Utility methods include:

* :meth:`~.expval`, :meth:`~.var`, :meth:`~.sample`: return expectation values,
  variances, and samples of observables after the circuit has been rotated
  into the observable eigenbasis.

Args:
    wires (int, Iterable[Number, str]]): Number of subsystems represented by the device,
        or iterable that contains unique labels for the subsystems as numbers (i.e., ``[-1, 0, 2]``)
        or strings (``['auxiliary', 'q1', 'q2']``). Default 1 if not specified.
    shots (None, int, list[int]): Number of circuit evaluations/random samples used to estimate
        expectation values of observables. If ``None``, the device calculates probability, expectation values,
        and variances analytically. If an integer, it specifies the number of samples to estimate these quantities.
        If a list of integers is passed, the circuit evaluations are batched over the list of shots.
    r_dtype: Real floating point precision type.
    c_dtype: Complex floating point precision type.

### `generate_samples`

```python
def generate_samples(self)
```

Returns the computational basis samples generated for all wires.

Note that PennyLane uses the convention :math:`|q_0,q_1,\dots,q_{N-1}\rangle` where
:math:`q_0` is the most significant trit.

.. warning::

    This method should be overwritten on devices that
    generate their own computational basis samples, with the resulting
    computational basis samples stored as ``self._samples``.

Returns:
     array[complex]: array of samples in the shape ``(dev.shots, dev.num_wires)``

### `generate_basis_states`

```python
def generate_basis_states(self, num_wires, dtype=np.uint32)
```

Generates basis states in ternary representation according to the number
of wires specified.

Args:
    num_wires (int): the number of wires
    dtype=np.uint32 (type): the data type of the arrays to use

Returns:
    array[int]: the sampled basis states

### `states_to_ternary`

```python
def states_to_ternary(samples, num_wires, dtype=np.int64)
```

Convert basis states from base 10 to ternary representation.

This is an auxiliary method to the generate_samples method.

Args:
    samples (array[int]): samples of basis states in base 10 representation
    num_wires (int): the number of qutrits
    dtype (type): Type of the internal integer array to be used. Can be
        important to specify for large systems for memory allocation
        purposes.

Returns:
    array[int]: basis states in ternary representation

### `density_matrix`

```python
def density_matrix(self, wires)
```

Returns the reduced density matrix prior to measurement.

Args:
    wires (Wires): wires of the reduced system

Raises:
    QuantumFunctionError: density matrix is currently unsupported on :class:`~.QutritDevice`

### `vn_entropy`

```python
def vn_entropy(self, wires, log_base)
```

Returns the Von Neumann entropy prior to measurement.

.. math::
    S( \rho ) = -\text{Tr}( \rho \log ( \rho ))

Args:
    wires (Wires): Wires of the considered subsystem.
    log_base (float): Base for the logarithm, default is None the natural logarithm is used in this case.

Raises:
    QuantumFunctionError: Von Neumann entropy is currently unsupported on :class:`~.QutritDevice`

### `mutual_info`

```python
def mutual_info(self, wires0, wires1, log_base)
```

Returns the mutual information prior to measurement:

.. math::

    I(A, B) = S(\rho^A) + S(\rho^B) - S(\rho^{AB})

where :math:`S` is the von Neumann entropy.

Args:
    wires0 (Wires): wires of the first subsystem
    wires1 (Wires): wires of the second subsystem
    log_base (float): base to use in the logarithm

Raises:
    QuantumFunctionError: Mutual information is currently unsupported on :class:`~.QutritDevice`

### `classical_shadow`

```python
def classical_shadow(self, obs, circuit)
```

Returns the measured trits and recipes in the classical shadow protocol.

Please refer to :func:`~.pennylane.measurements.classical_shadow` for detailed documentation.

.. seealso:: :func:`~pennylane.measurements.classical_shadow`

Args:
    obs (~.pennylane.measurements.ClassicalShadowMP): The classical shadow measurement process
    circuit (~.tapes.QuantumTape): The quantum tape that is being executed

Raises:
    QuantumFunctionError: Classical shadow is currently unsupported on :class:`~.QutritDevice`

### `shadow_expval`

```python
def shadow_expval(self, obs, circuit)
```

Compute expectation values using classical shadows in a differentiable manner.

Please refer to :func:`~pennylane.shadow_expval` for detailed documentation.

.. seealso:: :func:`~pennylane.shadow_expval`

Args:
    obs (~.pennylane.measurements.ShadowExpvalMP): The classical shadow expectation
        value measurement process
    circuit (~.tapes.QuantumTape): The quantum tape that is being executed

Raises:
    QuantumFunctionError: Shadow Expectation values are currently unsupported on :class:`~.QutritDevice`

### `estimate_probability`

```python
def estimate_probability(self, wires=None, shot_range=None, bin_size=None)
```

Return the estimated probability of each computational basis state
using the generated samples.

Args:
    wires (Iterable[Number, str], Number, str, Wires): wires to calculate
        marginal probabilities for. Wires not provided are traced out of the system.
    shot_range (tuple[int]): 2-tuple of integers specifying the range of samples
        to use. If not specified, all samples are used.
    bin_size (int): Divides the shot range into bins of size ``bin_size``, and
        returns the measurement statistic separately over each bin. If not
        provided, the entire shot range is treated as a single bin.

Returns:
    array[float]: list of the probabilities

### `marginal_prob`

```python
def marginal_prob(self, prob, wires=None)
```

Return the marginal probability of the computational basis
states by summing the probabiliites on the non-specified wires.

If no wires are specified, then all the basis states representable by
the device are considered and no marginalization takes place.

.. note::

    If the provided wires are not in the order as they appear on the device,
    the returned marginal probabilities take this permutation into account.

    For example, if the addressable wires on this device are ``Wires([0, 1, 2])`` and
    this function gets passed ``wires=[2, 0]``, then the returned marginal
    probability vector will take this 'reversal' of the two wires
    into account:

    .. math::

        \mathbb{P}^{(2, 0)}
                    = \left[
                       |00\rangle, |10\rangle, |20\rangle, |01\rangle, |11\rangle,
                       |21\rangle, |02\rangle, |12\rangle, |22\rangle
                      \right]

Args:
    prob: The probabilities to return the marginal probabilities
        for
    wires (Iterable[Number, str], Number, str, Wires): wires to return
        marginal probabilities for. Wires not provided
        are traced out of the system.

Returns:
    array[float]: array of the resulting marginal probabilities.
