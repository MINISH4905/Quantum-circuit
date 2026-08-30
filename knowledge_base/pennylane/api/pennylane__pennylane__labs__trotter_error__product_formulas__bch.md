---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/trotter_error/product_formulas/bch.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/trotter_error/product_formulas/bch.py
license: Apache-2.0
---

## Module `pennylane/labs/trotter_error/product_formulas/bch.py`

This file contains the BCH computation

## `bch_expansion`

```python
def bch_expansion(product_formula: ProductFormula, order: int) -> list[dict[tuple[Hashable], complex]]
```

Compute the Baker-Campbell-Hausdorff expansion of a :class:`~.pennylane.labs.trotter_error.ProductFormula` object.

Args:
    product_formula (ProductFormula): The :class:`~.pennylane.labs.trotter_error.ProductFormula` object whose BCH expansion will be computed.
    order (int): The maximum order of the expansion to return.
Returns:
    List[Dict[Tuple[Hashable], complex]]: A list of dictionaries. The ``ith`` dictionary contains the ``ith`` order commutators and their coefficients.

**Example**

In this example we compute the BCH expansion of the second order Trotter-Suzuki formula. The output is a list of dictionaries where each dictionary is indexed by
a tuple representing a right-nested commutator. For example, ``('A', 'A', 'B')`` represents the commutator :math:`[A, [A, B]]`.

>>> from pprint import pp
>>> from pennylane.labs.trotter_error import ProductFormula, bch_expansion
>>> frag_labels = ["A", "B", "C", "B", "A"]
>>> frag_coeffs = [1/2, 1/2, 1, 1/2, 1/2]
>>> second_order = ProductFormula(frag_labels, frag_coeffs)
>>> pp(bch_expansion(second_order, order=3))
[defaultdict(<class 'complex'>,
             {('A',): (1+0j),
              ('B',): (1+0j),
              ('C',): (1+0j)}),
 defaultdict(<class 'complex'>, {}),
 defaultdict(<class 'complex'>,
             {('A', 'A', 'B'): (-0.04166666666666667+0j),
              ('B', 'A', 'B'): (-0.08333333333333333+0j),
              ('C', 'A', 'B'): (-0.08333333333333334+0j),
              ('A', 'A', 'C'): (-0.04166666666666667+0j),
              ('B', 'A', 'C'): (-0.08333333333333334+0j),
              ('B', 'B', 'C'): (-0.04166666666666667+0j),
              ('C', 'A', 'C'): (-0.08333333333333333+0j),
              ('C', 'B', 'C'): (-0.08333333333333333+0j)})]
