---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/phox/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/phox/__init__.py
license: Apache-2.0
---

## Module `pennylane/labs/phox/__init__.py`

Phase optimization with JAX (PHOX)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. currentmodule:: pennylane.labs.phox

.. autosummary::
    :toctree: api

    ~CircuitConfig
    ~MMDConfig
    ~build_expval_func
    ~bitflip_expval
    ~mmd_loss
    ~median_heuristic
    ~train
    ~training_iterator
    ~TrainingOptions
    ~TrainingResult
    ~BatchResult


Circuit construction utilities
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. currentmodule:: pennylane.labs.phox

.. autosummary::
    :toctree: api

    ~create_lattice_gates
    ~create_local_gates
    ~create_random_gates
    ~generate_pauli_observables


Workflow
~~~~~~~~

``pennylane.labs.phox`` provides a compact toolkit for constructing and
simulating phase optimization circuits with JAX. The usual workflow is:

#. Use helpers in :mod:`pennylane.labs.phox.utils` to assemble gates and
   observables.
#. Configure the circuit with :class:`~pennylane.labs.phox.CircuitConfig`.
#. Build an expectation-value function with
   :func:`~pennylane.labs.phox.build_expval_func` and evaluate it for
   different parameter sets.

.. code-block:: python

   import jax

   from pennylane.labs.phox import (
       CircuitConfig,
       build_expval_func,
       create_lattice_gates,
       generate_pauli_observables,
   )

   n_rows, n_cols = 3, 3
   n_qubits = n_rows * n_cols

   gates = create_lattice_gates(n_rows, n_cols, distance=1, max_weight=2)
   observables = generate_pauli_observables(n_qubits, orders=[2], bases=["Z"])

   key = jax.random.PRNGKey(0)
   params = jax.random.uniform(key, shape=(len(gates),))

   config = CircuitConfig(
       gates=gates,
       observables=observables,
       n_samples=4000,
       key=key,
       n_qubits=n_qubits,
   )

   expval_fn = jax.jit(build_expval_func(config))
   expvals, std_errs = expval_fn(params)


Training
~~~~~~~~

Below is a small training loop that minimizes the sum of all two-body ``Z``
correlators on the same ``3x3`` lattice. The loss function reuses the
compiled ``expval_fn`` from above.

.. code-block:: python

   import jax.numpy as jnp

   from pennylane.labs.phox import TrainingOptions, train

   def loss_fn(current_params):
       expvals, _ = expval_fn(current_params)
       return jnp.sum(expvals)

   result = train(
       optimizer="Adam",
       loss=loss_fn,
       stepsize=0.05,
       n_iters=200,
       loss_kwargs={"params": params},
       options=TrainingOptions(unroll_steps=10, random_state=1234),
   )

   print("Final loss:", float(result.losses[-1]))
   print("Optimized parameters:", result.final_params)


Maximum Mean Discrepancy (MMD) Loss
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To train a circuit to reproduce a target probability distribution (e.g., a dataset
of bitstrings), you can use the built-in MMD loss utilities. This integrates
seamlessly with the ``train`` function using the :class:`~pennylane.labs.phox.MMDConfig`
dataclass.

.. code-block:: python

   import numpy as np
   from pennylane.labs.phox import MMDConfig, mmd_loss, median_heuristic

   np.random.seed(42)
   target_data = np.random.binomial(1, 0.5, size=(500, n_qubits))

   bandwidth = median_heuristic(target_data)
   mmd_config = MMDConfig(bandwidth=bandwidth, n_ops=100)

   loss_kwargs = {
       "params": params,
       "circuit_config": config,
       "mmd_config": mmd_config,
       "target_data": target_data,
   }

   mmd_result = train(
       optimizer="Adam",
       loss=mmd_loss,
       stepsize=0.01,
       n_iters=100,
       loss_kwargs=loss_kwargs,
       options=TrainingOptions(unroll_steps=10)
   )

   print("Final MMD loss:", float(mmd_result.losses[-1]))
