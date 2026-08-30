---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/embeddings/displacement.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/embeddings/displacement.py
license: Apache-2.0
---

## Module `pennylane/templates/embeddings/displacement.py`

Contains the ``DisplacementEmbedding`` template.

## `DisplacementEmbedding`

```python
class DisplacementEmbedding(Operation)
```

Encodes :math:`N` features into the displacement amplitudes :math:`r` or phases :math:`\phi` of :math:`M` modes,
where :math:`N\leq M`.

The mathematical definition of the displacement gate is given by the operator

.. math::
        D(\alpha) = \exp(r (e^{i\phi}\ad -e^{-i\phi}\a)),

where :math:`\a` and :math:`\ad` are the bosonic creation and annihilation operators.

``features`` has to be an array of at most ``len(wires)`` floats. If there are fewer entries in
``features`` than wires, the circuit does not apply the remaining displacement gates.

Args:
    features (tensor_like): tensor of features
    wires (Any or Iterable[Any]): wires that the template acts on
    method (str): ``'phase'`` encodes the input into the phase of single-mode displacement, while
        ``'amplitude'`` uses the amplitude
    c (float): value of the phase of all displacement gates if ``execution='amplitude'``, or
        the amplitude of all displacement gates if ``execution='phase'``

Raises:
    ValueError: if inputs do not have the correct format

Example:

    Depending on the ``method`` argument, the feature vector will be encoded in the phase or the amplitude.
    The argument ``c`` will define the value of the other quantity.
    The default values are :math:`0.1` for ``c`` and ``'amplitude'`` for ``method``.

    .. code-block:: python

        dev = qp.device('default.gaussian', wires=3)

        @qp.qnode(dev)
        def circuit(feature_vector):
            qp.DisplacementEmbedding(features=feature_vector, wires=range(3))
            qp.QuadraticPhase(0.1, wires=1)
            return qp.expval(qp.NumberOperator(wires=1))

        X = [1, 2, 3]

    >>> print(circuit(X))
        4.1215690638748494

    And, the resulting circuit is:

    >>> print(qp.draw(circuit, show_matrices=False)(X))
    0: ─╭DisplacementEmbedding(M0)──────────┤
    1: ─├DisplacementEmbedding(M0)──P(0.10)─┤  <n>
    2: ─╰DisplacementEmbedding(M0)──────────┤

    Using different parameters:

    .. code-block:: python

        dev = qp.device('default.gaussian', wires=3)

        @qp.qnode(dev)
        def circuit(feature_vector):
            qp.DisplacementEmbedding(features=feature_vector, wires=range(3), method='phase', c=0.5)
            qp.QuadraticPhase(0.1, wires=1)
            return qp.expval(qp.NumberOperator(wires=1))

        X = [1, 2, 3]

    >>> print(circuit(X))
        0.23401288309122226

    And, the resulting circuit is:

    >>> print(qp.draw(circuit, show_matrices=False)(X))
    0: ─╭DisplacementEmbedding(M0)──────────┤
    1: ─├DisplacementEmbedding(M0)──P(0.10)─┤  <n>
    2: ─╰DisplacementEmbedding(M0)──────────┤

### `compute_decomposition`

```python
def compute_decomposition(pars, wires)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.DisplacementEmbedding.decomposition`.

Args:
    pars (tensor_like): parameters extracted from features and constant
    wires (Any or Iterable[Any]): wires that the template acts on

Returns:
    list[.Operator]: decomposition of the operator

**Example**

>>> pars = torch.tensor([[1., 0.], [2., 0.]])
>>> qp.DisplacementEmbedding.compute_decomposition(pars, wires=[0, 1])
[Displacement(tensor(1.), tensor(0.), wires=[0]),
 Displacement(tensor(2.), tensor(0.), wires=[1])]
