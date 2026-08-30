---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/transform/custom_transformers.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/transform/custom_transformers.ipynb
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

# Custom Transformers

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/transform/custom_transformers"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/transform/custom_transformers.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/transform/custom_transformers.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/transform/custom_transformers.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

The [Transformers](./transformers.ipynb) page introduced what a transformer is, what transformers are available in Cirq, and how to create a simple one as a composite of others. This page covers the details necessary for creating more nuanced custom transformers, including `cirq.TransformerContext`, primitives and decompositions.

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

## `cirq.TRANSFORMER` API and `@cirq.transformer` decorator

Any callable that satisfies the `cirq.TRANSFORMER` contract, i.e. takes a `cirq.AbstractCircuit` and `cirq.TransformerContext` and returns a transformed `cirq.AbstractCircuit`, is a valid transformer in Cirq. 

You can create a custom transformer by simply decorating a class/method, that satisfies the above contract, with `@cirq.transformer` decorator.

```python
@cirq.transformer
def reverse_circuit(circuit, *, context=None):
    """Transformer to reverse the input circuit."""
    return circuit[::-1]


@cirq.transformer
class SubstituteGate:
    """Transformer to substitute `source` gates with `target` in the input circuit."""

    def __init__(self, source, target):
        self._source = source
        self._target = target

    def __call__(self, circuit, *, context=None):
        batch_replace = []
        for i, op in circuit.findall_operations(lambda op: op.gate == self._source):
            batch_replace.append((i, op, self._target.on(*op.qubits)))
        transformed_circuit = circuit.unfreeze(copy=True)
        transformed_circuit.batch_replace(batch_replace)
        return transformed_circuit


# Build your circuit
q = cirq.NamedQubit("q")
circuit = cirq.Circuit(
    cirq.X(q), cirq.CircuitOperation(cirq.FrozenCircuit(cirq.X(q), cirq.Y(q))), cirq.Z(q)
)
# Transform and compare the circuits.
substitute_gate = SubstituteGate(cirq.X, cirq.S)
print("Original Circuit:", circuit, "\n", sep="\n")
print("Reversed Circuit:", reverse_circuit(circuit), "\n", sep="\n")
print("Substituted Circuit:", substitute_gate(circuit), sep="\n")
```

## `cirq.TransformerContext` to store common configurable options
`cirq.TransformerContext` is a dataclass that stores common configurable options for all transformers. All cirq transformers should accept the transformer context as an optional keyword argument. 

The `@cirq.transformer` decorator can inspect the `cirq.TransformerContext` argument and automatically append useful functionality, like support for automated logging and recursively running the transformer on nested sub-circuits.

### `cirq.TransformerLogger` and support for automated logging
The `cirq.TransformerLogger` class is used to log the actions of a transformer on an input circuit. `@cirq.transformer` decorator automatically adds support for logging the initial and final circuits for each transformer step.

```python
# Note that you want to log the steps.
context = cirq.TransformerContext(logger=cirq.TransformerLogger())
# Transform the circuit.
transformed_circuit = reverse_circuit(circuit, context=context)
transformed_circuit = substitute_gate(transformed_circuit, context=context)
# Show the steps.
context.logger.show()
```

Neither of the custom transformers, `reverse_circuit` or `substitute_gate`, had any explicit support for a logger present in the `context` argument, but the decorator was able to use it anyways. 

If your custom transformer calls another transformer as part of it, then that transformer should log its behavior as long as you pass the `context` object to it. All Cirq-provided transformers do this.

```python
@cirq.transformer
def reverse_and_substitute(circuit, context=None):
    reversed_circuit = reverse_circuit(circuit, context=context)
    reversed_and_substituted_circuit = substitute_gate(reversed_circuit, context=context)
    return reversed_and_substituted_circuit


# Note that you want to log the steps.
context = cirq.TransformerContext(logger=cirq.TransformerLogger())
# Transform the circuit.
transformed_circuit = reverse_and_substitute(circuit, context=context)
# Show the steps.
context.logger.show()
```

Note: Each transformer that is run on the circuit is indexed globally, over all transformers run through the logger. However, when one transformer (`reverse_and_substitute`) runs other transformers as a subprocess (`reverse_circuit` and `SubstituteGate`), the constitutent transformers are indented to show this relationship.

### Support for `deep=True`
You can call `@cirq.transformer(add_deep_support=True)` to automatically add the functionality of recursively running the custom transformer on circuits wrapped inside `cirq.CircuitOperation`. The recursive execution behavior of the transformer can then be controlled by setting `deep=True` in the transformer context.

```python
@cirq.transformer(add_deep_support=True)
def reverse_circuit_deep(circuit, *, context=None):
    """Transformer to reverse the input circuit."""
    return circuit[::-1]


@cirq.transformer(add_deep_support=True)
class SubstituteGateDeep(SubstituteGate):
    """Transformer to substitute `source` gates with `target` in the input circuit."""

    pass


# Note that you want to transform the CircuitOperations.
context = cirq.TransformerContext(deep=True)
# Transform and compare the circuits.
substitute_gate_deep = SubstituteGateDeep(cirq.X, cirq.S)
print("Original Circuit:", circuit, "\n", sep="\n")
print(
    "Reversed Circuit with deep=True:",
    reverse_circuit_deep(circuit, context=context),
    "\n",
    sep="\n",
)
print(
    "Substituted Circuit with deep=True:", substitute_gate_deep(circuit, context=context), sep="\n"
)
```

## Transformer Primitives and Decompositions

If you need to perform more fundamental changes than just running other transformers in sequence (like `SubstituteGate` did with `cirq.Circuit.batch_replace`), Cirq provides circuit compilation primitives and gate decomposition utilities for doing so.

### Moment preserving transformer primitives

Cirq's transformer primitives are useful abstractions to implement common transformer patterns, while preserving the moment structure of input circuit. Some of the notable transformer primitives are:

- **`cirq.map_operations`**: Applies local transformations on operations, by calling `map_func(op)` for each `op`.
- **`cirq.map_moments`**: Applies local transformation on moments, by calling `map_func(m)` for each moment `m`.
- **`cirq.merge_operations`**: Merges connected component of operations by iteratively calling `merge_func(op1, op2)`  for every pair of mergeable operations `op1` and `op2`.
- **`cirq.merge_moments`**: Merges adjacent moments, from left to right, by iteratively calling `merge_func(m1, m2)` for adjacent moments `m1` and `m2`.

An important property of these primitives is that they have support for common configurable options present in `cirq.TransformerContext`, such as `tags_to_ignore` and `deep`, as demonstrated in the example below. 

Note: Primitives support both the `deep` argument and the `tags_to_ignore` argument, like many transformers, so you can easily pass those values in from a `TransformContext`, if one is available.

```python
@cirq.transformer
def substitute_gate_using_primitives(circuit, *, context=None, source=cirq.X, target=cirq.S):
    """Transformer to substitute `source` gates with `target` in the input circuit.

    The transformer is implemented using `cirq.map_operations` primitive and hence
    has built-in support for
      1. Recursively running the transformer on sub-circuits if `context.deep is True`.
      2. Ignoring operations tagged with any of `context.tags_to_ignore`.
    """
    return cirq.map_operations(
        circuit,
        map_func=lambda op, _: target.on(*op.qubits) if op.gate == source else op,
        deep=context.deep if context else False,
        tags_to_ignore=context.tags_to_ignore if context else (),
    )


# Build your circuit from x_y_x components.
x_y_x = [cirq.X(q), cirq.Y(q), cirq.X(q).with_tags("ignore")]
circuit = cirq.Circuit(x_y_x, cirq.CircuitOperation(cirq.FrozenCircuit(x_y_x)), x_y_x)
# Note that you want to transform the CircuitOperations and ignore tagged operations.
context = cirq.TransformerContext(deep=True, tags_to_ignore=("ignore",))
# Compare the before and after circuits.
print("Original Circuit:", circuit, "\n", sep="\n")
print(
    "Substituted Circuit:",
    substitute_gate_using_primitives(circuit, context=context),
    "\n",
    sep="\n",
)
```

## Analytical Gate Decompositions

Gate decomposition is the process of implementing / decomposing a given unitary `U` using only gates that belong to a specific target gateset. 

Cirq provides analytical decomposition methods, often based on [KAK Decomposition](https://arxiv.org/abs/quant-ph/0507171), to decompose one-, two-, and three-qubit unitary matrices into specific target gatesets. Some notable decompositions are:

* **`cirq.single_qubit_matrix_to_pauli_rotations`**: Decomposes a single qubit matrix to ZPow/XPow/YPow rotations. 
* **`cirq.single_qubit_matrix_to_phased_x_z`**: Decomposes a single-qubit matrix to a PhasedX and Z gate.
* **`cirq.two_qubit_matrix_to_sqrt_iswap_operations`**: Decomposes any two-qubit unitary matrix into ZPow/XPow/YPow/sqrt-iSWAP gates.
* **`cirq.two_qubit_matrix_to_cz_operations`**: Decomposes any two-qubit unitary matrix into ZPow/XPow/YPow/CZ gates.
* **`cirq.three_qubit_matrix_to_operations`**: Decomposes any three-qubit unitary matrix into CZ/CNOT and single qubit rotations.



You can use these analytical decomposition methods to build transformers which can rewrite a given circuit using only gates from the target gateset. This example again uses the transformer primitives to support recursive execution and `ignore` tagging.

```python
@cirq.transformer
def convert_to_cz_target(circuit, *, context=None, atol=1e-8, allow_partial_czs=True):
    """Transformer to rewrite the given circuit using CZs + 1-qubit rotations.

    Note that the transformer decomposes only operations on <= 2-qubits and is
    presented as an illustration of using transformer primitives + analytical
    decomposition methods.
    """

    def map_func(op: cirq.Operation, _) -> cirq.OP_TREE:
        if not (cirq.has_unitary(op) and cirq.num_qubits(op) <= 2):
            return op
        matrix = cirq.unitary(op)
        qubits = op.qubits
        if cirq.num_qubits(op) == 1:
            g = cirq.single_qubit_matrix_to_phxz(matrix)
            return g.on(*qubits) if g else []
        return cirq.two_qubit_matrix_to_cz_operations(
            *qubits, matrix, allow_partial_czs=allow_partial_czs, atol=atol
        )

    return cirq.map_operations_and_unroll(
        circuit,
        map_func,
        deep=context.deep if context else False,
        tags_to_ignore=context.tags_to_ignore if context else (),
    )


# Build the circuit from three versions of the same random component
component = cirq.testing.random_circuit(qubits=3, n_moments=2, op_density=0.8, random_state=1234)
component_operation = cirq.CircuitOperation(cirq.FrozenCircuit(component))
# A normal component, a CircuitOperation version, and a ignore-tagged CircuitOperation version
circuit = cirq.Circuit(component, component_operation, component_operation.with_tags('ignore'))
# Note that you want to transform the CircuitOperations, ignore tagged operations, and log the steps.
context = cirq.TransformerContext(
    deep=True, tags_to_ignore=("ignore",), logger=cirq.TransformerLogger()
)
# Run your transformer.
converted_circuit = convert_to_cz_target(circuit, context=context)
# Ensure that the resulting circuit is equivalent.
cirq.testing.assert_circuits_with_terminal_measurements_are_equivalent(circuit, converted_circuit)
# Show the steps executed.
context.logger.show()
```

## Heuristic Gate Decompositions
Cirq also provides heuristic methods for decomposing any two qubit unitary matrix in terms of any specified two qubit target unitary + single qubit rotations. These methods are useful when accurate analytical decompositions for the target unitary are not known or when gate decomposition fidelity (i.e. accuracy of decomposition) can be traded off against decomposition depth (i.e. number of 2q gates in resulting decomposition) to achieve a higher overall gate fidelity. 


See the following resources for more details on heuristic gate decomposition:

* **`cirq.two_qubit_gate_product_tabulation`**
* **https://arxiv.org/pdf/2106.15490.pdf**

# Summary
Cirq provides a flexible and powerful framework to
* Use built-in transformer primitives and analytical tools to create powerful custom transformers both from scratch and by composing existing transformers.
* Easily integrate custom transformers with built-in infrastructure to augment functionality like automated logging, recursive execution on sub-circuits, support for no-compile tags etc.
