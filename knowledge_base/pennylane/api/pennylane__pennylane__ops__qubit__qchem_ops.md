---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/qubit/qchem_ops.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/qubit/qchem_ops.py
license: Apache-2.0
---

## Module `pennylane/ops/qubit/qchem_ops.py`

This submodule contains the discrete-variable quantum operations that come
from quantum chemistry applications.

## `SingleExcitation`

```python
class SingleExcitation(Operation)
```

Single excitation rotation.

.. math:: U(\phi) = \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & \cos(\phi/2) & -\sin(\phi/2) & 0 \\
            0 & \sin(\phi/2) & \cos(\phi/2) & 0 \\
            0 & 0 & 0 & 1
        \end{bmatrix}.

This operation performs a rotation in the two-dimensional subspace :math:`\{|01\rangle,
|10\rangle\}`. The name originates from the occupation-number representation of
fermionic wavefunctions, where the transformation  from :math:`|10\rangle` to :math:`|01\rangle`
is interpreted as "exciting" a particle from the first qubit to the second.

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: The ``SingleExcitation`` operator satisfies a four-term parameter-shift rule
  (see Appendix F, https://doi.org/10.1088/1367-2630/ac2cb3):

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int]): the wires the operation acts on
    id (str or None): String representing the operation (optional)

**Example**

The following circuit performs the transformation :math:`|10\rangle\rightarrow \cos(
\phi/2)|10\rangle -\sin(\phi/2)|01\rangle`:

.. code-block::

    dev = qp.device('default.qubit', wires=2)

    @qp.qnode(dev)
    def circuit(phi):
        qp.X(0)
        qp.SingleExcitation(phi, wires=[0, 1])
        return qp.state()

    circuit(0.1)

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.SingleExcitation.matrix`


Args:
  phi (tensor_like or float): rotation angle

Returns:
  tensor_like: canonical matrix

**Example**

>>> qp.SingleExcitation.compute_matrix(torch.tensor(0.5))
tensor([[ 1.0000,  0.0000,  0.0000,  0.0000],
        [ 0.0000,  0.9689, -0.2474,  0.0000],
        [ 0.0000,  0.2474,  0.9689,  0.0000],
        [ 0.0000,  0.0000,  0.0000,  1.0000]])

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> list['qp.operation.Operator']
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.SingleExcitation.decomposition`.

Args:
    phi (TensorLike): rotation angle :math:`\phi`
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.SingleExcitation.compute_decomposition(1.23, wires=(0,1))
[H(0),
 CNOT(wires=[0, 1]),
 RY(-0.615, wires=[0]),
 RY(-0.615, wires=[1]),
 CNOT(wires=[0, 1]),
 H(0)]

## `SingleExcitationMinus`

```python
class SingleExcitationMinus(Operation)
```

Single excitation rotation with negative phase-shift outside the rotation subspace.

.. math:: U_-(\phi) = \begin{bmatrix}
            e^{-i\phi/2} & 0 & 0 & 0 \\
            0 & \cos(\phi/2) & -\sin(\phi/2) & 0 \\
            0 & \sin(\phi/2) & \cos(\phi/2) & 0 \\
            0 & 0 & 0 & e^{-i\phi/2}
        \end{bmatrix}.

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: :math:`\frac{d}{d\phi}f(U_-(\phi)) = \frac{1}{2}\left[f(U_-(\phi+\pi/2)) - f(U_-(\phi-\pi/2))\right]`
  where :math:`f` is an expectation value depending on :math:`U_-(\phi)`.

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int] or int): the wires the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.SingleExcitationMinus.matrix`


Args:
  phi (tensor_like or float): rotation angle

Returns:
  tensor_like: canonical matrix

**Example**

>>> qp.SingleExcitationMinus.compute_matrix(torch.tensor(0.5))
tensor([[ 0.9689-0.2474j,  0.0000+0.0000j,  0.0000+0.0000j,  0.0000+0.0000j],
        [ 0.0000+0.0000j,  0.9689+0.0000j, -0.2474+0.0000j,  0.0000+0.0000j],
        [ 0.0000+0.0000j,  0.2474+0.0000j,  0.9689+0.0000j,  0.0000+0.0000j],
        [ 0.0000+0.0000j,  0.0000+0.0000j,  0.0000+0.0000j,  0.9689-0.2474j]])

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> list['qp.operation.Operator']
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.SingleExcitationMinus.decomposition`.

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.SingleExcitationMinus.compute_decomposition(1.23, wires=(0,1))
[H(1),
 CNOT(wires=[1, 0]),
 RY(0.615, wires=[0]),
 RY(0.615, wires=[1]),
 CY(wires=[1, 0]),
 S(1),
 H(1),
 RZ(0.615, wires=[1]),
 CNOT(wires=[0, 1]),
 GlobalPhase(0.3075, wires=[])]

## `SingleExcitationPlus`

```python
class SingleExcitationPlus(Operation)
```

Single excitation rotation with positive phase-shift outside the rotation subspace.

.. math:: U_+(\phi) = \begin{bmatrix}
            e^{i\phi/2} & 0 & 0 & 0 \\
            0 & \cos(\phi/2) & -\sin(\phi/2) & 0 \\
            0 & \sin(\phi/2) & \cos(\phi/2) & 0 \\
            0 & 0 & 0 & e^{i\phi/2}
        \end{bmatrix}.

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: :math:`\frac{d}{d\phi}f(U_+(\phi)) = \frac{1}{2}\left[f(U_+(\phi+\pi/2)) - f(U_+(\phi-\pi/2))\right]`
  where :math:`f` is an expectation value depending on :math:`U_+(\phi)`.

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int] or int): the wires the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.SingleExcitationPlus.matrix`


Args:
  phi (tensor_like or float): rotation angle

Returns:
  tensor_like: canonical matrix

**Example**

>>> qp.SingleExcitationPlus.compute_matrix(torch.tensor(0.5))
tensor([[ 0.9689+0.2474j,  0.0000+0.0000j,  0.0000+0.0000j,  0.0000+0.0000j],
        [ 0.0000+0.0000j,  0.9689+0.0000j, -0.2474+0.0000j,  0.0000+0.0000j],
        [ 0.0000+0.0000j,  0.2474+0.0000j,  0.9689+0.0000j,  0.0000+0.0000j],
        [ 0.0000+0.0000j,  0.0000+0.0000j,  0.0000+0.0000j,  0.9689+0.2474j]])

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> list['qp.operation.Operator']
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.SingleExcitationPlus.decomposition`.

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> from pprint import pprint
>>> decomp = qp.SingleExcitationPlus.compute_decomposition(1.23, wires=(0,1))
>>> pprint(decomp)
[H(1), CNOT(wires=[1, 0]), RY(0.615, wires=[0]), RY(0.615, wires=[1]), CY(wires=[1, 0]), S(1), H(1), RZ(-0.615, wires=[1]), CNOT(wires=[0, 1]), GlobalPhase(-0.3075, wires=[])]

## `DoubleExcitation`

```python
class DoubleExcitation(Operation)
```

Double excitation rotation.

This operation performs an :math:`SO(2)` rotation in the two-dimensional subspace :math:`\{
|1100\rangle,|0011\rangle\}`. More precisely, it performs the transformation

.. math::

    &|0011\rangle \rightarrow \cos(\phi/2) |0011\rangle + \sin(\phi/2) |1100\rangle\\
    &|1100\rangle \rightarrow \cos(\phi/2) |1100\rangle - \sin(\phi/2) |0011\rangle,

while leaving all other basis states unchanged.

The name originates from the occupation-number representation of fermionic wavefunctions, where
the transformation from :math:`|1100\rangle` to :math:`|0011\rangle` is interpreted as
"exciting" two particles from the first pair of qubits to the second pair of qubits.

**Details:**

* Number of wires: 4
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: The ``DoubleExcitation`` operator satisfies a four-term parameter-shift rule
  (see Appendix F, https://doi.org/10.1088/1367-2630/ac2cb3):

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int]): the wires the operation acts on
    id (str or None): String representing the operation (optional)

**Example**

The following circuit performs the transformation :math:`|1100\rangle\rightarrow \cos(
\phi/2)|1100\rangle - \sin(\phi/2)|0011\rangle)`:

.. code-block::

    dev = qp.device('default.qubit', wires=4)

    @qp.qnode(dev)
    def circuit(phi):
        qp.X(0)
        qp.X(1)
        qp.DoubleExcitation(phi, wires=[0, 1, 2, 3])
        return qp.state()

    circuit(0.1)

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.DoubleExcitation.matrix`


Args:
  phi (tensor_like or float): rotation angle

Returns:
  tensor_like: canonical matrix

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> list['qp.operation.Operator']
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.DoubleExcitation.decomposition`.

For the source of this decomposition, see page 17 of
`"Local, Expressive, Quantum-Number-Preserving VQE Ansatze for Fermionic Systems" <https://doi.org/10.1088/1367-2630/ac2cb3>`_ .

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.DoubleExcitation.compute_decomposition(1.23, wires=(0,1,2,3))
[CNOT(wires=[2, 3]),
CNOT(wires=[0, 2]),
H(3),
H(0),
CNOT(wires=[2, 3]),
CNOT(wires=[0, 1]),
RY(0.15375, wires=[1]),
RY(-0.15375, wires=[0]),
CNOT(wires=[0, 3]),
H(3),
CNOT(wires=[3, 1]),
RY(0.15375, wires=[1]),
RY(-0.15375, wires=[0]),
CNOT(wires=[2, 1]),
CNOT(wires=[2, 0]),
RY(-0.15375, wires=[1]),
RY(0.15375, wires=[0]),
CNOT(wires=[3, 1]),
H(3),
CNOT(wires=[0, 3]),
RY(-0.15375, wires=[1]),
RY(0.15375, wires=[0]),
CNOT(wires=[0, 1]),
CNOT(wires=[2, 0]),
H(0),
H(3),
CNOT(wires=[0, 2]),
CNOT(wires=[2, 3])]

## `DoubleExcitationPlus`

```python
class DoubleExcitationPlus(Operation)
```

Double excitation rotation with positive phase-shift outside the rotation subspace.

This operation performs an :math:`SO(2)` rotation in the two-dimensional subspace :math:`\{
|1100\rangle,|0011\rangle\}` while applying a phase-shift on other states. More precisely,
it performs the transformation

.. math::

    &|0011\rangle \rightarrow \cos(\phi/2) |0011\rangle - \sin(\phi/2) |1100\rangle\\
    &|1100\rangle \rightarrow \cos(\phi/2) |1100\rangle + \sin(\phi/2) |0011\rangle\\
    &|x\rangle \rightarrow e^{i\phi/2} |x\rangle,

for all other basis states :math:`|x\rangle`.

**Details:**

* Number of wires: 4
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: :math:`\frac{d}{d\phi}f(U_+(\phi)) = \frac{1}{2}\left[f(U_+(\phi+\pi/2)) - f(U_+(\phi-\pi/2))\right]`
  where :math:`f` is an expectation value depending on :math:`U_+(\phi)`

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int]): the wires the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.DoubleExcitationPlus.matrix`

Args:
  phi (tensor_like or float): rotation angle

Returns:
  tensor_like: canonical matrix

## `DoubleExcitationMinus`

```python
class DoubleExcitationMinus(Operation)
```

Double excitation rotation with negative phase-shift outside the rotation subspace.

This operation performs an :math:`SO(2)` rotation in the two-dimensional subspace :math:`\{
|1100\rangle,|0011\rangle\}` while applying a phase-shift on other states. More precisely,
it performs the transformation

.. math::

    &|0011\rangle \rightarrow \cos(\phi/2) |0011\rangle - \sin(\phi/2) |1100\rangle\\
    &|1100\rangle \rightarrow \cos(\phi/2) |1100\rangle + \sin(\phi/2) |0011\rangle\\
    &|x\rangle \rightarrow e^{-i\phi/2} |x\rangle,

for all other basis states :math:`|x\rangle`.

**Details:**

* Number of wires: 4
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: :math:`\frac{d}{d\phi}f(U_-(\phi)) = \frac{1}{2}\left[f(U_-(\phi+\pi/2)) - f(U_-(\phi-\pi/2))\right]`
  where :math:`f` is an expectation value depending on :math:`U_-(\phi)`

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int]): the wires the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.DoubleExcitationMinus.matrix`


Args:
  phi (tensor_like or float): rotation angle

Returns:
  tensor_like: canonical matrix

## `OrbitalRotation`

```python
class OrbitalRotation(Operation)
```

Spin-adapted spatial orbital rotation.

For two neighbouring spatial orbitals :math:`\{|\Phi_{0}\rangle, |\Phi_{1}\rangle\}`, this operation
performs the following transformation

.. math::
    &|\Phi_{0}\rangle = \cos(\phi/2)|\Phi_{0}\rangle - \sin(\phi/2)|\Phi_{1}\rangle\\
    &|\Phi_{1}\rangle = \cos(\phi/2)|\Phi_{0}\rangle + \sin(\phi/2)|\Phi_{1}\rangle,

with the same orbital operation applied in the :math:`\alpha` and :math:`\beta` spin orbitals.

.. figure:: ../../_static/qchem/orbital_rotation.jpeg
    :align: center
    :width: 100%
    :target: javascript:void(0);

Here, :math:`G(\phi)` represents a single-excitation Givens rotation and :math:`f\text{SWAP}(\pi)`
represents the fermionic swap operator, implemented in PennyLane as the
:class:`~.SingleExcitation` operation and :class:`~.FermionicSWAP` operation, respectively. This
implementation is a modified version of the one given in `Anselmetti et al. (2021) <https://doi.org/10.1088/1367-2630/ac2cb3>`__\ ,
and is consistent with the Jordan-Wigner mapping in interleaved ordering.

**Details:**

* Number of wires: 4
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: The ``OrbitalRotation`` operator has 4 equidistant frequencies
  :math:`\{0.5, 1, 1.5, 2\}`, and thus permits an 8-term parameter-shift rule.
  (see `Wierichs et al. (2022) <https://doi.org/10.22331/q-2022-03-30-677>`__).

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int]): the wires the operation acts on
    id (str or None): String representing the operation (optional)

**Example**

.. code-block::

    >>> dev = qp.device('default.qubit', wires=4)
    >>> @qp.qnode(dev)
    ... def circuit(phi):
    ...     qp.BasisState(np.array([1, 1, 0, 0]), wires=[0, 1, 2, 3])
    ...     qp.OrbitalRotation(phi, wires=[0, 1, 2, 3])
    ...     return qp.state()
    >>> circuit(0.1)
    array([ 0.        +0.j,  0.        +0.j,  0.        +0.j,
            0.00249792+0.j,  0.        +0.j,  0.        +0.j,
            0.04991671+0.j,  0.        +0.j,  0.        +0.j,
           -0.04991671+0.j,  0.        +0.j,  0.        +0.j,
            0.99750208+0.j,  0.        +0.j,  0.        +0.j,
            0.        +0.j])

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.OrbitalRotation.matrix`


Args:
  phi (tensor_like or float): rotation angle

Returns:
  tensor_like: canonical matrix

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> list['qp.operation.Operator']
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.OrbitalRotation.decomposition`.

This operator is decomposed into two :class:`~.SingleExcitation` gates. For a decomposition
into more elementary gates, see page 18 of
`"Local, Expressive, Quantum-Number-Preserving VQE Ansatze for Fermionic Systems" <https://doi.org/10.1088/1367-2630/ac2cb3>`_ .

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.OrbitalRotation.compute_decomposition(1.2, wires=[0, 1, 2, 3])
[FermionicSWAP(3.141592653589793, wires=[1, 2]), SingleExcitation(1.2, wires=[0, 1]), SingleExcitation(1.2, wires=[2, 3]), FermionicSWAP(3.141592653589793, wires=[1, 2])]

## `FermionicSWAP`

```python
class FermionicSWAP(Operation)
```

Fermionic SWAP rotation.

.. math:: U(\phi) = \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & e^{i \phi/2} \cos(\phi/2) & -ie^{i \phi/2} \sin(\phi/2) & 0 \\
            0 & -ie^{i \phi/2} \sin(\phi/2) & e^{i \phi/2} \cos(\phi/2) & 0 \\
            0 & 0 & 0 & e^{i \phi}
        \end{bmatrix}.

This operation performs a rotation in the adjacent fermionic modes under the Jordan-Wigner mapping,
and is realized by the following transformation of basis states:

.. math::
    &|00\rangle \mapsto |00\rangle\\
    &|01\rangle \mapsto e^{i \phi/2} \cos(\phi/2)|01\rangle - ie^{i \phi/2} \sin(\phi/2)|10\rangle\\
    &|10\rangle \mapsto -ie^{i \phi/2} \sin(\phi/2)|01\rangle + e^{i \phi/2} \cos(\phi/2)|10\rangle\\
    &|11\rangle \mapsto e^{i \phi}|11\rangle,

where qubits in :math:`|0\rangle` and :math:`|1\rangle` states represent a hole and a fermion in
the orbital, respectively. It preserves anti-symmetrization of orbitals by applying a phase factor
of :math:`e^{i \phi/2}` to the state for each qubit initially in :math:`|1\rangle` state. Consequently,
for :math:`\phi=\pi`, the given rotation will essentially perform a SWAP operation on the qubits while
applying a global phase of :math:`-1`, if both qubits are :math:`|1\rangle`.

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: :math:`\frac{d}{d\phi}f(U(\phi)) = \frac{1}{2}\left[f(U(\phi+\pi/2)) - f(U(\phi-\pi/2))\right]`
  where :math:`f` is an expectation value depending on :math:`U(\phi)`

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int]): the wires the operation acts on
    id (str or None): String representing the operation (optional)

**Example**

The following circuit performs the transformation: :math:`|01\rangle \mapsto e^{i \phi/2}
\cos(\phi/2)|01\rangle - ie^{i \phi/2} \sin(\phi/2)|10\rangle`, where :math:`\phi=0.1`:

.. code-block::

    >>> dev = qp.device('default.qubit', wires=2)
    >>> @qp.qnode(dev)
    ... def circuit(phi):
    ...     qp.X(1)
    ...     qp.FermionicSWAP(phi, wires=[0, 1])
    ...     return qp.state()
    >>> circuit(0.1)
    array([0.        +0.j        , 0.99750208+0.04991671j,
           0.00249792-0.04991671j, 0.        +0.j        ])

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.FermionicSWAP.matrix`


Args:
  phi (tensor_like or float): rotation angle

Returns:
  tensor_like: canonical matrix

**Example**

>>> qp.FermionicSWAP.compute_matrix(torch.tensor(0.5))
tensor([[1.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.9388+0.2397j, 0.0612-0.2397j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0612-0.2397j, 0.9388+0.2397j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j, 0.8776+0.4794j]],
       dtype=torch.complex128)

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> list['qp.operation.Operator']
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.FermionicSWAP.decomposition`.

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.FermionicSWAP.compute_decomposition(0.2, wires=(0, 1))
[H(0),
 H(1),
 MultiRZ(0.1, wires=[0, 1]),
 H(0),
 H(1),
 RX(1.5707963267948966, wires=[0]),
 RX(1.5707963267948966, wires=[1]),
 MultiRZ(0.1, wires=[0, 1]),
 RX(-1.5707963267948966, wires=[0]),
 RX(-1.5707963267948966, wires=[1]),
 RZ(0.1, wires=[0]),
 RZ(0.1, wires=[1]),
 Exp(0.1j Identity)]
