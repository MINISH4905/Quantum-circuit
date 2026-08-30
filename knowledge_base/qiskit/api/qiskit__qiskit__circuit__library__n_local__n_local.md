---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/n_local/n_local.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/n_local/n_local.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/n_local/n_local.py`

The n-local circuit class.

## `n_local`

```python
def n_local(num_qubits: int, rotation_blocks: str | Gate | Iterable[str | Gate], entanglement_blocks: str | Gate | Iterable[str | Gate], entanglement: BlockEntanglement | Iterable[BlockEntanglement] | Callable[[int], BlockEntanglement | Iterable[BlockEntanglement]]='full', reps: int=3, insert_barriers: bool=False, parameter_prefix: str='θ', overwrite_block_parameters: bool=True, skip_final_rotation_layer: bool=False, skip_unentangled_qubits: bool=False, name: str | None='nlocal') -> QuantumCircuit
```

Construct an n-local variational circuit.

The structure of the n-local circuit are alternating rotation and entanglement layers.
In both layers, parameterized circuit-blocks act on the circuit in a defined way.
In the rotation layer, the blocks are applied stacked on top of each other, while in the
entanglement layer according to the ``entanglement`` strategy.
The circuit blocks can have arbitrary sizes (smaller equal to the number of qubits in the
circuit). Each layer is repeated ``reps`` times, and by default a final rotation layer is
appended.

For instance, a rotation block on 2 qubits and an entanglement block on 4 qubits using
``"linear"`` entanglement yields the following circuit.

.. parsed-literal::

    ┌──────┐ ░ ┌──────┐                      ░ ┌──────┐
    ┤0     ├─░─┤0     ├──────────────── ... ─░─┤0     ├
    │  Rot │ ░ │      │┌──────┐              ░ │  Rot │
    ┤1     ├─░─┤1     ├┤0     ├──────── ... ─░─┤1     ├
    ├──────┤ ░ │  Ent ││      │┌──────┐      ░ ├──────┤
    ┤0     ├─░─┤2     ├┤1     ├┤0     ├ ... ─░─┤0     ├
    │  Rot │ ░ │      ││  Ent ││      │      ░ │  Rot │
    ┤1     ├─░─┤3     ├┤2     ├┤1     ├ ... ─░─┤1     ├
    ├──────┤ ░ └──────┘│      ││  Ent │      ░ ├──────┤
    ┤0     ├─░─────────┤3     ├┤2     ├ ... ─░─┤0     ├
    │  Rot │ ░         └──────┘│      │      ░ │  Rot │
    ┤1     ├─░─────────────────┤3     ├ ... ─░─┤1     ├
    └──────┘ ░                 └──────┘      ░ └──────┘

    |                                 |
    +---------------------------------+
           repeated reps times

Entanglement:

The entanglement describes the connections of the gates in the entanglement layer.
For a two-qubit gate for example, the entanglement contains pairs of qubits on which the
gate should acts, e.g. ``[[ctrl0, target0], [ctrl1, target1], ...]``.
A set of default entanglement strategies is provided and can be selected by name:

* ``"full"`` entanglement is where each qubit is entangled with all the others.
* ``"linear"`` entanglement is qubit :math:`i` entangled with qubit :math:`i + 1`,
    for all :math:`i \in \{0, 1, ... , n - 2\}`, where :math:`n` is the total number of qubits.
* ``"reverse_linear"`` entanglement is qubit :math:`i` entangled with qubit :math:`i + 1`,
    for all :math:`i \in \{n-2, n-3, ... , 1, 0\}`, where :math:`n` is the total number of qubits.
    Note that if ``entanglement_blocks=="cx"`` then this option provides the same unitary as
    ``"full"`` with fewer entangling gates.
* ``"pairwise"`` entanglement is one layer where qubit :math:`i` is entangled with qubit
    :math:`i + 1`, for all even values of :math:`i`, and then a second layer where qubit :math:`i`
    is entangled with qubit :math:`i + 1`, for all odd values of :math:`i`.
* ``"circular"`` entanglement is linear entanglement but with an additional entanglement of the
    first and last qubit before the linear part.
* ``"sca"`` (shifted-circular-alternating) entanglement is a generalized and modified version
    of the proposed circuit 14 in `Sim et al. <https://arxiv.org/abs/1905.10876>`__.
    It consists of circular entanglement where the "long" entanglement connecting the first with
    the last qubit is shifted by one each block.  Furthermore the role of control and target
    qubits are swapped every block (therefore alternating).

If an entanglement layer contains multiple blocks, then the entanglement should be
given as list of entanglements for each block. For example::

    entanglement_blocks = ["rxx", "ryy"]
    entanglement = ["full", "linear"]  # full for rxx and linear for ryy

or::

    structure_rxx = [[0, 1], [2, 3]]
    structure_ryy = [[0, 2]]
    entanglement = [structure_rxx, structure_ryy]

Finally, the entanglement can vary in each repetition of the circuit. For this, we
support passing a callable that takes as input the layer index and returns the entanglement
for the layer in the above format. See the examples below for a concrete example.

Examples:

The rotation and entanglement gates can be specified via single strings, if they
are made up of a single block per layer:

.. plot::
    :alt: Circuit diagram output by the previous code.
    :include-source:
    :context:

    from qiskit.circuit.library import n_local

    circuit = n_local(3, "ry", "cx", "linear", reps=2, insert_barriers=True)
    circuit.draw("mpl")

Multiple gates per layer can be set by passing a list. Here, for example, we use
Pauli-Y and Pauli-Z rotations in the rotation layer:

.. plot::
    :alt: Circuit diagram output by the previous code.
    :include-source:
    :context: close-figs

    circuit = n_local(3, ["ry", "rz"], "cz", "full", reps=1, insert_barriers=True)
    circuit.draw("mpl")

To omit rotation or entanglement layers, the block can be set to an empty list:

.. plot::
    :alt: Circuit diagram output by the previous code.
    :include-source:
    :context: close-figs

    circuit = n_local(4, [], "cry", reps=2)
    circuit.draw("mpl")

The entanglement can be set explicitly via the ``entanglement`` argument:

.. plot::
    :alt: Circuit diagram output by the previous code.
    :include-source:
    :context: close-figs

    entangler_map = [[0, 1], [2, 0]]
    circuit = n_local(3, "x", "crx", entangler_map, reps=2)
    circuit.draw("mpl")

We can set different entanglements per layer, by specifying a callable that takes
as input the current layer index, and returns the entanglement structure. For example,
the following uses different entanglements for odd and even layers:

.. plot::
    :alt: Circuit diagram output by the previous code.
    :include-source:
    :context: close-figs

    def entanglement(layer_index):
        if layer_index % 2 == 0:
            return [[0, 1], [0, 2]]
        return [[1, 2]]

    circuit = n_local(3, "x", "cx", entanglement, reps=3, insert_barriers=True)
    circuit.draw("mpl")


Args:
    num_qubits: The number of qubits of the circuit.
    rotation_blocks: The blocks used in the rotation layers. If multiple are passed,
        these will be applied one after another (like new sub-layers).
    entanglement_blocks: The blocks used in the entanglement layers. If multiple are passed,
        these will be applied one after another.
    entanglement: The indices specifying on which qubits the input blocks act. This is
        specified by string describing an entanglement strategy (see the additional info)
        or a list of qubit connections.
        If a list of entanglement blocks is passed, different entanglement for each block can
        be specified by passing a list of entanglements. To specify varying entanglement for
        each repetition, pass a callable that takes as input the layer and returns the
        entanglement for that layer.
        Defaults to ``"full"``, meaning an all-to-all entanglement structure.
    reps: Specifies how often the rotation blocks and entanglement blocks are repeated.
    insert_barriers: If ``True``, barriers are inserted in between each layer. If ``False``,
        no barriers are inserted.
    parameter_prefix: The prefix used if default parameters are generated.
    overwrite_block_parameters: If the parameters in the added blocks should be overwritten.
        If ``False``, the parameters in the blocks are not changed.
    skip_final_rotation_layer: Whether a final rotation layer is added to the circuit.
    skip_unentangled_qubits: If ``True``, the rotation gates act only on qubits that
        are entangled. If ``False``, the rotation gates act on all qubits.
    name: The name of the circuit.

Returns:
    An n-local circuit.

## `NLocal`

```python
class NLocal(BlueprintCircuit)
```

The n-local circuit class.

The structure of the n-local circuit are alternating rotation and entanglement layers.
In both layers, parameterized circuit-blocks act on the circuit in a defined way.
In the rotation layer, the blocks are applied stacked on top of each other, while in the
entanglement layer according to the ``entanglement`` strategy.
The circuit blocks can have arbitrary sizes (smaller equal to the number of qubits in the
circuit). Each layer is repeated ``reps`` times, and by default a final rotation layer is
appended.

For instance, a rotation block on 2 qubits and an entanglement block on 4 qubits using
``'linear'`` entanglement yields the following circuit.

.. code-block:: text

    ┌──────┐ ░ ┌──────┐                      ░ ┌──────┐
    ┤0     ├─░─┤0     ├──────────────── ... ─░─┤0     ├
    │  Rot │ ░ │      │┌──────┐              ░ │  Rot │
    ┤1     ├─░─┤1     ├┤0     ├──────── ... ─░─┤1     ├
    ├──────┤ ░ │  Ent ││      │┌──────┐      ░ ├──────┤
    ┤0     ├─░─┤2     ├┤1     ├┤0     ├ ... ─░─┤0     ├
    │  Rot │ ░ │      ││  Ent ││      │      ░ │  Rot │
    ┤1     ├─░─┤3     ├┤2     ├┤1     ├ ... ─░─┤1     ├
    ├──────┤ ░ └──────┘│      ││  Ent │      ░ ├──────┤
    ┤0     ├─░─────────┤3     ├┤2     ├ ... ─░─┤0     ├
    │  Rot │ ░         └──────┘│      │      ░ │  Rot │
    ┤1     ├─░─────────────────┤3     ├ ... ─░─┤1     ├
    └──────┘ ░                 └──────┘      ░ └──────┘

    |                                 |
    +---------------------------------+
           repeated reps times

If specified, barriers can be inserted in between every block.
If an initial state object is provided, it is added in front of the NLocal.

.. seealso::

    The :func:`.n_local` function constructs a functionally equivalent circuit, but faster.

### `__init__`

```python
def __init__(self, num_qubits: int | None=None, rotation_blocks: QuantumCircuit | list[QuantumCircuit] | qiskit.circuit.Instruction | list[qiskit.circuit.Instruction] | None=None, entanglement_blocks: QuantumCircuit | list[QuantumCircuit] | qiskit.circuit.Instruction | list[qiskit.circuit.Instruction] | None=None, entanglement: list[int] | list[list[int]] | None=None, reps: int=1, insert_barriers: bool=False, parameter_prefix: str='θ', overwrite_block_parameters: bool | list[list[Parameter]]=True, skip_final_rotation_layer: bool=False, skip_unentangled_qubits: bool=False, initial_state: QuantumCircuit | None=None, name: str | None='nlocal', flatten: bool | None=None) -> None
```

Args:
    num_qubits: The number of qubits of the circuit.
    rotation_blocks: The blocks used in the rotation layers. If multiple are passed,
        these will be applied one after another (like new sub-layers).
    entanglement_blocks: The blocks used in the entanglement layers. If multiple are passed,
        these will be applied one after another. To use different entanglements for
        the sub-layers, see :meth:`get_entangler_map`.
    entanglement: The indices specifying on which qubits the input blocks act. If ``None``, the
        entanglement blocks are applied at the top of the circuit.
    reps: Specifies how often the rotation blocks and entanglement blocks are repeated.
    insert_barriers: If ``True``, barriers are inserted in between each layer. If ``False``,
        no barriers are inserted.
    parameter_prefix: The prefix used if default parameters are generated.
    overwrite_block_parameters: If the parameters in the added blocks should be overwritten.
        If ``False``, the parameters in the blocks are not changed.
    skip_final_rotation_layer: Whether a final rotation layer is added to the circuit.
    skip_unentangled_qubits: If ``True``, the rotation gates act only on qubits that
        are entangled. If ``False``, the rotation gates act on all qubits.
    initial_state: A :class:`.QuantumCircuit` object which can be used to describe an initial
        state prepended to the NLocal circuit.
    name: The name of the circuit.
    flatten: Set this to ``True`` to output a flat circuit instead of nesting it inside multiple
        layers of gate objects. By default currently the contents of
        the output circuit will be wrapped in nested objects for
        cleaner visualization. However, if you're using this circuit
        for anything besides visualization its **strongly** recommended
        to set this flag to ``True`` to avoid a large performance
        overhead for parameter binding.

Raises:
    ValueError: If ``reps`` parameter is less than or equal to 0.
    TypeError: If ``reps`` parameter is not an int value.

### `num_qubits`

```python
def num_qubits(self) -> int
```

Returns the number of qubits in this circuit.

Returns:
    The number of qubits.

### `num_qubits`

```python
def num_qubits(self, num_qubits: int) -> None
```

Set the number of qubits for the n-local circuit.

Args:
    num_qubits: The new number of qubits.

### `flatten`

```python
def flatten(self) -> bool
```

Returns whether the circuit is wrapped in nested gates/instructions or flattened.

### `rotation_blocks`

```python
def rotation_blocks(self) -> list[QuantumCircuit]
```

The blocks in the rotation layers.

Returns:
    The blocks in the rotation layers.

### `rotation_blocks`

```python
def rotation_blocks(self, blocks: QuantumCircuit | list[QuantumCircuit] | Instruction | list[Instruction]) -> None
```

Set the blocks in the rotation layers.

Args:
    blocks: The new blocks for the rotation layers.

### `entanglement_blocks`

```python
def entanglement_blocks(self) -> list[QuantumCircuit]
```

The blocks in the entanglement layers.

Returns:
    The blocks in the entanglement layers.

### `entanglement_blocks`

```python
def entanglement_blocks(self, blocks: QuantumCircuit | list[QuantumCircuit] | Instruction | list[Instruction]) -> None
```

Set the blocks in the entanglement layers.

Args:
    blocks: The new blocks for the entanglement layers.

### `entanglement`

```python
def entanglement(self) -> str | list[str] | list[list[str]] | list[int] | list[list[int]] | list[list[list[int]]] | list[list[list[list[int]]]] | Callable[[int], str] | Callable[[int], list[list[int]]]
```

Get the entanglement strategy.

Returns:
    The entanglement strategy, see :meth:`get_entangler_map` for more detail on how the
    format is interpreted.

### `entanglement`

```python
def entanglement(self, entanglement: str | list[str] | list[list[str]] | list[int] | list[list[int]] | list[list[list[int]]] | list[list[list[list[int]]]] | Callable[[int], str] | Callable[[int], list[list[int]]] | None) -> None
```

Set the entanglement strategy.

Args:
    entanglement: The entanglement strategy. See :meth:`get_entangler_map` for more detail
        on the supported formats.

### `num_layers`

```python
def num_layers(self) -> int
```

Return the number of layers in the n-local circuit.

Returns:
    The number of layers in the circuit.

### `ordered_parameters`

```python
def ordered_parameters(self) -> list[Parameter]
```

The parameters used in the underlying circuit.

This includes float values and duplicates.

Examples:

    >>> # prepare circuit ...
    >>> print(nlocal)
         ┌───────┐┌──────────┐┌──────────┐┌──────────┐
    q_0: ┤ Ry(1) ├┤ Ry(θ[1]) ├┤ Ry(θ[1]) ├┤ Ry(θ[3]) ├
         └───────┘└──────────┘└──────────┘└──────────┘
    >>> nlocal.parameters
    {Parameter(θ[1]), Parameter(θ[3])}
    >>> nlocal.ordered_parameters
    [1, Parameter(θ[1]), Parameter(θ[1]), Parameter(θ[3])]

Returns:
    The parameters objects used in the circuit.

### `ordered_parameters`

```python
def ordered_parameters(self, parameters: ParameterVector | list[Parameter]) -> None
```

Set the parameters used in the underlying circuit.

Args:
    parameters: The parameters to be used in the underlying circuit.

Raises:
    ValueError: If the length of ordered parameters does not match the number of
        parameters in the circuit and they are not a ``ParameterVector`` (which could
        be resized to fit the number of parameters).

### `insert_barriers`

```python
def insert_barriers(self) -> bool
```

If barriers are inserted in between the layers or not.

Returns:
    ``True``, if barriers are inserted in between the layers, ``False`` if not.

### `insert_barriers`

```python
def insert_barriers(self, insert_barriers: bool) -> None
```

Specify whether barriers should be inserted in between the layers or not.

Args:
    insert_barriers: If True, barriers are inserted, if False not.

### `get_unentangled_qubits`

```python
def get_unentangled_qubits(self) -> set[int]
```

Get the indices of unentangled qubits in a set.

Returns:
    The unentangled qubits.

### `num_parameters_settable`

```python
def num_parameters_settable(self) -> int
```

The number of total parameters that can be set to distinct values.

This does not change when the parameters are bound or exchanged for same parameters,
and therefore is different from ``num_parameters`` which counts the number of unique
:class:`~qiskit.circuit.Parameter` objects currently in the circuit.

Returns:
    The number of parameters originally available in the circuit.

Note:
    This quantity does not require the circuit to be built yet.

### `reps`

```python
def reps(self) -> int
```

The number of times rotation and entanglement block are repeated.

Returns:
    The number of repetitions.

### `reps`

```python
def reps(self, repetitions: int) -> None
```

Set the repetitions.

If the repetitions are `0`, only one rotation layer with no entanglement
layers is applied (unless ``self.skip_final_rotation_layer`` is set to ``True``).

Args:
    repetitions: The new repetitions.

Raises:
    ValueError: If reps setter has parameter repetitions < 0.

### `print_settings`

```python
def print_settings(self) -> str
```

Returns information about the setting.

Returns:
    The class name and the attributes/parameters of the instance as ``str``.

### `preferred_init_points`

```python
def preferred_init_points(self) -> list[float] | None
```

The initial points for the parameters. Can be stored as initial guess in optimization.

Returns:
    The initial values for the parameters, or None, if none have been set.

### `get_entangler_map`

```python
def get_entangler_map(self, rep_num: int, block_num: int, num_block_qubits: int) -> Sequence[Sequence[int]]
```

Get the entangler map for in the repetition ``rep_num`` and the block ``block_num``.

The entangler map for the current block is derived from the value of ``self.entanglement``.
Below the different cases are listed, where ``i`` and ``j`` denote the repetition number
and the block number, respectively, and ``n`` the number of qubits in the block.

=================================== ========================================================
entanglement type                   entangler map
=================================== ========================================================
``None``                            ``[[0, ..., n - 1]]``
``str`` (e.g ``'full'``)            the specified connectivity on ``n`` qubits
``List[int]``                       [``entanglement``]
``List[List[int]]``                 ``entanglement``
``List[List[List[int]]]``           ``entanglement[i]``
``List[List[List[List[int]]]]``     ``entanglement[i][j]``
``List[str]``                       the connectivity specified in ``entanglement[i]``
``List[List[str]]``                 the connectivity specified in ``entanglement[i][j]``
``Callable[int, str]``              same as ``List[str]``
``Callable[int, List[List[int]]]``  same as ``List[List[List[int]]]``
=================================== ========================================================


Note that all indices are to be taken modulo the length of the array they act on, i.e.
no out-of-bounds index error will be raised but we re-iterate from the beginning of the
list.

Args:
    rep_num: The current repetition we are in.
    block_num: The block number within the entanglement layers.
    num_block_qubits: The number of qubits in the block.

Returns:
    The entangler map for the current block in the current repetition.

Raises:
    ValueError: If the value of ``entanglement`` could not be cast to a corresponding
        entangler map.

### `initial_state`

```python
def initial_state(self) -> QuantumCircuit
```

Return the initial state that is added in front of the n-local circuit.

Returns:
    The initial state.

### `initial_state`

```python
def initial_state(self, initial_state: QuantumCircuit) -> None
```

Set the initial state.

Args:
    initial_state: The new initial state.

Raises:
    ValueError: If the number of qubits has been set before and the initial state
        does not match the number of qubits.

### `parameter_bounds`

```python
def parameter_bounds(self) -> list[tuple[float, float]] | None
```

The parameter bounds for the unbound parameters in the circuit.

Returns:
    A list of pairs indicating the bounds, as (lower, upper). None indicates an unbounded
    parameter in the corresponding direction. If ``None`` is returned, problem is fully
    unbounded.

### `parameter_bounds`

```python
def parameter_bounds(self, bounds: list[tuple[float, float]]) -> None
```

Set the parameter bounds.

Args:
    bounds: The new parameter bounds.

### `add_layer`

```python
def add_layer(self, other: QuantumCircuit | qiskit.circuit.Instruction, entanglement: list[int] | str | list[list[int]] | None=None, front: bool=False) -> NLocal
```

Append another layer to the NLocal.

Args:
    other: The layer to compose, can be another NLocal, an Instruction or Gate,
        or a QuantumCircuit.
    entanglement: The entanglement or qubit indices.
    front: If True, ``other`` is appended to the front, else to the back.

Returns:
    self, such that chained composes are possible.

Raises:
    TypeError: If `other` is not compatible, i.e. is no Instruction and does not have a
        `to_instruction` method.

### `assign_parameters`

```python
def assign_parameters(self, parameters: Mapping[Parameter, ParameterExpression | float] | Sequence[ParameterExpression | float], inplace: bool=False, **kwargs) -> QuantumCircuit | None
```

Assign parameters to the n-local circuit.

This method also supports passing a list instead of a dictionary. If a list
is passed, the list must have the same length as the number of unbound parameters in
the circuit. The parameters are assigned in the order of the parameters in
:meth:`ordered_parameters`.

Returns:
    A copy of the NLocal circuit with the specified parameters.

Raises:
    AttributeError: If the parameters are given as list and do not match the number
        of parameters.

## `get_parameters`

```python
def get_parameters(block: QuantumCircuit | Instruction) -> list[Parameter]
```

Return the list of Parameters objects inside a circuit or instruction.

This is required since, in a standard gate the parameters are not necessarily Parameter
objects (e.g. U3Gate(0.1, 0.2, 0.3).params == [0.1, 0.2, 0.3]) and instructions and
circuits do not have the same interface for parameters.

## `get_entangler_map`

```python
def get_entangler_map(num_block_qubits: int, num_circuit_qubits: int, entanglement: str, offset: int=0) -> Sequence[tuple[int, ...]]
```

Get an entangler map for an arbitrary number of qubits.

Args:
    num_block_qubits: The number of qubits of the entangling block.
    num_circuit_qubits: The number of qubits of the circuit.
    entanglement: The entanglement strategy.
    offset: The block offset, can be used if the entanglements differ per block.
        See mode ``sca`` for instance.

Returns:
    The entangler map using mode ``entanglement`` to scatter a block of ``num_block_qubits``
    qubits on ``num_circuit_qubits`` qubits.

Raises:
    ValueError: If the entanglement mode is not supported.
