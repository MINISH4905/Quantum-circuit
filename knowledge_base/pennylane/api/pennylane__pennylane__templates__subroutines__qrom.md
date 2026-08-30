---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/qrom.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/qrom.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/qrom.py`

This submodule contains the template for QROM.

## `QROM`

```python
class QROM(Operation)
```

Applies the QROM operator.

This operator encodes bitstrings associated with indexes:

.. math::
    \text{QROM}|i\rangle|0\rangle = |i\rangle |b_i\rangle,

where :math:`b_i` is the bitstring associated with index :math:`i`.

Args:
    data (TensorLike): the data to be encoded
    control_wires (WiresLike):
        The register that stores the index for the entry of the classical data we want to
        read.
    target_wires (Sequence[int]): the wires where the bitstring is loaded
    work_wires (Sequence[int]): the auxiliary wires used for the computation
    clean (bool): if True, the work wires are not altered by operator, default is ``True``

.. seealso:: :class:`~.BBQRAM`, :class:`~.QROMStatePreparation`

.. note::
    QRAM and QROM, though similar, have different applications and purposes. QRAM is intended
    for read-and-write capabilities, where the stored data can be loaded and changed. QROM is
    designed to only load stored data into a quantum register.

**Example**

In this example, the QROM operator is applied to encode the third bitstring, associated with index 2, in the target wires.

.. code-block:: python

    # a list of bitstrings is defined
    data = [[0, 1, 0], [1, 1, 1], [1, 1, 0], [0, 0, 0]]

    dev = qp.device("default.qubit")

    @qp.qnode(dev, shots=1)
    def circuit():

        # the third index is encoded in the control wires [0, 1]
        qp.BasisEmbedding(2, wires = [0,1])

        qp.QROM(data = data,
                control_wires = [0,1],
                target_wires = [2,3,4],
                work_wires = [5,6,7])

        return qp.sample(wires = [2,3,4])

>>> print(circuit())
[[1 1 0]]


.. details::
    :title: Usage Details

    This template takes as input three different sets of wires. The first one is ``control_wires`` which is used
    to encode the desired index. Therefore, if we have :math:`m` bitstrings, we need
    at least :math:`\lceil \log_2(m)\rceil` control wires.

    The second set of wires is ``target_wires`` which stores the bitstrings.
    For instance, if the data is ``[0, 1, 1, 0]``, we will need four target wires. Internally,
    the bitstrings are encoded using the :class:`~.BasisEmbedding` template.


    The ``work_wires`` are auxiliary qubits used to reduce the gate complexity of the
    operator. These wires are dynamically partitioned into two sets: one for the
    :class:`~.Select` block and another to facilitate parallel data loading via a
    `SWAP network <https://pennylane.ai/compilation/swap-network>`__.

    The template determines the depth, :math:`\lambda` (a power of 2),
    based on the available ``work_wires``. Let :math:`b` be the length of the bitstrings.
    The number of wires allocated to the SWAP network is :math:`k_{swap} = b \cdot (\lambda - 1)`.
    The remaining wires, :math:`k_{select}`, are assigned to the :class:`~.Select` block.

    To ensure the decomposition is valid, the template guarantees that
    :math:`k_{select} \geq c - \log_2(\lambda) - 1`, where :math:`c` is the number of
    control wires, updating the depth if needed.

    The QROM template has two variants. The first one (``clean = False``) is based on [`arXiv:1812.00954 <https://arxiv.org/abs/1812.00954>`__] that alternates the state in the ``work_wires``.
    The second one (``clean = True``), based on [`arXiv:1902.02134 <https://arxiv.org/abs/1902.02134>`__], solves that issue by
    returning ``work_wires`` to their initial state. This technique can be applied when the ``work_wires`` are not
    initialized to zero.

### `__copy__`

```python
def __copy__(self)
```

Copy this op

### `control_wires`

```python
def control_wires(self)
```

The control wires.

### `target_wires`

```python
def target_wires(self)
```

The wires where the bitstring is loaded.

### `work_wires`

```python
def work_wires(self)
```

The wires where the index is specified.

### `wires`

```python
def wires(self)
```

All wires involved in the operation.

### `clean`

```python
def clean(self)
```

Boolean to select the version of QROM.
