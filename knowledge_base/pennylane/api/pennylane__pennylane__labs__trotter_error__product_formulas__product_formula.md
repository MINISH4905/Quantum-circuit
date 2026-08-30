---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/trotter_error/product_formulas/product_formula.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/trotter_error/product_formulas/product_formula.py
license: Apache-2.0
---

## Module `pennylane/labs/trotter_error/product_formulas/product_formula.py`

The ProductFormula class

## `ProductFormula`

```python
class ProductFormula
```

Class for representing product formulas.

For a set of Hermitian operators :math:`H_1,\dots,H_n`
a product formula is any function in the form :math:`U(t) = \prod_{k=1}^n e^{it\alpha_k H_k}` with
:math:`\alpha_k \in \mathbb{R}`.

Args:
    terms (Sequence[Hashable] | Sequence[``ProductFormula``]): Either a list of labels for the
        Hermitian operators or a list of ``ProductFormula`` objcts. When a list of labels is given,
        the product formula returned is the product of exponentials of the lables. When a list of product
        formulas is given the product formula returned is the product of the given product formulas.
    coeffs: (Sequence[float]): A list of coefficients corresponding to the given terms. This argument
        is not needed when the terms are ``ProductFormula`` objects.
    exponent (float): Raises the product formula to the power of ``exponent``. Defaults to 1.0.
    label (str): Optional parameter used for pretty printing.

**Example**

This example uses :class:`~pennylane.labs.troter_error.ProductFormula` to build the fourth order
Troter-Suzuki formula on three fragments. First we build the second order formula.

>>> from pennylane.labs.trotter_error import ProductFormula
>>>
>>> frag_labels = ["A", "B", "C", "B", "A"]
>>> frag_coeffs = [1/2, 1/2, 1, 1/2, 1/2]
>>> second_order = ProductFormula(frag_labels, frag_coeffs)

Now we build the fourth order formula out of the second order formula using arithmetic operations.

>>> u = 1 / (4 - 4**(1/3))
>>> v = 1 - 4*u
>>>
>>> fourth_order = second_order(u)**2 @ second_order(v) @ second_order(u)**2

### `to_matrix`

```python
def to_matrix(self, fragments: dict[Hashable, np.ndarray]) -> np.ndarray
```

Returns a numpy representation of the product formula.

Args:
    fragments (Dict[Hashable, Fragment]): The matrix representations of the fragment labels.

**Example**


>>> import numpy as np
>>> from pennylane.labs.trotter_error import ProductFormula
>>>
>>> frag_labels = ["A", "B", "C", "B", "A"]
>>> frag_coeffs = [1/2, 1/2, 1, 1/2, 1/2]
>>> second_order = ProductFormula(frag_labels, frag_coeffs)
>>>
>>> np.random.seed(42)
>>> fragments = {
>>>     "A": np.random.random(size=(3, 3)),
>>>     "B": np.random.random(size=(3, 3)),
>>>     "C": np.random.random(size=(3, 3)),
>>> }
>>>
>>> second_order.to_matrix(fragments)
[[20.53683969 24.33566914 25.4931284 ]
 [12.50207018 15.44505726 15.01069493]
 [13.52951601 17.64888648 18.04980336]]

### `ordered_fragments`

```python
def ordered_fragments(self) -> dict[Hashable, int]
```

Return the fragment ordering used by the product formula.

**Example**

>>> from pennylane.labs.trotter_error import ProductFormula
>>>
>>> pf1 = ProductFormula(["A", "B", "C"], [1, 1, 1])
>>> pf2 = ProductFormula(["X", "Y", "Z"], [1, 1, 1])
>>>
>>> pf = pf1 @ pf2
>>>
>>> pf.ordered_fragments
{'A': 0, 'B': 1, 'C': 2, 'X': 3, 'Y': 4, 'Z': 5}

### `ordered_terms`

```python
def ordered_terms(self) -> dict[Hashable, int]
```

Return the term ordering used by the product formula.

**Example**

>>> from pennylane.labs.trotter_error import ProductFormula, bch_expansion
>>>
>>> frag_labels = ["A", "B", "C", "B", "A"]
>>> frag_coeffs = [1/2, 1/2, 1, 1/2, 1/2]
>>> second_order = ProductFormula(frag_labels, frag_coeffs, label="U")
>>>
>>> u = 1 / (4 - 4**(1/3))
>>> v = 1 - 4*u
>>>
>>> fourth_order = second_order(u)**2 @ second_order(v) @ second_order(u)**2
>>> fourth_order.ordered_terms
{U(0.4144907717943757)@U(-0.6579630871775028): 0, U(0.4144907717943757)**2.0: 1}
