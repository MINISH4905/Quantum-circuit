---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/gradients/adjoint_metric_tensor.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/gradients/adjoint_metric_tensor.py
license: Apache-2.0
---

## Module `pennylane/gradients/adjoint_metric_tensor.py`

Contains the adjoint_metric_tensor.

## `adjoint_metric_tensor`

```python
def adjoint_metric_tensor(tape: QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Implements the adjoint method outlined in
`Jones <https://arxiv.org/abs/2011.02991>`__ to compute the metric tensor.

A forward pass followed by intermediate partial backwards passes are
used to evaluate the metric tensor in :math:`\mathcal{O}(p^2)` operations,
where :math:`p` is the number of trainable operations, using 4 state
vectors.

.. note::
    The adjoint metric tensor method has the following restrictions:

    * Currently only ``"default.qubit"`` with ``shots=None`` is supported.

    * We assume the circuit to be composed of unitary gates only and rely
      on the ``generator`` property of the gates to be implemented.
      Note also that this makes the metric tensor strictly real-valued.

Args:
    tape (QNode or QuantumTape): Circuit to compute the metric tensor of

Returns:
    qnode (QNode) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`. Executing this circuit
    will provide the metric tensor in the form of a tensor. Dimensions are ``(tape.num_params, tape.num_params)``.

.. seealso:: :func:`~.metric_tensor` for hardware-compatible metric tensor computations.

**Example**

Consider the following QNode:

.. code-block:: python

    dev = qp.device("default.qubit", wires=3)

    @qp.qnode(dev, interface="autograd")
    def circuit(weights):
        qp.RX(weights[0], wires=0)
        qp.RY(weights[1], wires=0)
        qp.CNOT(wires=[0, 1])
        qp.RZ(weights[2], wires=1)
        qp.RZ(weights[3], wires=0)
        return qp.expval(qp.Z(0) @ qp.Z(1)), qp.expval(qp.Y(1))

We can use the ``adjoint_metric_tensor`` transform to generate a new function
that returns the metric tensor of this QNode:

>>> mt_fn = qp.adjoint_metric_tensor(circuit)
>>> weights = np.array([0.1, 0.2, 0.4, 0.5], requires_grad=True)
>>> mt_fn(weights)
tensor([[ 0.25  ,  0.    , -0.0497, -0.0497],
        [ 0.    ,  0.2475,  0.0243,  0.0243],
        [-0.0497,  0.0243,  0.0123,  0.0123],
        [-0.0497,  0.0243,  0.0123,  0.0123]], requires_grad=True)

This approach has the benefit of being significantly faster than the hardware-ready
``metric_tensor`` function:

>>> import time
>>> start_time = time.process_time()
>>> mt = mt_fn(weights)
>>> time.process_time() - start_time
0.019
>>> mt_fn_2 = qp.metric_tensor(circuit)
>>> start_time = time.process_time()
>>> mt = mt_fn_2(weights)
>>> time.process_time() - start_time
0.025

This speedup becomes more drastic for larger circuits.
The drawback of the adjoint method is that it is only available on simulators and without
shot simulations.
