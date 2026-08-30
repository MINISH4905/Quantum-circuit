---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/instruction.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/instruction.py
license: Apache-2.0
---

## Module `qiskit/circuit/instruction.py`

A generic quantum instruction.

Instructions can be implementable on hardware (u, cx, etc.) or in simulation
(snapshot, noise, etc.).

Instructions can be unitary (a.k.a Gate) or non-unitary.

Instructions are identified by the following:

    name: A string to identify the type of instruction.
          Used to request a specific instruction on the backend, or in visualizing circuits.

    num_qubits, num_clbits: dimensions of the instruction.

    params: List of parameters to specialize a specific instruction instance.

Instructions do not have any context about where they are in a circuit (which qubits/clbits).
The circuit itself keeps this context.

## `Instruction`

```python
class Instruction(Operation)
```

Generic quantum instruction.

### `__init__`

```python
def __init__(self, name, num_qubits, num_clbits, params, label=None)
```

.. deprecated:: 1.3
   The parameters ``duration`` and ``unit`` are deprecated since
   Qiskit 1.3, and they will be removed in 2.0 or later.
   An instruction's duration is defined in a backend's Target object.

Args:
    name (str): instruction name
    num_qubits (int): instruction's qubit width
    num_clbits (int): instruction's clbit width
    params (list[int|float|complex|str|ndarray|list|ParameterExpression]):
        list of parameters
    label (str or None): An optional label for identifying the instruction.

Raises:
    CircuitError: when the register is not in the correct format.
    TypeError: when the optional label is provided, but it is not a string.

### `base_class`

```python
def base_class(self) -> type[Instruction]
```

Get the base class of this instruction.  This is guaranteed to be in the inheritance tree
of ``self``.

The "base class" of an instruction is the lowest class in its inheritance tree that the
object should be considered entirely compatible with for _all_ circuit applications.  This
typically means that the subclass is defined purely to offer some sort of programmer
convenience over the base class, and the base class is the "true" class for a behavioral
perspective.  In particular, you should *not* override :attr:`base_class` if you are
defining a custom version of an instruction that will be implemented differently by
hardware, such as an alternative measurement strategy, or a version of a parametrized gate
with a particular set of parameters for the purposes of distinguishing it in a
:class:`.Target` from the full parametrized gate.

This is often exactly equivalent to ``type(obj)``, except in the case of singleton instances
of standard-library instructions.  These singleton instances are special subclasses of their
base class, and this property will return that base.  For example::

    >>> isinstance(XGate(), XGate)
    True
    >>> type(XGate()) is XGate
    False
    >>> XGate().base_class is XGate
    True

In general, you should not rely on the precise class of an instruction; within a given
circuit, it is expected that :attr:`Instruction.name` should be a more suitable
discriminator in most situations.

### `mutable`

```python
def mutable(self) -> bool
```

Is this instance is a mutable unique instance or not.

If this attribute is ``False`` the gate instance is a shared singleton
and is not mutable.

### `to_mutable`

```python
def to_mutable(self)
```

Return a mutable copy of this gate.

This method will return a new mutable copy of this gate instance.
If a singleton instance is being used this will be a new unique
instance that can be mutated. If the instance is already mutable it
will be a deepcopy of that instance.

### `__eq__`

```python
def __eq__(self, other)
```

Two instructions are the same if they have the same name,
same dimensions, and same params.

Args:
    other (instruction): other instruction

Returns:
    bool: are self and other equal.

### `__repr__`

```python
def __repr__(self) -> str
```

Generates a representation of the Instruction object instance
Returns:
    str: A representation of the Instruction instance with the name,
         number of qubits, classical bits and params( if any )

### `soft_compare`

```python
def soft_compare(self, other: Instruction) -> bool
```

Soft comparison between gates. Their names, number of qubits, and classical
bit numbers must match. The number of parameters must match. Each parameter
is compared. If one is a ParameterExpression then it is not taken into
account.

Args:
    other (instruction): other instruction.

Returns:
    bool: are self and other equal up to parameter expressions.

### `params`

```python
def params(self)
```

The parameters of this :class:`Instruction`.  Ideally these will be gate angles.

### `validate_parameter`

```python
def validate_parameter(self, parameter)
```

Instruction parameter has no validation or normalization.

### `is_parameterized`

```python
def is_parameterized(self)
```

Return whether the :class:`Instruction` contains :ref:`compile-time parameters
<circuit-compile-time-parameters>`.

### `definition`

```python
def definition(self)
```

Return definition in terms of other basic gates.

### `definition`

```python
def definition(self, array)
```

Set gate representation

### `decompositions`

```python
def decompositions(self)
```

Get the decompositions of the instruction from the SessionEquivalenceLibrary.

### `decompositions`

```python
def decompositions(self, decompositions)
```

Set the decompositions of the instruction from the SessionEquivalenceLibrary.

### `add_decomposition`

```python
def add_decomposition(self, decomposition)
```

Add a decomposition of the instruction to the SessionEquivalenceLibrary.

### `label`

```python
def label(self) -> str
```

Return instruction label

### `label`

```python
def label(self, name: str)
```

Set instruction label to name

Args:
    name (str or None): label to assign instruction

Raises:
    TypeError: name is not string or None.

### `reverse_ops`

```python
def reverse_ops(self)
```

For a composite instruction, reverse the order of sub-instructions.

This is done by recursively reversing all sub-instructions.
It does not invert any gate.

Returns:
    qiskit.circuit.Instruction: a new instruction with
        sub-instructions reversed.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Invert this instruction.

If `annotated` is `False`, the inverse instruction is implemented as
a fresh instruction with the recursively inverted definition.

If `annotated` is `True`, the inverse instruction is implemented as
:class:`.AnnotatedOperation`, and corresponds to the given instruction
annotated with the "inverse modifier".

Special instructions inheriting from Instruction can
implement their own inverse (e.g. T and Tdg, Barrier, etc.)
In particular, they can choose how to handle the argument ``annotated``
which may include ignoring it and always returning a concrete gate class
if the inverse is defined as a standard gate.

Args:
    annotated: if set to `True` the output inverse gate will be returned
        as :class:`.AnnotatedOperation`.

Returns:
    The inverse operation.

Raises:
    CircuitError: if the instruction is not composite
        and an inverse has not been implemented for it.

### `copy`

```python
def copy(self, name=None)
```

Copy of the instruction.

Args:
    name (str): name to be given to the copied circuit, if ``None`` then the name stays the same.

Returns:
    qiskit.circuit.Instruction: a copy of the current instruction, with the name updated if it
    was provided

### `broadcast_arguments`

```python
def broadcast_arguments(self, qargs, cargs)
```

Validation of the arguments.

Args:
    qargs (List): List of quantum bit arguments.
    cargs (List): List of classical bit arguments.

Yields:
    Tuple(List, List): A tuple with single arguments.

Raises:
    CircuitError: If the input is not valid. For example, the number of
        arguments does not match the gate expectation.

### `repeat`

```python
def repeat(self, n)
```

Creates an instruction with ``self`` repeated :math:`n` times.

Args:
    n (int): Number of times to repeat the instruction

Returns:
    qiskit.circuit.Instruction: Containing the definition.

Raises:
    CircuitError: If n < 1.

### `name`

```python
def name(self)
```

Return the name.

### `name`

```python
def name(self, name)
```

Set the name.

### `num_qubits`

```python
def num_qubits(self)
```

Return the number of qubits.

### `num_qubits`

```python
def num_qubits(self, num_qubits)
```

Set num_qubits.

### `num_clbits`

```python
def num_clbits(self)
```

Return the number of clbits.

### `num_clbits`

```python
def num_clbits(self, num_clbits)
```

Set num_clbits.
