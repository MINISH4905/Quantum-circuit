---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/layers/strongly_entangling.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/layers/strongly_entangling.py
license: Apache-2.0
---

## Module `pennylane/templates/layers/strongly_entangling.py`

Contains the StronglyEntanglingLayers template.

## `StronglyEntanglingLayers`

```python
class StronglyEntanglingLayers(Operation)
```

Layers consisting of single qubit rotations and entanglers, inspired by the circuit-centric classifier design
`arXiv:1804.00633 <https://arxiv.org/abs/1804.00633>`_.

The argument ``weights`` contains the weights for each layer. The number of layers :math:`L` is therefore derived
from the first dimension of ``weights``.

The 2-qubit gates, whose type is specified by the ``imprimitive`` argument,
act chronologically on the :math:`M` wires, :math:`i = 1,...,M`. The second qubit of each gate is given by
:math:`(i+r)\mod M`, where :math:`r` is a  hyperparameter called the *range*, and :math:`0 < r < M`.
If applied to one qubit only, this template will use no imprimitive gates.

This is an example of two 4-qubit strongly entangling layers (ranges :math:`r=1` and :math:`r=2`, respectively) with
rotations :math:`R` and CNOTs as imprimitives:

.. figure:: ../../_static/layer_sec.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

.. note::
    The two-qubit gate used as the imprimitive or entangler must not depend on parameters.

Args:

    weights (tensor_like): weight tensor of shape ``(L, M, 3)``
    wires (Iterable): wires that the template acts on
    ranges (Sequence[int]): sequence determining the range hyperparameter for each subsequent layer; if ``None``
                            using :math:`r=l \mod M` for the :math:`l` th layer and :math:`M` wires.
    imprimitive (type of pennylane.ops.Operation): two-qubit gate to use, defaults to :class:`~pennylane.ops.CNOT`

Example:

    There are multiple arguments that the user can use to customize the layer.

    The required arguments are ``weights`` and ``wires``.

    .. code-block:: python

        dev = qp.device('default.qubit', wires=4)

        @qp.qnode(dev)
        def circuit(parameters):
            qp.StronglyEntanglingLayers(weights=parameters, wires=range(4))
            return qp.expval(qp.Z(0))

        shape = qp.StronglyEntanglingLayers.shape(n_layers=2, n_wires=4)
        rng = np.random.default_rng(12345)
        weights = rng.random(size=shape)

    The shape of the ``weights`` argument decides the number of layers.

    The resulting circuit is:

    >>> print(qp.draw(circuit, level="device")(weights))
    0: ──Rot(0.23,0.32,0.80)─╭●───────╭X──Rot(0.67,0.10,0.44)─╭●────╭X────┤  <Z>
    1: ──Rot(0.68,0.39,0.33)─╰X─╭●────│───Rot(0.89,0.70,0.33)─│──╭●─│──╭X─┤
    2: ──Rot(0.60,0.19,0.67)────╰X─╭●─│───Rot(0.73,0.22,0.08)─╰X─│──╰●─│──┤
    3: ──Rot(0.94,0.25,0.95)───────╰X─╰●──Rot(0.16,0.34,0.47)────╰X────╰●─┤

    The default two-qubit gate used is :class:`~pennylane.ops.CNOT`. This can be changed by using the ``imprimitive`` argument.

    The ``ranges`` argument takes an integer sequence where each element
    determines the range hyperparameter for each layer. This range hyperparameter
    is the difference of the wire indices representing the two qubits the
    ``imprimitive`` gate acts on. For example, for ``range=[2,3]`` the
    first layer will have a range parameter of ``2`` and the second layer will
    have a range parameter of ``3``.
    Assuming ``wires=[0, 1, 2, 3]`` and a range parameter of ``2``, there will be
    an imprimitive gate acting on:

    * qubits ``(0, 2)``;
    * qubits ``(1, 3)``;
    * qubits ``(2, 0)``;
    * qubits ``(3, 1)``.

    .. code-block:: python

        dev = qp.device('default.qubit', wires=4)

        @qp.qnode(dev)
        def circuit(parameters):
            qp.StronglyEntanglingLayers(weights=parameters, wires=range(4), ranges=[2, 3], imprimitive=qp.ops.CZ)
            return qp.expval(qp.Z(0))

        shape = qp.StronglyEntanglingLayers.shape(n_layers=2, n_wires=4)
        rng = np.random.default_rng(12345)
        weights = rng.random(size=shape)

    The resulting circuit is:

    >>> print(qp.draw(circuit, level="device")(weights))
    0: ──Rot(0.23,0.32,0.80)─╭●────╭Z──Rot(0.67,0.10,0.44)──────────────────────╭●─╭Z───────┤  <Z>
    1: ──Rot(0.68,0.39,0.33)─│──╭●─│──╭Z────────────────────Rot(0.89,0.70,0.33)─│──╰●─╭Z────┤
    2: ──Rot(0.60,0.19,0.67)─╰Z─│──╰●─│─────────────────────Rot(0.73,0.22,0.08)─│─────╰●─╭Z─┤
    3: ──Rot(0.94,0.25,0.95)────╰Z────╰●────────────────────Rot(0.16,0.34,0.47)─╰Z───────╰●─┤

.. details::
    :title: Usage Details

    **Parameter shape**

    The expected shape for the weight tensor can be computed with the static method
    :meth:`~.qp.StronglyEntanglingLayers.shape` and used when creating randomly
    initialised weight tensors:

    .. code-block:: python

        shape = qp.StronglyEntanglingLayers.shape(n_layers=2, n_wires=2)
        weights = np.random.random(size=shape)

### `compute_decomposition`

```python
def compute_decomposition(weights, wires, ranges, imprimitive=CNOT)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.StronglyEntanglingLayers.decomposition`.

Args:
    weights (tensor_like): weight tensor
    wires (Any or Iterable[Any]): wires that the operator acts on
    ranges (Sequence[int]): sequence determining the range hyperparameter for each subsequent layer
    imprimitive (pennylane.ops.Operation): two-qubit gate to use

Returns:
    list[.Operator]: decomposition of the operator

**Example**

>>> weights = torch.tensor([[[-0.2, 0.1, -0.4], [1.2, -2., -0.4]]])
>>> ranges = (1,)
>>> ops = qp.StronglyEntanglingLayers.compute_decomposition(weights, wires=["a", "b"], ranges=ranges, imprimitive=qp.CNOT)
>>> from pprint import pprint
>>> pprint(ops)
[Rot(tensor(-0.2000), tensor(0.1000), tensor(-0.4000), wires=['a']),
Rot(tensor(1.2000), tensor(-2.), tensor(-0.4000), wires=['b']),
CNOT(wires=['a', 'b']),
CNOT(wires=['b', 'a'])]

### `shape`

```python
def shape(n_layers, n_wires)
```

Returns the expected shape of the weights tensor.

Args:
    n_layers (int): number of layers
    n_wires (int): number of wires

Returns:
    tuple[int]: shape
