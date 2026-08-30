---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/interfaces/torch.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/interfaces/torch.py
license: Apache-2.0
---

## Module `pennylane/workflow/interfaces/torch.py`

This module contains functions for adding the PyTorch interface
to a PennyLane Device class.

**How to bind a custom derivative with Torch.**

See `the Torch documentation <https://pytorch.org/docs/stable/notes/extending.html>`_ for more complete
information.

Suppose I have a function ``f`` that I want to define a custom vjp for.

We need to inherit from ``torch.autograd.Function`` and define ``forward`` and ``backward`` static
methods.

.. code-block:: python

    class CustomFunction(torch.autograd.Function):

        @staticmethod
        def forward(ctx, x, exponent=2):
            ctx.saved_info = {'x': x, 'exponent': exponent}
            return x ** exponent

        @staticmethod
        def backward(ctx, dy):
            x = ctx.saved_info['x']
            exponent = ctx.saved_info['exponent']
            print(f"Calculating the gradient with x={x}, dy={dy}, exponent={exponent}")
            return dy * exponent * x ** (exponent-1), None

To use the ``CustomFunction`` class, we call it with the static ``apply`` method.

>>> val = torch.tensor(2.0, requires_grad=True)
>>> res = CustomFunction.apply(val)
>>> res
tensor(4., grad_fn=<CustomFunctionBackward>)
>>> res.backward()
Calculating the gradient with x=2.0, dy=1.0, exponent=2
>>> val.grad
tensor(4.)

Note that for custom functions, the output of ``forward`` and the output of ``backward`` are flattened iterables of
Torch arrays.  While autograd and jax can handle nested result objects like ``((np.array(1), np.array(2)), np.array(3))``,
torch requires that it be flattened like ``(np.array(1), np.array(2), np.array(3))``.  The ``pytreeify`` class decorator
modifies the output of ``forward`` and the input to ``backward`` to unpack and repack the nested structure of the PennyLane
result object.

## `pytreeify`

```python
def pytreeify(cls)
```

Pytrees refer to a tree-like structure built out of container-like Python objects. The pytreeify class is used
to bypass some PyTorch limitation of `autograd.Function`. The forward pass can only return tuple of tensors but
not any other nested structure. This class apply flatten to the forward pass and unflatten the results in the
apply function. In this way, it is possible to treat multiple tapes with multiple measurements.

## `ExecuteTapes`

```python
class ExecuteTapes(torch.autograd.Function)
```

The signature of this ``torch.autograd.Function`` is designed to
work around Torch restrictions.

In particular, ``torch.autograd.Function``:

- Cannot accept keyword arguments. As a result, we pass a dictionary
  as the first argument ``kwargs``. This dictionary **must** contain:

  * ``"tapes"``: the quantum tapes to batch evaluate
  * ``"execute_fn"``: a function that calculates the results of the tapes
  * ``"jpc"``: a :class:`~.JacobianProductCalculator` that can compute the vjp.

Further, note that the ``parameters`` argument is dependent on the
``tapes``; this function should always be called
with the parameters extracted directly from the tapes as follows:

.. code-block:: python3

    parameters = [p for t in tapes for p in t.get_parameters()]
    kwargs = {"tapes": tapes, "execute_fn": execute_fn, "jpc": jpc}
    ExecuteTapes.apply(kwargs, *parameters)

### `forward`

```python
def forward(ctx, kwargs, *parameters)
```

Implements the forward pass batch tape evaluation.

### `backward`

```python
def backward(ctx, *dy)
```

Returns the vector-Jacobian product with given
parameter values p and output gradient dy

## `execute`

```python
def execute(tapes, execute_fn, jpc, device=None)
```

Execute a batch of tapes with Torch parameters on a device.

Args:
    tapes (Sequence[.QuantumTape]): batch of tapes to execute
    execute_fn (Callable[[Sequence[.QuantumTape]], ResultBatch]): a function that turns a batch of circuits into results
    jpc (JacobianProductCalculator): a class that can compute the vector jacobian product for the input tapes.

Returns:
    TensorLike: A nested tuple of tape results. Each element in
    the returned tuple corresponds in order to the provided tapes.
