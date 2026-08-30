---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/weighted_adder.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/weighted_adder.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/weighted_adder.py`

Compute the weighted sum of qubit states.

## `WeightedAdder`

```python
class WeightedAdder(BlueprintCircuit)
```

A circuit to compute the weighted sum of qubit registers.

Given :math:`n` qubit basis states :math:`q_0, \ldots, q_{n-1} \in \{0, 1\}` and non-negative
integer weights :math:`\lambda_0, \ldots, \lambda_{n-1}`, this circuit performs the operation

.. math::

    |q_0 \ldots q_{n-1}\rangle |0\rangle_s
    \mapsto |q_0 \ldots q_{n-1}\rangle |\sum_{j=0}^{n-1} \lambda_j q_j\rangle_s

where :math:`s` is the number of sum qubits required.
This can be computed as

.. math::

    s = 1 + \left\lfloor \log_2\left( \sum_{j=0}^{n-1} \lambda_j \right) \right\rfloor

or :math:`s = 1` if the sum of the weights is 0 (then the expression in the logarithm is
invalid).

For qubits in a circuit diagram, the first weight applies to the upper-most qubit.
For an example where the state of 4 qubits is added into a sum register, the circuit can
be schematically drawn as

.. code-block:: text

               ┌────────┐
      state_0: ┤0       ├ | state_0 * weights[0]
               │        │ |
      state_1: ┤1       ├ | + state_1 * weights[1]
               │        │ |
      state_2: ┤2       ├ | + state_2 * weights[2]
               │        │ |
      state_3: ┤3       ├ | + state_3 * weights[3]
               │        │
        sum_0: ┤4       ├ |
               │  Adder │ |
        sum_1: ┤5       ├ | = sum_0 * 2^0 + sum_1 * 2^1 + sum_2 * 2^2
               │        │ |
        sum_2: ┤6       ├ |
               │        │
      carry_0: ┤7       ├
               │        │
      carry_1: ┤8       ├
               │        │
    control_0: ┤9       ├
               └────────┘

### `__init__`

```python
def __init__(self, num_state_qubits: int | None=None, weights: list[int] | None=None, name: str='adder') -> None
```

Args:
    num_state_qubits: The number of state qubits.
    weights: List of weights, one for each state qubit. If none are provided they
        default to 1 for every qubit.
    name: The name of the circuit.

### `num_sum_qubits`

```python
def num_sum_qubits(self) -> int
```

The number of sum qubits in the circuit.

Returns:
    The number of qubits needed to represent the weighted sum of the qubits.

### `weights`

```python
def weights(self) -> list[int]
```

The weights for the qubit states.

Returns:
    The weight for the qubit states.

### `weights`

```python
def weights(self, weights: list[int]) -> None
```

Set the weights for summing the qubit states.

Args:
    weights: The new weights.

Raises:
    ValueError: If not all weights are close to an integer.

### `num_state_qubits`

```python
def num_state_qubits(self) -> int
```

The number of qubits to be summed.

Returns:
    The number of state qubits.

### `num_state_qubits`

```python
def num_state_qubits(self, num_state_qubits: int) -> None
```

Set the number of state qubits.

Args:
    num_state_qubits: The new number of state qubits.

### `num_carry_qubits`

```python
def num_carry_qubits(self) -> int
```

The number of carry qubits required to compute the sum.

Note that this is not necessarily equal to the number of ancilla qubits, these can
be queried using ``num_ancilla_qubits``.

Returns:
    The number of carry qubits required to compute the sum.

### `num_control_qubits`

```python
def num_control_qubits(self) -> int
```

The number of additional control qubits required.

Note that the total number of ancilla qubits can be obtained by calling the
method ``num_ancilla_qubits``.

Returns:
    The number of additional control qubits required (0 or 1).

## `WeightedSumGate`

```python
class WeightedSumGate(Gate)
```

A gate to compute the weighted sum of qubit registers.

Given :math:`n` qubit basis states :math:`q_0, \ldots, q_{n-1} \in \{0, 1\}` and non-negative
integer weights :math:`\lambda_0, \ldots, \lambda_{n-1}`, this implements the operation

.. math::

    |q_0 \ldots q_{n-1}\rangle |0\rangle_s
    \mapsto |q_0 \ldots q_{n-1}\rangle |\sum_{j=0}^{n-1} \lambda_j q_j\rangle_s

where :math:`s` is the number of sum qubits required.
This can be computed as

.. math::

    s = 1 + \left\lfloor \log_2\left( \sum_{j=0}^{n-1} \lambda_j \right) \right\rfloor

or :math:`s = 1` if the sum of the weights is 0 (then the expression in the logarithm is
invalid).

For qubits in a circuit diagram, the first weight applies to the upper-most qubit.
For an example where the state of 4 qubits is added into a sum register, the circuit can
be schematically drawn as

.. code-block:: text

               ┌──────────────┐
      state_0: ┤0             ├ | state_0 * weights[0]
               │              │ |
      state_1: ┤1             ├ | + state_1 * weights[1]
               │              │ |
      state_2: ┤2             ├ | + state_2 * weights[2]
               │              │ |
      state_3: ┤3 WeightedSum ├ | + state_3 * weights[3]
               │              │
        sum_0: ┤4             ├ |
               │              │ |
        sum_1: ┤5             ├ | = sum_0 * 2^0 + sum_1 * 2^1 + sum_2 * 2^2
               │              │ |
        sum_2: ┤6             ├ |
               └──────────────┘

### `__init__`

```python
def __init__(self, num_state_qubits: int, weights: list[int] | None=None, label: str | None=None) -> None
```

Args:
    num_state_qubits: The number of state qubits.
    weights: List of weights, one for each state qubit. If none are provided they
        default to 1 for every qubit.
    label: The name of the circuit.
