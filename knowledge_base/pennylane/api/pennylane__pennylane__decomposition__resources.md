---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/decomposition/resources.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/decomposition/resources.py
license: Apache-2.0
---

## Module `pennylane/decomposition/resources.py`

Defines the data structure that stores resource estimates for each decomposition.

## `Resources`

```python
class Resources
```

Stores resource estimates.

Args:
    gate_counts (dict): dictionary mapping operator types to their number of occurrences.
    weighted_cost (float): the cumulative weight of the gates.

### `__post_init__`

```python
def __post_init__(self)
```

Verify that all gate counts are non-zero.

### `num_gates`

```python
def num_gates(self) -> int
```

The total number of gates.

## `CompressedResourceOp`

```python
class CompressedResourceOp
```

A lightweight representation of an operator to be decomposed.

.. note::

    This class is only relevant when the new experimental graph-based decomposition system
    (introduced in v0.41) is enabled via ``qp.decomposition.enable_graph()``. This new way of
    doing decompositions is generally more resource efficient and accommodates multiple alternative
    decomposition rules for an operator. In this new system, custom decomposition rules are
    defined as quantum functions, and it is currently required that every decomposition rule
    declares its required resources using :func:`~pennylane.register_resources`.

The ``CompressedResourceOp`` is a lightweight data structure that contains an operator type
and a set of parameters that affects the resource requirement of this operator. If the
decomposition of an operator is independent of its parameters, e.g., ``Rot`` can be decomposed
into two ``RZ`` gates and an ``RY`` regardless of the angles, then every occurrence of this
operator in the circuit is represented by the same ``CompressedResourceOp`` which only
specifies the operator type, i.e., ``Rot``.

On the other hand, for some operators such as ``MultiRZ``, for which the number of ``CNOT``
gates in its decomposition depends on the number of wires, the resource representation of
a ``MultiRZ`` must include this information. To create a ``CompressedResourceOp`` object for
an operator, use the :func:`~pennylane.resource_rep` function.

Args:
    op_type: the operator type
    params (dict): the parameters of the operator relevant to the resource estimation of
        its decompositions. This should only include parameters that affect the gate counts.

.. seealso:: :func:`~pennylane.resource_rep`

### `name`

```python
def name(self) -> str
```

The name of the operator type.

## `resource_rep`

```python
def resource_rep(op_type: type[Operator], **params) -> CompressedResourceOp
```

Binds an operator type with additional resource parameters.

.. note::

    This function is only relevant when the new experimental graph-based decomposition system
    (introduced in v0.41) is enabled via ``qp.decomposition.enable_graph()``. This new way of
    doing decompositions is generally more resource efficient and accommodates multiple alternative
    decomposition rules for an operator. In this new system, custom decomposition rules are
    defined as quantum functions, and it is currently required that every decomposition rule
    declares its required resources using :func:`~pennylane.register_resources`.

Args:
    op_type: the operator class to create a resource representation for.
    **params: parameters relevant to the resource estimate of the operator's decompositions.
        This should be consistent with ``op_type.resource_keys``.

Returns:
    pennylane.decomposition.resources.CompressedResourceOp: a lightweight representation of the operator.

**Example**

The resource parameters of an operator are a minimal set of information required to determine
the resource estimate of its decompositions. To check the required set of keyword arguments
for an operator type, refer to the ``resource_keys`` attribute of the operator class:

>>> qp.MultiRZ.resource_keys
{'num_wires'}

When calling ``resource_rep`` for ``MultiRZ``, ``num_wires`` must be provided as a keyword argument.

>>> rep = resource_rep(qp.MultiRZ, num_wires=3)
>>> rep
MultiRZ(num_wires=3)
>>> type(rep)
<class 'pennylane.decomposition.resources.CompressedResourceOp'>

.. seealso:: See how this function is used in the context of defining a decomposition rule using :func:`~pennylane.register_resources`

.. details::
    :title: Usage Details

    The same approach applies also to symbolic operators. For example, if the decomposition
    of an operator contains a controlled operation:

    .. code-block:: python

        def my_decomp(wires):
            qp.ctrl(
                qp.MultiRZ(wires=wires[:3]),
                control=wires[3:5],
                control_values=[0, 1],
                work_wires=wires[5]
            )

    To declare this controlled operator in the resource function, we find the resource keys
    of ``qp.ops.Controlled``:

    >>> print(sorted(qp.ops.Controlled.resource_keys))
    ['base_class', 'base_params', 'num_control_wires', 'num_work_wires', 'num_zero_control_values', 'work_wire_type']

    Then the resource representation can be created as follows:

    >>> qp.resource_rep(
    ...     qp.ops.Controlled,
    ...     base_class=qp.ops.MultiRZ,
    ...     base_params={'num_wires': 3},
    ...     num_control_wires=2,
    ...     num_zero_control_values=1,
    ...     num_work_wires=1,
    ...     work_wire_type='borrowed'
    ... )
    Controlled(MultiRZ(num_wires=3), num_control_wires=2, num_work_wires=1, num_zero_control_values=1, work_wire_type=borrowed)

    Alternatively, use the utility function :func:`~pennylane.decomposition.controlled_resource_rep`:

    >>> qp.decomposition.controlled_resource_rep(
    ...     base_class=qp.ops.MultiRZ,
    ...     base_params={'num_wires': 3},
    ...     num_control_wires=2,
    ...     num_zero_control_values=1,
    ...     num_work_wires=1
    ... )
    Controlled(MultiRZ(num_wires=3), num_control_wires=2, num_work_wires=1, num_zero_control_values=1, work_wire_type=borrowed)

    .. seealso:: :func:`~pennylane.decomposition.controlled_resource_rep`, :func:`~pennylane.decomposition.adjoint_resource_rep`, :func:`~pennylane.decomposition.pow_resource_rep`

## `controlled_resource_rep`

```python
def controlled_resource_rep(base_class: type[Operator], base_params: dict, num_control_wires: int, num_zero_control_values: int=0, num_work_wires: int=0, work_wire_type='borrowed')
```

Creates a ``CompressedResourceOp`` representation of a controlled operator.

This function mirrors the custom logic in ``qp.ctrl`` which does the following:

- Flattens nested controlled operations.
- Dispatches to custom-controlled operations when applicable.

Args:
    base_class: the base operator type
    base_params (dict): the resource params of the base operator
    num_control_wires (int): the number of control wires
    num_zero_control_values (int): the number of control values that are 0
    num_work_wires (int): the number of work wires
    work_wire_type (str): the type of work wire

## `adjoint_resource_rep`

```python
def adjoint_resource_rep(base_class: type[Operator], base_params: dict=None)
```

Creates a ``CompressedResourceOp`` representation of the adjoint of an operator.

Args:
    base_class: the base operator type
    base_params (dict): the resource params of the base operator

## `change_op_basis_resource_rep`

```python
def change_op_basis_resource_rep(compute_op: type[Operator] | CompressedResourceOp, target_op: type[Operator] | CompressedResourceOp, uncompute_op: type[Operator] | CompressedResourceOp | None=None)
```

Creates a ``CompressedResourceOp`` representation of the compute-uncompute pattern
:class:`~.ChangeOpBasis` of operators.

Args:
    compute_op: the compressed resource representation of the compute operator
    target_op: the compressed resource representation of target operator
    uncompute_op: the compressed resource representation of the uncompute operator

## `pow_resource_rep`

```python
def pow_resource_rep(base_class, base_params, z)
```

Creates a ``CompressedResourceOp`` representation of the power of an operator.

Args:
    base_class: the base operator type
    base_params (dict): the resource params of the base operator
    z (int or float): the power

## `custom_ctrl_op_to_base`

```python
def custom_ctrl_op_to_base()
```

The set of custom controlled operations.

## `resolve_work_wire_type`

```python
def resolve_work_wire_type(base_work_wires, base_work_wire_type, work_wires, work_wire_type)
```

Resolves the overall work wire type when the base op comes with work wires.

## `auto_wrap`

```python
def auto_wrap(op_type)
```

Conveniently wrap an operator type in a resource representation.
