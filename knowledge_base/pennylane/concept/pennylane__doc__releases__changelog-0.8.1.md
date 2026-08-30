---
framework: pennylane
api_version: v0.45.1
doc_type: concept
source_path: doc/releases/changelog-0.8.1.md
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/doc/releases/changelog-0.8.1.md
license: Apache-2.0
---

# Release 0.8.1

<h3>Improvements</h3>

* Beginning of support for Python 3.8, with the test suite
  now being run in a Python 3.8 environment.
  [(#501)](https://github.com/XanaduAI/pennylane/pull/501)

<h3>Documentation</h3>

* Present templates as a gallery of thumbnails showing the
  basic circuit architecture.
  [(#499)](https://github.com/XanaduAI/pennylane/pull/499)

<h3>Bug fixes</h3>

* Fixed a bug where multiplying a QNode parameter by 0 caused a divide
  by zero error when calculating the parameter shift formula.
  [(#512)](https://github.com/XanaduAI/pennylane/pull/512)

* Fixed a bug where the shape of differentiable QNode arguments
  was being cached on the first construction, leading to indexing
  errors if the QNode was re-evaluated if the argument changed shape.
  [(#505)](https://github.com/XanaduAI/pennylane/pull/505)

<h3>Contributors</h3>

This release contains contributions from (in alphabetical order):

Ville Bergholm, Josh Izaac, Johannes Jakob Meyer, Maria Schuld, Antal Száva.
