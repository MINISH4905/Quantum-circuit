---
framework: pennylane
api_version: v0.45.1
doc_type: concept
source_path: doc/releases/changelog-0.25.1.md
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/doc/releases/changelog-0.25.1.md
license: Apache-2.0
---

# Release 0.25.1

<h3>Bug fixes</h3>

* Fixed Torch device discrepencies for certain parametrized operations by
  updating `qml.math.array` and `qml.math.eye` to preserve the Torch device
  used.
  [(#2967)](https://github.com/PennyLaneAI/pennylane/pull/2967)

<h3>Contributors</h3>

This release contains contributions from (in alphabetical order):

Romain Moyard, Rashid N H M, Lee James O'Riordan, Antal Száva
