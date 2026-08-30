---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qnn/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qnn/__init__.py
license: Apache-2.0
---

## Module `pennylane/qnn/__init__.py`

This module contains tools dedicated to machine learning, including functionality for converting PennyLane QNodes into
layers that are compatible with PyTorch, and estimators that assist with classically training quantum circuits.

.. note::

    Check out our :doc:`Keras <demo:demos/qnn_module_tf>` and
    :doc:`Torch <demo:demos/tutorial_qnn_module_torch>` tutorials for further details.


.. rubric:: Classes

.. autosummary::
    :toctree: api
    :nosignatures:
    :template: autosummary/class_no_inherited.rst

    ~TorchLayer

.. rubric:: Estimators

.. autosummary::
    :toctree: api

    ~iqp_expval

## `__getattr__`

```python
def __getattr__(name)
```

Allow for lazy-loading of TorchLayer so that PyTorch are not
automatically loaded with PennyLane
