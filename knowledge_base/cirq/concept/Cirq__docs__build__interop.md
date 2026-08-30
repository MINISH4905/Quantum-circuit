---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/build/interop.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/build/interop.ipynb
license: Apache-2.0
---

##### Copyright 2020 The Cirq Developers

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

# Import/export circuits

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/build/interop"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/build/interop.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/build/interop.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/build/interop.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

```python
try:
    import cirq
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq
    print("installed cirq.")
```

Cirq has several features that allow the user to import/export from other quantum languages.

## Exporting and importing to JSON

For storing circuits or for transferring them between collaborators, JSON can be a good choice.  Many objects in cirq can be serialized as JSON and then stored as a text file for transfer, storage, or for posterity.

Any object that can be serialized, which includes circuits, moments, gates, operations, and many other cirq constructs, can be turned into JSON with the protocol `cirq.to_json(obj)`.  This will return a string that contains the serialized JSON.

To take JSON and turn it back into a cirq object, the protocol `cirq.read_json` can be used.  This can take a python file or string filename as the first argument (`file_or_fn`) or can take a named `json_text` parameter to accept a string input.

The following shows how to serialize and de-serialize a circuit.

```python
import cirq

# Example circuit
circuit = cirq.Circuit(cirq.Z(cirq.GridQubit(1, 1)))

# Serialize to a JSON string
json_string = cirq.to_json(circuit)
print('JSON string:')
print(json_string)
print()

# Now, read back the string into a cirq object
# cirq.read_json can also read from a file
new_circuit = cirq.read_json(json_text=json_string)

print(f'Deserialized object of type: {type(new_circuit)}:')
print(new_circuit)
```

### Advanced: Adding JSON compatibility for custom objects in cirq

Most cirq objects come with serialization functionality added already.  If you are adding a custom object (such as a custom gate), you can still serialize the object, but you will need to add the magic functions `_json_dict_` and `_from_json_dict_` to your object to do so.

When de-serializing, in order to instantiate the correct object, you will also have to pass in a custom resolver.  This is a function that will take as input the serialized `cirq_type` string and output a constructable class.  See 
[`cirq.protocols.json_serialization`](https://github.com/quantumlib/Cirq/blob/main/cirq-core/cirq/protocols/json_serialization.py) for more details.

## Importing from OpenQASM

The QASM importer is in an experimental state and currently only supports a subset of the full **OpenQASM spec**. However, both OpenQASM 2.0 and 3.0 have this limited support. Amongst others, classical control, arbitrary gate definitions, and even some of the gates that don't have a one-to-one representation in Cirq, are not yet supported. The functionality should be sufficient to import interesting quantum circuits. Error handling is very simple - on any lexical or syntactical error, a `QasmException` is raised.

### Importing cirq.Circuit from QASM format

Requirements: `ply`

```python
!pip install --quiet cirq
!pip install --quiet ply
```

The following call will create a circuit defined by the input QASM string:

```python
from cirq.contrib.qasm_import import circuit_from_qasm

circuit = circuit_from_qasm("""
    OPENQASM 2.0;
    include "qelib1.inc";
    qreg q[3];
    creg meas[3];
    h q;
    measure q -> meas;
    """)
print(circuit)
```

OpenQASM 3.0 also has limited support, which can be seen by the following code:

```python
from cirq.contrib.qasm_import import circuit_from_qasm

circuit = circuit_from_qasm("""
OPENQASM 3.0;
include "stdgates.inc";

// Qubits: [q0]
qubit[2] q;
bit[2] m_mmm;

x q;
m_mmm = measure q;
""")
print(circuit)
```

#### Supported control statements 


| Statement|Cirq support|Description|Example|
|----| --------| --------| --------|
|`OPENQASM 2.0;`| supported| Denotes a file in Open QASM format| OPENQASM 2.0;|
|`qreg name[size];`| supported (see mapping qubits)| Declare a named register of qubits|`qreg q[5];`|
|`creg name[size];`|supported (see mapping classical register to measurement keys)|  Declare a named register of bits|`creg c[5];`|
|`include "filename";`| supported ONLY to include the standard "qelib1.inc" lib for compatibility| Open and parse another source file|`include "qelib1.inc";`|
|`gate name(params) qargs;`| supported| Declare a unitary gate|`gate g(p0, p1) q0, q1 { rx(p0) q0; ry(p0+p1) q0, rz(p1) q1; }`|
|`opaque name(params) qargs;`| NOT supported| Declare an opaque gate||
|`// comment text`| supported|Comment a line of text|`// supported!`|
|`U(θ,φ,λ) qubit/qreg;`|  supported| Apply built-in single qubit gate(s)|``U(pi/2,2*pi/3,0) q[0];``|
|`CX qubit/qreg,qubit/qreg;`| supported|Apply built-in CNOT gate(s)|`CX q[0],q[1];`|
|measure qubit/qreg|supported|Make measurements in Z basis||
|`reset qubit/qreg;`| supported|Prepare qubit(s) in <code>&#124;0></code>|`reset q[0];`| 
|`gatename(params) qargs;`|  supported for ONLY the supported subset of standard gates defined in "qelib1.inc"|Apply a user-defined unitary gate|`rz(pi/2) q[0];`|
|`if(creg==int) qop;`| supported| Conditionally apply quantum operation|`if(c==5) CX q[0],q[1];`|
|`barrier qargs;`| NOT supported| Prevent transformations across this source line|`barrier q[0],q[1];`|

#### Gate conversion rules 

Note: The standard Quantum Experience gates (defined in [qelib1.inc](https://github.com/Qiskit/qiskit/blob/50523425cb469b0e0268f39b05b20816d703c7e2/qiskit/qasm/libs/qelib1.inc)) are 
based on the `U` and `CX` built-in instructions, and we could generate them dynamically. Instead, we chose to map them to native Cirq gates explicitly, which results in a more user-friendly circuit. 

| QE gates| Cirq translation| Notes|
| --------| --------| --------|
|`U(θ,φ,λ)` |`QasmUGate(θ/π,φ/π,λ/π)`|cirq gate takes angles in half turns| 
|`CX` |`cirq.CX`|| 
|`u3(θ,φ,λ)`|`QasmUGate(θ/π,φ/π,λ/π)`|cirq gate takes angles in half turns|
|`u2(φ,λ) = u3(π/2,φ,λ)`|`QasmUGate(1/2,φ/π,λ/π)`|cirq gate takes angles in half turns| 
|`u1(λ) = u3(0,0,λ)`| NOT supported || 
|`id`|`cirq.Identity`| one single-qubit Identity gate is created for each qubit if applied on a register|  
|`u0(γ)`| NOT supported| this is the "WAIT gate" for length γ in QE| 
|`x`|`cirq.X`|| 
|`y`|`cirq.Y`|| 
|`z`|`cirq.Z`|| 
|`h`|`cirq.H`|| 
|`s`|`cirq.S`|| 
|`sdg`|``cirq.S**-1``|| 
|`t`|`cirq.T`|| 
|`tdg`|``cirq.T**-1``||
|`rx(θ)`|`cirq.Rx(θ)`|| 
|`ry(θ)`|`cirq.Ry(θ)`|| 
|`rz(θ)`|`cirq.Rz(θ)`|| 
|`cx`|`cirq.CX`|| 
|`cy`|`cirq.ControlledGate(cirq.Y)`|| 
|`cz`|`cirq.CZ`|| 
|`ch`|`cirq.ControlledGate(cirq.H)`|| 
|`swap`|`cirq.SWAP`|| 
|`ccx`|`cirq.CCX`|| 
|`cswap`|`cirq.CSWAP`|| 
|`crz`|`cirq.ControlledGate(cirq.Rz(θ))`|| 
|`cu1`|`cirq.ControlledGate(u3(0,0,λ))`|| 
|`cu3`|`cirq.ControlledGate(u3(θ,φ,λ))`|| 
|`rzz`| NOT supported||

#### Mapping quantum registers to qubits 

For a quantum register `qreg qfoo[n];` the QASM importer will create `cirq.NamedQubit`s named `qfoo_0`..`qfoo_<n-1>`. 

#### Mapping classical registers to measurement keys

For a classical register `creg cbar[n];` the QASM importer will create measurement keys named `cbar_0`..`cbar_<n-1>`.

### Exporting cirq.Circuit to QASM format

Cirq also has the ability to export circuits in OpenQASM format using either OpenQasm 2.0 or 3.0 formats. This can be done using the `circuit.to_qasm()` function, such as
`circuit.to_qasm(version="3.0")` or by using the `cirq.qasm` protocol, as follows:

```python
q0 = cirq.NamedQubit('q0')
circuit = cirq.Circuit(cirq.X(q0), cirq.measure(q0, key='mmm'))
qasm_str = cirq.qasm(circuit, args=cirq.QasmArgs(version="3.0"))
print(qasm_str)
```

 Currently supported version strings are "2.0" and "3.0".

 By default, if no version is specified, circuits are currently exported in OpenQasm 2.0 format.  This default behavior may change in the future so be sure to specify the argument if a specific version of OpenQASM is desired.

## Importing from Quirk

[Quirk](https://algassert.com/quirk) is a drag-and-drop quantum circuit simulator, great for manipulating and exploring small quantum circuits. Quirk's visual style gives a reasonably intuitive feel of what is happening, state displays update in real time as you change the circuit, and the general experience is fast and interactive.

After constructing a circuit in Quirk, you can easily convert it to cirq using the URL generated.  Note that not all gates in Quirk are currently convertible.

```python
quirk_url = "https://algassert.com/quirk#circuit=%7B%22cols%22:[[%22H%22,%22H%22],[%22%E2%80%A2%22,%22X%22],[%22H%22,%22H%22]]}"
c = cirq.quirk_url_to_circuit(quirk_url)

print(c)
```

You can also convert the JSON from the "export" button on the top bar of Quirk.  Note that you must parse the JSON string into a dictionary before passing it to the function:

```python
import json

quirk_str = """{
  "cols": [
    [
      "H",
      "H"
    ],
    [
      "•",
      "X"
    ],
    [
      "H",
      "H"
    ]
  ]
}"""
quirk_json = json.loads(quirk_str)
c = cirq.quirk_json_to_circuit(quirk_json)

print(c)
```
