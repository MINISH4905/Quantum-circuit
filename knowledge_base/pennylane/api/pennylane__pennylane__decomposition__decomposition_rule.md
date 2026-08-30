---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/decomposition/decomposition_rule.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/decomposition/decomposition_rule.py
license: Apache-2.0
---

## Module `pennylane/decomposition/decomposition_rule.py`

Defines the ``DecompositionRule`` class to represent a decomposition rule.

## `WorkWireSpec`

```python
class WorkWireSpec
```

The number of each type of work wires that a decomposition rule requires.

### `total`

```python
def total(self) -> int
```

The total number of work wires.

## `register_condition`

```python
def register_condition(condition: Callable[..., bool], qfunc: Callable | None=None) -> Callable[[Callable], DecompositionRule] | DecompositionRule
```

Binds a condition to a decomposition rule for when it is applicable.

.. note::

    This function is only relevant when the new experimental graph-based decomposition system
    (introduced in v0.41) is enabled via :func:`~pennylane.decomposition.enable_graph`. This new way of
    performing decompositions is generally more resource-efficient and accommodates multiple alternative
    decomposition rules for an operator. In this new system, custom decomposition rules are
    defined as quantum functions, and it is currently required that every decomposition rule
    declares its required resources using :func:`~.register_resources`.

Args:
    condition (Callable): a function which takes the resource parameters of an operator as
        arguments and returns ``True`` or ``False`` based on whether the decomposition rule
        is applicable to an operator with the given resource parameters.
    qfunc (Callable): the quantum function that implements the decomposition. If ``None``,
        returns a decorator for acting on a function.

Returns:
    DecompositionRule:
        a data structure that represents a decomposition rule, which contains a PennyLane
        quantum function representing the decomposition, and its resource function.

**Example**

This function can be used as a decorator to bind a condition function to a quantum function
that implements a decomposition rule.

.. code-block:: python

    import pennylane as qp
    from pennylane.math.decomposition import zyz_rotation_angles

    # The parameters must be consistent with ``qp.QubitUnitary.resource_keys``
    def _zyz_condition(num_wires):
        return num_wires == 1

    @qp.register_condition(_zyz_condition)
    @qp.register_resources({qp.RZ: 2, qp.RY: 1, qp.GlobalPhase: 1})
    def zyz_decomposition(U, wires, **__):
        # Assumes that U is a 2x2 unitary matrix
        phi, theta, omega, phase = zyz_rotation_angles(U, return_global_phase=True)
        qp.RZ(phi, wires=wires[0])
        qp.RY(theta, wires=wires[0])
        qp.RZ(omega, wires=wires[0])
        qp.GlobalPhase(-phase)

    # This decomposition will be ignored for `QubitUnitary` on more than one wire.
    qp.add_decomps(qp.QubitUnitary, zyz_decomposition)

## `register_resources`

```python
def register_resources(ops: Callable | dict, qfunc: Callable | None=None, *, work_wires: Callable | dict | None=None, exact: bool=True, name: str='') -> Callable[[Callable], DecompositionRule] | DecompositionRule
```

Binds a quantum function to its required resources.

.. note::

    This function is only relevant when the new experimental graph-based decomposition system
    (introduced in v0.41) is enabled via :func:`~pennylane.decomposition.enable_graph`. This new way of
    doing decompositions is generally more resource efficient and accommodates multiple alternative
    decomposition rules for an operator. In this new system, custom decomposition rules are
    defined as quantum functions, and it is currently required that every decomposition rule
    declares its required resources using ``qp.register_resources``.

Args:
    ops (dict or Callable): a dictionary mapping unique operators within the given ``qfunc``
        to their number of occurrences therein. If a function is provided instead of a static
        dictionary, a dictionary must be returned from the function. For more information,
        consult the "Quantum Functions as Decomposition Rules" section below.
    qfunc (Callable): the quantum function that implements the decomposition. If ``None``,
        returns a decorator for acting on a function.

Keyword Args:
    work_wires (dict or Callable): a dictionary declaring the number of work wires of each type
        required to perform this decomposition. Accepted work wire types include ``"zeroed"``,
        ``"borrowed"``, ``"burnable"``, and ``"garbage"``. For more information, consult the
        "Dynamic Allocation of Work Wires" section below.
    exact (bool): whether the resources are computed exactly (``True``, default) or
        estimated heuristically (``False``). This information is only relevant for testing
        and validation purposes.
    name (str): a custom name for this decomposition rule. If not provided, the name of the
        decomposition rule is set to the name of the function.

Returns:
    DecompositionRule:
        a data structure that represents a decomposition rule, which contains a PennyLane
        quantum function representing the decomposition, and its resource function.


**Example**

This function can be used as a decorator to bind a quantum function to its required resources
so that it can be used as a decomposition rule within the new graph-based decomposition system.

.. code-block:: python

    import pennylane as qp

    qp.decomposition.enable_graph()

    @qp.register_resources({qp.H: 2, qp.CZ: 1})
    def my_cnot(wires, **_):
        qp.H(wires=wires[1])
        qp.CZ(wires=wires)
        qp.H(wires=wires[1])

    @qp.decompose(gate_set={qp.CZ, qp.H}, fixed_decomps={qp.CNOT: my_cnot})
    @qp.qnode(qp.device("default.qubit"))
    def circuit():
        qp.CNOT(wires=[0, 1])
        return qp.state()


>>> print(qp.draw(circuit, level="device")())
0: ────╭●────┤  State
1: ──H─╰Z──H─┤  State

Alternatively, the decomposition rule can be created in-line:

>>> my_cnot = qp.register_resources({qp.H: 2, qp.CZ: 1}, my_cnot)

By default, the name of the decorated function is taken as the name of the decomposition rule.

>>> my_cnot.name
'my_cnot'

Optionally, a custom name can be assigned using the ``name`` argument:

.. code-block:: python

    @qp.register_resources({qp.H: 2, qp.CZ: 1}, name="to-cz")
    def my_cnot(wires, **_):
        qp.H(wires=wires[1])
        qp.CZ(wires=wires)
        qp.H(wires=wires[1])

>>> my_cnot.name
'to-cz'

.. details::
    :title: Quantum Functions as Decomposition Rules

    Quantum functions representing decomposition rules within the new decomposition system
    are expected to take ``(*op.parameters, op.wires, **op.hyperparameters)`` as arguments,
    where ``op`` is an instance of the operator type that the decomposition is for.

.. details::
    :title: Operators with Dynamic Resource Requirements

    In many cases, the resource requirement of an operator's decomposition is not static; some
    operators have properties that directly affect the resource estimate of its decompositions,
    i.e., the types of gates that exist in the decomposition and their number of occurrences.

    For each operator class, the set of parameters that affects the type of gates and their
    number of occurrences in its decompositions is given by the ``resource_keys`` attribute.
    For example, the number of gates in the decomposition for ``qp.MultiRZ`` changes based
    on the number of wires it acts on, in contrast to the decomposition for ``qp.CNOT``:

    >>> qp.CNOT.resource_keys
    set()
    >>> qp.MultiRZ.resource_keys
    {'num_wires'}

    The output of ``resource_keys`` indicates that custom decompositions for the operator
    should be registered to a resource function (as opposed to a static dictionary) that
    accepts those exact arguments and returns a dictionary.

    .. code-block:: python

        def _multi_rz_resources(num_wires):
            return {
                qp.CNOT: 2 * (num_wires - 1),
                qp.RZ: 1
            }

        @qp.register_resources(_multi_rz_resources)
        def multi_rz_decomposition(theta, wires, **__):
            for w0, w1 in zip(wires[-1:0:-1], wires[-2::-1]):
                qp.CNOT(wires=(w0, w1))
            qp.RZ(theta, wires=wires[0])
            for w0, w1 in zip(wires[1:], wires[:-1]):
                qp.CNOT(wires=(w0, w1))

    Additionally, if a custom decomposition for an operator contains gates that, in turn,
    have properties that affect their own decompositions, this information must also be
    included in the resource function. For example, if a decomposition rule produces a
    ``MultiRZ`` gate, it is not sufficient to declare the existence of a ``MultiRZ`` in the
    resource function; the number of wires it acts on must also be specified.

    Consider a fictitious operator with the following decomposition:

    .. code-block:: python

        def my_decomp(theta, wires):
            qp.MultiRZ(theta, wires=wires[:-1])
            qp.MultiRZ(theta, wires=wires)
            qp.MultiRZ(theta, wires=wires[1:])

    It contains two ``MultiRZ`` gates acting on ``len(wires) - 1`` wires (the first and last
    ``MultiRZ``) and one ``MultiRZ`` gate acting on exactly ``len(wires)`` wires. This
    distinction must be reflected in the resource function:

    .. code-block:: python

        def my_resources(num_wires):
            return {
                qp.resource_rep(qp.MultiRZ, num_wires=num_wires - 1): 2,
                qp.resource_rep(qp.MultiRZ, num_wires=num_wires): 1
            }

        my_decomp = qp.register_resources(my_resources, my_decomp)

    where :func:`~pennylane.resource_rep` is a utility function that wraps an operator type and any
    additional information relevant to its resource estimate into a compressed data structure.
    To check what (if any) additional information is required to declare an operator type
    in a resource function, refer to the ``resource_keys`` attribute of the :class:`~pennylane.operation.Operator`
    class. Operators with non-empty ``resource_keys`` must be declared using ``qp.resource_rep``,
    with keyword arguments matching its ``resource_keys`` exactly.

    .. seealso::

        :func:`~pennylane.resource_rep`

.. details::
   :title: Dynamically Allocated Wires as a Resource

   Some decomposition rules make use of work wires, which can be dynamically requested within
   the quantum function using :func:`~pennylane.allocation.allocate`. Such decomposition rules
   should register the number of work wires they require so that the decomposition algorithm
   is able to budget the use of work wires across decomposition rules.

   There are four types of work wires:

   - "zeroed" wires are guaranteed to be in the :math:`|0\rangle` state initially, and they
     must be restored to the :math:`|0\rangle` state before deallocation.

   - "borrowed" wires are allocated in an arbitrary state, but they must be restored to the same initial state before deallocation.

   - "burnable" wires are guaranteed to be in the :math:`|0\rangle` state initially, but they
     can be deallocated in any arbitrary state.

   - "garbage" wires can be allocated in any state, and can be deallocated in any state.

   Here's a decomposition for a multi-controlled ``Rot`` that uses a zeroed work wire:

   .. code-block:: python

      import pennylane as qp
      from pennylane.allocation import allocate
      from pennylane.decomposition import controlled_resource_rep

      qp.decomposition.enable_graph()

      def _ops_fn(num_control_wires, **_):
          return {
              controlled_resource_rep(qp.X, {}, num_control_wires): 2,
              qp.CRot: 1
          }

      @qp.register_condition(lambda num_control_wires, **_: num_control_wires > 1)
      @qp.register_resources(ops=_ops_fn, work_wires={"zeroed": 1})
      def _controlled_rot_decomp(*params, wires, **_):
          with allocate(1, state="zero", restored=True) as work_wires:
              qp.ctrl(qp.X(work_wires[0]), control=wires[:-1])
              qp.CRot(*params, wires=[work_wires[0], wires[-1]])
              qp.ctrl(qp.X(work_wires[0]), control=wires[:-1])

      decomps = {"C(Rot)": _controlled_rot_decomp}

      @qp.decompose(fixed_decomps=decomps, num_work_wires=1)
      @qp.qnode(qp.device("default.qubit"))
      def circuit():
          qp.ctrl(qp.Rot(0.1, 0.2, 0.3, wires=3), control=[0, 1, 2])
          return qp.probs(wires=[0, 1, 2, 3])

   >>> print(qp.draw(circuit)())
   <DynamicWire>: ──Allocate─╭X─╭●───────────────────╭X──Deallocate─┤
               0: ───────────├●─│────────────────────├●─────────────┤ ╭Probs
               1: ───────────├●─│────────────────────├●─────────────┤ ├Probs
               2: ───────────╰●─│────────────────────╰●─────────────┤ ├Probs
               3: ──────────────╰Rot(0.10,0.20,0.30)────────────────┤ ╰Probs

## `DecompositionRule`

```python
class DecompositionRule
```

Represents a decomposition rule for an operator.

### `compute_resources`

```python
def compute_resources(self, *args, **kwargs) -> Resources
```

Computes the resources required to implement this decomposition rule.

### `is_applicable`

```python
def is_applicable(self, *args, **kwargs) -> bool
```

Checks whether this decomposition rule is applicable.

### `get_work_wire_spec`

```python
def get_work_wire_spec(self, *args, **kwargs) -> WorkWireSpec
```

Gets the work wire requirements of this decomposition rule

### `add_condition`

```python
def add_condition(self, condition: Callable[..., bool]) -> None
```

Adds a condition for this decomposition rule.

### `set_resources`

```python
def set_resources(self, resources: Callable | dict, exact_resources: bool=True) -> None
```

Sets the resources for this decomposition rule.

### `set_work_wire_spec`

```python
def set_work_wire_spec(self, work_wires: Callable | dict) -> None
```

Sets the work wire usage of this decomposition rule.

## `DecompCollection`

```python
class DecompCollection
```

An ordered, name-addressable collection of :class:`~.DecompositionRule` objects.

A ``DecompCollection`` is exclusively returned by :func:`~pennylane.list_decomps`, which
retrieves all registered decomposition rules for a given operator. Each rule in the collection
has a unique name (derived from the decorated function name by default, or explicitly set via
:func:`~pennylane.register_resources` with ``name="..."``).

Individual rules can be accessed by integer index or by string name. The collection supports
:func:`len`, iteration, membership checks (by name or by :class:`~.DecompositionRule`
instance), :meth:`copy`, :meth:`append`, :meth:`extend`, ``+``, and ``+=``.  Duplicate names
within a collection are rejected with a ``ValueError``.

.. important::

    A ``DecompCollection`` returned by :func:`~pennylane.list_decomps` is a **copy** of the
    internally registered rules.  Mutating it (e.g. with :meth:`append` or :meth:`extend`)
    does **not** update the global decomposition registry.  Use :func:`~pennylane.add_decomps`
    to register new decomposition rules globally.

.. seealso::

    :class:`~.DecompositionRule`,
    :func:`~pennylane.register_resources`,
    :func:`~pennylane.list_decomps`,
    :func:`~pennylane.add_decomps`,
    :func:`~pennylane.inspect_decomps`

**Examples**

Retrieve and explore decomposition rules for an operator:

>>> decomps = qp.list_decomps(qp.CRX)
>>> len(decomps)
4
>>> print(decomps)
Available Decomposition Rules:
0: _crx_to_rx_cz
1: _crx_to_rz_ry
2: _crx_to_h_crz
3: _crx_to_ppr

Access rules by index or by name:

>>> decomps[0]
DecompositionRule(name=_crx_to_rx_cz)
>>> decomps["_crx_to_ppr"]
DecompositionRule(name=_crx_to_ppr)

Check membership:

>>> "_crx_to_ppr" in decomps
True

Iterate through rule names:

>>> [rule.name for rule in decomps]
['_crx_to_rx_cz', '_crx_to_rz_ry', '_crx_to_h_crz', '_crx_to_ppr']

### `copy`

```python
def copy(self) -> DecompCollection
```

Return a copy of the DecompCollection.

### `append`

```python
def append(self, rule: DecompositionRule)
```

Add a decomposition rule to the collection.

### `extend`

```python
def extend(self, rules: DecompCollection | Sequence[DecompositionRule])
```

Add a sequence of decomposition rules to the collection.

## `add_decomps`

```python
def add_decomps(op_type: type[Operator] | str, *decomps: DecompositionRule) -> None
```

Globally registers new decomposition rules with an operator class.

.. note::

    This function is only relevant when the new experimental graph-based decomposition system
    (introduced in v0.41) is enabled via :func:`~pennylane.decomposition.enable_graph`. This new way of
    doing decompositions is generally more resource efficient and accommodates multiple alternative
    decomposition rules for an operator. In this new system, custom decomposition rules are
    defined as quantum functions, and it is currently required that every decomposition rule
    declares its required resources using :func:`~pennylane.register_resources`

In the new system of decompositions, multiple decomposition rules can be registered for the
same operator class. The specified decomposition rules in ``add_decomps`` serve as alternative
decomposition rules that may be chosen if they lead to a more resource-efficient decomposition.

Args:
    op_type (type or str): the operator type for which new decomposition rules are specified.
        For symbolic operators, use strings such as ``"Adjoint(RY)"``, ``"Pow(H)"``, ``"C(RX)"``, etc.
    decomps (DecompositionRule): new decomposition rules to add to the given ``op_type``.
        A decomposition is a quantum function registered with a resource estimate using
        ``qp.register_resources``.

.. seealso:: :func:`~pennylane.register_resources` and :class:`~pennylane.list_decomps`

**Example**

This example demonstrates adding two new decomposition rules to the ``qp.Hadamard`` operator.

.. code-block:: python

    import pennylane as qp
    import numpy as np

    @qp.register_resources({qp.RZ: 2, qp.RX: 1, qp.GlobalPhase: 1})
    def my_hadamard1(wires):
        qp.RZ(np.pi / 2, wires=wires)
        qp.RX(np.pi / 2, wires=wires)
        qp.RZ(np.pi / 2, wires=wires)
        qp.GlobalPhase(-np.pi / 2, wires=wires)

    @qp.register_resources({qp.RZ: 1, qp.RY: 1, qp.GlobalPhase: 1})
    def my_hadamard2(wires):
        qp.RZ(np.pi, wires=wires)
        qp.RY(np.pi / 2, wires=wires)
        qp.GlobalPhase(-np.pi / 2)

    qp.add_decomps(qp.Hadamard, my_hadamard1, my_hadamard2)

These two new decomposition rules for ``qp.Hadamard`` will be subsequently stored within the
scope of this program, and they will be taken into account for all circuit decompositions
for the duration of the session. To add alternative decompositions for a particular circuit
as opposed to globally, use the ``alt_decomps`` argument of the :func:`~pennylane.transforms.decompose` transform.

Custom decomposition rules can also be specified for symbolic operators. In this case, the
operator type can be specified as a string. For example,

.. code-block:: python

    @register_resources({qp.RY: 1})
    def adjoint_ry(phi, wires, **_):
        qp.RY(-phi, wires=wires)

    qp.add_decomps("Adjoint(RY)", adjoint_ry)

.. seealso:: :func:`~pennylane.transforms.decompose`

## `list_decomps`

```python
def list_decomps(op: type[Operator] | Operator | str) -> DecompCollection
```

Lists all stored decomposition rules for an operator class.

.. note::

    This function is only relevant when the new experimental graph-based decomposition system
    (introduced in v0.41) is enabled via :func:`~pennylane.decomposition.enable_graph`. This new way of
    doing decompositions is generally more resource efficient and accommodates multiple alternative
    decomposition rules for an operator.

Args:
    op (type or Operator or str): the operator or operator type to retrieve decomposition
        rules for. For symbolic operators, use strings like ``"Adjoint(RY)"``, ``"Pow(H)"``,
        ``"C(RX)"``, etc.

Returns:
    DecompCollection: a collection of decomposition rules registered for the given operator.

.. important::

    The returned :class:`~.DecompCollection` is a **copy** of the registered
    rules.  Mutating it does not update the global decomposition registry; use
    :func:`~pennylane.add_decomps` to register rules globally.

**Example**

>>> import pennylane as qp
>>> qp.list_decomps(qp.CRX)
DecompCollection([
    DecompositionRule(name=_crx_to_rx_cz),
    DecompositionRule(name=_crx_to_rz_ry),
    DecompositionRule(name=_crx_to_h_crz),
    DecompositionRule(name=_crx_to_ppr)
])
>>> print(qp.list_decomps(qp.CRX))
Available Decomposition Rules:
0: _crx_to_rx_cz
1: _crx_to_rz_ry
2: _crx_to_h_crz
3: _crx_to_ppr

Each decomposition rule can be accessed by name or by index.

>>> qp.list_decomps(qp.CRX)['_crx_to_ppr']
DecompositionRule(name=_crx_to_ppr)
>>> print(qp.list_decomps(qp.CRX)[0])
@register_resources(_crx_to_rx_cz_resources)
def _crx_to_rx_cz(phi: TensorLike, wires: WiresLike, **__):
    qp.RX(phi / 2, wires=wires[1])
    qp.CZ(wires=wires)
    qp.RX(-phi / 2, wires=wires[1])
    qp.CZ(wires=wires)
>>> print(qp.draw(qp.list_decomps(qp.CRX)[0])(0.5, wires=[0, 1]))
0: ───────────╭●────────────╭●─┤
1: ──RX(0.25)─╰Z──RX(-0.25)─╰Z─┤

## `has_decomp`

```python
def has_decomp(op: type[Operator] | Operator | str) -> bool
```

Checks whether an operator has decomposition rules defined.

.. note::

    This function is only relevant when the new experimental graph-based decomposition system
    (introduced in v0.41) is enabled via :func:`~pennylane.decomposition.enable_graph`. This new way of
    doing decompositions is generally more resource efficient and accommodates multiple alternative
    decomposition rules for an operator.

Args:
    op (type or Operator or str): the operator or operator type to check for
        decomposition rules. For symbolic operators, use strings like ``"Adjoint(RY)"``,
        ``"Pow(H)"``, ``"C(RX)"``, etc.

Returns:
    bool: whether decomposition rules are defined for the given operator.

## `local_decomps`

```python
def local_decomps()
```

Start a new context in which additions to decomposition rules are localized.

This context manager is thread-safe because it uses ``ContextVar`` under the hood.

## `inspect_decomps`

```python
def inspect_decomps(op: Operator, *rules: str | DecompositionRule, show_not_applicable: bool=True, num_work_wires: int | None=None) -> _DecompInfoCollection
```

Inspect the decomposition rules of an operator.

Takes an operator instance and displays how the operator is decomposed
using different decomposition rules.

.. note::

    This function is only relevant when the new experimental graph-based decomposition system
    (introduced in v0.41) is enabled via :func:`~pennylane.decomposition.enable_graph`. This
    new way of performing decompositions is generally more resource-efficient and accommodates
    multiple alternative decomposition rules for an operator.

Args:
    op (Operator): the operator instance whose decomposition rules will be inspected.
    *rules (str or DecompositionRule): the decomposition rules to inspect. Accepts instances
        of the ``DecompositionRule`` class or rule names (str) that represent the decomposition
        rules registered with the type of ``op``. If none are provided, all available rules
        will be displayed.
    show_not_applicable (bool): if True (the default), all decomposition rules, including
        those that are not applicable to the specific operator instance (e.g., due to constraints
        on the number of wires), are displayed.
    num_work_wires (int or None): the maximum number of available work wires for dynamic allocation.
        Decomposition rules that allocate more wires than are available will be marked as
        "Not applicable" (and excluded if ``show_not_applicable=False``). Defaults to ``None``,
        which puts no constraint on the maximum number of work wires.

Returns:
    a displayable object with information about decomposition rules.

**Example**

By default, this function displays all available decomposition rules for an operator.

>>> qp.inspect_decomps(qp.CRX(0.5, wires=[0, 1]))
Decomposition 0 (name: _crx_to_rx_cz)
0: ───────────╭●────────────╭●─┤
1: ──RX(0.25)─╰Z──RX(-0.25)─╰Z─┤
Gate Count: {RX: 2, CZ: 2}
<BLANKLINE>
Decomposition 1 (name: _crx_to_rz_ry)
0: ─────────────────────╭●────────────╭●────────────┤
1: ──RZ(1.57)──RY(0.25)─╰X──RY(-0.25)─╰X──RZ(-1.57)─┤
Gate Count: {RZ: 2, RY: 2, CNOT: 2}
<BLANKLINE>
Decomposition 2 (name: _crx_to_h_crz)
0: ────╭●───────────┤
1: ──H─╰RZ(0.50)──H─┤
Gate Count: {Hadamard: 2, CRZ: 1}
<BLANKLINE>
Decomposition 3 (name: _crx_to_ppr)
0: ───────────╭RZX(-0.25)─┤
1: ──RX(0.25)─╰RZX(-0.25)─┤
Gate Count: {PauliRot(pauli_word=ZX): 1, PauliRot(pauli_word=X): 1}

For each decomposition rule, the output includes its name, circuit diagram, gate
count, and wire allocation (if any). Alternatively, you can inspect a single
decomposition rule by passing its name.

>>> qp.inspect_decomps(qp.CRX(0.5, wires=[0, 1]), "_crx_to_h_crz")
Decomposition 0 (name: _crx_to_h_crz)
0: ────╭●───────────┤
1: ──H─╰RZ(0.50)──H─┤
Gate Count: {Hadamard: 2, CRZ: 1}

Or use this tool to inspect a custom decomposition rule:

.. code-block:: python

    @qp.register_resources({qp.CNOT: 1, qp.H: 2})
    def my_cz(wires):
        qp.H(wires[1])
        qp.CNOT(wires)
        qp.H(wires[1])

>>> qp.inspect_decomps(qp.CZ([0, 1]), my_cz)
Decomposition 0 (name: my_cz)
0: ────╭●────┤
1: ──H─╰X──H─┤
Gate Count: {CNOT: 1, Hadamard: 2}

## `null_decomp`

```python
def null_decomp(*_, **__)
```

A decomposition rule that can be assigned to an operator so that the operator decomposes to nothing.

**Example**

.. code-block:: python

    import pennylane as qp
    from pennylane.decomposition import null_decomp

    qp.decomposition.enable_graph()

    @qp.decompose(
        gate_set={qp.RZ},
        fixed_decomps={qp.GlobalPhase: null_decomp}
    )
    @qp.qnode(qp.device("default.qubit"))
    def circuit():
        qp.Z(0)

>>> print(qp.draw(circuit)())
0: ──RZ(3.14)─┤
