---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/two_qubit/two_qubit_decompose.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/two_qubit/two_qubit_decompose.py
license: Apache-2.0
---

## Module `qiskit/synthesis/two_qubit/two_qubit_decompose.py`

Expand 2-qubit Unitary operators into an equivalent
decomposition over SU(2)+fixed 2q basis gate, using the KAK method.

May be exact or approximate expansion. In either case uses the minimal
number of basis applications.

Method is described in Appendix B of Cross, A. W., Bishop, L. S., Sheldon, S., Nation, P. D. &
Gambetta, J. M. Validating quantum computers using randomized model circuits.
arXiv:1811.12926 [quant-ph] (2018).

## `decompose_two_qubit_product_gate`

```python
def decompose_two_qubit_product_gate(special_unitary_matrix: np.ndarray)
```

Decompose :math:`U = U_l \otimes U_r` where :math:`U \in SU(4)`,
and :math:`U_l,~U_r \in SU(2)`.

Args:
    special_unitary_matrix: special unitary matrix to decompose
Raises:
    QiskitError: if decomposition isn't possible.

## `TwoQubitWeylDecomposition`

```python
class TwoQubitWeylDecomposition
```

Two-qubit Weyl decomposition.

Decompose two-qubit unitary

.. math::

    U = ({K_1}^l \otimes {K_1}^r) e^{(i a XX + i b YY + i c ZZ)} ({K_2}^l \otimes {K_2}^r)

where

.. math::

    U \in U(4),~
    {K_1}^l, {K_1}^r, {K_2}^l, {K_2}^r \in SU(2)

and we stay in the "Weyl Chamber"

.. math::

    \pi /4 \geq a \geq b \geq |c|

This class avoids some problems of numerical instability near high-symmetry loci within the Weyl
chamber. If there is a high-symmetry gate "nearby" (in terms of the requested average gate fidelity),
then it returns a canonicalized decomposition of that high-symmetry gate.

References:
    1. Cross, A. W., Bishop, L. S., Sheldon, S., Nation, P. D. & Gambetta, J. M.,
       *Validating quantum computers using randomized model circuits*,
       `arXiv:1811.12926 [quant-ph] <https://arxiv.org/abs/1811.12926>`_
    2. B. Kraus, J. I. Cirac, *Optimal Creation of Entanglement Using a Two-Qubit Gate*,
       `arXiv:0011050 [quant-ph] <https://arxiv.org/abs/quant-ph/0011050>`_
    3. B. Drury, P. J. Love, *Constructive Quantum Shannon Decomposition from Cartan
       Involutions*, `arXiv:0806.4015 [quant-ph] <https://arxiv.org/abs/0806.4015>`_

### `specialize`

```python
def specialize(self)
```

Make changes to the decomposition to comply with any specializations.

This method will always raise a ``NotImplementedError`` because
there are no specializations to comply with in the current implementation.

### `circuit`

```python
def circuit(self, *, euler_basis: str | None=None, simplify: bool=False, atol: float=DEFAULT_ATOL) -> QuantumCircuit
```

Returns Weyl decomposition in circuit form.

### `actual_fidelity`

```python
def actual_fidelity(self, **kwargs) -> float
```

Calculates the actual fidelity of the decomposed circuit to the input unitary.

### `__repr__`

```python
def __repr__(self)
```

Represent with enough precision to allow copy-paste debugging of all corner cases

### `from_bytes`

```python
def from_bytes(cls, bytes_in: bytes, *, requested_fidelity: float, _specialization: two_qubit_decompose.Specialization | None=None, **kwargs) -> TwoQubitWeylDecomposition
```

Decode bytes into :class:`.TwoQubitWeylDecomposition`.

## `TwoQubitControlledUDecomposer`

```python
class TwoQubitControlledUDecomposer
```

Decompose a general two-qubit unitary in terms of a target two-qubit gate,
that is locally equivalent to an :class:`.RXXGate`.

**Synthesis algorithm**

Any two-qubit unitary :math:`U` can be written, through its canonical (Weyl) decomposition
(see :class:`.TwoQubitWeylDecomposition`), as a Weyl gate :math:`U_d(a, b, c)` surrounded by
four single-qubit unitary gates:

.. code-block:: text

         ┌─────┐┌───────┐┌─────┐
    q_0: ┤ c2r ├┤0      ├┤ c1r ├
         ├─────┤│  Weyl │├─────┤
    q_1: ┤ c2l ├┤1      ├┤ c1l ├
         └─────┘└───────┘└─────┘

The Weyl gate factorizes into a product of three two-qubit rotations,
:math:`U_d(a, b, c) = R_{XX}(a)\, R_{YY}(b)\, R_{ZZ}(c)`:

.. code-block:: text

         ┌─────────┐┌─────────┐
    q_0: ┤0        ├┤0        ├─■──────
         │  Rxx(a) ││  Ryy(b) │ │ZZ(c)
    q_1: ┤1        ├┤1        ├─■──────
         └─────────┘└─────────┘

The :math:`R_{YY}` and :math:`R_{ZZ}` rotations are then mapped onto :math:`R_{XX}`
rotations using single-qubit basis changes. With
:math:`R_{YY}(b) = (S^\dagger \otimes S^\dagger)\, R_{XX}(b)\, (S \otimes S)`:

.. code-block:: text

         ┌─────┐┌─────────┐┌───┐
    q_0: ┤ Sdg ├┤0        ├┤ S ├
         ├─────┤│  Rxx(b) │├───┤
    q_1: ┤ Sdg ├┤1        ├┤ S ├
         └─────┘└─────────┘└───┘

and :math:`R_{ZZ}(c) = (H \otimes H)\, R_{XX}(c)\, (H \otimes H)`:

.. code-block:: text

         ┌───┐┌─────────┐┌───┐
    q_0: ┤ H ├┤0        ├┤ H ├
         ├───┤│  Rxx(c) │├───┤
    q_1: ┤ H ├┤1        ├┤ H ├
         └───┘└─────────┘└───┘

Finally, each :math:`R_{XX}` rotation is realized with the user-supplied gate that is
locally equivalent to :class:`.RXXGate` (the ``rxx_equivalent_gate``), wrapped by the
single-qubit gates that account for the local equivalence and for any scaling of the
rotation angle. After every rotation is expanded, all single-qubit gates that fall between
two consecutive two-qubit gates are multiplied together and consolidated, so the
synthesized circuit uses at most three applications of ``rxx_equivalent_gate`` and at most
eight single-qubit unitary gates:

.. code-block:: text

         ┌─────┐┌───────────┐┌─────┐┌───────────┐┌─────┐┌───────────┐┌─────┐
    q_0: ┤ d2r ├┤0          ├┤ d1r ├┤0          ├┤ e1r ├┤0          ├┤ f1r ├
         ├─────┤│  Equiv(a) │├─────┤│  Equiv(b) │├─────┤│  Equiv(c) │├─────┤
    q_1: ┤ d2l ├┤1          ├┤ d1l ├┤1          ├┤ e1l ├┤1          ├┤ f1l ├
         └─────┘└───────────┘└─────┘└───────────┘└─────┘└───────────┘└─────┘

Here ``Equiv(a)``, ``Equiv(b)`` and ``Equiv(c)`` are the user-supplied
``rxx_equivalent_gate`` (the gate locally equivalent to :class:`.RXXGate`) realizing the
:math:`R_{XX}(a)`, :math:`R_{XX}(b)` and :math:`R_{XX}(c)` rotations, and the remaining
boxes are the consolidated single-qubit unitary gates.

The number of two-qubit gates actually emitted depends on the Weyl parameters of the
target: rotations with a vanishing angle are dropped, so unitaries that are closer to a
single or two instances of :class:`.RXXGate` use one or two applications of ``rxx_equivalent_gate`` respectively instead
of three. A target close to the identity will use no applications of it.

### `__init__`

```python
def __init__(self, rxx_equivalent_gate: type[Gate], euler_basis: str='ZXZ')
```

Args:
    rxx_equivalent_gate: Gate that is locally equivalent to an :class:`.RXXGate`:
        :math:`U \sim U_d(\alpha, 0, 0) \sim \text{Ctrl-U}` gate.
        Valid options are [:class:`.RZZGate`, :class:`.RXXGate`, :class:`.RYYGate`,
        :class:`.RZXGate`, :class:`.CPhaseGate`, :class:`.CRXGate`, :class:`.CRYGate`,
        :class:`.CRZGate`].
    euler_basis: Basis string to be provided to :class:`.OneQubitEulerDecomposer`
        for 1Q synthesis.
        Valid options are [``'ZXZ'``, ``'ZYZ'``, ``'XYX'``, ``'XZX'``, ``'U'``, ``'U3'``,
        ``'U321'``, ``'U1X'``, ``'PSX'``, ``'ZSX'``, ``'ZSXX'``, ``'RR'``].

Raises:
    QiskitError: If the gate is not locally equivalent to an :class:`.RXXGate`.

.. automethod:: __call__

### `__call__`

```python
def __call__(self, unitary: Operator | np.ndarray, approximate=False, use_dag=False, *, atol=DEFAULT_ATOL) -> QuantumCircuit
```

Decompose a two-qubit ``unitary`` using the :class:`.TwoQubitControlledUDecomposer`.

Args:
    unitary: :math:`4 \times 4` unitary to synthesize.
    approximate: Currently not used by this decomposer; accepted for signature
        compatibility with the other two-qubit decomposers. Reserved for future use.
    use_dag: Currently not used by this decomposer; accepted for signature
        compatibility with the other two-qubit decomposers. Reserved for future use.
    atol: Absolute tolerance for checking angles of the single-qubit unitaries when
        simplifying the returned circuit [Default: 1e-12].

Returns:
    QuantumCircuit: Synthesized quantum circuit.

Note: atol is passed to :class:`.OneQubitEulerDecomposer`.

## `TwoQubitBasisDecomposer`

```python
class TwoQubitBasisDecomposer
```

A class for decomposing 2-qubit unitaries into minimal number of uses of a 2-qubit
basis gate.

Args:
    gate: Two-qubit gate to be used in the KAK decomposition.
    basis_fidelity: Fidelity to be assumed for applications of KAK Gate. Defaults to ``1.0``.
    euler_basis: Basis string to be provided to :class:`.OneQubitEulerDecomposer` for 1Q synthesis.
        Valid options are [``'ZYZ'``, ``'ZXZ'``, ``'XYX'``, ``'U'``, ``'U3'``, ``'U1X'``,
        ``'PSX'``, ``'ZSX'``, ``'RR'``].
    pulse_optimize: If ``True``, try to do decomposition which minimizes
        local unitaries in between entangling gates. This will raise an exception if an
        optimal decomposition is not implemented. Currently, only [{CX, SX, RZ}] is known.
        If ``False``, don't attempt optimization. If ``None``, attempt optimization but don't raise
        if unknown.


.. automethod:: __call__

### `num_basis_gates`

```python
def num_basis_gates(self, unitary)
```

Computes the number of basis gates needed in
a decomposition of input unitary

### `decomp0`

```python
def decomp0(target)
```

Decompose target :math:`\sim U_d(x, y, z)` with :math:`0` uses of the basis gate.
Result :math:`U_r` has trace:

.. math::

    \Big\vert\text{Tr}(U_r\cdot U_\text{target}^{\dag})\Big\vert =
    4\Big\vert (\cos(x)\cos(y)\cos(z)+ j \sin(x)\sin(y)\sin(z)\Big\vert

which is optimal for all targets and bases

### `decomp1`

```python
def decomp1(self, target)
```

Decompose target :math:`\sim U_d(x, y, z)` with :math:`1` use of the basis gate
:math:`\sim U_d(a, b, c)`.
Result :math:`U_r` has trace:

.. math::

    \Big\vert\text{Tr}(U_r \cdot U_\text{target}^{\dag})\Big\vert =
    4\Big\vert \cos(x-a)\cos(y-b)\cos(z-c) + j \sin(x-a)\sin(y-b)\sin(z-c)\Big\vert

which is optimal for all targets and bases with ``z==0`` or ``c==0``.

### `decomp2_supercontrolled`

```python
def decomp2_supercontrolled(self, target)
```

Decompose target :math:`\sim U_d(x, y, z)` with :math:`2` uses of the basis gate.

For supercontrolled basis :math:`\sim U_d(\pi/4, b, 0)`, all b, result :math:`U_r` has trace

.. math::

    \Big\vert\text{Tr}(U_r \cdot U_\text{target}^\dag) \Big\vert = 4\cos(z)

which is the optimal approximation for basis of CNOT-class :math:`\sim U_d(\pi/4, 0, 0)`
or DCNOT-class :math:`\sim U_d(\pi/4, \pi/4, 0)` and any target. It may
be sub-optimal for :math:`b \neq 0` (i.e. there exists an exact decomposition for any target
using :math:`B \sim U_d(\pi/4, \pi/8, 0)`, but it may not be this decomposition).
This is an exact decomposition for supercontrolled basis and target :math:`\sim U_d(x, y, 0)`.
No guarantees for non-supercontrolled basis.

### `decomp3_supercontrolled`

```python
def decomp3_supercontrolled(self, target)
```

Decompose target with :math:`3` uses of the basis.
This is an exact decomposition for supercontrolled basis :math:`\sim U_d(\pi/4, b, 0)`, all b,
and any target. No guarantees for non-supercontrolled basis.

### `__call__`

```python
def __call__(self, unitary: Operator | np.ndarray, basis_fidelity: float | None=None, approximate: bool=True, use_dag: bool=False, *, _num_basis_uses: int | None=None) -> QuantumCircuit | DAGCircuit
```

Decompose a two-qubit ``unitary`` over fixed basis and :math:`SU(2)` using the best
approximation given that each basis application has a finite ``basis_fidelity``.

Args:
    unitary (Operator or ndarray): :math:`4 \times 4` unitary to synthesize.
    basis_fidelity (float or None): Fidelity to be assumed for applications of KAK Gate.
        If given, overrides ``basis_fidelity`` given at init.
    approximate (bool): Approximates if basis fidelities are less than 1.0.
    use_dag (bool): If true a :class:`.DAGCircuit` is returned instead of a
        :class:`QuantumCircuit` when this class is called.
    _num_basis_uses (int): force a particular approximation by passing a number in [0, 3].

Returns:
    QuantumCircuit: Synthesized quantum circuit.

Raises:
    QiskitError: if ``pulse_optimize`` is True but we don't know how to do it.

### `traces`

```python
def traces(self, target)
```

Give the expected traces :math:`\Big\vert\text{Tr}(U \cdot U_\text{target}^{\dag})\Big\vert`
for a different number of basis gates.
