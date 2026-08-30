---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/hamiltonian.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/hamiltonian.py
license: Apache-2.0
---

## Module `pennylane/qchem/hamiltonian.py`

This module contains the functions needed for computing the molecular Hamiltonian.

## `electron_integrals`

```python
def electron_integrals(mol, core=None, active=None)
```

Return a function that computes the one- and two-electron integrals in the molecular orbital
basis.

The one- and two-electron integrals are required to construct a molecular Hamiltonian in the
second-quantized form

.. math::

    H = \sum_{pq} h_{pq} c_p^{\dagger} c_q + \frac{1}{2} \sum_{pqrs} h_{pqrs} c_p^{\dagger} c_q^{\dagger} c_r c_s,

where :math:`c^{\dagger}` and :math:`c` are the creation and annihilation operators,
respectively, and :math:`h_{pq}` and :math:`h_{pqrs}` are the one- and two-electron integrals.
These integrals can be computed by integrating over molecular orbitals :math:`\phi` as

.. math::

    h_{pq} = \int \phi_p(r)^* \left ( -\frac{\nabla_r^2}{2} - \sum_i \frac{Z_i}{|r-R_i|} \right )  \phi_q(r) dr,

and

.. math::

    h_{pqrs} = \int \frac{\phi_p(r_1)^* \phi_q(r_2)^* \phi_r(r_2) \phi_s(r_1)}{|r_1 - r_2|} dr_1 dr_2.

The molecular orbitals are constructed as a linear combination of atomic orbitals as

.. math::

    \phi_i = \sum_{\nu}c_{\nu}^i \chi_{\nu}.

The one- and two-electron integrals can be written in the molecular orbital basis as

.. math::

    h_{pq} = \sum_{\mu \nu} C_{p \mu} h_{\mu \nu} C_{\nu q},

and

.. math::

    h_{pqrs} = \sum_{\mu \nu \rho \sigma} C_{p \mu} C_{q \nu} h_{\mu \nu \rho \sigma} C_{\rho r} C_{\sigma s}.

The :math:`h_{\mu \nu}` and :math:`h_{\mu \nu \rho \sigma}` terms refer to the elements of the
core matrix and the electron repulsion tensor, respectively, and :math:`C` is the molecular
orbital expansion coefficient matrix.

Args:
    mol (~qchem.molecule.Molecule): the molecule object
    core (list[int]): indices of the core orbitals
    active (list[int]): indices of the active orbitals

Returns:
    function: function that computes the core constant and the one- and two-electron integrals

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]], requires_grad = False)
>>> alpha = np.array([[3.42525091, 0.62391373, 0.1688554],
>>>                   [3.42525091, 0.62391373, 0.1688554]], requires_grad=True)
>>> mol = qp.qchem.Molecule(symbols, geometry, alpha=alpha)
>>> args = [alpha]
>>> electron_integrals(mol)(*args)
(1.0,
 array([[-1.3902192695e+00,  0.0000000000e+00],
        [-4.4408920985e-16, -2.9165331336e-01]]),
 array([[[[ 7.1443907755e-01, -2.7755575616e-17],
          [ 5.5511151231e-17,  1.7024144301e-01]],
         [[ 5.5511151231e-17,  1.7024144301e-01],
          [ 7.0185315353e-01,  6.6613381478e-16]]],
        [[[-1.3877787808e-16,  7.0185315353e-01],
          [ 1.7024144301e-01,  2.2204460493e-16]],
         [[ 1.7024144301e-01, -4.4408920985e-16],
          [ 6.6613381478e-16,  7.3883668974e-01]]]]))

## `fermionic_hamiltonian`

```python
def fermionic_hamiltonian(mol, cutoff=1e-12, core=None, active=None)
```

Return a function that computes the fermionic Hamiltonian.

Args:
    mol (~qchem.molecule.Molecule): the molecule object
    cutoff (float): cutoff value for discarding the negligible electronic integrals
    core (list[int]): indices of the core orbitals
    active (list[int]): indices of the active orbitals

Returns:
    function: function that computes the fermionic hamiltonian

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]], requires_grad = False)
>>> alpha = np.array([[3.42525091, 0.62391373, 0.1688554],
>>>                   [3.42525091, 0.62391373, 0.1688554]], requires_grad=True)
>>> mol = qp.qchem.Molecule(symbols, geometry, alpha=alpha)
>>> args = [alpha]
>>> h = fermionic_hamiltonian(mol)(*args)

## `diff_hamiltonian`

```python
def diff_hamiltonian(mol, cutoff=1e-12, core=None, active=None, mapping='jordan_wigner')
```

Return a function that computes the qubit Hamiltonian.

Args:
    mol (~qchem.molecule.Molecule): the molecule object
    cutoff (float): cutoff value for discarding the negligible electronic integrals
    core (list[int]): indices of the core orbitals
    active (list[int]): indices of the active orbitals
    mapping (str): Specifies the fermion-to-qubit mapping. Input values can
        be ``'jordan_wigner'``, ``'parity'`` or ``'bravyi_kitaev'``.

Returns:
    function: function that computes the qubit hamiltonian

**Example**

>>> from pennylane import numpy as np
>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]], requires_grad = False)
>>> alpha = np.array([[3.42525091, 0.62391373, 0.1688554],
>>>                   [3.42525091, 0.62391373, 0.1688554]], requires_grad=True)
>>> mol = qp.qchem.Molecule(symbols, geometry, alpha=alpha)
>>> args = [alpha]
>>> h = qp.qchem.diff_hamiltonian(mol)(*args)
>>> h.terms()[0]
[tensor(0.29817878, requires_grad=True),
tensor(0.20813366, requires_grad=True),
tensor(-0.34724872, requires_grad=True),
tensor(0.13290292, requires_grad=True),
tensor(0.20813366, requires_grad=True),
tensor(0.17860977, requires_grad=True),
tensor(0.04256036, requires_grad=True),
tensor(-0.04256036, requires_grad=True),
tensor(-0.04256036, requires_grad=True),
tensor(0.04256036, requires_grad=True),
tensor(-0.34724872, requires_grad=True),
tensor(0.17546328, requires_grad=True),
tensor(0.13290292, requires_grad=True),
tensor(0.17546328, requires_grad=True),
tensor(0.18470917, requires_grad=True)]

## `molecular_hamiltonian`

```python
def molecular_hamiltonian(*args, **kwargs)
```

molecular_hamiltonian(molecule, method="dhf", active_electrons=None, active_orbitals=None,    mapping="jordan_wigner", outpath=".", wires=None, args=None, convert_tol=1e12)
Generate the qubit Hamiltonian of a molecule.

This function drives the construction of the second-quantized electronic Hamiltonian
of a molecule and its transformation to the basis of Pauli matrices.

The net charge of the molecule can be given to simulate cationic/anionic systems. Also, the
spin multiplicity can be input to determine the number of unpaired electrons occupying the HF
orbitals as illustrated in the left panel of the figure below.

The basis of Gaussian-type *atomic* orbitals used to represent the *molecular* orbitals can be
specified to go beyond the minimum basis approximation.

An active space can be defined for a given number of *active electrons* occupying a reduced set
of *active orbitals* as sketched in the right panel of the figure below.

|

.. figure:: ../../_static/qchem/fig_mult_active_space.png
    :align: center
    :width: 90%

|

Args:
    molecule (~qchem.molecule.Molecule): the molecule object
    method (str): Quantum chemistry method used to solve the
        mean field electronic structure problem. Available options are ``method="dhf"``
        to specify the built-in differentiable Hartree-Fock solver, ``method="pyscf"`` to use
        the PySCF package (requires ``pyscf`` to be installed), or ``method="openfermion"`` to
        use the OpenFermion-PySCF plugin (this requires ``openfermionpyscf`` to be installed).
    active_electrons (int): Number of active electrons. If not specified, all electrons
        are considered to be active.
    active_orbitals (int): Number of active orbitals. If not specified, all orbitals
        are considered to be active.
    mapping (str): transformation used to map the fermionic Hamiltonian to the qubit Hamiltonian
    outpath (str): path to the directory containing output files
    wires (Wires, list, tuple, dict): Custom wire mapping for connecting to Pennylane ansatz.
        For types ``Wires``/``list``/``tuple``, each item in the iterable represents a wire label
        corresponding to the qubit number equal to its index.
        For type dict, only int-keyed dict (for qubit-to-wire conversion) is accepted for
        partial mapping. If None, will use identity map.
    args (array[array[float]]): initial values of the differentiable parameters
    convert_tol (float): Tolerance in `machine epsilon <https://numpy.org/doc/stable/reference/generated/numpy.real_if_close.html>`_
        for the imaginary part of the Hamiltonian coefficients created by openfermion.
        Coefficients with imaginary part less than 2.22e-16*tol are considered to be real.


Returns:
    tuple[pennylane.Operator, int]: the fermionic-to-qubit transformed  Hamiltonian
    and the number of qubits

.. note::
    The ``molecular_hamiltonian`` function accepts a ``Molecule`` object as its first argument.
    Look at the `Usage Details` for more details on the old interface.

    The ``molecular_hamiltonian`` function is not currently compatible with :func:`~.qjit` and ``jax.jit``.

**Example**

>>> symbols = ['H', 'H']
>>> coordinates = np.array([[0., 0., -0.66140414], [0., 0., 0.66140414]])
>>> molecule = qp.qchem.Molecule(symbols, coordinates)
>>> H, qubits = qp.qchem.molecular_hamiltonian(molecule)
>>> print(qubits)
4
>>> print(H)
(-0.04207897647782188) [I0]
+ (0.17771287465139934) [Z0]
+ (0.1777128746513993) [Z1]
+ (-0.24274280513140484) [Z2]
+ (-0.24274280513140484) [Z3]
+ (0.17059738328801055) [Z0 Z1]
+ (0.04475014401535161) [Y0 X1 X2 Y3]
+ (-0.04475014401535161) [Y0 Y1 X2 X3]
+ (-0.04475014401535161) [X0 X1 Y2 Y3]
+ (0.04475014401535161) [X0 Y1 Y2 X3]
+ (0.12293305056183801) [Z0 Z2]
+ (0.1676831945771896) [Z0 Z3]
+ (0.1676831945771896) [Z1 Z2]
+ (0.12293305056183801) [Z1 Z3]
+ (0.176276408043196) [Z2 Z3]

.. details::
    :title: Usage Details

    The old interface for this method involved passing molecular information as separate arguments:

        ``molecular_hamiltonian``\ (`symbols, coordinates, name='molecule', charge=0, mult=1, basis='sto-3g',`
        `method='dhf', active_electrons=None, active_orbitals=None, mapping='jordan_wigner', outpath='.',`
        `wires=None, alpha=None, coeff=None, args=None, load_data=False, convert_tol=1e12`)

    Molecule-based Arguments:
      - **symbols** (list[str]): symbols of the atomic species in the molecule
      - **coordinates** (array[float]): atomic positions in Cartesian coordinates.
        The atomic coordinates must be in atomic units and can be given as either a 1D array of
        size ``3*N``, or a 2D array of shape ``(N, 3)`` where ``N`` is the number of atoms.
        name (str): name of the molecule
      - **charge** (int): Net charge of the molecule. If not specified a neutral system is assumed.
      - **mult** (int): Spin multiplicity :math:`\mathrm{mult}=N_\mathrm{unpaired} + 1` for :math:`N_\mathrm{unpaired}`
        unpaired electrons occupying the HF orbitals. Possible values of ``mult`` are :math:`1, 2, 3, \ldots`.
        If not specified, a closed-shell HF state is assumed.
      - **basis** (str): atomic basis set used to represent the molecular orbitals
      - **alpha** (array[float]): exponents of the primitive Gaussian functions
      - **coeff** (array[float]): coefficients of the contracted Gaussian functions

    Therefore, a molecular Hamiltonian had to be constructed in the following manner:

    .. code-block:: python

        from pennylane import qchem

        symbols = ["H", "H"]
        geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]])

        H, qubit = qchem.molecular_hamiltonian(symbols, geometry, charge=0)

    As part of the new interface, we are shifting towards extracting all the molecular information
    from the :class:`~.qchem.molecule.Molecule` within the ``molecular_hamiltonian`` method.
