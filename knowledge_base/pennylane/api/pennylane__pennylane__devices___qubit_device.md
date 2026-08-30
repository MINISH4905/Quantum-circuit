---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/_qubit_device.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/_qubit_device.py
license: Apache-2.0
---

## Module `pennylane/devices/_qubit_device.py`

This module contains the :class:`QubitDevice` abstract base class.

## `QubitDevice`

```python
class QubitDevice(Device)
```

Abstract base class for PennyLane qubit devices.

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

This device contains common utility methods for qubit-based devices. These
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

### `reset`

```python
def reset(self)
```

Reset the backend state.

After the reset, the backend should be as if it was just constructed.
Most importantly the quantum state is reset to its initial value.

### `execute`

```python
def execute(self, circuit, **kwargs)
```

It executes a queue of quantum operations on the device and then measure the given observables.

For plugin developers: instead of overwriting this, consider
implementing a suitable subset of

* :meth:`apply`

* :meth:`~.generate_samples`

* :meth:`~.probability`

Additional keyword arguments may be passed to this method
that can be utilised by :meth:`apply`. An example would be passing
the ``QNode`` hash that can be used later for parametric compilation.

Args:
    circuit (~.tape.QuantumTape): circuit to execute on the device

Raises:
    QuantumFunctionError: if the observable is not supported

Returns:
    array[float]: measured value(s)

### `shot_vec_statistics`

```python
def shot_vec_statistics(self, circuit: QuantumScript)
```

Process measurement results from circuit execution using a device
with a shot vector and return statistics.

This is an auxiliary method of execute and uses statistics.

When using shot vectors, measurement results for each item of the shot
vector are contained in a tuple.

Args:
    circuit (~.tape.QuantumTape): circuit to execute on the device

Raises:
    QuantumFunctionError: if the observable is not supported

Returns:
    tuple: statistics for each shot item from the shot vector

### `batch_execute`

```python
def batch_execute(self, circuits, **kwargs)
```

Execute a batch of quantum circuits on the device.

The circuits are represented by tapes, and they are executed one-by-one using the
device's ``execute`` method. The results are collected in a list.

For plugin developers: This function should be overwritten if the device can efficiently run multiple
circuits on a backend, for example using parallel and/or asynchronous executions.

Args:
    circuits (list[~.tape.QuantumTape]): circuits to execute on the device

Returns:
    list[array[float]]: list of measured value(s)

### `apply`

```python
def apply(self, operations, **kwargs)
```

Apply quantum operations, rotate the circuit into the measurement
basis, and compile and execute the quantum circuit.

This method receives a list of quantum operations queued by the QNode,
and should be responsible for:

* Constructing the quantum program
* (Optional) Rotating the quantum circuit using the rotation
  operations provided. This diagonalizes the circuit so that arbitrary
  observables can be measured in the computational basis.
* Compile the circuit
* Execute the quantum circuit

Both arguments are provided as lists of PennyLane :class:`~.Operation`
instances. Useful properties include :attr:`~.Operation.name`,
:attr:`~.Operation.wires`, and :attr:`~.Operation.parameters`:

>>> op = qp.RX(0.2, wires=[0])
>>> op.name # returns the operation name
'RX'
>>> op.wires # returns a Wires object representing the wires that the operation acts on
Wires([0])
>>> op.parameters # returns a list of parameters
[0.2]

Args:
    operations (list[~.Operation]): operations to apply to the device

Keyword args:
    rotations (list[~.Operation]): operations that rotate the circuit
        pre-measurement into the eigenbasis of the observables.
    hash (int): the hash value of the circuit constructed by `CircuitGraph.hash`

### `active_wires`

```python
def active_wires(operators)
```

Returns the wires acted on by a set of operators.

Args:
    operators (list[~.Operation]): operators for which
        we are gathering the active wires

Returns:
    Wires: wires activated by the specified operators

### `statistics`

```python
def statistics(self, circuit: QuantumScript, shot_range=None, bin_size=None)
```

Process measurement results from circuit execution and return statistics.

This includes returning expectation values, variance, samples, probabilities, states, and
density matrices.

Args:
    circuit (~.tape.QuantumTape): the quantum tape currently being executed
    shot_range (tuple[int]): 2-tuple of integers specifying the range of samples
        to use. If not specified, all samples are used.
    bin_size (int): Divides the shot range into bins of size ``bin_size``, and
        returns the measurement statistic separately over each bin. If not
        provided, the entire shot range is treated as a single bin.

Raises:
    QuantumFunctionError: if a measurement is not supported

Returns:
    Union[float, List[float]]: the corresponding statistics

.. details::
    :title: Usage Details

    The ``shot_range`` and ``bin_size`` arguments allow for the statistics
    to be performed on only a subset of device samples. This finer level
    of control is accessible from the main UI by instantiating a device
    with a batch of shots.

    For example, consider the following device:

    >>> dev = qp.device("my_device", shots=[5, (10, 3), 100])

    This device will execute QNodes using 135 shots, however
    measurement statistics will be **course grained** across these 135
    shots:

    * All measurement statistics will first be computed using the
      first 5 shots --- that is, ``shots_range=[0, 5]``, ``bin_size=5``.

    * Next, the tuple ``(10, 3)`` indicates 10 shots, repeated 3 times. We will want to use
      ``shot_range=[5, 35]``, performing the expectation value in bins of size 10
      (``bin_size=10``).

    * Finally, we repeat the measurement statistics for the final 100 shots,
      ``shot_range=[35, 135]``, ``bin_size=100``.

### `access_state`

```python
def access_state(self, wires=None)
```

Check that the device has access to an internal state and return it if available.

Args:
    wires (Wires): wires of the reduced system

Raises:
    QuantumFunctionError: if the device is not capable of returning the state

Returns:
    array or tensor: the state or the density matrix of the device

### `generate_samples`

```python
def generate_samples(self)
```

Returns the computational basis samples generated for all wires.

Note that PennyLane uses the convention :math:`|q_0,q_1,\dots,q_{N-1}\rangle` where
:math:`q_0` is the most significant bit.

.. warning::

    This method should be overwritten on devices that
    generate their own computational basis samples, with the resulting
    computational basis samples stored as ``self._samples``.

Returns:
     array[complex]: array of samples in the shape ``(dev.shots, dev.num_wires)``

### `sample_basis_states`

```python
def sample_basis_states(self, number_of_states, state_probability)
```

Sample from the computational basis states based on the state
probability.

This is an auxiliary method to the generate_samples method.

Args:
    number_of_states (int): the number of basis states to sample from
    state_probability (array[float]): the computational basis probability vector

Returns:
    array[int]: the sampled basis states

### `generate_basis_states`

```python
def generate_basis_states(num_wires, dtype=np.uint32)
```

Generates basis states in binary representation according to the number
of wires specified.

The states_to_binary method creates basis states faster (for larger
systems at times over x25 times faster) than the approach using
``itertools.product``, at the expense of using slightly more memory.

Due to the large size of the integer arrays for more than 32 bits,
memory allocation errors may arise in the states_to_binary method.
Hence we constraint the dtype of the array to represent unsigned
integers on 32 bits. Due to this constraint, an overflow occurs for 32
or more wires, therefore this approach is used only for fewer wires.

For smaller number of wires speed is comparable to the next approach
(using ``itertools.product``), hence we resort to that one for testing
purposes.

Args:
    num_wires (int): the number wires
    dtype=np.uint32 (type): the data type of the arrays to use

Returns:
    array[int]: the sampled basis states

### `states_to_binary`

```python
def states_to_binary(samples, num_wires, dtype=np.int64)
```

Convert basis states from base 10 to binary representation.

This is an auxiliary method to the generate_samples method.

Args:
    samples (array[int]): samples of basis states in base 10 representation
    num_wires (int): the number of qubits
    dtype (type): Type of the internal integer array to be used. Can be
        important to specify for large systems for memory allocation
        purposes.

Returns:
    array[int]: basis states in binary representation

### `circuit_hash`

```python
def circuit_hash(self)
```

The hash of the circuit upon the last execution.

This can be used by devices in :meth:`~.apply` for parametric compilation.

### `state`

```python
def state(self)
```

Returns the state vector of the circuit prior to measurement.

.. note::

    Only state vector simulators support this property. Please see the
    plugin documentation for more details.

### `density_matrix`

```python
def density_matrix(self, wires)
```

Returns the reduced density matrix over the given wires.

Args:
    wires (Wires): wires of the reduced system

Returns:
    array[complex]: complex array of shape ``(2 ** len(wires), 2 ** len(wires))``
    representing the reduced density matrix of the state prior to measurement.

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

Returns:
    float: returns the Von Neumann entropy

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

Returns:
    float: the mutual information

### `classical_shadow`

```python
def classical_shadow(self, obs, circuit)
```

Returns the measured bits and recipes in the classical shadow protocol.

The protocol is described in detail in the `classical shadows paper <https://arxiv.org/abs/2002.08953>`_.
This measurement process returns the randomized Pauli measurements (the ``recipes``)
that are performed for each qubit and snapshot as an integer:

- 0 for Pauli X,
- 1 for Pauli Y, and
- 2 for Pauli Z.

It also returns the measurement results (the ``bits``); 0 if the 1 eigenvalue
is sampled, and 1 if the -1 eigenvalue is sampled.

The device shots are used to specify the number of snapshots. If ``T`` is the number
of shots and ``n`` is the number of qubits, then both the measured bits and the
Pauli measurements have shape ``(T, n)``.

This implementation is device-agnostic and works by executing single-shot
tapes containing randomized Pauli observables. Devices should override this
if they can offer cleaner or faster implementations.

.. seealso:: :func:`~.pennylane.classical_shadow`

Args:
    obs (~.pennylane.measurements.ClassicalShadowMP): The classical shadow measurement process
    circuit (~.tape.QuantumTape): The quantum tape that is being executed

Returns:
    tensor_like[int]: A tensor with shape ``(2, T, n)``, where the first row represents
    the measured bits and the second represents the recipes used.

### `shadow_expval`

```python
def shadow_expval(self, obs, circuit)
```

Compute expectation values using classical shadows in a differentiable manner.

Please refer to :func:`~pennylane.shadow_expval` for detailed documentation.

Args:
    obs (~.pennylane.measurements.ClassicalShadowMP): The classical shadow expectation
        value measurement process
    circuit (~.tape.QuantumTape): The quantum tape that is being executed

Returns:
    float: expectation value estimate.

### `analytic_probability`

```python
def analytic_probability(self, wires=None)
```

Return the (marginal) probability of each computational basis
state from the last run of the device.

PennyLane uses the convention
:math:`|q_0,q_1,\dots,q_{N-1}\rangle` where :math:`q_0` is the most
significant bit.

If no wires are specified, then all the basis states representable by
the device are considered and no marginalization takes place.


.. note::

    :meth:`~.marginal_prob` may be used as a utility method
    to calculate the marginal probability distribution.

Args:
    wires (Iterable[Number, str], Number, str, Wires): wires to return
        marginal probabilities for. Wires not provided are traced out of the system.

Returns:
    array[float]: list of the probabilities

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

### `probability`

```python
def probability(self, wires=None, shot_range=None, bin_size=None)
```

Return either the analytic probability or estimated probability of
each computational basis state.

Devices that require a finite number of shots always return the
estimated probability.

Args:
    wires (Iterable[Number, str], Number, str, Wires): wires to return
        marginal probabilities for. Wires not provided are traced out of the system.

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
                       |00\rangle, |10\rangle, |01\rangle, |11\rangle
                      \right]

Args:
    prob: The probabilities to return the marginal probabilities
        for
    wires (Iterable[Number, str], Number, str, Wires): wires to return
        marginal probabilities for. Wires not provided
        are traced out of the system.

Returns:
    array[float]: array of the resulting marginal probabilities.

### `sample`

```python
def sample(self, observable, shot_range=None, bin_size=None, counts=False)
```

Return samples of an observable.

Args:
    observable (Operator): the observable to sample
    shot_range (tuple[int]): 2-tuple of integers specifying the range of samples
        to use. If not specified, all samples are used.
    bin_size (int): Divides the shot range into bins of size ``bin_size``, and
        returns the measurement statistic separately over each bin. If not
        provided, the entire shot range is treated as a single bin.
    counts (bool): whether counts (``True``) or raw samples (``False``)
        should be returned

Raises:
    EigvalsUndefinedError: if no information is available about the
        eigenvalues of the observable

Returns:
    Union[array[float], dict, list[dict]]: samples in an array of
    dimension ``(shots,)`` or counts

### `adjoint_jacobian`

```python
def adjoint_jacobian(self, tape: QuantumScript, starting_state=None, use_device_state=False)
```

Implements the adjoint method outlined in
`Jones and Gacon <https://arxiv.org/abs/2009.02823>`__ to differentiate an input tape.

After a forward pass, the circuit is reversed by iteratively applying adjoint
gates to scan backwards through the circuit.

.. note::
    The adjoint differentiation method has the following restrictions:

    * As it requires knowledge of the statevector, only statevector simulator devices can be
      used.

    * Only expectation values are supported as measurements.

    * Cannot differentiate with respect to state-prep operations.

    * Does not work for parametrized observables like
      :class:`~.ops.LinearCombination` or :class:`~.Hermitian`.

Args:
    tape (.QuantumTape): circuit that the function takes the gradient of

Keyword Args:
    starting_state (tensor_like): post-forward pass state to start execution with. It should be
        complex-valued. Takes precedence over ``use_device_state``.
    use_device_state (bool): use current device state to initialize. A forward pass of the same
        circuit should be the last thing the device has executed. If a ``starting_state`` is
        provided, that takes precedence.

Returns:
    array or tuple[array]: the derivative of the tape with respect to trainable parameters.
    Dimensions are ``(len(observables), len(trainable_params))``.

Raises:
    QuantumFunctionError: if the input tape has measurements that are not expectation values
        or contains a multi-parameter operation aside from :class:`~.Rot`
