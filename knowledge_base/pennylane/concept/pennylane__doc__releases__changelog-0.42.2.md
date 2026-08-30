---
framework: pennylane
api_version: v0.45.1
doc_type: concept
source_path: doc/releases/changelog-0.42.2.md
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/doc/releases/changelog-0.42.2.md
license: Apache-2.0
---

# Release 0.42.2

<h3>Bug fixes 🐛</h3>

* Fixed a recursion error when simplifying operators that are raised to integer powers. For example,

  ```pycon
  >>> class DummyOp(qml.operation.Operator):
  ...     pass
  >>> (DummyOp(0) ** 2).simplify()
  DummyOp(0) @ DummyOp(0)
  ```

  Previously, this would fail with a recursion error.
  [(#8061)](https://github.com/PennyLaneAI/pennylane/pull/8061)
  [(#8064)](https://github.com/PennyLaneAI/pennylane/pull/8064)

<h3>Contributors ✍️</h3>

This release contains contributions from (in alphabetical order):

Christina Lee,
Andrija Paurevic.
