---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/decompositions/grid_problems.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/decompositions/grid_problems.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/decompositions/grid_problems.py`

Contains 1-D and 2-D grid problem solving utilities.

## `Ellipse`

```python
class Ellipse
```

A class representing an ellipse as a positive definite matrix.

The ellipse is defined by the positive definite matrix :math:`D`:

.. math::
    D = \begin{bmatrix}
        a & b \\
        b & d
    \end{bmatrix}

The matrix is related to the equation of the ellipse :math:`ax^2 + 2bxy + dy^2 = 1` by:

.. math::
    a = \frac{\sin^2(\theta)}{m^2} + \frac{\cos^2(\theta)}{n^2}
    b = \cos(\theta) \sin(\theta) \left(\frac{1}{m^2} - \frac{1}{n^2}\right)
    d = \frac{\sin^2(\theta)}{m^2} + \frac{\cos^2(\theta)}{n^2}

where :math:`m` and :math:`n` are the lengths of the semi-major and semi-minor axes,
and :math:`\theta` is the angle of the ellipse.

Args:
    D (list[float, float, float]): The elements of the positive definite matrix.
    p (tuple[float, float]): The center of the ellipse.

.. note::
  We obtain corresponding matrix :math:`D^{\prime}` with determinant :math:`1` from :math:`D`.
  These are useful for computing key properties of ``EllipseState``, i.e., a pair of ellipses:
    - a = eλ^{-z}, d = eλ^z, b^2 = e^2 - 1; (Eq. 31, arXiv:1403.2975)
    - 2z * log(λ) = log(d / a) => z = 0.5 * log(d / a) / log(λ)

### `from_region`

```python
def from_region(cls, theta: float, epsilon: float, k: int=0)
```

Create an ellipse that bounds the region :math:`u | u \bullet z \geq 1 - \epsilon^2 / 2`,
with :math:`u \in \frac{1}{\sqrt{2}^k} \mathbb{Z}[\omega]` and :math`z = \exp{-i\theta / 2}`.

### `__repr__`

```python
def __repr__(self) -> str
```

Return a string representation of the ellipse.

### `__eq__`

```python
def __eq__(self, other: Ellipse) -> bool
```

Check if the ellipses are equal.

### `discriminant`

```python
def discriminant(self) -> float
```

Calculate the discriminant of the characteristic polynomial associated with the ellipse.

### `determinant`

```python
def determinant(self) -> float
```

Calculate the determinant of the ellipse.

### `positive_semi_definite`

```python
def positive_semi_definite(self) -> bool
```

Check if the ellipse is positive semi-definite.

### `uprightness`

```python
def uprightness(self) -> float
```

Calculate the uprightness of the ellipse (Eq. 32, arXiv:1403.2975).

### `b_from_uprightness`

```python
def b_from_uprightness(uprightness: float) -> float
```

Calculate the b value of the ellipse from its uprightness (Eq. 33, arXiv:1403.2975).

### `contains`

```python
def contains(self, x: float, y: float) -> bool
```

Check if the point (x, y) is inside the ellipse.

### `normalize`

```python
def normalize(self) -> tuple[Ellipse, float]
```

Normalize the ellipse to have a determinant of 1.

### `scale`

```python
def scale(self, scale: float) -> Ellipse
```

Scale the ellipse by a factor of scale.

### `x_points`

```python
def x_points(self, y: float) -> tuple[float, float]
```

Compute the x-points of the ellipse for a given y-value.

### `y_points`

```python
def y_points(self, x: float) -> tuple[float, float] | None
```

Compute the y-points of the ellipse for a given x-value.

### `bounding_box`

```python
def bounding_box(self) -> tuple[float, float, float, float]
```

Return the bounding box of the ellipse in the form [[x0, x1], [y0, y1]].

### `offset`

```python
def offset(self, offset: float) -> Ellipse
```

Return the ellipse shifted by the offset.

### `apply_grid_op`

```python
def apply_grid_op(self, grid_op: GridOp) -> Ellipse
```

Apply a grid operation :math:`G` to the ellipse :math:`E` as :math:`G^T E G`.

## `EllipseState`

```python
class EllipseState
```

A class representing a state as a pair of normalized ellipses.

This is based on the Definition A.1 of arXiv:1403.2975,
where the pair of ellipses are represented by real symmetric
positive semi-definite matrices of determinant :math:`1`.

Args:
    e1 (Ellipse): The first ellipse.
    e2 (Ellipse): The second ellipse.

### `__repr__`

```python
def __repr__(self) -> str
```

Return a string representation of the state.

### `skew`

```python
def skew(self) -> float
```

Calculate the skew of the state.

### `bias`

```python
def bias(self) -> float
```

Calculate the bias of the state.

### `skew_grid_op`

```python
def skew_grid_op(self) -> GridOp
```

Calculate the special grid operation for the state for reducing the skew.

### `apply_grid_op`

```python
def apply_grid_op(self, grid_op: GridOp) -> EllipseState
```

Apply a grid operation :math:`G` to the state.

### `apply_shift_op`

```python
def apply_shift_op(self) -> tuple[EllipseState, int]
```

Apply a shift operator to the state.

### `reduce_skew`

```python
def reduce_skew(self) -> tuple[GridOp, EllipseState]
```

Reduce the skew of the state.

This uses Step Lemma described in Appendix A.6 of arXiv:1403.2975.

Returns:
    tuple[GridOp, EllipseState]: A tuple containing the grid operation
        and the state with reduced skew.

## `GridOp`

```python
class GridOp
```

A class representing a grid operation on a 2D grid.

This follows Definition 5.10 and Lemma 5.11 of arXiv:1403.2975,
where a grid operator :math:`G` is described as a linear map,
which can be identifed with a :math:`2 \times 2` matrix as follows:

.. math::
    G = \begin{pmatrix} a & b \\ c & d \end{pmatrix}.

Each entry :math:`m` of the matrix is of the form :math:`m = m_0 + m_1 / \sqrt{2}`,
where :math:`m_0, m_1 \in \mathbb{Z}`. They satisfy :math:`a_0+b_0+c_0+d_0 \equiv 0 (\mod 2)`
and :math:`a_1 \equiv b_1 \equiv c_1 \equiv d_1 (\mod 2)`.

Args:
    a (tuple[int, int]): The a-coefficient of the grid operation.
    b (tuple[int, int]): The b-coefficient of the grid operation.
    c (tuple[int, int]): The c-coefficient of the grid operation.
    d (tuple[int, int]): The d-coefficient of the grid operation.
    check_valid (bool): If ``True``, the grid operation will be checked to be a valid
        grid operation. Default is ``True``.

.. note::
    The coefficients are given as tuples of the form (a_0, a_1), which corresponds
    to an element being :math:`a = a_0 + a_1 / \sqrt{2}`.

### `__init__`

```python
def __init__(self, a: tuple[int, int], b: tuple[int, int], c: tuple[int, int], d: tuple[int, int], check_valid: bool=True) -> None
```

Initialize the grid operation.

### `__repr__`

```python
def __repr__(self) -> str
```

Return a string representation of the grid operation.

### `__eq__`

```python
def __eq__(self, other: GridOp) -> bool
```

Check if the grid operations are equal.

### `__pow__`

```python
def __pow__(self, n: int) -> GridOp
```

Raise the grid operator to a power.

### `from_string`

```python
def from_string(cls, string: str) -> GridOp
```

Return the grid operation from a string.

Args:
    string: Supported string are: "I", "R", "A", "B", "K", "X", "Z".
        (Fig 6, arXiv:1403.2975).

Returns:
    GridOp: The grid operation corresponding to the string.

### `determinant`

```python
def determinant(self) -> tuple[float, float]
```

Calculate the determinant of the grid operation.

The determinant will be of form :math:`a + b / \sqrt{2}` and is given as tuple(a, b).

### `is_special`

```python
def is_special(self) -> bool
```

Check if the grid operation is special based on Proposition 5.13 of arXiv:1403.2975.

### `flatten`

```python
def flatten(self) -> list[float]
```

Flatten the grid operation based on description in Lemma 5.11 of arXiv:1403.2975.

### `inverse`

```python
def inverse(self) -> GridOp
```

Compute the inverse of the grid operation.

### `transpose`

```python
def transpose(self) -> GridOp
```

Transpose the grid operation.

### `adj2`

```python
def adj2(self) -> GridOp
```

Compute the sqrt(2)-conjugate of the grid operation.

### `apply_to_ellipse`

```python
def apply_to_ellipse(self, ellipse: Ellipse) -> Ellipse
```

Apply the grid operator to an ellipse based on Lemma A.4's proof in arXiv:1403.2975.

### `apply_to_state`

```python
def apply_to_state(self, state: EllipseState) -> tuple[Ellipse, Ellipse]
```

Apply the grid operator to a state based on Definition A.3 of arXiv:1403.2975.

### `apply_shift_op`

```python
def apply_shift_op(self, k: int) -> GridOp
```

Apply a shift operator to the grid operation based on Lemma A.9 of arXiv:1403.2975.

## `GridIterator`

```python
class GridIterator
```

Iterate over the solutions to the scaled grid problem.

This is based on the Section 5 of arXiv:1403.2975 and implements Proposition 5.22,
to enumerate all solutions to the scaled grid problem over the :math:`\epsilon`-region
and a unit disk.

It implements an ``__iter__`` method to iterate over the solutions efficiently as a generator.

Args:
    theta (float): The angle of the grid problem.
    epsilon (float): The epsilon of the grid problem.
    max_trials (int): The maximum number of iterations. Default is ``20``.

### `__repr__`

```python
def __repr__(self) -> str
```

Return a string representation of the grid iterator.

### `__iter__`

```python
def __iter__(self) -> Iterable[tuple[ZOmega, int]]
```

Iterate over the solutions to the scaled grid problem.

### `solve_two_dim_problem`

```python
def solve_two_dim_problem(self, state: EllipseState, num_points: int=1000) -> Iterable[ZOmega]
```

Solve the grid problem for the state(E1, E2).

The solutions :math:`u \in Z[\omega]` are such that :math:`u \in E1` and
:math:`u.adj2() \in E2`, where ``adj2`` is :math:`\sqrt(2)` conjugation.

This is based on Proposition 5.21 and Theorem 5.18 of arXiv:1403.2975.

Args:
    state: The state corresponding to the grid problem.
    num_points: The number of points to use to determine if the rectangle is wider
        than the other. Default is ``1000``.

Returns:
    Iterable[ZOmega]: The list of solutions to the two dimensional grid problem.

### `solve_upright_problem`

```python
def solve_upright_problem(self, state: EllipseState, bbox1: tuple[float], bbox2: tuple[float], num_b: list[bool], shift: ZOmega) -> Iterable[ZOmega]
```

Iterates over the solutions to the grid problem for two upright rectangles.

The solutions :math:`u \in Z[\omega]` are such that :math:`u \in A` and
:math:`u.adj2() \in B`, where ``adj2`` is :math:`\sqrt(2)` conjugation
and two rectangles :math:`A` and :math:`B`, form the subregions of
:math:`\mathbb{R}^2` of the form :math:`[x0, x1] \times [y0, y1]`.

Args:
    state (State): The state of the grid problem.
    bbox1 (tuple[float]): The bounding box of the first rectangle.
    bbox2 (tuple[float]): The bounding box of the second rectangle.
    num_b (list[bool]): Whether the second rectangle is wider than the first.
    shift (ZOmega): The shift operator.

Returns:
    Iterable[ZOmega]: The list of solutions to the upright grid problem for two rectangles.

### `bbox_grid_points`

```python
def bbox_grid_points(bbox: tuple[float, float, float, float]) -> int
```

Count the number of grid points in a bounding box.

This gives an estimation on the expected number of solution within
the bounding box. This is based on the Lemma 16 of arXiv:1212.6253.

Args:
    bbox (tuple[float, float, float, float]): The bounding box.

Returns:
    int: The number of grid points in the bounding box.

### `solve_one_dim_problem`

```python
def solve_one_dim_problem(x0: float, x1: float, y0: float, y1: float) -> Iterable[ZSqrtTwo]
```

Iterates the solutions to the one dimensional grid problem given intervals :math:`[x0, x1]` and :math:`[y0, y1]`.

Given two real intervals :math:`[x0, x1]` and :math:`[y0, y1]`
such that :math:`\sqrt{(x1 - x0)*(y1 - y0)} >= (1 + \sqrt(2))`,
iterates over all solutions of the form :math:`a + b\sqrt(2)` such that
:math:`a + b\sqrt(2) \in [x0, x1]` and :math:`a - b\sqrt(2) \in [y0, y1]`.

This is based on the Lemmas 16 and 17 of arXiv:1212.6253.

Args:
    x0 (float): The lower bound of the x-interval.
    x1 (float): The upper bound of the x-interval.
    y0 (float): The lower bound of the y-interval.
    y1 (float): The upper bound of the y-interval.

Returns:
    Iterable[ZSqrtTwo]: The list of solutions to the one dimensional grid problem.
