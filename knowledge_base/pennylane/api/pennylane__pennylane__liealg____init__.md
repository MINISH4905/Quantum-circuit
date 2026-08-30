---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/liealg/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/liealg/__init__.py
license: Apache-2.0
---

## Module `pennylane/liealg/__init__.py`

Overview
--------

This module contains functionality to express and manipulate Lie algebras within the context of quantum computing.

In quantum computing, we are typically dealing with vectors in the Hilbert space
:math:`\mathcal{H} = \mathbb{C}^{2^n}` that are manipulated by unitary gates from
the special unitary group :math:`SU(2^n).`
For full universality, we require the available gates to span all of :math:`SU(2^n)`
in order to reach any state in Hilbert space from any other state.

:math:`SU(2^n)` is a Lie group and has an associated
:doc:`Lie algebra <demo:demos/tutorial_liealgebra>` to it, called :math:`\mathfrak{su}(2^n)`.
In some cases, it is more convenient to work with the associated Lie algebra rather than the
Lie group.

Lie algebra functionality
^^^^^^^^^^^^^^^^^^^^^^^^^

.. currentmodule:: pennylane.liealg

.. autosummary::
    :toctree: api

    ~lie_closure
    ~structure_constants
    ~center
    ~cartan_decomp
    ~horizontal_cartan_subalgebra

Functions
^^^^^^^^^

.. currentmodule:: pennylane.liealg

.. autosummary::
    :toctree: api

    ~check_cartan_decomp
    ~check_commutation_relation
    ~check_abelian
    ~adjvec_to_op
    ~op_to_adjvec
    ~change_basis_ad_rep

Involutions
~~~~~~~~~~~

A map :math:`\theta: \mathfrak{g} \rightarrow \mathfrak{g}` from the Lie algebra :math:`\mathfrak{g}` to itself is called an involution
if it fulfills :math:`\theta(\theta(g)) = g \ \forall g \in \mathfrak{g}` and is compatible with commutators,
:math:`[\theta(g), \theta(g')]=\theta([g, g']).` Involutions are used to construct a :func:`~cartan_decomp`. There are seven canonical
Cartan involutions of classical real simple Lie algebras (``AI, AII, AIII, BDI, DIII, CI, CII``)
and one canonical involution for each real semisimple Lie algebra made up of two isomorphic
classical simple components (``A, BD, C``).
See, for example, Tab. 4 in `Edelman and Jeong <https://arxiv.org/abs/2104.08669>`__.
Note that the functions implemented here do not represent the mathematical involutions directly,
but return a boolean value that indicates whether or not the input is in the :math:`+1` eigenspace
of :math:`\theta`. When using them, it is usually assumed that we apply them to operators in the
eigenbasis of the underlying involution :math:`\theta`.

.. currentmodule:: pennylane.liealg

.. autosummary::
    :toctree: api

    ~even_odd_involution
    ~concurrence_involution
    ~A
    ~AI
    ~AII
    ~AIII
    ~BD
    ~BDI
    ~DIII
    ~C
    ~CI
    ~CII

Relevant demos
--------------

Check out the following demos to learn more about Lie algebras in the context of quantum computation:

* :doc:`Introducing (dynamical) Lie algebras for quantum practitioners <demo:demos/tutorial_liealgebra>`
* :doc:`g-sim: Lie-algebraic classical simulations for variational quantum computing <demo:demos/tutorial_liesim>`
* :doc:`(g + P)-sim: Extending g-sim by non-DLA observables and gates <demo:demos/tutorial_liesim_extension>`
* :doc:`Fixed depth Hamiltonian simulation via Cartan decomposition <demo:demos/tutorial_fixed_depth_hamiltonian_simulation_via_cartan_decomposition>`
* :doc:`The KAK decomposition <demo:demos/tutorial_kak_decomposition>`
