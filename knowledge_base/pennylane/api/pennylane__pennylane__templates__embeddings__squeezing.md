---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/embeddings/squeezing.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/embeddings/squeezing.py
license: Apache-2.0
---

## Module `pennylane/templates/embeddings/squeezing.py`

Contains the SqueezingEmbedding template.

## `SqueezingEmbedding`

```python
class SqueezingEmbedding(Operation)
```

Encodes :math:`N` features into the squeezing amplitudes :math:`r \geq 0` or phases :math:`\phi \in [0, 2\pi)`
of :math:`M` modes, where :math:`N\leq M`.

The mathematical definition of the squeezing gate is given by the operator

.. math::

    S(z) = \exp\left(\frac{r}{2}\left(e^{-i\phi}\a^2 -e^{i\phi}{\ad}^{2} \right) \right),

where :math:`\a` and :math:`\ad` are the bosonic creation and annihilation operators.

``features`` has to be an iterable of at most ``len(wires)`` floats. If there are fewer entries in
``features`` than wires, the circuit does not apply the remaining squeezing gates.

Args:
    features (tensor_like): tensor of features
    wires (Any or Iterable[Any]): wires that the template acts on
    method (str): ``'phase'`` encodes the input into the phase of single-mode squeezing, while
        ``'amplitude'`` uses the amplitude
    c (float): value of the phase of all squeezing gates if ``execution='amplitude'``, or the
        amplitude of all squeezing gates if ``execution='phase'``

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
            qp.SqueezingEmbedding(features=feature_vector, wires=range(3))
            qp.QuadraticPhase(0.1, wires=1)
            return qp.expval(qp.NumberOperator(wires=1))

        X = [1, 2, 3]

    >>> print(circuit(X))
        13.018280763205285

    And, the resulting circuit is:

    >>> print(qp.draw(circuit, show_matrices=False)(X))
    0: ─╭SqueezingEmbedding(M0)──────────┤
    1: ─├SqueezingEmbedding(M0)──P(0.10)─┤  <n>
    2: ─╰SqueezingEmbedding(M0)──────────┤

    Using different parameters:

    .. code-block:: python

        dev = qp.device('default.gaussian', wires=3)

        @qp.qnode(dev)
        def circuit(feature_vector):
            qp.SqueezingEmbedding(features=feature_vector, wires=range(3), method='phase', c=0.5)
            qp.QuadraticPhase(0.1, wires=1)
            return qp.expval(qp.NumberOperator(wires=1))

        X = [1, 2, 3]

    >>> print(circuit(X))
        0.22319028857312428

    And, the resulting circuit is:

    >>> print(qp.draw(circuit, show_matrices=False)(X))
    0: ─╭SqueezingEmbedding(M0)──────────┤
    1: ─├SqueezingEmbedding(M0)──P(0.10)─┤  <n>
    2: ─╰SqueezingEmbedding(M0)──────────┤

### `compute_decomposition`

```python
def compute_decomposition(pars, wires)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.SqueezingEmbedding.decomposition`.

Args:
    pars (tensor_like): parameters extracted from features and constant
    wires (Any or Iterable[Any]): wires that the operator acts on

Returns:
    list[.Operator]: decomposition of the operator

**Example**

>>> pars = torch.tensor([[1., 0.], [2., 0.]])
>>> qp.SqueezingEmbedding.compute_decomposition(pars, wires=["a", "b"])
[Squeezing(tensor(1.), tensor(0.), wires=['a']),
Squeezing(tensor(2.), tensor(0.), wires=['b'])]
