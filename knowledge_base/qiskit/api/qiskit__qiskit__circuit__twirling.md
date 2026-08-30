---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/twirling.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/twirling.py
license: Apache-2.0
---

## Module `qiskit/circuit/twirling.py`

The twirling module.

## `pauli_twirl_2q_gates`

```python
def pauli_twirl_2q_gates(circuit: QuantumCircuit, twirling_gate: None | str | Gate | list[str] | list[Gate]=None, seed: int | None=None, num_twirls: int | None=None, target: Target | None=None) -> QuantumCircuit | list[QuantumCircuit]
```

Create copies of a given circuit with Pauli twirling applied around specified two qubit
gates.

If you're running this function with the intent to twirl a circuit to run on hardware this
may not be the most efficient way to perform twirling. Especially if the hardware vendor
has implemented the :mod:`.primitives` execution interface with :class:`.SamplerV2` and
:class:`.EstimatorV2` this most likely is not the best way to apply twirling to your
circuit and you'll want to refer to the implementation of :class:`.SamplerV2` and/or
:class:`.EstimatorV2` for the specified hardware vendor.

If the intent of this function is to be run after :func:`.transpile` or
:meth:`.PassManager.run` the optional ``target`` argument can be used
so that the inserted 1 qubit Pauli gates are synthesized to be
compatible with the given :class:`.Target` so the output circuit(s) are
still compatible.

Args:
    circuit: The circuit to twirl
    twirling_gate: The gate to twirl, defaults to `None` which means twirl all default gates:
        :class:`.CXGate`, :class:`.CZGate`, :class:`.ECRGate`, and :class:`.iSwapGate`.
        If supplied it can either be a single gate or a list of gates either as either a gate
        object or its string name. Currently only the names `"cx"`, `"cz"`, `"ecr"`,  and
        `"iswap"` are supported. If a gate object is provided outside the default gates it must
        have a matrix defined from its :class:`~.Gate.to_matrix` method for the gate to potentially
        be twirled. If a valid twirling configuration can't be computed that particular gate will
        be silently ignored and not twirled.
    seed: An integer seed for the random number generator used internally by this function.
        If specified this must be between 0 and 18,446,744,073,709,551,615.
    num_twirls: The number of twirling circuits to build. This defaults to ``None`` and will return
        a single circuit. If it is an integer a list of circuits with `num_twirls` circuits
        will be returned.
    target: If specified an :class:`.Target` instance to use for running single qubit decomposition
        as part of the Pauli twirling to optimize and map the pauli gates added to the circuit
        to the specified target.

Returns:
    A copy of the given circuit with Pauli twirling applied to each
    instance of the specified twirling gate.
