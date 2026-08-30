---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/qubit/parametric_ops_multi_qubit.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/qubit/parametric_ops_multi_qubit.py
license: Apache-2.0
---

## Module `pennylane/ops/qubit/parametric_ops_multi_qubit.py`

This submodule contains the discrete-variable quantum operations that are the
core parametrized gates.

## `MultiRZ`

```python
class MultiRZ(Operation)
```

Arbitrary multi Z rotation.

.. math::

    MultiRZ(\theta) = \exp\left(-i \frac{\theta}{2} Z^{\otimes n}\right)

**Details:**

* Number of wires: Any
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: :math:`\frac{d}{d\theta}f(MultiRZ(\theta)) = \frac{1}{2}\left[f(MultiRZ(\theta +\pi/2)) - f(MultiRZ(\theta-\pi/2))\right]`
  where :math:`f` is an expectation value depending on :math:`MultiRZ(\theta)`.

.. note::

    If the ``MultiRZ`` gate is not supported on the targeted device, PennyLane
    will decompose the gate using :class:`~.RZ` and :class:`~.CNOT` gates.

Args:
    theta (TensorLike): rotation angle :math:`\theta`
    wires (Sequence[int] or int): the wires the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(theta: TensorLike, num_wires: int) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.MultiRZ.matrix`

Args:
    theta (TensorLike): rotation angle
    num_wires (int): number of wires the rotation acts on

Returns:
    TensorLike: canonical matrix

**Example**

>>> qp.MultiRZ.compute_matrix(torch.tensor(0.1), 2)
tensor([[0.9988-0.0500j, 0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.9988+0.0500j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 0.9988+0.0500j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j, 0.9988-0.0500j]],
       dtype=torch.complex128)

### `compute_eigvals`

```python
def compute_eigvals(theta: TensorLike, num_wires: int) -> TensorLike
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.MultiRZ.eigvals`


Args:
    theta (TensorLike): rotation angle
    num_wires (int): number of wires the rotation acts on

Returns:
    TensorLike: eigenvalues

**Example**

>>> qp.MultiRZ.compute_eigvals(torch.tensor(0.5), 3)
tensor([0.9689-0.2474j, 0.9689+0.2474j, 0.9689+0.2474j, 0.9689-0.2474j,
        0.9689+0.2474j, 0.9689-0.2474j, 0.9689-0.2474j, 0.9689+0.2474j],
       dtype=torch.complex128)

### `compute_decomposition`

```python
def compute_decomposition(theta: TensorLike, wires: WiresLike, **kwargs) -> list[Operator]
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.MultiRZ.decomposition`.

Args:
    theta (TensorLike): rotation angle :math:`\theta`
    wires (Iterable, Wires): the wires the operation acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.MultiRZ.compute_decomposition(1.2, wires=(0,1))
[CNOT(wires=[1, 0]), RZ(1.2, wires=[0]), CNOT(wires=[1, 0])]

## `PauliRot`

```python
class PauliRot(Operation)
```

Arbitrary Pauli word rotation.

.. math::

    RP(\theta, P) = \exp\left(-i \frac{\theta}{2} P\right)

**Details:**

* Number of wires: Any
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: :math:`\frac{d}{d\theta}f(RP(\theta)) = \frac{1}{2}\left[f(RP(\theta +\pi/2)) - f(RP(\theta-\pi/2))\right]`
  where :math:`f` is an expectation value depending on :math:`RP(\theta)`.

.. note::

    If the ``PauliRot`` gate is not supported on the targeted device, PennyLane
    will decompose the gate using :class:`~.RX`, :class:`~.Hadamard`, :class:`~.RZ`
    and :class:`~.CNOT` gates.

Args:
    theta (float): rotation angle :math:`\theta`
    pauli_word (string): the Pauli word defining the rotation
    wires (Sequence[int] or int): the wire the operation acts on
    id (str or None): String representing the operation (optional)

**Example**

>>> dev = qp.device('default.qubit', wires=1)
>>> @qp.qnode(dev)
... def example_circuit():
...     qp.PauliRot(0.5, 'X',  wires=0)
...     return qp.expval(qp.Z(0))
>>> print(example_circuit())
0.8775825618903724

### `label`

```python
def label(self, decimals: int | None=None, base_label: str | None=None, cache: dict | None=None) -> str
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

>>> op = qp.PauliRot(0.1, "XYY", wires=(0,1,2))
>>> op.label()
'RXYY'
>>> op.label(decimals=2)
'RXYY\n(0.10)'
>>> op.label(base_label="PauliRot")
'PauliRot'

### `compute_matrix`

```python
def compute_matrix(theta: TensorLike, pauli_word: str) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.PauliRot.matrix`


Args:
    theta (TensorLike): rotation angle
    pauli_word (str): string representation of Pauli word

Returns:
    TensorLike: canonical matrix

**Example**

>>> qp.PauliRot.compute_matrix(0.5, 'X')
array([[0.96891242+0.j        , 0.        -0.24740396j],
       [0.        -0.24740396j, 0.96891242+0.j        ]])

### `compute_eigvals`

```python
def compute_eigvals(theta: TensorLike, pauli_word: str) -> TensorLike
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.PauliRot.eigvals`


Returns:
    TensorLike: eigenvalues

**Example**

>>> qp.PauliRot.compute_eigvals(torch.tensor(0.5), "X")
tensor([0.9689-0.2474j, 0.9689+0.2474j], dtype=torch.complex128)

### `compute_decomposition`

```python
def compute_decomposition(theta: TensorLike, wires: WiresLike, pauli_word: str) -> list[Operator]
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.PauliRot.decomposition`.

Args:
    theta (TensorLike): rotation angle :math:`\theta`
    wires (Iterable, Wires): the wires the operation acts on
    pauli_word (string): the Pauli word defining the rotation

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.PauliRot.compute_decomposition(1.2, wires=(0,1), pauli_word="XY")
[H(0), RX(1.5707963267948966, wires=[1]), MultiRZ(1.2, wires=[0, 1]), H(0), RX(-1.5707963267948966, wires=[1])]

## `PCPhase`

```python
class PCPhase(Operation)
```

PCPhase(phi, dim, wires)
A projector-controlled phase gate.

This gate applies a complex phase :math:`e^{i\phi}` to the first :math:`dim`
basis vectors of the input state while applying a complex phase :math:`e^{-i \phi}`
to the remaining basis vectors. For example, consider the 2-qubit case where ``dim = 3``:

.. math:: \Pi(\phi) = \begin{bmatrix}
            e^{i\phi} & 0 & 0 & 0 \\
            0 & e^{i\phi} & 0 & 0 \\
            0 & 0 & e^{i\phi} & 0 \\
            0 & 0 & 0 & e^{-i\phi}
        \end{bmatrix}.

This can also be written as :math:`\Pi(\phi) = \exp(i\phi(2\Pi-\mathbb{I}_N))`, where
:math:`N=2^n` is the Hilbert space dimension for :math:`n` qubits and :math:`\Pi` is
the diagonal projector with ``dim`` ones and ``N-dim`` zeros.

**Details:**

* Number of wires: Any (the operation can act on any number of wires)
* Number of parameters: 1
* Number of dimensions per parameter: (0,)

Args:
    phi (float): rotation angle :math:`\phi`
    dim (int): the dimension of the subspace
    wires (Iterable[int, str], Wires): the wires the operation acts on
    id (str or None): String representing the operation (optional)

**Example:**

We can define a circuit using :class:`~.PCPhase` as follows:

>>> op_3 = qp.PCPhase(0.27, dim = 3, wires=range(3))

The resulting operation applies a complex phase :math:`e^{0.27i}` to the first :math:`dim = 3`
basis vectors and :math:`e^{-0.27i}` to the remaining basis vectors, as we can see from
the diagonal of the matrix for this circuit.

>>> print(np.round(np.diag(qp.matrix(op_3)),2))
[0.96+0.27j 0.96+0.27j 0.96+0.27j 0.96-0.27j 0.96-0.27j 0.96-0.27j
 0.96-0.27j 0.96-0.27j]

We can also choose a different ``dim`` value to apply the phase shift to a different set of
basis vectors as follows:

>>> op_7 = qp.PCPhase(1.23, dim=7, wires=[1, 2, 3])
>>> print(np.round(np.diag(qp.matrix(op_7)),2))
[0.33+0.94j 0.33+0.94j 0.33+0.94j 0.33+0.94j 0.33+0.94j 0.33+0.94j
 0.33+0.94j 0.33-0.94j]

``PCPhase`` operations are decomposed into (multi-)controlled :class:`~.PhaseShift`
operations which share the same control values on common control wires, and Pauli-X operations,
possibly complemented by a global phase.

>>> op_13 = qp.PCPhase(1.23, dim=13, wires=[1, 2, 3, 4])
>>> print(qp.draw(op_13.decomposition)())
1: ─╭●─────────╭●───────────╭GlobalPhase(-1.23)─┤
2: ─╰Rϕ(-2.46)─├●───────────├GlobalPhase(-1.23)─┤
3: ────────────├○───────────├GlobalPhase(-1.23)─┤
4: ──X─────────╰Rϕ(2.46)──X─╰GlobalPhase(-1.23)─┤

If ``dim`` is a power of two, a single (multi-controlled) ``PhaseShift`` gate is sufficient:

>>> op_16 = qp.PCPhase(1.23, dim=16, wires=range(6))
>>> print(qp.draw(op_16.decomposition, wire_order=range(6), show_all_wires=True)())
0: ────╭○───────────╭GlobalPhase(1.23)─┤
1: ──X─╰Rϕ(2.46)──X─├GlobalPhase(1.23)─┤
2: ─────────────────├GlobalPhase(1.23)─┤
3: ─────────────────├GlobalPhase(1.23)─┤
4: ─────────────────├GlobalPhase(1.23)─┤
5: ─────────────────╰GlobalPhase(1.23)─┤

### `generator`

```python
def generator(self) -> 'qp.Hermitian'
```

Generator of the ``PCPhase`` operator, which is in single-parameter-form.
The operator reads

.. math:: \Pi(\phi) = e^{i\phi (2\Pi - \mathbb{I}_N)},

where :math:`\Pi` is the projector onto the first :math`d` (``dim``) computational basis
states and :math:`N=2^n` is the Hilbert space dimension for :math:`n` qubits.

Correspondingly, the generator is
:math:`2\Pi - \mathbb{I}_N=\text{diag}(\underset{d\text{ times}}{\underbrace{1, \dots, 1}},\underset{(N-d)\text{ times}}{\underbrace{-1, \dots, -1}})`:

>>> qp.PCPhase(0.5, dim=3, wires=[0, 1]).generator()
Hermitian(array([[ 1,  0,  0,  0],
   [ 0,  1,  0,  0],
   [ 0,  0,  1,  0],
   [ 0,  0,  0, -1]]), wires=[0, 1])

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike, dimension: tuple[int, int]) -> TensorLike
```

Get the matrix representation of Pi-controlled phase unitary.

### `compute_eigvals`

```python
def compute_eigvals(*params: TensorLike, **hyperparams) -> TensorLike
```

Get the eigvals for the Pi-controlled phase unitary.

### `compute_decomposition`

```python
def compute_decomposition(*params: TensorLike, wires: WiresLike, **hyperparams) -> list[Operator]
```

Representation of the PCPhase operator as a product of other operators (static method).

Args:
    *params (list): trainable parameters of the operator, as stored in the
        ``parameters`` attribute
    wires (Iterable[Any], Wires): wires that the operator acts on
    **hyperparams (dict): non-trainable hyper-parameters of the operator,
        as stored in the ``hyperparameters`` attribute

Returns:
    list[Operator]: decomposition of the operator

In short, this decomposition relies on decomposing the generator (see :meth:`~.generator`)
of the ``PCPhase`` gate into generators of multicontrolled :class:`~.PhaseShift` gates,
potentially complemented with (non-controlled) Pauli-X gates and/or a global phase.
For example, for ``dim=13`` on four qubits:

>>> op_13 = qp.PCPhase(1.23, dim=13, wires=[1, 2, 3, 4])
>>> print(qp.draw(op_13.decomposition)())
1: ─╭●─────────╭●───────────╭GlobalPhase(-1.23)─┤
2: ─╰Rϕ(-2.46)─├●───────────├GlobalPhase(-1.23)─┤
3: ────────────├○───────────├GlobalPhase(-1.23)─┤
4: ──X─────────╰Rϕ(2.46)──X─╰GlobalPhase(-1.23)─┤

In the following we provide a detailed example for illustration purposes.

**Detailed example**

Consider the projector-controlled phase gate on :math:`n=4` qubits and with
:math:`d=\texttt{dim}=3`, i.e,

>>> op_3 = qp.PCPhase(1.23, dim=3, wires=[0, 1, 2, 3])

It acts on :math:`N=2^n=16`-dimensional vectors and is described by

.. math:: \Pi(\phi) = \exp(i\phi G) = \exp(i\phi(2\Pi-\mathbb{I}_N)),

where :math:`G` is a diagonal matrix with :math:`d=3` ones, followed by
:math:`2^n-d = 16 - 3=13` negative ones. Accordingly, :math:`\Pi` is diagonal with
:math:`3` ones and :math:`13` zeros.

First, we implement the global phase generated by :math:`\mathbb{I}_N` with
a :class:`~.GlobalPhase` gate with angle :math:`-\phi`.
Then we decompose :math:`d` into powers of two with positive or negative sign, via
:math:`d=3=4-1 = 2^2-2^0`. This decomposition tells us that we can write the
target gate with two (multi-)controlled phase shift gates. For this, we rewrite
the projector :math:`\Pi` according to the decomposition as

.. math::

    \Pi &= \text{diag}(1, 1, 1, 0, 0, \dots, 0)\\
    &=\text{diag}(1, 1, 1, 1, 0, \dots, 0)
    -\text{diag}(0, 0, 0, 1, 0, \dots, 0)

where :math:`0,\dots, 0` indicates :math:`12` zeros each time.
How do we realize this projector decomposition on the gate level?

A singly-controlled phase shift gate applies a phase to a quarter of all computational
basis states (the control filters by the state of one qubit, and the phase shift gate
itself filters by the :math:`|1\rangle` state of the target qubit, cutting the number
of states we are acting on in half each time).
For :math:`n=4`, this amounts to :math:`2^4/4=4` states, which is exactly
what we need for the first term above. To apply the phase to the *first* four states,
:math:`|0000\rangle`, :math:`|0001\rangle`, :math:`|0010\rangle`, and :math:`|0011\rangle`,
we want to "filter by" the first two qubits being in the :math:`|0\rangle` state.
For qubit :math:`0`, we do this by controlling on the :math:`|0\rangle` state.
For qubit :math:`1`, we pick it as the target of the controlled phase shift operation.
Generically, this would make it act on the :math:`|1\rangle` state, so we simply flip
qubit :math:`1` before and after the operation to apply the phase to the :math:`|0\rangle`
state instead.
Thus, we conclude this first step by applying the gates
``qp.X(1)``, ``qp.ctrl(qp.PhaseShift(2 * phi, 1), control=[0], control_values=[0])``,
and ``qp.X(1)``.

Next, we implement the second term in the projector decomposition, applying a phase
to a single computational basis state. This requires us to fully control a phase shift
gate, i.e., we use the last qubit as target and the other three as controls (there is
some freedom of choice here, but this is a convenient choice).
We want to apply the phase to the state :math:`|3\rangle=|0011\rangle`. So the controls
:math:`0` and :math:`1` are set to zero and the control :math:`2` is set to one.
As we want to effect the phase onto the :math:`|1\rangle` state of qubit :math:`3`,
we don't need to flip the target bit as we did before. However, given the negative sign
in the projector decomposition, we need to multiply the phase with :math:`-1`.
Overall, we apply the gate
``qp.ctrl(qp.PhaseShift(-2 * phi, 3), control=[0, 1, 2], control_values=[0, 0, 1])``,
which concludes the decomposition, now reading:

>>> print(qp.draw(op_3.decomposition)())
0: ────╭○───────────╭○─────────╭GlobalPhase(1.23)─┤
1: ──X─╰Rϕ(2.46)──X─├○─────────├GlobalPhase(1.23)─┤
2: ─────────────────├●─────────├GlobalPhase(1.23)─┤
3: ─────────────────╰Rϕ(-2.46)─╰GlobalPhase(1.23)─┤

### `adjoint`

```python
def adjoint(self) -> 'PCPhase'
```

Computes the adjoint of the operator.

### `pow`

```python
def pow(self, z: int | float) -> list[Operator]
```

Computes the operator raised to z.

### `simplify`

```python
def simplify(self) -> 'PCPhase'
```

Simplifies the operator if possible.

### `label`

```python
def label(self, decimals: int | None=None, base_label: str | None=None, cache: dict | None=None) -> str
```

The label of the operator when displayed in a circuit.

## `IsingXX`

```python
class IsingXX(Operation)
```

Ising XX coupling gate

.. math:: XX(\phi) = \exp\left(-i \frac{\phi}{2} (X \otimes X)\right) =
    \begin{bmatrix} =
        \cos(\phi / 2) & 0 & 0 & -i \sin(\phi / 2) \\
        0 & \cos(\phi / 2) & -i \sin(\phi / 2) & 0 \\
        0 & -i \sin(\phi / 2) & \cos(\phi / 2) & 0 \\
        -i \sin(\phi / 2) & 0 & 0 & \cos(\phi / 2)
    \end{bmatrix}.

.. note::

    Special cases of using the :math:`XX` operator include:

    * :math:`XX(0) = I`;
    * :math:`XX(\pi) = i (X \otimes X)`.

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: :math:`\frac{d}{d\phi}f(XX(\phi)) = \frac{1}{2}\left[f(XX(\phi +\pi/2)) - f(XX(\phi-\pi/2))\right]`
  where :math:`f` is an expectation value depending on :math:`XX(\phi)`.

Args:
    phi (float): the phase angle
    wires (int): the subsystem the gate acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.

.. seealso:: :meth:`~.IsingXX.matrix`


Args:
   phi (TensorLike): phase angle

Returns:
   TensorLike: canonical matrix

**Example**

>>> qp.IsingXX.compute_matrix(torch.tensor(0.5))
tensor([[0.9689+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j, 0.0000-0.2474j],
        [0.0000+0.0000j, 0.9689+0.0000j, 0.0000-0.2474j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000-0.2474j, 0.9689+0.0000j, 0.0000+0.0000j],
        [0.0000-0.2474j, 0.0000+0.0000j, 0.0000+0.0000j, 0.9689+0.0000j]],
       dtype=torch.complex128)

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> list[Operator]
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.IsingXX.decomposition`.

Args:
    phi (TensorLike): the phase angle
    wires (Iterable, Wires): the subsystem the gate acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.IsingXX.compute_decomposition(1.23, wires=(0,1))
[CNOT(wires=[0, 1]), RX(1.23, wires=[0]), CNOT(wires=[0, 1])]

## `IsingYY`

```python
class IsingYY(Operation)
```

Ising YY coupling gate

.. math:: \mathtt{YY}(\phi) = \exp\left(-i \frac{\phi}{2} (Y \otimes Y)\right) =
    \begin{bmatrix}
        \cos(\phi / 2) & 0 & 0 & i \sin(\phi / 2) \\
        0 & \cos(\phi / 2) & -i \sin(\phi / 2) & 0 \\
        0 & -i \sin(\phi / 2) & \cos(\phi / 2) & 0 \\
        i \sin(\phi / 2) & 0 & 0 & \cos(\phi / 2)
    \end{bmatrix}.

.. note::

    Special cases of using the :math:`YY` operator include:

    * :math:`YY(0) = I`;
    * :math:`YY(\pi) = i (Y \otimes Y)`.

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: :math:`\frac{d}{d\phi}f(YY(\phi)) = \frac{1}{2}\left[f(YY(\phi +\pi/2)) - f(YY(\phi-\pi/2))\right]`
  where :math:`f` is an expectation value depending on :math:`YY(\phi)`.

Args:
    phi (float): the phase angle
    wires (int): the subsystem the gate acts on
    id (str or None): String representing the operation (optional)

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> list[Operator]
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.IsingYY.decomposition`.

Args:
    phi (float): the phase angle
    wires (Iterable, Wires): the subsystem the gate acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.IsingYY.compute_decomposition(1.23, wires=(0,1))
[CY(wires=[0, 1]), RY(1.23, wires=[0]), CY(wires=[0, 1])]

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.IsingYY.matrix`


Args:
   phi (TensorLike): phase angle

Returns:
   TensorLike: canonical matrix

**Example**

>>> qp.IsingYY.compute_matrix(torch.tensor(0.5))
tensor([[0.9689+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.2474j],
        [0.0000+0.0000j, 0.9689+0.0000j, 0.0000-0.2474j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000-0.2474j, 0.9689+0.0000j, 0.0000+0.0000j],
        [0.0000+0.2474j, 0.0000+0.0000j, 0.0000+0.0000j, 0.9689+0.0000j]],
       dtype=torch.complex128)

## `IsingZZ`

```python
class IsingZZ(Operation)
```

Ising ZZ coupling gate

.. math:: ZZ(\phi) = \exp\left(-i \frac{\phi}{2} (Z \otimes Z)\right) =
    \begin{bmatrix}
        e^{-i \phi / 2} & 0 & 0 & 0 \\
        0 & e^{i \phi / 2} & 0 & 0 \\
        0 & 0 & e^{i \phi / 2} & 0 \\
        0 & 0 & 0 & e^{-i \phi / 2}
    \end{bmatrix}.

.. note::

    Special cases of using the :math:`ZZ` operator include:

    * :math:`ZZ(0) = I`;
    * :math:`ZZ(\pi) = - (Z \otimes Z)`;
    * :math:`ZZ(2\pi) = - I`;

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: :math:`\frac{d}{d\phi}f(ZZ(\phi)) = \frac{1}{2}\left[f(ZZ(\phi +\pi/2)) - f(ZZ(\phi-\pi/2))\right]`
  where :math:`f` is an expectation value depending on :math:`ZZ(\theta)`.

Args:
    phi (float): the phase angle
    wires (int): the subsystem the gate acts on
    id (str or None): String representing the operation (optional)

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike)
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.IsingZZ.decomposition`.

Args:
    phi (float): the phase angle
    wires (Iterable, Wires): the subsystem the gate acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.IsingZZ.compute_decomposition(1.23, wires=[0, 1])
[CNOT(wires=[0, 1]), RZ(1.23, wires=[1]), CNOT(wires=[0, 1])]

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.IsingZZ.matrix`


Args:
   phi (TensorLike): phase angle

Returns:
   TensorLike: canonical matrix

**Example**

>>> qp.IsingZZ.compute_matrix(torch.tensor(0.5))
tensor([[0.9689-0.2474j, 0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.9689+0.2474j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 0.9689+0.2474j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j, 0.9689-0.2474j]])

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

.. seealso:: :meth:`~.IsingZZ.eigvals`


Args:
    phi (TensorLike) phase angle

Returns:
    TensorLike: eigenvalues

**Example**

>>> qp.IsingZZ.compute_eigvals(torch.tensor(0.5))
tensor([0.9689-0.2474j, 0.9689+0.2474j, 0.9689+0.2474j, 0.9689-0.2474j])

## `IsingXY`

```python
class IsingXY(Operation)
```

Ising (XX + YY) coupling gate

.. math:: \mathtt{XY}(\phi) = \exp\left(i \frac{\phi}{4} (X \otimes X + Y \otimes Y)\right) =
    \begin{bmatrix}
        1 & 0 & 0 & 0 \\
        0 & \cos(\phi / 2) & i \sin(\phi / 2) & 0 \\
        0 & i \sin(\phi / 2) & \cos(\phi / 2) & 0 \\
        0 & 0 & 0 & 1
    \end{bmatrix}.

.. note::

    Special cases of using the :math:`XY` operator include:

    * :math:`XY(0) = I`;
    * :math:`XY(\frac{\pi}{2}) = \sqrt{iSWAP}`;
    * :math:`XY(\pi) = iSWAP`;

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: The XY operator satisfies a four-term parameter-shift rule

  .. math::
      \frac{d}{d \phi} f(XY(\phi))
      = c_+ \left[ f(XY(\phi + a)) - f(XY(\phi - a)) \right]
      - c_- \left[ f(XY(\phi + b)) - f(XY(\phi - b)) \right]

  where :math:`f` is an expectation value depending on :math:`XY(\phi)`, and

  - :math:`a = \pi / 2`
  - :math:`b = 3 \pi / 2`
  - :math:`c_{\pm} = (\sqrt{2} \pm 1)/{4 \sqrt{2}}`

Args:
    phi (float): the phase angle
    wires (int): the subsystem the gate acts on
    id (str or None): String representing the operation (optional)

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> list[Operator]
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.IsingXY.decomposition`.

Args:
    phi (float): the phase angle
    wires (Iterable, Wires): the subsystem the gate acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.IsingXY.compute_decomposition(1.23, wires=(0,1))
[H(0), CY(wires=[0, 1]), RY(0.615, wires=[0]), RX(-0.615, wires=[1]), CY(wires=[0, 1]), H(0)]

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.IsingXY.matrix`


Args:
   phi (TensorLike): phase angle

Returns:
   TensorLike: canonical matrix

**Example**

>>> qp.IsingXY.compute_matrix(0.5)
array([[1.        +0.j        , 0.        +0.j        ,        0.        +0.j        , 0.        +0.j        ],
       [0.        +0.j        , 0.96891242+0.j        ,        0.        +0.24740396j, 0.        +0.j        ],
       [0.        +0.j        , 0.        +0.24740396j,        0.96891242+0.j        , 0.        +0.j        ],
       [0.        +0.j        , 0.        +0.j        ,        0.        +0.j        , 1.        +0.j        ]])

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

.. seealso:: :meth:`~.IsingXY.eigvals`


Args:
    phi (TensorLike): phase angle

Returns:
    TensorLike: eigenvalues

**Example**

>>> qp.IsingXY.compute_eigvals(0.5)
array([0.96891242+0.24740396j, 0.96891242-0.24740396j,       1.        +0.j        , 1.        +0.j        ])

## `PSWAP`

```python
class PSWAP(Operation)
```

Phase SWAP gate

.. math:: PSWAP(\phi) = \begin{bmatrix}
        1 & 0 & 0 & 0 \\
        0 & 0 & e^{i \phi} & 0 \\
        0 & e^{i \phi} & 0 & 0 \\
        0 & 0 & 0 & 1
    \end{bmatrix}.

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Gradient recipe:

.. math::
    \frac{d}{d \phi} PSWAP(\phi)
    = \frac{1}{2} \left[ PSWAP(\phi + \pi / 2) - PSWAP(\phi - \pi / 2) \right]

Args:
    phi (float): the phase angle
    wires (int): the subsystem the gate acts on
    id (str or None): String representing the operation (optional)

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> list[Operator]
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.PSWAP.decomposition`.

Args:
    phi (float): the phase angle
    wires (Iterable, Wires): the subsystem the gate acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.PSWAP.compute_decomposition(1.23, wires=(0,1))
[SWAP(wires=[0, 1]), CNOT(wires=[0, 1]), PhaseShift(1.23, wires=[1]), CNOT(wires=[0, 1])]

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.PSWAP.matrix`


Args:
   phi (TensorLike): phase angle

Returns:
   TensorLike: canonical matrix

**Example**

>>> qp.PSWAP.compute_matrix(0.5)
array([[1.        +0.j        , 0.        +0.j        ,
        0.        +0.j        , 0.        +0.j        ],
       [0.        +0.j        , 0.        +0.j        ,
        0.87758256+0.47942554j, 0.        +0.j        ],
       [0.        +0.j        , 0.87758256+0.47942554j,
        0.        +0.j        , 0.        +0.j        ],
       [0.        +0.j        , 0.        +0.j        ,
        0.        +0.j        , 1.        +0.j        ]])

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

.. seealso:: :meth:`~.PSWAP.eigvals`


Args:
    phi (TensorLike): phase angle

Returns:
    TensorLike: eigenvalues

**Example**

>>> qp.PSWAP.compute_eigvals(0.5)
array([ 1.        +0.j        ,  1.        +0.j        ,
       -0.87758256-0.47942554j,  0.87758256+0.47942554j])

## `CPhaseShift00`

```python
class CPhaseShift00(Operation)
```

A qubit controlled phase shift.

.. math:: CR_{00}(\phi) = \begin{bmatrix}
            e^{i\phi} & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            0 & 0 & 0 & 1
        \end{bmatrix}.

.. note:: The first wire provided corresponds to the **control qubit** and controls
    on the zero state :math:`|0\rangle`.

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe:

.. math::
    \frac{d}{d \phi} CR_{00}(\phi)
    = \frac{1}{2} \left[ CR_{00}(\phi + \pi / 2)
        - CR_{00}(\phi - \pi / 2) \right]

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int]): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.CPhaseShift00.matrix`

Args:
    phi (TensorLike): phase shift

Returns:
    TensorLike: canonical matrix

**Example**

>>> qp.CPhaseShift00.compute_matrix(torch.tensor(0.5))
tensor([[0.8776+0.4794j, 0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 1.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 1.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j, 1.0000+0.0000j]])

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

.. seealso:: :meth:`~.CPhaseShift00.eigvals`


Args:
    phi (TensorLike): phase shift

Returns:
    TensorLike: eigenvalues

**Example**

>>> qp.CPhaseShift00.compute_eigvals(torch.tensor(0.5))
tensor([0.8776+0.4794j, 1.0000+0.0000j, 1.0000+0.0000j, 1.0000+0.0000j])

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> list[Operator]
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.CPhaseShift00.decomposition`.

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.CPhaseShift00.compute_decomposition(1.234, wires=(0,1))
[X(0),
X(1),
PhaseShift(0.617, wires=[0]),
PhaseShift(0.617, wires=[1]),
CNOT(wires=[0, 1]),
PhaseShift(-0.617, wires=[1]),
CNOT(wires=[0, 1]),
X(1),
X(0)]

### `control_values`

```python
def control_values(self) -> str
```

str: The control values of the operation

## `CPhaseShift01`

```python
class CPhaseShift01(Operation)
```

A qubit controlled phase shift.

.. math:: CR_{01\phi}(\phi) = \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & e^{i\phi} & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            0 & 0 & 0 & 1
        \end{bmatrix}.

.. note:: The first wire provided corresponds to the **control qubit** and controls
    on the zero state :math:`|0\rangle`.

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe:

.. math::
    \frac{d}{d \phi} CR_{01}(\phi)
    = \frac{1}{2} \left[ CR_{01}(\phi + \pi / 2)
        - CR_{01}(\phi - \pi / 2) \right]

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int]): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.CPhaseShift01.matrix`

Args:
    phi (TensorLike): phase shift

Returns:
    TensorLike: canonical matrix

**Example**

>>> qp.CPhaseShift01.compute_matrix(torch.tensor(0.5))
tensor([[1.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.8776+0.4794j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 1.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j, 1.0000+0.0000j]])

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

.. seealso:: :meth:`~.CPhaseShift01.eigvals`


Args:
    phi (TensorLike): phase shift

Returns:
    TensorLike: eigenvalues

**Example**

>>> qp.CPhaseShift01.compute_eigvals(torch.tensor(0.5))
tensor([1.0000+0.0000j, 0.8776+0.4794j, 1.0000+0.0000j, 1.0000+0.0000j])

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> list[Operator]
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.
.. seealso:: :meth:`~.CPhaseShift01.decomposition`.

Args:
    phi (Tensorlike): rotation angle :math:`\phi`
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.CPhaseShift01.compute_decomposition(1.234, wires=(0,1))
[X(0),
PhaseShift(0.617, wires=[0]),
PhaseShift(0.617, wires=[1]),
CNOT(wires=[0, 1]),
PhaseShift(-0.617, wires=[1]),
CNOT(wires=[0, 1]),
X(0)]

### `control_values`

```python
def control_values(self) -> str
```

str: The control values of the operation

## `CPhaseShift10`

```python
class CPhaseShift10(Operation)
```

A qubit controlled phase shift.

.. math:: CR_{10\phi}(\phi) = \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 0 & e^{i\phi} & 0 \\
            0 & 0 & 0 & 1
        \end{bmatrix}.

.. note:: The first wire provided corresponds to the **control qubit**.

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe:

.. math::
    \frac{d}{d \phi} CR_{10}(\phi)
    = \frac{1}{2} \left[ CR_{10}(\phi + \pi / 2)
        - CR_{10}(\phi - \pi / 2) \right]

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Any, Wires): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(phi: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.CPhaseShift10.matrix`

Args:
    phi (TensorLike): phase shift

Returns:
    TensorLike: canonical matrix

**Example**

>>> qp.CPhaseShift10.compute_matrix(torch.tensor(0.5))
tensor([[1.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 1.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 0.8776+0.4794j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j, 1.0000+0.0000j]])

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

.. seealso:: :meth:`~.CPhaseShift10.eigvals`


Args:
    phi (TensorLike): phase shift

Returns:
    TensorLike: eigenvalues

**Example**

>>> qp.CPhaseShift10.compute_eigvals(torch.tensor(0.5))
tensor([1.0000+0.0000j, 1.0000+0.0000j, 0.8776+0.4794j, 1.0000+0.0000j])

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> list[Operator]
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.
.. seealso:: :meth:`~.CPhaseShift10.decomposition`.

Args:
    phi (TensorLike): rotation angle :math:`\phi`
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.CPhaseShift10.compute_decomposition(1.234, wires=(0,1))
[X(1),
PhaseShift(0.617, wires=[0]),
PhaseShift(0.617, wires=[1]),
CNOT(wires=[0, 1]),
PhaseShift(-0.617, wires=[1]),
CNOT(wires=[0, 1]),
X(1)]
