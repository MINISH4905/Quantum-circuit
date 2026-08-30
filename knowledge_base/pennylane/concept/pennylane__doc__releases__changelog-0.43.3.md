---
framework: pennylane
api_version: v0.45.1
doc_type: concept
source_path: doc/releases/changelog-0.43.3.md
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/doc/releases/changelog-0.43.3.md
license: Apache-2.0
---

# Release 0.43.3

<h3>Bug fixes 🐛</h3>

* The ``gast`` package is now an explicit dependency in PennyLane. The ``gast`` package was previously
  pulled in transitively by ``diastatic-malt``, but ``diastatic-malt==2.15.3`` dropped ``gast`` as a dependency, which caused an error when importing PennyLane.
  [(#9160)](https://github.com/PennyLaneAI/pennylane/pull/9160)

<h3>Contributors ✍️</h3>

This release contains contributions from (in alphabetical order):

Yushao Chen,
Andrija Paurević,
David Wierichs
