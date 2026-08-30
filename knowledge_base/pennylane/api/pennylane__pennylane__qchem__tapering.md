---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/tapering.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/tapering.py
license: Apache-2.0
---

## Module `pennylane/qchem/tapering.py`

This module contains the functions needed for tapering qubits using symmetries.

## `symmetry_generators`

```python
def symmetry_generators(h)
```

Compute the generators :math:`\{\tau_1, \ldots, \tau_k\}` for a Hamiltonian over the binary
field :math:`\mathbb{Z}_2`.

These correspond to the generator set of the :math:`\mathbb{Z}_2`-symmetries present
in the Hamiltonian as given in `arXiv:1910.14644 <https://arxiv.org/abs/1910.14644>`_.

Args:
    h (Operator): Hamiltonian for which symmetries are to be generated to perform tapering

Returns:
    list[Operator]: list of generators of symmetries, :math:`\tau`'s, for the Hamiltonian

**Example**

>>> symbols = ["H", "H"]
>>> coordinates = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]])
>>> H, qubits = qp.qchem.molecular_hamiltonian(symbols, coordinates)
>>> t = symmetry_generators(H)
>>> t
[Z(0) @ Z(1), Z(0) @ Z(2), Z(0) @ Z(3)]

## `paulix_ops`

```python
def paulix_ops(generators, num_qubits)
```

Generate the single qubit Pauli-X operators :math:`\sigma^{x}_{i}` for each symmetry :math:`\tau_j`,
such that it anti-commutes with :math:`\tau_j` and commutes with all others symmetries :math:`\tau_{k\neq j}`.
These are required to obtain the Clifford operators :math:`U` for the Hamiltonian :math:`H`.

Args:
    generators (list[Operator]): list of generators of symmetries, :math:`\tau`'s,
        for the Hamiltonian
    num_qubits (int): number of wires required to define the Hamiltonian

Return:
    list[Operator]: list of single-qubit Pauli-X operators which will be used to build the
    Clifford operators :math:`U`.

**Example**

>>> generators = [qp.Hamiltonian([1.0], [qp.Z(0) @ qp.Z(1)]),
...               qp.Hamiltonian([1.0], [qp.Z(0) @ qp.Z(2)]),
...               qp.Hamiltonian([1.0], [qp.Z(0) @ qp.Z(3)])]
>>> paulix_ops(generators, 4)
[X(1), X(2), X(3)]

## `clifford`

```python
def clifford(generators, paulixops)
```

Compute a Clifford operator from a set of generators and Pauli-X operators.

This function computes :math:`U = U_0U_1...U_k` for a set of :math:`k` generators and
:math:`k` Pauli-X operators.

Args:
    generators (list[Operator]): generators expressed as PennyLane Hamiltonians
    paulixops (list[Operation]): list of single-qubit Pauli-X operators

Returns:
    (Operator): Clifford operator expressed as a PennyLane operator

**Example**

>>> t1 = qp.Hamiltonian([1.0], [qp.pauli.string_to_pauli_word('ZZII')])
>>> t2 = qp.Hamiltonian([1.0], [qp.pauli.string_to_pauli_word('ZIZI')])
>>> t3 = qp.Hamiltonian([1.0], [qp.pauli.string_to_pauli_word('ZIIZ')])
>>> generators = [t1, t2, t3]
>>> paulixops = [qp.X(1), qp.X(2), qp.X(3)]
>>> u = clifford(generators, paulixops)
>>> print(u)
  (0.3535533905932737) [Z1 Z2 X3]
+ (0.3535533905932737) [X1 X2 X3]
+ (0.3535533905932737) [Z1 X2 Z3]
+ (0.3535533905932737) [X1 Z2 Z3]
+ (0.3535533905932737) [Z0 X1 X2 Z3]
+ (0.3535533905932737) [Z0 Z1 Z2 Z3]
+ (0.3535533905932737) [Z0 X1 Z2 X3]
+ (0.3535533905932737) [Z0 Z1 X2 X3]

## `taper`

```python
def taper(h, generators, paulixops, paulix_sector)
```

Transform a Hamiltonian with a Clifford operator and then taper qubits.

The Hamiltonian is transformed as :math:`H' = U^{\dagger} H U` where :math:`U` is a Clifford
operator. The transformed Hamiltonian acts trivially on some qubits which are then replaced
with the eigenvalues of their corresponding Pauli-X operator. The list of these
eigenvalues is defined as the Pauli sector.

Args:
    h (Operator): Hamiltonian as a PennyLane operator
    generators (list[Operator]): generators expressed as PennyLane Hamiltonians
    paulixops (list[Operation]): list of single-qubit Pauli-X operators
    paulix_sector (list[int]): eigenvalues of the Pauli-X operators

Returns:
    (Operator): the tapered Hamiltonian

**Example**

>>> symbols = ["H", "H"]
>>> geometry = np.array([[0.0, 0.0, -0.69440367], [0.0, 0.0, 0.69440367]])
>>> H, qubits = qp.qchem.molecular_hamiltonian(symbols, geometry)
>>> generators = qp.qchem.symmetry_generators(H)
>>> paulixops = paulix_ops(generators, 4)
>>> paulix_sector = [1, -1, -1]
>>> H_tapered = taper(H, generators, paulixops, paulix_sector)
>>> H_tapered
(
    (-0.3210343973331179-2.0816681711721685e-17j) * I(0)
  + (0.7959678504583807+0j) * Z(0)
  + (0.18092702760702645+0j) * X(0)
)

## `optimal_sector`

```python
def optimal_sector(qubit_op, generators, active_electrons)
```

Get the optimal sector which contains the ground state.

To obtain the optimal sector, we need to choose the right eigenvalues for the symmetry generators :math:`\bm{\tau}`.
We can do so by using the following relation between the Pauli-Z qubit operator and the occupation number under a
Jordan-Wigner transform.

.. math::

    \sigma_{i}^{z} = I - 2a_{i}^{\dagger}a_{i}

According to this relation, the occupied and unoccupied fermionic modes correspond to the -1 and +1 eigenvalues of
the Pauli-Z operator, respectively. Since all of the generators :math:`\bm{\tau}` consist only of :math:`I` and
Pauli-Z operators, the correct eigenvalue for each :math:`\tau` operator can be simply obtained by applying it on
the reference Hartree-Fock (HF) state, and looking at the overlap between the wires on which the Pauli-Z operators
act and the wires that correspond to occupied orbitals in the HF state.

Args:
    qubit_op (Operator): Hamiltonian for which symmetries are being generated
    generators (list[Operator]): list of symmetry generators for the Hamiltonian
    active_electrons (int): The number of active electrons in the system

Returns:
    list[int]: eigenvalues corresponding to the optimal sector which contains the ground state

**Example**

>>> symbols = ["H", "H"]
>>> geometry = np.array([[0.0, 0.0, -0.69440367], [0.0, 0.0, 0.69440367]])
>>> H, qubits = qp.qchem.molecular_hamiltonian(symbols, geometry)
>>> generators = qp.qchem.symmetry_generators(H)
>>> qp.qchem.optimal_sector(H, generators, 2)
    [1, -1, -1]

## `taper_hf`

```python
def taper_hf(generators, paulixops, paulix_sector, num_electrons, num_wires)
```

Transform a Hartree-Fock state with a Clifford operator and then taper qubits.

The fermionic operators defining the molecule's Hartree-Fock (HF) state are first mapped onto a qubit operator
using the Jordan-Wigner encoding. This operator is then transformed using the Clifford operators :math:`U`
obtained from the :math:`\mathbb{Z}_2` symmetries of the molecular Hamiltonian resulting in a qubit operator
that acts non-trivially only on a subset of qubits. A new, tapered HF state is built on this reduced subset
of qubits by placing the qubits which are acted on by a Pauli-X or Pauli-Y operators in state :math:`|1\rangle`
and leaving the rest in state :math:`|0\rangle`.

Args:
    generators (list[Operator]): list of generators of symmetries, taus, for the Hamiltonian
    paulixops (list[Operation]):  list of single-qubit Pauli-X operators
    paulix_sector (list[int]): list of eigenvalues of Pauli-X operators
    num_electrons (int): number of active electrons in the system
    num_wires (int): number of wires in the system for generating the Hartree-Fock bitstring

Returns:
    array(int): tapered Hartree-Fock state

**Example**

>>> symbols = ['He', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.4588684632]])
>>> mol = qp.qchem.Molecule(symbols, geometry, charge=1)
>>> H, n_qubits = qp.qchem.molecular_hamiltonian(symbols, geometry, charge=1)
>>> n_elec = mol.n_electrons
>>> generators = qp.qchem.symmetry_generators(H)
>>> paulixops = qp.qchem.paulix_ops(generators, 4)
>>> paulix_sector = qp.qchem.optimal_sector(H, generators, n_elec)
>>> taper_hf(generators, paulixops, paulix_sector, n_elec, n_qubits)
tensor([1, 1], requires_grad=True)

## `taper_operation`

```python
def taper_operation(operation, generators, paulixops, paulix_sector, wire_order, op_wires=None, op_gen=None)
```

Transform a gate operation with a Clifford operator and then taper qubits.

The qubit operator for the generator of the gate operation is computed either internally or can be provided
manually via the ``op_gen`` argument. If this operator commutes with all the :math:`\mathbb{Z}_2` symmetries of
the molecular Hamiltonian, then this operator is transformed using the Clifford operators :math:`U` and
tapered; otherwise it is discarded. Finally, the tapered generator is exponentiated using :class:`~.Exp`
for building the tapered unitary.

Args:
    operation (Operation or Callable): qubit operation to be tapered, or a function that applies that operation
    generators (list[Hamiltonian]): generators expressed as PennyLane Hamiltonians
    paulixops (list[Operation]):  list of single-qubit Pauli-X operators
    paulix_sector (list[int]): eigenvalues of the Pauli-X operators
    wire_order (Sequence[Any]): order of the wires in the quantum circuit
    op_wires (Sequence[Any]): wires for the operation in case any of the provided ``operation`` or ``op_gen`` are callables
    op_gen (Hamiltonian or PauliSentence or Callable): generator of the operation, or a function that returns it in case it cannot be computed internally.

Returns:
    list[Operation]: list of operations of type :class:`~.pennylane.Exp` implementing tapered unitary operation

Raises:
    ValueError: optional argument ``op_wires`` is not provided when the provided operation is a callable
    TypeError: optional argument ``op_gen`` is a callable but does not have ``wires`` as its only keyword argument
    NotImplementedError: generator of the operation cannot be constructed internally
    ValueError: optional argument ``op_gen`` is either not a :class:`~.pennylane.Hamiltonian` or a valid generator of the operation

**Example**

>>> symbols, geometry = ['He', 'H'], np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.4589]])
>>> mol = qchem.Molecule(symbols, geometry, charge=1)
>>> H, n_qubits = qchem.molecular_hamiltonian(symbols, geometry, charge=1)
>>> generators = qchem.symmetry_generators(H)
>>> paulixops = qchem.paulix_ops(generators, n_qubits)
>>> paulix_sector = qchem.optimal_sector(H, generators, mol.n_electrons)
>>> tap_op = qchem.taper_operation(qp.SingleExcitation, generators, paulixops,
...                                paulix_sector, wire_order=H.wires, op_wires=[0, 2])
>>> tap_op(3.14159)
[Exp(1.5707949999999993j PauliY), Exp(0j Identity)]

The obtained tapered operation function can then be used within a :class:`~.pennylane.QNode`:

>>> dev = qp.device('default.qubit', wires=[0, 1])
>>> @qp.qnode(dev)
... def circuit(params):
...     tap_op(params[0])
...     return qp.expval(qp.Z(0)@qp.Z(1))
>>> drawer = qp.draw(circuit, show_all_wires=True)
>>> print(drawer(params=[3.14159]))
0: ──Exp(0.00+1.57j Y)─┤ ╭<Z@Z>
1: ────────────────────┤ ╰<Z@Z>

.. details::
    :title: Usage Details
    :href: usage-taper-operation

    ``qp.taper_operation`` can also be used with the quantum operations, in which case one does not need to specify ``op_wires`` args:

    >>> qchem.taper_operation(qp.SingleExcitation(3.14159, wires=[0, 2]), generators,
    ...                       paulixops, paulix_sector, wire_order=H.wires)
    [Exp(1.570795j PauliY)]

    Moreover, it can also be used within a :class:`~.pennylane.QNode` directly:

    >>> dev = qp.device('default.qubit', wires=[0, 1])
    >>> @qp.qnode(dev)
    ... def circuit(params):
    ...     qchem.taper_operation(qp.DoubleExcitation(params[0], wires=[0, 1, 2, 3]),
    ...                           generators, paulixops, paulix_sector, H.wires)
    ...     return qp.expval(qp.Z(0)@qp.Z(1))
    >>> drawer = qp.draw(circuit, show_all_wires=True)
    >>> print(drawer(params=[3.14159]))
    0: ─╭Exp(-0.00-0.79j X@Y)─╭Exp(-0.00-0.79j Y@X)─┤ ╭<Z@Z>
    1: ─╰Exp(-0.00-0.79j X@Y)─╰Exp(-0.00-0.79j Y@X)─┤ ╰<Z@Z>

    For more involved gates operations such as the ones constructed from matrices, users would need to provide their generators manually
    via the ``op_gen`` argument. The generator can be passed as a :class:`~.pennylane.Hamiltonian`, :class:`~.PauliSentence` or any
    arithmetic operator:

    >>> op_fun = qp.QubitUnitary(np.array([[0.+0.j, 0.+0.j, 0.+0.j, 0.-1.j],
    ...                                     [0.+0.j, 0.+0.j, 0.-1.j, 0.+0.j],
    ...                                     [0.+0.j, 0.-1.j, 0.+0.j, 0.+0.j],
    ...                                     [0.-1.j, 0.+0.j, 0.+0.j, 0.+0.j]]), wires=[0, 2])
    >>> op_gen = qp.Hamiltonian([-0.5 * np.pi],
    ...                          [qp.X(0) @ qp.X(2)])
    >>> qchem.taper_operation(op_fun, generators, paulixops, paulix_sector,
    ...                       wire_order=H.wires, op_gen=op_gen)
    [Exp(1.5707963267948957j PauliX)]

    Alternatively, generators can also be specified as a function which returns :class:`~.pennylane.Hamiltonian`
    or an arithmetic operator, and uses ``wires`` as its only required keyword argument:

    >>> op_gen = lambda wires: qp.Hamiltonian(
    ...     [0.25, -0.25],
    ...     [qp.X(wires[0]) @ qp.Y(wires[1]),
    ...      qp.Y(wires[0]) @ qp.X(wires[1])])
    >>> qchem.taper_operation(qp.SingleExcitation, generators, paulixops, paulix_sector,
    ...                       wire_order=H.wires, op_wires=[0, 2], op_gen=op_gen)(3.14159)
    [Exp(1.570795j PauliY)]

.. details::
    :title: Theory
    :href: theory-taper-operation

    Consider :math:`G` to be the generator of a unitrary :math:`V(\theta)`, i.e.,

    .. math::

        V(\theta) = e^{i G \theta}.

    Then, for :math:`V` to have a non-trivial and compatible tapering with the generators of symmetry
    :math:`\tau`, we should have :math:`[V, \tau_i] = 0` for all :math:`\theta` and :math:`\tau_i`.
    This would hold only when its generator itself commutes with each :math:`\tau_i`,

    .. math::

        [V, \tau_i] = 0 \iff [G, \tau_i]\quad \forall \theta, \tau_i.

    By ensuring this, we can taper the generator :math:`G` using the Clifford operators :math:`U`,
    and exponentiate the transformed generator :math:`G^{\prime}` to obtain a tapered unitary
    :math:`V^{\prime}`,

    .. math::

        V^{\prime} \equiv e^{i U^{\dagger} G U \theta} = e^{i G^{\prime} \theta}.
