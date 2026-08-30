---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/arithmetic/adder.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/arithmetic/adder.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/arithmetic/adder.py`

Contains the Adder template.

## `Adder`

```python
class Adder(Operation)
```

Performs the in-place modular addition operation.

This operator performs the modular addition by an integer :math:`k` modulo :math:`mod` in the
computational basis:

.. math::

    \text{Adder}(k, mod) |x \rangle = | x+k \; \text{mod} \; mod \rangle.

The implementation is based on the quantum Fourier transform method presented in
`arXiv:2311.08555 <https://arxiv.org/abs/2311.08555>`_.

.. note::

    To obtain the correct result, :math:`x` must be smaller than :math:`mod`.

.. seealso:: :class:`~.PhaseAdder` and :class:`~.OutAdder`.

Args:
    k (int): the number that needs to be added
    x_wires (Sequence[int]): the wires the operation acts on. The number of wires must be enough
        for encoding `x` in the computational basis. The number of wires also limits the
        maximum value for `mod`.
    mod (int): the modulo for performing the addition. If not provided, it will be set to its maximum value, :math:`2^{\text{len(x_wires)}}`.
    work_wires (Sequence[int]): the auxiliary wires to use for the addition. The
        work wires are not needed if :math:`mod=2^{\text{len(x_wires)}}`, otherwise two work wires
        should be provided. Defaults to empty tuple.

**Example**

This example computes the sum of two integers :math:`x=8` and :math:`k=5` modulo :math:`mod=15`.

.. code-block:: python

    x = 8
    k = 5
    mod = 15

    x_wires =[0,1,2,3]
    work_wires=[4,5]

    dev = qp.device("default.qubit")
    @qp.qnode(dev, shots=1)
    def circuit():
        qp.BasisEmbedding(x, wires=x_wires)
        qp.Adder(k, x_wires, mod, work_wires)
        return qp.sample(wires=x_wires)

>>> print(circuit())
[[1 1 0 1]]

The result, :math:`[[1 1 0 1]]`, is the binary representation of
:math:`8 + 5  \; \text{modulo} \; 15 = 13`.

.. details::
    :title: Usage Details

    This template takes as input two different sets of wires.

    The first one is ``x_wires``, used to encode the integer :math:`x < \text{mod}` in the Fourier basis.
    To represent :math:`x`, ``x_wires`` must include at least :math:`\lceil \log_2(x) \rceil` wires.
    After the modular addition, the result can be as large as :math:`\text{mod} - 1`,
    requiring at least :math:`\lceil \log_2(\text{mod}) \rceil` wires. Since :math:`x < \text{mod}`,
    :math:`\lceil \log_2(\text{mod}) \rceil` is a sufficient length for ``x_wires`` to cover all possible inputs and outputs.

    The second set of wires is ``work_wires`` which consist of the auxiliary qubits used to perform the modular addition operation.

    - If :math:`mod = 2^{\text{len(x_wires)}}`, there will be no need for ``work_wires``, hence ``work_wires=()``. This is the case by default.

    - If :math:`mod \neq 2^{\text{len(x_wires)}}`, two ``work_wires`` have to be provided.

    Note that the ``Adder`` template allows us to perform modular addition in the computational basis. However if one just wants to perform standard addition (with no modulo), that would be equivalent to setting
    the modulo :math:`mod` to a large enough value to ensure that :math:`x+k < mod`.

### `compute_decomposition`

```python
def compute_decomposition(k, x_wires: WiresLike, mod, work_wires: WiresLike)
```

Representation of the operator as a product of other operators.

Args:
    k (int): the number that needs to be added
    x_wires (Sequence[int]): the wires the operation acts on. The number of wires must be enough
        for encoding `x` in the computational basis. The number of wires also limits the
        maximum value for `mod`.
    mod (int): the modulo for performing the addition. If not provided, it will be set to its maximum value, :math:`2^{\text{len(x_wires)}}`.
    work_wires (Sequence[int]): the auxiliary wires to use for the addition. The
        work wires are not needed if :math:`mod=2^{\text{len(x_wires)}}`, otherwise two work wires
        should be provided.
Returns:
    list[.Operator]: Decomposition of the operator

**Example**

>>> qp.Adder.compute_decomposition(k=2, x_wires=[0,1,2], mod=8, work_wires=[3])
[(Adjoint(QFT(wires=[0, 1, 2]))) @ PhaseAdder(wires=[0, 1, 2]) @ QFT(wires=[0, 1, 2])]
