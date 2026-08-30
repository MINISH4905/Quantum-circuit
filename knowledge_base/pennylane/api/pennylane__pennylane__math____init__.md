---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/math/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/math/__init__.py
license: Apache-2.0
---

## Module `pennylane/math/__init__.py`

This package contains unified functions for framework-agnostic tensor and array
manipulation. Given the input tensor-like object, the call is dispatched
to the corresponding array manipulation framework, allowing for end-to-end
differentiation to be preserved.

.. warning::

    These functions are experimental, and only a subset of common functionality is supported.
    Furthermore, the names and behaviour of these functions may differ from similar
    functions in common frameworks; please refer to the function docstrings for more details.

The following frameworks are currently supported:

* NumPy
* Autograd
* TensorFlow
* PyTorch
* JAX

## `get_dtype_name`

```python
def get_dtype_name(x) -> str
```

An interface independent way of getting the name of the datatype.

>>> x = tf.Variable(0.1)
>>> qp.math.get_dtype_name(tf.Variable(0.1))
'float32'

## `is_real_obj_or_close`

```python
def is_real_obj_or_close(obj)
```

Convert an array to its real part if it is close to being real-valued, and afterwards
return whether the resulting data type is real.

Args:
    obj (array): Array to check for being (close to) real.

Returns:
    bool: Whether the array ``obj``, after potentially converting it to a real matrix,
    has a real data type. This is obtained by checking whether the data type name starts with
    ``"complex"`` and returning the negated result of this.

>>> x = jnp.array(0.4)
>>> qp.math.is_real_obj_or_close(x)
True

>>> x = tf.Variable(0.4+0.2j)
>>> qp.math.is_real_obj_or_close(x)
False

>>> x = torch.tensor(0.4+1e-13j)
>>> qp.math.is_real_obj_or_close(x)
True

Default absolute and relative tolerances of
``qp.math.allclose`` are used to determine whether the
input is close to real-valued.

## `NumpyMimic`

```python
class NumpyMimic(ar.autoray.AutoNamespace)
```

Subclass of the Autoray NumpyMimic class in order to support
the NumPy fft submodule
