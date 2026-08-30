---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/math/quantum.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/math/quantum.py
license: Apache-2.0
---

## Module `pennylane/math/quantum.py`

Differentiable quantum functions

## `cov_matrix`

```python
def cov_matrix(prob, obs, wires=None, diag_approx=False)
```

Calculate the covariance matrix of a list of commuting observables, given
the joint probability distribution of the system in the shared eigenbasis.

.. note::
    This method only works for **commuting observables.**
    If the probability distribution is the result of a quantum circuit,
    the quantum state must be rotated into the shared
    eigenbasis of the list of observables before measurement.

Args:
    prob (tensor_like): probability distribution
    obs (list[.Operator]): a list of observables for which
        to compute the covariance matrix
    diag_approx (bool): if True, return the diagonal approximation
    wires (.Wires): The wire register of the system. If not provided,
        it is assumed that the wires are labelled with consecutive integers.

Returns:
    tensor_like: the covariance matrix of size ``(len(obs), len(obs))``

**Example**

Consider the following ansatz and observable list:

>>> obs_list = [qp.X(0) @ qp.Z(1), qp.Y(2)]
>>> ansatz = qp.templates.StronglyEntanglingLayers

We can construct a QNode to output the probability distribution in the shared eigenbasis of the
observables:

.. code-block:: python

    from pennylane import numpy as np

    dev = qp.device("default.qubit", wires=3)

    @qp.qnode(dev, interface="autograd")
    def circuit(weights):
        ansatz(weights, wires=[0, 1, 2])
        # rotate into the basis of the observables
        for o in obs_list:
            o.diagonalizing_gates()
        return qp.probs(wires=[0, 1, 2])

We can now compute the covariance matrix:

>>> shape = qp.templates.StronglyEntanglingLayers.shape(n_layers=2, n_wires=3)
>>> weights = np.random.random(shape, requires_grad=True)
>>> cov = qp.math.cov_matrix(circuit(weights), obs_list)
>>> cov
tensor([[0.98125435, 0.4905541 ],
        [0.4905541 , 0.99920878]], requires_grad=True)

Autodifferentiation is fully supported using all interfaces.
Here we use autograd:

>>> cost_fn = lambda weights: qp.math.cov_matrix(circuit(weights), obs_list)[0, 1]
>>> qp.grad(cost_fn)(weights)
array([[[ 4.94240914e-17, -2.33786398e-01, -1.54193959e-01],
        [-3.05414996e-17,  8.40072236e-04,  5.57884080e-04],
        [ 3.01859411e-17,  8.60411436e-03,  6.15745204e-04]],
       [[ 6.80309533e-04, -1.23162742e-03,  1.08729813e-03],
        [-1.53863193e-01, -1.38700657e-02, -1.36243323e-01],
        [-1.54665054e-01, -1.89018172e-02, -1.56415558e-01]]])

## `marginal_prob`

```python
def marginal_prob(prob, axis)
```

Compute the marginal probability given a joint probability distribution expressed as a tensor.
Each random variable corresponds to a dimension.

If the distribution arises from a quantum circuit measured in computational basis, each dimension
corresponds to a wire. For example, for a 2-qubit quantum circuit `prob[0, 1]` is the probability of measuring the
first qubit in state 0 and the second in state 1.

Args:
    prob (tensor_like): 1D tensor of probabilities. This tensor should of size
        ``(2**N,)`` for some integer value ``N``.
    axis (list[int]): the axis for which to calculate the marginal
        probability distribution

Returns:
    tensor_like: the marginal probabilities, of
    size ``(2**len(axis),)``

**Example**

>>> x = tf.Variable([1, 0, 0, 1.], dtype=tf.float64) / np.sqrt(2)
>>> marginal_prob(x, axis=[0, 1])
<tf.Tensor: shape=(4,), dtype=float64, numpy=array([0.70710678, 0.        , 0.        , 0.70710678])>
>>> marginal_prob(x, axis=[0])
<tf.Tensor: shape=(2,), dtype=float64, numpy=array([0.70710678, 0.70710678])>

## `reduce_dm`

```python
def reduce_dm(density_matrix, indices, check_state=False, c_dtype='complex128')
```

Compute the density matrix from a state represented with a density matrix.

Args:
    density_matrix (tensor_like): 2D or 3D density matrix tensor. This tensor should be of size ``(2**N, 2**N)`` or
        ``(batch_dim, 2**N, 2**N)``, for some integer number of wires``N``.
    indices (list(int)): List of indices in the considered subsystem.
    check_state (bool): If True, the function will check the state validity (shape and norm).
    c_dtype (str): Complex floating point precision type.

Returns:
    tensor_like: Density matrix of size ``(2**len(indices), 2**len(indices))`` or ``(batch_dim, 2**len(indices), 2**len(indices))``

.. seealso:: :func:`pennylane.math.reduce_statevector`, and :func:`pennylane.density_matrix`

**Example**

>>> x = np.array([[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])
>>> reduce_dm(x, indices=[0])
[[1.+0.j 0.+0.j]
 [0.+0.j 0.+0.j]]

>>> y = [[0.5, 0, 0.5, 0], [0, 0, 0, 0], [0.5, 0, 0.5, 0], [0, 0, 0, 0]]
>>> reduce_dm(y, indices=[0])
[[0.5+0.j 0.5+0.j]
 [0.5+0.j 0.5+0.j]]

>>> reduce_dm(y, indices=[1])
[[1.+0.j 0.+0.j]
 [0.+0.j 0.+0.j]]

>>> z = tf.Variable([[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], dtype=tf.complex128)
>>> reduce_dm(z, indices=[1])
tf.Tensor(
[[1.+0.j 0.+0.j]
 [0.+0.j 0.+0.j]], shape=(2, 2), dtype=complex128)

>>> x = np.array([[[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
...               [[0, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]])
>>> reduce_dm(x, indices=[1])
array([[[1.+0.j, 0.+0.j],
        [0.+0.j, 0.+0.j]],
       [[0.+0.j, 0.+0.j],
        [0.+0.j, 1.+0.j]]])

## `partial_trace`

```python
def partial_trace(matrix, indices, c_dtype='complex128')
```

Compute the reduced density matrix by tracing out the provided indices.

Args:
    matrix (tensor_like): 2D or 3D density matrix tensor. For a 2D tensor, the size is assumed to be
        ``(2**n, 2**n)``, for some integer number of wires ``n``. For a 3D tensor, the first dimension is assumed to be the batch dimension, ``(batch_dim, 2**N, 2**N)``.

    indices (list(int)): List of indices to be traced.

Returns:
    tensor_like: (reduced) Density matrix of size ``(2**len(wires), 2**len(wires))``

.. seealso:: :func:`pennylane.math.reduce_dm`, and :func:`pennylane.math.reduce_statevector`

**Example**

We can compute the partial trace of the matrix ``x`` with respect to its 0th index.

>>> x = np.array([[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])
>>> partial_trace(x, indices=[0])
array([[1.+0.j, 0.+0.j],
       [0.+0.j, 0.+0.j]])

We can also pass a batch of matrices ``x`` to the function and return the partial trace of each matrix with respect to each matrix's 0th index.

>>> x = np.array([
... [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
... [[0, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
... ])
>>> partial_trace(x, indices=[0])
array([[[1.+0.j, 0.+0.j],
        [0.+0.j, 0.+0.j]],
       [[0.+0.j, 0.+0.j],
        [0.+0.j, 1.+0.j]]])

The partial trace can also be computed with respect to multiple indices within different frameworks such as TensorFlow.

>>> x = tf.Variable([[[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
... [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 0], [0, 0, 0, 0]]], dtype=tf.complex128)
>>> partial_trace(x, indices=[1])
<tf.Tensor: shape=(2, 2, 2), dtype=complex128, numpy=
array([[[1.+0.j, 0.+0.j],
        [0.+0.j, 0.+0.j]],
       [[0.+0.j, 0.+0.j],
        [0.+0.j, 1.+0.j]]])>

## `reduce_statevector`

```python
def reduce_statevector(state, indices, check_state=False, c_dtype='complex128')
```

Compute the density matrix from a state vector.

Args:
    state (tensor_like): 1D or 2D tensor state vector. This tensor should of size ``(2**N,)``
        or ``(batch_dim, 2**N)``, for some integer value ``N``.
    indices (list(int)): List of indices in the considered subsystem.
    check_state (bool): If True, the function will check the state validity (shape and norm).
    c_dtype (str): Complex floating point precision type.

Returns:
    tensor_like: Density matrix of size ``(2**len(indices), 2**len(indices))`` or ``(batch_dim, 2**len(indices), 2**len(indices))``

.. seealso:: :func:`pennylane.math.reduce_dm` and :func:`pennylane.density_matrix`

**Example**

>>> x = np.array([1, 0, 0, 0])
>>> reduce_statevector(x, indices=[0])
[[1.+0.j 0.+0.j]
[0.+0.j 0.+0.j]]

>>> y = [1, 0, 1, 0] / np.sqrt(2)
>>> reduce_statevector(y, indices=[0])
[[0.5+0.j 0.5+0.j]
 [0.5+0.j 0.5+0.j]]

>>> reduce_statevector(y, indices=[1])
[[1.+0.j 0.+0.j]
 [0.+0.j 0.+0.j]]

>>> z = tf.Variable([1, 0, 0, 0], dtype=tf.complex128)
>>> reduce_statevector(z, indices=[1])
tf.Tensor(
[[1.+0.j 0.+0.j]
 [0.+0.j 0.+0.j]], shape=(2, 2), dtype=complex128)

>>> x = np.array([[1, 0, 0, 0], [0, 1, 0, 0]])
>>> reduce_statevector(x, indices=[1])
array([[[1.+0.j, 0.+0.j],
        [0.+0.j, 0.+0.j]],
       [[0.+0.j, 0.+0.j],
        [0.+0.j, 1.+0.j]]])

## `dm_from_state_vector`

```python
def dm_from_state_vector(state, check_state=False, c_dtype='complex128')
```

Convenience function to compute a (full) density matrix from
a state vector.

Args:
    state (tensor_like): 1D or 2D tensor state vector. This tensor should of size ``(2**N,)``
        or ``(batch_dim, 2**N)``, for some integer value ``N``.
    check_state (bool): If True, the function will check the state validity (shape and norm).
    c_dtype (str): Complex floating point precision type.

Returns:
    tensor_like: Density matrix of size ``(2**N, 2**N)`` or ``(batch_dim, 2**N, 2**N)``

**Example**

>>> x = np.array([1, 0, 1j, 0]) / np.sqrt(2)
>>> dm_from_state_vector(x)
array([[0.5+0.j , 0. +0.j , 0. -0.5j, 0. +0.j ],
       [0. +0.j , 0. +0.j , 0. +0.j , 0. +0.j ],
       [0. +0.5j, 0. +0.j , 0.5+0.j , 0. +0.j ],
       [0. +0.j , 0. +0.j , 0. +0.j , 0. +0.j ]])

## `purity`

```python
def purity(state, indices, check_state=False, c_dtype='complex128')
```

Computes the purity of a density matrix.

.. math::
    \gamma = \text{Tr}(\rho^2)

where :math:`\rho` is the density matrix. The purity of a normalized quantum state satisfies
:math:`\frac{1}{d} \leq \gamma \leq 1`, where :math:`d` is the dimension of the Hilbert space.
A pure state has a purity of 1.

It is possible to compute the purity of a sub-system from a given state. To find the purity of
the overall state, include all wires in the ``indices`` argument.

Args:
    state (tensor_like): Density matrix of shape ``(2**N, 2**N)`` or ``(batch_dim, 2**N, 2**N)``
    indices (list(int)): List of indices in the considered subsystem.
    check_state (bool): If ``True``, the function will check the state validity (shape and norm).
    c_dtype (str): Complex floating point precision type.

Returns:
    float: Purity of the considered subsystem.

**Example**

>>> x = [[1/2, 0, 0, 1/2], [0, 0, 0, 0], [0, 0, 0, 0], [1/2, 0, 0, 1/2]]
>>> purity(x, [0, 1])
1.0
>>> purity(x, [0])
0.5

>>> x = [[1/2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 1/2]]
>>> purity(x, [0, 1])
0.5

## `vn_entropy`

```python
def vn_entropy(state, indices, base=None, check_state=False, c_dtype='complex128')
```

Compute the Von Neumann entropy from a density matrix on a given subsystem. It supports all
interfaces (NumPy, Autograd, Torch, TensorFlow and Jax).

.. math::
    S( \rho ) = -\text{Tr}( \rho \log ( \rho ))

Args:
    state (tensor_like): Density matrix of shape ``(2**N, 2**N)`` or ``(batch_dim, 2**N, 2**N)``.
    indices (list(int)): List of indices in the considered subsystem.
    base (float): Base for the logarithm. If None, the natural logarithm is used.
    check_state (bool): If True, the function will check the state validity (shape and norm).
    c_dtype (str): Complex floating point precision type.

Returns:
    float: Von Neumann entropy of the considered subsystem.

**Example**

The entropy of a subsystem for any state vectors can be obtained. Here is an example for the
maximally entangled state, where the subsystem entropy is maximal (default base for log is exponential).

>>> x = [1, 0, 0, 1] / np.sqrt(2)
>>> x = dm_from_state_vector(x)
>>> vn_entropy(x, indices=[0])
0.6931472

The logarithm base can be switched to 2 for example.

>>> vn_entropy(x, indices=[0], base=2)
1.0

.. seealso:: :func:`pennylane.vn_entropy`

## `mutual_info`

```python
def mutual_info(state, indices0, indices1, base=None, check_state=False, c_dtype='complex128')
```

Compute the mutual information between two subsystems given a state:

.. math::

    I(A, B) = S(\rho^A) + S(\rho^B) - S(\rho^{AB})

where :math:`S` is the von Neumann entropy.

The mutual information is a measure of correlation between two subsystems.
More specifically, it quantifies the amount of information obtained about
one system by measuring the other system. It supports all interfaces
(NumPy, Autograd, Torch, TensorFlow and Jax).

Each state must be given as a density matrix. To find the mutual information given
a pure state, call :func:`~.math.dm_from_state_vector` first.

Args:
    state (tensor_like): ``(2**N, 2**N)`` or ``(batch_dim, 2**N, 2**N)`` density matrix.
    indices0 (list[int]): List of indices in the first subsystem.
    indices1 (list[int]): List of indices in the second subsystem.
    base (float): Base for the logarithm. If None, the natural logarithm is used.
    check_state (bool): If True, the function will check the state validity (shape and norm).
    c_dtype (str): Complex floating point precision type.

Returns:
    float: Mutual information between the subsystems

**Examples**

The mutual information between subsystems for a state vector can be returned as follows:

>>> x = np.array([1, 0, 0, 1]) / np.sqrt(2)
>>> x = qp.math.dm_from_state_vector(x)
>>> qp.math.mutual_info(x, indices0=[0], indices1=[1])
1.3862943611198906

It is also possible to change the log basis.

>>> qp.math.mutual_info(x, indices0=[0], indices1=[1], base=2)
2.0

Similarly the quantum state can be provided as a density matrix:

>>> y = np.array([[1/2, 1/2, 0, 1/2], [1/2, 0, 0, 0], [0, 0, 0, 0], [1/2, 0, 0, 1/2]])
>>> qp.math.mutual_info(y, indices0=[0], indices1=[1])
0.4682351577408206

.. seealso:: :func:`~.math.vn_entropy` and :func:`pennylane.mutual_info`

## `expectation_value`

```python
def expectation_value(operator_matrix, state_vector, check_state=False, check_operator=False, c_dtype='complex128')
```

Compute the expectation value of an operator with respect to a pure state.

The expectation value is the probabilistic expected result of an experiment.
Given a pure state, i.e., a state which can be represented as a single
vector :math:`\ket{\psi}` in the Hilbert space, the expectation value of an
operator :math:`A` can computed as

.. math::
    \langle A \rangle_\psi = \bra{\psi} A \ket{\psi}


Args:
    operator_matrix (tensor_like): operator matrix with shape ``(2**N, 2**N)`` or ``(batch_dim, 2**N, 2**N)``.
    state_vector (tensor_like): state vector with shape ``(2**N)`` or ``(batch_dim, 2**N)``.
    check_state (bool): if True, the function will check the validity of the state vector
        via its shape and the norm.
    check_operator (bool): if True, the function will check the validity of the operator
        via its shape and whether it is hermitian.
    c_dtype (str): complex floating point precision type.

Returns:
    float: Expectation value of the operator for the state vector.

**Example**

The expectation value for any operator can obtained by passing their matrix representation as an argument.
For example, for a 2 qubit state, we can compute the expectation value of the operator :math:`Z \otimes I` as

>>> import pennylane as qp
>>> import numpy as np
>>> state_vector = [1 / np.sqrt(2), 0, 1 / np.sqrt(2), 0]
>>> operator_matrix = qp.matrix(qp.PauliZ(0), wire_order=[0, 1])
>>> qp.math.expectation_value(operator_matrix, state_vector)
tensor(-2.23711432e-17+0.j, requires_grad=True)

.. seealso:: :func:`pennylane.math.fidelity`

## `vn_entanglement_entropy`

```python
def vn_entanglement_entropy(state, indices0, indices1, base=None, check_state=False, c_dtype='complex128')
```

Compute the Von Neumann entanglement entropy between two subsystems in a given state.

.. math::

    S(\rho_A) = -\text{Tr}[\rho_A \log \rho_A] = -\text{Tr}[\rho_B \log \rho_B] = S(\rho_B)

where :math:`S` is the von Neumann entropy, and :math:`\rho_A = \text{Tr}_B [\rho_{AB}]` and
:math:`\rho_B = \text{Tr}_A [\rho_{AB}]` are the reduced density matrices for each partition.

The Von Neumann entanglement entropy is a measure of the degree of quantum entanglement between
two subsystems constituting a pure bipartite quantum state. The entropy of entanglement is the
Von Neumann entropy of the reduced density matrix for any of the subsystems. If it is non-zero,
it indicates the two subsystems are entangled.

Each state must be given as a density matrix. To find the mutual information given
a pure state, call :func:`~.math.dm_from_state_vector` first.

Args:
    state (tensor_like): ``(2**N, 2**N)`` or ``(batch_dim, 2**N, 2**N)`` density matrix.
    indices0 (list[int]): Indices of the qubits in the first subsystem.
    indices1 (list[int]): Indices of the qubits in the second subsystem.
    base (float): Base for the logarithm. If ``None``, the natural logarithm is used.
    check_state (bool): If True, the function will check the state validity (shape and norm).
    c_dtype (str): Complex floating point precision type.

Returns:
    float: The von Neumann entanglement entropy of the bipartite state.

**Examples**

The entanglement entropy between subsystems for a state vector can be returned as follows:

>>> x = np.array([0, -1, 1, 0]) / np.sqrt(2)
>>> x = qp.math.dm_from_state_vector(x)
>>> qp.math.vn_entanglement_entropy(x, indices0=[0], indices1=[1])
0.6931471805599453

It is also possible to change the logarithm base:

>>> qp.math.vn_entanglement_entropy(x, indices0=[0], indices1=[1], base=2)
1

Similarly, the quantum state can be provided as a density matrix:

>>> y = np.array([[1, 1, -1, -1], [1, 1, -1, -1], [-1, -1, 1, 1], [-1, -1, 1, 1]]) * 0.25
>>> qp.math.vn_entanglement_entropy(y, indices0=[0], indices1=[1])
0

## `sqrt_matrix`

```python
def sqrt_matrix(density_matrix)
```

Compute the square root matrix of a density matrix where :math:`\rho = \sqrt{\rho} \times \sqrt{\rho}`

Args:
    density_matrix (tensor_like): 2D or 3D (with batching) density matrix of the quantum system.

Returns:
    (tensor_like): Square root of the density matrix.

## `sqrt_matrix_sparse`

```python
def sqrt_matrix_sparse(sparse_matrix)
```

Compute the square root matrix of a positive-definite Hermitian matrix where :math:`\rho = \sqrt{\rho} \times \sqrt{\rho}`

Args:
    sparse_matrix (sparse): 2D sparse matrix of the quantum system.

Returns:
   (sparse): Square root of the sparse matrix. Even for data types like `csr_matrix` or `csc_matrix`, the output matrix is not guaranteed to be sparse as well.

## `relative_entropy`

```python
def relative_entropy(state0, state1, base=None, check_state=False, c_dtype='complex128')
```

Compute the quantum relative entropy of one state with respect to another.

.. math::
    S(\rho\,\|\,\sigma)=-\text{Tr}(\rho\log\sigma)-S(\rho)=\text{Tr}(\rho\log\rho)-\text{Tr}(\rho\log\sigma)
    =\text{Tr}(\rho(\log\rho-\log\sigma))

Roughly speaking, quantum relative entropy is a measure of distinguishability between two
quantum states. It is the quantum mechanical analog of relative entropy.

Each state must be given as a density matrix. To find the relative entropy given
a pure state, call :func:`~.math.dm_from_state_vector` first.

Args:
    state0 (tensor_like): ``(2**N, 2**N)`` or ``(batch_dim, 2**N, 2**N)`` density matrix.
    state1 (tensor_like): ``(2**N, 2**N)`` or ``(batch_dim, 2**N, 2**N)`` density matrix.
    base (float): Base for the logarithm. If None, the natural logarithm is used.
    check_state (bool): If True, the function will check the state validity (shape and norm).
    c_dtype (str): Complex floating point precision type.

Returns:
    float: Quantum relative entropy of state0 with respect to state1

**Examples**

The relative entropy between two equal states is always zero:

>>> x = np.array([1, 0])
>>> x = qp.math.dm_from_state_vector(x)
>>> qp.math.relative_entropy(x, x)
0.0

and the relative entropy between two non-equal pure states is always infinity:

>>> y = np.array([1, 1]) / np.sqrt(2)
>>> y = qp.math.dm_from_state_vector(y)
>>> qp.math.relative_entropy(x, y)
inf

The quantum states can be provided as density matrices, allowing for computation
of relative entropy between mixed states:

>>> rho = np.array([[0.3, 0], [0, 0.7]])
>>> sigma = np.array([[0.5, 0], [0, 0.5]])
>>> qp.math.relative_entropy(rho, sigma)
0.08228288

It is also possible to change the log base:

>>> qp.math.relative_entropy(rho, sigma, base=2)
0.1187091

## `max_entropy`

```python
def max_entropy(state, indices, base=None, check_state=False, c_dtype='complex128')
```

Compute the maximum entropy of a density matrix on a given subsystem. It supports all
interfaces (NumPy, Autograd, Torch, TensorFlow and Jax).

.. math::
    S_{\text{max}}( \rho ) = \log( \text{rank} ( \rho ))

Args:
    state (tensor_like): Density matrix of shape ``(2**N, 2**N)`` or ``(batch_dim, 2**N, 2**N)``.
    indices (list(int)): List of indices in the considered subsystem.
    base (float): Base for the logarithm. If None, the natural logarithm is used.
    check_state (bool): If True, the function will check the state validity (shape and norm).
    c_dtype (str): Complex floating point precision type.

Returns:
    float: The maximum entropy of the considered subsystem.

**Example**

The maximum entropy of a subsystem for any state vector can be obtained by first calling
:func:`~.math.dm_from_state_vector` on the input. Here is an example for the
maximally entangled state, where the subsystem entropy is maximal (default base for log is exponential).

>>> x = [1, 0, 0, 1] / np.sqrt(2)
>>> x = dm_from_state_vector(x)
>>> max_entropy(x, indices=[0])
0.6931472

The logarithm base can be changed. For example:

>>> max_entropy(x, indices=[0], base=2)
1.0

The maximum entropy can be obtained by providing a quantum state as a density matrix. For example:

>>> y = [[1/2, 0, 0, 1/2], [0, 0, 0, 0], [0, 0, 0, 0], [1/2, 0, 0, 1/2]]
>>> max_entropy(y, indices=[0])
0.6931472

The maximum entropy is always greater or equal to the Von Neumann entropy. In this maximally
entangled example, they are equal:

>>> vn_entropy(x, indices=[0])
0.6931472

However, in general, the Von Neumann entropy is lower:

>>> x = [np.cos(np.pi/8), 0, 0, -1j*np.sin(np.pi/8)]
>>> x = dm_from_state_vector(x)
>>> vn_entropy(x, indices=[1])
0.4164955
>>> max_entropy(x, indices=[1])
0.6931472

## `min_entropy`

```python
def min_entropy(state, indices, base=None, check_state=False, c_dtype='complex128')
```

Compute the minimum entropy from a density matrix.

.. math::
    S_{\text{min}}( \rho ) = -\log( \max_{i} ( p_{i} ))

Args:
    state (tensor_like): Density matrix of shape ``(2**N, 2**N)`` or ``(batch_dim, 2**N, 2**N)``.
    indices (list(int)): List of indices in the considered subsystem.
    base (float): Base for the logarithm. If None, the natural logarithm is used.
    check_state (bool): If True, the function will check the state validity (shape and norm).
    c_dtype (str): Complex floating point precision type.

Returns:
    float: The minimum entropy of the considered subsystem.

**Example**

The minimum entropy of a subsystem for any state vector can be obtained by first calling
:func:`~.math.dm_from_state_vector` on the input. Here is an example for the
maximally entangled state, where the subsystem entropy is maximal (default base for log is exponential).

>>> x = [1, 0, 0, 1] / np.sqrt(2)
>>> x = dm_from_state_vector(x)
>>> min_entropy(x, indices=[0])
0.6931472

The logarithm base can be changed. For example:

>>> min_entropy(x, indices=[0], base=2)
1.0

The minimum entropy can be obtained by providing a quantum state as a density matrix. For example:

>>> y = [[1/2, 0, 0, 1/2], [0, 0, 0, 0], [0, 0, 0, 0], [1/2, 0, 0, 1/2]]
>>> min_entropy(y, indices=[0])
0.6931472

The Von Neumann entropy is always greater than the minimum entropy.

>>> x = [np.cos(np.pi/8), 0, 0, -1j*np.sin(np.pi/8)]
>>> x = dm_from_state_vector(x)
>>> vn_entropy(x, indices=[1])
0.4164955
>>> min_entropy(x, indices=[1])
0.1583472

## `trace_distance`

```python
def trace_distance(state0, state1, check_state=False, c_dtype='complex128')
```

Compute the trace distance between two quantum states.

.. math::
    T(\rho, \sigma)=\frac12\|\rho-\sigma\|_1
    =\frac12\text{Tr}\left(\sqrt{(\rho-\sigma)^{\dagger}(\rho-\sigma)}\right)

where :math:`\|\cdot\|_1` is the Schatten :math:`1`-norm.

The trace distance measures how close two quantum states are. In particular, it upper-bounds
the probability of distinguishing two quantum states.

Args:
    state0 (tensor_like): ``(2**N, 2**N)`` or ``(batch_dim, 2**N, 2**N)`` density matrix.
    state1 (tensor_like): ``(2**N, 2**N)`` or ``(batch_dim, 2**N, 2**N)`` density matrix.
    check_state (bool): If True, the function will check the states' validity (shape and norm).
    c_dtype (str): Complex floating point precision type.

Returns:
    float: Trace distance between state0 and state1

**Examples**

The trace distance between two equal states is always zero:

>>> x = np.array([[1, 0], [0, 0]])
>>> qp.math.trace_distance(x, x)
0.0

It is possible to use state vectors by first transforming them into density matrices via the
:func:`~reduce_statevector` function:

>>> y = qp.math.reduce_statevector(np.array([0.2, np.sqrt(0.96)]), [0])
>>> qp.math.trace_distance(x, y)
0.9797958971132713

The quantum states can also be provided as batches of density matrices:

>>> batch0 = np.array([np.eye(2) / 2, np.ones((2, 2)) / 2, np.array([[1, 0],[0, 0]])])
>>> batch1 = np.array([np.ones((2, 2)) / 2, np.ones((2, 2)) / 2, np.array([[1, 0],[0, 0]])])
>>> qp.math.trace_distance(batch0, batch1)
array([0.5, 0. , 0. ])

If only one of the two states represent a single element, then the trace distances are taken
with respect to that element:

>>> rho = np.ones((2, 2)) / 2
>>> qp.math.trace_distance(rho, batch0)
array([0.5       , 0.        , 0.70710678])

## `choi_matrix`

```python
def choi_matrix(Ks, check_Ks=False)
```

Compute the Choi matrix :math:`\Lambda` of a quantum channel :math:`\mathcal{E}`,

.. math:: \Lambda = (\mathbb{1} \otimes \mathcal{E})(|\phi^+ \rangle \langle \phi^+|) = \frac{1}{2^n} \sum_{ij=0}^{2^n-1} |i \rangle \langle j| \otimes \mathcal{E}(|i \rangle \langle j|),

where :math:`|\phi^+ \rangle` is the maximally entangled state
:math:`|\phi^+\rangle = \frac{1}{\sqrt{2^n}} \sum_{i=0}^{2^n-1} |i\rangle \otimes |i\rangle` between the
qubit system the channel :math:`\mathcal{E}` is acting on and additional "artificial" system of the same size.

We assume the channel :math:`\mathcal{E}(\rho) = \sum_\ell K_\ell^\dagger \rho K_\ell` is provided
in terms of its Kraus operators :math:`\{K_j\}` (``Ks``) that are trace-preserving, hence
:math:`\sum_j K_j^\dagger K_j = \mathbb{1}`.

Args:
    Ks (TensorLike): A list of Kraus operators with size ``(2**n, 2**n)`` that act on ``n`` wires.
    check_Ks (bool): Whether or not to check if the provided Kraus operators are trace-preserving, i.e. :math:`\sum_j K_j^\dagger K_j = \mathbb{1}`. Default is ``False``.

Returns:
    TensorLike: The Choi matrix :math:`\Lambda` of size ``(2**(2n), 2**(2n))``

**Examples**

The simplest quantum channel is a single unitary gate. In that case, the Kraus operators reduce to the unitary gate itself.

>>> import pennylane as qp
>>> Ks = [qp.matrix(qp.CNOT((0, 1)))]
>>> Lambda = qp.math.choi_matrix(Ks)
>>> Lambda.shape
(16, 16)

The resulting Choi matrix is a density matrix, so its trace sums to 1.
Because the channel is unitary, the resulting Choi state is pure,
which can be seen from :math:`\text{tr}\left( \Lambda^2 \right) = 1`

>>> np.trace(Lambda), np.trace(Lambda @ Lambda)
(np.float64(1.0), np.float64(1.0))


We can construct a non-unitary channel by taking different unitary operators and weighting them
such that the trace is preserved (i.e., the squares of the coefficients sum to one).

>>> Ks = [np.sqrt(0.3) * qp.CNOT((0, 1)), np.sqrt(1-0.3) * qp.X(0)]
>>> Ks = [qp.matrix(op, wire_order=range(2)) for op in Ks]
>>> Lambda = qp.math.choi_matrix(Ks)

In this case, the resulting Choi matrix does not correspond to a pure state, as seen by
:math:`\text{tr}\left( \Lambda^2 \right) < 1`.

>>> np.trace(Lambda), np.trace(Lambda @ Lambda)
(np.float64(1.0), np.float64(0.58))
