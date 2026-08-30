---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/multi_controlled/mcx_synthesis.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/multi_controlled/mcx_synthesis.py
license: Apache-2.0
---

## Module `qiskit/synthesis/multi_controlled/mcx_synthesis.py`

Module containing multi-controlled circuits synthesis with and without ancillary qubits.

## `synth_mcx_n_dirty_i15`

```python
def synth_mcx_n_dirty_i15(num_ctrl_qubits: int, relative_phase: bool=False, action_only: bool=False) -> QuantumCircuit
```

Synthesize a multi-controlled X gate with :math:`k` controls based on the paper
by Iten et al. [1].

For :math:`k\ge 4`, the method uses :math:`k - 2` dirty ancillary qubits, producing a circuit
with :math:`2 * k - 1` qubits and at most :math:`8 * k - 6` CX gates. For :math:`k\le 3`,
explicitly constructed efficient circuits that require no ancillary qubits are used instead.

Args:
    num_ctrl_qubits: The number of control qubits.

    relative_phase: when set to ``True``, the method applies the optimized multi-controlled X gate
        up to a relative phase, in a way that, by lemma 8 of [1], the relative
        phases of the ``action part`` cancel out with the phases of the ``reset part``.

    action_only: when set to ``True``, the method applies only the ``action part`` of lemma 8 of [1].

Returns:
    The synthesized quantum circuit.

Raises:
    QiskitError: if ``num_ctrl_qubits`` is illegal.

References:
    1. Iten et. al., *Quantum Circuits for Isometries*, Phys. Rev. A 93, 032318 (2016),
       `arXiv:1501.06911 <https://arxiv.org/abs/1501.06911>`_

## `synth_mcx_n_clean_m15`

```python
def synth_mcx_n_clean_m15(num_ctrl_qubits: int) -> QuantumCircuit
```

Synthesize a multi-controlled X gate with :math:`k\ge 3` controls using :math:`k - 2`
clean ancillary qubits with producing a circuit with :math:`2 * k - 1` qubits
and at most :math:`6 * k - 6` CX gates, by Maslov [1].
For :math:`k\le 2`, the returned circuit consists of a single X, CX or CCX gate
(corresponding to :math:`k = 0, 1, 2`, respectively) and uses no ancillary qubits.

Args:
    num_ctrl_qubits: The number of control qubits.

Returns:
    The synthesized quantum circuit.

Raises:
    QiskitError: if ``num_ctrl_qubits`` is illegal.

References:
    1. Maslov., Phys. Rev. A 93, 022311 (2016),
       `arXiv:1508.03273 <https://arxiv.org/pdf/1508.03273>`_

## `synth_mcx_1_clean_b95`

```python
def synth_mcx_1_clean_b95(num_ctrl_qubits: int) -> QuantumCircuit
```

Synthesize a multi-controlled X gate with :math:`k\ge 3` controls using a single
clean ancillary qubit producing a circuit with :math:`k + 2` qubits and at most
:math:`16 * k - 24` CX gates, by [1], [2].
For :math:`k\le 2`, the returned circuit consists of a single X, CX or CCX gate
(corresponding to :math:`k = 0, 1, 2`, respectively) and uses no ancillary qubits.

Args:
    num_ctrl_qubits: The number of control qubits.

Returns:
    The synthesized quantum circuit.

Raises:
    QiskitError: if ``num_ctrl_qubits`` is illegal.

References:
    1. Barenco et. al., *Elementary gates for quantum computation*, Phys.Rev. A52 3457 (1995),
       `arXiv:quant-ph/9503016 <https://arxiv.org/abs/quant-ph/9503016>`_
    2. Iten et. al., *Quantum Circuits for Isometries*, Phys. Rev. A 93, 032318 (2016),
       `arXiv:1501.06911 <https://arxiv.org/abs/1501.06911>`_

## `synth_mcx_gray_code`

```python
def synth_mcx_gray_code(num_ctrl_qubits: int) -> QuantumCircuit
```

Synthesize a multi-controlled X gate with :math:`k\ge 3` controls using the Gray code.

Produces a quantum circuit with :math:`k + 1` qubits. This method
produces exponentially many CX gates and should be used only for small
values of :math:`k`.
For :math:`k\le 2`, the returned circuit consists of a single X, CX or CCX gate
(corresponding to :math:`k = 0, 1, 2`, respectively) and uses no ancillary qubits.

Args:
    num_ctrl_qubits: The number of control qubits.

Raises:
    QiskitError: if ``num_ctrl_qubits`` is illegal.

Returns:
    The synthesized quantum circuit.

## `synth_mcx_noaux_v24`

```python
def synth_mcx_noaux_v24(num_ctrl_qubits: int) -> QuantumCircuit
```

Synthesize a multi-controlled X gate with :math:`k` controls based on
the implementation for MCPhaseGate.

In turn, the MCPhase gate uses the decomposition for multi-controlled
special unitaries described in [1].

Produces a quantum circuit with :math:`k + 1` qubits.
The number of CX-gates is quadratic in :math:`k`.

Args:
    num_ctrl_qubits: The number of control qubits.

Returns:
    The synthesized quantum circuit.

Raises:
    QiskitError: if ``num_ctrl_qubits`` is illegal.

References:
    1. Vale et. al., *Circuit Decomposition of Multicontrolled Special Unitary
       Single-Qubit Gates*, IEEE TCAD 43(3) (2024),
       `arXiv:2302.06377 <https://arxiv.org/abs/2302.06377>`_

## `synth_mcx_noaux_hp24`

```python
def synth_mcx_noaux_hp24(num_ctrl_qubits: int) -> QuantumCircuit
```

Synthesize a multi-controlled X gate with :math:`k` controls based on
the work by Huang and Palsberg.

Produces a quantum circuit with :math:`k + 1` qubits. The number of CX-gates
is linear in :math:`k`.

Args:
    num_ctrl_qubits: The number of control qubits.

Returns:
    The synthesized quantum circuit.

Raises:
    QiskitError: if ``num_ctrl_qubits`` is illegal.

References:
    1. Huang and Palsberg, *Compiling Conditional Quantum Gates without Using
       Helper Qubits*, PLDI (2024),
       <https://dl.acm.org/doi/10.1145/3656436>`_

## `synth_mcx_1_kg24`

```python
def synth_mcx_1_kg24(num_ctrl_qubits: int, clean: bool=True) -> QuantumCircuit
```

Synthesize a multi-controlled X gate with :math:`k\ge 3` controls using :math:`1` ancillary qubit as
described in Sec. 5 of [1].
For :math:`k\le 2`, the returned circuit consists of a single X, CX or CCX gate
(corresponding to :math:`k = 0, 1, 2`, respectively) and uses no ancillary qubits.

Args:
    num_ctrl_qubits: The number of control qubits.
    clean: If True, the ancilla is clean, otherwise it is dirty.

Returns:
    The synthesized quantum circuit.

Raises:
    QiskitError: if ``num_ctrl_qubits`` is illegal.

References:
    1. Khattar and Gidney, Rise of conditionally clean ancillae for optimizing quantum circuits
    `arXiv:2407.17966 <https://arxiv.org/abs/2407.17966>`__

## `synth_mcx_1_clean_kg24`

```python
def synth_mcx_1_clean_kg24(num_ctrl_qubits: int) -> QuantumCircuit
```

Synthesize a multi-controlled X gate with :math:`k\ge 3` controls using :math:`1` clean
ancillary qubit producing a circuit with :math:`2k-3` Toffoli gates or :math:`6k-6`
CX gates and depth :math:`O(k)` as described in Sec. 5.1 of [1].
For :math:`k\le 2`, the returned circuit consists of a single X, CX or CCX gate
(corresponding to :math:`k = 0, 1, 2`, respectively) and uses no ancillary qubits.

Args:
    num_ctrl_qubits: The number of control qubits.

Returns:
    The synthesized quantum circuit.

Raises:
    QiskitError: if ``num_ctrl_qubits`` is illegal.

References:
    1. Khattar and Gidney, Rise of conditionally clean ancillae for optimizing quantum circuits
    `arXiv:2407.17966 <https://arxiv.org/abs/2407.17966>`__

## `synth_mcx_1_dirty_kg24`

```python
def synth_mcx_1_dirty_kg24(num_ctrl_qubits: int) -> QuantumCircuit
```

Synthesize a multi-controlled X gate with :math:`k\ge 3` controls using :math:`1` dirty
ancillary qubit producing a circuit with :math:`4k-8` Toffoli gates or :math:`12k-18`
CX gates and depth :math:`O(k)` as described in Sec. 5.3 of [1].
For :math:`k\le 2`, the returned circuit consists of a single X, CX or CCX gate
(corresponding to :math:`k = 0, 1, 2`, respectively) and uses no ancillary qubits.

Args:
    num_ctrl_qubits: The number of control qubits.

Returns:
    The synthesized quantum circuit.

Raises:
    QiskitError: if ``num_ctrl_qubits`` is illegal.

References:
    1. Khattar and Gidney, Rise of conditionally clean ancillae for optimizing quantum circuits
    `arXiv:2407.17966 <https://arxiv.org/abs/2407.17966>`__

## `synth_mcx_2_kg24`

```python
def synth_mcx_2_kg24(num_ctrl_qubits: int, clean: bool=True) -> QuantumCircuit
```

Synthesize a multi-controlled X gate with :math:`k\ge 3` controls using :math:`2` ancillary qubits.
as described in Sec. 5 of [1].
For :math:`k\le 2`, the returned circuit consists of a single X, CX or CCX gate
(corresponding to :math:`k = 0, 1, 2`, respectively) and uses no ancillary qubits.

Args:
    num_ctrl_qubits: The number of control qubits.
    clean: If True, the ancilla is clean, otherwise it is dirty.

Returns:
    The synthesized quantum circuit.

Raises:
    QiskitError: if ``num_ctrl_qubits`` is illegal.

References:
    1. Khattar and Gidney, Rise of conditionally clean ancillae for optimizing quantum circuits
    `arXiv:2407.17966 <https://arxiv.org/abs/2407.17966>`__

## `synth_mcx_2_clean_kg24`

```python
def synth_mcx_2_clean_kg24(num_ctrl_qubits: int) -> QuantumCircuit
```

Synthesize a multi-controlled X gate with :math:`k\ge 3` controls using :math:`2` clean
ancillary qubits producing a circuit with :math:`2k-3` Toffoli gates or :math:`6k-6`
CX gates and depth :math:`O(\log(k))` as described in Sec. 5.2 of [1].
For :math:`k\le 2`, the returned circuit consists of a single X, CX or CCX gate
(corresponding to :math:`k = 0, 1, 2`, respectively) and uses no ancillary qubits.

Args:
    num_ctrl_qubits: The number of control qubits.

Returns:
    The synthesized quantum circuit.

Raises:
    QiskitError: if ``num_ctrl_qubits`` is illegal.

References:
    1. Khattar and Gidney, Rise of conditionally clean ancillae for optimizing quantum circuits
    `arXiv:2407.17966 <https://arxiv.org/abs/2407.17966>`__

## `synth_mcx_2_dirty_kg24`

```python
def synth_mcx_2_dirty_kg24(num_ctrl_qubits: int) -> QuantumCircuit
```

Synthesize a multi-controlled X gate with :math:`k\ge 3` controls using :math:`2` dirty
ancillary qubits producing a circuit with :math:`4k-8` Toffoli gates or :math:`12k-18` CX
gates and depth :math:`O(\log(k))` as described in Sec. 5.4 of [1].
For :math:`k\le 2`, the returned circuit consists of a single X, CX or CCX gate
(corresponding to :math:`k = 0, 1, 2`, respectively) and uses no ancillary qubits.

Args:
    num_ctrl_qubits: The number of control qubits.

Returns:
    The synthesized quantum circuit.

Raises:
    QiskitError: if ``num_ctrl_qubits`` is illegal.

References:
    1. Khattar and Gidney, Rise of conditionally clean ancillae for optimizing quantum circuits
    `arXiv:2407.17966 <https://arxiv.org/abs/2407.17966>`__

## `synth_c3x`

```python
def synth_c3x() -> QuantumCircuit
```

Efficient synthesis of 3-controlled X-gate.

## `synth_c4x`

```python
def synth_c4x() -> QuantumCircuit
```

Efficient synthesis of 4-controlled X-gate.
