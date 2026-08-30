---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/google/internal_gates.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/google/internal_gates.ipynb
license: Apache-2.0
---

##### Copyright 2023 The Cirq Developers

```python
# @title Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
```

# Google Internal Gates in Cirq

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/google/internal_gates"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/google/internal_gates.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/google/internal_gates.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/google/internal_gates.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

```python
try:
    import cirq
    import cirq_google
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq
    print("installed cirq.")
    import cirq
    import cirq_google
```

Google has a wealth of gates implemented internally that don't exist or have equivalents in Cirq. `cirq_google.InternalGate` allows the creation of Cirq circuits that contain place holder operations that will get translated to the correct internal gate.

## InternalGate
Instances of [cirq_google.InternalGate](https://github.com/quantumlib/Cirq/blob/61d967112ba23cc839b0e922bd42878024a3e738/cirq-google/cirq_google/ops/internal_gate.py#L20) act as placeholder objects for google internal gates. During translation, the correct gate is identified through the `gate_module` and `gate_name` properties. Then an instance of that gate is created using the `kwargs` arguments passed to the `InternalGate` constructor.

```python
internal_gate_args = {
    # Arguments to be passed to the constructor of the internal gate.
}
internal_gate = cirq_google.InternalGate(
    gate_module='GATE_MODULE',  # Module of class.
    gate_name='GATE_NAME',  # Class name.
    num_qubits=2,  # Number of qubits that the gate acts on.
    **internal_gate_args,
)
internal_gate
```

```python
cirq.Circuit(internal_gate(*cirq.LineQubit.range(2)))
```

## Notes
1. InternalGate is serializable.
1. Values of `kwargs` must be serializable as [api.v2.ArgValue](https://github.com/quantumlib/Cirq/blob/61d967112ba23cc839b0e922bd42878024a3e738/cirq-google/cirq_google/api/v2/program.proto#L281)
1. If a value is not serializable as `api.v2.ArgValue` (e.g. a value with unit) then the translator will need to updated to know what to do for that gate.
