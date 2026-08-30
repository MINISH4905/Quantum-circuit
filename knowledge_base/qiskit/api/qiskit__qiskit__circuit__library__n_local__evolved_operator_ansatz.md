---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/n_local/evolved_operator_ansatz.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/n_local/evolved_operator_ansatz.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/n_local/evolved_operator_ansatz.py`

The evolved operator ansatz.

## `evolved_operator_ansatz`

```python
def evolved_operator_ansatz(operators: BaseOperator | Sequence[BaseOperator], reps: int=1, evolution: EvolutionSynthesis | None=None, insert_barriers: bool=False, name: str='EvolvedOps', parameter_prefix: str | Sequence[str]='t', remove_identities: bool=True, flatten: bool | None=None) -> QuantumCircuit
```

Construct an ansatz out of operator evolutions.

For a set of operators :math:`[O_1, ..., O_J]` and :math:`R` repetitions (``reps``), this circuit
is defined as

.. math::

    \prod_{r=1}^{R} \left( \prod_{j=J}^1 e^{-i\theta_{j, r} O_j} \right)

where the exponentials :math:`exp(-i\theta O_j)` are expanded using the product formula
specified by ``evolution``.

Examples:

.. plot::
    :alt: Circuit diagram output by the previous code.
    :include-source:

    from qiskit.circuit.library import evolved_operator_ansatz
    from qiskit.quantum_info import Pauli

    ops = [Pauli("ZZI"), Pauli("IZZ"), Pauli("IXI")]
    ansatz = evolved_operator_ansatz(ops, reps=3, insert_barriers=True)
    ansatz.draw("mpl")

Args:
    operators: The operators to evolve. Can be a single operator or a sequence thereof.
    reps: The number of times to repeat the evolved operators.
    evolution: A specification of which evolution synthesis to use for the
        :class:`.PauliEvolutionGate`. Defaults to first order Trotterization. Note, that
        operators of type :class:`.Operator` are evolved using the :class:`.HamiltonianGate`,
        as there are no Hamiltonian terms to expand in Trotterization.
    insert_barriers: Whether to insert barriers in between each evolution.
    name: The name of the circuit.
    parameter_prefix: Set the names of the circuit parameters. If a string, the same prefix
        will be used for each parameter. Can also be a list to specify a prefix per
        operator.
    remove_identities: If ``True``, ignore identity operators (note that we do not check
        :class:`.Operator` inputs). This will also remove parameters associated with identities.
    flatten: If ``True``, a flat circuit is returned instead of nesting it inside multiple
        layers of gate objects. Setting this to ``False`` is significantly less performant,
        especially for parameter binding, but can be desirable for a cleaner visualization.

## `hamiltonian_variational_ansatz`

```python
def hamiltonian_variational_ansatz(hamiltonian: SparsePauliOp | Sequence[SparsePauliOp], reps: int=1, insert_barriers: bool=False, name: str='HVA', parameter_prefix: str='t') -> QuantumCircuit
```

Construct a Hamiltonian variational ansatz.

For a Hamiltonian :math:`H = \sum_{k=1}^K H_k` where the terms :math:`H_k` consist of only
commuting Paulis, but the terms do not commute among each other :math:`[H_k, H_{k'}] \neq 0`, the
Hamiltonian variational ansatz (HVA) is

.. math::

    \prod_{r=1}^{R} \left( \prod_{k=K}^1 e^{-i\theta_{k, r} H_k} \right)

where the exponentials :math:`exp(-i\theta H_k)` are implemented exactly [1, 2]. Note that this
differs from :func:`.evolved_operator_ansatz`, where no assumptions on the structure of the
operators are done.

The Hamiltonian can be passed as :class:`.SparsePauliOp`, in which case we split the Hamiltonian
into commuting terms :math:`\{H_k\}_k`. Note, that this may not be optimal and if the
minimal set of commuting terms is known it can be passed as sequence into this function.

Examples:

A single operator will be split into commuting terms automatically:

.. plot::
    :alt: Circuit diagram output by the previous code.
    :include-source:

    from qiskit.quantum_info import SparsePauliOp
    from qiskit.circuit.library import hamiltonian_variational_ansatz

    # this Hamiltonian will be split into the two terms [ZZI, IZZ] and [IXI]
    hamiltonian = SparsePauliOp(["ZZI", "IZZ", "IXI"])
    ansatz = hamiltonian_variational_ansatz(hamiltonian, reps=2)
    ansatz.draw("mpl")

Alternatively, we can directly provide the terms:

.. plot::
    :alt: Circuit diagram output by the previous code.
    :include-source:

    from qiskit.quantum_info import SparsePauliOp
    from qiskit.circuit.library import hamiltonian_variational_ansatz

    zz = SparsePauliOp(["ZZI", "IZZ"])
    x = SparsePauliOp(["IXI"])
    ansatz = hamiltonian_variational_ansatz([zz, x], reps=2)
    ansatz.draw("mpl")


Args:
    hamiltonian: The Hamiltonian to evolve. If given as single operator, it will be split into
        commuting terms. If a sequence of :class:`.SparsePauliOp`, then it is assumed that
        each element consists of commuting terms, but the elements do not commute among each
        other.
    reps: The number of times to repeat the evolved operators.
    insert_barriers: Whether to insert barriers in between each evolution.
    name: The name of the circuit.
    parameter_prefix: Set the names of the circuit parameters. If a string, the same prefix
        will be used for each parameter. Can also be a list to specify a prefix per
        operator.

References:

[1] D. Wecker et al. Progress towards practical quantum variational algorithms (2015)
`Phys Rev A 92, 042303 <https://journals.aps.org/pra/abstract/10.1103/PhysRevA.92.042303>`__

[2] R. Wiersema et al. Exploring entanglement and optimization within the Hamiltonian
Variational Ansatz (2020) `arXiv:2008.02941 <https://arxiv.org/abs/2008.02941>`__

## `EvolvedOperatorAnsatz`

```python
class EvolvedOperatorAnsatz(NLocal)
```

The evolved operator ansatz.

### `__init__`

```python
def __init__(self, operators=None, reps: int=1, evolution=None, insert_barriers: bool=False, name: str='EvolvedOps', parameter_prefix: str | Sequence[str]='t', initial_state: QuantumCircuit | None=None, flatten: bool | None=None)
```

Args:
    operators (BaseOperator | QuantumCircuit | list | None): The operators
        to evolve. If a circuit is passed, we assume it implements an already evolved
        operator and thus the circuit is not evolved again. Can be a single operator
        (circuit) or a list of operators (and circuits).
    reps: The number of times to repeat the evolved operators.
    evolution (EvolutionBase | EvolutionSynthesis | None):
        A specification of which evolution synthesis to use for the
        :class:`.PauliEvolutionGate`.
        Defaults to first order Trotterization.
    insert_barriers: Whether to insert barriers in between each evolution.
    name: The name of the circuit.
    parameter_prefix: Set the names of the circuit parameters. If a string, the same prefix
        will be used for each parameter. Can also be a list to specify a prefix per
        operator.
    initial_state: A :class:`.QuantumCircuit` object to prepend to the circuit.
    flatten: Set this to ``True`` to output a flat circuit instead of nesting it inside multiple
        layers of gate objects. By default currently the contents of
        the output circuit will be wrapped in nested objects for
        cleaner visualization. However, if you're using this circuit
        for anything besides visualization its **strongly** recommended
        to set this flag to ``True`` to avoid a large performance
        overhead for parameter binding.

### `num_qubits`

```python
def num_qubits(self) -> int
```

Returns the number of qubits in this circuit.

Returns:
    The number of qubits.

### `evolution`

```python
def evolution(self)
```

The evolution converter used to compute the evolution.

Returns:
    EvolutionSynthesis: The evolution converter used to compute the evolution.

### `evolution`

```python
def evolution(self, evol) -> None
```

Sets the evolution converter used to compute the evolution.

Args:
    evol (EvolutionSynthesis): An evolution synthesis object

### `operators`

```python
def operators(self)
```

The operators that are evolved in this circuit.

Returns:
    list: The operators to be evolved (and circuits) contained in this ansatz.

### `operators`

```python
def operators(self, operators=None) -> None
```

Set the operators to be evolved.

operators (Optional[Union[QuantumCircuit, list]]): The operators to evolve.
    If a circuit is passed, we assume it implements an already evolved operator and thus
    the circuit is not evolved again. Can be a single operator (circuit) or a list of
    operators (and circuits).

### `preferred_init_points`

```python
def preferred_init_points(self)
```

Getter of preferred initial points based on the given initial state.
