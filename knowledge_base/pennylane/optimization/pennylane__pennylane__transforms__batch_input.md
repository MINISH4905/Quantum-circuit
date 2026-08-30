---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/batch_input.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/batch_input.py
license: Apache-2.0
---

## Module `pennylane/transforms/batch_input.py`

Batch transformation for multiple (non-trainable) input examples following issue #2037

## `batch_input`

```python
def batch_input(tape: QuantumScript, argnum: Sequence[int] | int) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Transform a circuit to support an initial batch dimension for gate inputs.

In a classical ML application one needs to batch the non-trainable inputs of the network.
This function executes the same analogue for a quantum circuit:
separate circuit executions are created for each input, which are then executed
with the *same* trainable parameters.

The batch dimension is assumed to be the first rank of the
non trainable tensor object. For a rank 1 feature space, the shape needs to be ``(Nt, x)``
where ``x`` indicates the dimension of the features and ``Nt`` being the number of examples
within a batch.
Based on `arXiv:2202.10471 <https://arxiv.org/abs/2202.10471>`__.

Args:
    tape (QNode or QuantumTape or Callable): Input quantum circuit to batch
    argnum (Sequence[int] or int): One or several index values indicating the position of the
        non-trainable batched parameters in the quantum tape.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`. Executing this circuit
    will provide the batched results.

.. seealso:: :func:`~.batch_params`

**Example**

.. code-block:: python

    dev = qp.device("default.qubit", wires=2)

    @qp.batch_input(argnum=1)
    @qp.qnode(dev, diff_method="parameter-shift")
    def circuit(inputs, weights):
        qp.RY(weights[0], wires=0)
        qp.AngleEmbedding(inputs, wires=range(2), rotation="Y")
        qp.RY(weights[1], wires=1)
        return qp.expval(qp.Z(1))

>>> rng = np.random.default_rng(seed=1234)
>>> x = rng.random((10, 2))
>>> w = rng.random((2, ))
>>> circuit(x, w) # doctest: +SKIP
array([0.4855, 0.5854, 0.6954, 0.5384, 0.5838, 0.2737, 0.0233, 0.2253,
       0.6166, 0.0167])
