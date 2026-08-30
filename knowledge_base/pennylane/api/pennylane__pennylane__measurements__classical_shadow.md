---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/measurements/classical_shadow.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/measurements/classical_shadow.py
license: Apache-2.0
---

## Module `pennylane/measurements/classical_shadow.py`

This module contains the qp.classical_shadow measurement.

## `ClassicalShadowMP`

```python
class ClassicalShadowMP(MeasurementTransform)
```

Represents a classical shadow measurement process occurring at the end of a
quantum variational circuit.

Please refer to :func:`pennylane.classical_shadow` for detailed documentation.


Args:
    wires (.Wires): The wires the measurement process applies to.
    seed (Union[int, None]): The seed used to generate the random measurements
    id (str): custom label given to a measurement instance, can be useful for some applications
        where the instance has to be identified

### `hash`

```python
def hash(self)
```

int: returns an integer hash uniquely representing the measurement process

### `process`

```python
def process(self, tape, device)
```

Returns the measured bits and recipes in the classical shadow protocol.

The protocol is described in detail in the `classical shadows paper <https://arxiv.org/abs/2002.08953>`_.
This measurement process returns the randomized Pauli measurements (the ``recipes``)
that are performed for each qubit and snapshot as an integer:

- 0 for Pauli X,
- 1 for Pauli Y, and
- 2 for Pauli Z.

It also returns the measurement results (the ``bits``); 0 if the 1 eigenvalue
is sampled, and 1 if the -1 eigenvalue is sampled.

The device shots are used to specify the number of snapshots. If ``T`` is the number
of shots and ``n`` is the number of qubits, then both the measured bits and the
Pauli measurements have shape ``(T, n)``.

This implementation is device-agnostic and works by executing single-shot
quantum tapes containing randomized Pauli observables. Devices should override this
if they can offer cleaner or faster implementations.

.. seealso:: :func:`~pennylane.classical_shadow`

Args:
    tape (QuantumTape): the quantum tape to be processed
    device (pennylane.devices.LegacyDevice): the device used to process the quantum tape

Returns:
    tensor_like[int]: A tensor with shape ``(2, T, n)``, where the first row represents
    the measured bits and the second represents the recipes used.

### `process_state_with_shots`

```python
def process_state_with_shots(self, state: Sequence[complex], wire_order: Wires, shots: int, rng=None)
```

Process the given quantum state with the given number of shots

Args:
    state (Sequence[complex]): quantum state vector given as a rank-N tensor, where
        each dimension has size 2 and N is the number of wires.
    wire_order (Wires): wires determining the subspace that ``state`` acts on; a matrix of
        dimension :math:`2^n` acts on a subspace of :math:`n` wires
    shots (int): The number of shots
    rng (Union[None, int, array_like[int], SeedSequence, BitGenerator, Generator]): A
        seed-like parameter matching that of ``seed`` for ``numpy.random.default_rng``.
        If no value is provided, a default RNG will be used. The random measurement outcomes
        in the form of bits will be generated from this argument, while the random recipes will be
        created from the ``seed`` argument provided to ``.ClassicalShadowsMP``.

Returns:
    tensor_like[int]: A tensor with shape ``(2, T, n)``, where the first row represents
    the measured bits and the second represents the recipes used. ``T`` is the number of shots,
    and ``n`` is the number of qubits.

### `process_density_matrix_with_shots`

```python
def process_density_matrix_with_shots(self, state: Sequence[complex], wire_order: Wires, shots: int, rng=None)
```

Process the given quantum state (density matrix) with the given number of shots

Args:
    state (Sequence[complex]): quantum density matrix given as a rank-N tensor, where
        each dim has size 2 and N is twice the number of wires.
    wire_order (Wires): wires determining the subspace that ``state`` acts on; a matrix of
        dimension :math:`2^n` acts on a subspace of :math:`n` wires
    shots (int): The number of shots
    rng (Union[None, int, array_like[int], SeedSequence, BitGenerator, Generator]): A
        seed-like parameter matching that of ``seed`` for ``numpy.random.default_rng``.
        If no value is provided, a default RNG will be used. The random measurement outcomes
        in the form of bits will be generated from this argument, while the random recipes will be
        created from the ``seed`` argument provided to ``.ClassicalShadowsMP``.

Returns:
    tensor_like[int]: A tensor with shape ``(2, T, n)``, where the first row represents
    the measured bits and the second represents the recipes used.

## `ShadowExpvalMP`

```python
class ShadowExpvalMP(MeasurementTransform)
```

Measures the expectation value of an operator using the classical shadow measurement process.

Please refer to :func:`~pennylane.shadow_expval` for detailed documentation.

Args:
    H (Operator, Sequence[Operator]): Operator or list of Operators to compute the expectation value over.
    seed (Union[int, None]): The seed used to generate the random measurements
    k (int): Number of equal parts to split the shadow's measurements to compute the median of means.
        ``k=1`` corresponds to simply taking the mean over all measurements.
    id (str): custom label given to a measurement instance, can be useful for some applications
        where the instance has to be identified

### `process_state_with_shots`

```python
def process_state_with_shots(self, state: Sequence[complex], wire_order: Wires, shots: int, rng=None)
```

Process the given quantum state with the given number of shots

Args:
    state (Sequence[complex]): quantum state
    wire_order (Wires): wires determining the subspace that ``state`` acts on; a matrix of
        dimension :math:`2^n` acts on a subspace of :math:`n` wires
    shots (int): The number of shots
    rng (Union[None, int, array_like[int], SeedSequence, BitGenerator, Generator]): A
        seed-like parameter matching that of ``seed`` for ``numpy.random.default_rng``.
        If no value is provided, a default RNG will be used.

Returns:
    float: The estimate of the expectation value.

### `process_density_matrix_with_shots`

```python
def process_density_matrix_with_shots(self, state: Sequence[complex], wire_order: Wires, shots: int, rng=None)
```

Process the given quantum state with the given number of shots

Args:
    state (Sequence[complex]): quantum state
    wire_order (Wires): wires determining the subspace that ``state`` acts on; a matrix of
        dimension :math:`2^n` acts on a subspace of :math:`n` wires
    shots (int): The number of shots
    rng (Union[None, int, array_like[int], SeedSequence, BitGenerator, Generator]): A
        seed-like parameter matching that of ``seed`` for ``numpy.random.default_rng``.
        If no value is provided, a default RNG will be used.

Returns:
    float: The estimate of the expectation value.

### `wires`

```python
def wires(self)
```

The wires the measurement process acts on.

This is the union of all the Wires objects of the measurement.

### `queue`

```python
def queue(self, context=QueuingManager)
```

Append the measurement process to an annotated queue, making sure
the observable is not queued

## `shadow_expval`

```python
def shadow_expval(H: Operator | Sequence[Operator], k: int=1, seed: int | None=None) -> ShadowExpvalMP
```

Estimate expectation values using Classical Shadows with full differentiability support.

The Classical Shadows protocol provide a way to estimate a large number of expectation values
(even non-commuting ones) using a single set of random Pauli measurements.
See `arXiv:2002.08953 <https://arxiv.org/abs/2002.08953>`_ for the original proposal and theoretical details.

Args:
    H (Sequence[Operator] | Operator): Obserable(s) whose expectation values are to be estimated.
        Provide a single observable or a sequence to estimate the expectation values of multiple
        observables from the same classical shadows data.
    k (int): Number of equal parts for which to split the shadow's measurements in order to compute the median of means.
        The default is ``k=1``, which simply computes the mean of all measurements.
        ``k>1`` provides no expected advantage for Pauli measurements and Pauli observables.
    seed (int | None): Optional seed for the random Pauli measurement basis in the
        classical shadows protocol. This controls which bases (X, Y or Z) each qubit is measured
        in per shot. If ``None``, a random seed will be generated.

        .. note::

            The ``seed`` argument only controls the measurement basis choice.
            The ``seed`` of a simulator device separately controls the sampling outcomes.
            For fully reproducible results, you must seed both the device and the measurement.

            .. code-block:: python

                dev = qp.device("default.qubit", seed=42, shots=100)

                @qp.qnode(dev)
                def circuit():
                    qp.H(0)
                    return qp.shadow_expval(qp.Z(0), seed=99)

Returns:
    ShadowExpvalMP: Measurement process instance

.. seealso::

    This measurement internally relies on the measurement :func:`~.pennylane.classical_shadow` and the class
    :class:`~.pennylane.ClassicalShadow` for post-processing in order to compute expectation values.

**Example**

With the standard :func:`~.pennylane.expval` measurement, each group of non-commuting
observables requires its own separate circuit execution. However, with ``shadow_expval``
we can reuse the shadow data generated from the circuit executions to estimate all expectation values simultaneously.

Let's say we want to estimate the expectation values of all three (non-commuting) single qubit Paulis
(:class:`~.X`, :class:`~.Y`, :class:`~.Z`) on a :math:`| + \rangle` state.
Theoretically, we would expect that :math:`\langle X \rangle = 1`, :math:`\langle Y \rangle = \langle Z \rangle = 0`.

.. code-block:: python

    device = qp.device("default.qubit", seed=42)

    @qp.set_shots(1_000)
    @qp.qnode(device)
    def circuit():
        qp.H(0) # Create |+> state
        return qp.shadow_expval((qp.X(0), qp.Y(0), qp.Z(0)), seed=99)

>>> print(circuit())
[0.984 0.    0.03 ]

This is very close to their expected values!

.. details::
    :title: Differentiability

    Consider the following observable,

    >>> H = qp.Hamiltonian([1., 1.], [qp.Z(0) @ qp.Z(1), qp.X(0) @ qp.X(1)])

    We can estimate its expectation value with the classical shadows protocol:

    .. code-block:: python

        dev = qp.device("default.qubit", seed=42, wires=range(2))

        @qp.set_shots(shots=10_000)
        @qp.qnode(dev)
        def circuit(x, obs):
            qp.Hadamard(0)
            qp.CNOT((0,1))
            qp.RX(x, wires=0)
            return qp.shadow_expval(obs, seed=99)

        x = pnp.array(0.5, requires_grad=True)

    >>> print(circuit(x, H))
    1.8891
    >>> print(qp.grad(circuit)(x, H))
    -0.4653...

    In ``shadow_expval``, we can also pass a list of observables to estimate them
    all from the same shadow data.
    Note that each qnode execution internally performs one quantum measurement, so be sure
    to include all observables that you want to estimate from a single measurement in the same execution.

    >>> Hs = [H, qp.X(0), qp.Y(0), qp.Z(0)]
    >>> print(circuit(x, Hs))
    [ 1.8783  0.0096 -0.0174  0.0138]
    >>> print(qp.jacobian(circuit)(x, Hs))
    [-0.4851 -0.0063 -0.0099  0.0006]

## `classical_shadow`

```python
def classical_shadow(wires: WiresLike, seed=None) -> ClassicalShadowMP
```

The classical shadow measurement protocol.

The protocol is described in detail in the paper `Predicting Many Properties of a Quantum System from Very Few Measurements <https://arxiv.org/abs/2002.08953>`_.
This measurement process returns the randomized Pauli measurements (the ``recipes``)
that are performed for each qubit and snapshot as an integer:

- 0 for Pauli X,
- 1 for Pauli Y, and
- 2 for Pauli Z.

It also returns the measurement results (the ``bits``); 0 if the 1 eigenvalue
is sampled, and 1 if the -1 eigenvalue is sampled.

The device shots are used to specify the number of snapshots. If ``T`` is the number
of shots and ``n`` is the number of qubits, then both the measured bits and the
Pauli measurements have shape ``(T, n)``.

Args:
    wires (Sequence[int]): the wires to perform Pauli measurements on
    seed (Union[None, int]):  Seed used to randomly sample Pauli measurements during the
        classical shadows protocol. If None, a random seed will be generated. If a tape with
        a ``classical_shadow`` measurement is copied, the seed will also be copied.
        Different seeds are still generated for different constructed tapes.

Returns:
    ClassicalShadowMP: measurement process instance

**Example**

Consider the following QNode that prepares a Bell state and performs a classical
shadow measurement:

.. code-block:: python

    dev = qp.device("default.qubit", seed=42, wires=2)

    @qp.set_shots(shots=5)
    @qp.qnode(dev)
    def circuit():
        qp.Hadamard(wires=0)
        qp.CNOT(wires=[0, 1])
        return qp.classical_shadow(wires=[0, 1], seed=42)

Executing this QNode produces the sampled bits and the Pauli measurements used:

>>> bits, recipes = circuit()
>>> bits
array([[1, 1],
       [0, 0],
       [1, 1],
       [1, 0],
       [0, 0]], dtype=int8)
>>> recipes
array([[2, 0],
       [2, 2],
       [0, 0],
       [2, 1],
       [2, 2]], dtype=int8)

.. details::
    :title: Usage Details

    Consider again the QNode in the above example. Since the Pauli observables are
    randomly sampled, executing this QNode again would produce different bits and Pauli recipes:

    >>> bits, recipes = circuit()
    >>> bits
    array([[0, 0],
       [1, 1],
       [1, 1],
       [1, 1],
       [0, 0]], dtype=int8)
    >>> recipes
    array([[2, 0],
       [2, 2],
       [0, 0],
       [2, 1],
       [2, 2]], dtype=int8)

    To use the same Pauli recipes for different executions, the :class:`~.tape.QuantumTape`
    interface should be used instead:

    .. code-block:: python

        dev = qp.device("default.qubit", wires=2)

        ops = [qp.Hadamard(wires=0), qp.CNOT(wires=(0,1))]
        measurements = [qp.classical_shadow(wires=(0,1))]
        tape = qp.tape.QuantumTape(ops, measurements, shots=5)

    >>> bits1, recipes1 = qp.execute([tape], device=dev, diff_method=None)[0]
    >>> bits2, recipes2 = qp.execute([tape], device=dev, diff_method=None)[0]
    >>> print(np.all(recipes1 == recipes2))
    True
    >>> print(np.all(bits1 == bits2))
    False

    If using different Pauli recipes is desired for the :class:`~.tape.QuantumTape` interface,
    different seeds should be used for the classical shadow:

    .. code-block:: python

        dev = qp.device("default.qubit", wires=2)

        measurements1 = [qp.classical_shadow(wires=(0,1), seed=10)]
        tape1 = qp.tape.QuantumTape(ops, measurements1, shots=5)

        measurements2 = [qp.classical_shadow(wires=(0,1), seed=15)]
        tape2 = qp.tape.QuantumTape(ops, measurements2, shots=5)

    >>> bits1, recipes1 = qp.execute([tape1], device=dev, diff_method=None)[0]
    >>> bits2, recipes2 = qp.execute([tape2], device=dev, diff_method=None)[0]
    >>> print(np.all(recipes1 == recipes2))
    False
    >>> print(np.all(bits1 == bits2))
    False
