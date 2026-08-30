---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/synthesis/solovay_kitaev_synthesis.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/synthesis/solovay_kitaev_synthesis.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/synthesis/solovay_kitaev_synthesis.py`

===============================
Solovay-Kitaev Synthesis Plugin
===============================

.. autosummary::
   :toctree: ../stubs/

   SolovayKitaevSynthesis

## `SolovayKitaev`

```python
class SolovayKitaev(TransformationPass)
```

Approximately decompose 1q gates to a discrete basis using the Solovay-Kitaev algorithm.

The Solovay-Kitaev theorem [1] states that any single qubit gate can be approximated to
arbitrary precision by a set of fixed single-qubit gates, if the set generates a dense
subset in :math:`SU(2)`. This is an important result, since it means that any single-qubit
gate can be expressed in terms of a discrete, universal gate set that we know how to implement
fault-tolerantly. Therefore, the Solovay-Kitaev algorithm allows us to take any
non-fault tolerant circuit and rephrase it in a fault-tolerant manner.

This implementation of the Solovay-Kitaev algorithm is based on [2].

For example, the following circuit

.. code-block:: text

         ┌─────────┐
    q_0: ┤ RX(0.8) ├
         └─────────┘

can be decomposed into

.. code-block:: text

    global phase: 7π/8
         ┌───┐┌───┐┌───┐
    q_0: ┤ H ├┤ T ├┤ H ├
         └───┘└───┘└───┘

with an L2-error of approximately 0.01.

Examples:

    Per default, the basis gate set is ``["t", "tdg", "h"]``:

    .. plot::
       :include-source:
       :nofigs:

        import numpy as np
        from qiskit.circuit import QuantumCircuit
        from qiskit.transpiler.passes.synthesis import SolovayKitaev
        from qiskit.quantum_info import Operator

        circuit = QuantumCircuit(1)
        circuit.rx(0.8, 0)

        print("Original circuit:")
        print(circuit.draw())

        skd = SolovayKitaev(recursion_degree=2)

        discretized = skd(circuit)

        print("Discretized circuit:")
        print(discretized.draw())

        print("Error:", np.linalg.norm(Operator(circuit).data - Operator(discretized).data))

    .. code-block:: text

        Original circuit:
           ┌─────────┐
        q: ┤ Rx(0.8) ├
           └─────────┘
        Discretized circuit:
        global phase: 7π/8
           ┌───┐┌───┐┌───┐
        q: ┤ H ├┤ T ├┤ H ├
           └───┘└───┘└───┘
        Error: 2.828408279166474

    Individual basis gate sets can be specified in the initializer.

    .. plot::
       :include-source:
       :nofigs:

        from qiskit.transpiler.passes import SolovayKitaev

        basis = ["s", "sdg", "t", "tdg", "z", "h"]

        skd = SolovayKitaev(recursion_degree=2, basis_gates=basis)

    To generate and store basic approximations in between different instances, the
    :class:`.SolovayKitaevDecomposition` and its
    :meth:`~.SolovayKitaevDecomposition.save_basic_approximations` method can be used.

    .. code-block:: python

        from qiskit.transpiler.passes import SolovayKitaev
        from qiskit.synthesis import SolovayKitaevDecomposition

        # generate basic approximations
        basis = ["s", "sdg", "t", "tdg", "z", "h"]
        decomp = SolovayKitaevDecomposition(basis_gates=basis, depth=5)

        # store them in a local file
        fname = "sk_approx.bin"
        decomp.save_basic_approximations(fname)

        # load them for running Solovay-Kitaev
        skd = SolovayKitaev(recursion_degree=2, basic_approximations=fname)


References:

[1] Kitaev, A Yu (1997). Quantum computations: algorithms and error correction.
Russian Mathematical Surveys. 52 (6): 1191–1249.
`Online <https://iopscience.iop.org/article/10.1070/RM1997v052n06ABEH002155>`_.

[2] Dawson, Christopher M.; Nielsen, Michael A. (2005) The Solovay-Kitaev Algorithm.
`arXiv:quant-ph/0505030 <https://arxiv.org/abs/quant-ph/0505030>`_.

### `__init__`

```python
def __init__(self, recursion_degree: int=5, basic_approximations: str | dict[str, np.ndarray] | None=None, *, basis_gates: list[str | Gate] | None=None, depth: int=12) -> None
```

Args:
    recursion_degree: The recursion depth for the Solovay-Kitaev algorithm.
        A larger recursion depth increases the accuracy and length of the
        decomposition.
    basic_approximations: The basic approximations for the finding the best discrete
        decomposition at the root of the recursion. If a string, it specifies the
        file to load the approximations from. If a dictionary, it contains
        ``{label: SO(3)-matrix}`` pairs. If ``None``, a default based on the :math:`H`,
        :math:`T` and :math:`T^\dagger` gates up to depth 16 is generated.
        Note that if ``basic_approximations`` is passed, ``basis_gates`` and
        ``depth`` cannot be set.
    basis_gates: The basis gates used to build the net of basic approximations.
        Defaults to ``["h", "t", "tdg"]``. This argument cannot be set if
        ``basic_approximations`` is provided.
    depth: The maximal gate depth used in basic approximations. This argument cannot be
        set if ``basic_approximations`` is provided.

### `run`

```python
def run(self, dag: DAGCircuit) -> DAGCircuit
```

Run the ``SolovayKitaev`` pass on `dag`.

Args:
    dag: The input dag.

Returns:
    Output dag with 1q gates synthesized in the discrete target basis.

Raises:
    TranspilerError: if a gate does not have to_matrix

## `SolovayKitaevSynthesis`

```python
class SolovayKitaevSynthesis(UnitarySynthesisPlugin)
```

A Solovay-Kitaev Qiskit unitary synthesis plugin.

This plugin is invoked by :func:`~.compiler.transpile` when the ``unitary_synthesis_method``
parameter is set to ``"sk"``.

This plugin supports customization and additional parameters can be passed to the plugin
by passing a dictionary as the ``unitary_synthesis_plugin_config`` parameter of
the :func:`~qiskit.compiler.transpile` function.

Supported parameters in the dictionary:

basic_approximations (str | dict):
    The basic approximations for the finding the best discrete decomposition at the root of the
    recursion. If a string, it specifies the ``.npy`` file to load the approximations from.
    If a dictionary, it contains ``{label: SO(3)-matrix}`` pairs. If None, a default based on
    the specified ``basis_gates`` and ``depth`` is generated.

basis_gates (list):
    A list of strings specifying the discrete basis gates to decompose to. If None,
    it defaults to ``["h", "t", "tdg"]``. If ``basic_approximations`` is not None,
    ``basis_set`` is required to correspond to the basis set that was used to
    generate it.

depth (int):
    The gate-depth of the basic approximations. All possible, unique combinations of the
    basis gates up to length ``depth`` are considered. If None, defaults to 12.
    If ``basic_approximations`` is not None, ``depth`` is required to correspond to the
    depth that was used to generate it.

recursion_degree (int):
    The number of times the decomposition is recursively improved. If None, defaults to 5.

### `max_qubits`

```python
def max_qubits(self)
```

Maximum number of supported qubits is ``1``.

### `min_qubits`

```python
def min_qubits(self)
```

Minimum number of supported qubits is ``1``.

### `supports_natural_direction`

```python
def supports_natural_direction(self)
```

The plugin does not support natural direction, it does not assume
bidirectional two qubit gates.

### `supports_pulse_optimize`

```python
def supports_pulse_optimize(self)
```

The plugin does not support optimization of pulses.

### `supports_gate_lengths`

```python
def supports_gate_lengths(self)
```

The plugin does not support gate lengths.

### `supports_gate_errors`

```python
def supports_gate_errors(self)
```

The plugin does not support gate errors.

### `supported_bases`

```python
def supported_bases(self)
```

The plugin does not support bases for synthesis.

### `supports_basis_gates`

```python
def supports_basis_gates(self)
```

The plugin does not support basis gates. By default it synthesizes to the
``["h", "t", "tdg"]`` gate basis.

### `supports_coupling_map`

```python
def supports_coupling_map(self)
```

The plugin does not support coupling maps.

### `run`

```python
def run(self, unitary, **options)
```

Run the SolovayKitaevSynthesis synthesis plugin on the given unitary.
