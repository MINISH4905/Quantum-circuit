---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/arithmetic/adders/vbe_ripple_carry_adder.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/arithmetic/adders/vbe_ripple_carry_adder.py
license: Apache-2.0
---

## Module `qiskit/synthesis/arithmetic/adders/vbe_ripple_carry_adder.py`

Compute the sum of two qubit registers using Classical Addition.

## `adder_ripple_v95`

```python
def adder_ripple_v95(num_state_qubits: int, kind: str='half') -> QuantumCircuit
```

The VBE ripple carry adder [1].

This method uses :math:`4n + O(1)` CCX gates and :math:`4n + 1` CX gates at a depth
of :math:`6n - 2` [2].

This circuit performs inplace addition of two equally-sized quantum registers.
As an example, a classical adder circuit that performs full addition (i.e. including
a carry-in bit) on two 2-qubit sized registers is as follows:

.. parsed-literal::

              ┌────────┐                       ┌───────────┐┌──────┐
       cin_0: ┤0       ├───────────────────────┤0          ├┤0     ├
              │        │                       │           ││      │
         a_0: ┤1       ├───────────────────────┤1          ├┤1     ├
              │        │┌────────┐     ┌──────┐│           ││  Sum │
         a_1: ┤        ├┤1       ├──■──┤1     ├┤           ├┤      ├
              │        ││        │  │  │      ││           ││      │
         b_0: ┤2 Carry ├┤        ├──┼──┤      ├┤2 Carry_dg ├┤2     ├
              │        ││        │┌─┴─┐│      ││           │└──────┘
         b_1: ┤        ├┤2 Carry ├┤ X ├┤2 Sum ├┤           ├────────
              │        ││        │└───┘│      ││           │
      cout_0: ┤        ├┤3       ├─────┤      ├┤           ├────────
              │        ││        │     │      ││           │
    helper_0: ┤3       ├┤0       ├─────┤0     ├┤3          ├────────
              └────────┘└────────┘     └──────┘└───────────┘


Here *Carry* and *Sum* gates correspond to the gates introduced in [1].
*Carry_dg* correspond to the inverse of the *Carry* gate. Note that
in this implementation the input register qubits are ordered as all qubits from
the first input register, followed by all qubits from the second input register.
This is different ordering as compared to Figure 2 in [1], which leads to a different
drawing of the circuit.

Args:
    num_state_qubits: The size of the register.
    kind: The kind of adder, can be ``"full"`` for a full adder, ``"half"`` for a half
        adder, or ``"fixed"`` for a fixed-sized adder. A full adder includes both carry-in
        and carry-out, a half only carry-out, and a fixed-sized adder neither carry-in
        nor carry-out.

Raises:
    ValueError: If ``num_state_qubits`` is lower than 1.

References:

[1] Vedral et al., Quantum Networks for Elementary Arithmetic Operations, 1995.
`arXiv:quant-ph/9511018 <https://arxiv.org/pdf/quant-ph/9511018.pdf>`_

[2] Cuccaro et al., A new quantum ripple-carry addition circuit, 2004.
`arXiv:quant-ph/0410184 <https://arxiv.org/pdf/quant-ph/0410184.pdf>`_
