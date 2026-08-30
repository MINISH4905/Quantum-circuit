---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/qasm2/parse.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/qasm2/parse.py
license: Apache-2.0
---

## Module `qiskit/qasm2/parse.py`

Python-space bytecode interpreter for the output of the main Rust parser logic.

## `CustomInstruction`

```python
class CustomInstruction
```

Information about a custom instruction that should be defined during the parse.

The ``name``, ``num_params`` and ``num_qubits`` fields are self-explanatory.  The
``constructor`` field should be a callable object with signature ``*args -> Instruction``, where
each of the ``num_params`` ``args`` is a floating-point value.  Most of the built-in Qiskit gate
classes have this form.

There is a final ``builtin`` field.  This is optional, and if set true will cause the
instruction to be defined and available within the parsing, even if there is no definition in
any included OpenQASM 2 file.

Examples:

    Instruct the importer to use Qiskit's :class:`.ECRGate` and :class:`.RZXGate` objects to
    interpret ``gate`` statements that are known to have been created from those same objects
    during OpenQASM 2 export::

        from qiskit import qasm2
        from qiskit.circuit import QuantumCircuit, library

        qc = QuantumCircuit(2)
        qc.ecr(0, 1)
        qc.rzx(0.3, 0, 1)
        qc.rzx(0.7, 1, 0)
        qc.rzx(1.5, 0, 1)
        qc.ecr(1, 0)

        # This output string includes `gate ecr q0, q1 { ... }` and `gate rzx(p) q0, q1 { ... }`
        # statements, since `ecr` and `rzx` are neither built-in gates nor in ``qelib1.inc``.
        dumped = qasm2.dumps(qc)

        # Tell the importer how to interpret the `gate` statements, which we know are safe
        # because we controlled the input OpenQASM 2 source.
        custom = [
            qasm2.CustomInstruction("ecr", 0, 2, library.ECRGate),
            qasm2.CustomInstruction("rzx", 1, 2, library.RZXGate),
        ]

        loaded = qasm2.loads(dumped, custom_instructions=custom)

## `from_bytecode`

```python
def from_bytecode(bytecode, custom_instructions: Iterable[CustomInstruction])
```

Loop through the Rust bytecode iterator `bytecode` producing a
:class:`~qiskit.circuit.QuantumCircuit` instance from it.  All the hard work is done in Rust
space where operations are faster; here, we're just about looping through the instructions as
fast as possible, doing as little calculation as we can in Python space.  The Python-space
components are the vast majority of the runtime.

The "bytecode", and so also this Python function, is very tightly coupled to the output of the
Rust parser.  The bytecode itself is largely defined by Rust; from Python space, the iterator is
over essentially a 2-tuple of `(opcode, operands)`.  The `operands` are fixed by Rust, and
assumed to be correct by this function.

The Rust code is responsible for all validation.  If this function causes any errors to be
raised by Qiskit (except perhaps for some symbolic manipulations of `Parameter` objects), we
should consider that a bug in the Rust code.
