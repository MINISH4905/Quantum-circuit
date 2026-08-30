---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/measurements/counts.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/measurements/counts.py
license: Apache-2.0
---

## Module `pennylane/measurements/counts.py`

This module contains the qp.counts measurement.

## `CountsMP`

```python
class CountsMP(SampleMeasurement)
```

Measurement process that samples from the supplied observable and returns the number of
counts for each sample.

Please refer to :func:`pennylane.counts` for detailed documentation.

Args:
    obs (Union[.Operator, .MeasurementValue]): The observable that is to be measured
        as part of the measurement process. Not all measurement processes require observables
        (for example ``Probability``); this argument is optional.
    wires (.Wires): The wires the measurement process applies to.
        This can only be specified if an observable was not provided.
    eigvals (array): A flat array representing the eigenvalues of the measurement.
        This can only be specified if an observable was not provided.
    id (str): custom label given to a measurement instance, can be useful for some applications
        where the instance has to be identified
    all_outcomes(bool): determines whether the returned dict will contain only the observed
        outcomes (default), or whether it will display all possible outcomes for the system

### `hash`

```python
def hash(self)
```

int: returns an integer hash uniquely representing the measurement process

## `counts`

```python
def counts(op=None, wires=None, all_outcomes=False) -> CountsMP
```

Sample from the supplied observable, with the number of shots
determined from QNode,
returning the number of counts for each sample. If no observable is provided then basis state
samples are returned directly from the device.

Note that the output shape of this measurement process depends on the shots
specified on the device.

Args:
    op (Operator or MeasurementValue or None): a quantum observable object. To get counts
        for mid-circuit measurements, ``op`` should be a ``MeasurementValue``.
    wires (Sequence[int] or int or None): the wires we wish to sample from, ONLY set wires if
        op is None
    all_outcomes(bool): determines whether the returned dict will contain only the observed
        outcomes (default), or whether it will display all possible outcomes for the system

Returns:
    CountsMP: Measurement process instance

Raises:
    ValueError: Cannot set wires if an observable is provided

The samples are drawn from the eigenvalues :math:`\{\lambda_i\}` of the observable.
The probability of drawing eigenvalue :math:`\lambda_i` is given by
:math:`p(\lambda_i) = |\langle \xi_i | \psi \rangle|^2`, where :math:`| \xi_i \rangle`
is the corresponding basis state from the observable's eigenbasis.

.. note::

    Differentiation of QNodes that return ``counts`` is currently not supported. Please refer to
    :func:`~.pennylane.sample` if differentiability is required.

**Example**

.. code-block:: python

    dev = qp.device("default.qubit", seed=43, wires=2)

    @qp.set_shots(shots=4)
    @qp.qnode(dev)
    def circuit(x):
        qp.RX(x, wires=0)
        qp.Hadamard(wires=1)
        qp.CNOT(wires=[0, 1])
        return qp.counts(qp.Y(0))

Executing this QNode:

>>> print(circuit(0.5))
{np.float64(-1.0): np.int64(2), np.float64(1.0): np.int64(2)}

If no observable is provided, then the raw basis state samples obtained
from device are returned (e.g., for a qubit device, samples from the
computational device are returned). In this case, ``wires`` can be specified
so that sample results only include measurement results of the qubits of interest.

.. code-block:: python

    dev = qp.device("default.qubit", seed=42, wires=2)

    @qp.set_shots(shots=4)
    @qp.qnode(dev)
    def circuit(x):
        qp.RX(x, wires=0)
        qp.Hadamard(wires=1)
        qp.CNOT(wires=[0, 1])
        return qp.counts(all_outcomes=True)

Executing this QNode:

>>> circuit(0.5)
{'00': np.int64(1), '01': np.int64(3), '10': np.int64(0), '11': np.int64(0)}

By default, outcomes that were not observed will not be included in the dictionary.

.. code-block:: python

    dev = qp.device("default.qubit", seed=42, wires=2)

    @qp.set_shots(shots=4)
    @qp.qnode(dev)
    def circuit():
        qp.X(0)
        return qp.counts()

Executing this QNode shows only the observed outcomes:

>>> circuit()
{np.str_('10'): np.int64(4)}

Passing all_outcomes=True will create a dictionary that displays all possible outcomes:

.. code-block:: python

    @qp.set_shots(shots=4)
    @qp.qnode(dev)
    def circuit():
        qp.X(0)
        return qp.counts(all_outcomes=True)

Executing this QNode shows counts for all states:

>>> circuit()
{'00': np.int64(0), '01': np.int64(0), '10': np.int64(4), '11': np.int64(0)}
