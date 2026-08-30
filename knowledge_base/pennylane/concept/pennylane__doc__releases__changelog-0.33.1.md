---
framework: pennylane
api_version: v0.45.1
doc_type: concept
source_path: doc/releases/changelog-0.33.1.md
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/doc/releases/changelog-0.33.1.md
license: Apache-2.0
---

# Release 0.33.1

<h3>Bug fixes 🐛</h3>

* Fix gradient performance regression due to expansion of VJP products.
  [(#4806)](https://github.com/PennyLaneAI/pennylane/pull/4806)

* `qml.defer_measurements` now correctly transforms circuits when terminal measurements include wires
  used in mid-circuit measurements.
  [(#4787)](https://github.com/PennyLaneAI/pennylane/pull/4787)

* Any `ScalarSymbolicOp`, like `Evolution`, now states that it has a matrix if the target
  is a `Hamiltonian`.
  [(#4768)](https://github.com/PennyLaneAI/pennylane/pull/4768)

* In `default.qubit`, initial states are now initialized with the simulator's wire order, not the circuit's
  wire order.
  [(#4781)](https://github.com/PennyLaneAI/pennylane/pull/4781)

<h3>Contributors ✍️</h3>

This release contains contributions from (in alphabetical order):

Christina Lee,
Lee James O'Riordan,
Mudit Pandey
