---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/noise/noise_model.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/noise/noise_model.py
license: Apache-2.0
---

## Module `pennylane/noise/noise_model.py`

Contains class and methods for noise models

## `NoiseModel`

```python
class NoiseModel
```

Builds a noise model based on the mappings of conditionals to callables that
define noise operations using some optional metadata.

Args:
    model_map (dict[BooleanFn -> Callable]): Data for applying the gate errors as
        a ``{conditional: noise_fn}`` dictionary. The signature of ``noise_fn``
        should be ``noise_fn(op: Operation, **kwargs) -> None``, where ``op``
        is the operation that the conditional evaluates and ``kwargs`` are
        the specified metadata arguments.
    meas_map (dict[BooleanFn -> Callable]): Data for adding the readout errors
        similar to ``model_map``. The signature of ``noise_fn`` must be
        ``noise_fn(mp: MeasurementProcess, **kwargs) -> None``, where ``mp`` is
        the measurement process that the conditional evaluates and ``kwargs``
        are the specified metadata arguments.
    **kwargs: Keyword arguments for specifying metadata related to the noise model.

.. note::

    For each key-value pair of ``model_map`` and ``meas_map``:

    - The ``conditional`` should be either a function decorated with :class:`~.BooleanFn`,
      a callable object built via :ref:`constructor functions <intro_boolean_fn>` in
      the ``qp.noise`` module, or their bitwise combination.
    - The definition of ``noise_fn(Union[op, mp], **kwargs)`` should have the operations
      in the same order in which they are to be queued for an operation ``op`` or
      measurement process ``mp``, whenever the corresponding ``conditional`` evaluates
      to ``True``.
    - Each ``conditional`` in ``meas_map`` is evaluated on each measurement process in
      the order they are specified. The corresponding noise has to be added `before`
      the measurement, i.e., custom queing in ``noise_fn`` should not be done.

**Example**

.. code-block:: python

    # Set up the gate noise
    c0 = qp.noise.op_eq(qp.PauliX) | qp.noise.op_eq(qp.PauliY)
    c1 = qp.noise.op_eq(qp.Hadamard) & qp.noise.wires_in([0, 1])

    def n0(op, **kwargs):
        qp.ThermalRelaxationError(0.4, kwargs["t1"], 0.2, 0.6, op.wires)
    n1 = qp.noise.partial_wires(qp.AmplitudeDamping, 0.4)

    # set up the readout noise
    m0 = qp.noise.meas_eq(qp.expval) & qp.noise.wires_in([0, 1])
    n2 = qp.noise.partial_wires(qp.PhaseFlip, 0.2)

    # Set up noise model
    noise_model = qp.NoiseModel({c0: n0}, meas_map={m0:n2}, t1=0.04)
    noise_model += {c1: n1}

>>> noise_model
NoiseModel({
    OpEq(PauliX) | OpEq(PauliY): n0
    OpEq(Hadamard) & WiresIn([0, 1]): AmplitudeDamping(gamma=0.4)
},
meas_map = {
    MeasEq('ExpectationMP') & WiresIn([0, 1]): PhaseFlip(p=0.2)
}, t1 = 0.04)

### `model_map`

```python
def model_map(self)
```

Gives the conditional model for the noise model.

### `meas_map`

```python
def meas_map(self)
```

Gives the measurement model for the noise model.

### `metadata`

```python
def metadata(self)
```

Gives the metadata for the noise model.

### `check_model`

```python
def check_model(model: dict) -> None
```

Method to validate a ``{conditional -> noise_fn}`` map for constructing a noise model.
