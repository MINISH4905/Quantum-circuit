---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/bose/bosonic_mapping.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/bose/bosonic_mapping.py
license: Apache-2.0
---

## Module `pennylane/bose/bosonic_mapping.py`

This module contains functions to map bosonic operators to qubit operators.

## `binary_mapping`

```python
def binary_mapping(bose_operator: BoseWord | BoseSentence, n_states: int=2, ps: bool=False, wire_map: dict=None, tol: float=None)
```

Convert a bosonic operator to a qubit operator using the standard-binary mapping.

The mapping procedure is described in equations :math:`27-29` in `arXiv:1507.03271 <https://arxiv.org/pdf/1507.03271>`_.

Args:
    bose_operator (BoseWord, BoseSentence): the bosonic operator
    n_states (int): Maximum number of allowed bosonic states. Defaults to ``2``.
    ps (bool): Whether to return the result as a ``PauliSentence`` instead of an
        operator. Defaults to ``False``.
    wire_map (dict): A dictionary defining how to map the states of
        the Bose operator to qubit wires. If ``None``, integers used to
        label the bosonic states will be used as wire labels. Defaults to ``None``.
    tol (float): tolerance for discarding the imaginary part of the coefficients

Returns:
    Union[PauliSentence, Operator]: a linear combination of qubit operators

**Example**

>>> w = qp.BoseWord({(0, 0): "+"})
>>> qp.binary_mapping(w, n_states=4)
(
    0.6830127018922193 * X(0)
  + -0.1830127018922193 * (X(0) @ Z(1))
  + -0.6830127018922193j * Y(0)
  + 0.1830127018922193j * (Y(0) @ Z(1))
  + 0.3535533905932738 * (X(0) @ X(1))
  + -0.3535533905932738j * (X(0) @ Y(1))
  + 0.3535533905932738j * (Y(0) @ X(1))
  + (0.3535533905932738+0j) * (Y(0) @ Y(1))
)

## `unary_mapping`

```python
def unary_mapping(bose_operator: BoseWord | BoseSentence, n_states: int=2, ps: bool=False, wire_map: dict=None, tol: float=None)
```

Convert a bosonic operator to a qubit operator using the unary mapping.

The mapping procedure is described in `arXiv.1909.12847 <https://arxiv.org/abs/1909.12847>`_.

Args:
    bose_operator(BoseWord, BoseSentence): the bosonic operator
    n_states(int): Maximum number of allowed bosonic states. Defaults to ``2``.
    ps (bool): Whether to return the result as a ``PauliSentence`` instead of an
        operator. Defaults to ``False``.
    wire_map (dict): A dictionary defining how to map the states of
        the Bose operator to qubit wires. If ``None``, integers used to
        label the bosonic states will be used as wire labels. Defaults to ``None``.
    tol (float): tolerance for discarding the imaginary part of the coefficients

Returns:
    Union[PauliSentence, Operator]: a linear combination of qubit operators

**Example**

>>> w = qp.BoseWord({(0, 0): "+"})
>>> qp.unary_mapping(w, n_states=4)
(
    0.25 * (X(0) @ X(1))
  + -0.25j * (X(0) @ Y(1))
  + 0.25j * (Y(0) @ X(1))
  + (0.25+0j) * (Y(0) @ Y(1))
  + 0.3535533905932738 * (X(1) @ X(2))
  + -0.3535533905932738j * (X(1) @ Y(2))
  + 0.3535533905932738j * (Y(1) @ X(2))
  + (0.3535533905932738+0j) * (Y(1) @ Y(2))
  + 0.4330127018922193 * (X(2) @ X(3))
  + -0.4330127018922193j * (X(2) @ Y(3))
  + 0.4330127018922193j * (Y(2) @ X(3))
  + (0.4330127018922193+0j) * (Y(2) @ Y(3))
)

## `christiansen_mapping`

```python
def christiansen_mapping(bose_operator: BoseWord | BoseSentence, ps: bool=False, wire_map: dict=None, tol: float=None)
```

Convert a bosonic operator to a qubit operator using the Christiansen mapping.

This mapping assumes that the maximum number of allowed bosonic states is 2 and works only for
Christiansen bosons defined in `J. Chem. Phys. 120, 2140 (2004)
<https://pubs.aip.org/aip/jcp/article-abstract/120/5/2140/534128/A-second-quantization-formulation-of-multimode?redirectedFrom=fulltext>`_.
The bosonic creation and annihilation operators are mapped to the Pauli operators as

.. math::

    b^{\dagger}_0 =  \left (\frac{X_0 - iY_0}{2}  \right ), \:\: \text{...,} \:\:
    b^{\dagger}_n = \frac{X_n - iY_n}{2},

and

.. math::

    b_0 =  \left (\frac{X_0 + iY_0}{2}  \right ), \:\: \text{...,} \:\:
    b_n = \frac{X_n + iY_n}{2},

where :math:`X`, :math:`Y`, and :math:`Z` are the Pauli operators.

Args:
    bose_operator(BoseWord, BoseSentence): the bosonic operator
    ps (bool): Whether to return the result as a ``PauliSentence`` instead of an
        operator. Defaults to ``False``.
    wire_map (dict): A dictionary defining how to map the states of
        the Bose operator to qubit wires. If ``None``, integers used to
        label the bosonic states will be used as wire labels. Defaults to ``None``.
    tol (float): tolerance for discarding the imaginary part of the coefficients

Returns:
    Union[PauliSentence, Operator]: A linear combination of qubit operators.

**Example**

>>> w = qp.bose.BoseWord({(0,0):"+", (1,1): "-"})
>>> qp.christiansen_mapping(w)
(
    0.25 * (X(0) @ X(1))
  + 0.25j * (X(0) @ Y(1))
  + -0.25j * (Y(0) @ X(1))
  + (0.25+0j) * (Y(0) @ Y(1))
)
