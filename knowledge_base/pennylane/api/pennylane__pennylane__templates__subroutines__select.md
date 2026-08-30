---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/select.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/select.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/select.py`

Contains the Select template.

## `Select`

```python
class Select(Operation)
```

The ``Select`` operator, also known as multiplexer or multiplexed operation,
applies different operations depending on the state of designated control wires.

.. math:: Select|i\rangle \otimes |\psi\rangle = |i\rangle \otimes U_i |\psi\rangle

.. figure:: ../../../doc/_static/templates/subroutines/select.png
                :align: center
                :width: 70%
                :target: javascript:void(0);

If the applied operations :math:`\{U_i\}` are all single-qubit Pauli rotations about the
same axis, with the angle determined by the control wires, this is also called a
**uniformly controlled rotation** gate.

.. seealso:: :class:`~.SelectPauliRot`

Args:
    ops (list[Operator]): operations to apply
    control (Sequence[int]): the wires controlling which operation is applied.
        At least :math:`\lceil \log_2 K\rceil` wires are required for :math:`K` operations.
    work_wires (Union[Wires, Sequence[int], or int]): auxiliary wire(s) that may be
        utilized during the decomposition of the operator into native operations.
        For details, see the section on the unary iterator decomposition below.
    partial (bool): Whether the state on the wires provided in ``control`` are compatible with
        a `partial Select <https://pennylane.ai/compilation/partial-select>`__ decomposition.
        See the note below for details.
    id (str or None): String representing the operation (optional)

.. note::
    The position of the operation in the list determines which qubit state implements that
    operation. For example, when the qubit register is in the state :math:`|00\rangle`,
    we will apply ``ops[0]``. When the qubit register is in the state :math:`|10\rangle`,
    we will apply ``ops[2]``. To obtain the list position ``index`` for a given binary
    bitstring representing the control state we can use the following relationship:
    ``index = int(state_string, 2)``. For example, ``2 = int('10', 2)``.

.. note::
    Using ``partial=True`` assumes that the quantum state :math:`|\psi\rangle` on the
    ``control`` wires satisfies :math:`\langle j|\psi\rangle=0` for all :math:`j\in [K, 2^c)`,
    where :math:`K` is the number of operators (``len(ops)``) and :math:`c` is the number of
    control wires (``len(control)``).
    If you are unsure whether this condition is satisfied, set ``partial=False`` to guarantee
    a correct, even though more expensive, decomposition.
    For more details on the partial Select decomposition, see
    `its compilation page <https://pennylane.ai/compilation/partial-select>`__.

**Example**

>>> dev = qp.device('default.qubit', wires=4)
>>> ops = [qp.X(2), qp.X(3), qp.Y(2), qp.SWAP([2, 3])]
>>> @qp.qnode(dev)
... def circuit():
...     qp.Select(ops, control=[0,1])
...     return qp.state()
...
>>> print(qp.draw(circuit, level='device')())
0: ─╭○─╭○─╭●─╭●────┤ ╭State
1: ─├○─├●─├○─├●────┤ ├State
2: ─╰X─│──╰Y─├SWAP─┤ ├State
3: ────╰X────╰SWAP─┤ ╰State

If there are fewer operators to be applied than possible for the given number of control
wires, we call the ``Select`` operator a `partial Select <https://pennylane.ai/compilation/partial-select>`__.
In this case, the control structure can be simplified if the state on the control wires
does not have overlap with the unused computational basis states (:math:`|j\rangle` with
:math:`j>K-1`). Passing ``partial=True`` tells ``Select`` that this criterion is
satisfied, and allows the decomposition to make use of the simplification:

>>> ops = [qp.X(2), qp.X(3), qp.SWAP([2, 3])]
>>> @qp.qnode(dev)
... def circuit():
...     qp.Select(ops, control=[0, 1], partial=True)
...     return qp.state()
...
>>> print(qp.draw(circuit, level='device')())
0: ─╭○────╭●────┤ ╭State
1: ─├○─╭●─│─────┤ ├State
2: ─╰X─│──├SWAP─┤ ├State
3: ────╰X─╰SWAP─┤ ╰State

Note how the first (second) control node of the second (third) operator was skipped.

.. details::
    :title: Unary iterator decomposition

    Generically, ``Select`` is decomposed into one multi-controlled operator for each target
    operator. However, if auxiliary wires are available, a decomposition using a
    "unary iterator" can be applied. It was introduced by
    `Babbush et al. (2018) <https://arxiv.org/abs/1805.03662>`__.

    **Principle**

    Unary iteration leverages auxiliary wires to store intermediate values for reuse between
    the different multi-controlled operators, avoiding unnecessary recomputation.
    In addition to this caching functionality, unary iteration reduces the cost of the
    computation directly, because the involved reversible AND (or Toffoli) gates can be
    implemented at lower cost if the target is known to be in the :math:`|0\rangle` state
    (see :class:`~TemporaryAND`).

    For :math:`K` operators to be Select-applied, :math:`c=\lceil\log_2 K\rceil` control
    wires are required. Unary iteration demands an additional :math:`c-1` auxiliary wires.
    Below we first show an example for :math:`K` being a power of two, i.e., :math:`K=2^c`.
    Then we elaborate on implementation details for the case :math:`K<2^c`, which we call
    a *partial Select* operator.

    **Example**

    Assume that we want to Select-apply :math:`K=8=2^3` operators to two target wires,
    which requires :math:`c=\lceil \log_2 K\rceil=3` control wires. The generic
    decomposition for this takes the form

    .. code-block::

        0: ─╭○─────╭○─────╭○─────╭○─────╭●─────╭●─────╭●─────╭●─────┤
        1: ─├○─────├○─────├●─────├●─────├○─────├○─────├●─────├●─────┤
        2: ─├○─────├●─────├○─────├●─────├○─────├●─────├○─────├●─────┤
        3: ─├U(M0)─├U(M1)─├U(M2)─├U(M3)─├U(M4)─├U(M5)─├U(M6)─├U(M7)─┤
        4: ─╰U(M0)─╰U(M1)─╰U(M2)─╰U(M3)─╰U(M4)─╰U(M5)─╰U(M6)─╰U(M7)─┤.

    Unary iteration then uses :math:`c-1=2` auxiliary wires, denoted ``aux0`` and ``aux1``
    below, to first rewrite the control structure:

    .. code-block::

        0:    ─╭○───────○╮─╭○───────○╮─╭○───────○╮─╭○───────○╮─╭●───────●╮─╭●───────●╮─╭●───────●╮─╭●───────●╮─┤
        1:    ─├○───────○┤─├○───────○┤─├●───────●┤─├●───────●┤─├○───────○┤─├○───────○┤─├●───────●┤─├●───────●┤─┤
        aux0:  ╰─╭●───●╮─╯ ╰─╭●───●╮─╯ ╰─╭●───●╮─╯ ╰─╭●───●╮─╯ ╰─╭●───●╮─╯ ╰─╭●───●╮─╯ ╰─╭●───●╮─╯ ╰─╭●───●╮─╯ │
        2:    ───├○───○┤─────├●───●┤─────├○───○┤─────├●───●┤─────├○───○┤─────├●───●┤─────├○───○┤─────├●───●┤───┤
        aux1:    ╰─╭●──╯     ╰─╭●──╯     ╰─╭●──╯     ╰─╭●──╯     ╰─╭●──╯     ╰─╭●──╯     ╰─╭●──╯     ╰─╭●──╯   │
        3:    ─────├U(M0)──────├U(M1)──────├U(M2)──────├U(M3)──────├U(M4)──────├U(M5)──────├U(M6)──────├U(M7)──┤
        4:    ─────╰U(M0)──────╰U(M1)──────╰U(M2)──────╰U(M3)──────╰U(M4)──────╰U(M5)──────╰U(M6)──────╰U(M7)──┤

    Here, we used the symbols

    .. code-block::

        0: ─╭●──       ─●─╮─
        1: ─├●──  and  ─●─┤─
        2:  ╰───       ───╯

    for :class:`~.TemporaryAND` and its adjoint, respectively, and skipped drawing the
    auxiliary wires in areas where they are guaranteed to be in the state :math:`|0\rangle`.
    We will need three simplification rules for pairs of ``TemporaryAND`` gates:

    .. code-block::

        ─○─╮─╭○──   ──     ─○─╮─╭○──   ─╭○─       ─○─╮─╭●──   ─╭●────
        ─○─┤─├○── = ──,    ─○─┤─├●── = ─│──, and  ─●─┤─├○── = ─│──╭●─.
        ───╯ ╰───   ──     ───╯ ╰───   ─╰X─       ───╯ ╰───   ─╰X─╰X─

    Applying these simplifications reduces the computational cost of the ``Select``
    template:

    .. code-block::

        0:    ─╭○────────────────╭○──────────────────╭●─────────────────────╭●─────────────────●╮─┤
        1:    ─├○────────────────│───────────────────│──╭●──────────────────│──────────────────●┤─┤
        aux0:  ╰─╭●─────╭●────●╮─╰X─╭●─────╭●─────●╮─╰X─╰X─╭●─────╭●─────●╮─╰X─╭●─────╭●─────●╮─╯ │
        2:    ───├○─────│─────●┤────├○─────│──────●┤───────├○─────│──────●┤────├○─────│──────●┤───┤
        aux1:    ╰─╭●───╰X─╭●──╯    ╰─╭●───╰X──╭●──╯       ╰─╭●───╰X──╭●──╯    ╰─╭●───╰X──╭●──╯   │
        3:    ─────├U(M0)──├U(M1)─────├U(M2)───├U(M3)────────├U(M4)───├U(M5)─────├U(M6)───├U(M7)──┤
        4:    ─────╰U(M0)──╰U(M1)─────╰U(M2)───╰U(M3)────────╰U(M4)───╰U(M5)─────╰U(M6)───╰U(M7)──┤

    An additional cost reduction then results from the fact that the ``TemporaryAND``
    gate and its adjoint require four and zero :class:`~T` gates, respectively,
    in contrast to the seven ``T`` gates required by a decomposition of :class:`~Toffoli`.

    For general :math:`c` and :math:`K=2^c`, the decomposition takes a similar form, with
    alternating control and auxiliary wires.

    An implementation of the unary iterator is achieved in the following steps:
    We first define a recursive sub-circuit ``R``;
    given :math:`L` operators and :math:`2 \lceil\log_2(L)\rceil + 1` control and
    auxiliary wires, there are three cases that ``R`` distinguishes. First, if ``L>1``,
    it applies the circuit

    .. code-block::

        aux_j:   ╭R   ─╭●────╭●────●─╮─
        j+1:     ├R = ─├○────│─────●─┤─
        aux_j+1: ╰R    ╰──R──╰X─R────╯ ,

    where each label ``R`` symbolizes a call to ``R`` itself, on the next recursion level.
    These next-level calls use
    :math:`L' = 2^{\lceil\log_2(L)\rceil-1}` (i.e. half of :math:`L`, rounded up to the next
    power of two) and :math:`L-L'` (i.e. the rest) operators, respectively.

    Second, if ``L=1``, the single operator is applied, controlled on the first control wire.
    Finally, if ``L=0``, ``R`` does not apply any operators.

    With ``R`` defined, we are ready to outline the main circuit structure:

    #. Apply the left-most ``TemporaryAND`` controlled on qubits ``0`` and ``1``.
    #. Split the target operators into four "quarters" (often with varying sizes)
       and apply the first quarter using ``R``.
    #. Apply ``[X(0), CNOT([0, "aux0"]), X(0)]``.
    #. Apply the second quarter using ``R``.
    #. Apply ``[CNOT([0, "aux0"]), CNOT([1, "aux0"])]``.
    #. Apply the third quarter using ``R``.
    #. Apply ``[CNOT([0, "aux0"])]``.
    #. Apply the last quarter using ``R``.
    #. Apply the right-most ``adjoint(TemporaryAND)`` controlled on qubits ``0`` and ``1``.

    **Partial Select decomposition**

    The unary iterator decomposition of the ``Select`` template can be
    simplified further if both of the following criteria are met:

    #. There are fewer target operators than would maximally be possible for the given
       number of control wires, i.e. :math:`K<2^c`.

    #. The state :math:`|\psi\rangle` of the control wires satisfies
       :math:`\langle j | \psi\rangle=0` for all computational basis states with :math:`j\geq K`.

    We do not derive this reduction here but discuss the modifications to the implementation
    above that result from it.

    Given :math:`K=2^c-b` operators, where :math:`c` is defined as above and we
    have :math:`0\leq b<2^{c-1}`, the nine steps above are modified into one of three variants.
    In each variant, the first :math:`2^{c-1}` operators are applied in two equal portions,
    containing :math:`2^{c-2}` operators each.
    After this, :math:`\ell=2^{c-1} -b` operators remain and the three circuit variants are
    distinguished, based on :math:`\ell`:

    - if :math:`\ell \geq 2^{c-2}`, the following, rather generic, circuit is applied:

      .. code-block::

          0:    ─╭○─────╭○─────╭●────────╭●─────●─╮─
          1:    ─├○─────│──────│──╭●─────│──────●─┤─
          aux0:  ╰──╭R──╰X─╭R──╰X─╰X─╭R──╰X─╭R────╯
          2:    ────├R─────├R────────├R─────├R──────
          aux1:     ╰R     ╰R        ╰R     ╰R      .

      Here, each operator with three ``R`` labels symbolizes a call to ``R``. The first
      call in the second half applies :math:`2^{\lceil\log_2(\ell)\rceil-1}` operators.
      Note that this case is triggered if :math:`K` is larger than or equal to
      :math:`\tfrac{3}{4}` of the maximal capacity for :math:`c` control wires.
      Also note how the two middle ``TemporaryAND`` gates were merged into two CNOTs,
      like for the non-partial Select operator.

    - if :math:`1<\ell < 2^{c-2}`, the following circuit is applied:

      .. code-block::

          0:    ─╭○─────╭○─────○─╮╭●─────╭●─────●─╮─
          1:    ─├○─────│──────●─┤│──────│────────│─
          aux0:  ╰──╭R──╰X─╭R────╯│      │        │
          2:    ────├R─────├R─────├○─────│──────●─┤─
          aux1:     ╰R     ╰R     ╰───R──╰X──R────╯

      where the second half may skip more than one control and auxiliary wire each.
      In this diagram, both the operators with three and one ``R`` labels represent calls to
      ``R``, with single-label instances applying fewer operators.
      The first call to ``R`` in the second half applies :math:`2^{\lceil\log_2(\ell)\rceil-1}`
      operators. The middle elbows act on distinct wire triples and can not be merged as
      above.

    - if :math:`\ell=1`, the following circuit is applied:

      .. code-block::

          0:    ─╭○─────╭○─────○─╮╭●──
          1:    ─├○─────│──────●─┤│───
          aux0:  ╰──╭R──╰X─╭R────╯│───
          2:    ────├R─────├R─────│───
          aux1:     ╰R     ╰R     ╰U  .

      Here, the three connected ``R`` labels symbolize a call to ``R`` and
      apply :math:`2^{c-2}` operators each.
      The controlled gate on the right applies the single remaining operator.

### `__copy__`

```python
def __copy__(self)
```

Copy this op

### `data`

```python
def data(self)
```

Create data property

### `data`

```python
def data(self, new_data)
```

Set the data property

### `decomposition`

```python
def decomposition(self)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n

A ``DecompositionUndefinedError`` is raised if no representation by decomposition is defined.

.. seealso:: :meth:`~.Operator.compute_decomposition`.

Returns:
    list[Operator]: decomposition of the operator

**Example**

>>> ops = [qp.X(2), qp.X(3), qp.Y(2), qp.SWAP([2,3])]
>>> op = qp.Select(ops, control=[0,1])
>>> from pprint import pprint
>>> pprint(op.decomposition())
[MultiControlledX(wires=[0, 1, 2], control_values=[False, False]),
MultiControlledX(wires=[0, 1, 3], control_values=[False, True]),
Controlled(Y(2), control_wires=[0, 1], control_values=[True, False]),
Controlled(SWAP(wires=[2, 3]), control_wires=[0, 1])]

### `compute_decomposition`

```python
def compute_decomposition(ops, control, partial: bool=False, work_wires=None)
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

.. note::

    Operations making up the decomposition should be queued within the
    ``compute_decomposition`` method.

.. seealso:: :meth:`~.Operator.decomposition`.

Args:
    ops (list[Operator]): operations to apply
    control (Sequence[int]): the wires controlling which operation is applied

Returns:
    list[Operator]: decomposition of the operator

**Example**

>>> ops = [qp.X(2), qp.X(3), qp.Y(2), qp.SWAP([2,3])]
>>> decomp = qp.Select.compute_decomposition(ops, control=[0,1])
>>> from pprint import pprint
>>> pprint(decomp)
[MultiControlledX(wires=[0, 1, 2], control_values=[False, False]),
MultiControlledX(wires=[0, 1, 3], control_values=[False, True]),
Controlled(Y(2), control_wires=[0, 1], control_values=[True, False]),
Controlled(SWAP(wires=[2, 3]), control_wires=[0, 1])]

### `ops`

```python
def ops(self)
```

Operations to be applied.

### `control`

```python
def control(self)
```

The control wires.

### `target_wires`

```python
def target_wires(self)
```

The wires of the target operators.

### `work_wires`

```python
def work_wires(self)
```

The work wires of the Select template.

### `wires`

```python
def wires(self)
```

All wires involved in the operation.

### `partial`

```python
def partial(self)
```

Operations to be applied.
