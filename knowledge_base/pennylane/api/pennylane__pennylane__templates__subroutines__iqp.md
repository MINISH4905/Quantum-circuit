---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/iqp.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/iqp.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/iqp.py`

Contains the IQP template.

## `IQP`

```python
class IQP(Operation)
```

A template that builds an Instantaneous Quantum Polynomial (IQP) circuit. The gates of these circuits correspond
to multi-qubit X rotations, whose generators are given by tensor products of Pauli X operators.

In this `IQPOpt <https://arxiv.org/pdf/2501.04776>`__ paper and this
`train on classical, deploy on quantum <https://arxiv.org/pdf/2503.02934>`__ paper, the authors
present methods for analytically approximating expectation values coming from measurements made on IQP circuits.
This allows for the classical training of the parameters of these circuits prior to deploying them to a
quantum computer for actual computation.

Certain computational problems such as generative machine learning and combinatorial optimization can be cast as
a minimization over functions of these expectation values. Since these circuits are also believed to be hard to
sample from using classical algorithms, they can potentially lead to a quantum advantage.

Args:
    weights (list): The parameters of the IQP gates.
    num_wires (int): Number of wires in the circuit.
    pattern (list[list[list[int]]]): Specification of the trainable gates. Each element of ``pattern`` corresponds to a
        unique trainable parameter. Each sublist specifies the generators to which that parameter applies.
        Generators are specified by listing the qubits on which an X operator acts. For example, the ``pattern``
        ``[[[0]], [[1]], [[2]], [[3]]]`` specifies a circuit with single qubit rotations on the first four qubits, each
        with its own trainable parameter. The ``pattern`` ``[[[0],[1]], [[2],[3]]]`` correspond to a circuit with two
        trainable parameters with generators :math:`X_0+X_1` and :math:`X_2+X_3` respectively. A circuit with a
        single trainable gate with generator :math:`X_0\otimes X_1` corresponds to the ``pattern``
        ``[[[0,1]]]``.
    spin_sym (bool, optional): If True, the circuit is equivalent to one where the initial state
        :math:`\frac{1}{\sqrt(2)}(|00\dots0> + |11\dots1>)` is used in place of :math:`|00\dots0>`.

Raises:
    ValueError: when ``pattern`` and ``weights`` have a different number of elements.

**Example:**

Below is an example of a 2-qubit IQP circuit. At this small scale, a state vector simulation is tractable.

.. code-block:: python

    dev = qp.device("default.qubit")

    @qp.qnode(dev)
    def iqp_circuit(weights, pattern, spin_sym):
        qp.IQP(weights=weights, num_wires=2, pattern=pattern, spin_sym=spin_sym)
        return [qp.expval(qp.PauliZ(0)), qp.expval(qp.PauliZ(1))]

>>> iqp_circuit(weights=[0.89, 0.54], pattern=[[[0]], [[1]]], spin_sym=False)  # doctest: +SKIP
[np.float64(-0.20768100160878344), np.float64(0.47132836417373947)]

>>> print(qp.draw(iqp_circuit, level="device")([0.89, 0.54], [[[0]], [[1]]], False))  # doctest: +SKIP
0: ─╭IQP─┤  <Z>
1: ─╰IQP─┤  <Z>

.. seealso:: :doc:`IQP tutorial <demo:demos/tutorial_iqp_circuit_optimization_jax>`
