---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/optimization/pattern_matching.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/optimization/pattern_matching.py
license: Apache-2.0
---

## Module `pennylane/transforms/optimization/pattern_matching.py`

Transform finding all maximal matches of a pattern in a quantum circuit and optimizing the circuit by
substitution.

## `pattern_matching_optimization`

```python
def pattern_matching_optimization(tape: QuantumScript, pattern_tapes, custom_quantum_cost=None) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Quantum function transform to optimize a circuit given a list of patterns (templates).

Args:
    tape (QNode or QuantumTape or Callable): A quantum circuit to be optimized (QNode or quantum function).
    pattern_tapes(list(.QuantumTape)): List of quantum tapes that implement the identity.
    custom_quantum_cost (dict): Optional, quantum cost that overrides the default cost dictionary.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]: The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

Raises:
    QuantumFunctionError: The pattern provided is not a valid QuantumTape or the pattern contains measurements or
        the pattern does not implement identity or the circuit has less qubits than the pattern.

**Example**

You can apply the transform directly on a :class:`QNode`. For that, you need first to define a pattern that is to be
found in the circuit. We use the following pattern that implements the identity:

.. code-block:: python

    import pennylane as qp

    ops = [qp.S(0), qp.S(0), qp.Z(0)]
    pattern = qp.tape.QuantumTape(ops)

Let's consider the following circuit where we want to replace a sequence of two ``pennylane.S`` gates with a
``pennylane.PauliZ`` gate.

.. code-block:: python

    dev = qp.device('default.qubit', wires=5)

    @qp.transforms.pattern_matching_optimization(pattern_tapes = [pattern])
    @qp.qnode(device=dev)
    def circuit():
        qp.S(wires=0)
        qp.Z(0)
        qp.S(wires=1)
        qp.CZ(wires=[0, 1])
        qp.S(wires=1)
        qp.S(wires=2)
        qp.CZ(wires=[1, 2])
        qp.S(wires=2)
        return qp.expval(qp.X(0))

During the call of the circuit, it is first optimized (if possible) and then executed.

>>> print(qp.draw(circuit)())
0: ──S†─╭●────┤  <X>
1: ──Z──╰Z─╭●─┤
2: ──Z─────╰Z─┤

.. details::
    :title: Usage Details

    .. code-block:: python

        def circuit():
            qp.S(wires=0)
            qp.Z(0)
            qp.S(wires=1)
            qp.CZ(wires=[0, 1])
            qp.S(wires=1)
            qp.S(wires=2)
            qp.CZ(wires=[1, 2])
            qp.S(wires=2)
            return qp.expval(qp.X(0))

    For optimizing the circuit given the following template of CNOTs we apply the ``pattern_matching``
    transform.

    >>> qnode = qp.QNode(circuit, dev)
    >>> optimized_qnode = pattern_matching_optimization(qnode, pattern_tapes=[pattern])

    >>> print(qp.draw(qnode)())
    0: ──S──Z─╭●──────────┤  <X>
    1: ──S────╰Z──S─╭●────┤
    2: ──S──────────╰Z──S─┤

    >>> print(qp.draw(optimized_qnode)())
    0: ──S†─╭●────┤  <X>
    1: ──Z──╰Z─╭●─┤
    2: ──Z─────╰Z─┤

    Note that with this pattern we also replace a ``pennylane.S``, ``pennylane.PauliZ`` sequence by
    ``Adjoint(S)``. If one would like avoiding this, it possible to give a custom
    quantum cost dictionary with a negative cost for ``pennylane.PauliZ``.

    >>> my_cost = {"PauliZ": -1 , "S": 1, "Adjoint(S)": 1}
    >>> optimized_qnode = pattern_matching_optimization(qnode, pattern_tapes=[pattern], custom_quantum_cost=my_cost)

    >>> print(qp.draw(optimized_qnode)())
    0: ──S──Z─╭●────┤  <X>
    1: ──Z────╰Z─╭●─┤
    2: ──Z───────╰Z─┤

    Now we can consider a more complicated example with the following quantum circuit to be optimized

    .. code-block:: python

        def circuit():
            qp.Toffoli(wires=[3, 4, 0])
            qp.CNOT(wires=[1, 4])
            qp.CNOT(wires=[2, 1])
            qp.Hadamard(wires=3)
            qp.Z(1)
            qp.CNOT(wires=[2, 3])
            qp.Toffoli(wires=[2, 3, 0])
            qp.CNOT(wires=[1, 4])
            return qp.expval(qp.X(0))

    We define a pattern that implement the identity:

    .. code-block:: python

        ops = [
            qp.CNOT(wires=[1, 2]),
            qp.CNOT(wires=[0, 1]),
            qp.CNOT(wires=[1, 2]),
            qp.CNOT(wires=[0, 1]),
            qp.CNOT(wires=[0, 2]),
        ]
        cnot_pattern = qp.tape.QuantumTape(ops)

    For optimizing the circuit given the following pattern of CNOTs we apply the ``pattern_matching``
    transform.

    >>> dev = qp.device('default.qubit', wires=5)
    >>> qnode = qp.QNode(circuit, dev)
    >>> optimized_qnode = pattern_matching_optimization(qnode, pattern_tapes=[cnot_pattern])

    In our case, it is possible to find three CNOTs and replace this pattern with only two CNOTs and therefore
    optimizing the circuit. The number of CNOTs in the circuit is reduced by one.

    >>> qp.specs(qnode)()["resources"].gate_types["CNOT"]
    4

    >>> qp.specs(optimized_qnode)()["resources"].gate_types["CNOT"]
    3

    >>> print(qp.draw(qnode)())
    0: ─╭X──────────╭X────┤  <X>
    1: ─│──╭●─╭X──Z─│──╭●─┤
    2: ─│──│──╰●─╭●─├●─│──┤
    3: ─├●─│───H─╰X─╰●─│──┤
    4: ─╰●─╰X──────────╰X─┤

    >>> print(qp.draw(optimized_qnode)())
    0: ─╭X──────────╭X─┤  <X>
    1: ─│─────╭X──Z─│──┤
    2: ─│──╭●─╰●─╭●─├●─┤
    3: ─├●─│───H─╰X─╰●─┤
    4: ─╰●─╰X──────────┤

.. seealso:: :func:`~.pattern_matching`

**References**

[1] Iten, R., Moyard, R., Metger, T., Sutter, D. and Woerner, S., 2022.
Exact and practical pattern matching for quantum circuit optimization.
`doi.org/10.1145/3498325 <https://dl.acm.org/doi/abs/10.1145/3498325>`_

## `pattern_matching`

```python
def pattern_matching(circuit_dag, pattern_dag)
```

Function that applies the pattern matching algorithm and returns the list of maximal matches.

Args:
    circuit_dag (.CommutationDAG): A commutation DAG representing the circuit to be optimized.
    pattern_dag(.CommutationDAG): A commutation DAG representing the pattern.

Returns:
    list(Match): the list of maximal matches.

**Example**

First let's consider the following circuit

.. code-block:: python

    def circuit():
        qp.S(wires=0)
        qp.Z(0)
        qp.S(wires=1)
        qp.CZ(wires=[0, 1])
        qp.S(wires=1)
        qp.S(wires=2)
        qp.CZ(wires=[1, 2])
        qp.S(wires=2)
        return qp.expval(qp.X(0))

Assume that we want to find all maximal matches of a pattern containing a sequence of two :class:`~.S` gates and
a :class:`~.PauliZ` gate:

.. code-block:: python

    def pattern():
        qp.S(wires=0)
        qp.S(wires=0)
        qp.Z(0)


>>> circuit_dag = qp.commutation_dag(circuit)()
>>> pattern_dag = qp.commutation_dag(pattern)()
>>> all_max_matches = qp.pattern_matching(circuit_dag, pattern_dag)

The matches are accessible by looping through the list outputted by ``qp.pattern_matching``. This output is a list
of lists containing indices. Each list represents a match between a gate in the pattern with a gate in the circuit.
The first indices represent the gates in the pattern and the second indices provide indices for the gates in the
circuit (by order of appearance).

>>> for match_conf in all_max_matches:
...     print(match_conf.match)
[[0, 0], [2, 1]]
[[0, 2], [1, 4]]
[[0, 4], [1, 2]]
[[0, 5], [1, 7]]
[[0, 7], [1, 5]]

The first match of this list corresponds to match the first gate (:class:`~.S`) in the pattern with the first gate
in the circuit and also the third gate in the pattern (:class:`~.PauliZ`) with the second circuit gate.

.. seealso:: :func:`~.pattern_matching_optimization`

**Reference:**

[1] Iten, R., Moyard, R., Metger, T., Sutter, D. and Woerner, S., 2022.
Exact and practical pattern matching for quantum circuit optimization.
`doi.org/10.1145/3498325 <https://dl.acm.org/doi/abs/10.1145/3498325>`_

## `ForwardMatch`

```python
class ForwardMatch
```

Class to apply pattern matching in the forward direction.

### `__init__`

```python
def __init__(self, circuit_dag, pattern_dag, node_id_c, node_id_p, wires, control_wires, target_wires)
```

Create the ForwardMatch class.
Args:
    circuit_dag (.CommutationDAG): circuit as commutation DAG.
    pattern_dag (.CommutationDAG): pattern as commutation DAG.
    node_id_c (int): index of the first gate matched in the circuit.
    node_id_p (int): index of the first gate matched in the pattern.

### `run_forward_match`

```python
def run_forward_match(self)
```

Apply the forward match algorithm and returns the list of matches given an initial match
and a qubits configuration.

## `Match`

```python
class Match
```

Object to represent a match and its qubits configurations.

### `__init__`

```python
def __init__(self, match, qubit)
```

Create a Match class with necessary arguments.
Args:
    match (list): list of matched gates.
    qubit (list): list of qubits configuration.

## `MatchingScenarios`

```python
class MatchingScenarios
```

Class to represent a matching scenario in the Backward part of the algorithm.

### `__init__`

```python
def __init__(self, circuit_matched, circuit_blocked, pattern_matched, pattern_blocked, matches, counter)
```

Create a MatchingScenarios class for the Backward match.
Args:
    circuit_matched (list): list representing the matched gates in the circuit.
    circuit_blocked (list): list representing the blocked gates in the circuit.
    pattern_matched (list): list representing the matched gates in the pattern.
    pattern_blocked (list): list representing the blocked gates in the pattern.
    matches (list): list of matches.
    counter (int): counter of the number of circuit gates already considered.

## `MatchingScenariosList`

```python
class MatchingScenariosList
```

Object to define a list of MatchingScenarios, with method to append
and pop elements.

### `__init__`

```python
def __init__(self)
```

Create an empty MatchingScenariosList.

### `append_scenario`

```python
def append_scenario(self, matching)
```

Append a scenario to the list.
Args:
    matching (MatchingScenarios): a scenario of match.

### `pop_scenario`

```python
def pop_scenario(self)
```

Pop the first scenario of the list.
Returns:
    MatchingScenarios: a scenario of match.

## `BackwardMatch`

```python
class BackwardMatch
```

Class BackwardMatch allows to run backward direction part of the pattern matching algorithm.

### `__init__`

```python
def __init__(self, circuit_dag, pattern_dag, qubits_conf, forward_matches, circuit_matched, circuit_blocked, pattern_matched, node_id_c, node_id_p, wires, control_wires, target_wires)
```

Create a ForwardMatch class with necessary arguments.
Args:
    circuit_dag (DAGDependency): circuit in the dag dependency form.
    pattern_dag (DAGDependency): pattern in the dag dependency form.
    forward_matches (list): list of match obtained in the forward direction.
    node_id_c (int): index of the first gate matched in the circuit.
    node_id_p (int): index of the first gate matched in the pattern.
    wires (list):
    control_wires (list):
    target_wires (list):

### `run_backward_match`

```python
def run_backward_match(self)
```

Run the backward match algorithm and returns the list of matches given an initial match, a forward
scenario and a circuit qubits configuration.

## `MaximalMatches`

```python
class MaximalMatches
```

Class MaximalMatches allows to sort and store the maximal matches from the list
of matches obtained with the pattern matching algorithm.

### `__init__`

```python
def __init__(self, pattern_matches)
```

Initialize MaximalMatches with the necessary arguments.
Args:
    pattern_matches (list): list of matches obtained from running the algorithm.

### `run_maximal_matches`

```python
def run_maximal_matches(self)
```

Method that extracts and stores maximal matches in decreasing length order.

## `SubstitutionConfig`

```python
class SubstitutionConfig
```

Class to store the configuration of a given match substitution, which circuit gates, template gates,
qubits and predecessors of the match in the circuit.

## `TemplateSubstitution`

```python
class TemplateSubstitution
```

Class to run the substitution algorithm from the list of maximal matches.

### `__init__`

```python
def __init__(self, max_matches, circuit_dag, template_dag, custom_quantum_cost=None)
```

Initialize TemplateSubstitution with necessary arguments.
Args:
    max_matches (list(int)): list of maximal matches obtained from the running the pattern matching algorithm.
    circuit_dag (.CommutationDAG): circuit in the dag dependency form.
    template_dag (.CommutationDAG): template in the dag dependency form.
    custom_quantum_cost (dict): Optional, quantum cost that overrides the default cost dictionnary.

### `substitution`

```python
def substitution(self)
```

From the list of maximal matches, it chooses which one will be used and gives the necessary details for
each substitution(template inverse, predecessors of the match).
