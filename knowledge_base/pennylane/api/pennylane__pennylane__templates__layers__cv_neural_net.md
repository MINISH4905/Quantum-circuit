---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/layers/cv_neural_net.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/layers/cv_neural_net.py
license: Apache-2.0
---

## Module `pennylane/templates/layers/cv_neural_net.py`

Contains the CVNeuralNetLayers template.

## `CVNeuralNetLayers`

```python
class CVNeuralNetLayers(Operation)
```

A sequence of layers of a continuous-variable quantum neural network,
as specified in `Killoran et al. (2019) <https://doi.org/10.1103/PhysRevResearch.1.033063>`_.

The layer consists
of interferometers, displacement and squeezing gates mimicking the linear transformation of
a neural network in the x-basis of the quantum system, and uses a Kerr gate
to introduce a 'quantum' non-linearity.

The layers act on the :math:`M` modes given in ``wires``,
and include interferometers of :math:`K=M(M-1)/2` beamsplitters. The different weight parameters
contain the weights for each layer. The number of layers :math:`L` is therefore derived
from the first dimension of ``weights``.

This example shows a 4-mode CVNeuralNet layer with squeezing gates :math:`S`, displacement gates :math:`D` and
Kerr gates :math:`K`. The two big blocks are interferometers of type
:mod:`pennylane.Interferometer`:

.. figure:: ../../_static/layer_cvqnn.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

.. note::
   The CV neural network architecture includes :class:`~pennylane.ops.Kerr` operations.
   Make sure to use a suitable device, such as the :code:`strawberryfields.fock`
   device of the `PennyLane-SF <https://github.com/XanaduAI/pennylane-sf>`_ plugin.

Args:
    theta_1 (tensor_like): shape :math:`(L, K)` tensor of transmittivity angles for first interferometer
    phi_1 (tensor_like): shape :math:`(L, K)` tensor of phase angles for first interferometer
    varphi_1 (tensor_like): shape :math:`(L, M)` tensor of rotation angles to apply after first interferometer
    r (tensor_like): shape :math:`(L, M)` tensor of squeezing amounts for :class:`~pennylane.ops.Squeezing` operations
    phi_r (tensor_like): shape :math:`(L, M)` tensor of squeezing angles for :class:`~pennylane.ops.Squeezing` operations
    theta_2 (tensor_like): shape :math:`(L, K)` tensor of transmittivity angles for second interferometer
    phi_2 (tensor_like): shape :math:`(L, K)` tensor of phase angles for second interferometer
    varphi_2 (tensor_like): shape :math:`(L, M)` tensor of rotation angles to apply after second interferometer
    a (tensor_like): shape :math:`(L, M)` tensor of displacement magnitudes for :class:`~pennylane.ops.Displacement` operations
    phi_a (tensor_like): shape :math:`(L, M)` tensor of displacement angles for :class:`~pennylane.ops.Displacement` operations
    k (tensor_like): shape :math:`(L, M)` tensor of kerr parameters for :class:`~pennylane.ops.Kerr` operations
    wires (Iterable): wires that the template acts on

.. details::
    :title: Usage Details

    **Parameter shapes**

    A list of shapes for the 11 input parameter tensors can be computed by the static method
    :meth:`~.CVNeuralNetLayers.shape` and used when creating randomly
    initialised weights:

    .. code-block:: python

        shapes = CVNeuralNetLayers.shape(n_layers=2, n_wires=2)
        weights = [np.random.random(shape) for shape in shapes]

        def circuit():
          CVNeuralNetLayers(*weights, wires=[0, 1])
          return qp.expval(qp.QuadX(0))

### `compute_decomposition`

```python
def compute_decomposition(theta_1, phi_1, varphi_1, r, phi_r, theta_2, phi_2, varphi_2, a, phi_a, k, wires)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.CVNeuralNetLayers.decomposition`.

Args:

    theta_1 (tensor_like): shape :math:`(L, K)` tensor of transmittivity angles for first interferometer
    phi_1 (tensor_like): shape :math:`(L, K)` tensor of phase angles for first interferometer
    varphi_1 (tensor_like): shape :math:`(L, M)` tensor of rotation angles to apply after first interferometer
    r (tensor_like): shape :math:`(L, M)` tensor of squeezing amounts for :class:`~pennylane.ops.Squeezing` operations
    phi_r (tensor_like): shape :math:`(L, M)` tensor of squeezing angles for :class:`~pennylane.ops.Squeezing` operations
    theta_2 (tensor_like): shape :math:`(L, K)` tensor of transmittivity angles for second interferometer
    phi_2 (tensor_like): shape :math:`(L, K)` tensor of phase angles for second interferometer
    varphi_2 (tensor_like): shape :math:`(L, M)` tensor of rotation angles to apply after second interferometer
    a (tensor_like): shape :math:`(L, M)` tensor of displacement magnitudes for :class:`~pennylane.ops.Displacement` operations
    phi_a (tensor_like): shape :math:`(L, M)` tensor of displacement angles for :class:`~pennylane.ops.Displacement` operations
    k (tensor_like): shape :math:`(L, M)` tensor of kerr parameters for :class:`~pennylane.ops.Kerr` operations
    wires (Any or Iterable[Any]): wires that the operator acts on

Returns:
    list[.Operator]: decomposition of the operator

**Example**

>>> theta_1 = torch.tensor([[0.4]])
>>> phi_1 = torch.tensor([[-0.3]])
>>> varphi_1 = torch.tensor([[1.7, 0.1]])
>>> r = torch.tensor([[-1., -0.2]])
>>> phi_r = torch.tensor([[0.2, -0.2]])
>>> theta_2 = torch.tensor([[1.4]])
>>> phi_2 = torch.tensor([[-0.4]])
>>> varphi_2 = torch.tensor([[0.1, 0.2]])
>>> a = torch.tensor([[0.1, 0.2]])
>>> phi_a = torch.tensor([[-1.1, 0.2]])
>>> k = torch.tensor([[0.1, 0.2]])
>>> qp.CVNeuralNetLayers.compute_decomposition(theta_1, phi_1, varphi_1, r, phi_r, theta_2,
...                                             phi_2, varphi_2, a, phi_a, k, wires=["a", "b"])
[Interferometer(tensor([0.4000]), tensor([-0.3000]), tensor([1.7000, 0.1000]), wires=['a', 'b']),
Squeezing(tensor(-1.), tensor(0.2000), wires=['a']),
Squeezing(tensor(-0.2000), tensor(-0.2000), wires=['b']),
Interferometer(tensor([1.4000]), tensor([-0.4000]), tensor([0.1000, 0.2000]), wires=['a', 'b']),
Displacement(tensor(0.1000), tensor(-1.1000), wires=['a']),
Displacement(tensor(0.2000), tensor(0.2000), wires=['b']),
Kerr(tensor(0.1000), wires=['a']),
Kerr(tensor(0.2000), wires=['b'])]

### `shape`

```python
def shape(n_layers, n_wires)
```

Returns a list of shapes for the 11 parameter tensors.

Args:
    n_layers (int): number of layers
    n_wires (int): number of wires

Returns:
    list[tuple[int]]: list of shapes
