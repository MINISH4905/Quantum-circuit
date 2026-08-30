---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/decomposition/symbolic_decomposition.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/decomposition/symbolic_decomposition.py
license: Apache-2.0
---

## Module `pennylane/decomposition/symbolic_decomposition.py`

This module contains special logic of decomposing symbolic operations.

## `make_adjoint_decomp`

```python
def make_adjoint_decomp(base_decomposition: DecompositionRule, use_reconstructor=False)
```

Create a decomposition rule for the adjoint of a decomposition rule.

## `cancel_adjoint`

```python
def cancel_adjoint(*params, wires, base)
```

Decompose the adjoint of the adjoint of an operator.

## `qjit_compatible_cancel_adjoint`

```python
def qjit_compatible_cancel_adjoint(*params, wires, base_class, base_params)
```

A catalyst-compatible decomposition rule that cancels nested adjoints.

Precondition
- has_reconstructor(base_class, base_params)

## `adjoint_rotation`

```python
def adjoint_rotation(phi, wires, base)
```

Decompose the adjoint of a rotation operator by inverting the angle.

## `qjit_compatible_adjoint_rotation`

```python
def qjit_compatible_adjoint_rotation(phi, wires, base_class, base_params)
```

A catalyst-compatible decomposition rule for single-angle rotations.

## `is_integer`

```python
def is_integer(x)
```

Checks if x is an integer.

## `repeat_pow_base`

```python
def repeat_pow_base(*params, wires, base, z, **__)
```

Decompose the power of an operator by repeating the base operator. Assumes z
is a non-negative integer.

## `qjit_compatible_repeat_pow_base`

```python
def qjit_compatible_repeat_pow_base(*params, wires, base_class, base_params, z, **__)
```

Decompose the power of an operator by repeating the base operator, in a qjit compatible way.

## `merge_powers`

```python
def merge_powers(*params, wires, base, z, **__)
```

Decompose nested powers by combining them.

## `qjit_compatible_merge_powers`

```python
def qjit_compatible_merge_powers(*params, wires, base_class, base_params, z, **__)
```

Decompose nested powers by combining them in a qjit compatible way.

## `flip_pow_adjoint`

```python
def flip_pow_adjoint(*params, wires, base, z, **__)
```

Decompose the power of an adjoint by power to the base of the adjoint and
then taking the adjoint of the power.

## `qjit_compatible_flip_pow_adjoint`

```python
def qjit_compatible_flip_pow_adjoint(*params, wires, base_class, base_params, z, **__)
```

Decompose the power of an adjoint in a qjit compatible way.

## `make_pow_decomp_with_period`

```python
def make_pow_decomp_with_period(period, use_reconstructor=False) -> DecompositionRule
```

Make a decomposition rule for the power of an op that has a period.

## `pow_rotation`

```python
def pow_rotation(phi, wires, base, z, **__)
```

Decompose the power of a general rotation operator by multiplying the power by the angle.

## `qjit_compatible_pow_rotation`

```python
def qjit_compatible_pow_rotation(phi, wires, base_class, base_params, z, **__)
```

Decompose the power of a general rotation operator by multiplying the power by the angle in a qjit compatible way.

## `decompose_to_base`

```python
def decompose_to_base(*params, wires, base, **__)
```

Decompose a symbolic operator to its base.

## `qjit_compatible_decompose_to_base`

```python
def qjit_compatible_decompose_to_base(*params, wires, base_class, base_params, **__)
```

Decompose a symbolic operator to its base in a qjit compatible way.

## `make_controlled_decomp`

```python
def make_controlled_decomp(base_decomposition: DecompositionRule)
```

Create a decomposition rule for the control of a decomposition rule.

## `flip_zero_control`

```python
def flip_zero_control(inner_decomp: DecompositionRule, name: str='') -> DecompositionRule
```

Wraps a decomposition for a controlled operator with X gates to flip zero control wires.

## `flip_control_adjoint`

```python
def flip_control_adjoint(*_, wires, control_wires, control_values, work_wires, work_wire_type, base, **__)
```

Decompose the control of an adjoint by applying control to the base of the adjoint
and taking the adjoint of the control.

## `to_controlled_qubit_unitary`

```python
def to_controlled_qubit_unitary(*_, wires, control_values, work_wires, work_wire_type, base, **__)
```

Convert a controlled operator to a controlled qubit unitary.
