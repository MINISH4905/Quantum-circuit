---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/blueprintcircuit.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/blueprintcircuit.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/blueprintcircuit.py`

Blueprint circuit object.

## `BlueprintCircuit`

```python
class BlueprintCircuit(QuantumCircuit, ABC)
```

Blueprint circuit object.

In many applications it is necessary to pass around the structure a circuit will have without
explicitly knowing e.g. its number of qubits, or other missing information. This can be solved
by having a circuit that knows how to construct itself, once all information is available.

This class provides an interface for such circuits. Before internal data of the circuit is
accessed, the ``_build`` method is called. There the configuration of the circuit is checked.

### `__init__`

```python
def __init__(self, *regs, name: str | None=None) -> None
```

Create a new blueprint circuit.

### `qregs`

```python
def qregs(self)
```

A list of the quantum registers associated with the circuit.

### `qregs`

```python
def qregs(self, qregs)
```

Set the quantum registers associated with the circuit.

### `data`

```python
def data(self)
```

The circuit data (instructions and context).

Returns:
    QuantumCircuitData: a list-like object containing the :class:`.CircuitInstruction`\ s
    for each instruction.

### `num_parameters`

```python
def num_parameters(self) -> int
```

The number of parameter objects in the circuit.

### `parameters`

```python
def parameters(self) -> ParameterView
```

The parameters defined in the circuit.

This attribute returns the :class:`.Parameter` objects in the circuit sorted
alphabetically. Note that parameters instantiated with a :class:`.ParameterVector`
are still sorted numerically.

Examples:

    The snippet below shows that insertion order of parameters does not matter.

    .. code-block:: python

        >>> from qiskit.circuit import QuantumCircuit, Parameter
        >>> a, b, elephant = Parameter("a"), Parameter("b"), Parameter("elephant")
        >>> circuit = QuantumCircuit(1)
        >>> circuit.rx(b, 0)
        >>> circuit.rz(elephant, 0)
        >>> circuit.ry(a, 0)
        >>> circuit.parameters  # sorted alphabetically!
        ParameterView([Parameter(a), Parameter(b), Parameter(elephant)])

    Bear in mind that alphabetical sorting might be unintuitive when it comes to numbers.
    The literal "10" comes before "2" in strict alphabetical sorting.

    .. code-block:: python

        >>> from qiskit.circuit import QuantumCircuit, Parameter
        >>> angles = [Parameter("angle_1"), Parameter("angle_2"), Parameter("angle_10")]
        >>> circuit = QuantumCircuit(1)
        >>> circuit.u(*angles, 0)
        >>> circuit.draw()
           ┌─────────────────────────────┐
        q: ┤ U(angle_1,angle_2,angle_10) ├
           └─────────────────────────────┘
        >>> circuit.parameters
        ParameterView([Parameter(angle_1), Parameter(angle_10), Parameter(angle_2)])

    To respect numerical sorting, a :class:`.ParameterVector` can be used.

    .. code-block:: python

        >>> from qiskit.circuit import QuantumCircuit, Parameter, ParameterVector
        >>> x = ParameterVector("x", 12)
        >>> circuit = QuantumCircuit(1)
        >>> for x_i in x:
        ...     circuit.rx(x_i, 0)
        >>> circuit.parameters
        ParameterView([
            ParameterVectorElement(x[0]), ParameterVectorElement(x[1]),
            ParameterVectorElement(x[2]), ParameterVectorElement(x[3]),
            ..., ParameterVectorElement(x[11])
        ])


Returns:
    The sorted :class:`.Parameter` objects in the circuit.

### `copy_empty_like`

```python
def copy_empty_like(self, name: str | None=None, *, vars_mode: str='alike') -> QuantumCircuit
```

Return an empty :class:`.QuantumCircuit` of same size and metadata.

See also :meth:`.QuantumCircuit.copy_empty_like` for more details on copied metadata.

Args:
    name: Name for the copied circuit. If None, then the name stays the same.
    vars_mode: The mode to handle realtime variables in.

Returns:
    An empty circuit of same dimensions. Note that the result is no longer a
    :class:`.BlueprintCircuit`.

### `copy`

```python
def copy(self, name: str | None=None) -> BlueprintCircuit
```

Copy the blueprint circuit.

Args:
    name: Name to be given to the copied circuit. If None, then the name stays the same.

Returns:
    A deepcopy of the current blueprint circuit, with the specified name.
