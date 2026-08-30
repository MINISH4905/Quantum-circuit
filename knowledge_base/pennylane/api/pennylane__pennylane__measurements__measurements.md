---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/measurements/measurements.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/measurements/measurements.py
license: Apache-2.0
---

## Module `pennylane/measurements/measurements.py`

This module contains the functions for computing different types of measurement
outcomes from quantum observables - expectation values, variances of expectations,
and measurement samples using AnnotatedQueues.

## `MeasurementProcess`

```python
class MeasurementProcess(ABC, metaclass=ABCCaptureMeta)
```

Represents a measurement process occurring at the end of a
quantum variational circuit.

.. warning::

    The ``id`` keyword argument is deprecated and will be removed in v0.46.

Args:
    obs (Union[.Operator, .MeasurementValue, Sequence[.MeasurementValue]]): The observable that
        is to be measured as part of the measurement process. Not all measurement processes
        require observables (for example ``Probability``); this argument is optional.
    wires (.Wires): The wires the measurement process applies to.
        This can only be specified if an observable was not provided.
    eigvals (array): A flat array representing the eigenvalues of the measurement.
        This can only be specified if an observable was not provided.
    id (str): **Deprecated** custom label given to a measurement instance, can be useful for some applications
        where the instance has to be identified

### `numeric_type`

```python
def numeric_type(self) -> type
```

The Python numeric type of the measurement result.

Returns:
    type: The output numeric type; ``int``, ``float`` or ``complex``.

Raises:
    QuantumFunctionError: the return type of the measurement process is
        unrecognized and cannot deduce the numeric type

### `shape`

```python
def shape(self, shots: int | None=None, num_device_wires: int=0) -> tuple[int, ...]
```

Calculate the shape of the result object tensor.

Args:
    shots (Optional[int]) = None: the number of shots used execute the circuit. ``None``
       indicates an analytic simulation.  Shot vectors are handled by calling this method
       multiple times.
    num_device_wires (int)=0 : The number of wires that will be used if the measurement is
       broadcasted across all available wires (``len(mp.wires) == 0``). If the device
       itself doesn't provide a number of wires, the number of tape wires will be provided
       here instead:

Returns:
    tuple[int,...]: An arbitrary length tuple of ints.  May be an empty tuple.

>>> qp.probs(wires=(0,1)).shape()
(4,)
>>> qp.sample(wires=(0,1)).shape(shots=50)
(50, 2)
>>> qp.state().shape(num_device_wires=4)
(16,)
>>> qp.expval(qp.Z(0)).shape()
()

### `diagonalizing_gates`

```python
def diagonalizing_gates(self)
```

Returns the gates that diagonalize the measured wires such that they
are in the eigenbasis of the circuit observables.

Returns:
    List[.Operation]: the operations that diagonalize the observables

### `__repr__`

```python
def __repr__(self)
```

Representation of this class.

### `wires`

```python
def wires(self)
```

The wires the measurement process acts on.

This is the union of all the Wires objects of the measurement.

### `raw_wires`

```python
def raw_wires(self)
```

The wires the measurement process acts on.

For measurements involving more than one set of wires (such as
mutual information), this is a list of the Wires objects. Otherwise,
this is the same as :func:`~.MeasurementProcess.wires`

### `eigvals`

```python
def eigvals(self)
```

Eigenvalues associated with the measurement process.

If the measurement process has an associated observable,
the eigenvalues will correspond to this observable. Otherwise,
they will be the eigenvalues provided when the measurement
process was instantiated.

Note that the eigenvalues are not guaranteed to be in any
particular order.

**Example:**

>>> m = MeasurementProcess(obs=qp.X(1))
>>> m.eigvals()
array([ 1., -1.])

Returns:
    array: eigvals representation

### `has_decomposition`

```python
def has_decomposition(self)
```

Bool: Whether or not the MeasurementProcess has diagonalizing gates.``.

### `samples_computational_basis`

```python
def samples_computational_basis(self)
```

Bool: Whether or not the MeasurementProcess measures in the computational basis.

### `queue`

```python
def queue(self, context=QueuingManager)
```

Append the measurement process to an annotated queue.

### `hash`

```python
def hash(self)
```

int: returns an integer hash uniquely representing the measurement process

### `simplify`

```python
def simplify(self)
```

Reduce the depth of the observable to the minimum.

Returns:
    .MeasurementProcess: A measurement process with a simplified observable.

### `map_wires`

```python
def map_wires(self, wire_map: dict)
```

Returns a copy of the current measurement process with its wires changed according to
the given wire map.

Args:
    wire_map (dict): dictionary containing the old wires as keys and the new wires as values

Returns:
    .MeasurementProcess: new measurement process

## `SampleMeasurement`

```python
class SampleMeasurement(MeasurementProcess)
```

Sample-based measurement process.

Any class inheriting from ``SampleMeasurement`` should define its own ``process_samples`` method,
which should have the following arguments:

* samples (Sequence[complex]): computational basis samples generated for all wires
* wire_order (Wires): wires determining the subspace that ``samples`` acts on
* shot_range (tuple[int]): 2-tuple of integers specifying the range of samples
    to use. If not specified, all samples are used.
* bin_size (int): Divides the shot range into bins of size ``bin_size``, and
    returns the measurement statistic separately over each bin. If not
    provided, the entire shot range is treated as a single bin.

**Example:**

Let's create a measurement that returns the sum of all samples of the given wires.

>>> class MyMeasurement(SampleMeasurement):
...     def process_samples(self, samples, wire_order, shot_range=None, bin_size=None):
...         return qp.math.sum(samples[..., self.wires])
...     def process_counts(self, counts, wire_order):
...         return qp.math.sum(counts[..., self.wires])

We can now execute it in a QNode:

>>> dev = qp.device("default.qubit", wires=2)
>>> @qp.set_shots(shots=1000)
... @qp.qnode(dev)
... def circuit():
...     qp.X(0)
...     return MyMeasurement(wires=[0]), MyMeasurement(wires=[1])
>>> circuit()
(np.int64(1000), np.int64(0))

### `process_samples`

```python
def process_samples(self, samples: TensorLike, wire_order: Wires, shot_range: None | tuple[int]=None, bin_size: None | int=None)
```

Process the given samples.

Args:
    samples (Sequence[complex]): computational basis samples generated for all wires
    wire_order (Wires): wires determining the subspace that ``samples`` acts on
    shot_range (tuple[int]): 2-tuple of integers specifying the range of samples
        to use. If not specified, all samples are used.
    bin_size (int): Divides the shot range into bins of size ``bin_size``, and
        returns the measurement statistic separately over each bin. If not
        provided, the entire shot range is treated as a single bin.

### `process_counts`

```python
def process_counts(self, counts: dict, wire_order: Wires)
```

Calculate the measurement given a counts histogram dictionary.

Args:
    counts (dict): a dictionary matching the format returned by :class:`~.CountsMP`
    wire_order (Wires): the wire order used in producing the counts

Note that the input dictionary may only contain states with non-zero entries (``all_outcomes=False``).

## `StateMeasurement`

```python
class StateMeasurement(MeasurementProcess)
```

State-based measurement process.

Any class inheriting from ``StateMeasurement`` should define its own ``process_state`` method,
which should have the following arguments:

* state (Sequence[complex]): quantum state with a flat shape. It may also have an
    optional batch dimension
* wire_order (Wires): wires determining the subspace that ``state`` acts on; a matrix of
    dimension :math:`2^n` acts on a subspace of :math:`n` wires

**Example:**

Let's create a measurement that returns the diagonal of the reduced density matrix.

>>> class MyMeasurement(StateMeasurement):
...     def process_state(self, state, wire_order):
...         # use the already defined `qp.density_matrix` measurement to compute the
...         # reduced density matrix from the given state
...         density_matrix = qp.density_matrix(wires=self.wires).process_state(state, wire_order)
...         return qp.math.diagonal(qp.math.real(density_matrix))

We can now execute it in a QNode:

>>> dev = qp.device("default.qubit", wires=2)
>>> @qp.qnode(dev)
... def circuit():
...     qp.Hadamard(0)
...     qp.CNOT([0, 1])
...     return MyMeasurement(wires=[0])
>>> circuit()
array([0.5, 0.5])

### `process_state`

```python
def process_state(self, state: TensorLike, wire_order: Wires)
```

Process the given quantum state.

Args:
    state (TensorLike): quantum state with a flat shape. It may also have an
        optional batch dimension
    wire_order (Wires): wires determining the subspace that ``state`` acts on; a matrix of
        dimension :math:`2^n` acts on a subspace of :math:`n` wires

### `process_density_matrix`

```python
def process_density_matrix(self, density_matrix: TensorLike, wire_order: Wires)
```

Process the given density matrix.

Args:
    density_matrix (TensorLike): The density matrix representing the (mixed) quantum state,
        which may be single or batched. For a single matrix, the shape should be ``(2^n, 2^n)``
        where `n` is the number of wires the matrix acts upon. For batched matrices, the shape
        should be ``(batch_size, 2^n, 2^n)``.
    wire_order (Wires): The wires determining the subspace that the ``density_matrix`` acts on.
        A matrix of dimension :math:`2^n` acts on a subspace of :math:`n` wires. This parameter specifies
        the mapping of matrix dimensions to physical qubits, allowing the function to correctly
        trace out the subsystems not involved in the measurement or operation.

## `MeasurementTransform`

```python
class MeasurementTransform(MeasurementProcess)
```

Measurement process that applies a transform into the given quantum tape. This transform
is carried out inside the gradient black box, thus is not tracked by the gradient transform.

Any class inheriting from ``MeasurementTransform`` should define its own ``process`` method,
which should have the following arguments:

* tape (QuantumTape): quantum tape to transform
* device (pennylane.devices.LegacyDevice): device used to transform the quantum tape

### `process`

```python
def process(self, tape, device)
```

Process the given quantum tape.

Args:
    tape (QuantumTape): quantum tape to transform
    device (pennylane.devices.LegacyDevice): device used to transform the quantum tape
