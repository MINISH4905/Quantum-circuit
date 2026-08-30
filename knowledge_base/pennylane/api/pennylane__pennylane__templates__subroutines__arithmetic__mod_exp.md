---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/arithmetic/mod_exp.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/arithmetic/mod_exp.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/arithmetic/mod_exp.py`

Contains the ModExp template.

## `ModExp`

```python
class ModExp(Operation)
```

Performs the out-place modular exponentiation operation.

This operator performs the modular exponentiation of the integer :math:`base` to the power
:math:`x` modulo :math:`mod` in the computational basis:

.. math::

    \text{ModExp}(base,mod) |x \rangle |b \rangle = |x \rangle |b \cdot base^x \; \text{mod} \; mod \rangle,

The implementation is based on the quantum Fourier transform method presented in
`arXiv:2311.08555 <https://arxiv.org/abs/2311.08555>`_.

.. note::

    To obtain the correct result, :math:`x` must be smaller than :math:`mod`.
    Also, it is required that :math:`base` has a modular inverse, :math:`base^{-1}`, with respect to :math:`mod`.
    That means :math:`base \cdot base^{-1}` modulo :math:`mod` is equal to 1, which will only be possible if :math:`base`
    and :math:`mod` are coprime.

.. seealso:: :class:`~.Multiplier`.

Args:
    x_wires (Sequence[int]): the wires that store the integer :math:`x`
    output_wires (Sequence[int]): the wires that store the operator result. These wires also encode :math:`b`.
    base (int): integer that needs to be exponentiated
    mod (int): the modulo for performing the exponentiation. If not provided, it will be set to its maximum value, :math:`2^{\text{len(output_wires)}}`
    work_wires (Sequence[int]): the auxiliary wires to use for the exponentiation. If
        :math:`mod=2^{\text{len(output_wires)}}`, the number of auxiliary wires must be ``len(output_wires)``. Otherwise
        ``len(output_wires) + 2`` auxiliary wires are needed. Defaults to empty tuple.

**Example**

This example performs the exponentiation of :math:`base=2` to the power :math:`x=3` modulo :math:`mod=7`.

.. code-block:: python

    x, b = 3, 1
    base = 2
    mod = 7

    x_wires = [0, 1]
    output_wires = [2, 3, 4]
    work_wires = [5, 6, 7, 8, 9]

    dev = qp.device("default.qubit")

    @qp.qnode(dev, shots=1)
    def circuit():
        qp.BasisEmbedding(x, wires = x_wires)
        qp.BasisEmbedding(b, wires = output_wires)
        qp.ModExp(x_wires, output_wires, base, mod, work_wires)
        return qp.sample(wires = output_wires)

>>> print(circuit())
[[0 0 1]]

The result :math:`[0 0 1]`, is the binary representation of
:math:`2^3 \; \text{modulo} \; 7 = 1`.

.. details::
    :title: Usage Details

    This template takes as input three different sets of wires.

    The first one is ``x_wires`` which is used
    to encode the integer :math:`x < mod` in the computational basis. Therefore, ``x_wires`` must contain at least
    :math:`\lceil \log_2(x)\rceil` wires to represent :math:`x`.

    The second one is ``output_wires`` which is used
    to encode the integer :math:`b \cdot base^x \; \text{mod} \; mod` in the computational basis. Therefore, at least
    :math:`\lceil \log_2(mod)\rceil` ``output_wires`` are required to represent :math:`b \cdot base^x \; \text{mod} \; mod`. Note that these wires can be initialized with any integer
    :math:`b`, but the most common choice is :math:`b=1` to obtain as a final result :math:`base^x \; \text{mod} \; mod`.

    The third set of wires is ``work_wires`` which consist of the auxiliary qubits used to perform the modular exponentiation operation.

    - If :math:`mod = 2^{\text{len(output_wires)}}`,  the length of ``work_wires`` must be equal to the length of ``output_wires``.

    - If :math:`mod \neq 2^{\text{len(output_wires)}}`, the length of ``work_wires`` must be ``len(output_wires) + 2``

    Note that the ``ModExp`` template allows us to perform modular exponentiation in the computational basis. However if one just wants to perform standard exponentiation (with no modulo),
    that would be equivalent to setting the modulo :math:`mod` to a large enough value to ensure that :math:`base^x < mod`.

    Also, to perform the out-place modular exponentiation operator it is required that :math:`base` has inverse, :math:`base^{-1} \; \text{mod} \; mod`. That means
    :math:`base \cdot base^{-1}` modulo :math:`mod` is equal to 1, which will only be possible if :math:`base` and
    :math:`mod` are coprime. In other words, :math:`base` and :math:`mod` should not have any common factors other than 1.

### `wires`

```python
def wires(self)
```

All wires involved in the operation.

### `compute_decomposition`

```python
def compute_decomposition(x_wires, output_wires: WiresLike, base, mod, work_wires: WiresLike)
```

Representation of the operator as a product of other operators.

Args:
    x_wires (Sequence[int]): the wires that store the integer :math:`x`
    output_wires (Sequence[int]): the wires that store the operator result. These wires also encode :math:`b`.
    base (int): integer that needs to be exponentiated
    mod (int): the modulo for performing the exponentiation. If not provided, it will be set to its maximum value, :math:`2^{\text{len(output_wires)}}`
    work_wires (Sequence[int]): the auxiliary wires to use for the exponentiation. If
        :math:`mod=2^{\text{len(output_wires)}}`, the number of auxiliary wires must be ``len(output_wires)``. Otherwise
        ``len(output_wires) + 2`` auxiliary wires are needed.
Returns:
    list[.Operator]: Decomposition of the operator

**Example**

>>> qp.ModExp.compute_decomposition(x_wires=[0,1], output_wires=[2,3,4], base=3, mod=8, work_wires=[5,6,7,8,9])
[ControlledSequence(Multiplier(wires=[2, 3, 4, 5, 6, 7, 8, 9]), control=[0, 1])]
