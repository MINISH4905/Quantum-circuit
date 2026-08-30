---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/clifford/clifford_decompose_layers.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/clifford/clifford_decompose_layers.py
license: Apache-2.0
---

## Module `qiskit/synthesis/clifford/clifford_decompose_layers.py`

Circuit synthesis for the Clifford class into layers.

## `synth_clifford_layers`

```python
def synth_clifford_layers(cliff: Clifford, cx_synth_func: Callable[[np.ndarray], QuantumCircuit]=_default_cx_synth_func, cz_synth_func: Callable[[np.ndarray], QuantumCircuit]=_default_cz_synth_func, cx_cz_synth_func: Callable[[np.ndarray], QuantumCircuit] | None=None, cz_func_reverse_qubits: bool=False, validate: bool=False) -> QuantumCircuit
```

Synthesis of a :class:`.Clifford` into layers, it provides a similar
decomposition to the synthesis described in Lemma 8 of Bravyi and Maslov [1].

For example, a 5-qubit Clifford circuit is decomposed into the following layers:

.. code-block:: text

         ┌─────┐┌─────┐┌────────┐┌─────┐┌─────┐┌─────┐┌─────┐┌────────┐
    q_0: ┤0    ├┤0    ├┤0       ├┤0    ├┤0    ├┤0    ├┤0    ├┤0       ├
         │     ││     ││        ││     ││     ││     ││     ││        │
    q_1: ┤1    ├┤1    ├┤1       ├┤1    ├┤1    ├┤1    ├┤1    ├┤1       ├
         │     ││     ││        ││     ││     ││     ││     ││        │
    q_2: ┤2 S2 ├┤2 CZ ├┤2 CX_dg ├┤2 H2 ├┤2 S1 ├┤2 CZ ├┤2 H1 ├┤2 Pauli ├
         │     ││     ││        ││     ││     ││     ││     ││        │
    q_3: ┤3    ├┤3    ├┤3       ├┤3    ├┤3    ├┤3    ├┤3    ├┤3       ├
         │     ││     ││        ││     ││     ││     ││     ││        │
    q_4: ┤4    ├┤4    ├┤4       ├┤4    ├┤4    ├┤4    ├┤4    ├┤4       ├
         └─────┘└─────┘└────────┘└─────┘└─────┘└─────┘└─────┘└────────┘

This decomposition is for the default ``cz_synth_func`` and ``cx_synth_func`` functions,
with other functions one may see slightly different decomposition.

Args:
    cliff: A Clifford operator.
    cx_synth_func: A function to decompose the CX sub-circuit.
        It gets as input a boolean invertible matrix, and outputs a :class:`.QuantumCircuit`.
    cz_synth_func: A function to decompose the CZ sub-circuit.
        It gets as input a boolean symmetric matrix, and outputs a :class:`.QuantumCircuit`.
    cx_cz_synth_func (Callable): optional, a function to decompose both sub-circuits CZ and CX.
    validate (Boolean): if True, validates the synthesis process.
    cz_func_reverse_qubits (Boolean): True only if ``cz_synth_func`` is
        :func:`.synth_cz_depth_line_mr`, since this function returns a circuit that reverts
        the order of qubits.

Returns:
    A circuit implementation of the Clifford.

References:
    1. S. Bravyi, D. Maslov, *Hadamard-free circuits expose the
       structure of the Clifford group*,
       `arXiv:2003.09412 [quant-ph] <https://arxiv.org/abs/2003.09412>`_

## `synth_clifford_depth_lnn`

```python
def synth_clifford_depth_lnn(cliff)
```

Synthesis of a :class:`.Clifford` into layers for linear-nearest neighbor connectivity.

The depth of the synthesized n-qubit circuit is bounded by :math:`7n+2`, which is not optimal.
It should be replaced by a better algorithm that provides depth bounded by :math:`7n-4` [3].

Args:
    cliff (Clifford): a Clifford operator.

Returns:
    QuantumCircuit: a circuit implementation of the Clifford.

References:
    1. S. Bravyi, D. Maslov, *Hadamard-free circuits expose the
       structure of the Clifford group*,
       `arXiv:2003.09412 [quant-ph] <https://arxiv.org/abs/2003.09412>`_
    2. Dmitri Maslov, Martin Roetteler,
       *Shorter stabilizer circuits via Bruhat decomposition and quantum circuit transformations*,
       `arXiv:1705.09176 <https://arxiv.org/abs/1705.09176>`_.
    3. Dmitri Maslov, Willers Yang, *CNOT circuits need little help to implement arbitrary
       Hadamard-free Clifford transformations they generate*,
       `arXiv:2210.16195 <https://arxiv.org/abs/2210.16195>`_.
