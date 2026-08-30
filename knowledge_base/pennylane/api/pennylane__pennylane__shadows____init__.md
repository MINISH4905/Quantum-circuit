---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/shadows/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/shadows/__init__.py
license: Apache-2.0
---

## Module `pennylane/shadows/__init__.py`

Overview
--------

This module contains functionality for performing :doc:`classical shadows <demo:demos/tutorial_diffable_shadows>` measurements.

.. currentmodule:: pennylane

Measurements
^^^^^^^^^^^^

.. autosummary::
    :toctree: api

    ~classical_shadow
    ~shadow_expval

Shadow class for classical post-processing
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. autosummary::
    :toctree: api

    ~ClassicalShadow

QNode transforms
^^^^^^^^^^^^^^^^

.. autosummary::
    :toctree: api

    ~shadows.shadow_state

Classical Shadows formalism
---------------------------

.. note:: As per `arXiv:2103.07510 <https://arxiv.org/abs/2103.07510>`_, when computing multiple expectation values it is advisable to directly estimate the desired observables by simultaneously measuring
    qubit-wise-commuting terms. One way of doing this in PennyLane is via :class:`~pennylane.Hamiltonian` and setting ``grouping_type="qwc"``. For more details on this topic, see the PennyLane demo
    on :doc:`estimating expectation values with classical shadows <demo:demos/tutorial_diffable_shadows>`.

A :class:`ClassicalShadow` is a classical description of a quantum state that is capable of reproducing expectation values of local Pauli observables, see `arXiv:2002.08953 <https://arxiv.org/abs/2002.08953>`_.

The idea is to capture :math:`T` local snapshots (given by the ``shots`` set in the device) of the state by performing measurements in random Pauli bases at each qubit.
The measurement outcomes, denoted ``bits``, as well as the choices of measurement bases, ``recipes``, are recorded in two ``(T, len(wires))`` integer tensors, respectively.

From the :math:`t`-th measurement, we can reconstruct the ``local_snapshots`` (see :class:`ClassicalShadow` methods)

.. math:: \rho^{(t)} = \bigotimes_{i=1}^{n} 3 U^\dagger_i |b_i \rangle \langle b_i | U_i - \mathbb{I},

where :math:`U_i` is the rotation corresponding to the measurement (e.g. :math:`U_i=H` for measurement in :math:`X`) of qubit :math:`i` at snapshot :math:`t` and
:math:`|b_i\rangle = (1 - b_i, b_i)`
the corresponding computational basis state given the output bit :math:`b_i`.

From these local snapshots, one can compute expectation values of local Pauli strings, where locality refers to the number of non-Identity operators.
The accuracy of the procedure is determined by the number of measurements :math:`T` (``shots``).
To target an error :math:`\epsilon`, one needs of order :math:`T = \mathcal{O}\left( \log(M) 4^\ell/\epsilon^2 \right)` measurements to determine :math:`M` different,
:math:`\ell`-local observables.

One can in principle also reconstruct the global state :math:`\sum_t \rho^{(t)}/T`, though it is not advisable nor practical for larger systems due to its exponential scaling.

Basic usage
-----------

The easiest way of computing expectation values with classical shadows in PennyLane is to return :func:`shadow_expval` directly from the qnode.

.. code-block:: python3

    H = qp.Hamiltonian([1., 1.], [qp.Z(0) @ qp.Z(1), qp.X(0) @ qp.Z(1)])

    dev = qp.device("default.qubit")

    # shadow_expval + mid-circuit measurements require to defer measurements
    @qp.defer_measurements
    @qp.set_shots(shots=10000)
    @qp.qnode(dev)
    def qnode(x):
        qp.Hadamard(0)
        qp.CNOT((0,1))
        qp.RX(x, wires=0)
        qp.measure(1)
        return qp.shadow_expval(H)

    x = np.array(0.5, requires_grad=True)

The big advantage of this way of computing expectation values is that it is differentiable.

>>> qnode(x)
array(0.8406)
>>> qp.grad(qnode)(x)
-0.49680000000000013

There are more options for post-processing classical shadows in :class:`ClassicalShadow`.
