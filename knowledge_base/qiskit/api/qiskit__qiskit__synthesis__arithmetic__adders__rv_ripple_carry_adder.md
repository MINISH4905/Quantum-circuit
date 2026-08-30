---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/arithmetic/adders/rv_ripple_carry_adder.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/arithmetic/adders/rv_ripple_carry_adder.py
license: Apache-2.0
---

## Module `qiskit/synthesis/arithmetic/adders/rv_ripple_carry_adder.py`

Compute the sum of two qubit registers without any ancillary qubits.

## `adder_ripple_r25`

```python
def adder_ripple_r25(num_qubits: int) -> QuantumCircuit
```

The RV ripple carry adder [1].
Construct an ancilla-free quantum adder circuit with sublinear depth based on the RV ripple-carry
adder shown in [1]. The implementation has a depth of :math:`O(\log^2 n)` and uses
math:`O(n \log n)` gates.

As an example, a ripple-carry adder circuit that performs addition on two 4-qubit sized
registers is as follows:

.. parsed-literal::

                                   ┌───────────┐                    ┌────────┐
     a_0: ─────────────────────────┤0          ├────────────────────┤0       ├───────────────■─────────────────
                         ┌────────┐│           │                    │        │┌───────────┐  │
     a_1: ──■────────────┤0       ├┤2          ├──■─────────────────┤2       ├┤0          ├──┼────■────────────
            │            │        ││           │  │                 │        ││           │  │    │
     a_2: ──┼────■───────┤1       ├┤4          ├──┼────■────────────┤4       ├┤1 LAD_1_dg ├──┼────┼────■───────
            │    │       │        ││           │  │    │            │        ││           │  │    │    │
     a_3: ──┼────┼────■──┤2       ├┤6          ├──┼────┼────■───────┤6 LAD_2 ├┤2          ├──┼────┼────┼────■──
            │    │    │  │        ││           │  │    │    │       │        │└───────────┘┌─┴─┐  │    │    │
     b_0: ──┼────┼────┼──┤        ├┤1 LAD_2_dg ├──┼────┼────┼───────┤1       ├─────────────┤ X ├──┼────┼────┼──
          ┌─┴─┐  │    │  │  LAD_1 ││           │┌─┴─┐  │    │  ┌───┐│        │    ┌───┐    └───┘┌─┴─┐  │    │
     b_1: ┤ X ├──┼────┼──┤        ├┤3          ├┤ X ├──┼────┼──┤ X ├┤3       ├────┤ X ├─────────┤ X ├──┼────┼──
          └───┘┌─┴─┐  │  │        ││           │└───┘┌─┴─┐  │  ├───┤│        │    ├───┤         └───┘┌─┴─┐  │
     b_2: ─────┤ X ├──┼──┤        ├┤5          ├─────┤ X ├──┼──┤ X ├┤5       ├────┤ X ├──────────────┤ X ├──┼──
               └───┘┌─┴─┐│        ││           │     └───┘┌─┴─┐└───┘└────────┘    └───┘              └───┘┌─┴─┐
     b_3: ──────────┤ X ├┤        ├┤7          ├──────────┤ X ├───────────────────────────────────────────┤ X ├
                    └───┘│        ││           │          └───┘                                           └───┘
    cout: ───────────────┤3       ├┤8          ├───────────────────────────────────────────────────────────────
                         └────────┘└───────────┘

Here *LAD_1* and *LAD_2* are the CX and CCX ladders respectively introduced in [1]. Note that
in this implementation the input register qubits are ordered as all qubits from
the first input register, followed by all qubits from the second input register.

Args:
    num_qubits: The size of the register.

Returns:
    The quantum circuit implementing the RV ripple carry adder.

Raises:
    ValueError: If ``num_qubits`` is lower than 1.

References:

1. Remaud and Vandaele, Ancilla-free Quantum Adder with Sublinear Depth, 2025.
`arXiv:2501.16802 <https://arxiv.org/abs/2501.16802>`__
