---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/state_preparations/multiplexer_state_prep.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/state_preparations/multiplexer_state_prep.py
license: Apache-2.0
---

## Module `pennylane/templates/state_preparations/multiplexer_state_prep.py`

Contains the MultiplexerStatePreparation template.

## `MultiplexerStatePreparation`

```python
class MultiplexerStatePreparation(Operation)
```

Prepares a quantum state using multiplexed rotations.

This operation implements the state preparation method described
in `arXiv:0208112 <https://arxiv.org/abs/quant-ph/0208112>`_.

Args:
    state_vector (tensor_like): The state vector of length :math:`2^n` to be prepared on
        :math:`n` wires.
    wires (Sequence[int]): The wires on which to prepare the state.

Raises:
    ValueError: If the length of the input state vector array is not :math:`2^n`, where
        :math:`n` is the number of wires, or if the norm of the input state is not unity.

**Example**

.. code-block:: python

    probs_vector = np.array([0.5, 0., 0.25, 0.25])

    dev = qp.device("default.qubit", wires = 2)

    wires = [0, 1]

    @qp.qnode(dev)
    def circuit():
        qp.MultiplexerStatePreparation(np.sqrt(probs_vector), wires)
        return qp.probs(wires)

.. code-block:: pycon

    >>> np.round(circuit(), 2)
    array([0.5 , 0.  , 0.25, 0.25])

.. seealso::

    :class:`~.SelectPauliRot` for a description of the main building blocks used to
    implement this operation.
