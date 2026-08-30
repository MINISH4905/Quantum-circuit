---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/qubit/parametric_ops_single_qubit.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/qubit/parametric_ops_single_qubit.py
license: Apache-2.0
---

## Module `pennylane/ops/qubit/parametric_ops_single_qubit.py`

This submodule contains the discrete-variable quantum operations that are the
core parametrized gates.

## `RX`

```python
class RX(Operation)
```

The single qubit X rotation

.. math:: R_x(\phi) = e^{-i\phi\sigma_x/2} = \begin{bmatrix}
            \cos(\phi/2) & -i\sin(\phi/2) \\
            -i\sin(\phi/2) & \cos(\phi/2)
        \end{bmatrix}.

**Details:**

* Number of wires: 1
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: :math:`\frac{d}{d\phi}f(R_x(\phi)) = \frac{1}{2}\left[f(R_x(\phi+\pi/2)) - f(R_x(\phi-\pi/2))\right]`
  where :math:`f` is an expectation value depending on :math:`R_x(\phi)`.

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int] or int): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(theta: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.RX.matrix`

Args:
    theta (tensor_like or float): rotation angle

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.RX.compute_matrix(torch.tensor(0.5))
tensor([[0.9689+0.0000j, 0.0000-0.2474j],
        [0.0000-0.2474j, 0.9689+0.0000j]])

## `RY`

```python
class RY(Operation)
```

The single qubit Y rotation

.. math:: R_y(\phi) = e^{-i\phi\sigma_y/2} = \begin{bmatrix}
            \cos(\phi/2) & -\sin(\phi/2) \\
            \sin(\phi/2) & \cos(\phi/2)
        \end{bmatrix}.

**Details:**

* Number of wires: 1
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: :math:`\frac{d}{d\phi}f(R_y(\phi)) = \frac{1}{2}\left[f(R_y(\phi+\pi/2)) - f(R_y(\phi-\pi/2))\right]`
  where :math:`f` is an expectation value depending on :math:`R_y(\phi)`.

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int] or int): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(theta: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.RY.matrix`


Args:
    theta (tensor_like or float): rotation angle

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.RY.compute_matrix(torch.tensor(0.5))
tensor([[ 0.9689+0.j, -0.2474-0.j],
        [ 0.2474+0.j,  0.9689+0.j]])

## `RZ`

```python
class RZ(Operation)
```

The single qubit Z rotation

.. math:: R_z(\phi) = e^{-i\phi\sigma_z/2} = \begin{bmatrix}
            e^{-i\phi/2} & 0 \\
            0 & e^{i\phi/2}
        \end{bmatrix}.

**Details:**

* Number of wires: 1
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: :math:`\frac{d}{d\phi}f(R_z(\phi)) = \frac{1}{2}\left[f(R_z(\phi+\pi/2)) - f(R_z(\phi-\pi/2))\right]`
  where :math:`f` is an expectation value depending on :math:`R_z(\phi)`.

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int] or int): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(theta: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.RZ.matrix`

Args:
    theta (tensor_like or float): rotation angle

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.RZ.compute_matrix(torch.tensor(0.5))
tensor([[0.9689-0.2474j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.9689+0.2474j]])

### `compute_eigvals`

```python
def compute_eigvals(theta: TensorLike) -> TensorLike
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.RZ.eigvals`


Args:
    theta (tensor_like or float): rotation angle

Returns:
    tensor_like: eigenvalues

**Example**

>>> qp.RZ.compute_eigvals(torch.tensor(0.5))
tensor([0.9689-0.2474j, 0.9689+0.2474j])

## `PhaseShift`

```python
class PhaseShift(Operation)
```

Arbitrary single qubit local phase shift

.. math:: R_\phi(\phi) = e^{i\phi/2}R_z(\phi) = \begin{bmatrix}
            1 & 0 \\
            0 & e^{i\phi}
        \end{bmatrix}.

**Details:**

* Number of wires: 1
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: :math:`\frac{d}{d\phi}f(R_\phi(\phi)) = \frac{1}{2}\left[f(R_\phi(\phi+\pi/2)) - f(R_\phi(\phi-\pi/2))\right]`
  where :math:`f` is an expectation value depending on :math:`R_{\phi}(\phi)`.

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int] or int): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.PhaseShift.matrix`


Args:
    phi (tensor_like or float): phase shift

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.PhaseShift.compute_matrix(torch.tensor(0.5))
tensor([[1.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.8776+0.4794j]])

### `compute_eigvals`

```python
def compute_eigvals(phi: TensorLike) -> TensorLike
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.PhaseShift.eigvals`


Args:
    phi (tensor_like or float): phase shift

Returns:
    tensor_like: eigenvalues

**Example**

>>> qp.PhaseShift.compute_eigvals(torch.tensor(0.5))
tensor([1.0000+0.0000j, 0.8776+0.4794j])

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> 'qp.operation.Operator'
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.PhaseShift.decomposition`.

Args:
    phi (TensorLike): rotation angle :math:`\phi`
    wires (Any, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.PhaseShift.compute_decomposition(1.234, wires=0)
[RZ(1.234, wires=[0]), GlobalPhase(-0.617, wires=[])]

## `Rot`

```python
class Rot(Operation)
```

Arbitrary single qubit rotation

.. math::

    R(\phi,\theta,\omega) = RZ(\omega)RY(\theta)RZ(\phi)= \begin{bmatrix}
    e^{-i(\phi+\omega)/2}\cos(\theta/2) & -e^{i(\phi-\omega)/2}\sin(\theta/2) \\
    e^{-i(\phi-\omega)/2}\sin(\theta/2) & e^{i(\phi+\omega)/2}\cos(\theta/2)
    \end{bmatrix}.

**Details:**

* Number of wires: 1
* Number of parameters: 3
* Number of dimensions per parameter: (0, 0, 0)
* Gradient recipe: :math:`\frac{d}{d\phi}f(R(\phi, \theta, \omega)) = \frac{1}{2}\left[f(R(\phi+\pi/2, \theta, \omega)) - f(R(\phi-\pi/2, \theta, \omega))\right]`
  where :math:`f` is an expectation value depending on :math:`R(\phi, \theta, \omega)`.
  This gradient recipe applies for each angle argument :math:`\{\phi, \theta, \omega\}`.

.. note::

    If the ``Rot`` gate is not supported on the targeted device, PennyLane
    will attempt to decompose the gate into :class:`~.RZ` and :class:`~.RY` gates.

Args:
    phi (float): rotation angle :math:`\phi`
    theta (float): rotation angle :math:`\theta`
    omega (float): rotation angle :math:`\omega`
    wires (Any, Wires): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike, theta: TensorLike, omega: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.Rot.matrix`


Args:
    phi (tensor_like or float): first rotation angle
    theta (tensor_like or float): second rotation angle
    omega (tensor_like or float): third rotation angle

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.Rot.compute_matrix(torch.tensor(0.1), torch.tensor(0.2), torch.tensor(0.3))
tensor([[ 0.9752-0.1977j, -0.0993+0.0100j],
        [ 0.0993+0.0100j,  0.9752+0.1977j]])

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, theta: TensorLike, omega: TensorLike, wires: WiresLike) -> list['qp.operation.Operator']
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.Rot.decomposition`.

Args:
    phi (float): rotation angle :math:`\phi`
    theta (float): rotation angle :math:`\theta`
    omega (float): rotation angle :math:`\omega`
    wires (Any, Wires): the wire the operation acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.Rot.compute_decomposition(1.2, 2.3, 3.4, wires=0)
[RZ(1.2, wires=[0]), RY(2.3, wires=[0]), RZ(3.4, wires=[0])]

### `simplify`

```python
def simplify(self) -> 'Rot'
```

Simplifies into single-rotation gates or a Hadamard if possible.

>>> qp.Rot(np.pi / 2, 0.1, -np.pi / 2, wires=0).simplify()
RX(0.1, wires=[0])
>>> qp.Rot(np.pi, np.pi/2, 0, 0).simplify()
H(0)

## `U1`

```python
class U1(Operation)
```

U1 gate.

.. math:: U_1(\phi) = e^{i\phi/2}R_z(\phi) = \begin{bmatrix}
            1 & 0 \\
            0 & e^{i\phi}
        \end{bmatrix}.

.. note::

    The ``U1`` gate is an alias for the phase shift operation :class:`~.PhaseShift`.

**Details:**

* Number of wires: 1
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: :math:`\frac{d}{d\phi}f(U_1(\phi)) = \frac{1}{2}\left[f(U_1(\phi+\pi/2)) - f(U_1(\phi-\pi/2))\right]`
  where :math:`f` is an expectation value depending on :math:`U_1(\phi)`.

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int] or int): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.U1.matrix`

Args:
    phi (tensor_like or float): rotation angle

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.U1.compute_matrix(torch.tensor(0.5))
tensor([[1.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.8776+0.4794j]])

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> 'qp.operation.Operator'
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.U1.decomposition`.

Args:
    phi (TensorLike): rotation angle :math:`\phi`
    wires (Any, Wires): Wire that the operator acts on.

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.U1.compute_decomposition(1.234, wires=0)
[PhaseShift(1.234, wires=[0])]

## `U2`

```python
class U2(Operation)
```

U2 gate.

.. math::

    U_2(\phi, \delta) = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & -\exp(i \delta)
    \\ \exp(i \phi) & \exp(i (\phi + \delta)) \end{bmatrix}

The :math:`U_2` gate is related to the single-qubit rotation :math:`R` (:class:`Rot`) and the
:math:`R_\phi` (:class:`PhaseShift`) gates via the following relation:

.. math::

    U_2(\phi, \delta) = R_\phi(\phi+\delta) R(\delta,\pi/2,-\delta)

.. note::

    If the ``U2`` gate is not supported on the targeted device, PennyLane
    will attempt to decompose the gate into :class:`~.Rot` and :class:`~.PhaseShift` gates.

**Details:**

* Number of wires: 1
* Number of parameters: 2
* Number of dimensions per parameter: (0, 0)
* Gradient recipe: :math:`\frac{d}{d\phi}f(U_2(\phi, \delta)) = \frac{1}{2}\left[f(U_2(\phi+\pi/2, \delta)) - f(U_2(\phi-\pi/2, \delta))\right]`
  where :math:`f` is an expectation value depending on :math:`U_2(\phi, \delta)`.
  This gradient recipe applies for each angle argument :math:`\{\phi, \delta\}`.

Args:
    phi (float): azimuthal angle :math:`\phi`
    delta (float): quantum phase :math:`\delta`
    wires (Sequence[int] or int): the subsystem the gate acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike, delta: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.U2.matrix`

Args:
    phi (tensor_like or float): azimuthal angle
    delta (tensor_like or float): quantum phase

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.U2.compute_matrix(torch.tensor(0.1), torch.tensor(0.2))
tensor([[ 0.7071+0.0000j, -0.6930-0.1405j],
        [ 0.7036+0.0706j,  0.6755+0.2090j]])

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, delta: TensorLike, wires: WiresLike) -> list['qp.operation.Operator']
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.U2.decomposition`.

Args:
    phi (TensorLike): azimuthal angle :math:`\phi`
    delta (TensorLike): quantum phase :math:`\delta`
    wires (Iterable, Wires): the subsystem the gate acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.U2.compute_decomposition(1.23, 2.34, wires=0)
[Rot(2.34, np.float64(1.5707963267948966), -2.34, wires=[0]), PhaseShift(2.34, wires=[0]), PhaseShift(1.23, wires=[0])]

### `simplify`

```python
def simplify(self) -> 'U2'
```

Simplifies the gate into RX or RY gates if possible.

## `U3`

```python
class U3(Operation)
```

Arbitrary single qubit unitary.

.. math::

    U_3(\theta, \phi, \delta) = \begin{bmatrix} \cos(\theta/2) & -\exp(i \delta)\sin(\theta/2) \\
    \exp(i \phi)\sin(\theta/2) & \exp(i (\phi + \delta))\cos(\theta/2) \end{bmatrix}

The :math:`U_3` gate is related to the single-qubit rotation :math:`R` (:class:`Rot`) and the
:math:`R_\phi` (:class:`PhaseShift`) gates via the following relation:

.. math::

    U_3(\theta, \phi, \delta) = R_\phi(\phi+\delta) R(\delta,\theta,-\delta)

.. note::

    If the ``U3`` gate is not supported on the targeted device, PennyLane
    will attempt to decompose the gate into :class:`~.PhaseShift` and :class:`~.Rot` gates.

**Details:**

* Number of wires: 1
* Number of parameters: 3
* Number of dimensions per parameter: (0, 0, 0)
* Gradient recipe: :math:`\frac{d}{d\phi}f(U_3(\theta, \phi, \delta)) = \frac{1}{2}\left[f(U_3(\theta+\pi/2, \phi, \delta)) - f(U_3(\theta-\pi/2, \phi, \delta))\right]`
  where :math:`f` is an expectation value depending on :math:`U_3(\theta, \phi, \delta)`.
  This gradient recipe applies for each angle argument :math:`\{\theta, \phi, \delta\}`.

Args:
    theta (float): polar angle :math:`\theta`
    phi (float): azimuthal angle :math:`\phi`
    delta (float): quantum phase :math:`\delta`
    wires (Sequence[int] or int): the subsystem the gate acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(theta: TensorLike, phi: TensorLike, delta: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.U3.matrix`

Args:
    theta (tensor_like or float): polar angle
    phi (tensor_like or float): azimuthal angle
    delta (tensor_like or float): quantum phase

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.U3.compute_matrix(torch.tensor(0.1), torch.tensor(0.2), torch.tensor(0.3))
tensor([[ 0.9988+0.0000j, -0.0477-0.0148j],
        [ 0.0490+0.0099j,  0.8765+0.4788j]])

### `compute_decomposition`

```python
def compute_decomposition(theta: TensorLike, phi: TensorLike, delta: TensorLike, wires: WiresLike) -> list['qp.operation.Operator']
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.U3.decomposition`.

Args:
    theta (TensorLike): polar angle :math:`\theta`
    phi (TensorLike): azimuthal angle :math:`\phi`
    delta (TensorLike): quantum phase :math:`\delta`
    wires (Iterable, Wires): the subsystem the gate acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.U3.compute_decomposition(1.23, 2.34, 3.45, wires=0)
[Rot(3.45, 1.23, -3.45, wires=[0]),
PhaseShift(3.45, wires=[0]),
PhaseShift(2.34, wires=[0])]

### `simplify`

```python
def simplify(self) -> 'U3'
```

Simplifies into :class:`~.RX`, :class:`~.RY`, or :class:`~.PhaseShift` gates
if possible.

>>> qp.U3(0.1, 0, 0, wires=0).simplify()
RY(0.1, wires=[0])
