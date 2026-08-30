---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/transpiler/layout.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/layout.py
license: Apache-2.0
---

## Module `qiskit/transpiler/layout.py`

A two-ways dict to represent a layout.

Layout is the relation between virtual (qu)bits and physical (qu)bits.
Virtual (qu)bits are tuples, e.g. `(QuantumRegister(3, 'qr'), 2)` or simply `qr[2]`.
Physical (qu)bits are integers.

## `Layout`

```python
class Layout
```

Two-ways dict to represent a Layout.

### `__init__`

```python
def __init__(self, input_dict=None)
```

construct a Layout from a bijective dictionary, mapping
virtual qubits to physical qubits

### `__repr__`

```python
def __repr__(self)
```

Representation of a Layout

### `from_dict`

```python
def from_dict(self, input_dict)
```

Populates a Layout from a dictionary.

The dictionary must be a bijective mapping between
virtual qubits (tuple) and physical qubits (int).

Args:
    input_dict (dict):
        e.g.::

        {(QuantumRegister(3, 'qr'), 0): 0,
         (QuantumRegister(3, 'qr'), 1): 1,
         (QuantumRegister(3, 'qr'), 2): 2}

        Can be written more concisely as follows:

        * virtual to physical::

            {qr[0]: 0,
             qr[1]: 1,
             qr[2]: 2}

        * physical to virtual::

            {0: qr[0],
             1: qr[1],
             2: qr[2]}

### `order_based_on_type`

```python
def order_based_on_type(value1, value2)
```

decides which one is physical/virtual based on the type. Returns (virtual, physical)

### `copy`

```python
def copy(self)
```

Returns a copy of a Layout instance.

### `add`

```python
def add(self, virtual_bit, physical_bit=None)
```

Adds a map element between `bit` and `physical_bit`. If `physical_bit` is not
defined, `bit` will be mapped to a new physical bit.

Args:
    virtual_bit (tuple): A (qu)bit. For example, (QuantumRegister(3, 'qr'), 2).
    physical_bit (int): A physical bit. For example, 3.

### `add_register`

```python
def add_register(self, reg)
```

Adds at the end physical_qubits that map each bit in reg.

Args:
    reg (Register): A (qu)bit Register. For example, QuantumRegister(3, 'qr').

### `get_registers`

```python
def get_registers(self)
```

Returns the registers in the layout [QuantumRegister(2, 'qr0'), QuantumRegister(3, 'qr1')]
Returns:
    Set: A set of Registers in the layout

### `get_virtual_bits`

```python
def get_virtual_bits(self)
```

Returns the dictionary where the keys are virtual (qu)bits and the
values are physical (qu)bits.

### `get_physical_bits`

```python
def get_physical_bits(self)
```

Returns the dictionary where the keys are physical (qu)bits and the
values are virtual (qu)bits.

### `swap`

```python
def swap(self, left, right)
```

Swaps the map between left and right.

Args:
    left (tuple or int): Item to swap with right.
    right (tuple or int): Item to swap with left.
Raises:
    LayoutError: If left and right have not the same type.

### `combine_into_edge_map`

```python
def combine_into_edge_map(self, another_layout)
```

Combines self and another_layout into an "edge map".

For example::

      self       another_layout  resulting edge map
   qr_1 -> 0        0 <- q_2         qr_1 -> q_2
   qr_2 -> 2        2 <- q_1         qr_2 -> q_1
   qr_3 -> 3        3 <- q_0         qr_3 -> q_0

The edge map is used to compose dags via, for example, compose.

Args:
    another_layout (Layout): The other layout to combine.
Returns:
    dict: A "edge map".
Raises:
    LayoutError: another_layout can be bigger than self, but not smaller.
        Otherwise, raises.

### `reorder_bits`

```python
def reorder_bits(self, bits) -> list[int]
```

Given an ordered list of bits, reorder them according to this layout.

The list of bits must exactly match the virtual bits in this layout.

Args:
    bits (list[Bit]): the bits to reorder.

Returns:
    List: ordered bits.

### `generate_trivial_layout`

```python
def generate_trivial_layout(*regs)
```

Creates a trivial ("one-to-one") Layout with the registers and qubits in `regs`.

Args:
    *regs (Registers, Qubits): registers and qubits to include in the layout.
Returns:
    Layout: A layout with all the `regs` in the given order.

### `from_intlist`

```python
def from_intlist(int_list, *qregs)
```

Converts a list of integers to a Layout
mapping virtual qubits (index of the list) to
physical qubits (the list values).

Args:
    int_list (list): A list of integers.
    *qregs (QuantumRegisters): The quantum registers to apply
        the layout to.
Returns:
    Layout: The corresponding Layout object.
Raises:
    LayoutError: Invalid input layout.

### `from_qubit_list`

```python
def from_qubit_list(qubit_list, *qregs)
```

Populates a Layout from a list containing virtual
qubits, Qubit or None.

Args:
    qubit_list (list):
        e.g.: [qr[0], None, qr[2], qr[3]]
    *qregs (QuantumRegisters): The quantum registers to apply
        the layout to.
Returns:
    Layout: the corresponding Layout object
Raises:
    LayoutError: If the elements are not Qubit or None

### `compose`

```python
def compose(self, other: Layout, qubits: list[Qubit]) -> Layout
```

Compose this layout with another layout.

If this layout represents a mapping from the P-qubits to the positions of the Q-qubits,
and the other layout represents a mapping from the Q-qubits to the positions of
the R-qubits, then the composed layout represents a mapping from the P-qubits to the
positions of the R-qubits.

Args:
    other: The existing :class:`.Layout` to compose this :class:`.Layout` with.
    qubits: A list of :class:`.Qubit` objects over which ``other`` is defined,
        used to establish the correspondence between the positions of the ``other``
        qubits and the actual qubits.

Returns:
    A new layout object the represents this layout composed with the ``other`` layout.

### `inverse`

```python
def inverse(self, source_qubits: list[Qubit], target_qubits: list[Qubit])
```

Finds the inverse of this layout.

This is possible when the layout is a bijective mapping, however the input
and the output qubits may be different (in particular, this layout may be
the mapping from the extended-with-ancillas virtual qubits to physical qubits).
Thus, if this layout represents a mapping from the P-qubits to the positions
of the Q-qubits, the inverse layout represents a mapping from the Q-qubits
to the positions of the P-qubits.

Args:
    source_qubits: A list of :class:`.Qubit` objects representing the domain
        of the layout.
    target_qubits: A list of :class:`.Qubit` objects representing the image
        of the layout.

Returns:
    A new layout object the represents the inverse of this layout.

### `to_permutation`

```python
def to_permutation(self, qubits: list[Qubit])
```

Creates a permutation corresponding to this layout.

This is possible when the layout is a bijective mapping with the same
source and target qubits (for instance, a "final_layout" corresponds
to a permutation of the physical circuit qubits). If this layout is
a mapping from qubits to their new positions, the resulting permutation
describes which qubits occupy the positions 0, 1, 2, etc. after
applying the permutation.

For example, suppose that the list of qubits is ``[qr_0, qr_1, qr_2]``,
and the layout maps ``qr_0`` to ``2``, ``qr_1`` to ``0``, and
``qr_2`` to ``1``. In terms of positions in ``qubits``, this maps ``0``
to ``2``, ``1`` to ``0`` and ``2`` to ``1``, with the corresponding
permutation being ``[1, 2, 0]``.

## `TranspileLayout`

```python
class TranspileLayout
```

Layout attributes for the output circuit from transpiler.

The :mod:`~qiskit.transpiler` is unitary-preserving up to the "initial layout"
and "final layout" permutations. The initial layout permutation is caused by
setting and applying the initial layout during the :ref:`transpiler-preset-stage-layout`.
The final layout permutation is caused by :class:`~.SwapGate` insertion during
the :ref:`transpiler-preset-stage-routing`. This class provides an interface to reason about
these permutations using a variety of helper methods.

During the layout stage, the transpiler can potentially remap the order of the
qubits in the circuit as it fits the circuit to the target backend. For example,
let the input circuit be:

.. plot::
   :alt: Circuit diagram output by the previous code.
   :include-source:

   from qiskit.circuit import QuantumCircuit, QuantumRegister

   qr = QuantumRegister(3, name="MyReg")
   qc = QuantumCircuit(qr)
   qc.h(0)
   qc.cx(0, 1)
   qc.cx(0, 2)
   qc.draw("mpl")


Suppose that during the layout stage the transpiler reorders the qubits to be:

.. plot::
   :alt: Circuit diagram output by the previous code.
   :include-source:

   from qiskit import QuantumCircuit

   qc = QuantumCircuit(3)
   qc.h(2)
   qc.cx(2, 1)
   qc.cx(2, 0)
   qc.draw("mpl")

Then the output of the :meth:`.initial_virtual_layout` method is
equivalent to::

    Layout({
        qr[0]: 2,
        qr[1]: 1,
        qr[2]: 0,
    })

(it is also this attribute in the :meth:`.QuantumCircuit.draw` and
:func:`.circuit_drawer` which is used to display the mapping of qubits to
positions in circuit visualizations post-transpilation).

Building on the above example, suppose that during the routing stage
the transpiler needs to insert swap gates, and the output circuit
becomes:

.. plot::
   :alt: Circuit diagram output by the previous code.
   :include-source:

   from qiskit import QuantumCircuit

   qc = QuantumCircuit(3)
   qc.h(2)
   qc.cx(2, 1)
   qc.swap(0, 1)
   qc.cx(2, 1)
   qc.draw("mpl")

Then the output of the :meth:`routing_permutation` method is::

    [1, 0, 2]

which maps positions of qubits before routing to their final positions
after routing.

There are three public attributes associated with the class, however these
are mostly provided for backwards compatibility and represent the internal
state from the transpiler. They are defined as:

  * :attr:`initial_layout` - This attribute is used to model the
    permutation caused by the :ref:`transpiler-preset-stage-layout`. It is a
    :class:`~.Layout` object that maps the input :class:`~.QuantumCircuit`\s
    :class:`~.circuit.Qubit` objects to the position in the output
    :class:`.QuantumCircuit.qubits` list.
  * :attr:`input_qubit_mapping` - This attribute is used to retain
    input ordering of the original :class:`~.QuantumCircuit` object. It
    maps the virtual :class:`~.circuit.Qubit` object from the original circuit
    (and :attr:`initial_layout`) to its corresponding position in
    :attr:`.QuantumCircuit.qubits` in the original circuit. This
    is needed when computing the permutation of the :class:`Operator` of
    the circuit (and used by :meth:`.Operator.from_circuit`).
  * :attr:`final_layout` - This attribute is used to model the
    permutation caused by the :ref:`transpiler-preset-stage-routing`. It is a
    :class:`~.Layout` object that maps the output circuit's qubits from
    :class:`.QuantumCircuit.qubits` in the output circuit to their final
    positions after routing. Importantly, this only represents the
    permutation caused by inserting :class:`~.SwapGate`\s into
    the :class:`~.QuantumCircuit` during the :ref:`transpiler-preset-stage-routing`.
    It is **not** a mapping from the original input circuit's position
    to the final position at the end of the transpiled circuit.
    If you need this, you can use the :meth:`.final_index_layout` to generate this.
    If :attr:`final_layout` is set to ``None``, this indicates that routing was not
    run, and can be considered equivalent to a trivial layout with the qubits from
    the output circuit's :attr:`~.QuantumCircuit.qubits` list.

### `initial_virtual_layout`

```python
def initial_virtual_layout(self, filter_ancillas: bool=False) -> Layout
```

Return a :class:`.Layout` object for the initial layout.

This returns a mapping of virtual :class:`~.circuit.Qubit` objects in the input
circuit to the positions of the physical qubits selected during layout.
This is analogous to the :attr:`.initial_layout` attribute.

Args:
    filter_ancillas: If set to ``True`` only qubits in the input circuit
        will be in the returned layout. Any ancilla qubits added to the
        output circuit will be filtered from the returned object.
Returns:
    A layout object mapping the input circuit's :class:`~.circuit.Qubit`
    objects to the positions of the selected physical qubits.

### `initial_index_layout`

```python
def initial_index_layout(self, filter_ancillas: bool=False) -> list[int]
```

Generate an initial layout as an array of integers.

Args:
    filter_ancillas: If set to ``True`` any ancilla qubits added
        to the transpiler will not be included in the output.

Return:
    A layout array that maps a position in the array to its new position in the output
    circuit.

### `routing_permutation`

```python
def routing_permutation(self) -> list[int]
```

Generate a final layout as an array of integers.

If there is no :attr:`.final_layout` attribute present then that indicates
there was no output permutation caused by routing or other transpiler
transforms. In this case the function will return a list of ``[0, 1, 2, .., n]``.

Returns:
    A layout array that maps a position in the array to its new position in the output
    circuit.

### `final_index_layout`

```python
def final_index_layout(self, filter_ancillas: bool=True) -> list[int]
```

Generate the final layout as an array of integers.

This method will generate an array of final positions for each qubit in the input circuit.
For example, if you had an input circuit like::

    qc = QuantumCircuit(3)
    qc.h(0)
    qc.cx(0, 1)
    qc.cx(0, 2)

and the output from the transpiler was::

    tqc = QuantumCircuit(3)
    tqc.h(2)
    tqc.cx(2, 1)
    tqc.swap(0, 1)
    tqc.cx(2, 1)

then the :meth:`.final_index_layout` method returns::

    [2, 0, 1]

This can be seen as follows. Qubit 0 in the original circuit is mapped to qubit 2
in the output circuit during the layout stage, which is mapped to qubit 2 during the
routing stage. Qubit 1 in the original circuit is mapped to qubit 1 in the output
circuit during the layout stage, which is mapped to qubit 0 during the routing
stage. Qubit 2 in the original circuit is mapped to qubit 0 in the output circuit
during the layout stage, which is mapped to qubit 1 during the routing stage.
The output list length will be as wide as the input circuit's number of qubits,
as the output list from this method is for tracking the permutation of qubits in the
original circuit caused by the transpiler.

Args:
    filter_ancillas: If set to ``False`` any ancillas allocated in the output circuit will be
        included in the layout.

Returns:
    A list of final positions for each input circuit qubit.

### `final_virtual_layout`

```python
def final_virtual_layout(self, filter_ancillas: bool=True) -> Layout
```

Generate the final layout as a :class:`.Layout` object.

This method will generate an array of final positions for each qubit in the input circuit.
For example, if you had an input circuit like::

    qc = QuantumCircuit(3)
    qc.h(0)
    qc.cx(0, 1)
    qc.cx(0, 2)

and the output from the transpiler was::

    tqc = QuantumCircuit(3)
    tqc.h(2)
    tqc.cx(2, 1)
    tqc.swap(0, 1)
    tqc.cx(2, 1)

then the return from this function would be a layout object::

    Layout({
        qc.qubits[0]: 2,
        qc.qubits[1]: 0,
        qc.qubits[2]: 1,
    })

This can be seen as follows. Qubit 0 in the original circuit is mapped to qubit 2
in the output circuit during the layout stage, which is mapped to qubit 2 during the
routing stage. Qubit 1 in the original circuit is mapped to qubit 1 in the output
circuit during the layout stage, which is mapped to qubit 0 during the routing
stage. Qubit 2 in the original circuit is mapped to qubit 0 in the output circuit
during the layout stage, which is mapped to qubit 1 during the routing stage.
The output list length will be as wide as the input circuit's number of qubits,
as the output list from this method is for tracking the permutation of qubits in the
original circuit caused by the transpiler.

Args:
    filter_ancillas: If set to ``False`` any ancillas allocated in the output circuit will be
        included in the layout.

Returns:
    A layout object mapping to the final positions for each qubit.

### `from_property_set`

```python
def from_property_set(cls, dag: DAGCircuit, property_set: PropertySet) -> TranspileLayout | None
```

Construct the :class:`TranspileLayout` by reading out the fields from the given
:class:`.PropertySet`.  Returns ``None`` if there are no layout-setting keys present.

This includes combining the different keys of the property set into the full set of initial
and final layouts, including virtual permutations.

This does not invalidate or in any way mutate the given property set.  In order to
"canonicalize" the property set afterwards, call :meth:`write_into_property_set`.

This reads the following property-set keys:

``layout``
    **Required**. The :class:`.Layout` object mapping virtual qubits (potentially expanded
    with ancillas) to physical-qubit indices.  This corresponds directly to
    :attr:`initial_layout`.

    .. note::
        In all standard use, this is a required field.  However, if
        ``virtual_permutation_layout`` is set, then a "trivial" layout will be inferred,
        even if the circuit is not actually laid out to hardware.  This is an unfortunate
        limitation of this class's data model, where it is not possible to specify a final
        permutation without also having an initial layout. This deficiency will be corrected
        in Qiskit 3.0.

``original_qubit_indices``
    **Required** (but automatically set by the :class:`.PassManager`).  The mapping
    ``{virtual: index}`` that indicates which relative index each incoming virtual qubit
    was, in the input circuit.  This can be expanded with ancillas too (in which case the
    ancilla indices don't mean much, since they weren't in the incoming circuit).

``num_input_qubits``
    **Required** (but automatically set by the :class:`.PassManager`).  The number of
    explicit virtual qubits in the input circuit (i.e. not including implicit ancillas).

``final_layout``
    **Optional**.  The effective final permutation, in terms of the current qubits of the
    :class:`.DAGCircuit`.  This corresponds directly to :attr:`final_layout`.

``virtual_permutation_layout``
    **Optional**.  This is set by certain optimization passes that run before layout
    selection, such as :class:`.ElidePermutations`.  It is similar in spirit to
    ``final_layout``, but typically only applies to the input virtual qubits.

    .. warning::
        This object uses the opposite permutation convention to ``final_layout`` due to an
        oversight in Qiskit during its introduction.  In other words,
        ``virtual_permutation_layout`` maps a :class:`.Qubit` instance at the end of the
        circuit to its integer index at the start of the circuit.

Args:
    dag: the current state of the :class:`.DAGCircuit`.
    property_set: the current transpiler's property set.  This must at least have the
        ``layout`` key set.

### `write_into_property_set`

```python
def write_into_property_set(self, property_set: dict[str, object])
```

'Unpack' this layout into the loose-constraints form of the ``property_set``.

This is the inverse method of :meth:`from_property_set`.

This always writes the follow property-set keys, overwriting them if they were already set:

``layout``
    Directly corresponds to :attr:`initial_layout`.

``original_qubit_indices``
    Directly corresponds to :attr:`input_qubit_mapping`.

``final_layout``
    Directly corresponds to :attr:`final_layout`.  Note that this might not be identical to
    the ``final_layout`` from before a call to :meth:`from_property_set`, because the
    effects of ``virtual_permutation_layout`` will have been combined into it.

``virtual_permutation_layout``
    Deleted from the property set; :class:`TranspileLayout` "finalizes" the multiple
    separate permutations into one single permutation, to retain the canonical form.

In addition, the following keys are updated, if this :class:`TranspileLayout` has a known
value for them.  They are left as-is if not, to handle cases where this class was manually
constructed without setting certain optional fields.

``num_input_qubits``
    The number of non-ancilla virtual qubits in the input circuit.

Args:
    property_set: the :class:`.PropertySet` (or general :class:`dict`) that the output
        should be written into.  This mutates the input in place.
