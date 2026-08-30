---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/linear_combination.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/linear_combination.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/linear_combination.py`

LinearCombination class

## `LinearCombination`

```python
class LinearCombination(Sum)
```

Operator representing a linear combination of operators.

The ``LinearCombination`` is represented as a linear combination of other operators, e.g.,
:math:`\sum_{k=0}^{N-1} c_k O_k`, where the :math:`c_k` are trainable parameters.

.. note::

    ``qp.Hamiltonian`` dispatches to :class:`~pennylane.ops.op_math.LinearCombination`.

Args:
    coeffs (tensor_like): coefficients of the ``LinearCombination`` expression
    observables (Iterable[Operator]): observables in the ``LinearCombination`` expression, of same length as ``coeffs``
    grouping_type (str): If not ``None``, compute and store information on how to group commuting
        observables upon initialization. This information may be accessed when a :class:`~.QNode` containing this
        ``LinearCombination`` is executed on devices. The string refers to the type of binary relation between Pauli words.
        Can be ``'qwc'`` (qubit-wise commuting), ``'commuting'``, or ``'anticommuting'``.
    method (str): The graph colouring heuristic to use in solving minimum clique cover for grouping, which
        can be ``'lf'`` (Largest First), ``'rlf'`` (Recursive Largest First), ``'dsatur'`` (Degree of Saturation), or
        ``'gis'`` (IndependentSet). Defaults to ``'lf'``. Ignored if ``grouping_type=None``.
    id (str): name to be assigned to this ``LinearCombination`` instance

.. seealso:: `rustworkx.ColoringStrategy <https://www.rustworkx.org/apiref/rustworkx.ColoringStrategy.html#coloringstrategy>`_
    for more information on the ``('lf', 'dsatur', 'gis')`` strategies.

**Example:**

A ``LinearCombination`` can be created by simply passing the list of coefficients
as well as the list of observables:

>>> coeffs = [0.2, -0.543]
>>> obs = [qp.X(0) @ qp.Z(1), qp.Z(0) @ qp.Hadamard(2)]
>>> H = qp.ops.LinearCombination(coeffs, obs)
>>> print(H)
0.2 * (X(0) @ Z(1)) + -0.543 * (Z(0) @ H(2))

The same ``LinearCombination`` can be created using the ``qp.Hamiltonian`` alias:

>>> H = qp.Hamiltonian(coeffs, obs)
>>> print(H)
0.2 * (X(0) @ Z(1)) + -0.543 * (Z(0) @ H(2))

The coefficients can be a trainable tensor, for example:

>>> coeffs = qp.numpy.array([0.2, -0.543], requires_grad=True)
>>> obs = [qp.X(0) @ qp.Z(1), qp.Z(0) @ qp.Hadamard(2)]
>>> H = qp.ops.LinearCombination(coeffs, obs)
>>> print(H)
0.2 * (X(0) @ Z(1)) + -0.543 * (Z(0) @ H(2))

A ``LinearCombination`` can store information on which commuting observables should be measured together in
a circuit:

>>> obs = [qp.X(0), qp.X(1), qp.Z(0)]
>>> coeffs = np.array([1., 2., 3.])
>>> H = qp.ops.LinearCombination(coeffs, obs, grouping_type='qwc')
>>> H.grouping_indices
((0, 1), (2,))

This attribute can be used to compute groups of coefficients and observables:

>>> grouped_coeffs = [coeffs[list(indices)] for indices in H.grouping_indices]
>>> grouped_obs = [[H.ops[i] for i in indices] for indices in H.grouping_indices]
>>> grouped_coeffs
[array([1., 2.]), array([3.])]
>>> grouped_obs
[[X(0), X(1)], [Z(0)]]

Devices that evaluate a ``LinearCombination`` expectation by splitting it into its local observables can
use this information to reduce the number of circuits evaluated.

Note that one can compute the ``grouping_indices`` for an already initialized ``LinearCombination`` by
using the :func:`compute_grouping <pennylane.ops.LinearCombination.compute_grouping>` method.

### `coeffs`

```python
def coeffs(self)
```

Return the coefficients defining the LinearCombination.

Returns:
    Iterable[float]): coefficients in the LinearCombination expression

### `ops`

```python
def ops(self)
```

Return the operators defining the LinearCombination.

Returns:
    Iterable[Operator]): observables in the LinearCombination expression

### `terms`

```python
def terms(self)
```

Retrieve the coefficients and operators of the ``LinearCombination``.

Returns:
    tuple[list[tensor_like or float], list[.Operation]]: list of coefficients :math:`c_i`
    and list of operations :math:`O_i`

**Example**

>>> coeffs = [1., 2., 3.]
>>> ops = [qp.X(0), qp.X(0) @ qp.X(1), qp.X(1) @ qp.X(2)]
>>> op = qp.ops.LinearCombination(coeffs, ops)
>>> op.terms()
([1.0, 2.0, 3.0], [X(0), X(0) @ X(1), X(1) @ X(2)])

### `compute_grouping`

```python
def compute_grouping(self, grouping_type='qwc', method='lf')
```

Compute groups of operators and coefficients corresponding to commuting
observables of this ``LinearCombination``.

.. note::

    If grouping is requested, the computed groupings are stored as a list of list of indices
    in ``LinearCombination.grouping_indices``.

Args:
    grouping_type (str): The type of binary relation between Pauli words used to compute
        the grouping. Can be ``'qwc'``, ``'commuting'``, or ``'anticommuting'``.
        Defaults to ``'qwc'``.
    method (str): The graph colouring heuristic to use in solving minimum clique cover for
        grouping, which can be ``'lf'`` (Largest First), ``'rlf'`` (Recursive Largest First),
        ``'dsatur'`` (Degree of Saturation), or ``'gis'`` (Greedy Independent Set).

**Example**

.. code-block:: python

    import pennylane as qp

    a = qp.X(0)
    b = qp.prod(qp.X(0), qp.X(1))
    c = qp.Z(0)
    obs = [a, b, c]
    coeffs = [1.0, 2.0, 3.0]

    op = qp.ops.LinearCombination(coeffs, obs)

>>> op.grouping_indices is None
True
>>> op.compute_grouping(grouping_type="qwc")
>>> op.grouping_indices
((0, 1), (2,))

### `wires`

```python
def wires(self)
```

The sorted union of wires from all operators.

Returns:
    (Wires): Combined wires present in all terms, sorted.

### `__matmul__`

```python
def __matmul__(self, other: Operator) -> Operator
```

The product operation between Operator objects.

### `__add__`

```python
def __add__(self, H: numbers.Number | Operator) -> Operator
```

The addition operation between a LinearCombination and an Operator.

### `__sub__`

```python
def __sub__(self, H: Operator) -> Operator
```

The subtraction operation between a LinearCombination and an Operator.

### `__mul__`

```python
def __mul__(self, a: int | float | complex) -> 'LinearCombination'
```

The scalar multiplication operation between a scalar and a LinearCombination.

### `queue`

```python
def queue(self, context: qp.QueuingManager | qp.queuing.AnnotatedQueue=qp.QueuingManager)
```

Queues a ``qp.ops.LinearCombination`` instance

### `eigvals`

```python
def eigvals(self)
```

Return the eigenvalues of the specified operator.

This method uses pre-stored eigenvalues for standard observables where
possible and stores the corresponding eigenvectors from the eigendecomposition.

Returns:
    array: array containing the eigenvalues of the operator

### `diagonalizing_gates`

```python
def diagonalizing_gates(self)
```

Sequence of gates that diagonalize the operator in the computational basis.

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

A ``DiagGatesUndefinedError`` is raised if no representation by decomposition is defined.

.. seealso:: :meth:`~.Operator.compute_diagonalizing_gates`.

Returns:
    list[.Operator] or None: a list of operators

### `map_wires`

```python
def map_wires(self, wire_map: dict)
```

Returns a copy of the current ``LinearCombination`` with its wires changed according to the given
wire map.

Args:
    wire_map (dict): dictionary containing the old wires as keys and the new wires as values

Returns:
    .LinearCombination: new ``LinearCombination``

## `Hamiltonian`

```python
class Hamiltonian
```

Returns an operator representing a Hamiltonian.

The Hamiltonian is represented as a linear combination of other operators, e.g.,
:math:`\sum_{k=0}^{N-1} c_k O_k`, where the :math:`c_k` are trainable parameters.

.. note::

    ``qp.Hamiltonian`` dispatches to :class:`~pennylane.ops.op_math.LinearCombination`.

Args:
    coeffs (tensor_like): coefficients of the Hamiltonian expression
    observables (Iterable[Operator]): observables in the Hamiltonian expression, of same length as coeffs
    grouping_type (str): If not None, compute and store information on how to group commuting
        observables upon initialization. This information may be accessed when QNodes containing this
        Hamiltonian are executed on devices. The string refers to the type of binary relation between Pauli words.
        Can be ``'qwc'`` (qubit-wise commuting), ``'commuting'``, or ``'anticommuting'``.
    method (str): The graph colouring heuristic to use in solving minimum clique cover for grouping, which
        can be ``'lf'`` (Largest First), ``'rlf'`` (Recursive Largest First), ``'dsatur'`` (Degree of Saturation),
        or ``'gis'`` (Greedy Independent Set). Ignored if ``grouping_type=None``.
    id (str): name to be assigned to this Hamiltonian instance

**Example:**

``qp.Hamiltonian`` takes in a list of coefficients and a list of operators.

>>> coeffs = [0.2, -0.543]
>>> obs = [qp.X(0) @ qp.Z(1), qp.Z(0) @ qp.Hadamard(2)]
>>> H = qp.Hamiltonian(coeffs, obs)
>>> print(H)
0.2 * (X(0) @ Z(1)) + -0.543 * (Z(0) @ H(2))

The coefficients can be a trainable tensor, for example:

>>> coeffs = qp.numpy.array([0.2, -0.543], requires_grad=True)
>>> obs = [qp.X(0) @ qp.Z(1), qp.Z(0) @ qp.Hadamard(2)]
>>> H = qp.Hamiltonian(coeffs, obs)
>>> print(H)
0.2 * (X(0) @ Z(1)) + -0.543 * (Z(0) @ H(2))

A ``qp.Hamiltonian`` stores information on which commuting observables should be measured
together in a circuit:

>>> obs = [qp.X(0), qp.X(1), qp.Z(0)]
>>> coeffs = np.array([1., 2., 3.])
>>> H = qp.Hamiltonian(coeffs, obs, grouping_type='qwc')
>>> H.grouping_indices
((0, 1), (2,))

This attribute can be used to compute groups of coefficients and observables:

>>> grouped_coeffs = [coeffs[list(indices)] for indices in H.grouping_indices]
>>> grouped_obs = [[H.ops[i] for i in indices] for indices in H.grouping_indices]
>>> grouped_coeffs
[array([1., 2.]), array([3.])]
>>> grouped_obs
[[X(0), X(1)], [Z(0)]]

Devices that evaluate a ``qp.Hamiltonian`` expectation by splitting it into its local
observables can use this information to reduce the number of circuits evaluated.

Note that one can compute the ``grouping_indices`` for an already initialized ``qp.Hamiltonian``
by using the :func:`compute_grouping <pennylane.ops.LinearCombination.compute_grouping>` method.
