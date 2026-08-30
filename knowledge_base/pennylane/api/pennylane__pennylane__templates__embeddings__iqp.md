---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/embeddings/iqp.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/embeddings/iqp.py
license: Apache-2.0
---

## Module `pennylane/templates/embeddings/iqp.py`

Contains the IQPEmbedding template.

## `IQPEmbedding`

```python
class IQPEmbedding(Operation)
```

Encodes :math:`n` features into :math:`n` qubits using diagonal gates of an IQP circuit.

The embedding has been proposed by `Havlicek et al. (2018) <https://arxiv.org/abs/1804.11326>`_.

The basic IQP circuit can be repeated by specifying ``n_repeats``. Repetitions can make the
embedding "richer" through interference.

.. warning::

    ``IQPEmbedding`` calls a circuit that involves non-trivial classical processing of the
    features. The ``features`` argument is therefore **not differentiable** when using the template, and
    gradients with respect to the features cannot be computed by PennyLane.

An IQP circuit is a quantum circuit of a block of Hadamards, followed by a block of gates that are
diagonal in the computational basis. Here, the diagonal gates are single-qubit ``RZ`` rotations, applied to each
qubit and encoding the :math:`n` features, followed by two-qubit ZZ entanglers,
:math:`e^{-i x_i x_j \sigma_z \otimes \sigma_z}`. The entangler applied to wires ``(wires[i], wires[j])``
encodes the product of features ``features[i]*features[j]``. The pattern in which the entanglers are
applied is either the default, or a custom pattern:

* If ``pattern`` is not specified, the default pattern will be used, in which the entangling gates connect all
  pairs of neighbours:

  |

  .. figure:: ../../_static/templates/embeddings/iqp.png
      :align: center
      :width: 50%
      :target: javascript:void(0);

  |

* Else, ``pattern`` is a list of wire pairs ``[[a, b], [c, d],...]``, applying the entangler
  on wires ``[a, b]``, ``[c, d]``, etc. For example, ``pattern = [[0, 1], [1, 2]]`` produces
  the following entangler pattern:

  |

  .. figure:: ../../_static/templates/embeddings/iqp_custom.png
      :align: center
      :width: 50%
      :target: javascript:void(0);

  |

  Since diagonal gates commute, the order of the entanglers does not change the result.

Args:
    features (tensor_like): tensor of features to encode
    wires (Any or Iterable[Any]): wires that the template acts on
    n_repeats (int): number of times the basic embedding is repeated
    pattern (list[int]): specifies the wires and features of the entanglers

Raises:
    ValueError: if inputs do not have the correct format

.. details::
    :title: Usage Details

    A typical usage example of the template is the following:

    .. code-block:: python

        import pennylane as qp

        dev = qp.device('default.qubit', wires=3)

        @qp.qnode(dev)
        def circuit(features):
            qp.IQPEmbedding(features, wires=range(3))
            return [qp.expval(qp.Z(w)) for w in range(3)]

        circuit([1., 2., 3.])

    **Repeating the embedding**

    The embedding can be repeated by specifying the ``n_repeats`` argument:

    .. code-block:: python

        @qp.qnode(dev)
        def circuit(features):
            qp.IQPEmbedding(features, wires=range(3), n_repeats=4)
            return [qp.expval(qp.Z(w)) for w in range(3)]

        circuit([1., 2., 3.])

    Every repetition uses exactly the same quantum circuit.

    **Using a custom entangler pattern**

    A custom entangler pattern can be used by specifying the ``pattern`` argument. A pattern has to be
    a nested list of dimension ``(K, 2)``, where ``K`` is the number of entanglers to apply.

    .. code-block:: python

        pattern = [[1, 2], [0, 2], [1, 0]]

        @qp.qnode(dev)
        def circuit(features):
            qp.IQPEmbedding(features, wires=range(3), pattern=pattern)
            return [qp.expval(qp.Z(w)) for w in range(3)]

        circuit([1., 2., 3.])

    Since diagonal gates commute, the order of the wire pairs has no effect on the result.

    .. code-block:: python

        from pennylane import numpy as np

        pattern1 = [[1, 2], [0, 2], [1, 0]]
        pattern2 = [[1, 0], [0, 2], [1, 2]]  # a reshuffling of pattern1

        @qp.qnode(dev)
        def circuit(features, pattern):
            qp.IQPEmbedding(features, wires=range(3), pattern=pattern, n_repeats=3)
            return [qp.expval(qp.Z(w)) for w in range(3)]

        res1 = circuit([1., 2., 3.], pattern=pattern1)
        res2 = circuit([1., 2., 3.], pattern=pattern2)

        assert np.allclose(res1, res2)

    **Non-consecutive wires**

    In principle, the user can also pass a non-consecutive wire list to the template.
    For single qubit gates, the i'th feature is applied to the i'th wire index (which may not be the i'th wire).
    For the entanglers, the product of i'th and j'th features is applied to the wire indices at the i'th and j'th
    position in ``wires``.

    For example, for ``wires=[2, 0, 1]`` the ``RZ`` block applies the first feature to wire 2,
    the second feature to wire 0, and the third feature to wire 1.

    Likewise, using the default pattern, the entangler block applies the product of the first and second
    feature to the wire pair ``[2, 0]``, the product of the second and third feature to ``[2, 1]``, and so
    forth.

### `compute_decomposition`

```python
def compute_decomposition(features, wires, n_repeats, pattern)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.IQPEmbedding.decomposition`.

Args:
    features (tensor_like): tensor of features to encode
    wires (Any or Iterable[Any]): wires that the template acts on

Returns:
    list[.Operator]: decomposition of the operator

**Example**

>>> features = torch.tensor([1., 2., 3.])
>>> pattern = [(0, 1), (0, 2), (1, 2)]
>>> qp.IQPEmbedding.compute_decomposition(features, wires=[0, 1, 2], n_repeats=2, pattern=pattern)
[H(0), RZ(tensor(1.), wires=[0]),
 H(1), RZ(tensor(2.), wires=[1]),
 H(2), RZ(tensor(3.), wires=[2]),
 MultiRZ(tensor(2.), wires=[0, 1]), MultiRZ(tensor(3.), wires=[0, 2]), MultiRZ(tensor(6.), wires=[1, 2]),
 H(0), RZ(tensor(1.), wires=[0]),
 H(1), RZ(tensor(2.), wires=[1]),
 H(2), RZ(tensor(3.), wires=[2]),
 MultiRZ(tensor(2.), wires=[0, 1]), MultiRZ(tensor(3.), wires=[0, 2]), MultiRZ(tensor(6.), wires=[1, 2])]
