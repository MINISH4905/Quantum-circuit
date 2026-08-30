---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/capture/autograph/ag_primitives.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/capture/autograph/ag_primitives.py
license: Apache-2.0
---

## Module `pennylane/capture/autograph/ag_primitives.py`

This module provides the implementation of AutoGraph primitives in terms of traceable PennyLane
functions. The purpose is to convert imperative style code to functional or graph-style code.

## `set_item`

```python
def set_item(target: Union['DynamicJaxprTracer', list], index: Union[int, 'DynamicJaxprTracer'], x: Union[Number, 'DynamicJaxprTracer'])
```

An implementation of the AutoGraph 'set_item' function.

## `update_item_with_op`

```python
def update_item_with_op(target: Union['DynamicJaxprTracer', list], index: Union[int, 'DynamicJaxprTracer'], x: Union[Number, 'DynamicJaxprTracer'], op: str)
```

An implementation of the AutoGraph 'update_item_with_op' function.

## `if_stmt`

```python
def if_stmt(pred: bool, true_fn: Callable[[], Any], false_fn: Callable[[], Any], get_state: Callable[[], tuple], set_state: Callable[[tuple], None], symbol_names: tuple[str], _num_results: int)
```

An implementation of the AutoGraph 'if' statement. The interface is defined by AutoGraph,
here we merely provide an implementation of it in terms of PennyLane primitives.

## `for_stmt`

```python
def for_stmt(iteration_target: Any, _extra_test: Callable[[], bool] | None, body_fn: Callable[[int], None], get_state: Callable[[], tuple], set_state: Callable[[tuple], None], symbol_names: tuple[str], _opts: dict)
```

An implementation of the AutoGraph 'for .. in ..' statement. The interface is defined by
AutoGraph, here we merely provide an implementation of it in terms of PennyLane primitives.

## `while_stmt`

```python
def while_stmt(loop_test, loop_body, get_state, set_state, symbol_names, _opts)
```

An implementation of the AutoGraph 'while ..' statement. The interface is defined by
AutoGraph, here we merely provide an implementation of it in terms of PennyLane primitives.

## `and_`

```python
def and_(a, b)
```

A wrapper for the AutoGraph 'and' operator. It returns the result of the logical 'and'
operation between two values, `a` and `b`. If either value is undefined, it raises an error.

## `or_`

```python
def or_(a, b)
```

A wrapper for the AutoGraph 'or' operator. It returns the result of the logical 'or'
operation between two values, `a` and `b`. If either value is undefined, it raises an error.

## `not_`

```python
def not_(a)
```

A wrapper for the AutoGraph 'not' operator. It returns the result of the logical 'not'
operation on a value `a`. If `a` is undefined, it raises an error.

## `Patcher`

```python
class Patcher
```

Patcher, a class to replace object attributes.

Args:
    patch_data: List of triples. The first element in the triple corresponds to the object
    whose attribute is to be replaced. The second element is the attribute name. The third
    element is the new value assigned to the attribute.

## `converted_call`

```python
def converted_call(fn, args, kwargs, caller_fn_scope=None, options=None)
```

A wrapper for the autograph ``converted_call`` function, imported here as
``ag_converted_call``. It returns the result of executing a possibly-converted
 function ``fn`` with the specified ``args`` and ``kwargs``.

 We want AutoGraph to use its standard behaviour with a few exceptions:

   1. We want to use our own instance of the AST transformer when
       recursively transforming functions
   2. We want to ignore certain PennyLane modules and functions when
       converting (i.e. don't let autograph convert them)
   3. We want to handle QNodes, while AutoGraph generally only works on
       functions, and to handle PennyLane wrapper functions like ctrl
       and adjoint

## `PRange`

```python
class PRange
```

PennyLane range object. This class re-implements the built-in range class
(which can't be inherited from). The only change is saving and accessing the
inputs directly, to circumvent some JAX-unfriendly code in the Python range.

### `get_raw_range`

```python
def get_raw_range(self)
```

Get the raw values defining this range: start, stop, step.

### `py_range`

```python
def py_range(self)
```

Access the underlying Python range object. If it doesn't exist, create one.

## `PEnumerate`

```python
class PEnumerate(enumerate)
```

PennyLane enumeration object. Inherits from Python ``enumerate``, but adds storing the
input iteration_target and start_idx, which are used by the for-loop conversion.
