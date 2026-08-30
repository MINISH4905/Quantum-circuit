---
framework: pennylane
api_version: v0.45.1
doc_type: concept
source_path: doc/releases/changelog-0.15.1.md
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/doc/releases/changelog-0.15.1.md
license: Apache-2.0
---

# Release 0.15.1

<h3>Bug fixes</h3>

* Fixes two bugs in the parameter-shift Hessian.
  [(#1260)](https://github.com/PennyLaneAI/pennylane/pull/1260)

  - Fixes a bug where having an unused parameter in the Autograd interface
    would result in an indexing error during backpropagation.

  - The parameter-shift Hessian only supports the two-term parameter-shift
    rule currently, so raises an error if asked to differentiate
    any unsupported gates (such as the controlled rotation gates).

* A bug which resulted in `qml.adjoint()` and `qml.inv()` failing to work with
  templates has been fixed.
  [(#1243)](https://github.com/PennyLaneAI/pennylane/pull/1243)

* Deprecation warning instances in PennyLane have been changed to `UserWarning`,
  to account for recent changes to how Python warnings are filtered in
  [PEP565](https://www.python.org/dev/peps/pep-0565/).
  [(#1211)](https://github.com/PennyLaneAI/pennylane/pull/1211)

<h3>Documentation</h3>

* Updated the order of the parameters to the `GaussianState` operation to match
  the way that the PennyLane-SF plugin uses them.
  [(#1255)](https://github.com/PennyLaneAI/pennylane/pull/1255)

<h3>Contributors</h3>

This release contains contributions from (in alphabetical order):

Thomas Bromley, Olivia Di Matteo, Diego Guala, Anthony Hayes, Ryan Hill,
Josh Izaac, Christina Lee, Maria Schuld, Antal Száva.
