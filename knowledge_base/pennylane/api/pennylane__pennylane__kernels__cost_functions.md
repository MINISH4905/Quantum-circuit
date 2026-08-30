---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/kernels/cost_functions.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/kernels/cost_functions.py
license: Apache-2.0
---

## Module `pennylane/kernels/cost_functions.py`

This file contains functionalities for kernel related costs.
See `here <https://www.doi.org/10.1007/s10462-012-9369-4>`_ for a review.

## `polarity`

```python
def polarity(X, Y, kernel, assume_normalized_kernel=False, rescale_class_labels=True, normalize=False)
```

Polarity of a given kernel function.

For a dataset with feature vectors :math:`\{x_i\}` and associated labels :math:`\{y_i\}`,
the polarity of the kernel function :math:`k` is given by

.. math ::

    \operatorname{P}(k) = \sum_{i,j=1}^n y_i y_j k(x_i, x_j)

If the dataset is unbalanced, that is if the numbers of datapoints in the
two classes :math:`n_+` and :math:`n_-` differ,
``rescale_class_labels=True`` will apply a rescaling according to
:math:`\tilde{y}_i = \frac{y_i}{n_{y_i}}`. This is activated by default
and only results in a prefactor that depends on the size of the dataset
for balanced datasets.

The keyword argument ``assume_normalized_kernel`` is passed to
:func:`~.kernels.square_kernel_matrix`, for the computation
:func:`~.utils.frobenius_inner_product` is used.

Args:
    X (list[datapoint]): List of datapoints.
    Y (list[float]): List of class labels of datapoints, assumed to be either -1 or 1.
    kernel ((datapoint, datapoint) -> float): Kernel function that maps datapoints to kernel value.
    assume_normalized_kernel (bool, optional): Assume that the kernel is normalized, i.e.
        the kernel evaluates to 1 when both arguments are the same datapoint.
    rescale_class_labels (bool, optional): Rescale the class labels. This is important to take
        care of unbalanced datasets.
    normalize (bool): If True, rescale the polarity to the target_alignment.

Returns:
    float: The kernel polarity.

**Example:**

Consider a simple kernel function based on :class:`~.templates.embeddings.AngleEmbedding`:

.. code-block:: python

    dev = qp.device('default.qubit', wires=2)
    @qp.qnode(dev)
    def circuit(x1, x2):
        qp.templates.AngleEmbedding(x1, wires=dev.wires)
        qp.adjoint(qp.templates.AngleEmbedding)(x2, wires=dev.wires)
        return qp.probs(wires=dev.wires)

    kernel = lambda x1, x2: circuit(x1, x2)[0]

We can then compute the polarity on a set of 4 (random) feature
vectors ``X`` with labels ``Y`` via

>>> rng = np.random.default_rng(seed=1234)
>>> X = rng.random((4, 2))
>>> Y = np.array([-1, -1, 1, 1])
>>> qp.kernels.polarity(X, Y, kernel)
np.float64(0.2196...)

## `target_alignment`

```python
def target_alignment(X, Y, kernel, assume_normalized_kernel=False, rescale_class_labels=True)
```

Target alignment of a given kernel function.

This function is an alias for :func:`~.kernels.polarity` with ``normalize=True``.

For a dataset with feature vectors :math:`\{x_i\}` and associated labels :math:`\{y_i\}`, the
target alignment of the kernel function :math:`k` is given by

.. math ::

    \operatorname{TA}(k) = \frac{\sum_{i,j=1}^n y_i y_j k(x_i, x_j)}
    {\sqrt{\sum_{i,j=1}^n y_i y_j} \sqrt{\sum_{i,j=1}^n k(x_i, x_j)^2}}

If the dataset is unbalanced, that is if the numbers of datapoints in the
two classes :math:`n_+` and :math:`n_-` differ,
``rescale_class_labels=True`` will apply a rescaling according to
:math:`\tilde{y}_i = \frac{y_i}{n_{y_i}}`. This is activated by default
and only results in a prefactor that depends on the size of the dataset
for balanced datasets.

Args:
    X (list[datapoint]): List of datapoints
    Y (list[float]): List of class labels of datapoints, assumed to be either -1 or 1.
    kernel ((datapoint, datapoint) -> float): Kernel function that maps datapoints to kernel value.
    assume_normalized_kernel (bool, optional): Assume that the kernel is normalized, i.e.
        the kernel evaluates to 1 when both arguments are the same datapoint.
    rescale_class_labels (bool, optional): Rescale the class labels. This is important to take
        care of unbalanced datasets.

Returns:
    float: The kernel-target alignment.

**Example:**

Consider a simple kernel function based on :class:`~.templates.embeddings.AngleEmbedding`:

.. code-block:: python

    dev = qp.device('default.qubit', wires=2)
    @qp.qnode(dev)
    def circuit(x1, x2):
        qp.templates.AngleEmbedding(x1, wires=dev.wires)
        qp.adjoint(qp.templates.AngleEmbedding)(x2, wires=dev.wires)
        return qp.probs(wires=dev.wires)

    kernel = lambda x1, x2: circuit(x1, x2)[0]

We can then compute the kernel-target alignment on a set of 4 (random)
feature vectors ``X`` with labels ``Y`` via

>>> rng = np.random.default_rng(seed=1234)
>>> X = rng.random((4, 2))
>>> Y = np.array([-1, -1, 1, 1])
>>> qp.kernels.target_alignment(X, Y, kernel)
np.float64(0.0582...)

We can see that this is equivalent to using ``normalize=True`` in
``polarity``:

>>> target_alignment = qp.kernels.target_alignment(X, Y, kernel)
>>> normalized_polarity = qp.kernels.polarity(X, Y, kernel, normalize=True)
>>> print(np.isclose(target_alignment, normalized_polarity))
True
