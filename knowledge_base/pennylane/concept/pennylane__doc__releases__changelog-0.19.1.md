---
framework: pennylane
api_version: v0.45.1
doc_type: concept
source_path: doc/releases/changelog-0.19.1.md
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/doc/releases/changelog-0.19.1.md
license: Apache-2.0
---

# Release 0.19.1

<h3>Bug fixes</h3>

* Fixes several bugs when using parametric operations with the
  `default.qubit.tensor` device on GPU. The device takes the `torch_device`
  argument once again to allow running non-parametric QNodes on the GPU.
  [(#1927)](https://github.com/PennyLaneAI/pennylane/pull/1927)

* Fixes a bug where using JAX's jit function on certain QNodes that contain
  the `qml.QubitStateVector` operation raised an error with earlier JAX
  versions (e.g., `jax==0.2.10` and `jaxlib==0.1.64`).
  [(#1924)](https://github.com/PennyLaneAI/pennylane/pull/1924)

<h3>Contributors</h3>

This release contains contributions from (in alphabetical order):

Josh Izaac, Christina Lee, Romain Moyard, Lee James O'Riordan, Antal Száva.
