---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/layers/particle_conserving_u2.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/layers/particle_conserving_u2.py
license: Apache-2.0
---

## Module `pennylane/templates/layers/particle_conserving_u2.py`

Contains the hardware-efficient ParticleConservingU2 template.

## `u2_ex_gate`

```python
def u2_ex_gate(phi, wires=None)
```

Implements the two-qubit exchange gate :math:`U_{2,\mathrm{ex}}` proposed in
`arXiv:1805.04340 <https://arxiv.org/abs/1805.04340>`_ to build particle-conserving VQE ansatze
for Quantum Chemistry simulations.

The unitary matrix :math:`U_{2, \mathrm{ex}}` acts on the Hilbert space of two qubits

.. math::

    U_{2, \mathrm{ex}}(\phi) = \left(\begin{array}{cccc}
    1 & 0 & 0 & 0 \\
    0 & \mathrm{cos}(\phi) & -i\;\mathrm{sin}(\phi) & 0 \\
    0 & -i\;\mathrm{sin}(\phi) & \mathrm{cos}(\phi) & 0 \\
    0 & 0 & 0 & 1 \\
    \end{array}\right).

Args:
    phi (float): angle entering the controlled-RX operator :math:`CRX(2\phi)`
    wires (list[Wires]): the two wires ``n`` and ``m`` the circuit acts on

Returns:
    list[.Operator]: sequence of operators defined by this function

## `ParticleConservingU2`

```python
class ParticleConservingU2(Operation)
```

Implements the heuristic VQE ansatz for Quantum Chemistry simulations using the
particle-conserving entangler :math:`U_\mathrm{ent}(\vec{\theta}, \vec{\phi})` proposed in
`arXiv:1805.04340 <https://arxiv.org/abs/1805.04340>`__.

This template prepares :math:`N`-qubit trial states by applying :math:`D` layers of the entangler
block :math:`U_\mathrm{ent}(\vec{\theta}, \vec{\phi})` to the Hartree-Fock state

.. math::

    \vert \Psi(\vec{\theta}, \vec{\phi}) \rangle = \hat{U}^{(D)}_\mathrm{ent}(\vec{\theta}_D,
    \vec{\phi}_D) \dots \hat{U}^{(2)}_\mathrm{ent}(\vec{\theta}_2, \vec{\phi}_2)
    \hat{U}^{(1)}_\mathrm{ent}(\vec{\theta}_1, \vec{\phi}_1) \vert \mathrm{HF}\rangle,

where :math:`\hat{U}^{(i)}_\mathrm{ent}(\vec{\theta}_i, \vec{\phi}_i) =
\hat{R}_\mathrm{z}(\vec{\theta}_i) \hat{U}_\mathrm{2,\mathrm{ex}}(\vec{\phi}_i)`.
The circuit implementing the entangler blocks is shown in the figure below:

|

.. figure:: ../../_static/templates/layers/particle_conserving_u2.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

|

Each layer contains :math:`N` rotation gates :math:`R_\mathrm{z}(\vec{\theta})` and
:math:`N-1` particle-conserving exchange gates :math:`U_{2,\mathrm{ex}}(\phi)`
that act on pairs of nearest-neighbors qubits. The repeated units across several qubits are
shown in dotted boxes.  The unitary matrix representing :math:`U_{2,\mathrm{ex}}(\phi)`
(`arXiv:1805.04340 <https://arxiv.org/abs/1805.04340>`_) is decomposed into its elementary
gates and implemented in the :func:`~.u2_ex_gate` function using PennyLane quantum operations.

|

.. figure:: ../../_static/templates/layers/u2_decomposition.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

|


Args:
    weights (tensor_like): Weight tensor of shape ``(D, M)`` where ``D`` is the number of
        layers and ``M`` = ``2N-1`` is the total number of rotation ``(N)`` and exchange
        ``(N-1)`` gates per layer.
    wires (Iterable): wires that the template acts on.
    init_state (tensor_like): iterable or shape ``(len(wires),)`` tensor representing the Hartree-Fock state
        used to initialize the wires. If ``None``, a tuple of zeros is selected as initial state.

.. details::
    :title: Usage Details

    #. The number of wires has to be equal to the number of spin orbitals included in
       the active space.

    #. The number of trainable parameters scales with the number of layers :math:`D` as
       :math:`D(2N-1)`.

    An example of how to use this template is shown below:

    .. code-block:: python

        import pennylane as qp
        import numpy as np
        from functools import partial

        # Build the electronic Hamiltonian
        symbols, coordinates = (['H', 'H'], np.array([0., 0., -0.66140414, 0., 0., 0.66140414]))
        h, qubits = qp.qchem.molecular_hamiltonian(symbols, coordinates)

        # Define the HF state
        ref_state = qp.qchem.hf_state(2, qubits)

        # Define the device
        dev = qp.device('default.qubit', wires=qubits)

        # Define the ansatz
        ansatz = partial(qp.ParticleConservingU2, init_state=ref_state, wires=dev.wires)

        # Define the cost function
        @qp.qnode(dev)
        def cost_fn(params):
            ansatz(params)
            return qp.expval(h)

        # Compute the expectation value of 'h' for a given set of parameters
        layers = 1
        shape = qp.ParticleConservingU2.shape(layers, qubits)
        params = np.random.random(shape)
        print(cost_fn(params))

    **Parameter shape**

    The shape of the trainable weights tensor can be computed by the static method
    :meth:`~qp.ParticleConservingU2.shape` and used when creating randomly
    initialised weight tensors:

    .. code-block:: python

        shape = qp.ParticleConservingU2.shape(n_layers=2, n_wires=2)
        params = np.random.random(size=shape)

### `compute_decomposition`

```python
def compute_decomposition(weights, wires, init_state)
```

Representation of the ParticleConservingU2operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.ParticleConservingU2.decomposition`.

Args:
    weights (tensor_like): Weight tensor of shape ``(D, M)`` where ``D`` is the number of
        layers and ``M`` = ``2N-1`` is the total number of rotation ``(N)`` and exchange
        ``(N-1)`` gates per layer.
    wires (Any or Iterable[Any]): wires that the operator acts on
    init_state (tensor_like): iterable or shape ``(len(wires),)`` tensor representing the Hartree-Fock state
        used to initialize the wires.

Returns:
    list[.Operator]: decomposition of the operator

**Example**

>>> weights = torch.tensor([[0.3, 1., 0.2]])
>>> ops = qp.ParticleConservingU2.compute_decomposition(weights, wires=["a", "b"], init_state=[0, 1])
>>> from pprint import pprint
>>> pprint(ops)
[BasisEmbedding(array([0, 1]), wires=['a', 'b']),
RZ(tensor(0.3000), wires=['a']),
RZ(tensor(1.), wires=['b']),
CNOT(wires=['a', 'b']),
CRX(0.4000000059604645, wires=['b', 'a']),
CNOT(wires=['a', 'b'])]

### `shape`

```python
def shape(n_layers, n_wires)
```

Returns the shape of the weight tensor required for this template.

Args:
    n_layers (int): number of layers
    n_wires (int): number of qubits

Returns:
    tuple[int]: shape
