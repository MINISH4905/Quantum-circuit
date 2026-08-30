---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/arithmetic_operation.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/arithmetic_operation.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/arithmetic_operation.py`

Helper class for implementing classical arithmetic operations.

## `ArithmeticGate`

```python
class ArithmeticGate(Gate, metaclass=abc.ABCMeta)
```

A helper gate for implementing reversible classical arithmetic.

Child classes must override the `registers`, `with_registers`, and `apply`
methods.

This class handles the details of ensuring that the scaling of implementing
the gate is O(2^n) instead of O(4^n) where n is the number of qubits
being acted on, by implementing an `_apply_unitary_` function in terms of
the registers and the apply function of the child class.

Examples:

>>> class Add(cirq.ArithmeticGate):
...     def __init__(
...         self,
...         target_register: int | Sequence[int],
...         input_register: int | Sequence[int],
...     ):
...         self.target_register = target_register
...         self.input_register = input_register
...
...     def registers(self) -> Sequence[int | Sequence[int]]:
...         return self.target_register, self.input_register
...
...     def with_registers(
...         self, *new_registers: int | Sequence[int]
...     ) -> 'Add':
...         return Add(*new_registers)
...
...     def apply(self, *register_values: int) -> int | Iterable[int]:
...         return sum(register_values)
>>> cirq.unitary(
...     Add(target_register=[2, 2],
...         input_register=1).on(*cirq.LineQubit.range(2))
... ).astype(np.int32)
array([[0, 0, 0, 1],
       [1, 0, 0, 0],
       [0, 1, 0, 0],
       [0, 0, 1, 0]], dtype=int32)
>>> c = cirq.Circuit(
...    cirq.X(cirq.LineQubit(3)),
...    cirq.X(cirq.LineQubit(2)),
...    cirq.X(cirq.LineQubit(6)),
...    cirq.measure(*cirq.LineQubit.range(4, 8), key='before_in'),
...    cirq.measure(*cirq.LineQubit.range(4), key='before_out'),
...
...    Add(target_register=[2] * 4,
...        input_register=[2] * 4).on(*cirq.LineQubit.range(8)),
...
...    cirq.measure(*cirq.LineQubit.range(4, 8), key='after_in'),
...    cirq.measure(*cirq.LineQubit.range(4), key='after_out'),
... )
>>> cirq.sample(c).data
   before_in  before_out  after_in  after_out
0          2           3         2          5

### `registers`

```python
def registers(self) -> Sequence[int | Sequence[int]]
```

The data acted upon by the arithmetic gate.

Each register in the list can either be a classical constant (an `int`),
or else a list of qubit/qudit dimensions. Registers that are set to a
classical constant must not be mutated by the arithmetic gate
(their value must remain fixed when passed to `apply`).

Registers are big endian. The first qubit is the most significant, the
last qubit is the 1s qubit, the before last qubit is the 2s qubit, etc.

Returns:
    A list of constants and qubit groups that the gate will act upon.

### `with_registers`

```python
def with_registers(self, *new_registers: int | Sequence[int]) -> Self
```

Returns the same fate targeting different registers.

Args:
    *new_registers: The new values that should be returned by the
        `registers` method.

Returns:
    An instance of the same kind of gate, but acting on different
    registers.

### `apply`

```python
def apply(self, *register_values: int) -> int | Iterable[int]
```

Returns the result of the gate operating on classical values.

For example, an addition takes two values (the target and the source),
adds the source into the target, then returns the target and source
as the new register values.

The `apply` method is permitted to be sloppy in three ways:

1. The `apply` method is permitted to return values that have more bits
    than the registers they will be stored into. The extra bits are
    simply dropped. For example, if the value 5 is returned for a 2
    qubit register then ``5 % 2**2 = 1`` will be used instead. Negative
    values are also permitted. For example, for a 3 qubit register the
    value -2 becomes ``-2 % 2**3 = 6``.
2. When the value of the last `k` registers is not changed by the
    gate, the `apply` method is permitted to omit these values
    from the result. That is to say, when the length of the output is
    less than the length of the input, it is padded up to the intended
    length by copying from the same position in the input.
3. When only the first register's value changes, the `apply` method is
    permitted to return an `int` instead of a sequence of ints.

The `apply` method *must* be reversible. Otherwise the gate will
not be unitary, and incorrect behavior will result.

Examples:

    A fully detailed adder:

    ```
    def apply(self, target, offset):
        return (target + offset) % 2**len(self.target_register), offset
    ```

    The same adder, with less boilerplate due to the details being
    handled by the `ArithmeticGate` class:

    ```
    def apply(self, target, offset):
        return target + offset
    ```
