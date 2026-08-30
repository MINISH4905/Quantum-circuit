---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/quirk/export_to_quirk.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/quirk/export_to_quirk.py
license: Apache-2.0
---

## `circuit_to_quirk_url`

```python
def circuit_to_quirk_url(circuit: circuits.Circuit, prefer_unknown_gate_to_failure: bool=False, escape_url=True) -> str
```

Returns a Quirk URL for the given circuit.

Args:
    circuit: The circuit to open in Quirk.
    prefer_unknown_gate_to_failure: If not set, gates that fail to convert
        will cause this function to raise an error. If set, a URL
        containing bad gates will be generated. (Quirk will open the URL,
        and replace the bad gates with parse errors, but still get the rest
        of the circuit.)
    escape_url: If set, the generated URL will have special characters such
        as quotes escaped using %. This makes it possible to paste the URL
        into forums and the command line and etc and have it properly
        parse. If not set, the generated URL will be more compact and human
        readable (and can still be pasted directly into a browser's address
        bar).

Returns:
