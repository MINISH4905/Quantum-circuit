---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/layers/random.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/layers/random.py
license: Apache-2.0
---

## Module `pennylane/templates/layers/random.py`

Contains the RandomLayers template.

## `RandomLayers`

```python
class RandomLayers(Operation)
```

Layers of randomly chosen single qubit rotations and 2-qubit entangling gates, acting
on randomly chosen qubits.

.. warning::
    This template uses random number generation inside qnodes. Find more
    details about how to invoke the desired random behaviour in the "Usage Details" section below.

The argument ``weights`` contains the weights for each layer. The number of layers :math:`L` is therefore derived
from the first dimension of ``weights``.

The two-qubit gates of type ``imprimitive`` and the rotations are distributed randomly in the circuit.
The number of random rotations is derived from the second dimension of ``weights``. The number of
two-qubit gates is determined by ``ratio_imprim``. For example, a ratio of ``0.3`` with ``30`` rotations
will lead to the use of ``10`` two-qubit gates.

.. note::
    If applied to one qubit only, this template will use no imprimitive gates.

This is an example of two 4-qubit random layers with four Pauli-Y/Pauli-Z rotations :math:`R_y, R_z`,
controlled-Z gates as imprimitives, as well as ``ratio_imprim=0.3``:

.. figure:: ../../_static/layer_rnd.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

Args:
    weights (tensor_like): weight tensor of shape ``(L, k)``,
    wires (Iterable): wires that the template acts on
    ratio_imprim (float): value between 0 and 1 that determines the ratio of imprimitive to rotation gates
    imprimitive (Type[pennylane.ops.Operation]): two-qubit gate to use, defaults to :class:`~pennylane.ops.CNOT`
    rotations (tuple[Type[pennylane.ops.Operation]]): List of Pauli-X, Pauli-Y and/or Pauli-Z gates. The frequency
        determines how often a particular rotation type is used. Defaults to the use of all three
        rotations with equal frequency.
    seed (int): seed to generate random architecture, defaults to 42

.. details::
    :title: Usage Details

    **Default seed**

    ``RandomLayers`` always uses a seed to initialize the construction of a random circuit. This means
    that the template creates the same circuit every time it is called. If no seed is provided, the default
    seed of ``42`` is used.

    .. code-block:: python

        import pennylane as qp
        from pennylane import numpy as pnp

        dev = qp.device("default.qubit", wires=2)
        weights = pnp.array([[0.1, -2.1, 1.4]])

        @qp.qnode(dev)
        def circuit1(weights):
            qp.RandomLayers(weights=weights, wires=range(2))
            return qp.expval(qp.Z(0))

        @qp.qnode(dev)
        def circuit2(weights):
            qp.RandomLayers(weights=weights, wires=range(2))
            return qp.expval(qp.Z(0))

    >>> pnp.allclose(circuit1(weights), circuit2(weights))
    True

    You can verify this by drawing the circuits.

    >>> print(qp.draw(circuit1, level="device")(weights))
    0: ──RY(0.10)──╭●───────────┤  <Z>
    1: ──RX(-2.10)─╰X──RZ(1.40)─┤

    >>> print(qp.draw(circuit2, level="device")(weights))
    0: ──RY(0.10)──╭●───────────┤  <Z>
    1: ──RX(-2.10)─╰X──RZ(1.40)─┤


    **Changing the seed**

    To change the randomly generated circuit architecture, you have to change the seed passed to the template.
    For example, these two calls of ``RandomLayers`` *do not* create the same circuit:

    >>> @qp.qnode(dev)
    ... def circuit(weights, seed=None):
    ...     qp.RandomLayers(weights=weights, wires=range(2), seed=seed)
    ...     return qp.expval(qp.Z(0))
    >>> np.allclose(circuit(weights, seed=9), circuit(weights, seed=12))
    False
    >>> print(qp.draw(circuit, level="device")(weights, seed=9))
    0: ──RZ(0.10)────────────┤  <Z>
    1: ──RZ(-2.10)──RZ(1.40)─┤
    >>> print(qp.draw(circuit, level="device")(weights, seed=12))
    0: ─╭●─╭X──RY(0.10)──RY(-2.10)─┤  <Z>
    1: ─╰X─╰●──RX(1.40)────────────┤


    **Automatic creation of random circuits**

    To automate the process of creating different circuits with ``RandomLayers``,
    you can set ``seed=None`` to avoid specifying a seed. However, in this case care needs
    to be taken. The quantum function is re-evaluated every time it is called.

    .. code-block:: python

        @qp.qnode(dev)
        def circuit_rnd(weights):
            qp.RandomLayers(weights=weights, wires=range(2), seed=None)
            return qp.expval(qp.Z(0))

        first_call = circuit_rnd(weights)
        second_call = circuit_rnd(weights)

    >>> np.allclose(first_call, second_call) # doctest: +SKIP
    False

    **Parameter shape**

    The expected shape for the weight tensor can be computed with the static method
    :meth:`~.RandomLayers.shape` and used when creating randomly
    initialised weight tensors:

    .. code-block:: python

        shape = qp.RandomLayers.shape(n_layers=2, n_rotations=3)
        weights = np.random.random(size=shape)

### `compute_decomposition`

```python
def compute_decomposition(weights, wires, ratio_imprim, imprimitive, rotations, seed)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.RandomLayers.decomposition`.

Args:
    weights (tensor_like): weight tensor
    wires (Any or Iterable[Any]): wires that the operator acts on
    ratio_imprim (float): value between 0 and 1 that determines the ratio of imprimitive to rotation gates
    imprimitive (Type[pennylane.ops.Operation]): two-qubit gate to use
    rotations (list[Type[pennylane.ops.Operation]]): List of Pauli-X, Pauli-Y and/or Pauli-Z gates.
    seed (int): seed to generate random architecture

Returns:
    list[.Operator]: decomposition of the operator

**Example**

>>> weights = torch.tensor([[0.1, -2.1, 1.4]])
>>> rotations=[qp.RY, qp.RX]
>>> ops = qp.RandomLayers.compute_decomposition(weights, wires=["a", "b"], ratio_imprim=0.3,
...                                         imprimitive=qp.CNOT, rotations=rotations, seed=42)
>>> from pprint import pprint
>>> pprint(ops)
[RX(tensor(0.1000), wires=['a']),
RY(tensor(-2.1000), wires=['b']),
CNOT(wires=['a', 'b']),
RX(tensor(1.4000), wires=['b'])]

### `shape`

```python
def shape(n_layers, n_rotations)
```

Returns the expected shape of the weights tensor.

Args:
    n_layers (int): number of layers
    n_rotations (int): number of rotations

Returns:
    tuple[int]: shape
