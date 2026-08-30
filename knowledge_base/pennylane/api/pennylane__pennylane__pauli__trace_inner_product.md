---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/pauli/trace_inner_product.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/pauli/trace_inner_product.py
license: Apache-2.0
---

## Module `pennylane/pauli/trace_inner_product.py`

Utility tools for dynamical Lie algebra functionality

## `trace_inner_product`

```python
def trace_inner_product(A: PauliSentence | Operator | TensorLike, B: PauliSentence | Operator | TensorLike)
```

Trace inner product :math:`\langle A, B \rangle = \text{tr}\left(A^\dagger B\right)/\text{dim}(A)` between two operators :math:`A` and :math:`B`.

If the inputs are ``np.ndarray``, leading `broadcasting <https://docs.pennylane.ai/en/stable/introduction/circuits.html#parameter-broadcasting-in-qnodes>`__ axes are supported for either or both
inputs.

 .. warning::

     Operator inputs are assumed to be Hermitian. In particular,
     sums of Pauli operators are assumed to have real-valued coefficients.
     We recommend to use matrix representations for non-Hermitian inputs.
     In case of non-Hermitian :class:`~PauliSentence` or :class:`Operator` inputs,
     the Hermitian conjugation needs to be done manually by inputting :math:`A^\dagger`.

 Args:
     A (Union[PauliSentence, Operator, TensorLike]): First operator
     B (Union[PauliSentence, Operator, TensorLike]): Second operator of the same type as ``A``

 Returns:
     Union[float, TensorLike]: Result is either a single float or an array of floats (in batches of the broadcasting dimension).

 **Example**

 >>> from pennylane.pauli import trace_inner_product
 >>> trace_inner_product(qp.X(0) + qp.Y(0), qp.Y(0) + qp.Z(0))
 1.0

 If both operators are arrays, a leading batch dimension is broadcasted.

 >>> batch = 10
 >>> ops1 = np.random.rand(batch, 16, 16)
 >>> op2 = np.random.rand(16, 16)
 >>> trace_inner_product(ops1, op2).shape
 (10,)
 >>> trace_inner_product(op2, ops1).shape
 (10,)

 We can also have both arguments broadcasted.

 >>> trace_inner_product(ops1, ops1).shape
 (10, 10)

 .. details::
     :title: Usage Details

     :class:`~PauliSentence` and :class:`~Operator` inputs are assumed to be Hermitian. In particular,
     the input ``A`` is not conjugated when operators are used. To get correct results, we can either use
     the matrix representation or manually conjugate the operator.

     >>> A = qp.X(0) - 1j * qp.Y(0)
     >>> Ad = qp.X(0) + 1j * qp.Y(0)
     >>> B = qp.X(0) + 1j * qp.Y(0)
     >>> print(trace_inner_product(Ad, B) == trace_inner_product(qp.matrix(A), qp.matrix(B)))
     True
