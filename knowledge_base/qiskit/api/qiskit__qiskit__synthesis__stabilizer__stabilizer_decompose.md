---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/stabilizer/stabilizer_decompose.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/stabilizer/stabilizer_decompose.py
license: Apache-2.0
---

## Module `qiskit/synthesis/stabilizer/stabilizer_decompose.py`

Circuit synthesis for a stabilizer state preparation circuit.

## `synth_stabilizer_layers`

```python
def synth_stabilizer_layers(stab: StabilizerState, cz_synth_func: Callable[[np.ndarray], QuantumCircuit]=_default_cz_synth_func, cz_func_reverse_qubits: bool=False, validate: bool=False) -> QuantumCircuit
```

Synthesis of a stabilizer state into layers.

It provides a similar decomposition to the synthesis described in Lemma 8 of reference [1],
without the initial Hadamard-free sub-circuit which does not affect the stabilizer state.

For example, a 5-qubit stabilizer state is decomposed into the following layers:

.. code-block:: text

         ┌─────┐┌─────┐┌─────┐┌─────┐┌────────┐
    q_0: ┤0    ├┤0    ├┤0    ├┤0    ├┤0       ├
         │     ││     ││     ││     ││        │
    q_1: ┤1    ├┤1    ├┤1    ├┤1    ├┤1       ├
         │     ││     ││     ││     ││        │
    q_2: ┤2 H2 ├┤2 S1 ├┤2 CZ ├┤2 H1 ├┤2 Pauli ├
         │     ││     ││     ││     ││        │
    q_3: ┤3    ├┤3    ├┤3    ├┤3    ├┤3       ├
         │     ││     ││     ││     ││        │
    q_4: ┤4    ├┤4    ├┤4    ├┤4    ├┤4       ├
         └─────┘└─────┘└─────┘└─────┘└────────┘

Args:
    stab: A stabilizer state.
    cz_synth_func: A function to decompose the CZ sub-circuit.
        It gets as input a boolean symmetric matrix, and outputs a :class:`.QuantumCircuit`.
    cz_func_reverse_qubits: ``True`` only if ``cz_synth_func`` is
        :func:`.synth_cz_depth_line_mr`,
        since this function returns a circuit that reverts the order of qubits.
    validate: If ``True``, validates the synthesis process.

Returns:
    A circuit implementation of the stabilizer state.

Raises:
    QiskitError: if the input is not a :class:`.StabilizerState`.

References:
    1. S. Bravyi, D. Maslov, *Hadamard-free circuits expose the
       structure of the Clifford group*,
       `arXiv:2003.09412 [quant-ph] <https://arxiv.org/abs/2003.09412>`_

## `synth_stabilizer_depth_lnn`

```python
def synth_stabilizer_depth_lnn(stab: StabilizerState) -> QuantumCircuit
```

Synthesis of an n-qubit stabilizer state for linear-nearest neighbor connectivity,
in 2-qubit depth :math:`2n+2` and two distinct CX layers, using :class:`.CXGate`\ s and phase gates
(:class:`.SGate`, :class:`.SdgGate` or :class:`.ZGate`).

Args:
    stab: A stabilizer state.

Returns:
    A circuit implementation of the stabilizer state.

References:
    1. S. Bravyi, D. Maslov, *Hadamard-free circuits expose the
       structure of the Clifford group*,
       `arXiv:2003.09412 [quant-ph] <https://arxiv.org/abs/2003.09412>`_
    2. Dmitri Maslov, Martin Roetteler,
       *Shorter stabilizer circuits via Bruhat decomposition and quantum circuit transformations*,
       `arXiv:1705.09176 <https://arxiv.org/abs/1705.09176>`_.
