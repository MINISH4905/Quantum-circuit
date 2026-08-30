---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/dihedral/polynomial.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/dihedral/polynomial.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/dihedral/polynomial.py`

SpecialPolynomial class.

## `SpecialPolynomial`

```python
class SpecialPolynomial
```

Multivariate polynomial with special form.

Maximum degree 3, n Z_2 variables, coefficients in Z_8.

### `__init__`

```python
def __init__(self, n_vars)
```

Construct the zero polynomial on n_vars variables.

### `mul_monomial`

```python
def mul_monomial(self, indices)
```

Multiply by a monomial given by indices.

Returns the product.

### `__mul__`

```python
def __mul__(self, other)
```

Multiply two polynomials.

### `__rmul__`

```python
def __rmul__(self, other)
```

Right multiplication.

This operation is commutative.

### `__add__`

```python
def __add__(self, other)
```

Add two polynomials.

### `evaluate`

```python
def evaluate(self, xval)
```

Evaluate the multinomial at xval.

if xval is a length n z2 vector, return element of Z8.
if xval is a length n vector of multinomials, return
a multinomial. The multinomials must all be on n vars.

### `set_pj`

```python
def set_pj(self, indices)
```

Set to special form polynomial on subset of variables.

p_J(x) := sum_{a subseteq J,|a| neq 0} (-2)^{|a|-1}x^a

### `get_term`

```python
def get_term(self, indices)
```

Get the value of a term given the list of variables.

Example: indices = [] returns the constant
         indices = [0] returns the coefficient of x_0
         indices = [0,3] returns the coefficient of x_0x_3
         indices = [0,1,3] returns the coefficient of x_0x_1x_3

If len(indices) > 3 the method fails.
If the indices are out of bounds the method fails.
If the indices are not increasing the method fails.

### `set_term`

```python
def set_term(self, indices, value)
```

Set the value of a term given the list of variables.

Example: indices = [] returns the constant
         indices = [0] returns the coefficient of x_0
         indices = [0,3] returns the coefficient of x_0x_3
         indices = [0,1,3] returns the coefficient of x_0x_1x_3

If len(indices) > 3 the method fails.
If the indices are out of bounds the method fails.
If the indices are not increasing the method fails.
The value is reduced modulo 8.

### `key`

```python
def key(self)
```

Return a string representation.

### `__eq__`

```python
def __eq__(self, x)
```

Test equality.

### `__str__`

```python
def __str__(self)
```

Return formatted string representation.
