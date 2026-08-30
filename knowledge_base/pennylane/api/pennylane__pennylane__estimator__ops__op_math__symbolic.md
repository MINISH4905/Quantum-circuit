---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/ops/op_math/symbolic.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/ops/op_math/symbolic.py
license: Apache-2.0
---

## Module `pennylane/estimator/ops/op_math/symbolic.py`

Resource operators for symbolic operations.

## `Adjoint`

```python
class Adjoint(ResourceOperator)
```

Resource class for the symbolic Adjoint operation.

Args:
    base_op (:class:`~.pennylane.estimator.ResourceOperator`): The operator for which
        to retrieve the adjoint.

Resources:
    This symbolic operation represents the adjoint of some base operation. If the base operation implements the
    :code:`.adjoint_resource_decomp()` method, then the resources are obtained from
    this object. Otherwise, the adjoint resources are given as the adjoint of each operation in the
    base operation's resources.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.ops.op_math.Adjoint`.

**Example**

The adjoint operation can be constructed like this:

    >>> qft = qp.estimator.QFT(num_wires=3)
    >>> adj_qft = qp.estimator.Adjoint(qft)

We can see how the resources differ by choosing a suitable gateset and estimating resources:

>>> import pennylane.estimator as qre
>>> gate_set = {
...     "SWAP",
...     "Adjoint(SWAP)",
...     "Hadamard",
...     "Adjoint(Hadamard)",
...     "ControlledPhaseShift",
...     "Adjoint(ControlledPhaseShift)",
... }
>>>
>>> print(qre.estimate(qft, gate_set))
--- Resources: ---
 Total wires: 3
    algorithmic wires: 3
    allocated wires: 0
             zero state: 0
             any state: 0
 Total gates : 7
  'SWAP': 1,
  'ControlledPhaseShift': 3,
  'Hadamard': 3
>>>
>>> print(qre.estimate(adj_qft, gate_set))
--- Resources: ---
 Total wires: 3
    algorithmic wires: 3
    allocated wires: 0
             zero state: 0
             any state: 0
 Total gates : 7
  'Adjoint(ControlledPhaseShift)': 3,
  'Adjoint(SWAP)': 1,
  'Adjoint(Hadamard)': 3

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
     * base_cmpr_op (:class:`~.pennylane.estimator.ResourceOperator`): The operator
       that we want the adjoint of.

### `resource_rep`

```python
def resource_rep(cls, base_cmpr_op: CompressedResourceOp) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    base_cmpr_op (:class:`~.pennylane.estimator.ResourceOperator`): The operator
        that we want the adjoint of.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, base_cmpr_op: CompressedResourceOp, **kwargs)
```

Returns a list representing the resources of the operator. Each object represents a
quantum gate and the number of times it occurs in the decomposition.

Args:
    base_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A
        compressed resource representation for the operator we want the adjoint of.

Resources:
    This symbolic operation represents the adjoint of some base operation. The resources are
    determined as follows. If the base operation implements the
    :code:`.adjoint_resource_decomp()` method, then the resources are obtained from
    this method. Otherwise, the adjoint resources are given as the adjoint of each operation in the
    base operation's resources.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `adjoint_resource_decomp`

```python
def adjoint_resource_decomp(cls, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for the adjoint of the operator.

Args:
    target_resource_params (dict): A dictionary containing the resource parameters of the
        target operator.

Resources:
    The adjoint of an adjointed operation is just the original operation. The resources
    are given as one instance of the base operation.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `tracking_name`

```python
def tracking_name(base_cmpr_op: CompressedResourceOp) -> str
```

Returns the tracking name built with the operator's parameters.

## `Controlled`

```python
class Controlled(ResourceOperator)
```

Resource class for the symbolic Controlled operation.

Args:
    base_op (:class:`~.pennylane.estimator.resource_operator.ResourceOperator`): The base operator to be
        controlled.
    num_ctrl_wires (int): the number of qubits the operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are controlled when in the
        :math:`|0\rangle` state

Resources:
    The resources are determined as follows. If the base operator implements the
    :code:`.controlled_resource_decomp()` method, then the resources are obtained directly from
    this object. Otherwise, the controlled resources are given in two steps. Firstly, any control qubits
    which should be triggered when in the :math:`|0\rangle` state, are flipped. This corresponds
    to an additional cost of two ``X`` gates per :code:`num_zero_ctrl`.
    Secondly, the base operation resources are extracted and we add to the cost the controlled
    variant of each operation in the resources.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.ops.op_math.Controlled`.

**Example**

The controlled operation can be constructed like this:

>>> import pennylane.estimator as qre
>>> x = qre.X()
>>> cx = qre.Controlled(x, num_ctrl_wires=1, num_zero_ctrl=0)
>>> ccx = qre.Controlled(x, num_ctrl_wires=2, num_zero_ctrl=2)

We can observe the expected gates when we estimate the resources.

>>> print(qre.estimate(cx))
--- Resources: ---
 Total wires: 2
    algorithmic wires: 2
    allocated wires: 0
             zero state: 0
             any state: 0
 Total gates : 1
  'CNOT': 1
>>>
>>> print(qre.estimate(ccx))
--- Resources: ---
 Total wires: 3
    algorithmic wires: 3
    allocated wires: 0
             zero state: 0
             any state: 0
 Total gates : 5
  'Toffoli': 1,
  'X': 4

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
     * base_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): The base
       operator to be controlled.
     * num_ctrl_wires (int): the number of qubits the operation is controlled on
     * num_zero_ctrl (int): the number of control qubits, that are controlled when in the
       :math:`|0\rangle` state

### `resource_rep`

```python
def resource_rep(cls, base_cmpr_op: CompressedResourceOp, num_ctrl_wires: int, num_zero_ctrl: int) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    base_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): The base
        operator to be controlled.
    num_ctrl_wires (int): the number of qubits the operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are controlled when in the
        :math:`|0\rangle` state

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, base_cmpr_op: CompressedResourceOp, num_ctrl_wires: int, num_zero_ctrl: int, **kwargs) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a
quantum gate and the number of times it occurs in the decomposition.

Args:
    base_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): The base
        operator to be controlled.
    num_ctrl_wires (int): the number of qubits the operation is controlled on
    num_zero_ctrl (int): the number of control qubits that are controlled when in the
        :math:`|0\rangle` state

Resources:
    The resources are determined as follows. If the base operator implements the
    :code:`.controlled_resource_decomp()` method, then the resources are obtained directly from
    this method. Otherwise, the controlled resources are given in two steps. Firstly, any control qubits
    which should be triggered when in the :math:`|0\rangle` state, are flipped. This corresponds
    to an additional cost of two ``X`` gates per :code:`num_zero_ctrl`.
    Secondly, the base operation resources are extracted and we add to the cost the controlled
    variant of each operation in the resources.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `controlled_resource_decomp`

```python
def controlled_resource_decomp(cls, num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for a controlled version of the operator.

Args:
    num_ctrl_wires (int): The number of control qubits to further control the base
        controlled operation upon.
    num_zero_ctrl (int): The subset of those control qubits which further control
        the base controlled operation, which are controlled when in the :math:`|0\rangle` state.
    target_resource_params (dict): A dictionary containing the resource parameters of the
        target operator.

Resources:
    The resources are derived by simply combining the control qubits, control-values and
    work qubits into a single instance of ``Controlled`` gate, controlled
    on the whole set of control-qubits.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `tracking_name`

```python
def tracking_name(base_cmpr_op: CompressedResourceOp, num_ctrl_wires: int, num_zero_ctrl: int)
```

Returns the tracking name built with the operator's parameters.

## `Pow`

```python
class Pow(ResourceOperator)
```

Resource class for the symbolic Pow operation.

This symbolic class can be used to represent some base operation raised to a power.

Args:
    base_op (:class:`~.pennylane.estimator.resource_operator.ResourceOperator`): The operator to exponentiate.
    pow_z (int): the exponent (default value is 1)

Resources:
    The resources are determined as follows. If the power :math:`z = 0`, this corresponds to the identity
    gate which requires no resources. If the base operation class :code:`base_class` implements the
    :code:`.pow_resource_decomp()` method, then the resources are obtained from this. Otherwise,
    the resources of the operation raised to the power :math:`z` are given by extracting the base
    operation's resources (via :class:`~.pennylane.estimator.resources_base.Resources`) and raising each operation to the same power.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.ops.op_math.Pow`.

**Example**

The operation raised to a power :math:`z` can be constructed like this:

>>> import pennylane.estimator as qre
>>> z = qre.Z()
>>> z_2 = qre.Pow(z, 2)
>>> z_5 = qre.Pow(z, 5)

We obtain the expected resources.

>>> print(qre.estimate(z_2, gate_set={"Identity", "Z"}))
--- Resources: ---
 Total wires: 1
    algorithmic wires: 1
    allocated wires: 0
             zero state: 0
             any state: 0
 Total gates : 1
  'Identity': 1
>>>
>>> print(qre.estimate(z_5, gate_set={"Identity", "Z"}))
--- Resources: ---
 Total wires: 1
    algorithmic wires: 1
    allocated wires: 0
             zero state: 0
             any state: 0
 Total gates : 1
  'Z': 1

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * base_class (Type[:class:`~.pennylane.estimator.resource_operator.ResourceOperator`]): The class type of the base operator to be raised to some power.
        * base_params (dict): the resource parameters required to extract the cost of the base operator
        * z (int): the power that the operator is being raised to

### `resource_rep`

```python
def resource_rep(cls, base_cmpr_op: CompressedResourceOp, pow_z: int) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the operator that are needed to compute a resource estimation.

Args:
    base_class (Type[:class:`~.pennylane.estimator.resource_operator.ResourceOperator`]): The class type of the base operator to be raised to some power.
    base_params (dict): the resource parameters required to extract the cost of the base operator
    pow_z (int): the power that the operator is being raised to

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, base_cmpr_op: CompressedResourceOp, pow_z: int, **kwargs) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a
quantum gate and the number of times it occurs in the decomposition.

Args:
    base_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A
        compressed resource representation for the operator we want to exponentiate.
    pow_z (float): the exponent (default value is 1)

Resources:
    The resources are determined as follows. If the power :math:`z = 0`, this corresponds to the identity
    gate which requires no resources. If the base operation class :code:`base_class` implements the
    :code:`.pow_resource_decomp()` method, then the resources are obtained from this. Otherwise,
    the resources of the operation raised to the power :math:`z` are given by extracting the base
    operation's resources (via :class:`~.pennylane.estimator.resources_base.Resources`) and
    raising each operation to the same power.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `pow_resource_decomp`

```python
def pow_resource_decomp(cls, pow_z: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a
quantum gate and the number of times it occurs in the decomposition.

Args:
    pow_z (int): The exponent that the base operator is being raised to. Default value is 1.
    target_resource_params (dict): A dictionary containing the resource parameters of the target operator.

Resources:
    The resources are derived by simply adding together the :math:`z` exponent and the
    :math:`z_{0}` exponent into a single instance of :class:`~.Pow` gate, raising
    the base operator to the power :math:`z + z_{0}`.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `tracking_name`

```python
def tracking_name(base_cmpr_op: CompressedResourceOp, pow_z: int) -> str
```

Returns the tracking name built with the operator's parameters.

## `Prod`

```python
class Prod(ResourceOperator)
```

Resource class for the symbolic Prod operation.

This symbolic class can be used to represent a product of some base operations.

Args:
    res_ops (tuple[:class:`~.pennylane.estimator.resource_operator.ResourceOperator`]): A tuple of
        resource operators or a nested tuple of resource operators and counts.
    wires (Sequence[int], optional): the wires the operation acts on

Resources:
    This symbolic class represents a product of operations. The resources are defined trivially
    as the counts for each operation in the product.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.ops.op_math.Prod`.

**Example**

The product of operations can be constructed from a list of operations or
a nested tuple where each operator is accompanied by its count.
Each operation in the product must be a valid :class:`~.estimator.ResourceOperator`.

We can construct a product operator as follows:

>>> import pennylane.estimator as qre
>>> factors = [qre.X(), qre.Y(), qre.Z()]
>>> prod_xyz = qre.Prod(factors)
>>>
>>> print(qre.estimate(prod_xyz))
--- Resources: ---
 Total wires: 1
    algorithmic wires: 1
    allocated wires: 0
             zero state: 0
             any state: 0
 Total gates : 3
  'X': 1,
  'Y': 1,
  'Z': 1

We can also specify the factors as a tuple with

>>> factors = [(qre.X(), 2), (qre.Z(), 3)]
>>> prod_x2z3 = qre.Prod(factors)
>>>
>>> print(qre.estimate(prod_x2z3))
--- Resources: ---
 Total wires: 1
    algorithmic wires: 1
    allocated wires: 0
             zero state: 0
             any state: 0
 Total gates : 5
  'X': 2,
  'Z': 3

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_wires (int): the number of wires the operator acts upon
        * cmpr_factors_and_counts (Tuple[Tuple[:class:`~.estimator.CompressedResourceOp`, int]]):
          A sequence of tuples containing the operations, in the compressed representation, and
          a count for how many times they are repeated corresponding to the factors in the product.

### `resource_rep`

```python
def resource_rep(cls, cmpr_factors_and_counts, num_wires: WiresLike=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the operator that are needed to compute a resource estimation.

Args:
    cmpr_factors_and_counts (Tuple[Tuple[:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`, int]]):
        A sequence of tuples containing the operations, in the compressed representation, and
        a count for how many times they are repeated corresponding to the factors in the product.
    num_wires (int): an optional integer representing the number of wires this operator acts upon

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, cmpr_factors_and_counts, num_wires: int)
```

Returns a list representing the resources of the operator. Each object represents a
quantum gate and the number of times it occurs in the decomposition.

Args:
    cmpr_factors_and_counts (Tuple[Tuple[:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`, int]]):
        A sequence of tuples containing the operations, in the compressed representation, and
        a count for how many times they are repeated corresponding to the factors in the product.
    num_wires (int): the number of wires this operator acts upon

Resources:
    This symbolic class represents a product of operations. The resources are defined
    trivially as the counts for each operation in the product.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `ChangeOpBasis`

```python
class ChangeOpBasis(ResourceOperator)
```

Change of Basis resource operator.

This symbolic class can be used to represent a change of basis operation with a compute-uncompute pattern.
This is a special type of operator which can be expressed as
:math:`\hat{U}_{compute} \cdot \hat{V} \cdot \hat{U}_{uncompute}`. If no :code:`uncompute_op` is
provided then the adjoint of the :code:`compute_op` is used by default.

Args:
    compute_op (:class:`~.pennylane.estimator.resource_operator.ResourceOperator`): A resource operator
        representing the basis change operation.
    target_op (:class:`~.pennylane.estimator.resource_operator.ResourceOperator`): A resource operator
        representing the base operation.
    uncompute_op (:class:`~.pennylane.estimator.resource_operator.ResourceOperator` | None): An optional
        resource operator representing the inverse of the basis change operation. If no
        :code:`uncompute_op` is provided then the adjoint of the :code:`compute_op` is used by default.
    wires (Sequence[int] | None): the wires the operation acts on

Resources:
    This symbolic class represents a product of the three provided operations. The resources are
    defined trivially as the sum of the costs of each.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.ops.op_math.ChangeOpBasis`.

**Example**

The change of basis operation can be constructed as follows with each operation defining the
compute-uncompute pattern being a valid :class:`~.pennylane.estimator.resource_operator.ResourceOperator`:

>>> import pennylane.estimator as qre
>>> compute_u = qre.Hadamard()
>>> base_v = qre.Z()
>>> cb_op = qre.ChangeOpBasis(compute_u, base_v)
>>> print(qre.estimate(cb_op, gate_set={"Z", "Hadamard", "Adjoint(Hadamard)"}))
--- Resources: ---
 Total wires: 1
    algorithmic wires: 1
    allocated wires: 0
         zero state: 0
         any state: 0
 Total gates : 3
  'Adjoint(Hadamard)': 1,
  'Z': 1,
  'Hadamard': 1

We can also set the :code:`uncompute_op` directly.

>>> uncompute_u = qre.Hadamard()
>>> cb_op = qre.ChangeOpBasis(compute_u, base_v, uncompute_u)
>>> print(qre.estimate(cb_op, gate_set={"Z", "Hadamard", "Adjoint(Hadamard)"}))
--- Resources: ---
 Total wires: 1
    algorithmic wires: 1
    allocated wires: 0
         zero state: 0
         any state: 0
 Total gates : 3
  'Z': 1,
  'Hadamard': 2

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * cmpr_compute_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed resource operator, corresponding
          to the compute operation.
        * cmpr_target_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed resource operator, corresponding
          to the base operation.
        * cmpr_uncompute_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed resource operator, corresponding
          to the uncompute operation.
        * num_wires (int): the number of wires this operator acts upon

### `resource_rep`

```python
def resource_rep(cls, cmpr_compute_op: CompressedResourceOp, cmpr_target_op: CompressedResourceOp, cmpr_uncompute_op: CompressedResourceOp | None=None, num_wires: int | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the operator that are needed to estimate the resources.

Args:
    cmpr_compute_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed resource operator, corresponding
        to the compute operation.
    cmpr_target_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed resource operator, corresponding
        to the base operation.
    cmpr_uncompute_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): An optional compressed resource operator, corresponding
        to the uncompute operation. The adjoint of the :code:`cmpr_compute_op` is used by default.
    num_wires (int): an optional integer representing the number of wires this operator acts upon

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, cmpr_compute_op: CompressedResourceOp, cmpr_target_op: CompressedResourceOp, cmpr_uncompute_op: CompressedResourceOp, num_wires: int)
```

Returns a list representing the resources of the operator. Each object represents a
quantum gate and the number of times it occurs in the decomposition.

Args:
    cmpr_compute_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed resource operator, corresponding
        to the compute operation.
    cmpr_target_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed resource operator, corresponding
        to the base operation.
    cmpr_uncompute_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): An optional compressed resource operator, corresponding
        to the uncompute operation. The adjoint of the :code:`cmpr_compute_op` is used by default.

Resources:
    This symbolic class represents a product of the three provided operations. The resources are
    defined trivially as the sum of the costs of each.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.ops.op_math.ChangeOpBasis`.

**Example**

The change of basis operation can be constructed as follows with each operation defining the
compute-uncompute pattern being a valid :class:`~.pennylane.estimator.resource_operator.ResourceOperator`:

>>> import pennylane.estimator as qre
>>> compute_u = qre.Hadamard()
>>> base_v = qre.Z()
>>> cb_op = qre.ChangeOpBasis(compute_u, base_v)
>>> print(qre.estimate(cb_op, gate_set={"Z", "Hadamard", "Adjoint(Hadamard)"}))
--- Resources: ---
 Total wires: 1
    algorithmic wires: 1
    allocated wires: 0
             zero state: 0
             any state: 0
 Total gates : 3
  'Adjoint(Hadamard)': 1,
  'Z': 1,
  'Hadamard': 1

We can also set the :code:`uncompute_op` directly.

>>> uncompute_u = qre.Hadamard()
>>> cb_op = qre.ChangeOpBasis(compute_u, base_v, uncompute_u)
>>> print(qre.estimate(cb_op, gate_set={"Z", "Hadamard", "Adjoint(Hadamard)"}))
--- Resources: ---
 Total wires: 1
    algorithmic wires: 1
    allocated wires: 0
         zero state: 0
         any state: 0
 Total gates : 3
  'Z': 1,
  'Hadamard': 2

### `controlled_resource_decomp`

```python
def controlled_resource_decomp(cls, num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for a controlled version of the operator.

Args:
    num_ctrl_wires (int): the number of qubits the operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are controlled when in the :math:`|0\rangle` state
    target_resource_params (dict): A dictionary containing the resource parameters of the
        target operator.

Resources:
    The resources are derived from the identity :math:`C(U V U^\dagger) = U C(V) U^\dagger`.
    Since the compute and uncompute operators cancel each other out when the control is off,
    only the target operation :math:`V` needs to be controllled. The compute and uncompute operations
    remain uncontrolled.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `apply_adj`

```python
def apply_adj(action: GateCount | Allocate | Deallocate) -> GateCount | Allocate | Deallocate
```

Create the adjoint of a resource-tracking gate.

For a :class:`~.GateCount`, it wraps
the gate in :class:`~.Adjoint`. For :class:`~.Allocate` and
:class:`~.Deallocate`, it converts one to the other.

Args:
    action (GateCount or Allocate or Deallocate): The gate to be adjointed.

Returns:
    GateCount or Allocate or Deallocate.

Raises:
    TypeError: if the gate is of an unsupported type.

## `apply_controlled`

```python
def apply_controlled(action: GateCount | Allocate | Deallocate, num_ctrl_wires: int, num_zero_ctrl: int) -> GateCount | Allocate | Deallocate
```

Create the controlled version of a resource-tracking gate.

For a :class:`~.GateCount`, it wraps
the gate in :class:`~.Controlled`. Other actions like :class:`~.Allocate`
and :class:`~.Deallocate` are returned unchanged.

Args:
    action (GateCount or Allocate or Deallocate): The gate to be controlled.
    num_ctrl_wires (int): The number of qubits to control the operation on.
    num_zero_ctrl (int): The number of control qubits that are controlled on the
        :math:`|0\rangle` state.

Returns:
    GateCount or Allocate or Deallocate.
