---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/cv.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/cv.py
license: Apache-2.0
---

## Module `pennylane/ops/cv.py`

This module contains the available built-in continuous-variable
quantum operations supported by PennyLane, as well as their conventions.

.. todo:: Add gradient recipes for Gaussian state preparations

.. todo::

   The gradient computation assumes all parameters are real (floats), some
   docstrings here allow complex or even array parameter values. This includes
   :class:`~.DisplacedSqueezedState` and :class:`~.CatState`.

   Possible solution: disallow such operations to depend on free parameters,
   this way they won't be differentiated.

.. note::

   For the Heisenberg matrix representation of CV operations, we use the ordering
   :math:`(\hat{\mathbb{1}}, \hat{x}, \hat{p})` for single modes
   and :math:`(\hat{\mathbb{1}}, \hat{x}_1, \hat{p}_2, \hat{x}_1,\hat{p}_2)` for two modes .

## `Rotation`

```python
class Rotation(CVOperation)
```

Phase space rotation.

.. math::
    R(\phi) = \exp\left(i \phi \ad \a\right)=\exp\left(i \frac{\phi}{2}
    \left(\frac{\x^2+  \p^2}{\hbar}-\I\right)\right).

**Details:**

* Number of wires: 1
* Number of parameters: 1
* Gradient recipe: :math:`\frac{d}{dr}f(R(r)) = \frac{1}{2} \left[f(R(\phi+\pi/2)) - f(R(\phi-\pi/2))\right]`
  where :math:`f` is an expectation value depending on :math:`R(r)`.
* Heisenberg representation:

  .. math:: M = \begin{bmatrix}
    1 & 0 & 0\\
    0 & \cos\phi & -\sin\phi\\
    0 & \sin\phi & \cos\phi
    \end{bmatrix}

Args:
    phi (float): the rotation angle
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `Squeezing`

```python
class Squeezing(CVOperation)
```

Phase space squeezing.

.. math::
    S(z) = \exp\left(\frac{1}{2}(z^* \a^2 -z {\a^\dagger}^2)\right).

where :math:`z = r e^{i\phi}`.

**Details:**

* Number of wires: 1
* Number of parameters: 2
* Gradient recipe: :math:`\frac{d}{dr}f(S(r,\phi)) = \frac{1}{2\sinh s} \left[f(S(r+s, \phi)) - f(S(r-s, \phi))\right]`,
  where :math:`s` is an arbitrary real number (:math:`0.1` by default) and
  :math:`f` is an expectation value depending on :math:`S(r,\phi)`.
* Heisenberg representation:

  .. math:: M = \begin{bmatrix}
    1 & 0 & 0 \\
    0 & \cosh r - \cos\phi \sinh r & -\sin\phi\sinh r \\
    0 & -\sin\phi\sinh r & \cosh r+\cos\phi\sinh r
    \end{bmatrix}

Args:
    r (float): squeezing amount
    phi (float): squeezing phase angle :math:`\phi`
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `Displacement`

```python
class Displacement(CVOperation)
```

Phase space displacement.

.. math::
   D(a,\phi) = D(\alpha) = \exp(\alpha \ad -\alpha^* \a)
   = \exp\left(-i\sqrt{\frac{2}{\hbar}}(\re(\alpha) \hat{p} -\im(\alpha) \hat{x})\right).

where :math:`\alpha = ae^{i\phi}` has magnitude :math:`a\geq 0` and phase :math:`\phi`.
The result of applying a displacement to the vacuum is a coherent state
:math:`D(\alpha)\ket{0} = \ket{\alpha}`.

**Details:**

* Number of wires: 1
* Number of parameters: 2
* Gradient recipe: :math:`\frac{d}{da}f(D(a,\phi)) = \frac{1}{2s} \left[f(D(a+s, \phi)) - f(D(a-s, \phi))\right]`,
  where :math:`s` is an arbitrary real number (:math:`0.1` by default) and
  :math:`f` is an expectation value depending on :math:`D(a,\phi)`.
* Heisenberg representation:

  .. math:: M = \begin{bmatrix} 1 & 0 & 0 \\ 2a\cos\phi & 1 & 0 \\ 2a\sin\phi & 0 & 1\end{bmatrix}

Args:
    a (float): displacement magnitude :math:`a=|\alpha|`
    phi (float): phase angle :math:`\phi`
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `Beamsplitter`

```python
class Beamsplitter(CVOperation)
```

Beamsplitter interaction.

.. math::
    B(\theta,\phi) = \exp\left(\theta (e^{i \phi} \a \hat{b}^\dagger -e^{-i \phi}\ad \hat{b}) \right).

**Details:**

* Number of wires: 2
* Number of parameters: 2
* Gradient recipe: :math:`\frac{d}{d \theta}f(B(\theta,\phi)) = \frac{1}{2} \left[f(B(\theta+\pi/2, \phi)) - f(B(\theta-\pi/2, \phi))\right]`
  where :math:`f` is an expectation value depending on :math:`B(\theta,\phi)`.
* Heisenberg representation:

  .. math:: M = \begin{bmatrix}
        1 & 0 & 0 & 0 & 0\\
        0 & \cos\theta & 0 & -\cos\phi\sin\theta & -\sin\phi\sin\theta \\
        0 & 0 & \cos\theta & \sin\phi\sin\theta & -\cos\phi\sin\theta\\
        0 & \cos\phi\sin\theta & -\sin\phi\sin\theta & \cos\theta & 0\\
        0 & \sin\phi\sin\theta & \cos\phi\sin\theta & 0 & \cos\theta
    \end{bmatrix}

Args:
    theta (float): Transmittivity angle :math:`\theta`. The transmission amplitude
        of the beamsplitter is :math:`t = \cos(\theta)`.
        The value :math:`\theta=\pi/4` gives the 50-50 beamsplitter.
    phi (float): Phase angle :math:`\phi`. The reflection amplitude of the
        beamsplitter is :math:`r = e^{i\phi}\sin(\theta)`.
        The value :math:`\phi = \pi/2` gives the symmetric beamsplitter.
    wires (Sequence[Any]): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `TwoModeSqueezing`

```python
class TwoModeSqueezing(CVOperation)
```

Phase space two-mode squeezing.

.. math::
    S_2(z) = \exp\left(z^* \a \hat{b} -z \ad \hat{b}^\dagger \right)
    = \exp\left(r (e^{-i\phi} \a\hat{b} -e^{i\phi} \ad \hat{b}^\dagger \right).

where :math:`z = r e^{i\phi}`.

**Details:**

* Number of wires: 2
* Number of parameters: 2
* Gradient recipe: :math:`\frac{d}{dr}f(S_2(r,\phi)) = \frac{1}{2\sinh s} \left[f(S_2(r+s, \phi)) - f(S_2(r-s, \phi))\right]`,
  where :math:`s` is an arbitrary real number (:math:`0.1` by default) and
  :math:`f` is an expectation value depending on :math:`S_2(r,\phi)`.

* Heisenberg representation:

  .. math:: M = \begin{bmatrix}
        1 & 0 & 0 & 0 & 0 \\
        0 & \cosh r & 0 & \sinh r \cos \phi & \sinh r \sin \phi\\
        0 & 0 & \cosh r & \sinh r \sin \phi & -\sinh r \cos \phi\\
        0 & \sinh r \cos \phi & \sinh r \sin \phi & \cosh r & 0\\
        0 & \sinh r \sin \phi & -\sinh r \cos \phi & 0 & \cosh r
    \end{bmatrix}

Args:
    r (float): squeezing amount
    phi (float): squeezing phase angle :math:`\phi`
    wires (Sequence[Any]): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `QuadraticPhase`

```python
class QuadraticPhase(CVOperation)
```

Quadratic phase shift.

.. math::
    P(s) = e^{i \frac{s}{2} \hat{x}^2/\hbar}.

**Details:**

* Number of wires: 1
* Number of parameters: 1
* Gradient recipe: :math:`\frac{d}{ds}f(P(s)) = \frac{1}{2 a} \left[f(P(s+a)) - f(P(s-a))\right]`,
  where :math:`a` is an arbitrary real number (:math:`0.1` by default) and
  :math:`f` is an expectation value depending on :math:`P(s)`.

* Heisenberg representation:

  .. math:: M = \begin{bmatrix}
        1 & 0 & 0 \\
        0 & 1 & 0 \\
        0 & s & 1 \\
    \end{bmatrix}

Args:
    s (float): parameter
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `ControlledAddition`

```python
class ControlledAddition(CVOperation)
```

Controlled addition operation.

.. math::
       \text{CX}(s) = \int dx \ket{x}\bra{x} \otimes D\left({\frac{1}{\sqrt{2\hbar}}}s x\right)
       = e^{-i s \: \hat{x} \otimes \hat{p}/\hbar}.

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Gradient recipe: :math:`\frac{d}{ds}f(\text{CX}(s)) = \frac{1}{2 a} \left[f(\text{CX}(s+a)) - f(\text{CX}(s-a))\right]`,
  where :math:`a` is an arbitrary real number (:math:`0.1` by default) and
  :math:`f` is an expectation value depending on :math:`\text{CX}(s)`.

* Heisenberg representation:

  .. math:: M = \begin{bmatrix}
        1 & 0 & 0 & 0 & 0 \\
        0 & 1 & 0 & 0 & 0 \\
        0 & 0 & 1 & 0 & -s \\
        0 & s & 0 & 1 & 0 \\
        0 & 0 & 0 & 0 & 1
    \end{bmatrix}

Args:
    s (float): addition multiplier
    wires (Sequence[Any]): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `ControlledPhase`

```python
class ControlledPhase(CVOperation)
```

Controlled phase operation.

.. math::
       \text{CZ}(s) =  \iint dx dy \: e^{i sxy/\hbar} \ket{x,y}\bra{x,y}
       = e^{i s \: \hat{x} \otimes \hat{x}/\hbar}.

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Gradient recipe: :math:`\frac{d}{ds}f(\text{CZ}(s)) = \frac{1}{2 a} \left[f(\text{CZ}(s+a)) - f(\text{CZ}(s-a))\right]`,
  where :math:`a` is an arbitrary real number (:math:`0.1` by default) and
  :math:`f` is an expectation value depending on :math:`\text{CZ}(s)`.

* Heisenberg representation:

  .. math:: M = \begin{bmatrix}
        1 & 0 & 0 & 0 & 0 \\
        0 & 1 & 0 & 0 & 0 \\
        0 & 0 & 1 & s & 0 \\
        0 & 0 & 0 & 1 & 0 \\
        0 & s & 0 & 0 & 1
    \end{bmatrix}

Args:
    s (float):  phase shift multiplier
    wires (Sequence[Any]): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `Kerr`

```python
class Kerr(CVOperation)
```

Kerr interaction.

.. math::
    K(\kappa) = e^{i \kappa \hat{n}^2}.

**Details:**

* Number of wires: 1
* Number of parameters: 1
* Gradient recipe: None (uses finite difference)

Args:
    kappa (float): parameter
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `CrossKerr`

```python
class CrossKerr(CVOperation)
```

Cross-Kerr interaction.

.. math::
    CK(\kappa) = e^{i \kappa \hat{n}_1\hat{n}_2}.

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Gradient recipe: None (uses finite difference)

Args:
    kappa (float): parameter
    wires (Sequence[Any]): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `CubicPhase`

```python
class CubicPhase(CVOperation)
```

Cubic phase shift.

.. math::
    V(\gamma) = e^{i \frac{\gamma}{3} \hat{x}^3/\hbar}.

**Details:**

* Number of wires: 1
* Number of parameters: 1
* Gradient recipe: None (uses finite difference)

Args:
    gamma (float): parameter
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `InterferometerUnitary`

```python
class InterferometerUnitary(CVOperation)
```

A linear interferometer transforming the bosonic operators according to
the unitary matrix :math:`U`.

.. note::

    This operation implements a **fixed** linear interferometer given a known
    unitary matrix.

    If you instead wish to parametrize the interferometer,
    and calculate the gradient/optimize with respect to these parameters,
    consider instead the :func:`pennylane.template.Interferometer` template,
    which constructs an interferometer from a combination of beamsplitters
    and rotation gates.

**Details:**

* Number of wires: Any
* Number of parameters: 1
* Gradient recipe: None
* Heisenberg representation:

  .. math:: M = \begin{bmatrix}
    1 & 0\\
    0 & S\\
    \end{bmatrix}

where :math:`S` is the Gaussian symplectic transformation representing the interferometer.

Args:
    U (array): A shape ``(len(wires), len(wires))`` complex unitary matrix
    wires (Sequence[Any] or Any): the wires the operation acts on
    id (str or None): String representing the operation (optional)

## `CoherentState`

```python
class CoherentState(CVOperation)
```

Prepares a coherent state.

**Details:**

* Number of wires: 1
* Number of parameters: 2
* Gradient recipe: None (uses finite difference)

Args:
    a (float): displacement magnitude :math:`r=|\alpha|`
    phi (float): phase angle :math:`\phi`
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `SqueezedState`

```python
class SqueezedState(CVOperation)
```

Prepares a squeezed vacuum state.

**Details:**

* Number of wires: 1
* Number of parameters: 2
* Gradient recipe: None (uses finite difference)

Args:
    r (float): squeezing magnitude
    phi (float): squeezing angle :math:`\phi`
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `DisplacedSqueezedState`

```python
class DisplacedSqueezedState(CVOperation)
```

Prepares a displaced squeezed vacuum state.

A displaced squeezed state is prepared by squeezing a vacuum state, and
then applying a displacement operator,

.. math::
   \ket{\alpha,z} = D(\alpha)\ket{0,z} = D(\alpha)S(z)\ket{0},

with the displacement parameter :math:`\alpha=ae^{i\phi_a}` and the squeezing parameter :math:`z=re^{i\phi_r}`.

**Details:**

* Number of wires: 1
* Number of parameters: 4
* Gradient recipe: None (uses finite difference)

Args:
    a (float): displacement magnitude :math:`a=|\alpha|`
    phi_a (float): displacement angle :math:`\phi_a`
    r (float): squeezing magnitude :math:`r=|z|`
    phi_r (float): squeezing angle :math:`\phi_r`
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `ThermalState`

```python
class ThermalState(CVOperation)
```

Prepares a thermal state.

**Details:**

* Number of wires: 1
* Number of parameters: 1
* Gradient recipe: None (uses finite difference)

Args:
    nbar (float): mean thermal population of the mode
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `GaussianState`

```python
class GaussianState(CVOperation)
```

Prepare subsystems in a given Gaussian state.

**Details:**

* Number of wires: Any
* Number of parameters: 2
* Gradient recipe: None

Args:
    V (array): the :math:`2N\times 2N` (real and positive definite) covariance matrix
    r (array): a length :math:`2N` vector of means, of the
        form :math:`(\x_0,\dots,\x_{N-1},\p_0,\dots,\p_{N-1})`
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `FockState`

```python
class FockState(CVOperation)
```

Prepares a single Fock state.

**Details:**

* Number of wires: 1
* Number of parameters: 1
* Gradient recipe: None (not differentiable)

Args:
    n (int): Fock state to prepare
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `label`

```python
def label(self, decimals=None, base_label=None, cache=None)
```

A customizable string representation of the operator.

Args:
    decimals=None (int): If ``None``, no parameters are included. Else,
        specifies how to round the parameters.
    base_label=None (str): overwrite the non-parameter component of the label
    cache=None (dict): dictionary that caries information between label calls
        in the same drawing

Returns:
    str: label to use in drawings

**Example:**

>>> qp.FockState(7, wires=0).label()
'|7⟩'

## `FockStateVector`

```python
class FockStateVector(CVOperation)
```

Prepare subsystems using the given ket vector in the Fock basis.

**Details:**

* Number of wires: Any
* Number of parameters: 1
* Gradient recipe: None (uses finite difference)

Args:
    state (array): a single ket vector, for single mode state preparation,
        or a multimode ket, with one array dimension per mode
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

.. details::
    :title: Usage Details

    For a single mode with cutoff dimension :math:`N`, the input is a
    1-dimensional vector of length :math:`N`.

    .. code-block::

        dev_fock = qp.device("strawberryfields.fock", wires=4, cutoff_dim=4)

        state = np.array([0, 0, 1, 0])

        @qp.qnode(dev_fock)
        def circuit():
            qp.FockStateVector(state, wires=0)
            return qp.expval(qp.NumberOperator(wires=0))

    For multiple modes, the input is the tensor product of single mode
    kets. For example, given a set of :math:`M` single mode vectors of
    length :math:`N`, the input should have shape ``(N, ) * M``.

    .. code-block::

        used_wires = [0, 3]
        cutoff_dim = 5

        dev_fock = qp.device("strawberryfields.fock", wires=4, cutoff_dim=cutoff_dim)

        state_1 = np.array([0, 1, 0, 0, 0])
        state_2 = np.array([0, 0, 0, 1, 0])

        combined_state = np.kron(state_1, state_2).reshape(
            (cutoff_dim, ) * len(used_wires)
        )

        @qp.qnode(dev_fock)
        def circuit():
            qp.FockStateVector(combined_state, wires=used_wires)
            return qp.expval(qp.NumberOperator(wires=0))

### `label`

```python
def label(self, decimals=None, base_label=None, cache=None)
```

A customizable string representation of the operator.

Args:
    decimals=None (int): If ``None``, no parameters are included. Else,
        specifies how to round the parameters.
    base_label=None (str): overwrite the non-parameter component of the label
    cache=None (dict): dictionary that caries information between label calls
        in the same drawing

Returns:
    str: label to use in drawings

**Example:**

>>> qp.FockStateVector([1,2,3], wires=(0,1,2)).label()
'|123⟩'

## `FockDensityMatrix`

```python
class FockDensityMatrix(CVOperation)
```

Prepare subsystems using the given density matrix in the Fock basis.

**Details:**

* Number of wires: Any
* Number of parameters: 1
* Gradient recipe: None (uses finite difference)

Args:
    state (array): a single mode matrix :math:`\rho_{ij}`, or
        a multimode tensor :math:`\rho_{ij,kl,\dots,mn}`, with two indices per mode
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `CatState`

```python
class CatState(CVOperation)
```

Prepares a cat state.

A cat state is the coherent superposition of two coherent states,

.. math::
   \ket{\text{cat}(\alpha)} = \frac{1}{N} (\ket{\alpha} +e^{ip\pi} \ket{-\alpha}),

where :math:`\ket{\pm\alpha} = D(\pm\alpha)\ket{0}` are coherent states with displacement
parameters :math:`\pm\alpha=\pm ae^{i\phi}` and
:math:`N = \sqrt{2 (1+\cos(p\pi)e^{-2|\alpha|^2})}` is the normalization factor.

**Details:**

* Number of wires: 1
* Number of parameters: 3
* Gradient recipe: None (uses finite difference)

Args:
    a (float): displacement magnitude :math:`a=|\alpha|`
    phi (float): displacement angle :math:`\phi`
    p (float): parity, where :math:`p=0` corresponds to an even
        cat state, and :math:`p=1` an odd cat state.
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `NumberOperator`

```python
class NumberOperator(CVObservable)
```

The photon number observable :math:`\langle \hat{n}\rangle`.

The number operator is defined as
:math:`\hat{n} = \a^\dagger \a = \frac{1}{2\hbar}(\x^2 +\p^2) -\I/2`.

When used with the :func:`~pennylane.expval` function, the mean
photon number :math:`\braket{\hat{n}}` is returned.

**Details:**

* Number of wires: 1
* Number of parameters: 0
* Observable order: 2nd order in the quadrature operators
* Heisenberg representation:

  .. math:: M = \frac{1}{2\hbar}\begin{bmatrix}
        -\hbar & 0 & 0\\
        0 & 1 & 0\\
        0 & 0 & 1
    \end{bmatrix}

Args:
    wires (Sequence[Any] or Any): the wire the operation acts on

## `TensorN`

```python
class TensorN(CVObservable)
```

The tensor product of the :class:`~.NumberOperator` acting on different wires.

If a single wire is defined, returns a :class:`~.NumberOperator` instance for convenient gradient computations.

When used with the :func:`~pennylane.expval` function, the expectation value
:math:`\langle \hat{n}_{i_0} \hat{n}_{i_1}\dots \hat{n}_{i_{N-1}}\rangle`
for a (sub)set of modes :math:`[i_0, i_1, \dots, i_{N-1}]` of the system is
returned.

**Details:**

* Number of wires: Any
* Number of parameters: 0

Args:
    wires (Sequence[Any] or Any): the wire the operation acts on

.. details::
    :title: Usage Details

    Example for multiple modes:

    >>> cv_obs = qp.TensorN(wires=[0, 1])
    >>> cv_obs
    TensorN(wires=[0, 1])
    >>> cv_obs.ev_order is None
    True

    Example for a single mode (yields a :class:`~.NumberOperator`):

    >>> cv_obs = qp.TensorN(wires=[1])
    >>> cv_obs
    NumberOperator(wires=[1])
    >>> cv_obs.ev_order
    2

## `QuadX`

```python
class QuadX(CVObservable)
```

The position quadrature observable :math:`\hat{x}`.

When used with the :func:`~pennylane.expval` function, the position expectation
value :math:`\braket{\hat{x}}` is returned. This corresponds to
the mean displacement in the phase space along the :math:`x` axis.

**Details:**

* Number of wires: 1
* Number of parameters: 0
* Observable order: 1st order in the quadrature operators
* Heisenberg representation:

  .. math:: d = [0, 1, 0]

Args:
    wires (Sequence[Any] or Any): the wire the operation acts on

## `QuadP`

```python
class QuadP(CVObservable)
```

The momentum quadrature observable :math:`\hat{p}`.

When used with the :func:`~pennylane.expval` function, the momentum expectation
value :math:`\braket{\hat{p}}` is returned. This corresponds to
the mean displacement in the phase space along the :math:`p` axis.

**Details:**

* Number of wires: 1
* Number of parameters: 0
* Observable order: 1st order in the quadrature operators
* Heisenberg representation:

  .. math:: d = [0, 0, 1]

Args:
    wires (Sequence[Any] or Any): the wire the operation acts on

## `QuadOperator`

```python
class QuadOperator(CVObservable)
```

The generalized quadrature observable :math:`\x_\phi = \x cos\phi+\p\sin\phi`.

When used with the :func:`~pennylane.expval` function, the expectation
value :math:`\braket{\hat{\x_\phi}}` is returned. This corresponds to
the mean displacement in the phase space along axis at angle :math:`\phi`.

**Details:**

* Number of wires: 1
* Number of parameters: 1
* Observable order: 1st order in the quadrature operators
* Heisenberg representation:

  .. math:: d = [0, \cos\phi, \sin\phi]

Args:
    phi (float): axis in the phase space at which to calculate
        the generalized quadrature observable
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `label`

```python
def label(self, decimals=None, base_label=None, cache=None)
```

A customizable string representation of the operator.

Args:
    decimals=None (int): If ``None``, no parameters are included. Else,
        specifies how to round the parameters.
    base_label=None (str): overwrite the non-parameter component of the label
    cache=None (dict): dictionary that caries information between label calls
        in the same drawing

Returns:
    str: label to use in drawings

**Example:**

>>> op = qp.QuadOperator(1.234, wires=0)
>>> op.label()
'cos(φ)x\n+sin(φ)p'
>>> op.label(decimals=2)
'cos(1.23)x\n+sin(1.23)p'
>>> op.label(base_label="Quad", decimals=2)
'Quad\n(1.23)'

## `PolyXP`

```python
class PolyXP(CVObservable)
```

An arbitrary second-order polynomial observable.

Represents an arbitrary observable :math:`P(\x,\p)` that is a second order
polynomial in the basis :math:`\mathbf{r} = (\I, \x_0, \p_0, \x_1, \p_1, \ldots)`.

For first-order observables the representation is a real vector
:math:`\mathbf{d}` such that :math:`P(\x,\p) = \mathbf{d}^T \mathbf{r}`.

For second-order observables the representation is a real symmetric
matrix :math:`A` such that :math:`P(\x,\p) = \mathbf{r}^T A \mathbf{r}`.

Used for evaluating arbitrary order-2 CV expectation values of
:class:`~.pennylane.tape.CVParamShiftTape`.

**Details:**

* Number of wires: Any
* Number of parameters: 1
* Observable order: 2nd order in the quadrature operators
* Heisenberg representation: :math:`A`

Args:
    q (array[float]): expansion coefficients
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

## `FockStateProjector`

```python
class FockStateProjector(CVObservable)
```

The number state observable :math:`\ket{n}\bra{n}`.

Represents the non-Gaussian number state observable

.. math:: \ket{n}\bra{n} = \ket{n_0, n_1, \dots, n_P}\bra{n_0, n_1, \dots, n_P}

where :math:`n_i` is the occupation number of the :math:`i` th wire.

The expectation of this observable is

.. math::
    E[\ket{n}\bra{n}] = \text{Tr}(\ket{n}\bra{n}\rho)
    = \text{Tr}(\braketT{n}{\rho}{n})
    = \braketT{n}{\rho}{n}

corresponding to the probability of measuring the quantum state in the state
:math:`\ket{n}=\ket{n_0, n_1, \dots, n_P}`.

.. note::

    If ``expval(FockStateProjector)`` is applied to a subset of wires,
    the unaffected wires are traced out prior to the expectation value
    calculation.

**Details:**

* Number of wires: Any
* Number of parameters: 1
* Observable order: None (non-Gaussian)

Args:
    n (array): Array of non-negative integers representing the number state
        observable :math:`\ket{n}\bra{n}=\ket{n_0, n_1, \dots, n_P}\bra{n_0, n_1, \dots, n_P}`.

        For example, to return the observable :math:`\ket{0,4,2}\bra{0,4,2}` acting on
        wires 0, 1, and 3 of a QNode, you would call ``FockStateProjector(np.array([0, 4, 2], wires=[0, 1, 3]))``.

        Note that ``len(n)==len(wires)``, and that ``len(n)`` cannot exceed the
        total number of wires in the QNode.
    wires (Sequence[Any] or Any): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `label`

```python
def label(self, decimals=None, base_label=None, cache=None)
```

A customizable string representation of the operator.

Args:
    decimals=None (int): If ``None``, no parameters are included. Else,
        specifies how to round the parameters.
    base_label=None (str): overwrite the non-parameter component of the label
    cache=None (dict): dictionary that caries information between label calls
        in the same drawing

Returns:
    str: label to use in drawings

**Example:**

>>> qp.FockStateProjector([1,2,3], wires=(0,1,2)).label()
'|123⟩⟨123|'
