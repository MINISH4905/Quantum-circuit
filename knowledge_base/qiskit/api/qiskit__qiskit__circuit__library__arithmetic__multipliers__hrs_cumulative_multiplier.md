---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/multipliers/hrs_cumulative_multiplier.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/multipliers/hrs_cumulative_multiplier.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/multipliers/hrs_cumulative_multiplier.py`

Compute the product of two qubit registers using classical multiplication approach.

## `HRSCumulativeMultiplier`

```python
class HRSCumulativeMultiplier(Multiplier)
```

A multiplication circuit to store product of two input registers out-of-place.

Circuit uses the approach from [1]. As an example, a multiplier circuit that
performs a non-modular multiplication on two 3-qubit sized registers with
the default adder is as follows (where ``Adder`` denotes the
``CDKMRippleCarryAdder``):

.. code-block:: text

      a_0: ────■─────────────────────────
               │
      a_1: ────┼─────────■───────────────
               │         │
      a_2: ────┼─────────┼─────────■─────
           ┌───┴────┐┌───┴────┐┌───┴────┐
      b_0: ┤0       ├┤0       ├┤0       ├
           │        ││        ││        │
      b_1: ┤1       ├┤1       ├┤1       ├
           │        ││        ││        │
      b_2: ┤2       ├┤2       ├┤2       ├
           │        ││        ││        │
    out_0: ┤3       ├┤        ├┤        ├
           │        ││        ││        │
    out_1: ┤4       ├┤3       ├┤        ├
           │  Adder ││  Adder ││  Adder │
    out_2: ┤5       ├┤4       ├┤3       ├
           │        ││        ││        │
    out_3: ┤6       ├┤5       ├┤4       ├
           │        ││        ││        │
    out_4: ┤        ├┤6       ├┤5       ├
           │        ││        ││        │
    out_5: ┤        ├┤        ├┤6       ├
           │        ││        ││        │
    aux_0: ┤7       ├┤7       ├┤7       ├
           └────────┘└────────┘└────────┘

Multiplication in this circuit is implemented in a classical approach by performing
a series of shifted additions using one of the input registers while the qubits
from the other input register act as control qubits for the adders.

.. seealso::

    The :class:`.MultiplierGate` object represents a multiplication, like this circuit class,
    but allows the compiler to select the optimal decomposition based on the context.
    Specific implementations can be set via the :class:`.HLSConfig`, e.g. this circuit
    can be chosen via ``Multiplier=["cumulative_h18"]``.

References:

[1] Häner et al., Optimizing Quantum Circuits for Arithmetic, 2018.
`arXiv:1805.12445 <https://arxiv.org/pdf/1805.12445.pdf>`_

### `__init__`

```python
def __init__(self, num_state_qubits: int, num_result_qubits: int | None=None, adder: QuantumCircuit | None=None, name: str='HRSCumulativeMultiplier') -> None
```

Args:
    num_state_qubits: The number of qubits in either input register for
        state :math:`|a\rangle` or :math:`|b\rangle`. The two input
        registers must have the same number of qubits.
    num_result_qubits: The number of result qubits to limit the output to.
        If number of result qubits is :math:`n`, multiplication modulo :math:`2^n` is performed
        to limit the output to the specified number of qubits. Default
        value is ``2 * num_state_qubits`` to represent any possible
        result from the multiplication of the two inputs.
    adder: Half adder circuit to be used for performing multiplication. The
        CDKMRippleCarryAdder is used as default if no adder is provided.
    name: The name of the circuit object.
Raises:
    NotImplementedError: If ``num_result_qubits`` is not default and a custom adder is provided.
