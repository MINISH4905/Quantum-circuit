---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/generalized_gates/uc.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/generalized_gates/uc.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/generalized_gates/uc.py`

Uniformly controlled gates (also called multiplexed gates).

## `UCGate`

```python
class UCGate(Gate)
```

Uniformly controlled gate (also called multiplexed gate).

These gates can have several control qubits and a single target qubit.
If the k control qubits are in the state :math:`|i\rangle` (in the computational basis),
a single-qubit unitary :math:`U_i` is applied to the target qubit.

This gate is represented by a block-diagonal matrix, where each block is a
:math:`2\times 2` unitary, that is

.. math::

    \begin{pmatrix}
        U_0 & 0 & \cdots & 0 \\
        0 & U_1 & \cdots & 0 \\
        \vdots  &     & \ddots & \vdots \\
        0 & 0   &  \cdots & U_{2^{k-1}}
    \end{pmatrix}.

The decomposition is based on Ref. [1].

Unnecessary controls and repeated operators can be removed as described in Ref [2].

References:

[1] Bergholm et al., Quantum circuits with uniformly controlled one-qubit gates (2005).
`Phys. Rev. A 71, 052330 <https://journals.aps.org/pra/abstract/10.1103/PhysRevA.71.052330>`__.

[2] de Carvalho et al., Quantum multiplexer simplification for state preparation (2024).
`arXiv:2409.05618 <https://arxiv.org/abs/2409.05618>`__.

### `__init__`

```python
def __init__(self, gate_list: list[np.ndarray], up_to_diagonal: bool=False, mux_simp: bool=True)
```

Args:
    gate_list: List of two qubit unitaries :math:`[U_0, ..., U_{2^{k-1}}]`, where each
        single-qubit unitary :math:`U_i` is given as a :math:`2 \times 2` numpy array.
    up_to_diagonal: Determines if the gate is implemented up to a diagonal.
        or if it is decomposed completely (default: False).
        If the ``UCGate`` :math:`U` is decomposed up to a diagonal :math:`D`, this means
        that the circuit implements a unitary :math:`U'` such that :math:`D U' = U`.
    mux_simp: Determines whether the search for repetitions is conducted (default: True).
        The intention is to perform a possible simplification in the number of controls
        and operators.

Raises:
    QiskitError: in case of bad input to the constructor

### `inverse`

```python
def inverse(self, annotated: bool=False) -> Gate
```

Return the inverse.

This does not re-compute the decomposition for the multiplexer with the inverse of the
gates but simply inverts the existing decomposition.

### `validate_parameter`

```python
def validate_parameter(self, parameter)
```

Uniformly controlled gate parameter has to be an ndarray.
