---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/resource_operator.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/resource_operator.py
license: Apache-2.0
---

## Module `pennylane/estimator/resource_operator.py`

This submodule contains base classes for resource operators.

## `CompressedResourceOp`

```python
class CompressedResourceOp
```

This class is a minimal representation of a :class:`~.pennylane.estimator.ResourceOperator`,
containing only the operator type and the necessary parameters to estimate its resources.

The ``CompressedResourceOp`` object is returned by the ``.resource_rep()`` method of resource
operators. The object is used by resource operators to efficiently compute the resource counts.

.. code-block:: pycon

    >>> import pennylane.estimator as qre
    >>> cmpr_op = qre.PauliRot.resource_rep(pauli_string="XYZ")
    >>> print(cmpr_op)
    CompressedResourceOp(PauliRot, num_wires=3, params={'pauli_string':'XYZ', 'precision':None})

Args:
    op_type (type[ResourceOperator]): the class object of an operation which inherits from :class:`~.pennylane.estimator.ResourceOperator`
    num_wires (int): The number of wires that the operation acts upon,
        excluding any auxiliary wires that are allocated on decomposition.
    params (dict): A dictionary containing the minimal pairs of parameter names and values
        required to compute the resources for the given operator.
    name (str | None): A custom name for the compressed operator. If not
        provided, a name will be generated using ``op_type.make_tracking_name``
        with the given parameters.

### `name`

```python
def name(self) -> str
```

Returns the name of operator.

## `ResourceOperator`

```python
class ResourceOperator(ABC)
```

Base class to represent quantum operators according to the fundamental set of information
required for resource estimation.

A :class:`~.pennylane.estimator.ResourceOperator` is uniquely defined by its
name (the class type) and its resource parameters (:code:`op.resource_params`).

.. details::
    :title: Usage Details

    This example shows how to create a custom :class:`~.pennylane.estimator.ResourceOperator`
    class for resource estimation. We use :class:`~.pennylane.QFT` as a well-known gate for
    simplicity.

    .. code-block:: python

        import pennylane.estimator as qre

        class QFT(qre.ResourceOperator):

            resource_keys = {"num_wires"}  # the only parameter that its resources depend upon.

            def __init__(self, num_wires, wires=None):  # wire labels are optional
                self.num_wires = num_wires
                super().__init__(wires=wires)

            @property
            def resource_params(self) -> dict:        # The keys must match the `resource_keys`
                return {"num_wires": self.num_wires}  # and values obtained from the operator.

            @classmethod
            def resource_rep(cls, num_wires):   # Takes the same input as `resource_keys` and
                params = {"num_wires": num_wires}  #  produces a compressed representation
                return qre.CompressedResourceOp(cls, num_wires, params)

            @classmethod
            def resource_decomp(cls, num_wires):  # `resource_keys` are input

                # Get compressed reps for each gate in the decomposition:

                swap = qre.resource_rep(qre.SWAP)
                hadamard = qre.resource_rep(qre.Hadamard)
                ctrl_phase_shift = qre.resource_rep(qre.ControlledPhaseShift)

                # Figure out the associated counts for each type of gate:

                swap_counts = num_wires // 2
                hadamard_counts = num_wires
                ctrl_phase_shift_counts = num_wires*(num_wires - 1) // 2

                return [    # Return the decomposition
                    qre.GateCount(swap, swap_counts),
                    qre.GateCount(hadamard, hadamard_counts),
                    qre.GateCount(ctrl_phase_shift, ctrl_phase_shift_counts),
                ]

    Which can be instantiated as a normal operation, but now contains the resources:

    .. code-block:: pycon

        >>> op = QFT(num_wires=3)
        >>> print(qre.estimate(op, gate_set={'Hadamard', 'SWAP', 'ControlledPhaseShift'}))
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

### `__eq__`

```python
def __eq__(self, other)
```

Return True if the operators are equal.

### `queue`

```python
def queue(self, context: QueuingManager=QueuingManager) -> ResourceOperator
```

Append the operator to the Operator queue.

### `resource_keys`

```python
def resource_keys(cls) -> set
```

The set of parameters that affects the resource requirement of the operator.

All resource decomposition functions for this operator class are expected to accept the
keyword arguments that match these keys exactly. The :func:`~pennylane.estimator.resource_rep`
function will also expect keyword arguments that match these keys when called with this
operator type.

The default implementation is an empty set, which is suitable for most operators.

### `resource_params`

```python
def resource_params(self) -> dict
```

A dictionary containing the minimal information needed to compute a resource estimate
of the operator's decomposition. The keys of this dictionary should match the
``resource_keys`` attribute of the operator class.

### `resource_rep`

```python
def resource_rep(cls, *args, **kwargs) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the operator that are needed to estimate the resources.

### `resource_rep_from_op`

```python
def resource_rep_from_op(self) -> CompressedResourceOp
```

Returns a compressed representation directly from the operator

### `resource_decomp`

```python
def resource_decomp(cls, *args, **kwargs) -> list[GateCount]
```

Returns a list of actions that define the resources of the operator.

### `adjoint_resource_decomp`

```python
def adjoint_resource_decomp(cls, target_resource_params: dict | None=None) -> list[GateCount]
```

Returns a list representing the resources for the adjoint of the operator.

For a ``ResourceOperator`` that doesn't define an ``adjoint_resource_decomp`` method, this will
be the default ``adjoint_resource_decomp`` method.

Resources:
    The resources for the adjoint of an operator are obtained by tracking the adjoint of
    each gate in the resource decomposition of the operator.

Args:
    target_resource_params (dict | None): A dictionary containing the resource parameters
        of the target operator.

### `controlled_resource_decomp`

```python
def controlled_resource_decomp(cls, num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict | None=None) -> list[GateCount]
```

Returns a list representing the resources for a controlled version of the operator.

For a ``ResourceOperator`` that doesn't define a ``controlled_resource_decomp`` method, this
will be the default ``controlled_resource_decomp`` method.

Resources:
    The resources for the controlled operator are obtained by controlling (with the same number of control
    wires and zero controlled values) each gate in the base operator's resource decomposition.

Args:
    num_ctrl_wires (int): the number of qubits the
        operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are
        controlled when in the :math:`|0\rangle` state
    target_resource_params (dict | None): A dictionary containing the resource parameters
        of the target operator.

### `pow_resource_decomp`

```python
def pow_resource_decomp(cls, pow_z: int, target_resource_params: dict | None=None) -> list[GateCount]
```

Returns a list representing the resources for an operator
raised to a power.

For a ``ResourceOperator`` that doesn't define a ``pow_resource_decomp`` method, this will
be its ``pow_resource_decomp`` method.

Resources:
    The resources for an operator raised to some power are obtained by taking the base resource
    decomposition of the operator and tracking each gate raised to the given power. For a power
    of zero, the identity operator is returned. For a power of one, the base operator is
    returned.

Args:
    pow_z (int): exponent that the operator is raised to
    target_resource_params (dict | None): A dictionary containing the resource parameters
        of the target operator.

### `add_series`

```python
def add_series(self, other)
```

Adds a :class:`~.pennylane.estimator.ResourceOperator` or :class:`~.pennylane.estimator.Resources` in series.

Args:
    other (:class:`~.pennylane.estimator.Resources`|:class:`~.pennylane.estimator.ResourceOperator`): The other object to combine with, it can be
        another ``ResourceOperator`` or a ``Resources`` object.

Returns:
    :class:`~.pennylane.estimator.Resources`: added ``Resources``

### `add_parallel`

```python
def add_parallel(self, other)
```

Adds a :class:`~.pennylane.estimator.ResourceOperator` or :class:`~.pennylane.estimator.Resources` in parallel.

Args:
    other (:class:`~.pennylane.estimator.Resources`|:class:`~.pennylane.estimator.ResourceOperator`): The other object to combine with, it can be
        another ``ResourceOperator`` or a ``Resources`` object.

Returns:
    :class:`~.pennylane.estimator.Resources`: added ``Resources``

### `tracking_name`

```python
def tracking_name(cls, *args, **kwargs) -> str
```

Returns a name used to track the operator during resource estimation.

## `GateCount`

```python
class GateCount
```

Stores a lightweight representation of a gate and its number of occurrences in a decomposition.

The decomposition of a resource operator is tracked as a sequence of gates and the corresponding
number of times those gates occur in the decomposition. For a given resource operator, this
decomposition can be accessed with the operator's ``.resource_decomp()`` method. The method
returns a sequence of ``GateCount`` objects where each object groups the two pieces of
information, gate and counts, for the decomposition.

For example, the decomposition of the Quantum Fourier Transform (QFT)
contains 3 ``Hadamard`` gates, 1 ``SWAP`` gate and 3 ``ControlledPhaseShift`` gates.

.. code-block:: pycon

    >>> import pennylane.estimator as qre
    >>> lst_of_gate_counts = qre.QFT.resource_decomp(num_wires=3)
    >>> lst_of_gate_counts
    [(3 x Hadamard), (1 x SWAP), (3 x ControlledPhaseShift)]

**Example**

This example creates an object to count ``5`` instances of :code:`QFT` acting
on three wires:

>>> import pennylane.estimator as qre
>>> qft = qre.resource_rep(qre.QFT, {"num_wires": 3})
>>> counts = qre.GateCount(qft, 5)
>>> counts
(5 x QFT(3))

Args:
    gate (CompressedResourceOp): The compressed resource representation of the gate being counted.
    counts (int | None): The number of occurrences of the quantum gate in the circuit or
        decomposition. Defaults to ``1``.

Returns:
    GateCount: The container object holding both pieces of information.

## `resource_rep`

```python
def resource_rep(resource_op: type[ResourceOperator], resource_params: dict | None=None) -> CompressedResourceOp
```

Produce a compressed representation of the resource operator to be used when
tracking resources.

This function produces the expected compressed representation of a resource operator class.
The compressed representation
(:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`) is used instead of
the resource operator to enable faster performance of the resource estimation functionality.

This function is used when defining the resource decompositions of a resource operator.
Specifically, all resource decompositions are represented as a list of operators
(``CompressedResourceOp``) and the number of times they occur in the decomposition (``int``).
Those two pieces of information are tracked inside the
:class:`~.pennylane.estimator.resource_operator.GateCount` class.

.. note::

    The :code:`resource_params` dictionary should specify the required resource
    parameters of the operator. The required resource parameters are listed in the
    :code:`resource_keys` class property of every :class:`~.pennylane.estimator.ResourceOperator`.

Args:
    resource_op (type[ResourceOperator]]): The type of operator for which to retrieve the compact representation.
    resource_params (dict | None): The required set of parameters to specify the operator. Defaults to ``None``.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: A compressed representation of a resource operator

**Example**

This example shows how to obtain the compressed resource representation for the quantum Fourier
transform (:code:`QFT`) operation. We begin by checking what parameters are required for
resource estimation and then provide them accordingly:

>>> import pennylane.estimator as qre
>>> qre.QFT.resource_keys
{'num_wires'}
>>> cmpr_qft = qre.resource_rep(
...     qre.QFT,
...     {"num_wires": 3},
... )
>>> cmpr_qft
CompressedResourceOp(QFT, num_wires=3, params={'num_wires':3})

.. details::
    :title: Usage Details

    In this example we create a custom resource decomposition function which returns the
    decomposition using the ``GateCount`` class. We use the ``resource_rep`` function to
    obtain the compressed representations of each gate in the decomposition.

    .. code-block:: python

        import pennylane.estimator as qre

        def custom_RX_decomp(precision):  # RX = H @ RZ @ H
            h = qre.resource_rep(qre.Hadamard)
            rz = qre.resource_rep(qre.RZ, resource_params={"precision": None})
            return [qre.GateCount(h, 2), qre.GateCount(rz, 1)]

    .. code-block:: pycon

        >>> print(qre.estimate(qre.RX(), gate_set={"Hadamard", "RZ", "T"}))
        --- Resources: ---
         Total wires: 1
           algorithmic wires: 1
           allocated wires: 0
             zero state: 0
             any state: 0
         Total gates : 44
           'T': 44

    We override the default decomposition using the
    :class:`~.pennylane.estimator.resource_config.ResourceConfig` class.

    .. code-block:: pycon

        >>> config = qre.ResourceConfig()
        >>> config.set_decomp(qre.RX, custom_RX_decomp)
        >>> print(qre.estimate(qre.RX(), gate_set={"Hadamard", "RZ", "T"}, config=config))
        --- Resources: ---
         Total wires: 1
           algorithmic wires: 1
           allocated wires: 0
             zero state: 0
             any state: 0
         Total gates : 3
           'RZ': 1,
           'Hadamard': 2
