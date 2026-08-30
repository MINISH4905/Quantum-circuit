---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/adders/vbe_ripple_carry_adder.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/adders/vbe_ripple_carry_adder.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/adders/vbe_ripple_carry_adder.py`

Compute the sum of two qubit registers using Classical Addition.

## `VBERippleCarryAdder`

```python
class VBERippleCarryAdder(Adder)
```

The VBE ripple carry adder [1].

This circuit performs inplace addition of two equally-sized quantum registers.
As an example, a classical adder circuit that performs full addition (i.e. including
a carry-in bit) on two 2-qubit sized registers is as follows:

.. code-block:: text

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
This is a different ordering as compared to Figure 2 in [1], which leads to a different
drawing of the circuit.

.. seealso::

    The following generic gate objects perform additions, like this circuit class,
    but allow the compiler to select the optimal decomposition based on the context.
    Specific implementations can be set via the :class:`.HLSConfig`, e.g. this circuit
    can be chosen via ``Adder=["ripple_v95"]``.

    :class:`.ModularAdderGate`: A generic inplace adder, modulo :math:`2^n`. This
        is functionally equivalent to ``kind="fixed"``.

    :class:`.AdderGate`: A generic inplace adder. This
        is functionally equivalent to ``kind="half"``.

    :class:`.FullAdderGate`: A generic inplace adder, with a carry-in bit. This
        is functionally equivalent to ``kind="full"``.

References:

[1] Vedral et al., Quantum Networks for Elementary Arithmetic Operations, 1995.
`arXiv:quant-ph/9511018 <https://arxiv.org/pdf/quant-ph/9511018.pdf>`_

### `__init__`

```python
def __init__(self, num_state_qubits: int, kind: str='full', name: str='VBERippleCarryAdder') -> None
```

Args:
    num_state_qubits: The size of the register.
    kind: The kind of adder, can be ``'full'`` for a full adder, ``'half'`` for a half
        adder, or ``'fixed'`` for a fixed-sized adder. A full adder includes both carry-in
        and carry-out, a half only carry-out, and a fixed-sized adder neither carry-in
        nor carry-out.
    name: The name of the circuit.

Raises:
    ValueError: If ``num_state_qubits`` is lower than 1.
