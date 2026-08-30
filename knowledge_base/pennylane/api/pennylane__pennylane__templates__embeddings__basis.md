---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/embeddings/basis.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/embeddings/basis.py
license: Apache-2.0
---

## Module `pennylane/templates/embeddings/basis.py`

Contains the BasisEmbedding template.

## `BasisEmbedding`

```python
class BasisEmbedding(BasisState)
```

Encodes :math:`n` binary features into a basis state of :math:`n` qubits.

For example, for ``features=np.array([0, 1, 0])`` or ``features=2`` (binary 010), the
quantum system will be prepared in state :math:`|010 \rangle`.

.. warning::

    ``BasisEmbedding`` calls a circuit whose architecture depends on the binary features.
    The ``features`` argument is therefore not differentiable when using the template, and
    gradients with respect to the argument cannot be computed by PennyLane.

Args:
    features (tensor_like or int): Binary input of shape ``(len(wires), )`` or integer
        that represents the binary input.
    wires (Any or Iterable[Any]): the wire(s) that the template acts on

Example:

    Basis embedding encodes the binary feature vector into a basis state.

    .. code-block:: python

        dev = qp.device('reference.qubit', wires=3)

        @qp.qnode(dev)
        def circuit(feature_vector):
            qp.BasisEmbedding(features=feature_vector, wires=range(3))
            return qp.state()

        X = [1,1,1]

    The resulting circuit is:

    >>> print(qp.draw(circuit, level="device")(X))
    0: ──X─┤ ╭State
    1: ──X─┤ ├State
    2: ──X─┤ ╰State

    And, the output state is:

    >>> print(circuit(X))
        [0.+0.j 0.+0.j 0.+0.j 0.+0.j 0.+0.j 0.+0.j 0.+0.j 1.+0.j]

    Thus, ``[1,1,1]`` is mapped to :math:`|111 \rangle`.
