---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/templates/embeddings.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/templates/embeddings.py
license: Apache-2.0
---

## Module `pennylane/estimator/templates/embeddings.py`

Resource operators for embedding templates.

## `BasisEmbedding`

```python
class BasisEmbedding(BasisState)
```

Resource class for preparing a single basis state, as an embedding.
Mirrors :class:`~.BasisEmbedding`, which inherits from :class:`~.BasisState`
but is otherwise identical to it.

Args:
    num_wires (int): number of wires the operator acts on
    wires (WiresLike, Optional): the wire(s) the operation acts on
