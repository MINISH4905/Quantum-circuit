---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/two_qubit/xx_decompose/decomposer.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/two_qubit/xx_decompose/decomposer.py
license: Apache-2.0
---

## Module `qiskit/synthesis/two_qubit/xx_decompose/decomposer.py`

Driver for a synthesis routine which emits optimal XX-based circuits.

## `XXDecomposer`

```python
class XXDecomposer
```

A class for optimal decomposition of 2-qubit unitaries into 2-qubit basis gates of ``XX`` type
(i.e., each locally equivalent to :math:`CAN(\alpha, 0, 0)` for a possibly varying :math:`\alpha`).

Args:
    basis_fidelity: available strengths and fidelity of each.
        Can be either (1) a dictionary mapping ``XX`` angle values to fidelity at that angle; or
        (2) a single float ``f``, interpreted as ``{pi: f, pi/2: f/2, pi/3: f/3}``.
    euler_basis: Basis string provided to :class:`.OneQubitEulerDecomposer` for 1Q synthesis.
        Defaults to ``"U"``.
    embodiments: A dictionary mapping interaction strengths alpha to native circuits which
        embody the gate :math:`CAN(\alpha, 0, 0)`. Strengths are taken so that :math:`\pi/2`
        represents the class of a full :class:`.CXGate`.
    backup_optimizer: If supplied, defers synthesis to this callable when :class:`.XXDecomposer`
        has no efficient decomposition of its own. Useful for special cases involving 2 or 3
        applications of :math:`XX(\pi/2)`, in which case standard synthesis methods provide lower
        1Q gate count.

.. note::
    If ``embodiments`` is not passed, or if an entry is missing, it will be populated as needed
    using the method ``_default_embodiment``.

.. automethod:: __call__

### `num_basis_gates`

```python
def num_basis_gates(self, unitary: Operator | np.ndarray)
```

Counts the number of gates that would be emitted during re-synthesis.

.. note::
    This method is used by :class:`.ConsolidateBlocks`.

### `__call__`

```python
def __call__(self, unitary: Operator | np.ndarray, basis_fidelity: dict | float | None=None, approximate: bool=True, use_dag: bool=False) -> QuantumCircuit
```

Fashions a circuit which (perhaps approximately) models the special unitary operation
``unitary``, using the circuit templates supplied at initialization as ``embodiments``.  The
routine uses ``basis_fidelity`` to select the optimal circuit template, including when
performing exact synthesis; the contents of ``basis_fidelity`` is a dictionary mapping
interaction strengths (scaled so that :math:`CX = RZX(\pi/2)` corresponds to :math:`\pi/2`)
to circuit fidelities.

Args:
    unitary (Operator or ndarray): :math:`4 \times 4` unitary to synthesize.
    basis_fidelity (dict or float): Fidelity of basis gates. Can be either (1) a dictionary
        mapping ``XX`` angle values to fidelity at that angle; or (2) a single float ``f``,
        interpreted as ``{pi: f, pi/2: f/2, pi/3: f/3}``.
        If given, overrides the basis_fidelity given at init.
    approximate (bool): Approximates if basis fidelities are less than 1.0 .
    use_dag (bool): If true a :class:`.DAGCircuit` is returned instead of a
        :class:`QuantumCircuit` when this class is called.

Returns:
    QuantumCircuit: Synthesized circuit.
