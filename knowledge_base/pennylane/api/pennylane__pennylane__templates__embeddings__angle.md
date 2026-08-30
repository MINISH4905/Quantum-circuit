---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/embeddings/angle.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/embeddings/angle.py
license: Apache-2.0
---

## Module `pennylane/templates/embeddings/angle.py`

Contains the ``AngleEmbedding`` template.

## `AngleEmbedding`

```python
class AngleEmbedding(Operation)
```

Encodes :math:`N` features into the rotation angles of :math:`n` qubits, where :math:`N \leq n`.

The rotations can be chosen as either :class:`~pennylane.ops.RX`, :class:`~pennylane.ops.RY`
or :class:`~pennylane.ops.RZ` gates, as defined by the ``rotation`` parameter:

* ``rotation='X'`` uses the features as angles of RX rotations

* ``rotation='Y'`` uses the features as angles of RY rotations

* ``rotation='Z'`` uses the features as angles of RZ rotations

The length of ``features`` has to be smaller or equal to the number of qubits. If there are fewer entries in
``features`` than rotations, the circuit does not apply the remaining rotation gates.

Args:
    features (tensor_like): input tensor of shape ``(N,)``, where N is the number of input features to embed,
        with :math:`N\leq n`
    wires (Any or Iterable[Any]): wires that the template acts on
    rotation (str): type of rotations used
    id (str): custom label given to an operator instance,
        can be useful for some applications where the instance has to be identified.

Example:

    Angle embedding encodes the features by using the specified rotation operation.

    .. code-block:: python

        dev = qp.device('default.qubit', wires=3)

        @qp.qnode(dev)
        def circuit(feature_vector):
            qp.AngleEmbedding(features=feature_vector, wires=range(3), rotation='Z')
            qp.Hadamard(0)
            return qp.probs(wires=range(3))

        X = [1,2,3]

    Here, we have also used rotation angles :class:`RZ`. If not specified, :class:`RX` is used as default.
    The resulting circuit is:

    >>> print(qp.draw(circuit, level="device")(X))
    0: ──RZ(1.00)──H─┤ ╭Probs
    1: ──RZ(2.00)────┤ ├Probs
    2: ──RZ(3.00)────┤ ╰Probs

### `compute_decomposition`

```python
def compute_decomposition(features, wires, rotation)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.AngleEmbedding.decomposition`.

Args:
    features (tensor_like): input tensor of dimension ``(len(wires),)``
    wires (Any or Iterable[Any]): wires that the operator acts on
    rotation (.Operator): rotation gate class

Returns:
    list[.Operator]: decomposition of the operator

**Example**

>>> features = torch.tensor([1., 2.])
>>> qp.AngleEmbedding.compute_decomposition(features, wires=["a", "b"], rotation=qp.RX)
[RX(tensor(1.), wires=['a']),
 RX(tensor(2.), wires=['b'])]
