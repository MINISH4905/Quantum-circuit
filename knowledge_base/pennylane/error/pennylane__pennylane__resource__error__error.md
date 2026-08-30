---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/resource/error/error.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/resource/error/error.py
license: Apache-2.0
---

## Module `pennylane/resource/error/error.py`

Stores classes and logic to define and track algorithmic error in a quantum workflow.

## `AlgorithmicError`

```python
class AlgorithmicError(ABC)
```

Abstract base class representing an abstract type of error.
This class can be used to create objects that track and propagate errors introduced by approximations and other algorithmic inaccuracies.

Args:
    error (float): The numerical value of the error

.. note::
    Child classes must implement the :func:`~.AlgorithmicError.combine` method which combines two
    instances of this error type (as if the associated gates were applied in series).

### `combine`

```python
def combine(self, other)
```

A method to combine two errors of the same type.
(e.g., additive, square additive, multiplicative, etc.)

Args:
    other (AlgorithmicError): The other instance of error being combined.

Returns:
    AlgorithmicError: The total error after combination.

### `get_error`

```python
def get_error(approximate_op, exact_op)
```

A method to allow users to compute this type of error between two operators.

Args:
    approximate_op (.Operator): The approximate operator.
    exact_op (.Operator): The exact operator.

Returns:
    float: The error between the exact operator and its
    approximation.

## `ErrorOperation`

```python
class ErrorOperation(Operation)
```

Base class that represents quantum operations which carry some form of algorithmic error.

.. note::
    Child classes must implement the :func:`~.ErrorOperation.error` method which computes
    the error of the operation.

### `error`

```python
def error(self, *args, **kwargs) -> AlgorithmicError
```

Computes the error of the operation.

Returns:
    AlgorithmicError: The error.

## `SpectralNormError`

```python
class SpectralNormError(AlgorithmicError)
```

Class representing the spectral norm error.

The spectral norm error is defined as the distance, in spectral norm, between the true unitary
we intend to apply and the approximate unitary that is actually applied.

Args:
    error (float): The numerical value of the error

**Example**

>>> s1 = SpectralNormError(0.01)
>>> s2 = SpectralNormError(0.02)
>>> s1.combine(s2)
SpectralNormError(0.03)

### `__repr__`

```python
def __repr__(self)
```

Return formal string representation.

### `combine`

```python
def combine(self, other: 'SpectralNormError')
```

Combine two spectral norm errors.

Args:
    other (SpectralNormError): The other instance of error being combined.

Returns:
    SpectralNormError: The total error after combination.

**Example**

>>> s1 = SpectralNormError(0.01)
>>> s2 = SpectralNormError(0.02)
>>> s1.combine(s2)
SpectralNormError(0.03)

### `get_error`

```python
def get_error(approximate_op: Operator, exact_op: Operator)
```

Compute spectral norm error between two operators.

Args:
    approximate_op (Operator): The approximate operator.
    exact_op (Operator): The exact operator.

Returns:
    float: The error between the exact operator and its
    approximation.

**Example**

>>> Op1 = qp.RY(0.40, 0)
>>> Op2 = qp.RY(0.41, 0)
>>> SpectralNormError.get_error(Op1, Op2)
np.float64(0.004999994791668287)

## `algo_error`

```python
def algo_error(qnode, level: str | int | slice='gradient') -> Callable[..., dict[str, 'AlgorithmicError'] | list[dict[str, 'AlgorithmicError']]]
```

Computes the algorithmic errors in a quantum circuit.

This transform converts a QNode into a callable that returns algorithmic
error information after applying the specified amount of transforms/expansions.

Args:
    qnode (.QNode): the QNode to calculate the algorithmic errors for.

    level (str | int | slice | iter[int]): An indication of which transforms to apply before computing the errors.
        See :func:`~pennylane.workflow.get_compile_pipeline` for more information about allowable levels.

Returns:
    A function that has the same argument signature as ``qnode``. When called,
    this function returns either:

    - A single dictionary with error type names as keys (e.g., ``"SpectralNormError"``)
      and :class:`~.resource.AlgorithmicError` objects as values, when there is only
      one tape in the batch.
    - A list of such dictionaries, one for each tape in the batch, when there are
      multiple tapes.

**Example**

Consider a circuit with operations that introduce algorithmic errors, such as
:class:`~.TrotterProduct`:

.. code-block:: python

    import pennylane as qp

    dev = qp.device("null.qubit", wires=2)
    Hamiltonian = qp.dot([1.0, 0.5], [qp.X(0), qp.Y(0)])

    @qp.qnode(dev)
    def circuit(time):
        qp.TrotterProduct(Hamiltonian, time=time, n=4, order=2)
        qp.TrotterProduct(Hamiltonian, time=time, n=4, order=4)
        return qp.state()

We can compute the errors using ``algo_error``:

>>> errors = qp.resource.algo_error(circuit)(time=1.0)
>>> print(errors)
{'SpectralNormError': SpectralNormError(...)}

The error values can be accessed from the returned dictionary:

>>> errors["SpectralNormError"].error
np.float64(0.4299...)

.. note::

    This function is the standard way to retrieve algorithm-specific error metrics
    from quantum circuits that use :class:`~.resource.ErrorOperation` subclasses.
    Operations like :class:`~.TrotterProduct` and :class:`~.QuantumPhaseEstimation`
    implement the ``error()`` method and will contribute to the returned error dictionary.

.. seealso::
    :class:`~.resource.AlgorithmicError`, :class:`~.resource.SpectralNormError`,
    :class:`~.resource.ErrorOperation`, :class:`~.TrotterProduct`
