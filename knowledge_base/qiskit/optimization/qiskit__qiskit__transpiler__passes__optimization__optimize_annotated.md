---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/optimize_annotated.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/optimize_annotated.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/optimize_annotated.py`

Optimize annotated operations on a circuit.

## `OptimizeAnnotated`

```python
class OptimizeAnnotated(TransformationPass)
```

Optimization pass on circuits with annotated operations.

Implemented optimizations:

* For each annotated operation, converting the list of its modifiers to a canonical form.
  For example, consecutively applying ``inverse()``, ``control(2)`` and ``inverse()``
  is equivalent to applying ``control(2)``.

* Removing annotations when possible.
  For example, ``AnnotatedOperation(SwapGate(), [InverseModifier(), InverseModifier()])``
  is equivalent to ``SwapGate()``.

* Recursively combining annotations.
  For example, if ``g1 = AnnotatedOperation(SwapGate(), InverseModifier())`` and
  ``g2 = AnnotatedOperation(g1, ControlModifier(2))``, then ``g2`` can be replaced with
  ``AnnotatedOperation(SwapGate(), [InverseModifier(), ControlModifier(2)])``.

* Applies conjugate reduction to annotated operations. As an example,
  ``control - [P -- Q -- P^{-1}]`` can be rewritten as ``P -- control - [Q] -- P^{-1}``,
  that is, only the middle part needs to be controlled. This also works for inverse
  and power modifiers.

### `__init__`

```python
def __init__(self, target: Target | None=None, equivalence_library: EquivalenceLibrary | None=None, basis_gates: list[str] | None=None, recurse: bool=True, do_conjugate_reduction: bool=True)
```

OptimizeAnnotated initializer.

Args:
    target:  the backend target to use for this pass.
    equivalence_library: The equivalence library used
        (instructions in this library will not be optimized by this pass).
    basis_gates:  target basis names to unroll to, e.g. `['u3', 'cx']`
        (instructions in this list will not be optimized by this pass).
        Ignored if ``target`` is also specified.
    recurse: By default, when either ``target`` or ``basis_gates`` is specified,
        the pass recursively descends into gate definitions (and the recursion is
        not applied when neither is specified since such objects do not need to
        be synthesized). Setting this value to ``False`` precludes the recursion in
        every case.
    do_conjugate_reduction: controls whether conjugate reduction should be performed.

### `run`

```python
def run(self, dag: DAGCircuit)
```

Run the OptimizeAnnotated pass on `dag`.

Args:
    dag: input dag.

Returns:
    Output dag with higher-level operations optimized.

Raises:
    TranspilerError: when something goes wrong.
