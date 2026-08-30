---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/tensornetworks/mps.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/tensornetworks/mps.py
license: Apache-2.0
---

## Module `pennylane/templates/tensornetworks/mps.py`

Contains the MPS template.

## `compute_indices_MPS`

```python
def compute_indices_MPS(wires, n_block_wires, offset=None)
```

Generate a list containing the wires for each block.

Args:
    wires (Iterable): wires that the template acts on
    n_block_wires (int): number of wires per block_gen
    offset (int): offset value for positioning the subsequent blocks relative to each other.
        If ``None``, it defaults to :math:`\text{offset} = \lfloor \text{n_block_wires}/2  \rfloor`,
        otherwise :math:`\text{offset} \in [1, \text{n_block_wires} - 1]`.

Returns:
    layers (Tuple[Tuple]]): array of wire indices or wire labels for each block

## `MPS`

```python
class MPS(Operation)
```

The MPS template broadcasts an input circuit across many wires following the architecture of a Matrix Product State tensor network.
The result is similar to the architecture in `arXiv:1803.11537 <https://arxiv.org/abs/1803.11537>`_.

The keyword argument ``block`` is a user-defined quantum circuit that should accept two arguments: ``wires`` and ``weights``.
The latter argument is optional in case the implementation of ``block`` doesn't require any weights. Any additional arguments
should be provided using the ``kwargs``.

Args:
    wires (Iterable): wires that the template acts on
    n_block_wires (int): number of wires per block
    block (Callable): quantum circuit that defines a block
    n_params_block (int): the number of parameters in a block; equal to the length of the ``weights`` argument in ``block``
    template_weights (Sequence): list containing the weights for all blocks
    offset (int): offset value for positioning the subsequent blocks relative to each other.
        If ``None``, it defaults to :math:`\text{offset} = \lfloor \text{n_block_wires}/2  \rfloor`,
        otherwise :math:`\text{offset} \in [1, \text{n_block_wires} - 1]`
    **kwargs: additional keyword arguments for implementing the ``block``

.. note::

    The expected number of blocks can be obtained from ``qp.MPS.get_n_blocks(wires, n_block_wires, offset=0)``, and
    the length of ``template_weights`` argument should match the number of blocks. Whenever either ``n_block_wires``
    is odd or ``offset`` is not :math:`\lfloor \text{n_block_wires}/2  \rfloor`, the template deviates from the maximally
    unbalanced tree architecture described in `arXiv:1803.11537 <https://arxiv.org/abs/1803.11537>`_.

.. details::
    :title: Usage Details

    This example demonstrates the use of ``MPS`` for a simple block.

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
        n_blocks = qp.MPS.get_n_blocks(range(n_wires),n_block_wires)
        template_weights = [[0.1, -0.3]] * n_blocks

        dev= qp.device('default.qubit',wires=range(n_wires))
        @qp.qnode(dev)
        def circuit(template_weights):
            qp.MPS(range(n_wires),n_block_wires,block, n_params_block, template_weights)
            return qp.expval(qp.Z(n_wires-1))

    >>> print(qp.draw(circuit, level='device')(template_weights))
    0: ─╭●──RY(0.10)──────────────────────────────┤
    1: ─╰X──RY(-0.30)─╭●──RY(0.10)────────────────┤
    2: ───────────────╰X──RY(-0.30)─╭●──RY(0.10)──┤
    3: ─────────────────────────────╰X──RY(-0.30)─┤  <Z>

    MPS can also be used with an ``offset`` argument that shifts the positioning the subsequent blocks from the default ``n_block_wires/2``.

    .. code-block:: python

        import pennylane as qp
        import numpy as np

        def block(wires):
            qp.MultiControlledX(wires=[wires[i] for i in range(len(wires))])

        n_wires = 8
        n_block_wires = 4
        n_params_block = 2

        dev= qp.device('default.qubit',wires=n_wires)
        @qp.qnode(dev)
        def circuit():
            qp.MPS(range(n_wires),n_block_wires, block, n_params_block, offset = 1)
            return qp.state()

    >>> print(qp.draw(circuit, level='device')())
        0: ─╭●─────────────┤ ╭State
        1: ─├●─╭●──────────┤ ├State
        2: ─├●─├●─╭●───────┤ ├State
        3: ─╰X─├●─├●─╭●────┤ ├State
        4: ────╰X─├●─├●─╭●─┤ ├State
        5: ───────╰X─├●─├●─┤ ├State
        6: ──────────╰X─├●─┤ ├State
        7: ─────────────╰X─┤ ╰State

### `num_params`

```python
def num_params(self)
```

int: Number of trainable parameters that the operator depends on.

### `compute_decomposition`

```python
def compute_decomposition(weights=None, wires=None, ind_gates=None, block=None, **kwargs)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.MPS.decomposition`.

Args:
    weights (list[tensor_like]): list containing the weights for all blocks
    wires (Iterable): wires that the template acts on
    block (Callable): quantum circuit that defines a block
    ind_gates (array): array of wire indices
    **kwargs: additional keyword arguments for implementing the ``block``

Returns:
    list[.Operator]: decomposition of the operator

### `get_n_blocks`

```python
def get_n_blocks(wires, n_block_wires, offset=None)
```

Returns the expected number of blocks for a set of wires and number of wires per block.

Args:
    wires (Sequence): number of wires the template acts on
    n_block_wires (int): number of wires per block
    offset (int): offset value for positioning the subsequent blocks relative to each other.
        If ``None``, it defaults to :math:`\text{offset} = \lfloor \text{n_block_wires}/2  \rfloor`,
        otherwise :math:`\text{offset} \in [1, \text{n_block_wires} - 1]`.

Returns:
    n_blocks (int): number of blocks; expected length of the template_weights argument
