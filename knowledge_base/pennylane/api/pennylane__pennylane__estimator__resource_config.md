---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/resource_config.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/resource_config.py
license: Apache-2.0
---

## Module `pennylane/estimator/resource_config.py`

This module contains the ResourceConfig class, which tracks the configuration for resource estimation

## `DecompositionType`

```python
class DecompositionType(StrEnum)
```

Specifies the type of decomposition to override.

## `ResourceConfig`

```python
class ResourceConfig
```

Sets the values of precisions and custom decompositions when estimating resources for a
quantum workflow.

The precisions and custom decompositions of resource operators can be
modified using the :meth:`~.pennylane.estimator.resource_config.ResourceConfig.set_precision`
and :meth:`~.pennylane.estimator.resource_config.ResourceConfig.set_decomp` functions of the
:code:`ResourceConfig` class.

**Example**

This example shows how to set a custom precision value for every instance of the :code:`RX` gate.

.. code-block:: pycon

    >>> import pennylane.estimator as qre
    >>> my_config = qre.ResourceConfig()
    >>> my_config.set_precision(qre.RX, precision=1e-5)
    >>> res = qre.estimate(
    ...     qre.RX(),
    ...     gate_set={"RZ", "T", "Hadamard"},
    ...     config=my_config,
    ... )
    >>> print(res)
    --- Resources: ---
     Total wires: 1
       algorithmic wires: 1
       allocated wires: 0
         zero state: 0
         any state: 0
     Total gates : 28
       'T': 28

The :code:`ResourceConfig` can also be used to set custom decompositions. The following example
shows how to define a custom decomposition for the ``RX`` gate.

.. code-block:: pycon

    >>> def custom_RX_decomp(precision):  # RX = H @ RZ @ H
    ...     h = qre.Hadamard.resource_rep()
    ...     rz = qre.RZ.resource_rep(precision)
    ...     return [qre.GateCount(h, 2), qre.GateCount(rz, 1)]
    >>>
    >>> my_config = qre.ResourceConfig()
    >>> my_config.set_decomp(qre.RX, custom_RX_decomp)
    >>> res = qre.estimate(
    ...     qre.RX(precision=None),
    ...     gate_set={"RZ", "T", "Hadamard"},
    ...     config=my_config,
    ... )
    >>> print(res)
    --- Resources: ---
     Total wires: 1
       algorithmic wires: 1
       allocated wires: 0
         zero state: 0
         any state: 0
     Total gates : 3
       'RZ': 1,
       'Hadamard': 2

### `custom_decomps`

```python
def custom_decomps(self) -> dict[type[ResourceOperator], Callable]
```

Returns the dictionary of custom base decompositions.

### `adj_custom_decomps`

```python
def adj_custom_decomps(self) -> dict[type[ResourceOperator], Callable]
```

Returns the dictionary of custom adjoint decompositions.

### `ctrl_custom_decomps`

```python
def ctrl_custom_decomps(self) -> dict[type[ResourceOperator], Callable]
```

Returns the dictionary of custom controlled decompositions.

### `pow_custom_decomps`

```python
def pow_custom_decomps(self) -> dict[type[ResourceOperator], Callable]
```

Returns the dictionary of custom power decompositions.

### `set_precision`

```python
def set_precision(self, op_type: type[ResourceOperator], precision: float | int, resource_key: str='precision') -> None
```

Sets the precision for a given resource operator.

Args:
    op_type (type[:class:`~.pennylane.estimator.resource_operator.ResourceOperator`]): the operator class for which
        to set the precision
    precision (float | int): The desired precision tolerance. Must be greater than 0.
    resource_key (str): the name of the specific precision parameter to be updated

Raises:
    ValueError: If ``op_type`` is not a configurable operator or if setting
        the precision for it is not supported, or if ``precision`` is negative.
    ValueError: If ``resource_key`` is not a supported parameter for the given ``op_type``.

**Example**

.. code-block:: python

    import pennylane.estimator as qre

    config = qre.ResourceConfig()

    # Check the default precision
    default = config.resource_op_precisions[qre.SelectPauliRot]['precision']
    print(f"Default precision for SelectPauliRot: {default}")

    # Set a new precision
    config.set_precision(qre.SelectPauliRot, precision=1e-5)
    new = config.resource_op_precisions[qre.SelectPauliRot]['precision']
    print(f"New precision for SelectPauliRot: {new}")

.. code-block:: pycon

    Default precision for SelectPauliRot: 1e-09
    New precision for SelectPauliRot: 1e-05

.. details::
    :title: Usage Details

    Some resource operators have multiple parameters which tune the precision
    of the operator's decomposition. For example, the
    :class:`~.estimator.templates.trotter.TrotterVibronic` operator has parameters
    ``phase_grad_precision`` and ``coeff_precision``. A dictionary of all such parameters
    of an operator can be accessed through ``ResourceConfig.resource_op_precisions``:

    >>> import pennylane.estimator as qre
    >>> my_config = qre.ResourceConfig()
    >>> my_config.resource_op_precisions[qre.TrotterVibronic]
    {'phase_grad_precision': 1e-06, 'coeff_precision': 0.001}

    We can modify the default value of the ``coeff_precision``:

    >>> my_config.set_precision(qre.TrotterVibronic, 1e-9, resource_key="coeff_precision")
    >>> my_config.resource_op_precisions[qre.TrotterVibronic]
    {'phase_grad_precision': 1e-06, 'coeff_precision': 1e-09}

### `set_single_qubit_rot_precision`

```python
def set_single_qubit_rot_precision(self, precision: float) -> None
```

Sets the synthesis precision for all single-qubit rotation gates.

This is a convenience method to update the synthesis precision tolerance
for all standard single-qubit rotation gates (and their
controlled versions) at once. The synthesis precision dictates the precision
for compiling rotation gates into a discrete gate set, which in turn
affects the number of gates required.

This method updates the ``precision`` value for the following operators:
:class:`~.pennylane.estimator.RX`, :class:`~.pennylane.estimator.RY`,
:class:`~.pennylane.estimator.RZ`, :class:`~.pennylane.estimator.CRX`,
:class:`~.pennylane.estimator.CRY`, :class:`~.pennylane.estimator.CRZ`.

Args:
    precision (float): The desired synthesis precision tolerance. A smaller
        value corresponds to a higher precision compilation, which may
        increase the required gate counts. Must be greater than ``0``.

Raises:
    ValueError: If ``precision`` is a negative value.

**Example**

.. code-block:: python

    import pennylane.estimator as qre

    config = qre.ResourceConfig()
    rot_ops = [qre.RX, qre.RY, qre.RZ, qre.CRX, qre.CRY, qre.CRZ]
    print([config.resource_op_precisions[op]['precision'] for op in rot_ops])

    config.set_single_qubit_rot_precision(1e-5)
    print([config.resource_op_precisions[op]['precision'] for op in rot_ops])

.. code-block:: pycon

    [1e-09, 1e-09, 1e-09, 1e-09, 1e-09, 1e-09]
    [1e-05, 1e-05, 1e-05, 1e-05, 1e-05, 1e-05]

### `set_decomp`

```python
def set_decomp(self, op_type: type[ResourceOperator], decomp_func: Callable, decomp_type: DecompositionType | None=DecompositionType.BASE) -> None
```

Sets a custom function to override the default resource decomposition.

Args:
    op_type (type[:class:`~.pennylane.estimator.resource_operator.ResourceOperator`]): the operator class whose decomposition is being overriden.
    decomp_func (Callable): the new resource decomposition function to be set as default.
    decomp_type (None | DecompositionType): the decomposition type to override. Options are
        ``"adj"``, ``"pow"``, ``"ctrl"``, and ``"base"``. Default is ``"base"``.

Raises:
    ValueError: If ``decomp_type`` is not a valid decomposition type.

.. note::

    The new decomposition function ``decomp_func`` should have the same signature as the one it replaces.
    Specifically, the signature should match the :code:`resource_keys` of the base resource
    operator class being overriden.

**Example**

.. code-block:: python

    import pennylane.estimator as qre

    def custom_res_decomp(**kwargs):
        h = qre.resource_rep(qre.Hadamard)
        s = qre.resource_rep(qre.S)
        return [qre.GateCount(h, 1), qre.GateCount(s, 2)]

.. code-block:: pycon

    >>> print(qre.estimate(qre.X(), gate_set={"Hadamard", "Z", "S"}))
    --- Resources: ---
     Total wires: 1
        algorithmic wires: 1
        allocated wires: 0
         zero state: 0
         any state: 0
     Total gates : 4
      'S': 2,
      'Hadamard': 2
    >>> config = qre.ResourceConfig()
    >>> config.set_decomp(qre.X, custom_res_decomp)
    >>> print(qre.estimate(qre.X(), gate_set={"Hadamard", "Z", "S"}, config=config))
    --- Resources: ---
     Total wires: 1
        algorithmic wires: 1
        allocated wires: 0
         zero state: 0
         any state: 0
     Total gates : 3
      'S': 2,
      'Hadamard': 1
