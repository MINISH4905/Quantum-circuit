---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/measurements/sample.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/measurements/sample.py
license: Apache-2.0
---

## Module `pennylane/measurements/sample.py`

This module contains the qp.sample measurement.

## `SampleMP`

```python
class SampleMP(SampleMeasurement)
```

Measurement process that returns the samples of a given observable. If no observable is
provided then basis state samples are returned directly from the device.

Please refer to :func:`pennylane.sample` for detailed documentation.

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
    dtype (str or None): The dtype of the samples returned by this measurement process.

## `sample`

```python
def sample(op: Operator | MeasurementValue | Sequence[MeasurementValue] | None=None, wires: WiresLike=None, dtype=None) -> SampleMP
```

Sample from the supplied observable, with the number of shots
determined from QNode,
returning raw samples. If no observable is provided, then basis state samples are returned
directly from the device.

Note that the output shape of this measurement process depends on the shots
specified on the device.

Args:
    op (Operator or MeasurementValue): a quantum observable object. To get samples
        for mid-circuit measurements, ``op`` should be a ``MeasurementValue``.
    wires (Sequence[int] or int or None): the wires we wish to sample from; ONLY set wires if
        op is ``None``.
    dtype: The dtype of the samples returned by this measurement process.

Returns:
    SampleMP: Measurement process instance

Raises:
    ValueError: Cannot set wires if an observable is provided

.. warning::

    In v0.42, a breaking change removed the squeezing of singleton dimensions, eliminating the need for
    specialized, error-prone handling for finite-shot results.
    For the QNode:

    >>> @qp.qnode(qp.device('default.qubit'))
    ... def circuit(wires):
    ...     return qp.sample(wires=wires)

    The above circuit returns an array of shape ``(shots, num_wires)``.

    >>> qp.set_shots(circuit, 1)(wires=1)
    array([[0]])
    >>> qp.set_shots(circuit, 2)(0)
    array([[0],
    [0]])
    >>> qp.set_shots(circuit, 1)((0,1))
    array([[0, 0]])

The samples are drawn from the eigenvalues :math:`\{\lambda_i\}` of the observable.
The probability of drawing eigenvalue :math:`\lambda_i` is given by
:math:`p(\lambda_i) = |\langle \xi_i | \psi \rangle|^2`, where :math:`| \xi_i \rangle`
is the corresponding basis state from the observable's eigenbasis.

.. note::

    QNodes that return samples cannot, in general, be differentiated, since the derivative
    with respect to a sample --- a stochastic process --- is ill-defined. An alternative
    approach would be to use single-shot expectation values. For example, instead of this:

    .. code-block:: python

        dev = qp.device("default.qubit")

        @qp.set_shots(shots=10)
        @qp.qnode(dev, diff_method="parameter-shift")
        def circuit(angle):
            qp.RX(angle, wires=0)
            return qp.sample(qp.PauliX(0))

        angle = qp.numpy.array(0.1)
        res = qp.jacobian(circuit)(angle)

    Consider using :func:`~pennylane.expval` and a sequence of single shots, like this:

    .. code-block:: python

        dev = qp.device("default.qubit")

        @qp.set_shots(shots=[(1, 10)])
        @qp.qnode(dev, diff_method="parameter-shift")
        def circuit(angle):
            qp.RX(angle, wires=0)
            return qp.expval(qp.PauliX(0))

        def cost(angle):
            return qp.math.hstack(circuit(angle))

        angle = qp.numpy.array(0.1)
        res = qp.jacobian(cost)(angle)

**Example**

.. code-block:: python

    dev = qp.device("default.qubit", seed=42, wires=2)

    @qp.set_shots(shots=4)
    @qp.qnode(dev)
    def circuit(x):
        qp.RX(x, wires=0)
        qp.Hadamard(wires=1)
        qp.CNOT(wires=[0, 1])
        return qp.sample(qp.Y(0))

Executing this QNode:

>>> circuit(0.5)
array([-1., -1., -1., -1.])

If no observable is provided, then the raw basis state samples obtained
from the device are returned (e.g., for a qubit device, samples from the
computational basis are returned). In this case, ``wires`` can be specified
so that sample results only include measurement results of the qubits of interest.

.. code-block:: python

    dev = qp.device("default.qubit", seed=42, wires=2)

    @qp.set_shots(shots=4)
    @qp.qnode(dev)
    def circuit(x):
        qp.RX(x, wires=0)
        qp.Hadamard(wires=1)
        qp.CNOT(wires=[0, 1])
        return qp.sample()

Executing this QNode:

>>> circuit(0.5)
array([[0, 1],
       [0, 0],
       [0, 1],
       [0, 1]])

.. details::
        :title: Setting the precision of the samples

        The ``dtype`` argument can be used to set the type and precision of the samples returned by this measurement process
        when the ``op`` argument does not contain mid-circuit measurements. Otherwise, the ``dtype`` argument is ignored.

        By default, the samples will be returned as floating point numbers if an observable is provided,
        and as integers if no observable is provided. The ``dtype`` argument can be used to specify further details,
        and set the precision to any valid interface-like dtype, e.g. ``'float32'``, ``'int8'``, ``'uint16'``, etc.

        We show two examples below using the JAX and PyTorch interfaces.
        This argument is compatible with all interfaces currently supported by PennyLane.

        **Example:**

        .. code-block:: python

            @qp.set_shots(1000000)
            @qp.qnode(qp.device("default.qubit", wires=1), interface="jax")
            def circuit():
                qp.Hadamard(0)
                return qp.sample(dtype="int8")

        Executing this QNode, we get:

        >>> samples = circuit()
        >>> samples.dtype
        dtype('int8')
        >>> type(samples)
        <class 'jaxlib._jax.ArrayImpl'>

        If an observable is provided, the samples will be floating point numbers:

        .. code-block:: python

            @qp.set_shots(100)
            @qp.qnode(qp.device("default.qubit", wires=1), interface="torch")
            def circuit():
                qp.Hadamard(0)
                return qp.sample(qp.Z(0), dtype="float32")

        Executing this QNode, we get:

        >>> samples = circuit()
        >>> samples.dtype
        torch.float32
        >>> type(samples)
        <class 'torch.Tensor'>
