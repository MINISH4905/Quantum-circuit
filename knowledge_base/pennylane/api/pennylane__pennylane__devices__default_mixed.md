---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/default_mixed.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/default_mixed.py
license: Apache-2.0
---

## Module `pennylane/devices/default_mixed.py`

The ``default.mixed`` device is PennyLane's standard qubit simulator for mixed-state computations.

It implements some built-in qubit :doc:`operations </introduction/operations>`,
providing a simple mixed-state simulation of qubit-based quantum circuits.

## `observable_stopping_condition`

```python
def observable_stopping_condition(obs: qp.operation.Operator) -> bool
```

Specifies whether an observable is accepted by DefaultQubitMixed.

## `stopping_condition`

```python
def stopping_condition(op: qp.operation.Operator) -> bool
```

Specify whether an Operator object is supported by the device.

## `warn_readout_error_state`

```python
def warn_readout_error_state(tape: qp.tape.QuantumTape) -> tuple[Sequence[qp.tape.QuantumTape], Callable]
```

If a measurement in the QNode is an analytic state or density_matrix, warn that readout error will not be applied.

Args:
    tape (QuantumTape, .QNode, Callable): a quantum circuit.

Returns:
    qnode (pennylane.QNode) or quantum function (callable) or tuple[List[.QuantumTape], function]:
    The unaltered input circuit.

## `DefaultMixed`

```python
class DefaultMixed(Device)
```

A PennyLane Python-based device for mixed-state qubit simulation.

Args:
    wires (int, Iterable[Number, str]): Number of wires present on the device, or iterable that
        contains unique labels for the wires as numbers (i.e., ``[-1, 0, 2]``) or strings
        (``['auxiliary', 'q1', 'q2']``).
    shots (int, Sequence[int], Sequence[Union[int, Sequence[int]]]): The default number of shots
        to use in executions involving this device.
    seed (Union[str, None, int, array_like[int], SeedSequence, BitGenerator, Generator, jax.random.PRNGKey]): A
        seed-like parameter matching that of ``seed`` for ``numpy.random.default_rng``, or
        a request to seed from numpy's global random number generator.
        The default, ``seed="global"`` pulls a seed from NumPy's global generator. ``seed=None``
        will pull a seed from the OS entropy.
        If a ``jax.random.PRNGKey`` is passed as the seed, a JAX-specific sampling function using
        ``jax.random.choice`` and the ``PRNGKey`` will be used for sampling rather than
        ``numpy.random.default_rng``.
    r_dtype (numpy.dtype): Real datatype to use for computations. Default is np.float64.
    c_dtype (numpy.dtype): Complex datatype to use for computations. Default is np.complex128.
    readout_prob (float): Probability of readout error for qubit measurements. Must be in :math:`[0,1]`.

### `name`

```python
def name(self)
```

The name of the device.

### `supports_derivatives`

```python
def supports_derivatives(self, execution_config: ExecutionConfig | None=None, circuit: QuantumScript | None=None) -> bool
```

Check whether or not derivatives are available for a given configuration and circuit.

``DefaultQubitMixed`` supports backpropagation derivatives with analytic results.

Args:
    execution_config (ExecutionConfig): The configuration of the desired derivative calculation.
    circuit (QuantumTape): An optional circuit to check derivatives support for.

Returns:
    bool: Whether or not a derivative can be calculated provided the given information.

### `preprocess`

```python
def preprocess(self, execution_config: ExecutionConfig=None) -> tuple[CompilePipeline, ExecutionConfig]
```

This function defines the device compile pileline to be applied and an updated device
configuration.

Args:
    execution_config (Union[ExecutionConfig, Sequence[ExecutionConfig]]): A data structure
        describing the parameters needed to fully describe the execution.

Returns:
    CompilePipeline, ExecutionConfig: A compile pileline that when called returns
    ``QuantumTape`` objects that the device can natively execute, as well as a postprocessing
    function to be called after execution, and a configuration with unset
    specifications filled in.

This device:

* Supports any qubit operations that provide a matrix
* Supports any qubit channel that provides Kraus matrices
