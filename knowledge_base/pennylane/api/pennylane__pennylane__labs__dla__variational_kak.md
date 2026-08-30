---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/dla/variational_kak.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/dla/variational_kak.py
license: Apache-2.0
---

## Module `pennylane/labs/dla/variational_kak.py`

Helper Functionality to compute the kak decomposition variationally, as outlined in https://arxiv.org/abs/2104.00728

## `variational_kak_adj`

```python
def variational_kak_adj(H, g, dims, adj, verbose=False, opt_kwargs=None, pick_min=False)
```

Variational KaK decomposition of Hermitian ``H`` using the adjoint representation.

Given a Cartan decomposition (:func:`~cartan_decomp`) :math:`\mathfrak{g} = \mathfrak{k} \oplus \mathfrak{m}`,
a Hermitian operator :math:`H \in \mathfrak{m}`,
and a horizontal Cartan subalgebra (:func:`~horizontal_cartan_subalgebra`) :math:`\mathfrak{a} \subset \mathfrak{m}`,
this function computes
:math:`a \in \mathfrak{a}` and :math:`K_c \in e^{i\mathfrak{k}}` such that

.. math:: H = K_c a K_c^\dagger.

In particular, :math:`a = \sum_j c_j a_j` is decomposed in terms of commuting operators :math:`a_j \in \mathfrak{a}`.
This allows for the immediate decomposition

.. math:: e^{-i t H} = K_c e^{-i t a} K_c^\dagger = K_c \left(\prod_j e^{-i t c_j a_j} \right) K_c^\dagger.

The result is provided in terms of the adjoint vector representation of :math:`a \in \mathfrak{a}`
(see :func:`adjvec_to_op`), i.e. the ordered coefficients :math:`c_j` in :math:`a = \sum_j c_j m_j`
with the basis elements :math:`m_j \in (\tilde{\mathfrak{m}} \oplus \mathfrak{a})` and
the optimal parameters :math:`\theta` such that

.. math:: K_c = \prod_{j=|\mathfrak{k}|}^{1} e^{-i \theta_j k_j}

for the ordered basis of :math:`\mathfrak{k}` given by the first :math:`|\mathfrak{k}|` elements of ``g``.
Note that we define :math:`K_c` mathematically with the descending order of basis elements :math:`k_j \in \mathfrak{k}` such that
the resulting circuit has the canonical ascending order. In particular, a PennyLane quantum function that describes the circuit given
the optimal parameters ``theta_opt`` and the basis ``k`` containing the operators, is given by the following.

.. code-block:: python

    def Kc(theta_opt: Iterable[float], k: Iterable[Operator]):
        assert len(theta_opt) == len(k)
        for theta_j, k_j in zip(theta_opt, k):
            qp.exp(-1j * theta_j * k_j)

Internally, this function performs a modified version of `arXiv:2104.00728 <https://arxiv.org/abs/2104.00728>`__,
in particular minimizing the cost function

.. math:: f(\theta) = \langle H, K(\theta) e^{-i \sum_{j=1}^{|\mathfrak{a}|} \pi^j a_j} K(\theta)^\dagger \rangle,

see eq. (6) therein and our :doc:`demo <demo:demos/tutorial_fixed_depth_hamiltonian_simulation_via_cartan_decomposition>` for more details.
Instead of relying on having Pauli words, we use the adjoint representation
for a more general evaluation of the cost function. The rest is the same.

.. seealso:: :doc:`The KAK decomposition in theory (demo) <demo:demos/tutorial_kak_decomposition>`, :doc:`The KAK decomposition in practice (demo) <demo:demos/tutorial_fixed_depth_hamiltonian_simulation_via_cartan_decomposition>`.

Args:
    H (Union[Operator, PauliSentence, np.ndarray]): Hamiltonian to decompose
    g (List[Union[Operator, PauliSentence, np.ndarray]]): DLA of the Hamiltonian
    dims (Tuple[int]): Tuple of dimensions ``(dim_k, dim_mtilde, dim_a)`` of
        Cartan decomposition :math:`\mathfrak{g} = \mathfrak{k} \oplus (\tilde{\mathfrak{m}} \oplus \mathfrak{a})`
    adj (np.ndarray): Adjoint representation of dimension ``(dim_g, dim_g, dim_g)``,
        with the implicit ordering ``(k, mtilde, a)``.
    verbose (bool): Plot the optimization. Requires matplotlib to be installed (``pip install matplotlib``)
    opt_kwargs (dict): Keyword arguments for the optimization like initial starting values
        for :math:`\theta` of dimension ``(dim_k,)``, given as ``theta0``.
        Also includes ``n_epochs``, ``lr``, ``b1``, ``b2``, ``verbose``, ``interrupt_tol``, see :func:`~run_opt`
    pick_min (bool): Whether to pick the parameter set with lowest cost function value during the optimization
        as optimal parameters. Otherwise picks the last parameter set.
Returns:
    Tuple(np.ndarray, np.ndarray): ``(adjvec_a, theta_opt)``: The adjoint vector representation
    ``adjvec_a`` of dimension ``(dim_mtilde + dim_a,)``, with respect to the basis of
    :math:`\mathfrak{m} = \tilde{\mathfrak{m}} + \mathfrak{a}` of the CSA element
    :math:`a \in \mathfrak{a}` s.t. :math:`H = K a K^\dagger`. For a successful optimization, the entries
    corresponding to :math:`\tilde{\mathfrak{m}}` should be close to zero.
    The second return value, ``theta_opt``, are the optimal coefficients :math:`\theta` of the
    decomposition :math:`K = \prod_{j=|\mathfrak{k}|}^{1} e^{-i \theta_j k_j}` for the basis :math:`k_j \in \mathfrak{k}`.


**Example**

Let us perform a KaK decomposition for the transverse field Ising model Hamiltonian, exemplarily for :math:`n=3` qubits on a chain.
We start with some boilerplate code to perform a Cartan decomposition using the :func:`~concurrence_involution`, which places the Hamiltonian
in the horizontal subspace :math:`\mathfrak{m}`. From this we re-order :math:`\mathfrak{g} = \mathfrak{k} + \mathfrak{m}` and finally compute a
:func:`~horizontal_cartan_subalgebra` :math:`\mathfrak{a}` in :math:`\mathfrak{m} = \tilde{\mathfrak{m}} \oplus \mathfrak{a}`.

.. code-block:: python

    import pennylane as qp
    import numpy as np
    import jax.numpy as jnp
    import jax

    from pennylane import X, Z
    from pennylane.liealg import (
        cartan_decomp,
        horizontal_cartan_subalgebra,
        check_cartan_decomp,
        concurrence_involution,
        adjvec_to_op,
    )
    from pennylane.labs.dla import (
        validate_kak,
        variational_kak_adj,
    )

    n = 3

    gens = [X(i) @ X(i + 1) for i in range(n - 1)]
    gens += [Z(i) for i in range(n)]
    H = qp.sum(*gens)

    g = qp.lie_closure(gens)
    g = [op.pauli_rep for op in g]

    involution = concurrence_involution

    assert not involution(H)
    k, m = cartan_decomp(g, involution=involution)
    assert check_cartan_decomp(k, m)

    g = k + m
    adj = qp.structure_constants(g)

    g, k, mtilde, a, adj = horizontal_cartan_subalgebra(g, k, m, adj, tol=1e-14, start_idx=0)

Due to the canonical ordering of all constituents, it suffices to tell ``variational_kak_adj`` the dimensions of ``dims = (len(k), len(mtilde), len(a))``,
alongside the Hamiltonian ``H``, the Lie algebra ``g`` and its adjoint representation ``adj``. Internally, the function is performing a variational
optimization to find a local extremum of a suitably constructed loss function that finds as its extremum the decomposition

.. math:: K_c = \prod_{j=1}^{|\mathfrak{k}|} e^{-i \theta_j k_j}

in form of the optimal parameters :math:`\{\theta_j\}` for the respective :math:`k_j \in \mathfrak{k}`.
The resulting :math:`K` then informs the CSA element ``a``
of the KaK decomposition via :math:`a = K_c H K_c^\dagger`. This is detailed in `2104.00728 <https://arxiv.org/abs/2104.00728>`__.


>>> dims = (len(k), len(mtilde), len(a))
>>> adjvec_a, theta_opt = variational_kak_adj(H, g, dims, adj, opt_kwargs={"n_epochs": 3000})

As a result, we are provided with the adjoint vector representation of the CSA element
:math:`a \in \mathfrak{a}` with respect to the basis ``mtilde+a`` and the optimal parameters of dimension :math:`|\mathfrak{k}|`

Let us perform some sanity checks to better understand the resulting outputs.
We can turn that element back to an operator using :func:`adjvec_to_op` and from that to a matrix for which we can check Hermiticity.

.. code-block:: python

    m = mtilde + a
    [a_op] = adjvec_to_op([adjvec_a], m)
    a_m = qp.matrix(a_op, wire_order=range(n))
    assert np.allclose(a_m, a_m.conj().T)

Let us now confirm that we get back the original Hamiltonian from the resulting :math:`K_c` and :math:`a`.
In particular, we want to confirm :math:`H = K_c a K_c^\dagger` for :math:`K_c = \prod_{j=1}^{|\mathfrak{k}|} e^{-i \theta_j k_j}`.

.. code-block:: python

    assert len(theta_opt) == len(k)

    def Kc(theta_opt):
        for th, op in zip(theta_opt, k):
            qp.exp(-1j * th * op.operation())

    Kc_m = qp.matrix(Kc, wire_order=range(n))(theta_opt)

    # check Unitary property of Kc
    assert np.allclose(Kc_m.conj().T @ Kc_m, np.eye(2**n))

    H_reconstructed = Kc_m @ a_m @ Kc_m.conj().T

    H_m = qp.matrix(H, wire_order=range(len(H.wires)))

    # check Hermitian property of reconstructed Hamiltonian
    assert np.allclose(
        H_reconstructed, H_reconstructed.conj().T
    )

    # confirm reconstruction was successful to some given numerical tolerance
    assert np.allclose(H_m, H_reconstructed, atol=1e-6)

Instead of performing these checks by hand, we can use the helper function :func:`~validate_kak`.

>>> assert validate_kak(H, g, k, (adjvec_a, theta_opt), n, 1e-6)

## `validate_kak`

```python
def validate_kak(H, g, k, kak_res, n, error_tol, verbose=False)
```

Helper function to validate a khk decomposition

## `run_opt`

```python
def run_opt(cost, theta, n_epochs=500, optimizer=None, verbose=False, interrupt_tol=None)
```

Boilerplate jax optimization

Args:
    cost (callable): Cost function with scalar valued real output
    theta (Iterable): Initial values for argument of ``cost``
    n_epochs (int): Number of optimization iterations
    optimizer (optax.GradientTransformation): ``optax`` optimizer. Default is ``optax.adam(learning_rate=0.1)``.
    verbose (bool): Whether progress is output during optimization
    interrupt_tol (float): If not None, interrupt the optimization if the norm of the gradient is smaller than ``interrupt_tol``.

**Example**

.. code-block:: python

    from pennylane.labs.dla import run_opt
    import jax
    import jax.numpy as jnp
    import optax
    jax.config.update("jax_enable_x64", True)

    def cost(x):
        return x**2

    x0 = jnp.array(0.4)

    thetas, energy, gradients = run_opt(cost, x0)

When no ``optimizer`` is passed, we use ``optax.adam(learning_rate=0.1)``.
We can also use other optimizers, like ``optax.lbfgs``.

>>> optimizer = optax.lbfgs(learning_rate=0.1, memory_size=1000)
>>> thetas, energy, gradients = run_opt(cost, x0, optimizer=optimizer)
