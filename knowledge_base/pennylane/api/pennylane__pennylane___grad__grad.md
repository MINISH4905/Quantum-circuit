---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/_grad/grad.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/_grad/grad.py
license: Apache-2.0
---

## Module `pennylane/_grad/grad.py`

This submodule contains the autograd wrappers :class:`grad` and :func:`jacobian`

## `grad`

```python
class grad
```

Returns the gradient as a callable function of hybrid quantum-classical functions.
:func:`~.qjit` and Autograd compatible.

By default, gradients are computed for arguments which contain
the property ``requires_grad=True``. Alternatively, the ``argnums`` keyword argument
can be specified to compute gradients for function arguments without this property,
such as scalars, lists, tuples, dicts, or vanilla NumPy arrays. Setting
``argnums`` to the index of an argument with ``requires_grad=False`` will raise
a ``NonDifferentiableError``.

When the output gradient function is executed, both the forward pass
*and* the backward pass will be performed in order to compute the gradient.
The value of the forward pass is available via the :attr:`~.forward` property.

.. warning::
    ``grad`` is intended to be used with the Autograd and Catalyst.

.. note::

    When used with :func:`~.qjit`, this function currently only supports the
    Catalyst compiler. See :func:`catalyst.grad` for more details.

    Please see the Catalyst :doc:`quickstart guide <catalyst:dev/quick_start>`,
    as well as the :doc:`sharp bits and debugging tips <catalyst:dev/sharp_bits>`
    page for an overview of the differences between Catalyst and PennyLane.

Args:
    func (function): a plain QNode, or a Python function that contains
        a combination of quantum and classical nodes

    argnums (int, list(int), None): Which argument(s) to take the gradient
        with respect to. By default, the arguments themselves are used
        to determine differentiability, by examining the ``requires_grad``
        property.

    method (str): Specifies the gradient method when used with the :func:`~.qjit`
        decorator. Outside of :func:`~.qjit`, this keyword argument
        has no effect and should not be set. In just-in-time (JIT) mode,
        this can be any of ``["auto", "fd"]``, where:

        - ``"auto"`` represents deferring the quantum differentiation to the method
          specified by the QNode, while the classical computation is differentiated
          using traditional auto-diff. Catalyst supports ``"parameter-shift"`` and
          ``"adjoint"`` on internal QNodes. QNodes with ``diff_method="finite-diff"``
          are not supported with ``"auto"``.

        - ``"fd"`` represents first-order finite-differences for the entire hybrid
          function.

    h (float): The step-size value for the finite-difference (``"fd"``) method within
        :func:`~.qjit` decorated functions. This value has
        no effect in non-compiled functions.

Returns:
    function: The function that returns the gradient of the input
    function with respect to the differentiable arguments, or, if specified,
    the arguments in ``argnums``.

### `forward`

```python
def forward(self)
```

float: The result of the forward pass calculated while performing
backpropagation. Will return ``None`` if the backpropagation has not yet
been performed.

## `jacobian`

```python
class jacobian
```

Returns the Jacobian as a callable function of vector-valued (functions of) QNodes.
This function is compatible with Autograd and :func:`~.qjit`.

.. note::

    When used with :func:`~.qjit`, this function currently only supports the
    Catalyst compiler. See :func:`catalyst.jacobian` for more details.

    Please see the Catalyst :doc:`quickstart guide <catalyst:dev/quick_start>`,
    as well as the :doc:`sharp bits and debugging tips <catalyst:dev/sharp_bits>`
    page for an overview of the differences between Catalyst and PennyLane.


Args:
    func (function): A vector-valued Python function or QNode that contains
        a combination of quantum and classical nodes. The output of the computation
        must consist of a single NumPy array (if classical) or a tuple of
        expectation values (if a quantum node)

    argnums (int or Sequence[int]): Which argument to take the gradient
        with respect to. If a sequence is given, the Jacobian corresponding
        to all marked inputs and all output elements is returned.

    method (str): Specifies the gradient method when used with the :func:`~.qjit`
        decorator. Outside of :func:`~.qjit`, this keyword argument
        has no effect and should not be set. In just-in-time (JIT) mode,
        this can be any of ``["auto", "fd"]``, where:

        - ``"auto"`` represents deferring the quantum differentiation to the method
          specified by the QNode, while the classical computation is differentiated
          using traditional auto-diff. Catalyst supports ``"parameter-shift"`` and
          ``"adjoint"`` on internal QNodes. QNodes with ``diff_method="finite-diff"``
          are not supported with ``"auto"``.

        - ``"fd"`` represents first-order finite-differences for the entire hybrid
          function.

    h (float): The step-size value for the finite-difference (``"fd"``) method within
        :func:`~.qjit` decorated functions. This value has no effect in non-compiled
        functions.

Returns:
    function: the function that returns the Jacobian of the input function with respect to the
    arguments in argnums

.. note::

    Due to a limitation in Autograd, this function can only differentiate built-in scalar
    or NumPy array arguments.

For ``argnums=None``, the trainable arguments are inferred dynamically from the arguments
passed to the function. The returned function takes the same arguments as the original
function and outputs a ``tuple``. The ``i``-th entry of the ``tuple`` has shape
``(*output shape, *shape of args[argnums[i]])``.

If a single trainable argument is inferred, or if a single integer
is provided as ``argnums``, the tuple is unpacked and its only entry is returned instead.

**Example**

Consider the QNode

.. code-block:: python

    import pennylane as qp
    from pennylane import numpy as np

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit(weights):
        qp.RX(weights[0, 0, 0], wires=0)
        qp.RY(weights[0, 0, 1], wires=1)
        qp.RZ(weights[1, 0, 2], wires=0)
        return qp.probs()

    weights = np.array([[[0.2, 0.9, -1.4]], [[0.5, 0.2, 0.1]]], requires_grad=True)

It has a single array-valued QNode argument with shape ``(2, 1, 3)`` and outputs
the probability of each 2-wire basis state, of which there are ``2**num_wires`` = 4.
Therefore, the Jacobian of this QNode will be a single array with shape ``(4, 2, 1, 3)``:

>>> qp.jacobian(circuit)(weights).shape
(4, 2, 1, 3)

On the other hand, consider the following QNode for the same circuit
structure:

.. code-block:: python

    @qp.qnode(dev)
    def circuit(x, y, z):
        qp.RX(x, wires=0)
        qp.RY(y, wires=1)
        qp.RZ(z, wires=0)
        return qp.probs()

    x = np.array(0.2, requires_grad=True)
    y = np.array(0.9, requires_grad=True)
    z = np.array(-1.4, requires_grad=True)

It has three scalar QNode arguments and outputs the probability for each of
the 4 basis states. Consequently, its Jacobian will be a three-tuple of
arrays with the shape ``(4,)``:

>>> jac = qp.jacobian(circuit)(x, y, z)
>>> type(jac)
<class 'tuple'>
>>> for sub_jac in jac:
...     print(sub_jac.shape)
(4,)
(4,)
(4,)

For a more advanced setting of QNode arguments, consider the QNode

.. code-block:: python

    dev = qp.device("default.qubit", wires=3)

    @qp.qnode(dev)
    def circuit(x, y):
        qp.RX(x[0], wires=0)
        qp.RY(y[0, 3], wires=1)
        qp.RX(x[1], wires=2)
        return qp.probs()

    x = np.array([0.1, 0.5], requires_grad=True)
    y = np.array([[-0.3, 1.2, 0.1, 0.9], [-0.2, -3.1, 0.5, -0.7]], requires_grad=True)

If we do not provide ``argnums``, ``qp.jacobian`` will correctly identify both,
``x`` and ``y``, as trainable function arguments:

>>> jac = qp.jacobian(circuit)(x, y)
>>> print(type(jac), len(jac))
<class 'tuple'> 2
>>> qp.math.shape(jac[0])
(8, 2)
>>> qp.math.shape(jac[1])
(8, 2, 4)

As we can see, there are two entries in the output, one Jacobian for each
QNode argument. The shape ``(8, 2)`` of the first Jacobian is the combination
of the QNode output shape (``(8,)``) and the shape of ``x`` (``(2,)``).
Similarly, the shape ``(2, 4)`` of ``y`` leads to a Jacobian shape ``(8, 2, 4)``.

Instead, we may choose the output to contain only one of the two
entries by providing an iterable as ``argnums``:

>>> jac = qp.jacobian(circuit, argnums=[1])(x, y)
>>> print(type(jac), len(jac))
<class 'tuple'> 1
>>> qp.math.shape(jac)
(1, 8, 2, 4)

Here we included the size of the tuple in the shape analysis, corresponding to the
first dimension of size ``1``.

Finally, we may want to receive the single entry above directly, not as a tuple
with a single entry. This is done by providing a single integer as ``argnums``

>>> jac = qp.jacobian(circuit, argnums=1)(x, y)
>>> print(type(jac), len(jac))
<class 'numpy.ndarray'> 8
>>> qp.math.shape(jac)
(8, 2, 4)

As expected, the tuple was unpacked and we directly received the Jacobian of the
QNode with respect to ``y``.

We can also compute the Jacobian transformation inside a :func:`~.qjit` decorated program:

.. code-block:: python

    dev = qp.device("lightning.qubit", wires=1)

    @qp.qjit
    def workflow(x):
        @qp.qnode(dev)
        def circuit(x):
            qp.RX(np.pi * x[0], wires=0)
            qp.RY(x[1], wires=0)
            return qp.probs()

        g = qp.jacobian(circuit)
        return g(x)

>>> workflow(np.array([2.0, 1.0]))
Array([[ 3.48786850e-16, -4.20735492e-01],
       [-8.71967125e-17,  4.20735492e-01]], dtype=float64)

You can further compute the Jacobian transformation using other supported differentiation
methods by :func:`catalyst.jacobian`.

.. code-block:: python

    @qp.qjit
    def workflow(x):
        @qp.qnode(dev)
        def circuit(x):
            qp.RX(np.pi * x[0], wires=0)
            qp.RY(x[1], wires=0)
            return qp.probs()

        g = qp.jacobian(circuit, method="fd", h=0.3)
        return g(x)

>>> workflow(np.array([2.0, 1.0]))
Array([[-0.37120096, -0.45467246],
       [ 0.37120096,  0.45467246]], dtype=float64)
