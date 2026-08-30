---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/integrals.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/integrals.py
license: Apache-2.0
---

## Module `pennylane/qchem/integrals.py`

This module contains the functions needed for computing integrals over basis functions.

## `primitive_norm`

```python
def primitive_norm(l, alpha)
```

Compute the normalization constant for a primitive Gaussian function.

A Gaussian function centred at the position :math:`r = (x, y, z)` is defined as

.. math::

    G = x^{l_x} y^{l_y} z^{l_z} e^{-\alpha r^2},

where :math:`l = (l_x, l_y, l_z)` defines the angular momentum quantum number and :math:`\alpha`
is the Gaussian function exponent. The normalization constant for this function is computed as

.. math::

    N(l, \alpha) = (\frac{2\alpha}{\pi})^{3/4} \frac{(4 \alpha)^{(l_x + l_y + l_z)/2}}
    {(2l_x-1)!! (2l_y-1)!! (2l_z-1)!!)^{1/2}}.

Args:
    l (tuple[int]): angular momentum quantum number of the basis function
    alpha (array[float]): exponent of the primitive Gaussian function

Returns:
    array[float]: normalization coefficient

**Example**

>>> l = (0, 0, 0)
>>> alpha = np.array([3.425250914])
>>> n = primitive_norm(l, alpha)
>>> print(n)
array([1.79444183])

## `contracted_norm`

```python
def contracted_norm(l, alpha, a)
```

Compute the normalization constant for a contracted Gaussian function.

A contracted Gaussian function is defined as

.. math::

    \psi = a_1 G_1 + a_2 G_2 + a_3 G_3,

where :math:`a` denotes the contraction coefficients and :math:`G` is a primitive Gaussian function. The
normalization constant for this function is computed as

.. math::

    N(l, \alpha, a) = [\frac{\pi^{3/2}(2l_x-1)!! (2l_y-1)!! (2l_z-1)!!}{2^{l_x + l_y + l_z}}
    \sum_{i,j} \frac{a_i a_j}{(\alpha_i + \alpha_j)^{{l_x + l_y + l_z+3/2}}}]^{-1/2}

where :math:`l` and :math:`\alpha` denote the angular momentum quantum number and the exponent
of the Gaussian function, respectively.

Args:
    l (tuple[int]): angular momentum quantum number of the primitive Gaussian functions
    alpha (array[float]): exponents of the primitive Gaussian functions
    a (array[float]): coefficients of the contracted Gaussian functions

Returns:
    array[float]: normalization coefficient

**Example**

>>> l = (0, 0, 0)
>>> alpha = np.array([3.425250914, 0.6239137298, 0.168855404])
>>> a = np.array([1.79444183, 0.50032649, 0.18773546])
>>> n = contracted_norm(l, alpha, a)
>>> print(n)
0.39969026908800853

## `expansion`

```python
def expansion(la, lb, ra, rb, alpha, beta, t)
```

Compute Hermite Gaussian expansion coefficients recursively for two Gaussian functions.

An overlap distribution, which defines the product of two Gaussians, can be written as a Hermite
expansion as [`Helgaker (1995) p798 <https://www.worldscientific.com/doi/abs/10.1142/9789812832115_0001>`_]

.. math::

    \Omega_{ij} = \sum_{t=0}^{i+j} E_t^{ij} \Lambda_t,

where :math:`\Lambda` is a Hermite polynomial of degree :math:`t`, :math:`E` denotes the expansion
coefficients, :math:`\Omega_{ij} = G_i G_j`, and :math:`G` is a Gaussian function. The overlap
integral between two Gaussian functions can be simply computed by integrating over the overlap
distribution which requires obtaining the expansion coefficients. This can be done recursively
as [`Helgaker (1995) p799 <https://www.worldscientific.com/doi/abs/10.1142/9789812832115_0001>`_]

.. math::

    E_t^{i+1,j} = \frac{1}{2p} E_{t-1}^{ij} - \frac{qr}{\alpha} E_{t}^{ij} + (t+1) E_{t+1}^{ij},

and

.. math::

    E_t^{i,j+1} = \frac{1}{2p} E_{t-1}^{ij} + \frac{qr}{\beta} E_{t}^{ij} + (t+1) E_{t+1}^{ij},

where :math:`p = \alpha + \beta` and :math:`q = \alpha \beta / (\alpha + \beta)` are computed
from the Gaussian exponents :math:`\alpha, \beta` and the position :math:`r` is computed as
:math:`r = r_\alpha - r_\beta`. The starting coefficient is

.. math::

    E_0^{00} = e^{-qr^2},

and :math:`E_t^{ij} = 0` if :math:`t < 0` or :math:`t > (i+j)`.

Args:
    la (integer): angular momentum component for the first Gaussian function
    lb (integer): angular momentum component for the second Gaussian function
    ra (float): position component of the first Gaussian function
    rb (float): position component of the second Gaussian function
    alpha (array[float]): exponent of the first Gaussian function
    beta (array[float]): exponent of the second Gaussian function
    t (integer): number of nodes in the Hermite Gaussian

Returns:
    array[float]: expansion coefficients for each Gaussian combination

**Example**

>>> la, lb = 0, 0
>>> ra, rb = 0.0, 0.0
>>> alpha = np.array([3.42525091])
>>> beta =  np.array([3.42525091])
>>> t = 0
>>> c = expansion(la, lb, ra, rb, alpha, beta, t)
>>> c
array([1.])

## `gaussian_overlap`

```python
def gaussian_overlap(la, lb, ra, rb, alpha, beta)
```

Compute overlap integral for two primitive Gaussian functions.

The overlap integral between two Gaussian functions denoted by :math:`a` and :math:`b` can be
computed as [`Helgaker (1995) p803 <https://www.worldscientific.com/doi/abs/10.1142/9789812832115_0001>`_]:

.. math::

    S_{ab} = E^{ij} E^{kl} E^{mn} \left (\frac{\pi}{p}  \right )^{3/2},

where :math:`E` is a coefficient that can be computed recursively, :math:`i-n` are the angular
momentum quantum numbers corresponding to different Cartesian components and :math:`p` is
computed from the exponents of the two Gaussian functions as :math:`p = \alpha + \beta`.

Args:
    la (integer): angular momentum for the first Gaussian function
    lb (integer): angular momentum for the second Gaussian function
    ra (float): position vector of the first Gaussian function
    rb (float): position vector of the second Gaussian function
    alpha (array[float]): exponent of the first Gaussian function
    beta (array[float]): exponent of the second Gaussian function

Returns:
    array[float]: overlap integral between primitive Gaussian functions

**Example**

>>> la, lb = (0, 0, 0), (0, 0, 0)
>>> ra, rb = np.array([0., 0., 0.]), np.array([0., 0., 0.])
>>> alpha = np.array([np.pi/2])
>>> beta = np.array([np.pi/2])
>>> o = gaussian_overlap(la, lb, ra, rb, alpha, beta)
>>> o
array([1.])

## `overlap_integral`

```python
def overlap_integral(basis_a, basis_b, normalize=True)
```

Return a function that computes the overlap integral for two contracted Gaussian functions.

Args:
    basis_a (~qchem.basis_set.BasisFunction): first basis function
    basis_b (~qchem.basis_set.BasisFunction): second basis function
    normalize (bool): if True, the basis functions get normalized

Returns:
    function: function that computes the overlap integral

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]], requires_grad = False)
>>> mol = qp.qchem.Molecule(symbols, geometry)
>>> args = []
>>> overlap_integral(mol.basis_set[0], mol.basis_set[0])(*args)
1.0

## `hermite_moment`

```python
def hermite_moment(alpha, beta, t, order, r)
```

Compute the Hermite moment integral recursively.

The Hermite moment integral in one dimension is defined as

.. math::

    M_{t}^{e} = \int_{-\infty }^{+\infty} q^e \Lambda_t dq,

where :math:`e` is a positive integer, that is represented by the ``order`` argument,
:math:`q = x, y, z` is the coordinate at which the integral is evaluatedand and
:math:`\Lambda_t` is the :math:`t` component of the Hermite Gaussian function. The integral can
be computed recursively as
[`Helgaker (1995) p802 <https://www.worldscientific.com/doi/abs/10.1142/9789812832115_0001>`_]

.. math::

    M_{t}^{e+1} = t M_{t-1}^{e} + Q M_{t}^{e} + \frac{1}{2p} M_{t+1}^{e},

where :math:`Q` is the distance between the center of the Hermite Gaussian function and the
origin, at dimension :math:`q = x, y, z` of the Cartesian coordinates system.

This integral is zero for :math:`t > e` and the base case solution is

.. math::

    M_t^0 = \delta _{t0} \sqrt{\frac{\pi}{p}},

where :math:`p = \alpha + \beta` and :math:`\alpha, \beta` are the exponents of the Gaussian
functions that construct the Hermite Gaussian function :math:`\Lambda`.

Args:
    alpha (array[float]): exponent of the left Gaussian function
    beta (array[float]): exponent of the right Gaussian function
    t (integer): order of the Hermite Gaussian function
    order (integer): exponent of the position component
    r (array[float]): distance between the center of the Hermite Gaussian function and the origin

Returns:
    array[float]: the Hermite moment integral

**Example**

>>> alpha = np.array([3.42525091])
>>> beta = np.array([3.42525091])
>>> t = 0
>>> order = 1
>>> r = 1.5
>>> hermite_moment(alpha, beta, t, order, r)
array([1.0157925])

## `gaussian_moment`

```python
def gaussian_moment(li, lj, ri, rj, alpha, beta, order, r)
```

Compute the one-dimensional multipole moment integral for two primitive Gaussian functions.

The multipole moment integral in one dimension is defined as

.. math::

    S_{ij}^e = \left \langle G_i | q^e | G_j \right \rangle,

where :math:`G` is a Gaussian function at dimension :math:`q = x, y, z` of the Cartesian
coordinates system and :math:`e` is a positive integer that is represented by the ``order``
argument. The integrals can be evaluated as
[`Helgaker (1995) p803 <https://www.worldscientific.com/doi/abs/10.1142/9789812832115_0001>`_]

.. math::

    S_{ij}^e = \sum_{t=0}^{\mathrm{min}(i+j, \ e)} E_t^{ij} M_t^e,

where :math:`E` and :math:`M` are the Hermite Gaussian expansion coefficient and the Hermite
moment integral, respectively, that can be computed recursively.

Args:
    li (integer): angular momentum for the left Gaussian function
    lj (integer): angular momentum for the right Gaussian function
    ri (float): position of the left Gaussian function
    rj (float): position of the right Gaussian function
    alpha (array[float]): exponent of the left Gaussian function
    beta (array[float]): exponent of the right Gaussian function
    order (integer): exponent of the position component
    r (array[float]): distance between the center of the Hermite Gaussian function and origin

Returns:
    array[float]: one-dimensional multipole moment integral between primitive Gaussian functions

**Example**

>>> li, lj = 0, 0
>>> ri, rj = np.array([2.0]), np.array([2.0])
>>> alpha = np.array([3.42525091])
>>> beta = np.array([3.42525091])
>>> order = 1
>>> r = 1.5
>>> gaussian_moment(li, lj, ri, rj, alpha, beta, order, r)
array([1.0157925])

## `moment_integral`

```python
def moment_integral(basis_a, basis_b, order, idx, normalize=True)
```

Return a function that computes the multipole moment integral for two contracted Gaussians.

The multipole moment integral for two primitive Gaussian functions is computed as

.. math::

    S^e = \left \langle G_i | q^e | G_j \right \rangle
               \left \langle G_k | G_l \right \rangle
               \left \langle G_m | G_n \right \rangle,

where :math:`G_{i-n}` is a one-dimensional Gaussian function, :math:`q = x, y, z` is the
coordinate at which the integral is evaluated and :math:`e` is a positive integer that is
represented by the ``order`` argument. For contracted Gaussians, these integrals will be
computed over primitive Gaussians, multiplied by the normalized contraction coefficients and
finally summed over.

The ``idx`` argument determines the coordinate :math:`q` at which the integral is computed. It
can be :math:`0, 1, 2` for :math:`x, y, z` components, respectively.

Args:
    basis_a (~qchem.basis_set.BasisFunction): left basis function
    basis_b (~qchem.basis_set.BasisFunction): right basis function
    order (integer): exponent of the position component
    idx (integer): index determining the dimension of the multipole moment integral
    normalize (bool): if True, the basis functions get normalized

Returns:
    function: function that computes the multipole moment integral

**Example**

>>> symbols  = ['H', 'Li']
>>> geometry = np.array([[0.0, 0.0, 0.0], [2.0, 0.0, 0.0]], requires_grad = True)
>>> mol = qp.qchem.Molecule(symbols, geometry)
>>> args = [mol.r] # initial values of the differentiable parameters
>>> order, idx =  1, 0
>>> moment_integral(mol.basis_set[0], mol.basis_set[1], order, idx)(*args)
3.12846324e-01

## `gaussian_kinetic`

```python
def gaussian_kinetic(la, lb, ra, rb, alpha, beta)
```

Compute the kinetic integral for two primitive Gaussian functions.

The kinetic integral between two Gaussian functions denoted by :math:`a` and :math:`b` is
computed as
[`Helgaker (1995) p805 <https://www.worldscientific.com/doi/abs/10.1142/9789812832115_0001>`_]:

.. math::

    T_{ab} = -\frac{1}{2} \left ( D_{ij}^2 D_{kl}^0 D_{mn}^0 + D_{ij}^0 D_{kl}^2 D_{mn}^0 + D_{ij}^0 D_{kl}^0 D_{mn}^2\right ),

where :math:`D_{ij}^0 = S_{ij}^0` is an overlap integral and :math:`D_{ij}^2` is computed from
overlap integrals :math:`S` and the Gaussian exponent :math:`\beta` as

.. math::

    D_{ij}^2 = j(j-1)S_{i,j-2}^0 - 2\beta(2j+1)S_{i,j}^0 + 4\beta^2 S_{i,j+2}^0.

Args:
    la (tuple[int]): angular momentum for the first Gaussian function
    lb (tuple[int]): angular momentum for the second Gaussian function
    ra (array[float]): position vector of the first Gaussian function
    rb (array[float]): position vector of the second Gaussian function
    alpha (array[float]): exponent of the first Gaussian function
    beta (array[float]): exponent of the second Gaussian function

Returns:
    array[float]: kinetic integral between two Gaussian functions

**Example**

>>> la, lb = (0, 0, 0), (0, 0, 0)
>>> ra = np.array([0., 0., 0.])
>>> rb = rb = np.array([0., 0., 0.])
>>> alpha = np.array([np.pi/2])
>>> beta = np.array([np.pi/2])
>>> t = gaussian_kinetic(la, lb, ra, rb, alpha, beta)
>>> t
array([2.35619449])

## `kinetic_integral`

```python
def kinetic_integral(basis_a, basis_b, normalize=True)
```

Return a function that computes the kinetic integral for two contracted Gaussian functions.

Args:
    basis_a (~qchem.basis_set.BasisFunction): first basis function
    basis_b (~qchem.basis_set.BasisFunction): second basis function
    normalize (bool): if True, the basis functions get normalized

Returns:
    function: function that computes the kinetic integral

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]], requires_grad = False)
>>> alpha = np.array([[3.425250914, 0.6239137298, 0.168855404],
>>>                   [3.425250914, 0.6239137298, 0.168855404]], requires_grad = True)
>>> mol = qp.qchem.Molecule(symbols, geometry, alpha=alpha)
>>> args = [mol.alpha]
>>> kinetic_integral(mol.basis_set[0], mol.basis_set[1])(*args)
0.38325367405312843

## `nuclear_attraction`

```python
def nuclear_attraction(la, lb, ra, rb, alpha, beta, r)
```

Compute nuclear attraction integral between primitive Gaussian functions.

The nuclear attraction integral between two Gaussian functions denoted by :math:`a` and
:math:`b` can be computed as
[`Helgaker (1995) p820 <https://www.worldscientific.com/doi/abs/10.1142/9789812832115_0001>`_]

.. math::

    V_{ab} = \frac{2\pi}{p} \sum_{tuv} E_t^{ij} E_u^{kl} E_v^{mn} R_{tuv},

where :math:`E` and :math:`R` represent the Hermite Gaussian expansion coefficients and the
Hermite Coulomb integral, respectively. The sum goes over :math:`i + j + 1`, :math:`k + l + 1`
and :math:`m + n + 1` for :math:`t`, :math:`u` and :math:`v`, respectively, and :math:`p` is
computed from the exponents of the two Gaussian functions as :math:`p = \alpha + \beta`.

Args:
    la (tuple[int]): angular momentum for the first Gaussian function
    lb (tuple[int]): angular momentum for the second Gaussian function
    ra (array[float]): position vector of the first Gaussian function
    rb (array[float]): position vector of the second Gaussian function
    alpha (array[float]): exponent of the first Gaussian function
    beta (array[float]): exponent of the second Gaussian function
    r (array[float]): position vector of nucleus

Returns:
    array[float]: nuclear attraction integral between two Gaussian functions

## `attraction_integral`

```python
def attraction_integral(r, basis_a, basis_b, normalize=True)
```

Return a function that computes the nuclear attraction integral for two contracted Gaussian
functions.

Args:
    r (array[float]): position vector of nucleus
    basis_a (~qchem.basis_set.BasisFunction): first basis function
    basis_b (~qchem.basis_set.BasisFunction): second basis function
    normalize (bool): if True, the basis functions get normalized

Returns:
    function: function that computes the electron-nuclear attraction integral

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]], requires_grad = False)
>>> alpha = np.array([[3.425250914, 0.6239137298, 0.168855404],
>>>                   [3.425250914, 0.6239137298, 0.168855404]], requires_grad = True)
>>> mol = qp.qchem.Molecule(symbols, geometry, alpha=alpha)
>>> basis_a = mol.basis_set[0]
>>> basis_b = mol.basis_set[1]
>>> args = [mol.alpha]
>>> attraction_integral(geometry[0], basis_a, basis_b)(*args)
0.801208332328965

## `electron_repulsion`

```python
def electron_repulsion(la, lb, lc, ld, ra, rb, rc, rd, alpha, beta, gamma, delta)
```

Compute the electron-electron repulsion integral between four primitive Gaussian functions.

The electron repulsion integral between four Gaussian functions denoted by :math:`a`, :math:`b`
, :math:`c` and :math:`d` is computed as
[`Helgaker (1995) p820 <https://www.worldscientific.com/doi/abs/10.1142/9789812832115_0001>`_]

.. math::

    g_{abcd} = \frac{2\pi^{5/2}}{pq\sqrt{p+q}} \sum_{tuv} E_t^{o_a o_b} E_u^{m_a m_b}
    E_v^{n_a n_b} \sum_{rsw} (-1)^{r+s+w} E_r^{o_c o_d} E_s^{m_c m_d} E_w^{n_c n_d}
    R_{t+r, u+s, v+w},

where :math:`E` and :math:`R` are the Hermite Gaussian expansion coefficients and the
Hermite Coulomb integral, respectively. The sums go over the angular momentum quantum numbers
:math:`o_i + o_j + 1`, :math:`m_i + m_j + 1` and :math:`n_i + n_j + 1` respectively for
:math:`t, u, v` and :math:`r, s, w`. The exponents of the Gaussian functions are used to compute
:math:`p` and :math:`q` as :math:`p = \alpha + \beta` and :math:`q = \gamma + \delta`.

Args:
    la (tuple[int]): angular momentum for the first Gaussian function
    lb (tuple[int]): angular momentum for the second Gaussian function
    lc (tuple[int]): angular momentum for the third Gaussian function
    ld (tuple[int]): angular momentum for the forth Gaussian function
    ra (array[float]): position vector of the first Gaussian function
    rb (array[float]): position vector of the second Gaussian function
    rc (array[float]): position vector of the third Gaussian function
    rd (array[float]): position vector of the forth Gaussian function
    alpha (array[float]): exponent of the first Gaussian function
    beta (array[float]): exponent of the second Gaussian function
    gamma (array[float]): exponent of the third Gaussian function
    delta (array[float]): exponent of the forth Gaussian function

Returns:
    array[float]: electron-electron repulsion integral between four Gaussian functions

## `repulsion_integral`

```python
def repulsion_integral(basis_a, basis_b, basis_c, basis_d, normalize=True)
```

Return a function that computes the electron-electron repulsion integral for four contracted
Gaussian functions.

Args:
    basis_a (~qchem.basis_set.BasisFunction): first basis function
    basis_b (~qchem.basis_set.BasisFunction): second basis function
    basis_c (~qchem.basis_set.BasisFunction): third basis function
    basis_d (~qchem.basis_set.BasisFunction): fourth basis function
    normalize (bool): if True, the basis functions get normalized

Returns:
    function: function that computes the electron repulsion integral

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]], requires_grad = False)
>>> alpha = np.array([[3.425250914, 0.6239137298, 0.168855404],
>>>                   [3.425250914, 0.6239137298, 0.168855404],
>>>                   [3.425250914, 0.6239137298, 0.168855404],
>>>                   [3.425250914, 0.6239137298, 0.168855404]], requires_grad = True)
>>> mol = qp.qchem.Molecule(symbols, geometry, alpha=alpha)
>>> basis_a = mol.basis_set[0]
>>> basis_b = mol.basis_set[1]
>>> args = [mol.alpha]
>>> repulsion_integral(basis_a, basis_b, basis_a, basis_b)(*args)
0.45590152106593573
