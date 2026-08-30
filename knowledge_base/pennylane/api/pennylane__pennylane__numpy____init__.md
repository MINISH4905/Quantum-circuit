---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/numpy/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/numpy/__init__.py
license: Apache-2.0
---

## Module `pennylane/numpy/__init__.py`

Overview
--------

The PennyLane NumPy subpackage provides a differentiable wrapper around NumPy, that enables
backpropagation through standard NumPy code.

This version of NumPy **must** be used when using PennyLane with the :doc:`Autograd interface
</introduction/interfaces/numpy>`:

>>> from pennylane import numpy as np

.. note::

    If using other interfaces, such as :doc:`TensorFlow </introduction/interfaces/tf>` :doc:`PyTorch
    </introduction/interfaces/torch>`, or :doc:`JAX </introduction/interfaces/jax>`, then the
    PennyLane-provided NumPy should not be used; instead, simply use the standard NumPy import.

This package is a wrapper around ``autograd.numpy``; for details on all available functions,
please refer to the `Autograd
docs <https://github.com/HIPS/autograd/blob/master/docs/tutorial.md>`__.

PennyLane additionally extends Autograd with the following classes,
errors, and functions:

.. autosummary::
    :toctree: api
    :nosignatures:
    :template: autosummary/class_no_inherited.rst

    ~wrap_arrays
    ~extract_tensors
    ~tensor_wrapper
    ~tensor
    ~NonDifferentiableError

Caveats
-------

This package is a wrapper around ``autograd.numpy``, and therefore comes with several caveats
inherited from Autograd:

**Do not use:**

- Assignment to arrays, such as ``A[0, 0] = x``.

..

- Implicit casting of lists to arrays, for example ``A = np.sum([x, y])``.
  Make sure to explicitly cast to a NumPy array first, i.e.,
  ``A = np.sum(np.array([x, y]))`` instead.

..

- ``A.dot(B)`` notation. Use ``np.dot(A, B)`` or ``A @ B`` instead.

..

- In-place operations such as ``a += b``. Use ``a = a + b`` instead.

..

- Some ``isinstance`` checks, like ``isinstance(x, np.ndarray)`` or ``isinstance(x, tuple)``,
  without first doing ``from autograd.builtins import isinstance, tuple``.

For more details, please consult the `Autograd
docs <https://github.com/HIPS/autograd/blob/master/docs/tutorial.md>`__.
