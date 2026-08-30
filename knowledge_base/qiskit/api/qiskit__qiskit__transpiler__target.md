---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/transpiler/target.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/target.py
license: Apache-2.0
---

## Module `qiskit/transpiler/target.py`

A target object represents the minimum set of information the transpiler needs
from a backend

## `InstructionProperties`

```python
class InstructionProperties(BaseInstructionProperties)
```

A representation of the properties of a gate implementation.

This class provides the optional properties that a backend can provide
about an instruction. These represent the set that the transpiler can
currently work with if present. However, if your backend provides additional
properties for instructions you should subclass this to add additional
custom attributes for those custom/additional properties by the backend.

### `__init__`

```python
def __init__(self, duration: float | None=None, error: float | None=None)
```

Create a new ``InstructionProperties`` object

Args:
    duration: The duration, in seconds, of the instruction on the
        specified set of qubits
    error: The average error rate for the instruction on the specified
        set of qubits.

## `Target`

```python
class Target(BaseTarget)
```

The intent of the ``Target`` object is to inform Qiskit's compiler about
the constraints of a particular backend so the compiler can compile an
input circuit to something that works and is optimized for a device. It
currently contains a description of instructions on a backend and their
properties as well as some timing information. However, this exact
interface may evolve over time as the needs of the compiler change. These
changes will be done in a backwards compatible and controlled manner when
they are made (either through versioning, subclassing, or mixins) to add
on to the set of information exposed by a target.

As a basic example, let's assume a backend has two qubits, supports
:class:`~qiskit.circuit.library.UGate` on both qubits and
:class:`~qiskit.circuit.library.CXGate` in both directions. To model this
you would create the target like::

    from qiskit.transpiler import Target, InstructionProperties
    from qiskit.circuit.library import UGate, CXGate
    from qiskit.circuit import Parameter

    gmap = Target()
    theta = Parameter('theta')
    phi = Parameter('phi')
    lam = Parameter('lambda')
    u_props = {
        (0,): InstructionProperties(duration=5.23e-8, error=0.00038115),
        (1,): InstructionProperties(duration=4.52e-8, error=0.00032115),
    }
    gmap.add_instruction(UGate(theta, phi, lam), u_props)
    cx_props = {
        (0,1): InstructionProperties(duration=5.23e-7, error=0.00098115),
        (1,0): InstructionProperties(duration=4.52e-7, error=0.00132115),
    }
    gmap.add_instruction(CXGate(), cx_props)

Each instruction in the ``Target`` is indexed by a unique string name that uniquely
identifies that instance of an :class:`~qiskit.circuit.Instruction` object in
the Target. There is a 1:1 mapping between a name and an
:class:`~qiskit.circuit.Instruction` instance in the target and each name must
be unique. By default, the name is the :attr:`~qiskit.circuit.Instruction.name`
attribute of the instruction, but can be set to anything. This lets a single
target have multiple instances of the same instruction class with different
parameters. For example, if a backend target has two instances of an
:class:`~qiskit.circuit.library.RXGate` one is parameterized over any theta
while the other is tuned up for a theta of pi/6 you can add these by doing something
like::

    import math

    from qiskit.transpiler import Target, InstructionProperties
    from qiskit.circuit.library import RXGate
    from qiskit.circuit import Parameter

    target = Target()
    theta = Parameter('theta')
    rx_props = {
        (0,): InstructionProperties(duration=5.23e-8, error=0.00038115),
    }
    target.add_instruction(RXGate(theta), rx_props)
    rx_30_props = {
        (0,): InstructionProperties(duration=1.74e-6, error=.00012)
    }
    target.add_instruction(RXGate(math.pi / 6), rx_30_props, name='rx_30')

Then in the ``target`` object accessing by ``rx_30`` will get the fixed
angle :class:`~qiskit.circuit.library.RXGate` while ``rx`` will get the
parameterized :class:`~qiskit.circuit.library.RXGate`.

You can optionally specify a bound on valid values on a gate in the target
by using the ``angle_bounds`` keyword argument when calling the :meth:`.add_instruction`
method. Bounds are set on operations not individual instructions, so when
you call :meth:`.add_instruction` the bounds are applied for all qargs that it
is defined on. The bounds are specified of a list of 2-tuples of floats where
the first float is the lower bound and the second float is the upper bound. For example,
if you specified an angle bound::

    [(0.0, 3.14), (-3.14, 3.14), (0.0, 1.0)]

this indicates the angle bounds for a 3 parameter gate where the first
parameter accepts angles between 0 and 3.14, the second between -3.14 and
3.14, and the third parameter between 0 and 1. All bounds are set
inclusively as well. A bound can also be specified with ``None`` instead
of a 2-tuple which indicates that parameter has no constraints. For example::

    [(0.0, 3.14), None, None]

indicates an angle bound for a 3 parameter gate where only the first
parameter is restricted to angles between 0.0 and 3.14 and the other
parameters accept any value.

You can check if any operations in the target have angle bounds set with,
:meth:`.has_angle_bounds` and also if a specific name in the target has
angle bounds set with :meth:`.gate_has_angle_bounds`. Whether a particular
set of parameter values conforms to the angle bounds can be checked
with :meth:`.supported_angle_bound`. In the preset pass managers the
:class:`.WrapAngles` pass is used to enforce the angle bounds, for this
to work you need to provide a function to the :class:`.WrapAngleRegistry`
used by the pass. You can see more details on this in:
:ref:`angle-bounds-on-gates`.

This class can be queried via the mapping protocol, using the
instruction's name as a key. You can modify any property for an
instruction via the :meth:`.update_instruction_properties` method.
Modification via the mapping protocol or mutating the attributes of
a :class:`.InstructionProperties` object is **not** supported and
doing so will invalidate the internal state of the object.

.. note::

    This class assumes that qubit indices start at 0 and are a contiguous
    set if you want a submapping the bits will need to be reindexed in
    a new :class:`Target` object.

.. note::

    This class only supports additions of gates, qargs, and properties.
    If you need to remove one of these the best option is to iterate over
    an existing object and create a new subset (or use one of the methods
    to do this). The object internally caches different views and these
    would potentially be invalidated by removals.

Subclassing
-----------

While it is technically possible to subclass :class:`Target`, beware that the majority of the
built-in information is in Rust and is queried from Rust in built-in transpiler passes.
Python-space overrides are not visible to Rust, and you should not rely on these to change the
behavior of Qiskit's built-in transpiler passes.  :class:`Target` is largely supposed to be a
representation of a QPU that has specialized *constructors*, not specialized subclasses; the
usual API for constructing a :class:`Target` should be a function that returns a base
:class:`Target`, not a subclass with a custom initializer.

You may use subclassing to add *additional* Python-space properties to your :class:`Target`, for
example to then interpret in custom backend-specific transpiler stages; the :class:`Target` is
passed to stage-plugin constructors.

You should not subclass :class:`Target` to attempt to modify the behavior of Qiskit's built-in
passes; the Python-space subclassing will not be seen by passes written in Rust.

Further, as the core of :class:`Target` is written in Rust, it uses :meth:`~object.__new__` as
its initializer, and you must ensure that the correct arguments are passed through to the
underlying implementation.  If you override the signature of the :meth:`~object.__init__`
method, you must also include an override of :meth:`~object.__new__` with the same signature,
which calls ``super().__new__()`` in a correct manner.

### `__new__`

```python
def __new__(cls, description: str | None=None, num_qubits: int | None=0, dt: float | None=None, granularity: int=1, min_length: int=1, pulse_alignment: int=1, acquire_alignment: int=1, qubit_properties: list | None=None, concurrent_measurements: list | None=None, **_subclass_kwargs)
```

Create a new :class:`Target` object.

Args:
    description (str): An optional string to describe the Target.
    num_qubits (int): An optional int to specify the number of qubits
        the backend target has. This is not a hard limit on the construction; any call to
        :meth:`add_instruction` will cause the set `num_qubits` to update to accommodate any
        concrete ``qargs`` in the given properties.

        This can be explicitly set to ``None`` to indicate a :class:`Target` representing a
        simulator or other abstract machine that imposes no limits on the number of qubits.
        In this case, all instructions added to the target should be global (with
        ``properties=None`` or ``properties={None: None}``).
    dt (float): The system time resolution of input signals in seconds
    granularity (int): An integer value representing minimum pulse gate
        resolution in units of ``dt``. A user-defined pulse gate should
        have duration of a multiple of this granularity value.
    min_length (int): An integer value representing minimum pulse gate
        length in units of ``dt``. A user-defined pulse gate should be
        longer than this length.
    pulse_alignment (int): An integer value representing a time
        resolution of gate instruction starting time. Gate instruction
        should start at time which is a multiple of the alignment
        value.
    acquire_alignment (int): An integer value representing a time
        resolution of measure instruction starting time. Measure
        instruction should start at time which is a multiple of the
        alignment value.
    qubit_properties (list): A list of :class:`~.QubitProperties`
        objects defining the characteristics of each qubit on the
        target device. If specified the length of this list must match
        the number of qubits in the target, where the index in the list
        matches the qubit number the properties are defined for. If some
        qubits don't have properties available you can set that entry to
        ``None``
    concurrent_measurements(list): A list of sets of qubits that must be
        measured together. This must be provided
        as a nested list like ``[[0, 1], [2, 3, 4]]``.
Raises:
    ValueError: If both ``num_qubits`` and ``qubit_properties`` are both
        defined and the value of ``num_qubits`` differs from the length of
        ``qubit_properties``.

### `get_non_global_operation_names`

```python
def get_non_global_operation_names(self, strict_direction=False)
```

Return the non-global operation names for the target

The non-global operations are those in the target which don't apply
on all qubits (for single qubit operations) or all multi-qubit qargs
(for multi-qubit operations).

Args:
    strict_direction (bool): If set to ``True`` the multi-qubit
        operations considered as non-global respect the strict
        direction (or order of qubits in the qargs is significant). For
        example, if ``cx`` is defined on ``(0, 1)`` and ``ecr`` is
        defined over ``(1, 0)`` by default neither would be considered
        non-global, but if ``strict_direction`` is set ``True`` both
        ``cx`` and ``ecr`` would be returned.

Returns:
    List[str]: A list of operation names for operations that aren't global in this target

### `dt`

```python
def dt(self)
```

Return dt.

### `dt`

```python
def dt(self, dt)
```

Set dt and invalidate instruction duration cache

### `add_instruction`

```python
def add_instruction(self, instruction, properties=None, name=None, *, angle_bounds=None)
```

Add a new instruction to the :class:`~qiskit.transpiler.Target`

As ``Target`` objects are strictly additive this is the primary method
for modifying a ``Target``. Typically, you will use this to fully populate
a ``Target`` before using it in :class:`~qiskit.providers.BackendV2`. For
example::

    from qiskit.circuit.library import CXGate
    from qiskit.transpiler import Target, InstructionProperties

    target = Target()
    cx_properties = {
        (0, 1): None,
        (1, 0): None,
        (0, 2): None,
        (2, 0): None,
        (0, 3): None,
        (2, 3): None,
        (3, 0): None,
        (3, 2): None
    }
    target.add_instruction(CXGate(), cx_properties)

Will add a :class:`~qiskit.circuit.library.CXGate` to the target with no
properties (duration, error, etc) with the coupling edge list:
``(0, 1), (1, 0), (0, 2), (2, 0), (0, 3), (2, 3), (3, 0), (3, 2)``. If
there are properties available for the instruction you can replace the
``None`` value in the properties dictionary with an
:class:`~qiskit.transpiler.InstructionProperties` object. This pattern
is repeated for each :class:`~qiskit.circuit.Instruction` the target
supports.

Args:
    instruction (Union[qiskit.circuit.Instruction, Type[qiskit.circuit.Instruction]]):
        The operation object to add to the map. If it's parameterized any value
        of the parameter can be set. Optionally for variable width
        instructions (such as control flow operations such as :class:`~.ForLoop` or
        :class:`~MCXGate`) you can specify the class. If the class is specified then the
        ``name`` argument must be specified. When a class is used the gate is treated as global
        and not having any properties set.
    properties (dict): A dictionary of qarg entries to an
        :class:`~qiskit.transpiler.InstructionProperties` object for that
        instruction implementation on the backend. Properties are optional
        for any instruction implementation, if there are no
        :class:`~qiskit.transpiler.InstructionProperties` available for the
        backend the value can be None. If there are no constraints on the
        instruction (as in a noiseless/ideal simulation) this can be set to
        ``{None, None}`` which will indicate it runs on all qubits (or all
        available permutations of qubits for multi-qubit gates). The first
        ``None`` indicates it applies to all qubits and the second ``None``
        indicates there are no
        :class:`~qiskit.transpiler.InstructionProperties` for the
        instruction. By default, if properties is not set it is equivalent to
        passing ``{None: None}``.
    name (str): An optional name to use for identifying the instruction. If not
        specified the :attr:`~qiskit.circuit.Instruction.name` attribute
        of ``gate`` will be used. All gates in the ``Target`` need unique
        names. Backends can differentiate between different
        parameterization of a single gate by providing a unique name for
        each (e.g. `"rx30"`, `"rx60", ``"rx90"`` similar to the example in the
        documentation for the :class:`~qiskit.transpiler.Target` class).
    angle_bounds (list): The bounds on the parameters for a given gate. This is specified by
        a list of tuples (low, high) which represent the low and high bound (inclusively) on
        what float values are allowed for the parameter in that position. If a parameter
        doesn't have an angle bound you can use ``None`` to represent that. For example if
        a 3 parameter gate only had a bound on the second parameter you would represent
        that with: ``[None, [0, 3.14], None]`` which means the first and third parameter
        allow any value but the second parameter only accepts values between 0 and 3.14.
Raises:
    AttributeError: If gate is already in map
    TranspilerError: If an operation class is passed in for ``instruction`` and no name
        is specified or ``properties`` is set.

### `update_instruction_properties`

```python
def update_instruction_properties(self, instruction, qargs, properties)
```

Update the property object for an instruction qarg pair already in the Target.

For ease of access, a user is able to obtain the mapping between an instruction's
applicable qargs and its instruction properties via the mapping protocol (using ``__getitem__``),
with the instruction's name as the key. This method is the only way to
modify/update the properties of an instruction in the ``Target``. Usage of the mapping protocol
for modifications is not supported.

Args:
    instruction (str): The instruction name to update
    qargs (tuple): The qargs to update the properties of
    properties (InstructionProperties): The properties to set for this instruction
Raises:
    KeyError: If ``instruction`` or ``qarg`` are not in the target

### `qargs_for_operation_name`

```python
def qargs_for_operation_name(self, operation)
```

Get the qargs for a given operation name

Args:
   operation (str): The operation name to get qargs for
Returns:
    set: The set of qargs the gate instance applies to.

### `durations`

```python
def durations(self)
```

Get an InstructionDurations object from the target

Returns:
    InstructionDurations: The instruction duration represented in the
        target

### `timing_constraints`

```python
def timing_constraints(self)
```

Get an :class:`~qiskit.transpiler.TimingConstraints` object from the target

Returns:
    TimingConstraints: The timing constraints represented in the ``Target``

### `operation_names`

```python
def operation_names(self)
```

Get the operation names in the target.

### `instructions`

```python
def instructions(self)
```

Get the list of tuples (:class:`~qiskit.circuit.Instruction`, (qargs))
for the target

For globally defined variable width operations the tuple will be of the form
``(class, None)`` where class is the actual operation class that
is globally defined.

### `instruction_properties`

```python
def instruction_properties(self, index)
```

Get the instruction properties for a specific instruction tuple

This method is to be used in conjunction with the
:attr:`~qiskit.transpiler.Target.instructions` attribute of a
:class:`~qiskit.transpiler.Target` object. You can use this method to quickly
get the instruction properties for an element of
:attr:`~qiskit.transpiler.Target.instructions` by using the index in that list.
However, if you're not working with :attr:`~qiskit.transpiler.Target.instructions`
directly it is likely more efficient to access the target directly via the name
and qubits to get the instruction properties. For example, if
:attr:`~qiskit.transpiler.Target.instructions` returned::

    [(XGate(), (0,)), (XGate(), (1,))]

you could get the properties of the ``XGate`` on qubit 1 with::

    props = target.instruction_properties(1)

but just accessing it directly via the name would be more efficient::

    props = target['x'][(1,)]

(assuming the ``XGate``'s canonical name in the target is ``'x'``)
This is especially true for larger targets as this will scale worse with the number
of instruction tuples in a target.

Args:
    index (int): The index of the instruction tuple from the
        :attr:`~qiskit.transpiler.Target.instructions` attribute. For, example
        if you want the properties from the third element in
        :attr:`~qiskit.transpiler.Target.instructions` you would set this to be ``2``.
Returns:
    InstructionProperties: The instruction properties for the specified instruction tuple

### `build_coupling_map`

```python
def build_coupling_map(self, two_q_gate=None, filter_idle_qubits=False)
```

Get a :class:`~qiskit.transpiler.CouplingMap` from this target.

If there is a mix of two qubit operations that have a connectivity
constraint and those that are globally defined this will also return
``None`` because the global connectivity means there is no constraint
on the target. If you wish to see the constraints of the two qubit
operations that have constraints you should use the ``two_q_gate``
argument to limit the output to the gates which have a constraint.

Args:
    two_q_gate (str): An optional gate name for a two qubit gate in
        the ``Target`` to generate the coupling map for. If specified the
        output coupling map will only have edges between qubits where
        this gate is present.
    filter_idle_qubits (bool): If set to ``True`` the output :class:`~.CouplingMap`
        will remove any qubits that don't have any operations defined in the
        target. Note that using this argument will result in an output
        :class:`~.CouplingMap` object which has holes in its indices
        which might differ from the assumptions of the class. The typical use
        case of this argument is to be paired with
        :meth:`.CouplingMap.connected_components` which will handle the holes
        as expected.
Returns:
    CouplingMap: The :class:`~qiskit.transpiler.CouplingMap` object
        for this target. If there are no connectivity constraints in
        the target this will return ``None``.

Raises:
    ValueError: If a non-two qubit gate is passed in for ``two_q_gate``.
    IndexError: If an Instruction not in the ``Target`` is passed in for
        ``two_q_gate``.

### `get`

```python
def get(self, key, default=None)
```

Gets an item from the Target. If not found return a provided default or `None`.

### `keys`

```python
def keys(self)
```

Return the keys (operation_names) of the Target

### `values`

```python
def values(self)
```

Return the Property Map (qargs -> InstructionProperties) of every instruction in the Target

### `items`

```python
def items(self)
```

Returns pairs of Gate names and its property map (str, dict[tuple, InstructionProperties])

### `seconds_to_dt`

```python
def seconds_to_dt(self, duration: float) -> int
```

Convert a given duration in seconds to units of dt

Args:
    duration: The duration in seconds, such as in an :class:`.InstructionProperties`
        field for an instruction in the target.

Returns
    duration: The duration in units of dt

### `from_configuration`

```python
def from_configuration(cls, basis_gates: list[str], num_qubits: int | None=None, coupling_map: CouplingMap | None=None, instruction_durations: InstructionDurations | None=None, concurrent_measurements: list[list[int]] | None=None, dt: float | None=None, timing_constraints: TimingConstraints | None=None, custom_name_mapping: dict[str, Any] | None=None) -> Target
```

Create a target object from the individual global configuration

Prior to the creation of the :class:`~.Target` class, the constraints
of a backend were represented by a collection of different objects
which combined represent a subset of the information contained in
the :class:`~.Target`. This function provides a simple interface
to convert those separate objects to a :class:`~.Target`.

This constructor will use the input from ``basis_gates``, ``num_qubits``,
and ``coupling_map`` to build a base model of the backend and the
``instruction_durations``, ``backend_properties``, and ``inst_map`` inputs
are then queried (in that order) based on that model to look up the properties
of each instruction and qubit. If there is an inconsistency between the inputs
any extra or conflicting information present in ``instruction_durations``,
``backend_properties``, or ``inst_map`` will be ignored.

Args:
    basis_gates: The list of basis gate names for the backend. For the
        target to be created these names must either be in the output
        from :func:`~.get_standard_gate_name_mapping` or present in the
        specified ``custom_name_mapping`` argument.
    num_qubits: The number of qubits supported on the backend.
    coupling_map: The coupling map representing connectivity constraints
        on the backend. If specified all gates from ``basis_gates`` will
        be supported on all qubits (or pairs of qubits).
    instruction_durations: Optional instruction durations for instructions. If specified
        it will take priority for setting the ``duration`` field in the
        :class:`~InstructionProperties` objects for the instructions in the target.
    concurrent_measurements(list): A list of sets of qubits that must be
        measured together. This must be provided
        as a nested list like ``[[0, 1], [2, 3, 4]]``.
    dt: The system time resolution of input signals in seconds
    timing_constraints: Optional timing constraints to include in the
        :class:`~.Target`
    custom_name_mapping: An optional dictionary that maps custom gate/operation names in
        ``basis_gates`` to an :class:`~.Operation` object representing that
        gate/operation. By default, most standard gates names are mapped to the
        standard gate object from :mod:`qiskit.circuit.library` this only needs
        to be specified if the input ``basis_gates`` defines gates in names outside
        that set.

Returns:
    Target: the target built from the input configuration

Raises:
    TranspilerError: If the input basis gates contain > 2 qubits and ``coupling_map`` is
    specified.
    KeyError: If no mapping is available for a specified ``basis_gate``.
