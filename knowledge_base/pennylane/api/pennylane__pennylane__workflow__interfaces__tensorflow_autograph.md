---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/interfaces/tensorflow_autograph.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/interfaces/tensorflow_autograph.py
license: Apache-2.0
---

## Module `pennylane/workflow/interfaces/tensorflow_autograph.py`

This module contains functions for adding the TensorFlow Autograph interface
to a PennyLane Device class.

## `execute`

```python
def execute(tapes, device, execute_fn, gradient_fn, gradient_kwargs, _n=1, max_diff=2, grad_on_execution=None)
```

Execute a batch of tapes with TensorFlow parameters on a device.

Args:
    tapes (Sequence[.QuantumTape]): batch of tapes to execute
    device (pennylane.devices.Device): Device to use to execute the batch of tapes.
        If the device does not provide a ``batch_execute`` method,
        by default the tapes will be executed in serial.
    execute_fn (callable): The execution function used to execute the tapes
        during the forward pass. This function must return a tuple ``(results, jacobians)``.
        If ``jacobians`` is an empty list, then ``gradient_fn`` is used to
        compute the gradients during the backwards pass.
    gradient_kwargs (dict): dictionary of keyword arguments to pass when
        determining the gradients of tapes
    gradient_fn (callable): the gradient function to use to compute quantum gradients
    _n (int): a positive integer used to track nesting of derivatives, for example
        if the nth-order derivative is requested.
    max_diff (int): If ``gradient_fn`` is a gradient transform, this option specifies
        the maximum number of derivatives to support. Increasing this value allows
        for higher order derivatives to be extracted, at the cost of additional
        (classical) computational overhead during the backwards pass.
    grad_on_execution (bool): Whether the gradients should be computed on execution or not.

Returns:
    list[list[tf.Tensor]]: A nested list of tape results. Each element in
    the returned list corresponds in order to the provided tapes.
