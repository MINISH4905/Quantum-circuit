---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/math/is_independent.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/math/is_independent.py
license: Apache-2.0
---

## Module `pennylane/math/is_independent.py`

This file contains the is_independent function that checks if
a function is independent of its arguments for the interfaces

* Autograd
* JAX
* TensorFlow
* PyTorch

## `is_independent`

```python
def is_independent(func, interface, args, kwargs=None, num_pos=5, seed=9123, atol=1e-06, rtol=0, bounds=(-np.pi, np.pi))
```

Test whether a function is independent of its input arguments,
both numerically and analytically.

Args:
    func (callable): Function to be tested
    interface (str): Autodiff framework used by ``func``. Must correspond to one
        of the supported PennyLane interface strings, such as ``"autograd"``,
        ``"tf"``, ``"torch"``, ``"jax"``.
    args (tuple): Positional arguments with respect to which to test
    kwargs (dict): Keyword arguments for ``func`` at which to test;
        the keyword arguments are kept fixed in this test.
    num_pos (int): Number of random positions to test
    seed (int): Seed for the random number generator
    atol (float): Absolute tolerance for comparing the outputs
    rtol (float): Relative tolerance for comparing the outputs
    bounds (tuple[float]): 2-tuple containing limits of the range from which to sample

Returns:
    bool: Whether ``func`` returns the same output at randomly
    chosen points and is numerically independent of its arguments.

.. warning::

    This function is experimental.
    As such, it might yield wrong results and might behave
    slightly differently in distinct autodifferentiation frameworks
    for some edge cases.
    For example, a currently known edge case are piecewise
    functions that use classical control and simultaneously
    return (almost) constant output, such as

    .. code-block:: python

        def func(x):
            if abs(x) <1e-5:
                return x
            else:
                return 0. * x

The analytic and numeric tests used are as follows.

- The analytic test performed depends on the provided ``interface``,
  both in its method and its degree of reliability.

- For the numeric test, the function is evaluated at a series of random positions,
  and the outputs numerically compared to verify that the output
  is constant.

.. warning ::

    Currently, no analytic test is available for the PyTorch interface.
    When using PyTorch, a warning will be raised and only the
    numeric test is performed.

.. note ::

    Due to the structure of ``is_independent``, it is possible that it
    errs on the side of reporting a dependent function to be independent
    (a false positive). However, reporting an independent function to be
    dependent (a false negative) is *highly* unlikely.

**Example**

Consider the (linear) function

.. code-block:: python

    def lin(x, weights=None):
        return np.dot(x, weights)

This function clearly depends on ``x``. We may check for this via

.. code-block:: pycon

    >>> x = np.array([0.2, 9.1, -3.2], requires_grad=True)
    >>> weights = np.array([1.1, -0.7, 1.8], requires_grad=True)
    >>> qp.math.is_independent(lin, "autograd", (x,), {"weights": weights})
    False

However, the Jacobian will not depend on ``x`` because ``lin`` is a
linear function:

.. code-block:: pycon

    >>> jac = qp.jacobian(lin)
    >>> qp.math.is_independent(jac, "autograd", (x,), {"weights": weights})
    True

Note that a function ``f = lambda x: 0.0 * x`` will be counted as *dependent* on ``x``
because it does depend on ``x`` *functionally*, even if the value is constant for all ``x``.
This means that ``is_independent`` is a stronger test than simply verifying functions
have constant output.
