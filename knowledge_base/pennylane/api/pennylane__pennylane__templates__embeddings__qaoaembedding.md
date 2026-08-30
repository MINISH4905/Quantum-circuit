---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/embeddings/qaoaembedding.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/embeddings/qaoaembedding.py
license: Apache-2.0
---

## Module `pennylane/templates/embeddings/qaoaembedding.py`

Contains the QAOAEmbedding template.

## `QAOAEmbedding`

```python
class QAOAEmbedding(Operation)
```

Encodes :math:`N` features into :math:`n>N` qubits, using a layered, trainable quantum
circuit that is inspired by the QAOA ansatz proposed by `Killoran et al. (2020) <https://arxiv.org/abs/2001.03622>`_.

A single layer applies two circuits or "Hamiltonians": The first encodes the features, and the second is
a variational ansatz inspired by a 1-dimensional Ising model. The feature-encoding circuit associates features with
the angles of :class:`RX` rotations. The Ising ansatz consists of trainable two-qubit ZZ interactions
:math:`e^{-i \frac{\alpha}{2} \sigma_z \otimes \sigma_z}` (in PennyLane represented by the :class:`~.MultiRZ` gate),
and trainable local fields :math:`e^{-i \frac{\beta}{2} \sigma_{\mu}}`, where :math:`\sigma_{\mu}`
can be chosen to be :math:`\sigma_{x}`, :math:`\sigma_{y}` or :math:`\sigma_{z}`
(default choice is :math:`\sigma_{y}` or the ``RY`` gate), and :math:`\alpha, \beta` are adjustable gate parameters.

The number of features has to be smaller or equal to the number of qubits. If there are fewer features than
qubits, the feature-encoding rotation is replaced by a Hadamard gate.

The argument ``weights`` contains an array of the :math:`\alpha, \beta` parameters for each layer.
The number of layers :math:`L` is derived from the first dimension of ``weights``, which has the following
shape:

* :math:`(L, 1)`, if the embedding acts on a single wire,
* :math:`(L, 3)`, if the embedding acts on two wires,
* :math:`(L, 2n)` else.

After the :math:`L` th layer, another set of feature-encoding :class:`RX` gates is applied.

This is an example for the full embedding circuit using 2 layers, 3 features, 4 wires, and ``RY`` local fields:

|

.. figure:: ../../_static/qaoa_layers.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

|

.. note::
    ``QAOAEmbedding`` supports gradient computations with respect to both the ``features`` and the ``weights``
    arguments. Note that trainable parameters need to be passed to the quantum node as positional arguments.

Args:
    features (tensor_like): tensor of features to encode
    weights (tensor_like): tensor of weights
    wires (Iterable): wires that the template acts on
    local_field (str, type): type of local field used, either one of ``'X'``, ``'Y'``, or ``'Z'`` or
        :class:`~.RX`, :class:`~.RY`, or :class:`~.RZ`.

Raises:
    ValueError: if inputs do not have the correct format

.. details::
    :title: Usage Details

    The QAOA embedding encodes an :math:`n`-dimensional feature vector into at most :math:`n` qubits. The
    embedding applies layers of a circuit, and each layer is defined by a set of weight parameters.

    .. code-block:: python

        import pennylane as qp

        dev = qp.device('default.qubit', wires=2)

        @qp.qnode(dev)
        def circuit(weights, f=None):
            qp.QAOAEmbedding(features=f, weights=weights, wires=range(2))
            return qp.expval(qp.Z(0))

        features = [1., 2.]
        layer1 = [0.1, -0.3, 1.5]
        layer2 = [3.1, 0.2, -2.8]
        weights = [layer1, layer2]

        print(circuit(weights, f=features))

    **Parameter shape**

    The shape of the weights argument can be computed by the static method
    :meth:`~.QAOAEmbedding.shape` and used when creating randomly
    initialised weight tensors:

    .. code-block:: python

        shape = qp.QAOAEmbedding.shape(n_layers=2, n_wires=2)
        weights = np.random.random(shape)

    **Training the embedding**

    The embedding is typically trained with respect to a given cost. For example, one can train it to
    minimize the PauliZ expectation of the first qubit:

    .. code-block:: python

        opt = qp.GradientDescentOptimizer()
        for i in range(10):
            weights = opt.step(lambda w : circuit(w, f=features), weights)
            print("Step ", i, " weights = ", weights)


    **Training the features**

    In principle, also the features are trainable, which means that gradients with respect to feature values
    can be computed. To train both weights and features, they need to be passed to the qnode as
    positional arguments. If the built-in optimizer is used, they have to be merged to one input:

    .. code-block:: python

        @qp.qnode(dev)
        def circuit2(weights, features):
            qp.QAOAEmbedding(features=features, weights=weights, wires=range(2))
            return qp.expval(qp.Z(0))


        features = qp.numpy.array([1., 2.])
        weights = qp.numpy.array([[0.1, -0.3, 1.5], [3.1, 0.2, -2.8]])

        opt = qp.GradientDescentOptimizer()
        for i in range(10):
            weights, features = opt.step(circuit2, weights, features)
            print("Step ", i, "\n weights = ", weights, "\n features = ", features,"\n")

    **Local Fields**

    While by default, ``RY`` gates are used as local fields, one may also choose ``local_field='Z'`` or
    ``local_field='X'`` as hyperparameters of the embedding.

    .. code-block:: python

        @qp.qnode(dev)
        def circuit(weights, f=None):
            qp.QAOAEmbedding(features=f, weights=weights, wires=range(2), local_field='Z')
            return qp.expval(qp.Z(0))

    Choosing ``'Z'`` fields implements a QAOAEmbedding where the second Hamiltonian is a
    1-dimensional Ising model.

### `compute_decomposition`

```python
def compute_decomposition(features, weights, wires, local_field)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.QAOAEmbedding.decomposition`.

Args:
    features (tensor_like): tensor of features to encode
    weights (tensor_like): tensor of weights
    wires (Any or Iterable[Any]): wires that the template acts on
    local_field (type): type of :class:`~.Operator` for local field gate

Returns:
    list[.Operator]: decomposition of the operator

**Example**

>>> features = torch.tensor([1., 2.])
>>> weights = torch.tensor([[0.1, -0.3, 1.3], [0.9, -0.2, -2.1]])
>>> qp.QAOAEmbedding.compute_decomposition(features, weights, wires=["a", "b"], local_field=qp.RY)
[RX(tensor(1.), wires=['a']), RX(tensor(2.), wires=['b']),
MultiRZ(tensor(0.1000), wires=['a', 'b']), RY(tensor(-0.3000), wires=['a']), RY(tensor(1.3000), wires=['b']),
RX(tensor(1.), wires=['a']), RX(tensor(2.), wires=['b']),
MultiRZ(tensor(0.9000), wires=['a', 'b']), RY(tensor(-0.2000), wires=['a']), RY(tensor(-2.1000), wires=['b']),
RX(tensor(1.), wires=['a']), RX(tensor(2.), wires=['b'])]

### `shape`

```python
def shape(n_layers, n_wires, n_broadcast=None)
```

Returns the shape of the weight tensor required for this template.

Args:
    n_layers (int): number of layers
    n_wires (int): number of qubits

Returns:
    tuple[int]: shape
