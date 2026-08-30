---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/convert_to_numpy_parameters.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/convert_to_numpy_parameters.py
license: Apache-2.0
---

## Module `pennylane/transforms/convert_to_numpy_parameters.py`

This file contains preprocessings steps that may be called internally
during execution.

## `convert_to_numpy_parameters`

```python
def convert_to_numpy_parameters(tape: QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Transforms a circuit to one with purely numpy parameters.

Args:
    tape (QuantumScript): a circuit with parameters of any interface

Returns:
    tuple[List[QuantumScript], function]: The transformed circuits along with a dummy post-processing function.

**Examples:**

>>> ops = [qp.S(0), qp.RX(torch.tensor(0.1234), 0)]
>>> measurements = [qp.state(), qp.expval(qp.Hermitian(torch.eye(2), 0))]
>>> circuit = qp.tape.QuantumScript(ops, measurements)
>>> [new_circuit], _ = convert_to_numpy_parameters(circuit)
>>> new_circuit.circuit
[S(0),
RX(0.1234000027179718, wires=[0]),
state(wires=[]),
expval(Hermitian(array([[1., 0.],
        [0., 1.]], dtype=float32), wires=[0]))]

If the component's data does not need to be transformed, it is left uncopied.

>>> circuit[0] is new_circuit[0]
True
>>> circuit[1] is new_circuit[1]
False
>>> circuit[2] is new_circuit[2]
True
>>> circuit[3] is new_circuit[3]
False
