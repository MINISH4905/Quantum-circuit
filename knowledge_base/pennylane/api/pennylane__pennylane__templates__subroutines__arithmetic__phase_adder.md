---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/arithmetic/phase_adder.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/arithmetic/phase_adder.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/arithmetic/phase_adder.py`

Contains the PhaseAdder template.

## `PhaseAdder`

```python
class PhaseAdder(Operation)
```

Performs the in-place modular phase addition operation.

This operator performs the modular addition by an integer :math:`k` modulo :math:`mod` in the
Fourier basis:

.. math::

    \text{PhaseAdder}(k,mod) |\phi (x) \rangle = |\phi (x+k \; \text{mod} \; mod) \rangle,

where :math:`|\phi (x) \rangle` represents the :math:`| x \rangle` state in the Fourier basis,

.. math::

    \text{QFT} |x \rangle = |\phi (x) \rangle.

The implementation is based on the quantum Fourier transform method presented in
`arXiv:2311.08555 <https://arxiv.org/abs/2311.08555>`_.

.. note::

    To obtain the correct result, :math:`x` must be smaller than :math:`mod`. Also, when
    :math:`mod \neq 2^{\text{len(x_wires)}}`, :math:`x` must satisfy :math:`x < 2^{\text{len(x_wires)}-1}`,
    which means that one extra wire in ``x_wires`` is required.

.. seealso:: :class:`~.QFT` and :class:`~.Adder`.

Args:
    k (int): the number that needs to be added
    x_wires (Sequence[int]): the wires the operation acts on. The number of wires must be enough
        for a binary representation of the value being targeted, :math:`x`. In some cases an additional
        wire is needed, see usage details below. The number of wires also limits the maximum
        value for ``mod``.
    mod (int): the modulo for performing the addition. If not provided, it will be set to its maximum value, :math:`2^{\text{len(x_wires)}}`.
    work_wire (Sequence[int] or int): the auxiliary wire to use for the addition. Optional
        when ``mod`` is :math:`2^{\text{len(x_wires)}}`. Defaults to empty tuple. The work wire must
        be in the :math:`|0\rangle` state.

**Example**

This example computes the sum of two integers :math:`x=8` and :math:`k=5` modulo :math:`mod=15`.

.. code-block:: python

    x = 8
    k = 5
    mod = 15

    x_wires =[0,1,2,3]
    work_wire=[5]

    dev = qp.device("default.qubit")

    @qp.qnode(dev, shots=1)
    def circuit():
        qp.BasisEmbedding(x, wires=x_wires)
        qp.QFT(wires=x_wires)
        qp.PhaseAdder(k, x_wires, mod, work_wire)
        qp.adjoint(qp.QFT)(wires=x_wires)
        return qp.sample(wires=x_wires)

>>> print(circuit())
[[1 1 0 1]]

The result, :math:`[[1 1 0 1]]`, is the binary representation of
:math:`8 + 5  \; \text{modulo} \; 15 = 13`.

.. details::
    :title: Usage Details

    This template takes as input two different sets of wires.

    The first one is ``x_wires``, used to encode the integer :math:`x < \text{mod}` in the Fourier basis.
    To represent :math:`x`, at least :math:`\lceil \log_2(x) \rceil` wires are needed.
    After the modular addition, the result can be as large as :math:`\text{mod} - 1`,
    requiring at least :math:`\lceil \log_2(\text{mod}) \rceil` wires. Since :math:`x < \text{mod}`, a length of
    :math:`\lceil \log_2(\text{mod}) \rceil` is sufficient for ``x_wires`` to cover all possible inputs and
    outputs when :math:`mod = 2^{\text{len(x_wires)}}`.
    An exception occurs when :math:`mod \neq 2^{\text{len(x_wires)}}`. In that case one extra wire in ``x_wires`` will be needed to correctly perform the phase
    addition operation.

    The second set of wires is ``work_wire`` which consist of the auxiliary qubit used to perform the modular phase addition operation.

    - If :math:`mod = 2^{\text{len(x_wires)}}`, there will be no need for ``work_wire``, hence ``work_wire=()``. This is the case by default.

    - If :math:`mod \neq 2^{\text{len(x_wires)}}`, one ``work_wire`` has to be provided.

    Note that the ``PhaseAdder`` template allows us to perform modular addition in the Fourier basis. However if one just wants to perform standard addition (with no modulo),
    that would be equivalent to setting the modulo :math:`mod` to a large enough value to ensure that :math:`x+k < mod`.

### `compute_decomposition`

```python
def compute_decomposition(k, x_wires: WiresLike, mod, work_wire: WiresLike)
```

Representation of the operator as a product of other operators.

Args:
    k (int): the number that needs to be added
    x_wires (Sequence[int]): the wires the operation acts on. The number of wires must be enough
        for a binary representation of the value being targeted, :math:`x`. In some cases an additional
        wire is needed, see usage details below. The number of wires also limits the maximum
        value for `mod`.
    mod (int): the modulo for performing the addition. If not provided, it will be set to its maximum value, :math:`2^{\text{len(x_wires)}}`.
    work_wire (Sequence[int]): the auxiliary wire to use for the addition. Optional
        when `mod` is :math:`2^{len(x\_wires)}`.
Returns:
    list[.Operator]: Decomposition of the operator

**Example**

>>> qp.PhaseAdder.compute_decomposition(k = 2, x_wires = [0, 1, 2], mod = 8, work_wire = ())
[PhaseShift(6.28..., wires=[0]), PhaseShift(3.141..., wires=[1]), PhaseShift(1.57..., wires=[2])]
