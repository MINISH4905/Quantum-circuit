---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/kernels/utils.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/kernels/utils.py
license: Apache-2.0
---

## Module `pennylane/kernels/utils.py`

This file contains functionalities that simplify working with kernels.

## `square_kernel_matrix`

```python
def square_kernel_matrix(X, kernel, assume_normalized_kernel=False)
```

Computes the square matrix of pairwise kernel values for a given dataset.

Args:
    X (list[datapoint]): List of datapoints
    kernel ((datapoint, datapoint) -> float): Kernel function that maps
        datapoints to kernel value.
    assume_normalized_kernel (bool, optional): Assume that the kernel is normalized, in
        which case the diagonal of the kernel matrix is set to 1, avoiding unnecessary
        computations.

Returns:
    array[float]: The square matrix of kernel values.

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

We can then compute the kernel matrix on a set of 4 (random) feature
vectors ``X`` via

>>> rng = np.random.default_rng(seed=1234)
>>> X = rng.random((4, 2))
>>> qp.kernels.square_kernel_matrix(X, kernel)
array([[1.        , 0.9957817 , 0.88043387, 0.87011008],
       [0.9957817 , 1.        , 0.90680189, 0.88760331],
       [0.88043387, 0.90680189, 1.        , 0.98850996],
       [0.87011008, 0.88760331, 0.98850996, 1.        ]])

## `kernel_matrix`

```python
def kernel_matrix(X1, X2, kernel)
```

Computes the matrix of pairwise kernel values for two given datasets.

Args:
    X1 (list[datapoint]): List of datapoints (first argument)
    X2 (list[datapoint]): List of datapoints (second argument)
    kernel ((datapoint, datapoint) -> float): Kernel function that maps datapoints to kernel value.

Returns:
    array[float]: The matrix of kernel values.

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

With this method we can systematically evaluate the kernel function ``kernel`` on
pairs of datapoints, where the points stem from different datasets, like a training
and a test dataset.

>>> rng = np.random.default_rng(seed=1234)
>>> X_train = rng.random((4,2))
>>> X_test = rng.random((3,2))
>>> qp.kernels.kernel_matrix(X_train, X_test, kernel)
array([[0.99656842, 0.91774724, 0.93966202],
       [0.99958227, 0.91468777, 0.91127346],
       [0.89479886, 0.937256  , 0.80459952],
       [0.87448042, 0.96924743, 0.84069076]])

As we can see, for :math:`n` and :math:`m` datapoints in the first and second
dataset respectively, the output matrix has the shape :math:`n\times m`.
