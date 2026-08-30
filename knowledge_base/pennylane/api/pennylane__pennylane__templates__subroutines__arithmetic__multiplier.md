---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/arithmetic/multiplier.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/arithmetic/multiplier.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/arithmetic/multiplier.py`

Contains the Multiplier template.

## `Multiplier`

```python
class Multiplier(Operation)
```

Performs the in-place modular multiplication operation.

This operator performs the modular multiplication by an integer :math:`k` modulo :math:`mod` in
the computational basis:

.. math::

    \text{Multiplier}(k,mod) |x \rangle = | x \cdot k \; \text{mod} \; mod \rangle.

The implementation is based on the quantum Fourier transform method presented in
`arXiv:2311.08555 <https://arxiv.org/abs/2311.08555>`_.

.. note::

    To obtain the correct result, :math:`x` must be smaller than :math:`mod`. Also, it
    is required that :math:`k` has modular inverse :math:`k^{-1}` with respect to :math:`mod`. That means
    :math:`k \cdot k^{-1}` modulo :math:`mod` is equal to 1, which will only be possible if :math:`k` and
    :math:`mod` are coprime.

.. seealso:: :class:`~.PhaseAdder` and :class:`~.OutMultiplier`.

Args:
    k (int): the number that needs to be multiplied
    x_wires (Sequence[int]): the wires the operation acts on. The number of wires must be enough for encoding `x` in the computational basis. The number of wires also limits the maximum value for `mod`.
    mod (int): the modulo for performing the multiplication. If not provided, it will be set to its maximum value, :math:`2^{\text{len(x_wires)}}`.
    work_wires (Sequence[int]): the auxiliary wires to use for the multiplication. If :math:`mod=2^{\text{len(x_wires)}}`, the number of auxiliary wires must be ``len(x_wires)``. Otherwise ``len(x_wires) + 2`` auxiliary wires are needed.

**Example**

This example performs the multiplication of two integers :math:`x=3` and :math:`k=4` modulo :math:`mod=7`.

.. code-block:: python

    x = 3
    k = 4
    mod = 7

    x_wires = [0,1,2]
    work_wires = [3,4,5,6,7]

    dev = qp.device("default.qubit")

    @qp.qnode(dev, shots=1)
    def circuit():
        qp.BasisEmbedding(x, wires=x_wires)
        qp.Multiplier(k, x_wires, mod, work_wires)
        return qp.sample(wires=x_wires)

>>> print(circuit())
[[1 0 1]]

The result :math:`[1 0 1]`, is the binary representation of
:math:`3 \cdot 4 \; \text{modulo} \; 7 = 5`.

.. details::
    :title: Usage Details

    This template takes as input two different sets of wires.

    The first one is ``x_wires``, used to encode the integer :math:`x < \text{mod}` in the Fourier basis.
    To represent :math:`x`, ``x_wires`` must include at least :math:`\lceil \log_2(x) \rceil` wires.
    After the modular addition, the result can be as large as :math:`\text{mod} - 1`,
    requiring at least :math:`\lceil \log_2(\text{mod}) \rceil` wires. Since :math:`x < \text{mod}`,
    :math:`\lceil \log_2(\text{mod}) \rceil` is a sufficient length for ``x_wires`` to cover all possible inputs and outputs.

    The second set of wires is ``work_wires`` which consist of the auxiliary qubits used to perform the modular multiplication operation.

    - If :math:`mod = 2^{\text{len(x_wires)}}`, the length of ``work_wires`` must be equal to the length of ``x_wires``.

    - If :math:`mod \neq 2^{\text{len(x_wires)}}`, the length of ``work_wires`` must be ``len(x_wires) + 2``.

    Note that the ``Multiplier`` template allows us to perform modular multiplication in the computational basis. However if one just want to perform standard multiplication (with no modulo),
    that would be equivalent to setting the modulo :math:`mod` to a large enough value to ensure that :math:`x \cdot k < mod`.

    Also, to perform the in-place multiplication operator it is required that :math:`k` has inverse, :math:`k^{-1} \; \text{mod} \; mod`. That means
    :math:`k \cdot k^{-1}` modulo :math:`mod` is equal to 1, which will only be possible if :math:`k` and
    :math:`mod` are coprime. In other words, :math:`k` and :math:`mod` should not have any common factors other than 1.

### `wires`

```python
def wires(self)
```

All wires involved in the operation.

### `compute_decomposition`

```python
def compute_decomposition(k, x_wires: WiresLike, mod, work_wires: WiresLike)
```

Representation of the operator as a product of other operators.

Args:
    k (int): the number that needs to be multiplied
    x_wires (Sequence[int]): the wires the operation acts on. The number of wires must be enough for encoding `x` in the computational basis. The number of wires also limits the maximum value for `mod`.
    mod (int): the modulo for performing the multiplication. If not provided, it will be set to its maximum value, :math:`2^{\text{len(x_wires)}}`.
    work_wires (Sequence[int]): the auxiliary wires to use for the multiplication. If :math:`mod=2^{\text{len(x_wires)}}`, the number of auxiliary wires must be ``len(x_wires)``. Otherwise ``len(x_wires) + 2`` auxiliary wires are needed.
Returns:
    list[.Operator]: Decomposition of the operator

**Example**

>>> ops = qp.Multiplier.compute_decomposition(k=3, mod=8, x_wires=[0,1,2], work_wires=[3,4,5])
>>> from pprint import pprint
>>> pprint(ops)
[(Adjoint(QFT(wires=[3, 4, 5]))) @ (ControlledSequence(PhaseAdder(wires=[3, 4, 5]), control=[0, 1, 2])) @ QFT(wires=[3, 4, 5]),
SWAP(wires=[2, 5]) @ SWAP(wires=[1, 4]) @ SWAP(wires=[0, 3]),
(Adjoint(QFT(wires=[3, 4, 5]))) @ (Adjoint(ControlledSequence(PhaseAdder(wires=[3, 4, 5]), control=[0, 1, 2]))) @ QFT(wires=[3, 4, 5])]
