---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/openfermion_pyscf.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/openfermion_pyscf.py
license: Apache-2.0
---

## Module `pennylane/qchem/openfermion_pyscf.py`

This module contains functions to construct many-body observables with ``OpenFermion-PySCF``.

## `observable`

```python
def observable(fermion_ops, init_term=0, mapping='jordan_wigner', wires=None)
```

Builds the fermionic many-body observable whose expectation value can be
measured in PennyLane.

The second-quantized operator of the fermionic many-body system can combine one-particle
and two-particle operators as in the case of electronic Hamiltonians :math:`\hat{H}`:

.. math::

    \hat{H} = \sum_{\alpha, \beta} \langle \alpha \vert \hat{t}^{(1)} +
    \cdots + \hat{t}^{(n)} \vert \beta \rangle ~ \hat{c}_\alpha^\dagger \hat{c}_\beta
    + \frac{1}{2} \sum_{\alpha, \beta, \gamma, \delta}
    \langle \alpha, \beta \vert \hat{v}^{(1)} + \cdots + \hat{v}^{(n)}
    \vert \gamma, \delta \rangle ~ \hat{c}_\alpha^\dagger \hat{c}_\beta^\dagger
    \hat{c}_\gamma \hat{c}_\delta

In the latter equations the indices :math:`\alpha, \beta, \gamma, \delta` run over the
basis of single-particle states. The operators :math:`\hat{c}^\dagger` and :math:`\hat{c}`
are the particle creation and annihilation operators, respectively.
:math:`\langle \alpha \vert \hat{t} \vert \beta \rangle` denotes the matrix element of
the single-particle operator :math:`\hat{t}` entering the observable. For example,
in electronic structure calculations, this is the case for the kinetic energy operator,
the nuclei Coulomb potential, or any other external fields included in the Hamiltonian.
On the other hand, :math:`\langle \alpha, \beta \vert \hat{v} \vert \gamma, \delta \rangle`
denotes the matrix element of the two-particle operator :math:`\hat{v}`, for example, the
Coulomb interaction between the electrons.

- The observable is built by adding the operators
  :math:`\sum_{\alpha, \beta} t_{\alpha\beta}^{(i)}
  \hat{c}_\alpha^\dagger \hat{c}_\beta` and
  :math:`\frac{1}{2} \sum_{\alpha, \beta, \gamma, \delta}
  v_{\alpha\beta\gamma\delta}^{(i)}
  \hat{c}_\alpha^\dagger \hat{c}_\beta^\dagger \hat{c}_\gamma \hat{c}_\delta`.

- Second-quantized operators contributing to the
  many-body observable must be represented using the `FermionOperator
  <https://github.com/quantumlib/OpenFermion/blob/master/docs/
  tutorials/intro_to_openfermion.ipynb>`_ data structure as implemented in OpenFermion.
  See the functions :func:`~.one_particle` and :func:`~.two_particle` to build the
  FermionOperator representations of one-particle and two-particle operators.

- The function uses tools of `OpenFermion <https://github.com/quantumlib/OpenFermion>`_
  to map the resulting fermionic Hamiltonian to the basis of Pauli matrices via the
  Jordan-Wigner, Parity or Bravyi-Kitaev transformation. Finally, the qubit operator is converted
  to a PennyLane observable by the function :func:`~.convert_observable`.

Args:
    fermion_ops (list[FermionOperator]): list containing the FermionOperator data structures
        representing the one-particle and/or two-particle operators entering the many-body
        observable
    init_term (float): Any quantity required to initialize the many-body observable. For
        example, this can be used to pass the nuclear-nuclear repulsion energy :math:`V_{nn}`
        which is typically included in the electronic Hamiltonian of molecules.
    mapping (str): Specifies the fermion-to-qubit mapping. Input values can
        be ``'jordan_wigner'``, ``'parity'``, or ``'bravyi_kitaev'``.
    wires (Wires, list, tuple, dict): Custom wire mapping used to convert the qubit operator
        to an observable measurable in a PennyLane ansatz.
        For types Wires/list/tuple, each item in the iterable represents a wire label
        corresponding to the qubit number equal to its index.
        For type dict, only int-keyed dict (for qubit-to-wire conversion) is accepted.
        If None, will use identity map (e.g. 0->0, 1->1, ...).

Returns:
    pennylane.Hamiltonian: the fermionic-to-qubit transformed observable

**Example**

>>> t = FermionOperator("0^ 0", 0.5) + FermionOperator("1^ 1", 0.25)
>>> v = FermionOperator("1^ 0^ 0 1", -0.15) + FermionOperator("2^ 0^ 2 0", 0.3)
>>> observable([t, v], mapping="jordan_wigner")
(
    0.2625 * I(0)
  + -0.1375 * Z(0)
  + -0.0875 * Z(1)
  + -0.0375 * (Z(0) @ Z(1))
  + 0.075 * Z(2)
  + -0.075 * (Z(0) @ Z(2))
)

## `one_particle`

```python
def one_particle(matrix_elements, core=None, active=None, cutoff=1e-12)
```

Generates the `FermionOperator <https://github.com/quantumlib/OpenFermion/blob/master/docs/
tutorials/intro_to_openfermion.ipynb>`_ representing a given one-particle operator
required to build many-body qubit observables.

Second quantized one-particle operators are expanded in the basis of single-particle
states as

.. math::

    \hat{T} = \sum_{\alpha, \beta} \langle \alpha \vert \hat{t} \vert \beta \rangle
    [\hat{c}_{\alpha\uparrow}^\dagger \hat{c}_{\beta\uparrow} +
    \hat{c}_{\alpha\downarrow}^\dagger \hat{c}_{\beta\downarrow}].

In the equation above the indices :math:`\alpha, \beta` run over the basis of spatial
orbitals :math:`\phi_\alpha(r)`. Since the operator :math:`\hat{t}` acts only on the
spatial coordinates, the spin quantum numbers are indicated explicitly with the up/down arrows.
The operators :math:`\hat{c}^\dagger` and :math:`\hat{c}` are the particle creation
and annihilation operators, respectively, and
:math:`\langle \alpha \vert \hat{t} \vert \beta \rangle` denotes the matrix elements of
the operator :math:`\hat{t}`

.. math::

    \langle \alpha \vert \hat{t} \vert \beta \rangle = \int dr ~ \phi_\alpha^*(r)
    \hat{t}(r) \phi_\beta(r).

If an active space is defined (see :func:`~.active_space`), the summation indices
run over the active orbitals and the contribution due to core orbitals is computed as
:math:`t_\mathrm{core} = 2 \sum_{\alpha\in \mathrm{core}}
\langle \alpha \vert \hat{t} \vert \alpha \rangle`.

Args:
    matrix_elements (array[float]): 2D NumPy array with the matrix elements
        :math:`\langle \alpha \vert \hat{t} \vert \beta \rangle`
    core (list): indices of core orbitals, i.e., the orbitals that are
        not correlated in the many-body wave function
    active (list): indices of active orbitals, i.e., the orbitals used to
        build the correlated many-body wave function
    cutoff (float): Cutoff value for including matrix elements. The
        matrix elements with absolute value less than ``cutoff`` are neglected.

Returns:
    FermionOperator: an instance of OpenFermion's ``FermionOperator`` representing the
    one-particle operator :math:`\hat{T}`.

**Example**

>>> import numpy as np
>>> matrix_elements = np.array([[-1.27785301e+00,  0.00000000e+00],
...                             [ 1.52655666e-16, -4.48299696e-01]])
>>> t_op = one_particle(matrix_elements)
>>> print(t_op)
-1.277853006156875 [0^ 0] +
-1.277853006156875 [1^ 1] +
-0.44829969610163756 [2^ 2] +
-0.44829969610163756 [3^ 3]

## `two_particle`

```python
def two_particle(matrix_elements, core=None, active=None, cutoff=1e-12)
```

Generates the `FermionOperator <https://github.com/quantumlib/OpenFermion/blob/master/docs/
tutorials/intro_to_openfermion.ipynb>`__ representing a given two-particle operator
required to build many-body qubit observables.

Second quantized two-particle operators are expanded in the basis of single-particle
states as

.. math::

    \hat{V} = \frac{1}{2} \sum_{\alpha, \beta, \gamma, \delta}
    \langle \alpha, \beta \vert \hat{v} \vert \gamma, \delta \rangle
    ~ &[& \hat{c}_{\alpha\uparrow}^\dagger \hat{c}_{\beta\uparrow}^\dagger
    \hat{c}_{\gamma\uparrow} \hat{c}_{\delta\uparrow} + \hat{c}_{\alpha\uparrow}^\dagger
    \hat{c}_{\beta\downarrow}^\dagger \hat{c}_{\gamma\downarrow} \hat{c}_{\delta\uparrow} \\
    &+& \hat{c}_{\alpha\downarrow}^\dagger \hat{c}_{\beta\uparrow}^\dagger
    \hat{c}_{\gamma\uparrow} \hat{c}_{\delta\downarrow} + \hat{c}_{\alpha\downarrow}^\dagger
    \hat{c}_{\beta\downarrow}^\dagger \hat{c}_{\gamma\downarrow} \hat{c}_{\delta\downarrow}~].

In the equation above the indices :math:`\alpha, \beta, \gamma, \delta` run over the basis
of spatial orbitals :math:`\phi_\alpha(r)`. Since the operator :math:`v` acts only on the
spatial coordinates the spin quantum numbers are indicated explicitly with the up/down arrows.
The operators :math:`\hat{c}^\dagger` and :math:`\hat{c}` are the particle creation and
annihilation operators, respectively, and
:math:`\langle \alpha, \beta \vert \hat{v} \vert \gamma, \delta \rangle` denotes the
matrix elements of the operator :math:`\hat{v}`

.. math::

    \langle \alpha, \beta \vert \hat{v} \vert \gamma, \delta \rangle =
    \int dr_1 \int dr_2 ~ \phi_\alpha^*(r_1) \phi_\beta^*(r_2) ~\hat{v}(r_1, r_2)~
    \phi_\gamma(r_2) \phi_\delta(r_1).

If an active space is defined (see :func:`~.active_space`), the summation indices
run over the active orbitals and the contribution due to core orbitals is computed as

.. math::

    && \hat{V}_\mathrm{core} = v_\mathrm{core} +
    \sum_{\alpha, \beta \in \mathrm{active}} \sum_{i \in \mathrm{core}}
    (2 \langle i, \alpha \vert \hat{v} \vert \beta, i \rangle -
    \langle i, \alpha \vert \hat{v} \vert i, \beta \rangle)~
    [\hat{c}_{\alpha\uparrow}^\dagger \hat{c}_{\beta\uparrow} +
    \hat{c}_{\alpha\downarrow}^\dagger \hat{c}_{\beta\downarrow}] \\
    && v_\mathrm{core} = \sum_{\alpha,\beta \in \mathrm{core}}
    [2 \langle \alpha, \beta \vert \hat{v} \vert \beta, \alpha \rangle -
    \langle \alpha, \beta \vert \hat{v} \vert \alpha, \beta \rangle].

Args:
    matrix_elements (array[float]): 4D NumPy array with the matrix elements
        :math:`\langle \alpha, \beta \vert \hat{v} \vert \gamma, \delta \rangle`
    core (list): indices of core orbitals, i.e., the orbitals that are
        not correlated in the many-body wave function
    active (list): indices of active orbitals, i.e., the orbitals used to
        build the correlated many-body wave function
    cutoff (float): Cutoff value for including matrix elements. The
        matrix elements with absolute value less than ``cutoff`` are neglected.

Returns:
    FermionOperator: an instance of OpenFermion's ``FermionOperator`` representing the
    two-particle operator :math:`\hat{V}`.

**Example**

>>> import numpy as np
>>> matrix_elements = np.array([[[[ 6.82389533e-01, -1.45716772e-16],
...                               [-2.77555756e-17,  1.79000576e-01]],
...                              [[-2.77555756e-17,  1.79000576e-16],
...                               [ 6.70732778e-01, 0.00000000e+00]]],
...                             [[[-1.45716772e-16,  6.70732778e-16],
...                               [ 1.79000576e-01, -8.32667268e-17]],
...                              [[ 1.79000576e-16, -8.32667268e-17],
...                               [ 0.00000000e+00,  7.05105632e-01]]]])
>>> v_op = two_particle(matrix_elements)
>>> print(v_op)
0.3411947665 [0^ 0^ 0 0] +
0.089500288 [0^ 0^ 2 2] +
0.3411947665 [0^ 1^ 1 0] +
0.089500288 [0^ 1^ 3 2] +
0.335366389 [0^ 2^ 2 0] +
0.335366389 [0^ 3^ 3 0] +
0.3411947665 [1^ 0^ 0 1] +
0.089500288 [1^ 0^ 2 3] +
0.3411947665 [1^ 1^ 1 1] +
0.089500288 [1^ 1^ 3 3] +
0.335366389 [1^ 2^ 2 1] +
0.335366389 [1^ 3^ 3 1] +
0.089500288 [2^ 0^ 2 0] +
0.089500288 [2^ 1^ 3 0] +
0.352552816 [2^ 2^ 2 2] +
0.352552816 [2^ 3^ 3 2] +
0.089500288 [3^ 0^ 2 1] +
0.089500288 [3^ 1^ 3 1] +
0.352552816 [3^ 2^ 2 3] +
0.352552816 [3^ 3^ 3 3]

## `dipole_of`

```python
def dipole_of(symbols, coordinates, name='molecule', charge=0, mult=1, basis='sto-3g', package='pyscf', core=None, active=None, mapping='jordan_wigner', cutoff=1e-12, outpath='.', wires=None)
```

Computes the electric dipole moment operator in the Pauli basis.

The second quantized dipole moment operator :math:`\hat{D}` of a molecule is given by

.. math::

    \hat{D} = -\sum_{\alpha, \beta} \langle \alpha \vert \hat{{\bf r}} \vert \beta \rangle
    [\hat{c}_{\alpha\uparrow}^\dagger \hat{c}_{\beta\uparrow} +
    \hat{c}_{\alpha\downarrow}^\dagger \hat{c}_{\beta\downarrow}] + \hat{D}_\mathrm{n}.

In the equation above, the indices :math:`\alpha, \beta` run over the basis of Hartree-Fock
molecular orbitals and the operators :math:`\hat{c}^\dagger` and :math:`\hat{c}` are the
electron creation and annihilation operators, respectively. The matrix elements of the
position operator :math:`\hat{{\bf r}}` are computed as

.. math::

    \langle \alpha \vert \hat{{\bf r}} \vert \beta \rangle = \sum_{i, j}
     C_{\alpha i}^*C_{\beta j} \langle i \vert \hat{{\bf r}} \vert j \rangle,

where :math:`\vert i \rangle` is the wave function of the atomic orbital,
:math:`C_{\alpha i}` are the coefficients defining the molecular orbitals,
and :math:`\langle i \vert \hat{{\bf r}} \vert j \rangle`
is the representation of operator :math:`\hat{{\bf r}}` in the atomic basis.

The contribution of the nuclei to the dipole operator is given by

.. math::

    \hat{D}_\mathrm{n} = \sum_{i=1}^{N_\mathrm{atoms}} Z_i {\bf R}_i \hat{I},


where :math:`Z_i` and :math:`{\bf R}_i` denote, respectively, the atomic number and the
nuclear coordinates of the :math:`i`-th atom of the molecule.

Args:
    symbols (list[str]): symbols of the atomic species in the molecule
    coordinates (array[float]): 1D array with the atomic positions in Cartesian
        coordinates. The coordinates must be given in atomic units and the size of the array
        should be ``3*N`` where ``N`` is the number of atoms.
    name (str): name of the molecule
    charge (int): charge of the molecule
    mult (int): spin multiplicity :math:`\mathrm{mult}=N_\mathrm{unpaired} + 1` of the
        Hartree-Fock (HF) state based on the number of unpaired electrons occupying the
        HF orbitals
    basis (str): Atomic basis set used to represent the molecular orbitals. Basis set
        availability per element can be found
        `here <www.psicode.org/psi4manual/master/basissets_byelement.html#apdx-basiselement>`_
    package (str): quantum chemistry package (pyscf) used to solve the
        mean field electronic structure problem
    core (list): indices of core orbitals
    active (list): indices of active orbitals
    mapping (str): transformation (``'jordan_wigner'``, ``'parity'``, or ``'bravyi_kitaev'``) used to
        map the fermionic operator to the Pauli basis
    cutoff (float): Cutoff value for including the matrix elements
        :math:`\langle \alpha \vert \hat{{\bf r}} \vert \beta \rangle`. The matrix elements
        with absolute value less than ``cutoff`` are neglected.
    outpath (str): path to the directory containing output files
    wires (Wires, list, tuple, dict): Custom wire mapping used to convert the qubit operator
        to an observable measurable in a PennyLane ansatz.
        For types Wires/list/tuple, each item in the iterable represents a wire label
        corresponding to the qubit number equal to its index.
        For type dict, only int-keyed dict (for qubit-to-wire conversion) is accepted.
        If None, will use identity map (e.g. 0->0, 1->1, ...).

Returns:
    list[pennylane.Hamiltonian]: the qubit observables corresponding to the components
    :math:`\hat{D}_x`, :math:`\hat{D}_y` and :math:`\hat{D}_z` of the dipole operator in
    atomic units.

**Example**

>>> symbols = ["H", "H", "H"]
>>> coordinates = np.array([0.028, 0.054, 0.0, 0.986, 1.610, 0.0, 1.855, 0.002, 0.0])
>>> dipole_obs = dipole_of(symbols, coordinates, charge=1)
>>> print([(h.wires) for h in dipole_obs])
[Wires([0, 1, 2, 3, 4, 5]), Wires([0, 1, 2, 3, 4, 5]), Wires([0])]

>>> dipole_obs[0] # x-component of D
(
    0.4781123173263876 * Z(0)
  + 0.4781123173263876 * Z(1)
  + -0.3913638489489803 * (Y(0) @ Z(1) @ Y(2))
  + -0.3913638489489803 * (X(0) @ Z(1) @ X(2))
  + -0.3913638489489803 * (Y(1) @ Z(2) @ Y(3))
  + -0.3913638489489803 * (X(1) @ Z(2) @ X(3))
  + 0.2661114704527088 * (Y(0) @ Z(1) @ Z(2) @ Z(3) @ Y(4))
  + 0.2661114704527088 * (X(0) @ Z(1) @ Z(2) @ Z(3) @ X(4))
  + 0.2661114704527088 * (Y(1) @ Z(2) @ Z(3) @ Z(4) @ Y(5))
  + 0.2661114704527088 * (X(1) @ Z(2) @ Z(3) @ Z(4) @ X(5))
  + 0.7144779061810713 * Z(2)
  + 0.7144779061810713 * Z(3)
  + -0.11734958781031017 * (Y(2) @ Z(3) @ Y(4))
  + -0.11734958781031017 * (X(2) @ Z(3) @ X(4))
  + -0.11734958781031017 * (Y(3) @ Z(4) @ Y(5))
  + -0.11734958781031017 * (X(3) @ Z(4) @ X(5))
  + 0.24190977644645698 * Z(4)
  + 0.24190977644645698 * Z(5)
)

## `meanfield`

```python
def meanfield(symbols, coordinates, name='molecule', charge=0, mult=1, basis='sto-3g', package='pyscf', outpath='.')
```

Generates a file from which the mean field electronic structure
of the molecule can be retrieved.

This function uses OpenFermion-PySCF plugins to
perform the Hartree-Fock (HF) calculation for the polyatomic system using the quantum
chemistry packages ``PySCF``. The mean field electronic
structure is saved in an hdf5-formatted file.

The charge of the molecule can be given to simulate cationic/anionic systems.
Also, the spin multiplicity can be input to determine the number of unpaired electrons
occupying the HF orbitals as illustrated in the figure below.

|

.. figure:: ../../_static/qchem/hf_references.png
    :align: center
    :width: 50%

|

Args:
    symbols (list[str]): symbols of the atomic species in the molecule
    coordinates (array[float]): 1D array with the atomic positions in Cartesian
        coordinates. The coordinates must be given in atomic units and the size of the array
        should be ``3*N`` where ``N`` is the number of atoms.
    name (str): molecule label
    charge (int): net charge of the system
    mult (int): Spin multiplicity :math:`\mathrm{mult}=N_\mathrm{unpaired} + 1` for
        :math:`N_\mathrm{unpaired}` unpaired electrons occupying the HF orbitals.
        Possible values for ``mult`` are :math:`1, 2, 3, \ldots`. If not specified,
        a closed-shell HF state is assumed.
    basis (str): Atomic basis set used to represent the HF orbitals. Basis set
        availability per element can be found
        `here <www.psicode.org/psi4manual/master/basissets_byelement.html#apdx-basiselement>`_
    package (str): Quantum chemistry package used to solve the Hartree-Fock equations.
    outpath (str): path to output directory

Returns:
    str: absolute path to the file containing the mean field electronic structure

**Example**

>>> symbols, coordinates = (['H', 'H'], np.array([0., 0., -0.66140414, 0., 0., 0.66140414]))
>>> meanfield(symbols, coordinates, name="h2")
./h2_pyscf_sto-3g

## `decompose`

```python
def decompose(hf_file, mapping='jordan_wigner', core=None, active=None)
```

Decomposes the molecular Hamiltonian into a linear combination of Pauli operators using
OpenFermion tools.

This function uses OpenFermion functions to build the second-quantized electronic Hamiltonian
of the molecule and map it to the Pauli basis using the Jordan-Wigner, Parity or Bravyi-Kitaev
transformation.

Args:
    hf_file (str): absolute path to the hdf5-formatted file with the
        Hartree-Fock electronic structure
    mapping (str): Specifies the transformation to map the fermionic Hamiltonian to the
        Pauli basis. Input values can be ``'jordan_wigner'``, ``'parity'``, or ``'bravyi_kitaev'``.
    core (list): indices of core orbitals, i.e., the orbitals that are
        not correlated in the many-body wave function
    active (list): indices of active orbitals, i.e., the orbitals used to
        build the correlated many-body wave function

Returns:
    QubitOperator: an instance of OpenFermion's ``QubitOperator``

**Example**

>>> decompose('./pyscf/sto-3g/h2', mapping='bravyi_kitaev')
(-0.04207897696293986+0j) [] + (0.04475014401986122+0j) [X0 Z1 X2] +
(0.04475014401986122+0j) [X0 Z1 X2 Z3] +(0.04475014401986122+0j) [Y0 Z1 Y2] +
(0.04475014401986122+0j) [Y0 Z1 Y2 Z3] +(0.17771287459806262+0j) [Z0] +
(0.17771287459806265+0j) [Z0 Z1] +(0.1676831945625423+0j) [Z0 Z1 Z2] +
(0.1676831945625423+0j) [Z0 Z1 Z2 Z3] +(0.12293305054268105+0j) [Z0 Z2] +
(0.12293305054268105+0j) [Z0 Z2 Z3] +(0.1705973832722409+0j) [Z1] +
(-0.2427428049645989+0j) [Z1 Z2 Z3] +(0.1762764080276107+0j) [Z1 Z3] +
(-0.2427428049645989+0j) [Z2]
