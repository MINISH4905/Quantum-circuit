---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/tensornetworks/mera.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/tensornetworks/mera.py
license: Apache-2.0
---

## Module `pennylane/templates/tensornetworks/mera.py`

Contains the MERA template.

## `compute_indices`

```python
def compute_indices(wires, n_block_wires)
```

Generate a list containing the wires for each block.

Args:
    wires (Iterable): wires that the template acts on
    n_block_wires (int): number of wires per block

Returns:
    layers (array): array of wire labels for each block

## `MERA`

```python
class MERA(Operation)
```

The MERA template broadcasts an input circuit across many wires following the
architecture of a multi-scale entanglement renormalization ansatz tensor network.
This architecture can be found in `arXiv:quant-ph/0610099 <https://arxiv.org/abs/quant-ph/0610099>`_
and closely resembles `quantum convolutional neural networks <https://arxiv.org/abs/1810.03787>`_.

The argument ``block`` is a user-defined quantum circuit. Each ``block`` may depend on a different set of parameters.
These are passed as a list by the ``template_weights`` argument.

For more details, see *Usage Details* below.

Args:
    wires (Iterable): wires that the template acts on
    n_block_wires (int): number of wires per block
    block (Callable): quantum circuit that defines a block
    n_params_block (int): the number of parameters in a block
    template_weights (Sequence): list containing the weights for all blocks

.. details::
    :title: Usage Details

    In general, the block takes D parameters and **must** have the following signature:

    .. code-block::

        unitary(parameter1, parameter2, ... parameterD, wires)

    For a block with multiple parameters, ``n_params_block`` is equal to the number of parameters in ``block``.
    For a block with a single parameter, ``n_params_block`` is equal to the length of the parameter array.

    To avoid using ragged arrays, all block parameters should have the same dimension.

    The length of the ``template_weights`` argument should match the number of blocks.
    The expected number of blocks can be obtained from ``qp.MERA.get_n_blocks(wires, n_block_wires)``.

    This example demonstrates the use of ``MERA`` for a simple block.

    .. code-block:: python

        import pennylane as qp
        import numpy as np

        def block(weights, wires):
            qp.CNOT(wires=[wires[0],wires[1]])
            qp.RY(weights[0], wires=wires[0])
            qp.RY(weights[1], wires=wires[1])

        n_wires = 4
        n_block_wires = 2
        n_params_block = 2
        n_blocks = qp.MERA.get_n_blocks(range(n_wires),n_block_wires)
        template_weights = [[0.1,-0.3]]*n_blocks

        dev= qp.device('default.qubit',wires=range(n_wires))
        @qp.qnode(dev)
        def circuit(template_weights):
            qp.MERA(range(n_wires),n_block_wires,block, n_params_block, template_weights)
            return qp.expval(qp.Z(1))

    It may be necessary to reorder the wires to see the MERA architecture clearly:

    >>> print(qp.draw(circuit, level='device', wire_order=[2,0,1,3])(template_weights))
    2: ───────────────╭●──RY(0.10)──╭X──RY(-0.30)───────────────┤
    0: ─╭X──RY(-0.30)─│─────────────╰●──RY(0.10)──╭●──RY(0.10)──┤
    1: ─╰●──RY(0.10)──│─────────────╭X──RY(-0.30)─╰X──RY(-0.30)─┤  <Z>
    3: ───────────────╰X──RY(-0.30)─╰●──RY(0.10)────────────────┤

### `compute_decomposition`

```python
def compute_decomposition(weights, wires, block, ind_gates)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.MERA.decomposition`.

Args:
    weights (list[tensor_like]): list containing the weights for all blocks
    wires (Iterable): wires that the template acts on
    block (Callable): quantum circuit that defines a block
    ind_gates (array): array of wire indices

Returns:
    list[.Operator]: decomposition of the operator

### `get_n_blocks`

```python
def get_n_blocks(wires, n_block_wires)
```

Returns the expected number of blocks for a set of wires and number of wires per block.
Args:
    wires (Sequence): number of wires the template acts on
    n_block_wires (int): number of wires per block
Returns:
    n_blocks (int): number of blocks; expected length of the template_weights argument
