---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/qram.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/qram.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/qram.py`

Contains three different implementations of QRAM: BBQRAM, HybridQRAM, and SelectOnlyQRAM.

## `BBQRAM`

```python
class BBQRAM(Operation)
```

Bucket-brigade QRAM with explicit bus routing using 3 wires per node. Bucket-brigade QRAM
achieves an :math:`O(\log N)` complexity instead of the typical :math:`N`, where :math:`N` is
the size of the classical data register being queried. For more theoretical details on how this
algorithm works, please consult `arXiv:0708.1879 <https://arxiv.org/pdf/0708.1879>`__.

``BBQRAM`` encodes bitstrings, :math:`b_i`, corresponding to a given entry, :math:`i`, in a
data set:

.. math::
    \text{BBQRAM}|i\rangle|0\rangle = |i\rangle |b_i\rangle.

Args:
    data (TensorLike | Sequence[str]):
        The classical data as a 2-D array.  The shape must be ``(num_data, size_data)``, where ``num_data`` is
        :math:`2^{\texttt{len(control_wires)}}` and ``size_data = len(target_wires)``.
    control_wires (WiresLike):
        The register that stores the index for the entry of the classical data we want to
        access.
    target_wires (WiresLike):
        The register in which the classical data gets loaded. The size of this register must
        equal each bitstring length in ``data``.
    work_wires (WiresLike):
        The additional wires required to funnel the desired entry of ``data`` into the
        target register. The size of the ``work_wires`` register must be
        :math:`1 + 3 ((2^\texttt{len(control_wires)}) - 1)`. More specifically, the
        ``work_wires`` register includes the bus, direction, left port and right port wires in
        that order. Each node in the tree contains one address (direction), one left port and
        one right port wire. The single bus wire is used for address loading and data routing.
        For more information, consult `arXiv:0708.1879 <https://arxiv.org/pdf/0708.1879>`__.

Raises:
    ValueError: if the ``data`` are not provided, the ``data`` are of the wrong
        length, the ``target_wires`` are of the wrong size, or the ``work_wires`` register size is not exactly
        equal to :math:`1 + 3 ((2^\texttt{len(control_wires)}) - 1)`.

.. seealso::
    :class:`~.SelectOnlyQRAM`, :class:`~.HybridQRAM`, :class:`~.QROM`, :class:`~.QROMStatePreparation`

.. note::

    QRAM and QROM, though similar, have different applications and purposes. QRAM is intended
    for read-and-write capabilities, where the stored data can be loaded and changed. QROM is
    designed to only load stored data into a quantum register.

**Example:**

Consider the following example, where the classical data is a list of four bitstrings (each of
length 3):

.. code-block:: python

    data = [[0, 1, 0], [1, 1, 1], [1, 1, 0], [0, 0, 0]]
    bitstring_size = 3

The number of wires needed to store a length-4 array is 2, which means that the
``control_wires`` register must contain 2 wires. Additionally, this lets us specify the number
of work wires needed.

.. code-block:: python

    num_control_wires = 2 # len(bistrings) = 4 = 2**2
    num_work_wires = 1 + 3 * ((1 << num_control_wires) - 1) # 10

Now, we can define all three registers concretely and demonstrate ``BBQRAM`` in practice. In the
following circuit, we prepare the state :math:`\vert 2 \rangle = \vert 10 \rangle` on the
``control_wires``, which indicates that we would like to access the second (zero-indexed) entry of
``data`` (which is ``[1, 1, 0]``). The ``target_wires`` register should therefore store this
state after ``BBQRAM`` is applied.

.. code-block:: python

    import pennylane as qp
    reg = qp.registers(
        {
            "control": num_control_wires,
            "target": bitstring_size,
            "work_wires": num_work_wires
        }
    )

    dev = qp.device("default.qubit")
    @qp.qnode(dev)
    def bb_quantum():
        # prepare an address, e.g., |10> (index 2)
        qp.BasisEmbedding(2, wires=reg["control"])

        qp.BBQRAM(
            data,
            control_wires=reg["control"],
            target_wires=reg["target"],
            work_wires=reg["work_wires"],
        )
        return qp.probs(wires=reg["target"])

>>> import numpy as np
>>> print(np.round(bb_quantum()))  # doctest: +SKIP
[0. 0. 0. 0. 0. 0. 1. 0.]

Note that ``"110"`` in binary is equal to 6 in decimal, which is the position of the only
non-zero entry in the ``target_wires`` register.

## `HybridQRAM`

```python
class HybridQRAM(Operation)
```

A QRAM implementation that provides a width-depth tradeoff by combining behaviour from
:class:`~.SelectOnlyQRAM` and :class:`~.BBQRAM`. For more theoretical information, consult
`section 3 of arXiv:2306.03242 <https://arxiv.org/abs/2306.03242>`__.

``HybridQRAM`` encodes bitstrings, :math:`b_i`, corresponding to a given entry, :math:`i`, in a
data set:

.. math::
    \text{HybridQRAM}|i\rangle|0\rangle = |i\rangle |b_i\rangle.

With ``HybridQRAM``, an integer :math:`k` with :math:`0 ≤ k < n` must be chosen, where
:math:`N = 2^n` is the size of the classical data register being queried. The first :math:`k`
address bits are used in a procedure akin to what's involved in :class:`~.SelectOnlyQRAM`. The
remaining :math:`n-k` bits are used in a procedure akin to what's in :class:`~.BBQRAM`; instead
of a full-depth tree of size :math:`N` leaves, ``HybridQRAM`` builds a smaller tree of depth
:math:`n-k` (:math:`2^{n-k}` leaves) and reuses it :math:`2^k` times.

Args:
    data (TensorLike):
        The classical data as a sequence of bitstrings. The size of the classical data must be
        :math:`2^{\texttt{len(control_wires)}}`.
    control_wires (WiresLike):
        The register that stores the index for the entry of the classical data we want to
        access.
    target_wires (WiresLike):
        The register in which the classical data gets loaded. The size of this register must
        equal each bitstring length in ``data``.
    work_wires (WiresLike):
        The additional wires required to funnel the desired entry of ``data`` into the
        ``target_wires`` register. The ``work_wires`` register includes the signal, bus,
        direction, left port and right port wires in that order for a tree of depth
        :math:`(n-k)`. For more details, consult
        `section 3 of arXiv:2306.03242 <https://arxiv.org/abs/2306.03242>`__.
    k (int):
        The number of "select" bits taken from ``control_wires``.

Raises:
    ValueError: if the ``data`` are not provided, the ``data`` are of the wrong length, there are
        no ``control_wires``, ``k >= len(control_wires)``, the ``target_wires`` are of the wrong length, or the
        ``work_wires`` are of the wrong length.

.. seealso::
    :class:`~.SelectOnlyQRAM`, :class:`~.BBQRAM`, :class:`~.QROM`, :class:`~.QROMStatePreparation`

.. note::

    QRAM and QROM, though similar, have different applications and purposes. QRAM is intended
    for read-and-write capabilities, where the stored data can be loaded and changed. QROM is
    designed to only load stored data into a quantum register.

**Example:**

Consider the following example, where the classical data is a list of bitstrings (each of
length 3):

.. code-block:: python

    data = [[0, 1, 0], [1, 1, 1], [1, 1, 0], [0, 0, 0], [0, 1, 0], [1, 1, 1], [1, 1, 0], [0, 0, 0]]
    bitstring_size = 3

The ``control_wires`` are split via the value of :math:`k`, which allows us to leverage
:class:`~.SelectOnly` and :class:`~.BBQRAM` behaviour.

.. code-block:: python

    k = 2
    num_control_wires = 3
    num_work_wires = 1 + 1 + 3 * (1 << (num_control_wires - k) - 1)

    import pennylane as qp
    reg = qp.registers(
        {
            "control": num_control_wires,
            "target": bitstring_size,
            "work": num_work_wires
        }
    )

In the following circuit, we prepare the state :math:`\vert 2 \rangle = \vert 010 \rangle`
on the ``control_wires``, which indicates that we would like to access the second
(zero-indexed) entry of ``bitstrings`` (which is ``"110"``). The ``target_wires`` register
should therefore store this state after ``HybridQRAM`` is applied.

.. code-block:: python

    dev = qp.device("default.qubit")
    @qp.qnode(dev)
    def hybrid_qram():
        # prepare an address, e.g., |010> (index 2)
        qp.BasisEmbedding(2, wires=reg["control"])

        qp.HybridQRAM(
            data,
            control_wires=reg["control"],
            target_wires=reg["target"],
            work_wires=reg["work"],
            k=k
        )
        return qp.probs(wires=reg["target"])

>>> import numpy as np
>>> print(np.round(hybrid_qram()))
[0. 0. 0. 0. 0. 0. 1. 0.]

Note that ``"110"`` in binary is equal to 6 in decimal, which is the position of the only
non-zero entry in the ``target_wires`` register.

## `SelectOnlyQRAM`

```python
class SelectOnlyQRAM(Operation)
```

A QRAM implementation comprising :class:`~.MultiControlledX` gates on target (bus) wires,
controlled on all address wires. This implementation of QRAM requires :math:`O(\log N)` wires,
where :math:`N` is the size of the classical data register being queried. For more theoretical
information, consult `Figure 8 of arXiv:2012.05340 <https://arxiv.org/abs/2012.05340>`__.

``SelectOnlyQRAM`` encodes bitstrings, :math:`b_i`, corresponding to a given entry, :math:`i`,
in a data set:

.. math::
    \text{SelectOnlyQRAM}|i\rangle|0\rangle = |i\rangle |b_i\rangle.

Args:
    data (TensorLike | Sequence[str]):
        The classical data as a sequence of bitstrings. The size of the classical data must be
        :math:`2^{\texttt{len(select_wires)}+\texttt{len(control_wires)}}`.
    control_wires (WiresLike):
        The register that stores the index for the entry of the classical data we want to
        access.
    target_wires (WiresLike):
        The register in which the classical data gets loaded. The size of this register must
        equal each bitstring length in ``data``.
    select_wires (WiresLike, optional):
        Wires used to perform the selection.
    select_value (int or None, optional):
        If provided, only entries whose select bits match this value are loaded.
        The ``select_value`` must be an integer in :math:`[0, 2^{\texttt{len(select_wires)}}]`,
        and cannot be used if no ``select_wires`` are provided.
    id (str or None):
        Optional name for the operation.

Raises:
    ValueError: if the ``data`` are of the wrong length, a ``select_value`` is provided without
         ``select_wires``, or the ``select_value`` is greater than [0, (:math:`2^{\texttt{len(select_wires)}}`) - 1].

.. seealso::

    :class:`~.BBQRAM`, :class:`~.HybridQRAM`, :class:`~.QROM`, :class:`~.QROMStatePreparation`

.. note::

    QRAM and QROM, though similar, have different applications and purposes. QRAM is intended
    for read-and-write capabilities, where the stored data can be loaded and changed. QROM is
    designed to only load stored data into a quantum register.

**Example:**

Consider the following example, where the classical data is a list of bitstrings (each of length
3):

.. code-block:: python

    data = [[0, 1, 0], [1, 1, 1], [1, 1, 0], [0, 0, 0], [0, 1, 0], [1, 1, 1], [1, 1, 0], [0, 0, 0]]
    bitstring_size = 3

Given the number of bitstrings, the values of ``control_wires`` and ``select_wires`` can be
inferred. We can also provide a ``select_value`` to apply a filter such that only entries whose
select bits match this value are loaded. The full address that is accessed by the algorithm is
then the ``select_value`` prepended to the initial state of the control wires.

.. code-block:: python

    num_control_wires = 2
    num_select_wires = 1
    select_value = 0

    import pennylane as qp
    reg = qp.registers(
        {
            "control": num_control_wires,
            "target": bitstring_size,
            "select": num_select_wires
        }
    )

In the following circuit, we prepare the state :math:`\vert 2 \rangle = \vert 010 \rangle`
on the ``control_wires``, which indicates that we would like to access the second
(zero-indexed) entry of ``bitstrings`` (which is ``"110"``). The ``target_wires`` register
should therefore store this state after ``SelectOnlyQRAM`` is applied.

.. code-block:: python

    dev = qp.device("default.qubit")
    @qp.qnode(dev)
    def select_only_qram():
        # prepare an address, e.g., |010> (index 2)
        qp.BasisEmbedding(2, wires=reg["control"])

        qp.SelectOnlyQRAM(
            data,
            control_wires=reg["control"],
            target_wires=reg["target"],
            select_wires=reg["select"],
            select_value=select_value,
        )
        return qp.probs(wires=reg["target"])

>>> import numpy as np
>>> print(np.round(select_only_qram()))
[0. 0. 0. 0. 0. 0. 1. 0.]

Note that ``"110"`` in binary is equal to 6 in decimal, which is the position of the only
non-zero entry in the ``target_wires`` register.
