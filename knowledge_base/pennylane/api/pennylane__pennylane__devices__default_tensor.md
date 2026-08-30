---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/default_tensor.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/default_tensor.py
license: Apache-2.0
---

## Module `pennylane/devices/default_tensor.py`

This module contains the default.tensor device to perform tensor network simulations of quantum circuits using ``quimb``.

## `accepted_methods`

```python
def accepted_methods(method: str) -> bool
```

A function that determines whether or not a method is supported by ``default.tensor``.

## `stopping_condition`

```python
def stopping_condition(op: qp.operation.Operator) -> bool
```

A function that determines if an operation is supported by ``default.tensor``.

## `accepted_observables`

```python
def accepted_observables(obs: qp.operation.Operator) -> bool
```

A function that determines if an observable is supported by ``default.tensor``.

## `DefaultTensor`

```python
class DefaultTensor(Device)
```

A PennyLane device to perform tensor network simulations of quantum circuits using
`quimb <https://github.com/jcmgray/quimb/>`_.

This device is designed to simulate large-scale quantum circuits using tensor networks. For small circuits, other devices like ``default.qubit`` may be more suitable.

The backend uses the ``quimb`` library to perform the tensor network operations, and different methods can be used to simulate the quantum circuit.
The supported methods are Matrix Product State (MPS) and Tensor Network (TN).

This device does not currently support finite-shots or differentiation with ``diff_method`` set to ``"backprop"``, ``"adjoint"``, or ``"device"``. `Other differentiation methods <https://docs.pennylane.ai/en/stable/code/qp_gradients.html>`_ such as
``parameter-shift`` and ``hadamard_grad`` are compatible with all devices, including ``default.tensor``.
At present, the supported measurement types are expectation values, variances, and state measurements.
Finally, ``UserWarnings`` from the ``cotengra`` package may appear when using this device.

Args:
    wires (int, Iterable[Number, str]): Number of wires present on the device, or iterable that
        contains unique labels for the wires as numbers (e.g., ``[-1, 0, 2]``) or strings
        (e.g., ``['aux_wire', 'q1', 'q2']``).
    method (str): Supported method. The supported methods are ``"mps"`` (Matrix Product State) and ``"tn"`` (Tensor Network).
    c_dtype (type): Complex data type for the tensor representation. Must be one of ``numpy.complex64`` or ``numpy.complex128``.
    **kwargs: Keyword arguments for the device, passed to the ``quimb`` backend.

Keyword Args:
    max_bond_dim (int): Maximum bond dimension for the MPS method.
        It corresponds to the maximum number of Schmidt coefficients (singular values) retained at the end of the SVD algorithm when applying gates. Default is ``None`` (i.e. unlimited).
    cutoff (float): Truncation threshold for the Schmidt coefficients in the MPS method. Default is ``None`` (which is equivalent to retaining all coefficients).
    contract (str): The contraction method for applying gates. The possible options depend on the method chosen.
        For the MPS method, the options are ``"auto-mps"``, ``"swap+split"`` and ``"nonlocal"``. For a description of these options, see the
        `quimb's CircuitMPS documentation <https://quimb.readthedocs.io/en/latest/autoapi/quimb/tensor/index.html#quimb.tensor.CircuitMPS>`_.
        Default is ``"auto-mps"``.
        For the TN method, the options are ``"auto-split-gate"``, ``"split-gate"``, ``"reduce-split"``, ``"swap-split-gate"``, ``"split"``, ``True``, and ``False``.
        For details, see the `quimb's tensor_core documentation <https://quimb.readthedocs.io/en/latest/autoapi/quimb/tensor/tensor_core/index.html#quimb.tensor.tensor_core.tensor_network_gate_inds>`_.
        Default is ``"auto-split-gate"``.
    contraction_optimizer (str): The contraction path optimizer to use for the computation of local expectation values.
        For more information on the optimizer options accepted by ``quimb``, see the
        `quimb's tensor_contract documentation <https://quimb.readthedocs.io/en/latest/autoapi/quimb/tensor/tensor_core/index.html#quimb.tensor.tensor_core.tensor_contract>`_.
        Default is ``"auto-hq"``.
    local_simplify (str): The simplification sequence to apply to the tensor network for computing local expectation values.
        At present, this argument can only be provided when the TN method is used. For a complete list of available simplification options,
        see the `quimb's full_simplify documentation <https://quimb.readthedocs.io/en/latest/autoapi/quimb/tensor/tensor_core/index.html#quimb.tensor.tensor_core.TensorNetwork.full_simplify>`_.
        Default is ``"ADCRS"``.


**Example:**

The following code shows how to create a simple short-depth quantum circuit with 100 qubits using the ``default.tensor`` device.
Depending on the machine, the execution time for this circuit is around 0.3 seconds:

.. code-block:: python

    import pennylane as qp

    num_qubits = 100

    dev = qp.device("default.tensor", wires=num_qubits)

    @qp.qnode(dev)
    def circuit(num_qubits):
        for qubit in range(0, num_qubits - 1):
            qp.CZ(wires=[qubit, qubit + 1])
            qp.X(wires=[qubit])
            qp.Z(wires=[qubit + 1])
        return qp.expval(qp.Z(0))

>>> circuit(num_qubits)
-1.0

We can provide additional keyword arguments to the device to customize the simulation. These are passed to the ``quimb`` backend.

.. note::

    Be aware that ``quimb`` uses multi-threading with `numba <https://numba.pydata.org/numba-doc/dev/user/threading-layer.html>`_
    as well as for linear algebra operations with
    `numpy.linalg <https://numpy.org/doc/stable/reference/routines.linalg.html#linear-algebra-numpy-linalg>`_. Proper setting of
    the corresponding environment variables (e.g. ``OMP_NUM_THREADS``, ``OPENBLAS_NUM_THREADS``, ``NUMBA_NUM_THREADS`` etc.)
    depending on your hardware is highly recommended and will have a strong impact on the device's performance.

    To avoid a slowdown in performance for circuits with more than 10 wires, we recommend setting the environment variable relevant
    for your BLAS library backend (e.g. ``OMP_NUM_THREADS=1``, ``OPENBLAS_NUM_THREADS=1`` or ``MKL_NUM_THREADS=1``), depending on your
    NumPy package and associated libraries. Alternatively, you can use `threadpoolctl <https://github.com/joblib/threadpoolctl>`_ to
    limit the threads within your executing script. For optimal performance you can adjust the number of threads to find the best fit
    for your workload.

.. details::
        :title: Usage with MPS Method

        In the following example, we consider a slightly more complex circuit. We use the ``default.tensor`` device with the MPS method,
        setting the maximum bond dimension to 100 and the cutoff to the machine epsilon.

        We set ``"auto-mps"`` as the contraction technique to apply gates. With this option, ``quimb`` turns 3-qubit gates and 4-qubit gates
        into Matrix Product Operators (MPO) and applies them directly to the MPS. On the other hand, qubits involved in 2-qubit gates may be
        temporarily swapped to adjacent positions before applying the gate and then returned to their original positions.

        .. code-block:: python

            import pennylane as qp
            import numpy as np

            theta = 0.5
            phi = 0.1
            num_qubits = 50
            device_kwargs_mps = {
                "max_bond_dim": 100,
                "cutoff": np.finfo(np.complex128).eps,
                "contract": "auto-mps",
            }

            dev = qp.device("default.tensor", wires=num_qubits, method="mps", **device_kwargs_mps)

            @qp.qnode(dev)
            def circuit(theta, phi, num_qubits):
                for qubit in range(num_qubits - 4):
                    qp.X(wires=qubit)
                    qp.RX(theta, wires=qubit + 1)
                    qp.CNOT(wires=[qubit, qubit + 1])
                    qp.DoubleExcitation(phi, wires=[qubit, qubit + 1, qubit + 3, qubit + 4])
                    qp.CSWAP(wires=[qubit + 1, qubit + 3, qubit + 4])
                    qp.RY(theta, wires=qubit + 1)
                    qp.Toffoli(wires=[qubit + 1, qubit + 3, qubit + 4])
                return [
                    qp.expval(qp.Z(0)),
                    qp.expval(qp.Hamiltonian([np.pi, np.e], [qp.Z(15) @ qp.Y(25), qp.Hadamard(40)])),
                    qp.var(qp.Y(20)),
                ]

        >>> circuit(theta, phi, num_qubits)
        [-0.9953..., np.float64(0.0036631...), np.float64(0.9999...)]

        After the first execution, the time to run this circuit for 50 qubits is around 0.5 seconds on a standard laptop.
        Increasing the number of qubits to 500 brings the execution time to approximately 15 seconds, and for 1000 qubits to around 50 seconds.

        The time complexity and the accuracy of the results also depend on the chosen keyword arguments for the device, such as the maximum bond dimension.
        The specific structure of the circuit significantly affects how the time complexity and accuracy of the simulation scale with these parameters.

.. details::
        :title: Usage with TN Method

        We can also simulate quantum circuits using the Tensor Network (TN) method. This can be particularly useful for circuits that build up entanglement.
        The following example shows how to execute a quantum circuit with the TN method and configurable depth using ``default.tensor``.

        We set the contraction technique to ``"auto-split-gate"``. With this option, each gate is lazily added to the tensor network
        and nothing is initially contracted, but the gate is automatically split if this results in a rank reduction.


        .. code-block:: python

            import pennylane as qp

            phi = 0.1
            depth = 10
            num_qubits = 100

            dev = qp.device("default.tensor", method="tn", contract="auto-split-gate")

            @qp.qnode(dev)
            def circuit(phi, depth, num_qubits):
                for qubit in range(num_qubits):
                    qp.X(wires=qubit)
                for _ in range(depth):
                    for qubit in range(num_qubits - 1):
                        qp.CNOT(wires=[qubit, qubit + 1])
                    for qubit in range(num_qubits):
                        qp.RX(phi, wires=qubit)
                for qubit in range(num_qubits - 1):
                    qp.CNOT(wires=[qubit, qubit + 1])
                return qp.expval(qp.Z(0))

        >>> circuit(phi, depth, num_qubits)
        -0.9511499...

        The execution time for this circuit with the above parameters is around 0.8 seconds on a standard laptop.

        The tensor network method can be faster than MPS and state vector methods in some cases.
        As a comparison, the time for the exact calculation (i.e., with ``max_bond_dim = None``) of the same circuit
        using the ``MPS`` method of the ``default.tensor`` device is approximately three orders of magnitude slower.
        Similarly, using the ``default.qubit`` device results in a much slower simulation.

### `name`

```python
def name(self) -> str
```

The name of the device.

### `method`

```python
def method(self) -> str
```

Method used by the device.

### `c_dtype`

```python
def c_dtype(self) -> type
```

Tensor complex data type.

### `draw`

```python
def draw(self, color='auto', **kwargs)
```

Draw the current state (wavefunction) associated with the circuit using ``quimb``'s functionality.

Internally, it uses ``quimb``'s ``draw`` method.

Args:
    color (str): The color of the tensor network diagram. Default is ``"auto"``.
    **kwargs: Additional keyword arguments for the ``quimb``'s ``draw`` function. For more information, see the
        `quimb's draw documentation <https://quimb.readthedocs.io/en/latest/tensor-drawing.html>`_.

**Example**

Here is a minimal example of how to draw the current state of the circuit:

.. code-block:: python

    import pennylane as qp

    dev = qp.device("default.tensor", method="mps", wires=15)

    dev.draw()

We can also customize the appearance of the tensor network diagram by passing additional keyword arguments:

.. code-block:: python

    dev = qp.device("default.tensor", method="tn", contract=False)

    @qp.qnode(dev)
    def circuit(num_qubits):
        for i in range(num_qubits):
            qp.Hadamard(wires=i)
        for _ in range(1, num_qubits - 1):
            for i in range(0, num_qubits, 2):
                qp.CNOT(wires=[i, i + 1])
            for i in range(10):
                qp.RZ(1.234, wires=i)
            for i in range(1, num_qubits - 1, 2):
                qp.CZ(wires=[i, i + 1])
            for i in range(num_qubits):
                qp.RX(1.234, wires=i)
        for i in range(num_qubits):
            qp.Hadamard(wires=i)
        return qp.expval(qp.Z(0))

    num_qubits = 12

    result = circuit(num_qubits)

    dev.draw(color="auto", show_inds=True)

### `preprocess`

```python
def preprocess(self, execution_config: ExecutionConfig | None=None)
```

This function defines the device compile pileline to be applied and an updated device configuration.

Args:
    execution_config (Union[ExecutionConfig, Sequence[ExecutionConfig]]): A data structure describing the
        parameters needed to fully describe the execution.

Returns:
    CompilePipeline, ExecutionConfig: A compile pileline that when called returns :class:`~.QuantumTape`'s that the
    device can natively execute as well as a postprocessing function to be called after execution, and a configuration
    with unset specifications filled in.

This device currently:

* Does not support finite shots.
* Does not support derivatives.
* Does not support vector-Jacobian products.

### `execute`

```python
def execute(self, circuits: QuantumScriptOrBatch, execution_config: ExecutionConfig | None=None) -> Result | ResultBatch
```

Execute a circuit or a batch of circuits and turn it into results.

Args:
    circuits (Union[QuantumTape, Sequence[QuantumTape]]): the quantum circuits to be executed.
    execution_config (ExecutionConfig): a data structure with additional information required for execution.

Returns:
    TensorLike, tuple[TensorLike], tuple[tuple[TensorLike]]: A numeric result of the computation.

### `simulate`

```python
def simulate(self, circuit: QuantumScript) -> Result
```

Simulate a single quantum script. This function assumes that all operations provide matrices.

Args:
    circuit (QuantumScript): The single circuit to simulate.

Returns:
    Tuple[TensorLike]: The results of the simulation.

### `measurement`

```python
def measurement(self, measurementprocess: MeasurementProcess) -> TensorLike
```

Measure the measurement required by the circuit.

Args:
    measurementprocess (MeasurementProcess): measurement to apply to the state.

Returns:
    TensorLike: the result of the measurement.

### `expval`

```python
def expval(self, measurementprocess: MeasurementProcess) -> float
```

Expectation value of the supplied observable contained in the MeasurementProcess.

Args:
    measurementprocess (StateMeasurement): measurement to apply.

Returns:
    Expectation value of the observable.

### `state`

```python
def state(self, measurementprocess: MeasurementProcess)
```

Returns the state vector.

### `var`

```python
def var(self, measurementprocess: MeasurementProcess) -> float
```

Variance of the supplied observable contained in the MeasurementProcess.

Args:
    measurementprocess (StateMeasurement): measurement to apply.

Returns:
    Variance of the observable.

### `supports_derivatives`

```python
def supports_derivatives(self, execution_config: ExecutionConfig | None=None, circuit: qp.tape.QuantumTape | None=None) -> bool
```

Check whether or not derivatives are available for a given configuration and circuit.

Args:
    execution_config (ExecutionConfig): The configuration of the desired derivative calculation.
    circuit (QuantumTape): An optional circuit to check derivatives support for.

Returns:
    Bool: Whether or not a derivative can be calculated provided the given information.

### `compute_derivatives`

```python
def compute_derivatives(self, circuits: QuantumScriptOrBatch, execution_config: ExecutionConfig | None=None)
```

Calculate the Jacobian of either a single or a batch of circuits on the device.

Args:
    circuits (Union[QuantumTape, Sequence[QuantumTape]]): the circuits to calculate derivatives for.
    execution_config (ExecutionConfig): a data structure with all additional information required for execution.

Returns:
    Tuple: The Jacobian for each trainable parameter.

### `execute_and_compute_derivatives`

```python
def execute_and_compute_derivatives(self, circuits: QuantumScriptOrBatch, execution_config: ExecutionConfig | None=None)
```

Compute the results and Jacobians of circuits at the same time.

Args:
    circuits (Union[QuantumTape, Sequence[QuantumTape]]): the circuits or batch of circuits.
    execution_config (ExecutionConfig): a data structure with all additional information required for execution.

Returns:
    tuple: A numeric result of the computation and the gradient.

### `supports_vjp`

```python
def supports_vjp(self, execution_config: ExecutionConfig | None=None, circuit: QuantumScript | None=None) -> bool
```

Whether or not this device defines a custom vector-Jacobian product.

Args:
    execution_config (ExecutionConfig): The configuration of the desired derivative calculation.
    circuit (QuantumTape): An optional circuit to check derivatives support for.

Returns:
    Bool: Whether or not a derivative can be calculated provided the given information.

### `compute_vjp`

```python
def compute_vjp(self, circuits: QuantumScriptOrBatch, cotangents: tuple[Number, ...], execution_config: ExecutionConfig | None=None)
```

The vector-Jacobian product used in reverse-mode differentiation.

Args:
    circuits (Union[QuantumTape, Sequence[QuantumTape]]): the circuit or batch of circuits.
    cotangents (Tuple[Number, Tuple[Number]]): Gradient-output vector. Must have shape matching the output shape of the
        corresponding circuit. If the circuit has a single output, ``cotangents`` may be a single number, not an iterable
        of numbers.
    execution_config (ExecutionConfig): a data structure with all additional information required for execution.

Returns:
    tensor-like: A numeric result of computing the vector-Jacobian product.

### `execute_and_compute_vjp`

```python
def execute_and_compute_vjp(self, circuits: QuantumScriptOrBatch, cotangents: tuple[Number, ...], execution_config: ExecutionConfig | None=None)
```

Calculate both the results and the vector-Jacobian product used in reverse-mode differentiation.

Args:
    circuits (Union[QuantumTape, Sequence[QuantumTape]]): the circuit or batch of circuits to be executed.
    cotangents (Tuple[Number, Tuple[Number]]): Gradient-output vector. Must have shape matching the output shape of the
        corresponding circuit.
    execution_config (ExecutionConfig): a data structure with all additional information required for execution.

Returns:
    Tuple, Tuple: the result of executing the scripts and the numeric result of computing the vector-Jacobian product.

## `apply_operation_core`

```python
def apply_operation_core(ops: Operation, device)
```

Dispatcher for _apply_operation.

## `apply_operation_core_global_phase`

```python
def apply_operation_core_global_phase(ops: qp.GlobalPhase, device)
```

Dispatcher for _apply_operation.

## `apply_operation_core_multirz`

```python
def apply_operation_core_multirz(ops: qp.MultiRZ, device)
```

Dispatcher for _apply_operation.

## `apply_operation_core_paulirot`

```python
def apply_operation_core_paulirot(ops: qp.PauliRot, device)
```

Apply a Pauli rotation operation in the form of a Matrix Product Operator (MPO).

## `apply_operation_core_trotter_product`

```python
def apply_operation_core_trotter_product(ops: qp.TrotterProduct, device)
```

Dispatcher for _apply_operation.

## `expval_core`

```python
def expval_core(obs: Operator, device) -> float
```

Dispatcher for expval.

## `expval_core_prod`

```python
def expval_core_prod(obs: Prod, device) -> float
```

Computes the expval of a Prod.

## `expval_core_sprod`

```python
def expval_core_sprod(obs: SProd, device) -> float
```

Computes the expval of a SProd.

## `expval_core_sum`

```python
def expval_core_sum(obs: Sum, device) -> float
```

Computes the expval of a Sum.

## `expval_core_linear_combination`

```python
def expval_core_linear_combination(obs: LinearCombination, device) -> float
```

Computes the expval of a LinearCombination.
