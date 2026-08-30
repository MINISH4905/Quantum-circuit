---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/intermediate_reps/rowcol.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/intermediate_reps/rowcol.py
license: Apache-2.0
---

## Module `pennylane/transforms/intermediate_reps/rowcol.py`

CNOT routing algorithm RowCol as described in https://arxiv.org/abs/1910.14478.

## `postorder_traverse`

```python
def postorder_traverse(tree, source: int, source_parent: int | None=None)
```

Post-order traverse a tree graph, starting from (but excluding) the node ``source``.

Args:
    tree (nx.Graph): Tree graph to traverse. Must contain ``source``. Must contain
        ``source_parent`` if it is not None. Typing assumes integer-labeled nodes.
    source (int): Node to start the traversal from
    source_parent (Optional[int]): Parent node of ``source`` in ``tree``. Should not be provided
        manually but is used in recursion.

Returns:
    list[tuple[int]]: Pairs of nodes that constitute post-order traversal of ``tree``
    starting at ``source``. Strictly speaking, the traversal is encoded in the first
    entry of each pair, and the second entry simply is the parent node for each first entry.

A useful illustration of depth-first tree traversals can be found on
`Wikipedia <https://en.wikipedia.org/wiki/Tree_traversal#Depth-first%20search>`__.

**Example**

Consider the tree

.. code-block::

                      (4)
                       |
    (6) - (2) - (0) - (1) - (3) - (8)
           |           |
          (7)         (5)

and consider ``(0)`` to be the source, or root, of the tree.
We may construct this tree as a ``nx.Graph`` by providing the edge data:

>>> import networkx as nx
>>> G = nx.Graph([(0, 1), (0, 2), (1, 3), (1, 4), (1, 5), (2, 6), (2, 7), (3, 8)])

As for every tree traversal, post-order traversal results in a reordering of the nodes of
the tree, with each node appearing exactly once. Post-order traversing the graph means that
for every node we reach, we first visit its child nodes (in standard sorting of the node
labels/indices) and then append the node itself to the ordering.

The post-order traversal reads ``[8, 3, 4, 5, 1, 6, 7, 2, 0]``.
For the output convention of this function, each node is accompanied by its
parent node, because this is useful information needed down the line, and it is not easy to
retrieve from the ``nx.Graph`` itself. In addition, the last entry, which is always the root
of the tree provided via the ``source`` argument, is *not* included in the output.

>>> traversal = qp.transforms.intermediate_reps.postorder_traverse(G, 0)
>>> print(traversal)
[(8, 3), (3, 1), (4, 1), (5, 1), (1, 0), (6, 2), (7, 2), (2, 0)]
>>> expected = [8, 3, 4, 5, 1, 6, 7, 2] # Skipping trailing root
>>> all(child == exp for (child, parent), exp in zip(traversal, expected, strict=True))
True

  To see how this comes about, start at the root ``(0)`` and perform the following steps:

  #. Visit ``(1)``, ``(3)`` and then ``(8)``, without appending any of them.
  #. Append ``(8)`` because there are no child nodes to visit (it is a leaf node).
  #. Append ``(3)`` because all children of it have been visited.
  #. Visit the next child of ``(1)``, which is ``(4)``, and append it because it is a leaf node.
  #. Visit the last child of ``(1)``, which is ``(5)``, and append it because it is a leaf node.
  #. Append ``(1)`` because all its children have been visited.
  #. Visit ``(2)`` and then ``(6)``, the latter of which is appended (leaf node).
  #. Visit the second and last child of ``(2))``, which is ``(7)``, and append it (leaf node).
  #. Append ``(2)`` becaues all its children have been visited.
  #. Append ``(0)`` becaues all its children have been visited.

Note that the ``source_parent`` argument should not be provided when calling the function
but is used for the internal recursive structure.

## `preorder_traverse`

```python
def preorder_traverse(tree, source: int, source_parent: int=None)
```

Pre-order traverse a tree graph, starting from (but excluding) the node ``source``.

Args:
    tree (nx.Graph): Tree graph to traverse. Must contain ``source``. Must contain
        ``source_parent`` if it is not None. Typing assumes integer-labeled nodes.
    source (int): Node to start the traversal from
    source_parent (Optional[int]): Parent node of ``source`` in ``tree``. Should not be provided
        manually but is used in recursion.

Returns:
    list[tuple[int]]: Pairs of nodes that constitute pre-order traversal of ``tree``
    starting at ``source``. Strictly speaking, the traversal is encoded in the first
    entry of each pair, and the second entry simply is the parent node for each first entry.

A useful illustration of depth-first tree traversals can be found on
`Wikipedia <https://en.wikipedia.org/wiki/Tree_traversal#Depth-first%20search>`__.

**Example**

Consider the tree

.. code-block::

                      (4)
                       |
    (6) - (2) - (0) - (1) - (3) - (8)
           |           |
          (7)         (5)

and consider ``(0)`` to be the source, or root, of the tree.
We may construct this tree as a ``nx.Graph`` by providing the edge data:

>>> import networkx as nx
>>> G = nx.Graph([(0, 1), (0, 2), (1, 3), (1, 4), (1, 5), (2, 6), (2, 7), (3, 8)])

As for every tree traversal, pre-order traversal results in a reordering of the nodes of
the tree, with each node appearing exactly once. Pre-order traversing the graph means that
for every node we reach, we first append the node itself to the ordering and then visit its
child nodes (in standard sorting of the node labels/indices).

The pre-order traversal reads ``[0, 1, 3, 8, 4, 5, 2, 6, 7]``.
For the output convention of this function, each node is accompanied by its
parent node, because this is useful information needed down the line, and it is not easy to
retrieve from the ``nx.Graph`` itself. In addition, the first entry, which always is the root
of the tree provided via the ``source`` argument, is *not* included in the output.

>>> traversal = qp.transforms.intermediate_reps.preorder_traverse(G, 0)
>>> print(traversal) # doctest: +SKIP
[(1, 0), (3, 1), (8, 3), (4, 1), (5, 1), (2, 0), (6, 2), (7, 2)]
>>> expected = [1, 3, 8, 4, 5, 2, 6, 7] # Skipping leading root
>>> all(child == exp for (child, parent), exp in zip(traversal, expected, strict=True))
True

  To see how this comes about, start at the root ``(0)`` and perform the following steps:

  #. Append ``(0)``, the root.
  #. Visit the first child of ``(0)``, which is ``(1)``, and append it.
  #. Visit the first child of ``(1)``, which is ``(3)``, and append it.
  #. Visit the first and only child of ``(3)``, which is ``(8)``, and append it.
  #. Visit the next child of ``(1)``, which is ``(4)``, and append it.
  #. Visit the last child of ``(1)``, which is ``(5)``, and append it.
  #. Visit the second and last child of ``(0)``, which is ``(2)``, and append it.
  #. Visit the first child of ``(2)``, which is ``(6)``, and append it.
  #. Visit the second and last child of ``(2)``, which is ``(7)``, and append it.

Note that the ``source_parent`` argument should not be provided when calling the function
but is used for the internal recursive structure.

## `rowcol`

```python
def rowcol(tape: QuantumScript, connectivity=None) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

CNOT routing algorithm `RowCol <https://pennylane.ai/compilation/rowcol-algorithm>`__.

This transform maps a CNOT circuit to a new CNOT circuit under constrained connectivity.
The algorithm was introduced by `Wu et al. <https://arxiv.org/abs/1910.14478>`__ and is
detailed on its `compilation page <https://pennylane.ai/compilation/rowcol-algorithm>`__,
where additional examples can be found as well.

Args:
    tape (QNode or QuantumScript or Callable): Input circuit containing only :class:`~.CNOT` gates. Will internally be translated to the :func:`~.parity_matrix` IR.
    connectivity (nx.Graph): Connectivity graph to route into. If ``None`` (the default), full connectivity is assumed.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumScript], function]:
    the transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

Raises:
    TypeError: if the input quantum circuit is not a CNOT circuit.

**Example**

Let us start by defining a connectivity graph

.. code-block::

    (0) - (3) - (4)
           |
          (2)
           |
          (1)

and define it in code as a ``networkx.Graph``
(`networkx documentation <https://networkx.org/documentation/stable/index.html>`__).

>>> import networkx as nx
>>> G = nx.Graph([(0, 3), (1, 2), (2, 3), (3, 4)])

Further we define the following circuit:

.. code-block: python

    import pennylane as qp
    def qfunc():
        for i in range(4):
            qp.CNOT((i, i+1))
        for (i, j) in [(0, 4), (3, 0), (0, 2), (3, 1), (2, 4)]:
            qp.CNOT((i, j))

>>> print(qp.draw(qfunc, wire_order=range(5))())
0: ─╭●──────────╭●─╭X─╭●───────┤
1: ─╰X─╭●───────│──│──│──╭X────┤
2: ────╰X─╭●────│──│──╰X─│──╭●─┤
3: ───────╰X─╭●─│──╰●────╰●─│──┤
4: ──────────╰X─╰X──────────╰X─┤

We now run the algorithm:

>>> new_qfunc = qp.transforms.rowcol(qfunc)
>>> print(qp.draw(new_qfunc, wire_order=range(5))()) # doctest: +SKIP
0: ──────────╭X─╭X─╭●─╭●─╭●─╭X─┤
1: ────╭●─╭X─│──│──│──│──│──│──┤
2: ─╭X─╰X─╰●─│──╰●─│──│──╰X─╰●─┤
3: ─╰●───────╰●────│──╰X───────┤
4: ────────────────╰X──────────┤

We can confirm that this circuit indeed implements the original circuit:

>>> import numpy as np
>>> U1 = qp.matrix(new_qfunc, wire_order=range(5))() # doctest: +SKIP
>>> U2 = qp.matrix(qfunc, wire_order=range(5))() # doctest: +SKIP
>>> np.allclose(U1, U2) # doctest: +SKIP
True

The same is true for the :func:`~.parity_matrix` of both circuits.

Please see `the compilation page on RowCol <https://pennylane.ai/compilation/rowcol-algorithm>`__ for more details and step-by-step explanations of the algorithm.
