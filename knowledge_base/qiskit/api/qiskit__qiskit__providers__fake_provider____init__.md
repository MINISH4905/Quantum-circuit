---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/providers/fake_provider/__init__.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/providers/fake_provider/__init__.py
license: Apache-2.0
---

## Module `qiskit/providers/fake_provider/__init__.py`

======================================================
Fake Provider (:mod:`qiskit.providers.fake_provider`)
======================================================

.. currentmodule:: qiskit.providers.fake_provider

Overview
========

The fake provider module in Qiskit contains fake (simulated) backend classes
useful for testing the transpiler and other backend-facing functionality.

Example Usage
-------------

Here is an example of using a simulated backend for transpilation and running.

.. plot::
   :alt: Output from the previous code.
   :include-source:

   from qiskit import QuantumCircuit, transpile
   from qiskit.providers.fake_provider import GenericBackendV2
   from qiskit.visualization import plot_histogram

   # Generate a 5-qubit simulated backend
   backend = GenericBackendV2(num_qubits=5)

   # Create a simple circuit
   circuit = QuantumCircuit(3)
   circuit.h(0)
   circuit.cx(0,1)
   circuit.cx(0,2)
   circuit.measure_all()
   circuit.draw('mpl')

   # Transpile the ideal circuit to a circuit that can be directly executed by the backend
   transpiled_circuit = transpile(circuit, backend)
   transpiled_circuit.draw('mpl')

   # Run the transpiled circuit using the simulated backend
   job = backend.run(transpiled_circuit)
   counts = job.result().get_counts()
   plot_histogram(counts)


V2 Simulated Backends
=====================

.. autosummary::
    :toctree: ../stubs/

    GenericBackendV2
