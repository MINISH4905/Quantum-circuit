---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/gradients/gradient_transform.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/gradients/gradient_transform.py
license: Apache-2.0
---

## Module `pennylane/gradients/gradient_transform.py`

This module contains utilities for defining custom gradient transforms,
including a decorator for specifying gradient expansions.

## `assert_no_state_returns`

```python
def assert_no_state_returns(measurements, transform_name)
```

Check whether a set of measurements contains a measurement process that returns the quantum
state and raise an error if this is the case.

Args:
    measurements (list[MeasurementProcess]): measurements to analyze
    transform_name (str): Name of the gradient transform that queries the measurements

Currently, the measurement processes that are considered to return the state are
``~.measurements.StateMP``, ``~.measurements.VnEntropyMP``, and ``~.measurements.MutualInfoMP``.

## `assert_no_variance`

```python
def assert_no_variance(measurements, transform_name)
```

Check whether a set of measurements contains a variance measurement
raise an error if this is the case.

Args:
    measurements (list[MeasurementProcess]): measurements to analyze
    transform_name (str): Name of the gradient transform that queries the measurements

## `assert_no_probability`

```python
def assert_no_probability(measurements, transform_name)
```

Check whether a set of measurements contains a probability measurement
raise an error if this is the case.

Args:
    measurements (list[MeasurementProcess]): measurements to analyze
    transform_name (str): Name of the gradient transform that queries the measurements

## `assert_no_trainable_tape_batching`

```python
def assert_no_trainable_tape_batching(tape, transform_name)
```

Check whether a tape is broadcasted and raise an error if this is the case.

Args:
    tape (`~.QuantumScript`): measurements to analyze
    transform_name (str): Name of the gradient transform that queries the tape

## `choose_trainable_param_indices`

```python
def choose_trainable_param_indices(tape, argnum=None)
```

Returns a list of trainable parameter indices in the tape.

Chooses the subset of trainable parameters to compute the Jacobian for. The function
returns a list of indices with respect to the list of trainable parameters. If argnum
is not provided, all trainable parameters are considered.

Args:
    tape (`~.QuantumScript`): the tape to analyze
    argnum (int, list(int), None): Indices for trainable parameters(s)
        to compute the Jacobian for.

Returns:
    list: list of the trainable parameter indices

Note that trainable param indices are a **double pointer**.

>>> tape = qp.tape.QuantumScript([qp.RX(0.0, 0), qp.RY(1.0, 0), qp.RZ(2.0, 0)], trainable_params=[1,2])
>>> chose_trainable_param_indices(tape, argnum=[0])
[0]
>>> tape.get_operation(0)
(RY(1.0, wires=[0]), 1, 0)

In this case ``[0]`` points to the ``RY`` parameter. ``0`` selects into ``tape.trainable_params``,
which selects into ``tape.data``.

## `find_and_validate_gradient_methods`

```python
def find_and_validate_gradient_methods(tape, method, trainable_param_indices, use_graph=True)
```

Returns a dictionary of gradient methods for each trainable parameter after
validating if the gradient method requested is supported by the trainable parameters

Parameter gradient methods include:

* ``None``: the parameter does not support differentiation.

* ``"0"``: the variational circuit output does not depend on this
  parameter (the partial derivative is zero).

In addition, the operator might define its own grad method
via :attr:`.Operator.grad_method`.

Args:
    tape (`~.QuantumScript`): the tape to analyze
    method (str): the gradient method to use
    trainable_param_indices (list[int]): the indices of the trainable parameters
        to compute the Jacobian for
    use_graph (bool): whether to use the circuit graph to find if
        a parameter has zero gradient

Returns:
    dict: dictionary of the gradient methods for each trainable parameter

Raises:
    ValueError: If there exist non-differentiable trainable parameters on the tape.
    ValueError: If the Jacobian method is ``"analytic"`` but there exist some trainable
        parameters on the tape that only support numeric differentiation.

## `reorder_grads`

```python
def reorder_grads(grads, tape_specs)
```

Reorder the axes of tape gradients according to the original tape specifications.

Args:
    grads (list[tensorlike] or list[tuple[tensorlike]] or list[tuple[tuple[tensorlike]]]:
        Gradient entries with leading parameter axis to be reordered.
    tape_specs (tuple): Information about the differentiated original tape in the order
        ``(bool: single_measure, int: num_params, int: num_measurements, Shots: shots)``.

Returns:
    tensor_like or tuple[tensor_like] or tuple[tuple[tensor_like]]: The reordered gradient
        entries. Consider the details below for the ordering of the axes.

The order of axes of the gradient output matches the structure outputted by jax.jacobian for
a tuple-valued function. Internally, this may not be the case when computing the gradients,
so the axes are reordered here.

The axes of the input are assumed to be in the following order:

    1. Number of trainable parameters (Num params)
    2. Shot vector (if ``shots`` is a ``list`` or ``list[tuple]``. Skipped otherwise)
    3. Measurements (if there are multiple measurements. Skipped otherwise)
    4. Measurement shape
    5. Broadcasting dimension (for broadcasted tapes, skipped otherwise)

The final order of axes of gradient results should be:

    1. Shot vector [1]
    2. Measurements [1]
    3. Number of trainable parameters (Num params) [1]
    4. Broadcasting dimension [2]
    5. Measurement shape

[1] These axes are skipped in the output if they have length one. For shot vector and
    measurements, this already is true for the input. For num params, the axis is skipped
    "in addition", compared to the input.
[2] Parameter broadcasting doesn't yet support multiple measurements, hence such cases are not
    dealt with at the moment by this function.

The above reordering requires the following operations:

    1. In all cases, remove the parameter axis if it has length one.
    2. For a single measurement and no shot vector: Do nothing (but cast to ``tuple``)
    3. For a single measurement and shot vector: Swap first two axes (shots and parameters)
    4. For multiple measurements and no shot vector: Swap first two axes
       (measurements and parameters)
    5. For multiple measurements and shot vector: Move parameter axis from first to third
       position.

In all cases the output will be a ``tuple``, except for single-measurement, single-parameter
tapes, which will return a single measurement-like shaped output (no shot vector), or a list
thereof (shot vector).

## `contract_qjac_with_cjac`

```python
def contract_qjac_with_cjac(qjac, cjac, tape: QuantumScript)
```

Contract a quantum Jacobian with a classical preprocessing Jacobian.
Essentially, this function computes the generalized version of
``tensordot(qjac, cjac)`` over the tape parameter axis, adapted to the new
return type system. This function takes the measurement shapes and different
QNode arguments into account.

Args:
    qjac: The Jacobian of the purely quantum component.
    cjac: The Jacobian of the purely classical component.
    tape (QuantumScript): the corresponding tape. Used to determine the number of measurements, the number of
        trainable parameters, and the existence of partitioned shots.


Returns:
    The complete Jacobian.


This function can be used as the ``classical_cotransform`` component of a :func:`~pennylane.transform` for
a first-order derivative.

The ``qjac`` corresponds to the output of the standard postprocessing of a gradient transform. The ``cjac``
is the derivative of the tape parameters with respect to the qnode arguments.

Each ``qjac`` "leaf" should (after stacking) should correspond to ``(trainable_param_idx, *measurement_process shape)``
and each ``cjac`` "leaf" should be ``(trainable_param_idx, *qnode_argument_shape)``.

>>> @qp.qnode(qp.device('default.qubit'))
... def c(x):
...     qp.RX(x[0]**2, 0)
...     qp.RY(x[1], 0)
...     return qp.expval(qp.Z(0)), qp.expval(qp.Y(0))

>>> x = qp.numpy.array([2.0, 3.0])
>>> tape = qp.workflow.construct_tape(c)(x)
>>> cjac = qp.gradients.classical_jacobian(c)(x)
>>> cjac
array([[4., 0.],
    [0., 1.]])
>>> qjac = qp.gradients.param_shift(c, hybrid=False)(x)
>>> qjac
((tensor(-0.74922879, requires_grad=True),
tensor(0.09224219, requires_grad=True)),
(tensor(0.65364362, requires_grad=True),
tensor(2.70003469e-17, requires_grad=True)))
>>> qp.gradients.gradient_transform.contract_qjac_with_cjac(qjac, cjac, tape)
(tensor([-2.99691517,  0.09224219], requires_grad=True),
tensor([2.61457448e+00, 2.70003469e-17], requires_grad=True))
>>> qp.gradients.param_shift(c)(x)
(tensor([-2.99691517,  0.09224219], requires_grad=True),
tensor([2.61457448e+00, 2.70003469e-17], requires_grad=True))
