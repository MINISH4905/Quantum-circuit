---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/state_preparations/qrom_state_prep.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/state_preparations/qrom_state_prep.py
license: Apache-2.0
---

## Module `pennylane/templates/state_preparations/qrom_state_prep.py`

Contains the QROMStatePreparation template.

## `QROMStatePreparation`

```python
class QROMStatePreparation(Operation)
```

Prepares a quantum state using Quantum Read-Only Memory (QROM).

This operation implements the state preparation method described
in `arXiv:0208112 <https://arxiv.org/abs/quant-ph/0208112>`_.

Args:
    state_vector (tensor_like): The state vector of length :math:`2^n` to be prepared on :math:`n` wires.
    wires (Sequence[int]): The wires on which to prepare the state.
    precision_wires (Sequence[int]): The wires allocated for storing the binary representations of the
        rotation angles utilized in the template.
    work_wires (Sequence[int], optional):  The work wires used for the QROM operations. Defaults to ``None``.

Raises:
    ValueError: If the length of the input state vector array is not :math:`2^n` where :math:`n` is an integer, or if
        its norm is not equal to one.

**Example**

.. code-block:: python

    import numpy as np

    probs_vector = np.array([0.5, 0., 0.25, 0.25])

    dev = qp.device("default.qubit", wires = 6)

    wires = qp.registers({"work_wires": 1, "prec_wires": 3, "state_wires": 2})

    @qp.qnode(dev)
    def circuit():
        qp.QROMStatePreparation(
            np.sqrt(probs_vector), wires["state_wires"], wires["prec_wires"], wires["work_wires"]
        )
        return qp.probs(wires["state_wires"])

.. code-block:: pycon

    >>> circuit()
    array([0.5 , 0.  , 0.25, 0.25])

.. seealso:: :class:`~.QROM`, :class:`~.BBQRAM`

.. details::
    :title: Usage Details

    The ``precision_wires`` are used as the target wires in the underlying QROM operations.
    The number of ``precision_wires`` determines the precision with which the rotation angles of the
    template are encoded. This means that the binary representation of the angle is truncated up to
    the :math:`m`-th digit, where :math:`m` is the number of precision wires given. See  Eq. 5 in
    `arXiv:0208112 <https://arxiv.org/abs/quant-ph/0208112>`_ for more details.
    The ``work_wires`` correspond to auxiliary qubits that can be specified in :class:`~.QROM` to
    reduce the overall resource requirements on the implementation.

### `compute_decomposition`

```python
def compute_decomposition(state_vector, wires, input_wires, precision_wires, work_wires)
```

Computes the decomposition operations for the given state vector.

Args:

    state_vector (tensor_like): The state vector to prepare.
    wires (Sequence[int]): The wires which the operator acts on.
    input_wires (Sequence[int]): The wires on which to prepare the state.
    precision_wires (Sequence[int]): The wires allocated for storing the binary representations of the
        rotation angles utilized in the template.
    work_wires (Sequence[int]):  The wires used as work wires for the QROM operations. Defaults to ``None``.

Returns:
    list: List of decomposition operations.
