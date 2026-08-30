---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/resource/resource.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/resource/resource.py
license: Apache-2.0
---

## Module `pennylane/resource/resource.py`

Stores classes and logic to aggregate all the resource information from a quantum workflow.

## `Resources`

```python
class Resources
```

Contains attributes which store key resources such as number of gates, number of wires, shots,
depth and gate types.

Args:
    num_wires (int): number of qubits
    num_gates (int): number of gates
    gate_types (dict): dictionary storing operation names (str) as keys
        and the number of times they are used in the circuit (int) as values
    gate_sizes (dict): dictionary storing the number of :math:`n` qubit gates in the circuit
        as a key-value pair where :math:`n` is the key and the number of occurances is the value
    depth (int): the depth of the circuit defined as the maximum number of non-parallel operations
    shots (Shots): number of samples to generate

.. details::

    The resources being tracked can be accessed as class attributes.
    Additionally, the :code:`Resources` instance can be nicely displayed in the console.

    **Example**

    >>> from pennylane.resource import Resources
    >>> r = Resources(num_wires=2, num_gates=2, gate_types={'Hadamard': 1, 'CNOT':1}, gate_sizes={1: 1, 2: 1}, depth=2)
    >>> print(r)
    num_wires: 2
    num_gates: 2
    depth: 2
    shots: Shots(total=None)
    gate_types:
    {'Hadamard': 1, 'CNOT': 1}
    gate_sizes:
    {1: 1, 2: 1}

    :class:`~.Resources` objects can be added together or multiplied by a scalar.

    >>> from pennylane.resource import Resources
    >>> r1 = Resources(num_wires=2, num_gates=2, gate_types={'Hadamard': 1, 'CNOT':1}, gate_sizes={1: 1, 2: 1}, depth=2)
    >>> r2 = Resources(num_wires=2, num_gates=2, gate_types={'RX': 1, 'CNOT':1}, gate_sizes={1: 1, 2: 1}, depth=2)
    >>> print(r1 + r2)
    num_wires: 2
    num_gates: 4
    depth: 4
    shots: Shots(total=None)
    gate_types:
    {'Hadamard': 1, 'CNOT': 2, 'RX': 1}
    gate_sizes:
    {1: 2, 2: 2}
    >>> print(r1 * 2)
    num_wires: 2
    num_gates: 4
    depth: 4
    shots: Shots(total=None)
    gate_types:
    {'Hadamard': 2, 'CNOT': 2}
    gate_sizes:
    {1: 2, 2: 2}

### `__add__`

```python
def __add__(self, other: Resources)
```

Adds two :class:`~resource.Resources` objects together as if the circuits were executed in series.

Args:
    other (Resources): the resource object to add

Returns:
    Resources: the combined resources

.. details::

    **Example**

    First we build two :class:`~.resource.Resources` objects.

    .. code-block:: python

        from pennylane.measurements import Shots
        from pennylane.resource import Resources

        r1 = Resources(
            num_wires = 2,
            num_gates = 2,
            gate_types = {"Hadamard": 1, "CNOT": 1},
            gate_sizes = {1: 1, 2: 1},
            depth = 2,
            shots = Shots(10)
        )

        r2 = Resources(
            num_wires = 3,
            num_gates = 2,
            gate_types = {"RX": 1, "CNOT": 1},
            gate_sizes = {1: 1, 2: 1},
            depth = 1,
            shots = Shots((5, (2, 10)))
        )

    Now we print their sum.

    >>> print(r1 + r2)
    num_wires: 3
    num_gates: 4
    depth: 3
    shots: Shots(total=35, vector=[10 shots, 5 shots, 2 shots x 10])
    gate_types:
    {'Hadamard': 1, 'CNOT': 2, 'RX': 1}
    gate_sizes:
    {1: 2, 2: 2}

### `__mul__`

```python
def __mul__(self, scalar: int)
```

Multiply the :class:`~resource.Resources` object by a scalar as if that many copies of the circuit were executed in series

Args:
    scalar (int): the scalar to multiply the resource object by

Returns:
    Resources: the combined resources

.. details::

    **Example**

    First we build a :class:`~.resource.Resources` object.

    .. code-block:: python

        from pennylane.measurements import Shots
        from pennylane.resource import Resources

        resources = Resources(
            num_wires = 2,
            num_gates = 2,
            gate_types = {"Hadamard": 1, "CNOT": 1},
            gate_sizes = {1: 1, 2: 1},
            depth = 2,
            shots = Shots(10)
        )

    Now we print the product.

    >>> print(resources * 2)
    num_wires: 2
    num_gates: 4
    depth: 4
    shots: Shots(total=20)
    gate_types:
    {'Hadamard': 2, 'CNOT': 2}
    gate_sizes:
    {1: 2, 2: 2}

## `SpecsResources`

```python
class SpecsResources
```

Class for storing resource information for a quantum circuit. Contains attributes which store
key resources such as gate counts, number of wire allocations, measurements, and circuit depth.

Args:
    gate_types (dict[str, int]): A dictionary mapping gate names to their counts.
    gate_sizes (dict[int, int]): A dictionary mapping gate sizes to their counts.
    measurements (dict[str, int]): A dictionary mapping measurements to their counts.
    num_allocs (int): The number of unique wire allocations. For circuits that do not use
      dynamic wires, this should be equal to the number of device wires.
    depth (int | None): The depth of the circuit, or None if not computed.

Properties:
    num_gates (int): The total number of gates in the circuit (computed from `gate_types`).

.. details::

    Methods have been provided to allow pretty-printing, as well as
    indexing into it as a dictionary. See examples below.

    **Example**

    >>> from pennylane.resource import SpecsResources
    >>> res = SpecsResources(
    ...     gate_types={'Hadamard': 1, 'CNOT': 1},
    ...     gate_sizes={1: 1, 2: 1},
    ...     measurements={'expval(PauliZ)': 1},
    ...     num_allocs=2,
    ...     depth=2
    ... )

    >>> print(res.num_gates)
    2

    >>> print(res["num_gates"])
    2

    >>> print(res)
    Wire allocations: 2
    Total gates: 2
    Gate counts:
    - Hadamard: 1
    - CNOT: 1
    Measurements:
    - expval(PauliZ): 1
    Depth: 2

### `to_dict`

```python
def to_dict(self) -> dict[str, Any]
```

Convert the SpecsResources to a dictionary.

### `num_gates`

```python
def num_gates(self) -> int
```

Total number of gates in the circuit.

### `gate_counts`

```python
def gate_counts(self) -> dict[str, int]
```

Alias for ``gate_types``

### `to_pretty_str`

```python
def to_pretty_str(self, preindent: int=0) -> str
```

Pretty string representation of the SpecsResources object.

Args:
    preindent (int): Number of spaces to prepend to each line.

Returns:
    str: A pretty representation of this object.

## `CircuitSpecs`

```python
class CircuitSpecs
```

Class for storing specifications of a qnode. Contains resource information as well as additional
data such as the device, number of shots, and level of the requested specs.

Args:
    device_name (str): The name of the device used.
    num_device_wires (int): The number of wires on the device.
    shots (Shots): The shots configuration used.
    level (Any): The level of the specs (see :func:`~pennylane.specs` for more details).
    resources (SpecsResources | list[SpecsResources] |             dict[int | str, SpecsResources | list[SpecsResources]]): The resource specifications.
        Depending on the ``level`` chosen, this may be a single :class:`.SpecsResources` object,
        a list of :class:`.SpecsResources` objects, or a dictionary mapping levels to their
        corresponding outputs.

.. details::

    Some helpful methods have been added to this data class to allow pretty-printing, as well as
    indexing into it as a dictionary. See examples below.

    **Example**

    >>> from pennylane.resource import SpecsResources, CircuitSpecs
    >>> specs = CircuitSpecs(
    ...     device_name="default.qubit",
    ...     num_device_wires=2,
    ...     shots=Shots(1000),
    ...     level="device",
    ...     resources=SpecsResources(
    ...         gate_types={"RX": 2, "CNOT": 1},
    ...         gate_sizes={1: 2, 2: 1},
    ...         measurements={"expval(PauliZ)": 1},
    ...         num_allocs=2,
    ...         depth=3,
    ...     ),
    ... )

    >>> print(specs.num_device_wires)
    2

    >>> print(specs["num_device_wires"])
    2

    >>> print(specs)
    Device: default.qubit
    Device wires: 2
    Shots: Shots(total=1000)
    Level: device
    <BLANKLINE>
    Wire allocations: 2
    Total gates: 3
    Gate counts:
    - RX: 2
    - CNOT: 1
    Measurements:
    - expval(PauliZ): 1
    Depth: 3

### `to_dict`

```python
def to_dict(self) -> dict[str, Any]
```

Convert the CircuitSpecs to a dictionary.

### `to_pretty_str`

```python
def to_pretty_str(self, tabular: bool=True) -> str
```

Pretty string representation of the :class:`CircuitSpecs` object.

Args:
    tabular (bool): Whether to display the resources in a tabular format.

Returns:
    str: A pretty representation of this object.

## `ResourcesOperation`

```python
class ResourcesOperation(Operation)
```

Base class that represents quantum gates or channels applied to quantum
states and stores the resource requirements of the quantum gate.

.. note::
    Child classes must implement the :func:`~.ResourcesOperation.resources` method which computes
    the resource requirements of the operation.

### `resources`

```python
def resources(self) -> Resources
```

Compute the resources required for this operation.

Returns:
    Resources: The resources required by this operation.

**Examples**

>>> class CustomOp(ResourcesOperation):
...     num_wires = 2
...     def resources(self):
...         return Resources(num_wires=self.num_wires, num_gates=3, depth=2)
...
>>> op = CustomOp(wires=[0, 1])
>>> print(op.resources())
num_wires: 2
num_gates: 3
depth: 2
shots: Shots(total=None)
gate_types:
{}
gate_sizes:
{}

## `add_in_series`

```python
def add_in_series(r1: Resources, r2: Resources) -> Resources
```

Add two :class:`~.resource.Resources` objects assuming the circuits are executed in series.

The gates in ``r1`` and ``r2`` are assumed to act on the same qubits. The resulting circuit
depth is the sum of the depths of ``r1`` and ``r2``. To add resources as if they were executed
in parallel see :func:`~.resource.add_in_parallel`.

Args:
    r1 (Resources): a :class:`~resource.Resources` to add
    r2 (Resources): a :class:`~resource.Resources` to add

Returns:
    Resources: the combined resources

.. details::

    **Example**

    First we build two :class:`~.resource.Resources` objects.

    .. code-block:: python

        from pennylane.measurements import Shots
        from pennylane.resource import Resources

        r1 = Resources(
            num_wires = 2,
            num_gates = 2,
            gate_types = {"Hadamard": 1, "CNOT": 1},
            gate_sizes = {1: 1, 2: 1},
            depth = 2,
            shots = Shots(10)
        )

        r2 = Resources(
            num_wires = 3,
            num_gates = 2,
            gate_types = {"RX": 1, "CNOT": 1},
            gate_sizes = {1: 1, 2: 1},
            depth = 1,
            shots = Shots((5, (2, 10)))
        )

    Now we print their sum.

    >>> print(qp.resource.add_in_series(r1, r2))
    num_wires: 3
    num_gates: 4
    depth: 3
    shots: Shots(total=35, vector=[10 shots, 5 shots, 2 shots x 10])
    gate_types:
    {'Hadamard': 1, 'CNOT': 2, 'RX': 1}
    gate_sizes:
    {1: 2, 2: 2}

## `add_in_parallel`

```python
def add_in_parallel(r1: Resources, r2: Resources) -> Resources
```

Add two :class:`~.resource.Resources` objects assuming the circuits are executed in parallel.

The gates in ``r2`` and ``r2`` are assumed to act on disjoint sets of qubits. The resulting
circuit depth is the max depth of ``r1`` and ``r2``. To add resources as if they were executed
in series see :func:`~.resource.add_in_series`.

Args:
    r1 (Resources): a :class:`~.resource.Resources` object to add
    r2 (Resources): a :class:`~.resource.Resources` object to add

Returns:
    Resources: the combined resources

.. details::

    **Example**

    First we build two :class:`~.resource.Resources` objects.

    .. code-block:: python

        from pennylane.measurements import Shots
        from pennylane.resource import Resources

        r1 = Resources(
            num_wires = 2,
            num_gates = 2,
            gate_types = {"Hadamard": 1, "CNOT": 1},
            gate_sizes = {1: 1, 2: 1},
            depth = 2,
            shots = Shots(10)
        )

        r2 = Resources(
            num_wires = 3,
            num_gates = 2,
            gate_types = {"RX": 1, "CNOT": 1},
            gate_sizes = {1: 1, 2: 1},
            depth = 1,
            shots = Shots((5, (2, 10)))
        )

    Now we print their sum.

    >>> print(qp.resource.add_in_parallel(r1, r2))
    num_wires: 5
    num_gates: 4
    depth: 2
    shots: Shots(total=35, vector=[10 shots, 5 shots, 2 shots x 10])
    gate_types:
    {'Hadamard': 1, 'CNOT': 2, 'RX': 1}
    gate_sizes:
    {1: 2, 2: 2}

## `mul_in_series`

```python
def mul_in_series(resources: Resources, scalar: int) -> Resources
```

Multiply the :class:`~resource.Resources` object by a scalar as if the circuit was repeated that many times in series.

The repeated copies of ``resources`` are assumed to act on the same
wires as ``resources``. The resulting circuit depth is the depth of ``resources`` multiplied by
``scalar``. To multiply as if the circuit was repeated in parallel see
:func:`~.resource.mul_in_parallel`.

Args:
    resources (Resources): a :class:`~resource.Resources` to be scaled
    scalar (int): the scalar to multiply the :class:`~resource.Resources` by

Returns:
    Resources: the combined resources

.. details::

    **Example**

    First we build a :class:`~.resource.Resources` object.

    .. code-block:: python

        from pennylane.measurements import Shots
        from pennylane.resource import Resources

        resources = Resources(
            num_wires = 2,
            num_gates = 2,
            gate_types = {"Hadamard": 1, "CNOT": 1},
            gate_sizes = {1: 1, 2: 1},
            depth = 2,
            shots = Shots(10)
        )

    Now we print the product.

    >>> print(qp.resource.mul_in_series(resources, 2))
    num_wires: 2
    num_gates: 4
    depth: 4
    shots: Shots(total=20)
    gate_types:
    {'Hadamard': 2, 'CNOT': 2}
    gate_sizes:
    {1: 2, 2: 2}

## `mul_in_parallel`

```python
def mul_in_parallel(resources: Resources, scalar: int) -> Resources
```

Multiply the :class:`~resource.Resources` object by a scalar as if the circuit was repeated that many times in parallel.

The repeated copies of ``resources`` are assumed to act on disjoint qubits. The resulting circuit
depth is equal to the depth of ``resources``. To multiply as if the repeated copies were
executed in series see :func:`~.resource.mul_in_series`.

Args:
    resources (Resources): a :class:`~resource.Resources` to be scaled
    scalar (int): the scalar to multiply the :class:`~resource.Resources` by

Returns:
    Resources: The combined resources

.. details::

    **Example**

    First we build a :class:`~.resource.Resources` object.

    .. code-block:: python

        from pennylane.measurements import Shots
        from pennylane.resource import Resources

        resources = Resources(
            num_wires = 2,
            num_gates = 2,
            gate_types = {"Hadamard": 1, "CNOT": 1},
            gate_sizes = {1: 1, 2: 1},
            depth = 2,
            shots = Shots(10)
        )

    Now we print the product.

    >>> print(qp.resource.mul_in_parallel(resources, 2))
    num_wires: 4
    num_gates: 4
    depth: 2
    shots: Shots(total=20)
    gate_types:
    {'Hadamard': 2, 'CNOT': 2}
    gate_sizes:
    {1: 2, 2: 2}

## `substitute`

```python
def substitute(initial_resources: Resources, gate_info: tuple[str, int], replacement: Resources)
```

Replaces a specified gate in a :class:`~.resource.Resources` object with the contents of another :class:`~.resource.Resources` object.

Args:
    initial_resources (Resources): the :class:`~resource.Resources` object to be modified
    gate_info (Iterable(str, int)): sequence containing the name of the gate to be replaced and the number of wires it acts on
    replacement (Resources): the :class:`~resource.Resources` containing the resources that will replace the gate

Returns:
    Resources: the updated :class:`~resource.Resources` after substitution

.. details::

    **Example**

    First we build the :class:`~.resource.Resources`.

    .. code-block:: python

        from pennylane.measurements import Shots
        from pennylane.resource import Resources

        initial_resources = Resources(
            num_wires = 2,
            num_gates = 3,
            gate_types = {"RX": 2, "CNOT": 1},
            gate_sizes = {1: 2, 2: 1},
            depth = 2,
            shots = Shots(10)
        )

        # the RX gates will be replaced by the substitution
        gate_info = ("RX", 1)

        replacement = Resources(
            num_wires = 1,
            num_gates = 7,
            gate_types = {"Hadamard": 3, "S": 4},
            gate_sizes = {1: 7},
            depth = 7
        )


    Now we print the result of the substitution.

    >>> res = qp.resource.substitute(initial_resources, gate_info, replacement)
    >>> print(res)
    num_wires: 2
    num_gates: 15
    depth: 9
    shots: Shots(total=10)
    gate_types:
    {'CNOT': 1, 'Hadamard': 6, 'S': 8}
    gate_sizes:
    {1: 14, 2: 1}

## `resources_from_tape`

```python
def resources_from_tape(tape: QuantumScript, compute_depth: bool=True, compute_errors: bool=False) -> SpecsResources | tuple[SpecsResources, dict[str, Any]]
```

Extracts the resource information from a quantum circuit (tape).

The depth of the circuit is computed by default, but can be set to None
by setting the `compute_depth` argument to False.
This is useful when the depth is not needed, for example, in some
resource counting scenarios or heavy circuits where computing depth is expensive.

Args:
    tape (.QuantumScript): The quantum circuit for which we extract resources
    compute_depth (bool): If True, the depth of the circuit is computed and included in the resources.
        If False, the depth is set to None.
    compute_errors (bool): If True, algorithmic errors are computed and returned alongside the resources.
        Defaults to False.
Returns:
    (SpecsResources | tuple[SpecsResources, dict[str, Any]]): The resources associated with this tape, optionally
    with algorithmic errors if `compute_errors` is set to True.
