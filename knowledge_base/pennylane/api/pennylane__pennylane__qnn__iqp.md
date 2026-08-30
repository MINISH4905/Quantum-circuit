---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qnn/iqp.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qnn/iqp.py
license: Apache-2.0
---

## Module `pennylane/qnn/iqp.py`

This submodule defines methods for estimating the expectations of Pauli-Z operators following an IQP circuit.

## `iqp_expval`

```python
def iqp_expval(ops: list, weights: list[float], pattern: list[list[list[int]]], num_wires: int, n_samples: int, key: list, spin_sym: bool=False, sparse: bool=False, indep_estimates: bool=False, max_batch_ops: int=None, max_batch_samples: int=None) -> list
```

Estimates the expectation values of a batch of Pauli-Z type operators for a parameterized :class:`~.IQP` circuit.

The expectation values are estimated using a randomized method (Monte Carlo method) whose precision
is controlled by the number of samples (``n_samples``), with larger values giving higher precision.

Args:
    ops (list): Array specifying the operator/s for which to estimate the expectation values.
    weights (list): The parameters of the IQP gates.
    pattern (list[list[list[int]]]): Specification of the trainable gates. Each element of `pattern` corresponds to a
        unique trainable parameter. Each sublist specifies the generators to which that parameter applies.
        Generators are specified by listing the qubits on which an X operator acts. For example, the `pattern`
        `[[[0]], [[1]], [[2]], [[3]]]` specifies a circuit with single qubit rotations on the first four qubits, each
        with its own trainable parameter. The `pattern` `[[[0],[1]], [[2],[3]]]` corresponds to a circuit with two
        trainable parameters with generators :math:`X_0+X_1` and :math:`X_2+X_3` respectively. A circuit with a
        single trainable gate with generator :math:`X_0\otimes X_1` corresponds to the `pattern`
        `[[[0,1]]]`.
    num_wires (int): Number of wires in the circuit.
    n_samples (int): Number of samples used to estimate the IQP expectation values. Higher values result in
        higher precision.
    key (Array): Jax key to control the randomness of the process.
    spin_sym (bool, optional): If True, the circuit is equivalent to one where the initial state
        :math:`\frac{1}{\sqrt(2)}(|00\dots0> + |11\dots1>)` is used in place of :math:`|00\dots0>`. This defines a circuit whose output distribution is invariant to flipping all bits.
    indep_estimates (bool): Whether to use independent estimates of the operators in a batch.
        If True, correlation among the estimated expectation values can be avoided, although at the cost
        of larger runtime.
    max_batch_ops (int): Specifies the maximum size of sub-batches of ``ops`` that are used to estimate the expectation values (to control memory usage). If None, a single batch is used. Can only be used if ``ops`` is a jnp.array.
    max_batch_samples (int): Specifies the maximum size of sub-batches of samples that are used to estimate the expectation values of ``ops`` (to control memory usage). If None, a single batch is used.

Returns:
    list: List of Vectors. The expected value of each operator and its corresponding standard deviation.

**Example:**

To estimate the expectation value of a Pauli Z tensor, we represent the operator as a binary string
(bitstring) that specifies on which qubit a Pauli ``Z`` operator acts. For example, in a three-qubit
circuit, the operator :math:`Z_0 Z_2` will be represented as :math:`[1, 0, 1]`. Similarly, the expectation
values for a group of operators can be evaluated by specifiying a sequence of bitstrings.

As an example, let's estimate the expectation values for the operators :math:`Z_1`, :math:`Z_0`, and :math:`Z_0 Z_1`
for a two-qubit circuit, using 1000 samples for the Monte Carlo estimation:

.. code-block:: python

    from pennylane.qnn import iqp_expval
    import jax

    num_wires = 2
    ops = np.array([[0, 1], [1, 0], [1, 1]]) # binary array representing ops Z1, Z0, Z0Z1
    n_samples = 1000
    key = jax.random.PRNGKey(42)

    weights = np.ones(len(pattern))
    pattern = [[[0]], [[1]], [[0, 1]]] # binary array representing gates X0, X1, X0X1

    expvals, stds = iqp_expval(ops, weights, pattern, num_wires, n_samples, key)

>>> print(expvals, stds)
[0.18971464 0.14175898 0.17152457] [0.02615426 0.02614059 0.02615943]

.. seealso:: The :class:`~.IQP` operation associated with this method.
