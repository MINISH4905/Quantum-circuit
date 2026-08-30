---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/gradients/fisher.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/gradients/fisher.py
license: Apache-2.0
---

## Module `pennylane/gradients/fisher.py`

Contains functions for computing classical and quantum fisher information matrices.

## `classical_fisher`

```python
def classical_fisher(qnode, argnums=0)
```

Returns a function that computes the classical fisher information matrix (CFIM) of a given :class:`.QNode` or
quantum tape.

Given a parametrized (classical) probability distribution :math:`p(\bm{\theta})`, the classical fisher information
matrix quantifies how changes to the parameters :math:`\bm{\theta}` are reflected in the probability distribution.
For a parametrized quantum state, we apply the concept of classical fisher information to the computational
basis measurement.
More explicitly, this function implements eq. (15) in `arxiv:2103.15191 <https://arxiv.org/abs/2103.15191>`_:

.. math::

    \text{CFIM}_{i, j} = \sum_{\ell=0}^{2^N-1} \frac{1}{p_\ell(\bm{\theta})} \frac{\partial p_\ell(\bm{\theta})}{
    \partial \theta_i} \frac{\partial p_\ell(\bm{\theta})}{\partial \theta_j}

for :math:`N` qubits.

Args:
    tape (:class:`.QNode` or qp.QuantumTape): A :class:`.QNode` or quantum tape that may have arbitrary return types.
    argnums (Optional[int or List[int]]): Arguments to be differentiated in case interface ``jax`` is used.

Returns:
    func: The function that computes the classical fisher information matrix. This function accepts the same
    signature as the :class:`.QNode`. If the signature contains one differentiable variable ``params``, the function
    returns a matrix of size ``(len(params), len(params))``. For multiple differentiable arguments ``x, y, z``,
    it returns a list of sizes ``[(len(x), len(x)), (len(y), len(y)), (len(z), len(z))]``.


.. seealso:: :func:`~.pennylane.metric_tensor`, :func:`~.pennylane.gradient.transforms.quantum_fisher`

**Example**

First, let us define a parametrized quantum state and return its (classical) probability distribution for all
computational basis elements:

.. code-block:: python

    import pennylane.numpy as np

    dev = qp.device("default.qubit")

    @qp.qnode(dev)
    def circ(params):
        qp.RX(params[0], wires=0)
        qp.CNOT([0, 1])
        qp.CRY(params[1], wires=[1, 0])
        qp.Hadamard(1)
        return qp.probs(wires=[0, 1])

Executing this circuit yields the ``2**2=4`` elements of :math:`p_\ell(\bm{\theta})`

>>> np.random.seed(25)
>>> params = np.random.random(2)
>>> circ(params)
tensor([0.41850088, 0.41850088, 0.08149912, 0.08149912], requires_grad=True)

We can obtain its ``(2, 2)`` classical fisher information matrix (CFIM) by simply calling the function returned
by ``classical_fisher()``:

>>> cfim_func = qp.gradients.classical_fisher(circ)
>>> cfim_func(params)
tensor([[ 0.90156094, -0.12555804],
        [-0.12555804,  0.01748614]], requires_grad=True)

This function has the same signature as the :class:`.QNode`. Here is a small example with multiple arguments:

.. code-block:: python

    @qp.qnode(dev)
    def circ(x, y):
        qp.RX(x, wires=0)
        qp.RY(y, wires=0)
        return qp.probs(wires=range(1))

>>> x, y = np.array([0.5, 0.6], requires_grad=True)
>>> circ(x, y)
tensor([0.86215007, 0.13784993], requires_grad=True)
>>> qp.gradients.classical_fisher(circ)(x, y)
[tensor([[0.32934729]], requires_grad=True),
tensor([[0.51650396]], requires_grad=True)]

Note how in the case of multiple variables we get a list of matrices with sizes
``[(n_params0, n_params0), (n_params1, n_params1)]``, which in this case is simply two ``(1, 1)`` matrices.


A typical setting where the classical fisher information matrix is used is in variational quantum algorithms.
Closely related to the `quantum natural gradient <https://arxiv.org/abs/1909.02108>`_, which employs the
`quantum` fisher information matrix, we can compute a rescaled gradient using the CFIM. In this scenario,
typically a Hamiltonian objective function :math:`\langle H \rangle` is minimized:

.. code-block:: python

    H = qp.Hamiltonian(coeffs=[0.5, 0.5], observables=[qp.Z(0), qp.Z(1)])

    @qp.qnode(dev)
    def circ(params):
        qp.RX(params[0], wires=0)
        qp.RY(params[1], wires=0)
        qp.RX(params[2], wires=1)
        qp.RY(params[3], wires=1)
        qp.CNOT(wires=(0,1))
        return qp.expval(H)

    params = np.random.random(4)

We can compute both the gradient of :math:`\langle H \rangle` and the CFIM with the same :class:`.QNode` ``circ``
in this example since ``classical_fisher()`` ignores the return types and assumes ``qp.probs()`` for all wires.

>>> grad = qp.grad(circ)(params)
>>> cfim = qp.gradients.classical_fisher(circ)(params)
>>> print(grad.shape, cfim.shape)
(4,) (4, 4)

Combined together, we can get a rescaled gradient to be employed for optimization schemes like natural gradient
descent.

>>> rescaled_grad = cfim @ grad
>>> print(rescaled_grad)
[-0.66772533 -0.16618756 -0.05865127 -0.06696078]

The ``classical_fisher`` matrix itself is again differentiable:

.. code-block:: python

    @qp.qnode(dev)
    def circ(params):
        qp.RX(qp.math.cos(params[0]), wires=0)
        qp.RX(qp.math.cos(params[0]), wires=1)
        qp.RX(qp.math.cos(params[1]), wires=0)
        qp.RX(qp.math.cos(params[1]), wires=1)
        return qp.probs(wires=range(2))

    params = np.random.random(2)

>>> qp.gradients.classical_fisher(circ)(params)
tensor([[0.86929514, 0.76134441],
        [0.76134441, 0.6667992 ]], requires_grad=True)
>>> qp.jacobian(qp.gradients.classical_fisher(circ))(params)
array([[[ 1.98284265e+00, -1.60461922e-16],
        [ 8.68304725e-01,  1.07654307e+00]],
       [[ 8.68304725e-01,  1.07654307e+00],
        [ 7.30752264e-17,  1.88571178e+00]]])

## `quantum_fisher`

```python
def quantum_fisher(tape: QuantumScript, device, *args, **kwargs) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Returns a function that computes the quantum fisher information matrix (QFIM) of a given :class:`.QNode`.

Given a parametrized quantum state :math:`|\psi(\bm{\theta})\rangle`, the quantum fisher information matrix (QFIM) quantifies how changes to the parameters :math:`\bm{\theta}`
are reflected in the quantum state. The metric used to induce the QFIM is the fidelity :math:`f = |\langle \psi | \psi' \rangle|^2` between two (pure) quantum states.
This leads to the following definition of the QFIM (see eq. (27) in `arxiv:2103.15191 <https://arxiv.org/abs/2103.15191>`_):

.. math::

    \text{QFIM}_{i, j} = 4 \text{Re}\left[ \langle \partial_i \psi(\bm{\theta}) | \partial_j \psi(\bm{\theta}) \rangle
    - \langle \partial_i \psi(\bm{\theta}) | \psi(\bm{\theta}) \rangle \langle \psi(\bm{\theta}) | \partial_j \psi(\bm{\theta}) \rangle \right]

with short notation :math:`| \partial_j \psi(\bm{\theta}) \rangle := \frac{\partial}{\partial \theta_j}| \psi(\bm{\theta}) \rangle`.

.. seealso::
    :func:`~.pennylane.metric_tensor`, :func:`~.pennylane.adjoint_metric_tensor`, :func:`~.pennylane.gradient.transforms.classical_fisher`

Args:
    tape (QNode or QuantumTape or Callable): A quantum circuit that may have arbitrary return types.
    *args: In case finite shots are used, further arguments according to :func:`~.pennylane.metric_tensor` may be passed.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`. Executing this circuit
    will provide the quantum Fisher information in the form of a tensor.

.. note::

    ``quantum_fisher`` coincides with the ``metric_tensor`` with a prefactor of :math:`4`.
    Internally, :func:`~.pennylane.adjoint_metric_tensor` is used when executing on ``"default.qubit"``
    with exact expectations (``shots=None``). In all other cases, e.g. if a device with finite shots
    is used, the hardware-compatible transform :func:`~.pennylane.metric_tensor` is used, which
    may require an additional wire on the device.
    Please refer to the respective documentations for details.

**Example**

The quantum Fisher information matrix (QIFM) can be used to compute the `natural` gradient for `Quantum Natural Gradient Descent <https://arxiv.org/abs/1909.02108>`_.
A typical scenario is optimizing the expectation value of a Hamiltonian:

.. code-block:: python

    from pennylane import numpy as np

    n_wires = 2

    dev = qp.device("default.qubit", wires=n_wires)

    H = 1.*qp.X(0) @ qp.X(1) - 0.5 * qp.Z(1)

    @qp.qnode(dev)
    def circ(params):
        qp.RY(params[0], wires=1)
        qp.CNOT(wires=(1,0))
        qp.RY(params[1], wires=1)
        qp.RZ(params[2], wires=1)
        return qp.expval(H)

    params = np.array([0.5, 1., 0.2], requires_grad=True)

The natural gradient is then simply the QFIM multiplied by the gradient:

>>> grad = qp.grad(circ)(params)
>>> grad
array([ 0.59422561, -0.02615095, -0.05146226])
>>> qfim = qp.gradients.quantum_fisher(circ)(params)
>>> qfim
tensor([[1.        , 0.        , 0.        ],
        [0.        , 1.        , 0.        ],
        [0.        , 0.        , 0.77517241]], requires_grad=True)
>>> qfim @ grad
tensor([ 0.59422561, -0.02615095, -0.03989212], requires_grad=True)

When using real hardware or finite shots, ``quantum_fisher`` is internally calling :func:`~.pennylane.metric_tensor`.
To obtain the full QFIM, we need an auxilary wire to perform the Hadamard test.

>>> dev = qp.device("default.qubit", wires=n_wires+1)
>>> @qp.set_shots(shots=1000)
... @qp.qnode(dev)
... def circ(params):
...     qp.RY(params[0], wires=1)
...     qp.CNOT(wires=(1,0))
...     qp.RY(params[1], wires=1)
...     qp.RZ(params[2], wires=1)
...     return qp.expval(H)
>>> qfim = qp.gradients.quantum_fisher(circ)(params)

Alternatively, we can fall back on the block-diagonal QFIM without the additional wire.

>>> qfim = qp.gradients.quantum_fisher(circ, approx="block-diag")(params)

## `qnode_execution_wrapper`

```python
def qnode_execution_wrapper(self, qnode, targs, tkwargs)
```

Here, we overwrite the QNode execution wrapper in order
to take into account that classical processing may be present
inside the QNode.
