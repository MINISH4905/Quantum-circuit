---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/synthesis/high_level_synthesis.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/synthesis/high_level_synthesis.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/synthesis/high_level_synthesis.py`

High-level-synthesis transpiler pass.

## `HLSConfig`

```python
class HLSConfig
```

The high-level-synthesis config allows to specify a list of "methods" used by
:class:`~.HighLevelSynthesis` transformation pass to synthesize different types
of higher-level objects.

A higher-level object is an object of type :class:`~.Operation` (e.g., :class:`.Clifford` or
:class:`.LinearFunction`).  Each object is referred to by its :attr:`~.Operation.name` field
(e.g., ``"clifford"`` for :class:`.Clifford` objects), and the applicable synthesis methods are
tied to this name.

In the config, each method is specified in one of several ways:

1. a tuple consisting of the name of a known synthesis plugin and a dictionary providing
   additional arguments for the algorithm.
2. a tuple consisting of an instance of :class:`.HighLevelSynthesisPlugin` and additional
   arguments for the algorithm.
3. a single string of a known synthesis plugin
4. a single instance of :class:`.HighLevelSynthesisPlugin`.

The following example illustrates different ways how a config file can be created::

    from qiskit.transpiler.passes.synthesis.high_level_synthesis import HLSConfig
    from qiskit.transpiler.passes.synthesis.high_level_synthesis import ACGSynthesisPermutation

    # All the ways to specify hls_config are equivalent
    hls_config = HLSConfig(permutation=[("acg", {})])
    hls_config = HLSConfig(permutation=["acg"])
    hls_config = HLSConfig(permutation=[(ACGSynthesisPermutation(), {})])
    hls_config = HLSConfig(permutation=[ACGSynthesisPermutation()])

The names of the synthesis plugins should be declared in ``entry-points`` table for
``qiskit.synthesis`` in ``pyproject.toml``, in the form
<higher-level-object-name>.<synthesis-method-name>.

The standard higher-level-objects are recommended to have a synthesis method
called "default", which would be called automatically when synthesizing these objects,
without having to explicitly set these methods in the config.

To avoid synthesizing a given higher-level-object, one can give it an empty list of methods.

For an explicit example of using such config files, refer to the documentation for
:class:`~.HighLevelSynthesis`.

For an overview of the complete process of using high-level synthesis, see
:ref:`using-high-level-synthesis-plugins`.

### `__init__`

```python
def __init__(self, use_default_on_unspecified: bool=True, plugin_selection: str='sequential', plugin_evaluation_fn: Callable[[QuantumCircuit], int] | None=None, **kwargs)
```

Creates a high-level-synthesis config.

Args:
    use_default_on_unspecified: if True, every higher-level-object without an
        explicitly specified list of methods will be synthesized using the "default"
        algorithm if it exists.
    plugin_selection: if set to ``"sequential"`` (default), for every higher-level-object
        the synthesis pass will consider the specified methods sequentially, stopping
        at the first method that is able to synthesize the object. If set to ``"all"``,
        all the specified methods will be considered, and the best synthesized circuit,
        according to ``plugin_evaluation_fn`` will be chosen.
    plugin_evaluation_fn: a callable that evaluates the quality of the synthesized
        quantum circuit in the case that ``plugin_selection="all"``;
        a smaller value means a better circuit. If ``None``, the
        quality of the circuit is its size (i.e. the number of gates that it contains).
    kwargs: a dictionary mapping higher-level-objects to lists of synthesis methods.

### `set_methods`

```python
def set_methods(self, hls_name, hls_methods)
```

Sets the list of synthesis methods for a given higher-level-object. This overwrites
the lists of methods if also set previously.

## `HighLevelSynthesis`

```python
class HighLevelSynthesis(TransformationPass)
```

Synthesize higher-level objects and unroll custom definitions.

The input to this pass is a DAG that may contain higher-level objects,
including abstract mathematical objects (e.g., objects of type :class:`.LinearFunction`),
annotated operations (objects of type :class:`.AnnotatedOperation`), and
custom gates.

In the most common use-case when either ``basis_gates`` or ``target`` is specified,
all higher-level objects are synthesized, so the output is a :class:`.DAGCircuit`
without such objects.
More precisely, every gate in the output DAG is either directly supported by the target,
or is in ``equivalence_library``.

The abstract mathematical objects are synthesized using synthesis plugins, applying
synthesis methods specified in the high-level-synthesis config (refer to the documentation
for :class:`~.HLSConfig`).

As an example, let us assume that ``op_a`` and ``op_b`` are names of two higher-level objects,
that ``op_a``-objects have two synthesis methods ``default`` which does require any additional
parameters and ``other`` with two optional integer parameters ``option_1`` and ``option_2``,
that ``op_b``-objects have a single synthesis method ``default``, and ``qc`` is a quantum
circuit containing ``op_a`` and ``op_b`` objects. The following code snippet::

    hls_config = HLSConfig(op_b=[("other", {"option_1": 7, "option_2": 4})])
    pm = PassManager([HighLevelSynthesis(hls_config=hls_config)])
    transpiled_qc = pm.run(qc)

shows how to run the alternative synthesis method ``other`` for ``op_b``-objects, while using the
``default`` methods for all other high-level objects, including ``op_a``-objects.

The annotated operations (consisting of a base operation and a list of inverse, control and power
modifiers) are synthesizing recursively, first synthesizing the base operation, and then applying
synthesis methods for creating inverted, controlled, or powered versions of that).

The custom gates are synthesized by recursively unrolling their definitions, until every gate
is either supported by the target or is in the equivalence library.

When neither ``basis_gates`` nor ``target`` is specified, the pass synthesizes only the top-level
abstract mathematical objects and annotated operations, without descending into the gate
``definitions``. This is consistent with the older behavior of the pass, allowing to synthesize
some higher-level objects using plugins and leaving the other gates untouched.

The high-level-synthesis passes information about available auxiliary qubits, and whether their
state is clean (defined as :math:`|0\rangle`) or dirty (unknown state) to the synthesis routine
via the respective arguments ``"num_clean_ancillas"`` and ``"num_dirty_ancillas"``.
If ``qubits_initially_zero`` is ``True`` (default), the qubits are assumed to be in the
:math:`|0\rangle` state. When appending a synthesized block using auxiliary qubits onto the
circuit, we first use the clean auxiliary qubits.

.. note::

    Synthesis methods are assumed to maintain the state of the auxiliary qubits.
    Concretely this means that clean auxiliary qubits must still be in the :math:`|0\rangle`
    state after the synthesized block, while dirty auxiliary qubits are re-used only
    as dirty qubits.

### `__init__`

```python
def __init__(self, hls_config: HLSConfig | None=None, coupling_map: CouplingMap | None=None, target: Target | None=None, use_qubit_indices: bool=False, equivalence_library: EquivalenceLibrary | None=None, basis_gates: list[str] | None=None, min_qubits: int=0, qubits_initially_zero: bool=True, optimization_metric: OptimizationMetric=OptimizationMetric.COUNT_2Q)
```

HighLevelSynthesis initializer.

Args:
    hls_config:  the high-level-synthesis config that specifies synthesis methods
        and parameters for various high-level-objects in the circuit. If it is not specified,
        the default synthesis methods and parameters will be used.
    coupling_map:  directed graph represented as a coupling map.
    target:  the backend target to use for this pass. If it is specified,
        it will be used instead of the coupling map.
    use_qubit_indices: a flag indicating whether this synthesis pass is running before or after
        the layout is set, that is, whether the qubit indices of higher-level-objects correspond
        to qubit indices on the target backend.
    equivalence_library: The equivalence library used (instructions in this library will not
        be unrolled by this pass).
    basis_gates:  target basis names to unroll to, e.g. `['u3', 'cx']`.
        Ignored if ``target`` is also specified.
    min_qubits: The minimum number of qubits for operations in the input
        dag to translate.
    qubits_initially_zero: Indicates whether the qubits are initially in the state
        :math:`|0\rangle`. This allows the high-level-synthesis to use clean auxiliary qubits
        (i.e. in the zero state) to synthesize an operation.
    optimization_metric:  Specifies the optimization criterion used by the default synthesis
        methods for high-level-objects (when available).

### `run`

```python
def run(self, dag: DAGCircuit) -> DAGCircuit
```

Run the HighLevelSynthesis pass on `dag`.

Args:
    dag: input dag.

Returns:
    Output dag with higher-level operations synthesized.

Raises:
    TranspilerError: when the transpiler is unable to synthesize the given DAG
    (for instance, when the specified synthesis method is not available).
