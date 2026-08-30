---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/pauli/pauli_vspace.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/pauli/pauli_vspace.py
license: Apache-2.0
---

## Module `pennylane/pauli/pauli_vspace.py`

A class for the linearly independent basis of a vector space in operator space.

## `PauliVSpace`

```python
class PauliVSpace
```

Class representing the linearly independent basis of a vector space in operator space.

The main purpose of this class is to store and process ``M``, which
is a dictionary-of-keys (DOK) style sparse representation of the set of basis vectors. You can
think of it as the numpy-equivalent of a PauliSentence: each :class:`~pennylane.pauli.PauliWord` (key of :class:`~pennylane.pauli.PauliSentence`)
represents one row of ``M`` with the coefficient (value of :class:`~pennylane.pauli.PauliSentence`).
For example the set of 3 linearly independent generators ``X(0) + X(1), X(0) + X(2), X(0) + 0.5 * Y(0)``
can be represented as

.. code-block:: python3

    [
        [1, 1, 1],
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 0.5]
    ]

where each column represents one sentence, and each row represents the coefficient of the respective word in the sentence.
To make sense of this representation one additionally needs to keep track of the mapping between keys and rows. In this case we have

.. code-block:: python3

    pw_to_idx = {
        X(0) : 0,
        X(1) : 1,
        X(2) : 2,
        Y(0) : 3
    }

where we have set the numbering based on appearance in the list of generators. This mapping is in general not unique.

Args:
    generators (Iterable[Union[PauliWord, PauliSentence, Operator]]): Operators that span the vector space.
    dtype (type): ``dtype`` of the underlying DOK sparse matrix ``M``. Default is ``float``.
    tol (float): Numerical tolerance for the linear independence check. If the norm of the projection of the candidate vector
        onto :math:`M^\perp` is greater than ``tol``, then it is deemed to be linearly independent.

**Example**

Take a linearly dependent set of operators and span the PauliVSpace.

.. code-block:: python

    ops = [
        qp.X(0) @ qp.X(1) + qp.Y(0) @ qp.Y(1),
        qp.X(0) @ qp.X(1),
        qp.Y(0) @ qp.Y(1)
    ]

    vspace = PauliVSpace(ops)

It automatically detects that the third operator is linearly dependent on the former two, so it does not add the third operator to the basis.

>>> vspace.basis
[1.0 * X(0) @ X(1)
 + 1.0 * Y(0) @ Y(1),
 1.0 * X(0) @ X(1)]

We can also retrospectively add operators.

>>> vspace.add(qp.X(0))
[1.0 * X(0) @ X(1)
 + 1.0 * Y(0) @ Y(1),
 1.0 * X(0) @ X(1),
 1.0 * X(0)]

Again, checks of linear independence are always performed. So in the following example no operator is added.

>>> vspace.add(qp.Y(0) @ qp.Y(1))
[1.0 * X(0) @ X(1)
 + 1.0 * Y(0) @ Y(1),
 1.0 * X(0) @ X(1),
 1.0 * X(0)]

### `basis`

```python
def basis(self)
```

List of basis operators of PauliVSpace

### `add`

```python
def add(self, other, tol=None)
```

Adding Pauli sentences if they are linearly independent.

Args:
    other (List[:class:`~.PauliWord`, :class:`~.PauliSentence`, :class:`~.Operator`]): List of candidate operators to add to the ``PauliVSpace``, if they are linearly independent.
    tol (float): Numerical tolerance for linear independence check. Defaults to ``1e-15``.

Returns:
    List: New basis vectors after adding the linearly independent ones from ``other``.

**Example**

We can generate a ``PauliVSpace`` and add a linearly independent operator to its basis.

>>> ops = [qp.X(0), qp.X(1)]
>>> vspace = qp.pauli.PauliVSpace(ops)
>>> vspace.add(qp.Y(0))
[1.0 * X(0), 1.0 * X(1), 1.0 * Y(0)]

We can add a list of operators at once. Only those that are linearly dependent with the current ``PauliVSpace`` are added.

>>> vspace.add([qp.Z(0), qp.X(0)])
[1.0 * X(0), 1.0 * X(1), 1.0 * Y(0), 1.0 * Z(0)]

### `is_independent`

```python
def is_independent(self, pauli_sentence, tol=None)
```

Check if the ``pauli_sentence`` is linearly independent of the basis of ``PauliVSpace``.

Args:
    pauli_sentence (`~.PauliSentence`): Candidate Pauli sentence to check against the ``PauliVSpace`` basis for linear independence.
    tol (float): Numerical tolerance for linear independence check. Defaults to ``1e-15``.

Returns:
    bool: whether ``pauli_sentence`` was linearly independent

**Example**

>>> ops = [qp.X(0), qp.X(1)]
>>> vspace = PauliVSpace([op.pauli_rep for op in ops])
>>> vspace.is_independent(qp.X(0).pauli_rep)
False
>>> vspace.is_independent(qp.Y(0).pauli_rep)
True

### `__eq__`

```python
def __eq__(self, other)
```

Two PauliVSpaces are equivalent when they span the same dimensional space.
This is checked here by having matching PauliWord keys in the sparse DOK representation and having the same rank.
