---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/states/utils.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/states/utils.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/states/utils.py`

Quantum information utility functions for states.

## `partial_trace`

```python
def partial_trace(state: Statevector | DensityMatrix, qargs: list) -> DensityMatrix
```

Return reduced density matrix by tracing out part of quantum state.

If all subsystems are traced over this returns the
:meth:`~qiskit.quantum_info.DensityMatrix.trace` of the
input state.

Args:
    state (Statevector or DensityMatrix): the input state.
    qargs (list): The subsystems to trace over.

Returns:
    DensityMatrix: The reduced density matrix.

Raises:
    QiskitError: if input state is invalid.

## `shannon_entropy`

```python
def shannon_entropy(pvec: list | np.ndarray, base: int=2) -> float
```

Compute the Shannon entropy of a probability vector.

The shannon entropy of a probability vector
:math:`\vec{p} = [p_0, ..., p_{n-1}]` is defined as

.. math::

    H(\vec{p}) = \sum_{i=0}^{n-1} p_i \log_b(p_i)

where :math:`b` is the log base and (default 2), and
:math:`0 \log_b(0) \equiv 0`.

Args:
    pvec (array_like): a probability vector.
    base (int): the base of the logarithm [Default: 2].

Returns:
    float: The Shannon entropy H(pvec).

## `schmidt_decomposition`

```python
def schmidt_decomposition(state, qargs)
```

Return the Schmidt Decomposition of a pure quantum state.

For an arbitrary bipartite state:

.. math::
     |\psi\rangle_{AB} = \sum_{i,j} c_{ij}
                         |x_i\rangle_A \otimes |y_j\rangle_B,

its Schmidt Decomposition is given by the single-index sum over k:

.. math::
    |\psi\rangle_{AB} = \sum_{k} \lambda_{k}
                        |u_k\rangle_A \otimes |v_k\rangle_B

where :math:`|u_k\rangle_A` and :math:`|v_k\rangle_B` are an
orthonormal set of vectors in their respective spaces :math:`A` and :math:`B`,
and the Schmidt coefficients :math:`\lambda_k` are positive real values.

Args:
    state (Statevector or DensityMatrix): the input state.
    qargs (list): the list of Input state positions corresponding to subsystem :math:`B`.

Returns:
    list: list of tuples ``(s, u, v)``, where ``s`` (float) are the Schmidt coefficients
    :math:`\lambda_k`, and ``u`` (Statevector), ``v`` (Statevector) are the Schmidt vectors
    :math:`|u_k\rangle_A`, :math:`|u_k\rangle_B`, respectively.

Raises:
    QiskitError: if Input qargs is not a list of positions of the Input state.
    QiskitError: if Input qargs is not a proper subset of Input state.

.. note::
    In Qiskit, qubits are ordered using little-endian notation, with the least significant
    qubits having smaller indices. For example, a four-qubit system is represented as
    :math:`|q_3q_2q_1q_0\rangle`. Using this convention, setting ``qargs=[0]`` will partition the
    state as :math:`|q_3q_2q_1\rangle_A\otimes|q_0\rangle_B`. Furthermore, qubits will be organized
    in this notation regardless of the order they are passed. For instance, passing either
    ``qargs=[1,2]`` or ``qargs=[2,1]`` will result in partitioning the state as
    :math:`|q_3q_0\rangle_A\otimes|q_2q_1\rangle_B`.
