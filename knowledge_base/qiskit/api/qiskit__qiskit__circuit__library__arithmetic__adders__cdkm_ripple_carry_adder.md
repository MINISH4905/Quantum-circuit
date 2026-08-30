---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/adders/cdkm_ripple_carry_adder.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/adders/cdkm_ripple_carry_adder.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/adders/cdkm_ripple_carry_adder.py`

Compute the sum of two qubit registers using ripple-carry approach.

## `CDKMRippleCarryAdder`

```python
class CDKMRippleCarryAdder(Adder)
```

A ripple-carry circuit to perform in-place addition on two qubit registers.

As an example, a ripple-carry adder circuit that performs addition on two 3-qubit sized
registers with a carry-in bit (``kind="full"``) is as follows:

.. code-block:: text

            ┌──────┐                                     ┌──────┐
     cin_0: ┤2     ├─────────────────────────────────────┤2     ├
            │      │┌──────┐                     ┌──────┐│      │
       a_0: ┤0     ├┤2     ├─────────────────────┤2     ├┤0     ├
            │      ││      │┌──────┐     ┌──────┐│      ││      │
       a_1: ┤  MAJ ├┤0     ├┤2     ├─────┤2     ├┤0     ├┤  UMA ├
            │      ││      ││      │     │      ││      ││      │
       a_2: ┤      ├┤  MAJ ├┤0     ├──■──┤0     ├┤  UMA ├┤      ├
            │      ││      ││      │  │  │      ││      ││      │
       b_0: ┤1     ├┤      ├┤  MAJ ├──┼──┤  UMA ├┤      ├┤1     ├
            └──────┘│      ││      │  │  │      ││      │└──────┘
       b_1: ────────┤1     ├┤      ├──┼──┤      ├┤1     ├────────
                    └──────┘│      │  │  │      │└──────┘
       b_2: ────────────────┤1     ├──┼──┤1     ├────────────────
                            └──────┘┌─┴─┐└──────┘
    cout_0: ────────────────────────┤ X ├────────────────────────
                                    └───┘

Here *MAJ* and *UMA* gates correspond to the gates introduced in [1]. Note that
in this implementation the input register qubits are ordered as all qubits from
the first input register, followed by all qubits from the second input register.

Two different kinds of adders are supported. By setting the ``kind`` argument, you can also
choose a half-adder, which doesn't have a carry-in, and a fixed-sized-adder, which has neither
carry-in nor carry-out, and thus acts on fixed register sizes. Unlike the full-adder,
these circuits need one additional helper qubit.

The circuit diagram for the fixed-point adder (``kind="fixed"``) on 3-qubit sized inputs is

.. code-block:: text

            ┌──────┐┌──────┐                ┌──────┐┌──────┐
       a_0: ┤0     ├┤2     ├────────────────┤2     ├┤0     ├
            │      ││      │┌──────┐┌──────┐│      ││      │
       a_1: ┤      ├┤0     ├┤2     ├┤2     ├┤0     ├┤      ├
            │      ││      ││      ││      ││      ││      │
       a_2: ┤      ├┤  MAJ ├┤0     ├┤0     ├┤  UMA ├┤      ├
            │      ││      ││      ││      ││      ││      │
       b_0: ┤1 MAJ ├┤      ├┤  MAJ ├┤  UMA ├┤      ├┤1 UMA ├
            │      ││      ││      ││      ││      ││      │
       b_1: ┤      ├┤1     ├┤      ├┤      ├┤1     ├┤      ├
            │      │└──────┘│      ││      │└──────┘│      │
       b_2: ┤      ├────────┤1     ├┤1     ├────────┤      ├
            │      │        └──────┘└──────┘        │      │
    help_0: ┤2     ├────────────────────────────────┤2     ├
            └──────┘                                └──────┘

It has one less qubit than the full-adder since it doesn't have the carry-out, but uses
a helper qubit instead of the carry-in, so it only has one less qubit, not two.

.. seealso::

    The following generic gate objects perform additions, like this circuit class,
    but allow the compiler to select the optimal decomposition based on the context.
    Specific implementations can be set via the :class:`.HLSConfig`, e.g. this circuit
    can be chosen via ``Adder=["ripple_c04"]``.

    :class:`.ModularAdderGate`: A generic inplace adder, modulo :math:`2^n`. This
        is functionally equivalent to ``kind="fixed"``.

    :class:`.AdderGate`: A generic inplace adder. This
        is functionally equivalent to ``kind="half"``.

    :class:`.FullAdderGate`: A generic inplace adder, with a carry-in bit. This
        is functionally equivalent to ``kind="full"``.

References:

[1] Cuccaro et al., A new quantum ripple-carry addition circuit, 2004.
`arXiv:quant-ph/0410184 <https://arxiv.org/pdf/quant-ph/0410184.pdf>`_

[2] Vedral et al., Quantum Networks for Elementary Arithmetic Operations, 1995.
`arXiv:quant-ph/9511018 <https://arxiv.org/pdf/quant-ph/9511018.pdf>`_

### `__init__`

```python
def __init__(self, num_state_qubits: int, kind: str='full', name: str='CDKMRippleCarryAdder') -> None
```

Args:
    num_state_qubits: The number of qubits in either input register for
        state :math:`|a\rangle` or :math:`|b\rangle`. The two input
        registers must have the same number of qubits.
    kind: The kind of adder, can be ``'full'`` for a full adder, ``'half'`` for a half
        adder, or ``'fixed'`` for a fixed-sized adder. A full adder includes both carry-in
        and carry-out, a half only carry-out, and a fixed-sized adder neither carry-in
        nor carry-out.
    name: The name of the circuit object.
Raises:
    ValueError: If ``num_state_qubits`` is lower than 1.
