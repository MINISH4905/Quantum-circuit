---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/gradients/vjp.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/gradients/vjp.py
license: Apache-2.0
---

## Module `pennylane/gradients/vjp.py`

This module contains functions for computing the vector-Jacobian product
of tapes.

## `compute_vjp_single`

```python
def compute_vjp_single(dy, jac, num=None)
```

Convenience function to compute the vector-Jacobian product for a given
vector of gradient outputs and a Jacobian for a single measurement tape.

Args:
    dy (tensor_like): vector of gradient outputs
    jac (tensor_like, tuple): Jacobian matrix
    num (int): The length of the flattened ``dy`` argument. This is an
        optional argument, but can be useful to provide if ``dy`` potentially
        has no shape (for example, due to tracing or just-in-time compilation).

Returns:
    tensor_like: the vector-Jacobian product

**Examples**

1. For a single parameter and a single measurement without shape (e.g. expval, var):

.. code-block:: pycon

    >>> jac = np.array(0.1)
    >>> dy = np.array(2)
    >>> compute_vjp_single(dy, jac)
    array([0.2])

2. For a single parameter and a single measurement with shape (e.g. probs):

.. code-block:: pycon

    >>> jac = np.array([0.1, 0.2])
    >>> dy = np.array([1.0, 1.0])
    >>> compute_vjp_single(dy, jac)
    array([0.3])


3. For multiple parameters (in this case 2 parameters) and a single measurement without shape (e.g. expval, var):

.. code-block:: pycon

    >>> jac = tuple([np.array(0.1), np.array(0.2)])
    >>> dy = np.array(2)
    >>> compute_vjp_single(dy, jac)
    array([0.2, 0.4])

4. For multiple parameters (in this case 2 parameters) and a single measurement with shape (e.g. probs):

.. code-block:: pycon

    >>> jac = tuple([np.array([0.1, 0.2]), np.array([0.3, 0.4])])
    >>> dy = np.array([1.0, 2.0])
    >>> compute_vjp_single(dy, jac)
    array([0.5, 1.1])

## `compute_vjp_multi`

```python
def compute_vjp_multi(dy, jac, num=None)
```

Convenience function to compute the vector-Jacobian product for a given
vector of gradient outputs and a Jacobian for a tape with multiple measurements.

Args:
    dy (tensor_like): vector of gradient outputs
    jac (tensor_like, tuple): Jacobian matrix
    num (int): The length of the flattened ``dy`` argument. This is an
        optional argument, but can be useful to provide if ``dy`` potentially
        has no shape (for example, due to tracing or just-in-time compilation).

Returns:
    tensor_like: the vector-Jacobian product

**Examples**

1. For a single parameter and multiple measurement (one without shape and one with shape, e.g. expval and probs):

.. code-block:: pycon

    >>> jac = tuple([np.array(0.1), np.array([0.3, 0.4])])
    >>> dy = tuple([np.array(1.0), np.array([1.0, 2.0])])
    >>> compute_vjp_multi(dy, jac)
    array([1.2])

2. For multiple parameters (in this case 2 parameters) and multiple measurement (one without shape and one with
shape, e.g. expval and probs):

.. code-block:: pycon

    >>> jac = ((np.array(0.1), np.array(0.2)), (np.array([0.3, 0.4]), np.array([0.5, 0.6])))
    >>> dy = tuple([np.array(1.0), np.array([1.0, 2.0])])
    >>> compute_vjp_multi(dy, jac)
    array([1.2, 1.9])

## `vjp`

```python
def vjp(tape, dy, gradient_fn, gradient_kwargs=None)
```

Generate the gradient tapes and processing function required to compute
the vector-Jacobian products of a tape.

Consider a function :math:`\mathbf{f}(\mathbf{x})`. The Jacobian is given by

.. math::

    \mathbf{J}_{\mathbf{f}}(\mathbf{x}) = \begin{pmatrix}
        \frac{\partial f_1}{\partial x_1} &\cdots &\frac{\partial f_1}{\partial x_n}\\
        \vdots &\ddots &\vdots\\
        \frac{\partial f_m}{\partial x_1} &\cdots &\frac{\partial f_m}{\partial x_n}\\
    \end{pmatrix}.

During backpropagation, the chain rule is applied. For example, consider the
cost function :math:`h = y\circ f: \mathbb{R}^n \rightarrow \mathbb{R}`,
where :math:`y: \mathbb{R}^m \rightarrow \mathbb{R}`.
The gradient is:

.. math::

    \nabla h(\mathbf{x}) = \frac{\partial y}{\partial \mathbf{f}} \frac{\partial \mathbf{f}}{\partial \mathbf{x}}
    = \frac{\partial y}{\partial \mathbf{f}} \mathbf{J}_{\mathbf{f}}(\mathbf{x}).

Denote :math:`d\mathbf{y} = \frac{\partial y}{\partial \mathbf{f}}`; we can write this in the form
of a matrix multiplication:

.. math:: \left[\nabla h(\mathbf{x})\right]_{j} = \sum_{i=0}^m d\mathbf{y}_i ~ \mathbf{J}_{ij}.

Thus, we can see that the gradient of the cost function is given by the so-called
**vector-Jacobian product**; the product of the row-vector :math:`d\mathbf{y}`, representing
the gradient of subsequent components of the cost function, and :math:`\mathbf{J}`,
the Jacobian of the current node of interest.

Args:
    tape (.QuantumTape): quantum tape to differentiate
    dy (tensor_like): Gradient-output vector. Must have shape
        matching the output shape of the corresponding tape.
    gradient_fn (callable): the gradient transform to use to differentiate
        the tape
    gradient_kwargs (dict): dictionary of keyword arguments to pass when
        determining the gradients of tapes

Returns:
    tensor_like or None: Vector-Jacobian product. Returns None if the tape
    has no trainable parameters.

**Example**

Consider the following quantum tape with PyTorch parameters:

.. code-block:: python

    import torch

    x = torch.tensor([[0.1, 0.2, 0.3],
                      [0.4, 0.5, 0.6]], requires_grad=True, dtype=torch.float64)

    ops = [
        qp.RX(x[0, 0], wires=0),
        qp.RY(x[0, 1], wires=1),
        qp.RZ(x[0, 2], wires=0),
        qp.CNOT(wires=[0, 1]),
        qp.RX(x[1, 0], wires=1),
        qp.RY(x[1, 1], wires=0),
        qp.RZ(x[1, 2], wires=1)
    ]
    measurements = [qp.expval(qp.Z(0)), qp.probs(wires=1)]
    tape = qp.tape.QuantumTape(ops, measurements)

We can use the ``vjp`` function to compute the vector-Jacobian product,
given a gradient-output vector ``dy``:

>>> dy = torch.tensor([1., 1., 1.], dtype=torch.float64)
>>> vjp_tapes, fn = qp.gradients.vjp(tape, dy, qp.gradients.param_shift)

Note that ``dy`` has shape ``(3,)``, matching the output dimension of the tape
(1 expectation and 2 probability values).

Executing the VJP tapes, and applying the processing function:

>>> dev = qp.device("default.qubit")
>>> vjp = fn(qp.execute(vjp_tapes, dev, diff_method=qp.gradients.param_shift, interface="torch"))
>>> vjp
tensor([-1.1562e-01, -1.3862e-02, -9.0841e-03, -1.5214e-16, -4.8217e-01,
         2.1329e-17], dtype=torch.float64, grad_fn=<SumBackward1>)

The output VJP is also differentiable with respect to the tape parameters:

>>> cost = torch.sum(vjp)
>>> cost.backward()
>>> x.grad
tensor([[-1.1025e+00, -2.0554e-01, -1.4917e-01],
        [-1.2490e-16, -9.1580e-01,  0.0000e+00]], dtype=torch.float64)

## `batch_vjp`

```python
def batch_vjp(tapes, dys, gradient_fn, reduction='append', gradient_kwargs=None)
```

Generate the gradient tapes and processing function required to compute
the vector-Jacobian products of a batch of tapes.

Consider a function :math:`\mathbf{f}(\mathbf{x})`. The Jacobian is given by

.. math::

    \mathbf{J}_{\mathbf{f}}(\mathbf{x}) = \begin{pmatrix}
        \frac{\partial f_1}{\partial x_1} &\cdots &\frac{\partial f_1}{\partial x_n}\\
        \vdots &\ddots &\vdots\\
        \frac{\partial f_m}{\partial x_1} &\cdots &\frac{\partial f_m}{\partial x_n}\\
    \end{pmatrix}.

During backpropagation, the chain rule is applied. For example, consider the
cost function :math:`h = y\circ f: \mathbb{R}^n \rightarrow \mathbb{R}`,
where :math:`y: \mathbb{R}^m \rightarrow \mathbb{R}`.
The gradient is:

.. math::

    \nabla h(\mathbf{x}) = \frac{\partial y}{\partial \mathbf{f}} \frac{\partial \mathbf{f}}{\partial \mathbf{x}}
    = \frac{\partial y}{\partial \mathbf{f}} \mathbf{J}_{\mathbf{f}}(\mathbf{x}).

Denote :math:`d\mathbf{y} = \frac{\partial y}{\partial \mathbf{f}}`; we can write this in the form
of a matrix multiplication:

.. math:: \left[\nabla h(\mathbf{x})\right]_{j} = \sum_{i=0}^m d\mathbf{y}_i ~ \mathbf{J}_{ij}.

Thus, we can see that the gradient of the cost function is given by the so-called
**vector-Jacobian product**; the product of the row-vector :math:`d\mathbf{y}`, representing
the gradient of subsequent components of the cost function, and :math:`\mathbf{J}`,
the Jacobian of the current node of interest.

Args:
    tapes (Sequence[.QuantumTape]): sequence of quantum tapes to differentiate
    dys (Sequence[tensor_like]): Sequence of gradient-output vectors ``dy``. Must be the
        same length as ``tapes``. Each ``dy`` tensor should have shape
        matching the output shape of the corresponding tape.
    gradient_fn (callable): the gradient transform to use to differentiate
        the tapes
    reduction (str): Determines how the vector-Jacobian products are returned.
        If ``append``, then the output of the function will be of the form
        ``List[tensor_like]``, with each element corresponding to the VJP of each
        input tape. If ``extend``, then the output VJPs will be concatenated.
    gradient_kwargs (dict): dictionary of keyword arguments to pass when
        determining the gradients of tapes

Returns:
    List[tensor_like or None]: list of vector-Jacobian products. ``None`` elements corresponds
    to tapes with no trainable parameters.

**Example**

Consider the following Torch-compatible quantum tapes:

.. code-block:: python

    import torch

    x = torch.tensor([[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]], requires_grad=True, dtype=torch.float64)

    ops = [
        qp.RX(x[0, 0], wires=0),
        qp.RY(x[0, 1], wires=1),
        qp.RZ(x[0, 2], wires=0),
        qp.CNOT(wires=[0, 1]),
        qp.RX(x[1, 0], wires=1),
        qp.RY(x[1, 1], wires=0),
        qp.RZ(x[1, 2], wires=1)
    ]
    measurements1 = [qp.expval(qp.Z(0)), qp.probs(wires=1)]
    tape1 = qp.tape.QuantumTape(ops, measurements1)

    measurements2 = [qp.expval(qp.Z(0) @ qp.Z(1))]
    tape2 = qp.tape.QuantumTape(ops, measurements2)

    tapes = [tape1, tape2]

Both tapes share the same circuit ansatz, but have different measurement outputs.

We can use the ``batch_vjp`` function to compute the vector-Jacobian product,
given a list of gradient-output vectors ``dys`` per tape:

>>> dys = [torch.tensor([1., 1., 1.], dtype=torch.float64),
...        torch.tensor([1.], dtype=torch.float64)]
>>> vjp_tapes, fn = qp.gradients.batch_vjp(tapes, dys, qp.gradients.param_shift)

Note that each ``dy`` has shape matching the output dimension of the tape
(``tape1`` has 1 expectation and 2 probability values --- 3 outputs --- and ``tape2``
has 1 expectation value).

Executing the VJP tapes, and applying the processing function:

>>> dev = qp.device("default.qubit")
>>> vjps = fn(qp.execute(vjp_tapes, dev, diff_method=qp.gradients.param_shift, interface="torch"))
>>> vjps
[tensor([-1.1562e-01, -1.3862e-02, -9.0841e-03, -1.5214e-16, -4.8217e-01,
      2.1329e-17], dtype=torch.float64, grad_fn=<SumBackward1>),
 tensor([ 1.7393e-01, -1.6412e-01, -5.3983e-03, -2.9366e-01, -4.0083e-01,
          2.1134e-17], dtype=torch.float64, grad_fn=<SqueezeBackward3>)]

We have two VJPs; one per tape. Each one corresponds to the number of parameters
on the tapes (6).

The output VJPs are also differentiable with respect to the tape parameters:

>>> cost = torch.sum(vjps[0] + vjps[1])
>>> cost.backward()
>>> x.grad
tensor([[-0.4792, -0.9086, -0.2420],
        [-0.0930, -1.0772,  0.0000]], dtype=torch.float64)
