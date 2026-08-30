---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/layers/basic_entangler.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/layers/basic_entangler.py
license: Apache-2.0
---

## Module `pennylane/templates/layers/basic_entangler.py`

Contains the BasicEntanglerLayers template.

## `BasicEntanglerLayers`

```python
class BasicEntanglerLayers(Operation)
```

Layers consisting of one-parameter single-qubit rotations on each qubit, followed by a closed chain
or *ring* of CNOT gates.

The ring of CNOT gates connects every qubit with its neighbour,
with the last qubit being considered as a neighbour to the first qubit.

.. figure:: ../../_static/templates/layers/basic_entangler.png
    :align: center
    :width: 40%
    :target: javascript:void(0);

The number of layers :math:`L` is determined by the first dimension of the argument ``weights``.
When using a single wire, the template only applies the single
qubit gates in each layer.

.. note::

    This template follows the convention of dropping the entanglement between the last and the first
    qubit when using only two wires, so the entangler is not repeated on the same wires.
    In this case, only one CNOT gate is applied in each layer:

    .. figure:: ../../_static/templates/layers/basic_entangler_2wires.png
        :align: center
        :width: 30%
        :target: javascript:void(0);

Args:
    weights (tensor_like): Weight tensor of shape ``(L, len(wires))``. Each weight is used as a parameter
        for the rotation.
    wires (Iterable): wires that the template acts on
    rotation (Type[pennylane.operation.Operation]): one-parameter single-qubit gate to use,
        if ``None``, :class:`~pennylane.ops.RX` is used as default

Raises:
    ValueError: if inputs do not have the correct format

.. details::
    :title: Usage Details

    The template is used inside a qnode:

    .. code-block:: python

        import pennylane as qp
        from math import pi

        n_wires = 3
        dev = qp.device('default.qubit', wires=n_wires)

        @qp.qnode(dev)
        def circuit(weights):
            qp.BasicEntanglerLayers(weights=weights, wires=range(n_wires))
            return [qp.expval(qp.Z(i)) for i in range(n_wires)]

    >>> circuit([[pi, pi, pi]])
    [np.float64(1.0), np.float64(1.0), np.float64(-1.0)]

    **Parameter shape**

    The shape of the weights argument can be computed by the static method
    :meth:`~.BasicEntanglerLayers.shape` and used when creating randomly
    initialised weight tensors:

    .. code-block:: python

        shape = qp.BasicEntanglerLayers.shape(n_layers=2, n_wires=2)
        weights = np.random.random(size=shape)

    **No periodic boundary for two wires**

    When using two wires, the convention is to drop the periodic boundary condition.
    This means that the connection from the second to the first wire is omitted.

    .. code-block:: python

        n_wires = 2
        dev = qp.device('default.qubit', wires=n_wires)

        @qp.qnode(dev)
        def circuit(weights):
            qp.BasicEntanglerLayers(weights=weights, wires=range(n_wires))
            return [qp.expval(qp.Z(i)) for i in range(n_wires)]

    >>> circuit([[pi, pi]])
    [np.float64(-1.0), np.float64(1.0)]


    **Changing the rotation gate**

    Any single-qubit gate can be used as a rotation gate, as long as it only takes a single parameter. The default is the ``RX`` gate.

    .. code-block:: python

        @qp.qnode(dev)
        def circuit(weights):
            qp.BasicEntanglerLayers(weights=weights, wires=range(n_wires), rotation=qp.RZ)
            return [qp.expval(qp.Z(i)) for i in range(n_wires)]

    Accidentally using a gate that expects more parameters throws a
    ``ValueError: Wrong number of parameters``.

### `compute_decomposition`

```python
def compute_decomposition(weights, wires, rotation)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.BasicEntanglerLayers.decomposition`.

Args:
    weights (tensor_like): Weight tensor of shape ``(L, len(wires))``. Each weight is used as a parameter
        for the rotation.
    wires (Any or Iterable[Any]): wires that the operator acts on
    rotation (Type[pennylane.ops.Operation]): one-parameter single-qubit gate to use

Returns:
    list[.Operator]: decomposition of the operator

**Example**

>>> weights = torch.tensor([[1.2, -0.4], [0.3, -0.2]])
>>> qp.BasicEntanglerLayers.compute_decomposition(weights, wires=["a", "b"], rotation=qp.RX)
[RX(tensor(1.2000), wires=['a']), RX(tensor(-0.4000), wires=['b']),
CNOT(wires=['a', 'b']),
RX(tensor(0.3000), wires=['a']), RX(tensor(-0.2000), wires=['b']),
CNOT(wires=['a', 'b'])]

### `shape`

```python
def shape(n_layers, n_wires)
```

Returns the shape of the weight tensor required for this template.

Args:
    n_layers (int): number of layers
    n_wires (int): number of qubits

Returns:
    tuple[int]: shape
