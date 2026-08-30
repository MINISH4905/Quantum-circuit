---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/shadows/classical_shadow.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/shadows/classical_shadow.py
license: Apache-2.0
---

## Module `pennylane/shadows/classical_shadow.py`

Classical Shadows base class with processing functions

## `ClassicalShadow`

```python
class ClassicalShadow
```

Class for classical shadow post-processing expectation values, approximate states, and entropies.

A ``ClassicalShadow`` is a classical description of a quantum state that is capable of reproducing expectation values of local Pauli observables, see `2002.08953 <https://arxiv.org/abs/2002.08953>`_.

The idea is to capture :math:`T` local snapshots (given by the ``shots`` set in the device) of the state by performing measurements in random Pauli bases at each qubit.
The measurement outcomes, denoted ``bits``, as well as the choices of measurement bases, ``recipes``, are recorded in two ``(T, len(wires))`` integer tensors, respectively.

From the :math:`t`-th measurement, we can reconstruct the ``local_snapshots`` (see methods)

.. math:: \rho^{(t)} = \bigotimes_{i=1}^{n} 3 U^\dagger_i |b_i \rangle \langle b_i | U_i - \mathbb{I},

where :math:`U_i` is the rotation corresponding to the measurement (e.g. :math:`U_i=H` for measurement in :math:`X`) of qubit :math:`i` at snapshot :math:`t` and :math:`|b_i\rangle = (1 - b_i, b_i)`
the corresponding computational basis state given the output bit :math:`b_i`.

From these local snapshots, one can compute expectation values of local Pauli strings, where locality refers to the number of non-Identity operators.
The accuracy of the procedure is determined by the number of measurements :math:`T` (``shots``).
To target an error :math:`\epsilon`, one needs of order :math:`T = \mathcal{O}\left( \log(M) 4^\ell/\epsilon^2 \right)` measurements to determine :math:`M` different,
:math:`\ell`-local observables.

One can in principle also reconstruct the global state :math:`\sum_t \rho^{(t)}/T`, though it is not advisable nor practical for larger systems due to its exponential scaling.

.. note:: As per `arXiv:2103.07510 <https://arxiv.org/abs/2103.07510>`_, when computing multiple expectation values it is advisable to directly estimate the desired observables by simultaneously measuring
    qubit-wise-commuting terms. One way of doing this in PennyLane is via :class:`~pennylane.Hamiltonian` and setting ``grouping_type="qwc"``. For more details on this topic, see our demo
    on :doc:`estimating expectation values with classical shadows <demo:demos/tutorial_diffable_shadows>`.

Args:
    bits (tensor): recorded measurement outcomes in random Pauli bases.
    recipes (tensor): recorded measurement bases.
    wire_map (list[int]): list of the measured wires in the order that
        they appear in the columns of ``bits`` and ``recipes``. If None, defaults
        to ``range(n)``, where ``n`` is the number of measured wires.

.. seealso:: Demo on :doc:`Estimating observables with classical shadows in the Pauli basis <demo:demos/tutorial_diffable_shadows>`, :func:`~.pennylane.classical_shadow`

**Example**

We obtain the ``bits`` and ``recipes`` via :func:`~.pennylane.classical_shadow` measurement:

.. code-block:: python3

    dev = qp.device("default.qubit", wires=range(2))

    @qp.set_shots(shots=1000)
    @qp.qnode(dev)
    def qnode(x):
        qp.Hadamard(0)
        qp.CNOT((0,1))
        qp.RX(x, wires=0)
        return qp.classical_shadow(wires=range(2))

    bits, recipes = qnode(0)
    shadow = qp.ClassicalShadow(bits, recipes)

After recording these ``T=1000`` quantum measurements, we can post-process the results to arbitrary local expectation values of Pauli strings.
For example, we can compute the expectation value of a Pauli string

>>> shadow.expval(qp.X(0) @ qp.X(1), k=1)
array(0.972)

or of a Hamiltonian:

>>> H = qp.Hamiltonian([1., 1.], [qp.Z(0) @ qp.Z(1), qp.X(0) @ qp.X(1)])
>>> shadow.expval(H, k=1)
array(1.917)

The parameter ``k`` is used to estimate the expectation values via the `median of means` algorithm (see `2002.08953 <https://arxiv.org/abs/2002.08953>`_). The case ``k=1`` corresponds to simply taking the mean
value over all local snapshots. ``k>1`` corresponds to splitting the ``T`` local snapshots into ``k`` equal parts, and taking the median of their individual means. For the case of measuring only in the Pauli basis,
there is no advantage expected from setting ``k>1``.

### `snapshots`

```python
def snapshots(self)
```

The number of snapshots in the classical shadow measurement.

### `local_snapshots`

```python
def local_snapshots(self, wires=None, snapshots=None)
```

Compute the T x n x 2 x 2 local snapshots

For each qubit and each snapshot, compute :math:`3 U_i^\dagger |b_i \rangle \langle b_i| U_i - 1`

Args:
    wires (Iterable[int]): The wires over which to compute the snapshots. For ``wires=None`` (default) all ``n`` qubits are used.
    snapshots (Iterable[int] or int): Only compute a subset of local snapshots. For ``snapshots=None`` (default), all local snapshots are taken.
        In case of an integer, a random subset of that size is taken. The subset can also be explicitly fixed by passing an Iterable with the corresponding indices.

Returns:
    tensor: The local snapshots tensor of shape ``(T, n, 2, 2)`` containing the local local density matrices for each snapshot and each qubit.

### `global_snapshots`

```python
def global_snapshots(self, wires=None, snapshots=None)
```

Compute the T x 2**n x 2**n global snapshots

.. warning::

    Classical shadows are not intended to reconstruct global quantum states.
    This method requires exponential scaling of measurements for accurate representations. Further, the output scales exponentially in the output dimension,
    and is therefore not practical for larger systems. A warning is raised for systems of sizes ``n>16``.

Args:
    wires (Iterable[int]): The wires over which to compute the snapshots. For ``wires=None`` (default) all ``n`` qubits are used.
    snapshots (Iterable[int] or int): Only compute a subset of local snapshots. For ``snapshots=None`` (default), all local snapshots are taken.
        In case of an integer, a random subset of that size is taken. The subset can also be explicitly fixed by passing an Iterable with the corresponding indices.

Returns:
    tensor: The global snapshots tensor of shape ``(T, 2**n, 2**n)`` containing the density matrices for each snapshot measurement.

**Example**

We can approximately reconstruct a Bell state:

.. code-block:: python3

    dev = qp.device("default.qubit", wires=range(2))

    @qp.set_shots(shots=1000)
    @qp.qnode(dev)
    def qnode():
        qp.Hadamard(0)
        qp.CNOT((0,1))
        return classical_shadow(wires=range(2))

    bits, recipes = qnode()
    shadow = ClassicalShadow(bits, recipes)
    shadow_state = np.mean(shadow.global_snapshots(), axis=0)

    bell_state = np.array([[0.5, 0, 0, 0.5], [0, 0, 0, 0], [0, 0, 0, 0], [0.5, 0, 0, 0.5]])

>>> np.allclose(bell_state, shadow_state, atol=1e-1)
True

### `expval`

```python
def expval(self, H, k=1)
```

Compute expectation value of an observable :math:`H`.

The canonical way of computing expectation values is to simply average the expectation values for each local snapshot, :math:`\langle O \rangle = \sum_t \text{tr}(\rho^{(t)}O) / T`.
This corresponds to the case ``k=1``. In the original work, `2002.08953 <https://arxiv.org/abs/2002.08953>`_, it has been proposed to split the ``T`` measurements into ``k`` equal
parts to compute the median of means. For the case of Pauli measurements and Pauli observables, there is no advantage expected from setting ``k>1``.

One of the main perks of classical shadows is being able to compute many different expectation values by classically post-processing the same measurements. This is helpful in general as it may help
save quantum circuit executions.

Args:
    H (qp.operation.Operator): Observable to compute the expectation value
    k (int): Number of equal parts to split the shadow's measurements to compute the median of means. ``k=1`` (default) corresponds to simply taking the mean over all measurements.

Returns:
    float: expectation value estimate.

**Example**

.. code-block:: python3

    dev = qp.device("default.qubit", wires=range(2))

    @qp.set_shots(shots=1000)
    @qp.qnode(dev)
    def qnode(x):
        qp.Hadamard(0)
        qp.CNOT((0,1))
        qp.RX(x, wires=0)
        return qp.classical_shadow(wires=range(2))

    bits, recipes = qnode(0)
    shadow = qp.ClassicalShadow(bits, recipes)

Compute Pauli string observables

>>> shadow.expval(qp.X(0) @ qp.X(1), k=1)
array(1.116)

or of a Hamiltonian using `the same` measurement results

>>> H = qp.Hamiltonian([1., 1.], [qp.Z(0) @ qp.Z(1), qp.X(0) @ qp.X(1)])
>>> shadow.expval(H, k=1)
array(1.9980000000000002)

### `entropy`

```python
def entropy(self, wires, snapshots=None, alpha=2, k=1, base=None)
```

Compute entropies from classical shadow measurements.

Compute general Renyi entropies of order :math:`\alpha` for a reduced density matrix :math:`\rho` in terms of

.. math:: S_\alpha(\rho) = \frac{1}{1-\alpha} \log\left(\text{tr}\left[\rho^\alpha \right] \right).

There are two interesting special cases: In the limit :math:`\alpha \rightarrow 1`, we find the von Neumann entropy

.. math:: S_{\alpha=1}(\rho) = -\text{tr}(\rho \log(\rho)).

In the case of :math:`\alpha = 2`, the Renyi entropy becomes the logarithm of the purity of the reduced state

.. math:: S_{\alpha=2}(\rho) = - \log\left(\text{tr}(\rho^2) \right).

Since density matrices reconstructed from classical shadows can have negative eigenvalues, we use the algorithm described in
`1106.5458 <https://arxiv.org/abs/1106.5458>`_ to project the estimator to the closest valid state.

.. warning::

    Entropies are non-linear functions of the quantum state. Accuracy bounds on entropies with classical shadows are not known exactly,
    but scale exponentially in the subsystem size. It is advisable to only compute entropies for small subsystems of a few qubits.
    Further, entropies as post-processed by this class method are currently not automatically differentiable.

Args:
    wires (Iterable[int]): The wires over which to compute the entropy of their reduced state. Note that the computation scales exponentially in the
        number of wires for the reduced state.
    snapshots (Iterable[int] or int): Only compute a subset of local snapshots. For ``snapshots=None`` (default), all local snapshots are taken.
        In case of an integer, a random subset of that size is taken. The subset can also be explicitly fixed by passing an Iterable with the corresponding indices.
    alpha (float): order of the Renyi-entropy. Defaults to ``alpha=2``, which corresponds to the purity of the reduced state.
        Another special case is ``alpha=1``, which corresponds to the von Neumann entropy.
    k (int): Allow to split the snapshots into ``k`` equal parts and estimate the snapshots in a median of means fashion. There is no known advantage to do this for entropies.
        Thus, ``k=1`` is default and advised.
    base (float): Base to the logarithm used for the entropies.

Returns:
    float: Entropy of the chosen subsystem.

**Example**

For the maximally entangled state of ``n`` qubits, the reduced state has two constant eigenvalues :math:`\frac{1}{2}`. For constant distributions, all Renyi entropies are
equivalent:

.. code-block:: python3

    wires = 4
    dev = qp.device("default.qubit", wires=range(wires))

    @qp.set_shots(shots=1000)
    @qp.qnode(dev)
    def max_entangled_circuit():
        qp.Hadamard(wires=0)
        for i in range(1, wires):
            qp.CNOT(wires=[0, i])
        return qp.classical_shadow(wires=range(wires))

    bits, recipes = max_entangled_circuit()
    shadow = qp.ClassicalShadow(bits, recipes)

    entropies = [shadow.entropy(wires=[0], alpha=alpha) for alpha in [1., 2., 3.]]

>>> print(np.isclose(entropies, entropies[0], atol=5e-2))
[ True  True  True]

For non-uniform reduced states that is not the case anymore and the entropy differs for each order ``alpha``:

.. code-block:: python3

    @qp.qnode(dev)
    def qnode(x):
        for i in range(wires):
            qp.RY(x[i], wires=i)

        for i in range(wires - 1):
            qp.CNOT((i, i + 1))

        return qp.classical_shadow(wires=range(wires))

    x = np.linspace(0.5, 1.5, num=wires)
    bitstrings, recipes = qnode(x)
    shadow = qp.ClassicalShadow(bitstrings, recipes)

>>> [shadow.entropy(wires=wires, alpha=alpha) for alpha in [1., 2., 3.]]
[1.5419292874423107, 1.1537924276625828, 0.9593638767763727]

## `median_of_means`

```python
def median_of_means(arr, num_batches, axis=0)
```

The median of means of the given array.

The array is split into the specified number of batches. The mean value
of each batch is taken, then the median of the mean values is returned.

Args:
    arr (tensor-like[float]): The 1-D array for which the median of means
        is determined
    num_batches (int): The number of batches to split the array into

Returns:
    float: The median of means

## `pauli_expval`

```python
def pauli_expval(bits, recipes, word)
```

The approximate expectation value of a Pauli word given the bits and recipes
from a classical shadow measurement.

The expectation value can be computed using

.. math::

    \alpha = \frac{1}{|T_{match}|}\sum_{T_{match}}\left(1 - 2\left(\sum b \text{  mod }2\right)\right)

where :math:`T_{match}` denotes the snapshots with recipes that match the Pauli word,
and the right-most sum is taken over all bits in the snapshot where the observable
in the Pauli word for that bit is not the identity.

Args:
    bits (tensor-like[int]): An array with shape ``(T, n)``, where ``T`` is the
        number of snapshots and ``n`` is the number of measured qubits. Each
        entry must be either ``0`` or ``1`` depending on the sample for the
        corresponding snapshot and qubit.
    recipes (tensor-like[int]): An array with shape ``(T, n)``. Each entry
        must be either ``0``, ``1``, or ``2`` depending on the selected Pauli
        measurement for the corresponding snapshot and qubit. ``0`` corresponds
        to PauliX, ``1`` to PauliY, and ``2`` to PauliZ.
    word (tensor-like[int]): An array with shape ``(n,)``. Each entry must be
        either ``0``, ``1``, ``2``, or ``-1`` depending on the Pauli observable
        on each qubit. For example, when ``n=3``, the observable ``Y(0) @ X(2)``
        corresponds to the word ``np.array([1 -1 0])``.

Returns:
    tensor-like[float]: An array with shape ``(T,)`` containing the value
    of the Pauli observable for each snapshot. The expectation can be
    found by averaging across the snapshots.
