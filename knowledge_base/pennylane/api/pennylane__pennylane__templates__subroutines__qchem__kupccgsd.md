---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/qchem/kupccgsd.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/qchem/kupccgsd.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/qchem/kupccgsd.py`

Contains the k-UpCCGSD template.

## `generalized_singles`

```python
def generalized_singles(wires, delta_sz)
```

Return generalized single excitation terms

.. math::
    \hat{T_1} = \sum_{pq} t_{p}^{q} \hat{c}^{\dagger}_{q} \hat{c}_{p}

## `generalized_pair_doubles`

```python
def generalized_pair_doubles(wires)
```

Return pair coupled-cluster double excitations

.. math::
    \hat{T_2} = \sum_{pq} t_{p_\alpha p_\beta}^{q_\alpha, q_\beta}
           \hat{c}^{\dagger}_{q_\alpha} \hat{c}^{\dagger}_{q_\beta} \hat{c}_{p_\beta} \hat{c}_{p_\alpha}

## `kUpCCGSD`

```python
class kUpCCGSD(Operation)
```

Implements the k-Unitary Pair Coupled-Cluster Generalized Singles and Doubles (k-UpCCGSD) ansatz.

The k-UpCCGSD ansatz calls the :func:`~.FermionicSingleExcitation` and :func:`~.FermionicDoubleExcitation`
templates to exponentiate the product of :math:`k` generalized singles and pair coupled-cluster doubles
excitation operators. Here, "generalized" means that the single and double excitation terms do not
distinguish between occupied and unoccupied orbitals. Additionally, the term "pair coupled-cluster"
refers to the fact that the double excitations contain only those two-body excitations that move a
pair of electrons from one spatial orbital to another. This k-UpCCGSD belongs to the family of Unitary
Coupled Cluster (UCC) based ansätze, commonly used to solve quantum chemistry problems on quantum computers.

The k-UpCCGSD unitary, within the first-order Trotter approximation for a given integer :math:`k`, is given by:

.. math::

    \hat{U}(\vec{\theta}) =
    \prod_{l=1}^{k} \bigg(\prod_{p,r}\exp{\Big\{
    \theta_{r}^{p}(\hat{c}^{\dagger}_p\hat{c}_r - \text{H.c.})\Big\}}
    \ \prod_{i,j} \Big\{\exp{\theta_{j_\alpha j_\beta}^{i_\alpha i_\beta}
    (\hat{c}^{\dagger}_{i_\alpha}\hat{c}^{\dagger}_{i_\beta}
    \hat{c}_{j_\alpha}\hat{c}_{j_\beta} - \text{H.c.}) \Big\}}\bigg)

where :math:`\hat{c}` and :math:`\hat{c}^{\dagger}` are the fermionic annihilation and creation operators.
The indices :math:`p, q` run over the spin orbitals and :math:`i, j` run over the spatial orbitals. The
singles and paired doubles amplitudes :math:`\theta_{r}^{p}` and
:math:`\theta_{j_\alpha j_\beta}^{i_\alpha i_\beta}` represent the set of variational parameters.

Args:
    weights (TensorLike): Tensor containing the parameters :math:`\theta_{pr}` and :math:`\theta_{pqrs}`
        entering the Z rotation in :func:`~.FermionicSingleExcitation` and :func:`~.FermionicDoubleExcitation`.
        These parameters are the coupled-cluster amplitudes that need to be optimized for each generalized
        single and pair double excitation terms.
    wires (WiresLike): wires that the template acts on
    k (int): Number of times UpCCGSD unitary is repeated.
    delta_sz (int): Specifies the selection rule ``sz[p] - sz[r] = delta_sz``
        for the spin-projection ``sz`` of the orbitals involved in the generalized single excitations.
        ``delta_sz`` can take the values :math:`0` and :math:`\pm 1`.
    init_state (Sequence[int]): Length ``len(wires)`` occupation-number vector representing the
        HF state. ``init_state`` is used to initialize the wires.

.. details::
    :title: Usage Details

    #. The number of wires has to be equal to the number of
       spin-orbitals included in the active space, and should be even.

    #. The number of trainable parameters scales linearly with the number of layers as
       :math:`2 k n`, where :math:`n` is the total number of
       generalized singles and paired doubles excitation terms.

    An example of how to use this template is shown below:

    .. code-block:: python

        import pennylane as qp
        from pennylane import numpy as np

        # Build the electronic Hamiltonian
        symbols = ["H", "H"]
        coordinates = np.array([0.0, 0.0, -0.6614, 0.0, 0.0, 0.6614])
        H, wires = qp.qchem.molecular_hamiltonian(symbols, coordinates)

        # Define the Hartree-Fock state
        electrons = 2
        ref_state = qp.qchem.hf_state(electrons, wires)

        # Define the device
        dev = qp.device('default.qubit', wires=wires)

        # Define the ansatz
        @qp.qnode(dev)
        def ansatz(weights):
            qp.kUpCCGSD(weights, wires=[0, 1, 2, 3],
                            k=1, delta_sz=0, init_state=ref_state)
            return qp.expval(H)

        # Get the shape of the weights for this template
        layers = 1
        shape = qp.kUpCCGSD.shape(k=layers,
                            n_wires=wires, delta_sz=0)

        # Initialize the weight tensors
        np.random.seed(24)
        weights = np.random.random(size=shape)

        # Define the optimizer
        opt = qp.GradientDescentOptimizer(stepsize=0.4)

        # Store the values of the cost function
        energy = [ansatz(weights)]

        # Store the values of the circuit weights
        angle = [weights]
        max_iterations = 100
        conv_tol = 1e-06
        for n in range(max_iterations):
            weights, prev_energy = opt.step_and_cost(ansatz, weights)
            energy.append(ansatz(weights))
            angle.append(weights)
            conv = np.abs(energy[-1] - prev_energy)
            if n % 4 == 0:
                print(f"Step = {n},  Energy = {energy[-1]:.8f} Ha")
            if conv <= conv_tol:
                break

        print("\n" f"Final value of the ground-state energy = {energy[-1]:.8f} Ha")
        print("\n" f"Optimal value of the circuit parameters = {angle[-1]}")

    .. code-block:: none

        Step = 0,  Energy = -1.08949110 Ha
        Step = 4,  Energy = -1.13370605 Ha
        Step = 8,  Energy = -1.13581648 Ha
        Step = 12,  Energy = -1.13613171 Ha
        Step = 16,  Energy = -1.13618030 Ha
        Step = 20,  Energy = -1.13618779 Ha

        Final value of the ground-state energy = -1.13618779 Ha

        Optimal value of the circuit parameters = [[0.97879636 0.46093583 0.98108824
        0.45864352 0.65531446 0.44558289]]


    **Parameter shape**

    The shape of the weights argument can be computed by the static method
    :meth:`~.kUpCCGSD.shape` and used when creating randomly
    initialised weight tensors:

    .. code-block:: python

        shape = qp.kUpCCGSD.shape(k=2, n_wires=4, delta_sz=0)
        weights = np.random.random(size=shape)

    >>> weights.shape
    (2, 6)

### `compute_decomposition`

```python
def compute_decomposition(weights, wires, s_wires, d_wires, k, init_state, delta_sz=None)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.kUpCCGSD.decomposition`.

Args:
    weights (tensor_like): tensor containing the parameters entering the Z rotation
    wires (Any or Iterable[Any]): wires that the operator acts on
    k (int): number of times UpCCGSD unitary is repeated
    s_wires (Iterable[Any]): single excitation wires
    d_wires (Iterable[Any]): double excitation wires
    init_state (array[int]): Length ``len(wires)`` occupation-number vector representing the
        HF state.

Returns:
    list[.Operator]: decomposition of the operator

### `shape`

```python
def shape(k, n_wires, delta_sz)
```

Returns the shape of the weight tensor required for this template.
Args:
    k (int): Number of layers
    n_wires (int): Number of wires
    delta_sz (int): Specifies the selection rules ``sz[p] - sz[r] = delta_sz``
    for the spin-projection ``sz`` of the orbitals involved in the single excitations.
    ``delta_sz`` can take the values :math:`0` and :math:`\pm 1`.
Returns:
    tuple[int]: shape
