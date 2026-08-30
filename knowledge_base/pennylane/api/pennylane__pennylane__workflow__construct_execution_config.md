---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/construct_execution_config.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/construct_execution_config.py
license: Apache-2.0
---

## Module `pennylane/workflow/construct_execution_config.py`

Contains a function to construct an execution configuration from a QNode instance.

## `construct_execution_config`

```python
def construct_execution_config(qnode: QNode, resolve: bool | None=True) -> Callable[P, ExecutionConfig]
```

Constructs the execution configuration of a QNode instance.

Args:
    qnode (QNode): the qnode we want to get execution configuration for
    resolve (bool): Whether or not to validate and fill in undetermined values like `"best"`. Defaults to ``True``.

Returns:
    config (qp.devices.ExecutionConfig): the execution configuration

**Example**

.. code-block:: python

    @qp.qnode(qp.device("default.qubit", wires=1))
    def circuit(x):
        qp.RX(x, 0)
        return qp.expval(qp.Z(0))

First, let's import ``pprint`` to make it easier to read the execution configuration objects.

>>> from pprint import pprint

If we wish to construct an unresolved execution configuration, we can specify
``resolve=False``. This will leave properties like ``gradient_method`` and ``interface``
in their unrefined state (e.g. ``"best"`` or ``"auto"`` respectively).

>>> config = qp.workflow.construct_execution_config(circuit, resolve=False)(1)
>>> pprint(config)
ExecutionConfig(grad_on_execution=None,
                use_device_gradient=None,
                use_device_jacobian_product=False,
                gradient_method='best',
                gradient_keyword_arguments={},
                device_options={},
                interface=<Interface.AUTO: 'auto'>,
                derivative_order=1,
                mcm_config=MCMConfig(mcm_method=None, postselect_mode=None),
                convert_to_numpy=True,
                executor_backend=<class 'pennylane.concurrency.executors.native.multiproc.MPPoolExec'>)

Specifying ``resolve=True`` will then resolve these properties appropriately for the
given ``QNode`` configuration that was provided,

>>> resolved_config = qp.workflow.construct_execution_config(circuit, resolve=True)(1)
>>> pprint(resolved_config)
ExecutionConfig(grad_on_execution=False,
                use_device_gradient=True,
                use_device_jacobian_product=False,
                gradient_method='backprop',
                gradient_keyword_arguments={},
                device_options={'max_workers': None, 'rng': ..., 'prng_key': None},
                interface=<Interface.NUMPY: 'numpy'>,
                derivative_order=1,
                mcm_config=MCMConfig(mcm_method='deferred', postselect_mode=None),
                convert_to_numpy=True,
                executor_backend=<class 'pennylane.concurrency.executors.native.multiproc.MPPoolExec'>)
