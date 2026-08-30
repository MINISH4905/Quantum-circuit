---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/analysis/distance.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/analysis/distance.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/analysis/distance.py`

A collection of discrete probability metrics.

## `hellinger_distance`

```python
def hellinger_distance(dist_p: dict, dist_q: dict) -> float
```

Computes the Hellinger distance between
two counts distributions.

Args:
    dist_p (dict): First dict of counts.
    dist_q (dict): Second dict of counts.

Returns:
    float: Distance

References:
    `Hellinger Distance @ wikipedia <https://en.wikipedia.org/wiki/Hellinger_distance>`_

## `hellinger_fidelity`

```python
def hellinger_fidelity(dist_p: dict, dist_q: dict) -> float
```

Computes the Hellinger fidelity between
two counts distributions.

The fidelity is defined as :math:`\left(1-H^{2}\right)^{2}` where H is the
Hellinger distance.  This value is bounded in the range [0, 1].

This is equivalent to the standard classical fidelity
:math:`F(Q,P)=\left(\sum_{i}\sqrt{p_{i}q_{i}}\right)^{2}` that in turn
is equal to the quantum state fidelity for diagonal density matrices.

Args:
    dist_p (dict): First dict of counts.
    dist_q (dict): Second dict of counts.

Returns:
    float: Fidelity

Example:

    .. plot::
       :include-source:
       :nofigs:

        from qiskit import QuantumCircuit
        from qiskit.quantum_info.analysis import hellinger_fidelity
        from qiskit.providers.basic_provider import BasicSimulator

        qc = QuantumCircuit(5, 5)
        qc.h(2)
        qc.cx(2, 1)
        qc.cx(2, 3)
        qc.cx(3, 4)
        qc.cx(1, 0)
        qc.measure(range(5), range(5))

        sim = BasicSimulator()
        res1 = sim.run(qc).result()
        res2 = sim.run(qc).result()

        hellinger_fidelity(res1.get_counts(), res2.get_counts())

References:
    `Quantum Fidelity @ wikipedia <https://en.wikipedia.org/wiki/Fidelity_of_quantum_states>`_
    `Hellinger Distance @ wikipedia <https://en.wikipedia.org/wiki/Hellinger_distance>`_
