---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/get_best_diff_method.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/get_best_diff_method.py
license: Apache-2.0
---

## Module `pennylane/workflow/get_best_diff_method.py`

Contains a function for getting the best differentiation method for a given QNode.

## `get_best_diff_method`

```python
def get_best_diff_method(qnode: QNode) -> str
```

Returns a function that computes the 'best' differentiation method
for a particular QNode.

This method prioritizes differentiation methods in the following order (SPSA-based and Hadamard-based gradients
are not included here):

* ``"device"``
* ``"backprop"``
* ``"parameter-shift"``

.. note::

    The first differentiation method that is supported (from top to bottom)
    will be returned. The order is designed to maximize efficiency, generality,
    and stability.

.. seealso::

    For a detailed comparison of the backpropagation and parameter-shift methods,
    refer to the :doc:`quantum gradients with backpropagation example <demo:demos/tutorial_backprop>`.

Args:
    qnode (.QNode): the qnode to get the 'best' differentiation method for.

Returns:
    str: the gradient method name.
