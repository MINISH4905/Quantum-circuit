---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/transform/transformers.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/transform/transformers.ipynb
license: Apache-2.0
---

```python
# @title Copyright 2022 The Cirq Developers
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
```

# Circuit Transformers

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/transform/transformers"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/transform/transformers.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/transform/transformers.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/transform/transformers.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

## Setup

```python
try:
    import cirq
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq
    import cirq

    print("installed cirq.")
```

## What is a Transformer?
A transformer in Cirq is any callable that satisfies the `cirq.TRANSFORMER` API, and *transforms* an input circuit into an output circuit.

Circuit transformations are often necessary to compile a user-defined circuit to an equivalent circuit that satisfies the constraints necessary to be executable on a specific device or simulator. The compilation process often involves steps like:
- Gate Decompositions: Rewrite the circuit using only gates that belong to the device target gateset, i.e. set of gates which the device can execute. 
- Qubit Mapping and Routing: Map the logic qubits in the input circuit to physical qubits on the device and insert appropriate swap operations such that final circuit respects the hardware topology. 
- Circuit Optimizations: Perform hardware specific optimizations, like merging and replacing connected components of 1 and 2 operations with more efficient rewrite operations, commuting Z gates through the circuit, aligning gates in moments and more.


Cirq provides many out-of-the-box transformers which can be used as individual compilation passes. It also supplies a general framework for users to create their own transformers, by using powerful primitives and by bundling existing transformers together, to enable the compilation of circuits for specific targets. This page covers the available transformers in Cirq, how to use them, and how to write a simple transformer. The [Custom Transformers](./transformers.ipynb) page presents the details on creating more complex custom transformers through primitives and composition.

## Built-in Transformers in Cirq

## Overview
Transformers that come with cirq can be found in the [`/cirq/transformers`](https://github.com/quantumlib/Cirq/tree/main/cirq-core/cirq/transformers) package.

A few notable examples are:
*   **`cirq.align_left` / `cirq.align_right`**: Align gates to the left/right of the circuit by sliding them as far as possible along each qubit in the chosen direction.
*   **`cirq.defer_measurements`**:  Moves all (non-terminal) measurements in a circuit to the end of circuit by implementing the deferred measurement principle.
*   **`cirq.drop_empty_moments`** / **`cirq.drop_negligible_operations`**:  Removes moments that are empty or operations that have very small effects, respectively.
*   **`cirq.eject_phased_paulis`**: Pushes X, Y, and PhasedX gates towards the end of the circuit, potentially absorbing Z gates and modifying gates along the way.
*   **`cirq.eject_z`**:  Pushes Z gates towards the end of the circuit, potentially adjusting phases of gates that they pass through.
*   **`cirq.expand_composite`**:  Uses `cirq.decompose` to expand gates built from other gates (composite gates).
*   **`cirq.merge_k_qubit_unitaries`**: Replaces connected components of unitary operations, acting on <= k qubits, with op-tree given by `rewriter(circuit_op)`.
*   **`cirq.optimize_for_target_gateset`**: Attempts to convert a circuit into an equivalent circuit using only gates from a given target gateset.
*   **`cirq.stratified_circuit`**: Repacks the circuit to ensure that moments only contain operations from the same category.
*   **`cirq.synchronize_terminal_measurements`**:  Moves all terminal measurements in a circuit to the final moment, if possible.


Below you can see how to implement a transformer pipeline as a function called `optimize_circuit`, which composes a few of the available Cirq transformers.

```python
def optimize_circuit(circuit, context=None, k=2):
    # Merge 2-qubit connected components into circuit operations.
    optimized_circuit = cirq.merge_k_qubit_unitaries(
        circuit, k=k, rewriter=lambda op: op.with_tags("merged"), context=context
    )

    # Drop operations with negligible effect / close to identity.
    optimized_circuit = cirq.drop_negligible_operations(optimized_circuit, context=context)

    # Expand all remaining merged connected components.
    optimized_circuit = cirq.expand_composite(
        optimized_circuit, no_decomp=lambda op: "merged" not in op.tags, context=context
    )

    # Synchronize terminal measurements to be in the same moment.
    optimized_circuit = cirq.synchronize_terminal_measurements(optimized_circuit, context=context)

    # Assert the original and optimized circuit are equivalent.
    cirq.testing.assert_circuits_with_terminal_measurements_are_equivalent(
        circuit, optimized_circuit
    )

    return optimized_circuit


q = cirq.LineQubit.range(3)
circuit = cirq.Circuit(
    cirq.H(q[1]),
    cirq.CNOT(*q[1:]),
    cirq.H(q[0]),
    cirq.CNOT(*q[:2]),
    cirq.H(q[1]),
    cirq.CZ(*q[:2]),
    cirq.H.on_each(*q[:2]),
    cirq.CNOT(q[2], q[0]),
    cirq.measure_each(*q),
)
print("Original Circuit:", circuit, sep="\n")
print("Optimized Circuit:", optimize_circuit(circuit), sep="\n")
```

## Inspecting transformer actions

Every transformer in Cirq accepts a `cirq.TransformerContext` instance, which stores common configurable options useful for all transformers. 

One of the members of transformer context dataclass is `cirq.TransformerLogger` instance. When a logger instance is specified, every cirq transformer logs its action on the input circuit using the given logger instance. The logs can then be inspected to understand the action of each individual transformer on the circuit.

Below, you can inspect the action of each transformer in the `optimize_circuit` method defined above.

```python
context = cirq.TransformerContext(logger=cirq.TransformerLogger())
optimized_circuit = optimize_circuit(circuit, context)
context.logger.show()
```

By first using `cirq.merge_k_qubit_unitaries` to turn connected components of the circuit into `cirq.CircuitOperation`s, `cirq.drop_negligible_operations` was able to identify that one of the merged connected components was equivalent to the identity operation and remove it. The remaining steps returned the circuit to a more typical state, expanding intermediate `cirq.CircuitOperation`s and aligning measurements to be terminal measurements.

## Support for no-compile tags

Cirq also supports tagging operations with no-compile tags such that these tagged operations are ignored when applying transformations on the circuit. This allows users to gain more fine-grained conrol over the compilation process. 

Any valid tag can be used as a "no-compile" tag by adding it to the `tags_to_ignore` field in `cirq.TransformerContext`. When called with a context, cirq transformers will inspect the `context.tags_to_ignore` field and ignore an operation if `op.tags & context.tags_to_ignore` is not empty. 

Below, you can use no-compile tags when transforming a circuit using the `optimize_circuit` method defined above.

```python
# Echo pulses inserted in the circuit to prevent dephasing during idling should be ignored.
circuit = cirq.Circuit(
    cirq.H(q[0]),
    cirq.CNOT(*q[:2]),
    [
        op.with_tags("spin_echoes") for op in [cirq.X(q[0]) ** 0.5, cirq.X(q[0]) ** -0.5]
    ],  # the echo pulses
    [cirq.CNOT(*q[1:]), cirq.CNOT(*q[1:])],
    [cirq.CNOT(*q[:2]), cirq.H(q[0])],
    cirq.measure_each(*q),
)
# Original Circuit
print("Original Circuit:", circuit, "\n", sep="\n")

# Optimized Circuit without tags_to_ignore
print("Optimized Circuit without specifying tags_to_ignore:")
print(optimize_circuit(circuit, k=1), "\n")

# Optimized Circuit ignoring operations marked with tags_to_ignore.
print("Optimized Circuit while ignoring operations marked with tags_to_ignore:")
context = cirq.TransformerContext(tags_to_ignore=["spin_echoes"])
print(optimize_circuit(circuit, k=1, context=context), "\n")
```

## Support for recursively transforming sub-circuits

By default, an operation `op` of type `cirq.CircuitOperation` is considered as a single top-level operation by cirq transformers. As a result, the sub-circuits wrapped inside circuit operations will often be left as it is and a transformer will only modify the top-level circuit. 

If you wish to recursively run a transformer on every nested sub-circuit wrapped inside a `cirq.CircuitOperation`, you can set `context.deep=True` in the `cirq.TransformerContext` object. Note that tagged circuit operations marked with any of `context.tags_to_ignore` will be ignored even if `context.deep is True`. See the example below for a better understanding.

```python
q = cirq.LineQubit.range(2)
circuit_op = cirq.CircuitOperation(
    cirq.FrozenCircuit(cirq.I.on_each(*q), cirq.CNOT(*q), cirq.I(q[0]).with_tags("ignore"))
)
circuit = cirq.Circuit(
    cirq.I(q[0]), cirq.I(q[1]).with_tags("ignore"), circuit_op, circuit_op.with_tags("ignore")
)
print("Original Circuit:", circuit, "\n", sep="\n\n")

context = cirq.TransformerContext(tags_to_ignore=["ignore"], deep=False)
print("Optimized Circuit with deep=False and tags_to_ignore=['ignore']:\n")
print(cirq.drop_negligible_operations(circuit, context=context), "\n\n")

context = cirq.TransformerContext(tags_to_ignore=["ignore"], deep=True)
print("Optimized Circuit with deep=True and tags_to_ignore=['ignore']:\n")
print(cirq.drop_negligible_operations(circuit, context=context), "\n")
```

The leading identity gate that wasn't tagged was removed from both optimized circuits, but the identity gates within each `cirq.CircuitOperation` were removed if `deep = true` and the `CircuitOperation` wasn't tagged and the identity operation wasn't tagged.

## Compiling to NISQ targets: `cirq.CompilationTargetGateset`
Cirq's philosophy on compiling circuits for execution on a NISQ target device or simulator is that it would often require running only a handful of individual compilation passes on the input circuit, one after the other.

**`cirq.CompilationTargetGateset`** is an abstraction in Cirq to represent such compilation targets as well as the bundles of transformer passes which should be executed to compile a circuit to this target. Cirq has implementations for common target gatesets like `cirq.CZTargetGateset`, `cirq.SqrtIswapTargetGateset` etc.


**`cirq.optimize_for_target_gateset`** is a transformer which compiles a given circuit for a `cirq.CompilationTargetGateset` via the following steps:

1. Run all `gateset.preprocess_transformers`
2. Convert operations using built-in `cirq.decompose` + `gateset.decompose_to_target_gateset`.
3. Run all `gateset.postprocess_transformers`


The preprocess transformers often includes optimizations like merging connected components of 1/2 qubit unitaries into a single unitary matrix, which can then be replaced with an efficient analytical decomposition as part of step-2. 

The post-process transformers often includes cleanups and optimizations like dropping negligible operations, 
converting single qubit rotations into desired form, circuit alignments etc.

```python
# Original QFT Circuit on 3 qubits.
q = cirq.LineQubit.range(3)
circuit = cirq.Circuit(cirq.QuantumFourierTransformGate(3).on(*q), cirq.measure(*q))
print("Original Circuit:", circuit, "\n", sep="\n")

# Compile the circuit for CZ Target Gateset.
gateset = cirq.CZTargetGateset(allow_partial_czs=True)
cz_circuit = cirq.optimize_for_target_gateset(circuit, gateset=gateset)
cirq.testing.assert_circuits_with_terminal_measurements_are_equivalent(circuit, cz_circuit)
print("Circuit compiled for CZ Target Gateset:", cz_circuit, "\n", sep="\n")
```

`cirq.optimize_for_target_gateset` also supports all the features discussed above, using `cirq.TransformerContext`. For example, you can compile the circuit for sqrt-iswap target gateset and inspect action of individual transformers using `cirq.TransformerLogger`, as shown below.

```python
context = cirq.TransformerContext(logger=cirq.TransformerLogger())
gateset = cirq.SqrtIswapTargetGateset()
sqrt_iswap_circuit = cirq.optimize_for_target_gateset(circuit, gateset=gateset, context=context)
cirq.testing.assert_circuits_with_terminal_measurements_are_equivalent(circuit, sqrt_iswap_circuit)
context.logger.show()
```

# Summary
Cirq provides a plethora of built-in transformers which can be composed together into useful abstractions, like `cirq.CompilationTargetGateset`, which in-turn can be serialized and can be used as a parameter in larger compilation pipelines and experiment workflows. 

Try using these transformers to compile your circuits and refer to the API reference docs of `cirq.TRANSFORMER` for more details.
