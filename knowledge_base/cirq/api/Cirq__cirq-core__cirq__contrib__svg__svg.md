---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/svg/svg.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/svg/svg.py
license: Apache-2.0
---

## `SVGCircuit`

```python
class SVGCircuit
```

A wrapper around cirq.Circuit to enable rich display in a Jupyter
notebook.

Jupyter will display the result of the last line in a cell. Often,
this is repr(o) for an object. This class defines a magic method
which will cause the circuit to be displayed as an SVG image.

## `circuit_to_svg`

```python
def circuit_to_svg(circuit: cirq.Circuit) -> str
```

Render a circuit as SVG.
