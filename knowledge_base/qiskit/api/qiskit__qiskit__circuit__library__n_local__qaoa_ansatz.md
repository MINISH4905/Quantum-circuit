---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/n_local/qaoa_ansatz.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/n_local/qaoa_ansatz.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/n_local/qaoa_ansatz.py`

A generalized QAOA quantum circuit with a support of custom initial states and mixers.

## `qaoa_ansatz`

```python
def qaoa_ansatz(cost_operator: BaseOperator, reps: int=1, initial_state: QuantumCircuit | None=None, mixer_operator: BaseOperator | None=None, insert_barriers: bool=False, name: str='QAOA', flatten: bool=True) -> QuantumCircuit
```

A generalized QAOA quantum circuit with a support of custom initial states and mixers.

Examples:

To define the QAOA ansatz we require a cost Hamiltonian, encoding the classical
optimization problem:

.. plot::
    :alt: Circuit diagram output by the previous code.
    :include-source:

    from qiskit.quantum_info import SparsePauliOp
    from qiskit.circuit.library import qaoa_ansatz

    cost_operator = SparsePauliOp(["ZZII", "IIZZ", "ZIIZ"])
    ansatz = qaoa_ansatz(cost_operator, reps=3, insert_barriers=True)
    ansatz.draw("mpl")

Args:
    cost_operator: The operator representing the cost of the optimization problem, denoted as
        :math:`U(C, \gamma)` in [1].
    reps: The integer determining the depth of the circuit, called :math:`p` in [1].
    initial_state: An optional initial state to use, which defaults to a layer of
        Hadamard gates preparing the :math:`|+\rangle^{\otimes n}` state.
        If a custom mixer is chosen, this circuit should be set to prepare its ground state,
        to appropriately fulfill the annealing conditions.
    mixer_operator: An optional custom mixer, which defaults to global Pauli-:math:`X`
        rotations. This is denoted as :math:`U(B, \beta)` in [1]. If this is set,
        the ``initial_state`` might also require modification.
    insert_barriers: Whether to insert barriers in-between the cost and mixer operators.
    name: The name of the circuit.
    flatten: If ``True``, a flat circuit is returned instead of nesting it inside multiple
        layers of gate objects. Setting this to ``False`` is significantly less performant,
        especially for parameter binding, but can be desirable for a cleaner visualization.

References:

[1] Farhi et al., A Quantum Approximate Optimization Algorithm.
`arXiv:1411.4028 <https://arxiv.org/pdf/1411.4028>`_

## `QAOAAnsatz`

```python
class QAOAAnsatz(EvolvedOperatorAnsatz)
```

A generalized QAOA quantum circuit with a support of custom initial states and mixers.

References:

[1] Farhi et al., A Quantum Approximate Optimization Algorithm.
`arXiv:1411.4028 <https://arxiv.org/pdf/1411.4028>`_

### `__init__`

```python
def __init__(self, cost_operator=None, reps: int=1, initial_state: QuantumCircuit | None=None, mixer_operator=None, name: str='QAOA', flatten: bool | None=None)
```

Args:
    cost_operator (BaseOperator or OperatorBase, optional): The operator
        representing the cost of the optimization problem, denoted as :math:`U(C, \gamma)`
        in the original paper. Must be set either in the constructor or via property setter.
    reps (int): The integer parameter p, which determines the depth of the circuit,
        as specified in the original paper, default is 1.
    initial_state (QuantumCircuit, optional): An optional initial state to use.
        If `None` is passed then a set of Hadamard gates is applied as an initial state
        to all qubits.
    mixer_operator (BaseOperator or OperatorBase or QuantumCircuit, optional): An optional
        custom mixer to use instead of the global X-rotations, denoted as :math:`U(B, \beta)`
        in the original paper. Can be an operator or an optionally parameterized quantum
        circuit.
    name (str): A name of the circuit, default 'qaoa'
    flatten: Set this to ``True`` to output a flat circuit instead of nesting it inside multiple
        layers of gate objects. By default currently the contents of
        the output circuit will be wrapped in nested objects for
        cleaner visualization. However, if you're using this circuit
        for anything besides visualization its **strongly** recommended
        to set this flag to ``True`` to avoid a large performance
        overhead for parameter binding.

### `parameter_bounds`

```python
def parameter_bounds(self) -> list[tuple[float | None, float | None]] | None
```

The parameter bounds for the unbound parameters in the circuit.

Returns:
    A list of pairs indicating the bounds, as (lower, upper). None indicates an unbounded
    parameter in the corresponding direction. If None is returned, problem is fully
    unbounded.

### `parameter_bounds`

```python
def parameter_bounds(self, bounds: list[tuple[float | None, float | None]] | None) -> None
```

Set the parameter bounds.

Args:
    bounds: The new parameter bounds.

### `operators`

```python
def operators(self) -> list
```

The operators that are evolved in this circuit.

Returns:
     List[Union[BaseOperator, OperatorBase, QuantumCircuit]]: The operators to be evolved
        (and circuits) in this ansatz.

### `cost_operator`

```python
def cost_operator(self)
```

Returns an operator representing the cost of the optimization problem.

Returns:
    BaseOperator or OperatorBase: cost operator.

### `cost_operator`

```python
def cost_operator(self, cost_operator) -> None
```

Sets cost operator.

Args:
    cost_operator (BaseOperator or OperatorBase, optional): cost operator to set.

### `reps`

```python
def reps(self) -> int
```

Returns the `reps` parameter, which determines the depth of the circuit.

### `reps`

```python
def reps(self, reps: int) -> None
```

Sets the `reps` parameter.

### `initial_state`

```python
def initial_state(self) -> QuantumCircuit | None
```

Returns an optional initial state as a circuit

### `initial_state`

```python
def initial_state(self, initial_state: QuantumCircuit | None) -> None
```

Sets initial state.

### `mixer_operator`

```python
def mixer_operator(self)
```

Returns an optional mixer operator expressed as an operator or a quantum circuit.

Returns:
    BaseOperator or OperatorBase or QuantumCircuit, optional: mixer operator or circuit.

### `mixer_operator`

```python
def mixer_operator(self, mixer_operator) -> None
```

Sets mixer operator.

Args:
    mixer_operator (BaseOperator or OperatorBase or QuantumCircuit, optional): mixer
        operator or circuit to set.
