---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/default_clifford.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/default_clifford.py
license: Apache-2.0
---

## Module `pennylane/devices/default_clifford.py`

This module contains the Clifford simulator using ``stim``.

## `operation_stopping_condition`

```python
def operation_stopping_condition(op: Operator) -> bool
```

Specifies whether an operation is accepted by ``DefaultClifford``.

## `observable_stopping_condition`

```python
def observable_stopping_condition(obs: Operator) -> bool
```

Specifies whether an observable is accepted by ``DefaultClifford``.

## `DefaultClifford`

```python
class DefaultClifford(Device)
```

A PennyLane device for fast simulation of Clifford circuits using
`stim <https://github.com/quantumlib/stim/>`_.

Args:
    wires (int, Iterable[Number, str]): Number of wires present on the device, or iterable that
        contains unique labels for the wires as numbers (i.e., ``[-1, 0, 2]``) or strings
        (``['aux_wire', 'q1', 'q2']``). Default ``None`` if not specified.
    shots (int, Sequence[int], Sequence[Union[int, Sequence[int]]]): The default number of shots to use in executions involving
        this device.
    check_clifford (bool): Check if all the gate operations in the circuits to be executed are Clifford. Default is ``True``.
    tableau (bool): Determines what should be returned when the device's state is computed with :func:`qp.state <pennylane.state>`.
        When ``True``, the device returns the final evolved Tableau. Alternatively, one may make it ``False`` to obtain
        the evolved state vector. Note that the latter might not be computationally feasible for larger qubit numbers.
    seed (Union[str, None, int, array_like[int], SeedSequence, BitGenerator, Generator]): A
        seed-like parameter matching that of ``seed`` for ``numpy.random.default_rng``, or
        a request to seed from numpy's global random number generator.
        The default, ``seed="global"`` pulls a seed from numpy's global generator. ``seed=None``
        will pull a seed from the OS entropy.
    max_workers (int): A ``ProcessPoolExecutor`` executes tapes asynchronously
        using a pool of at most ``max_workers`` processes. If ``max_workers`` is ``None``,
        only the current process executes tapes. If you experience any
        issue, try setting ``max_workers`` to ``None``.

**Example:**

.. code-block:: python

    import pennylane as qp

    dev = qp.device("default.clifford", tableau=True)

    @qp.qnode(dev)
    def circuit():
        qp.CNOT(wires=[0, 1])
        qp.X(1)
        qp.ISWAP(wires=[0, 1])
        qp.Hadamard(wires=[0])
        return qp.state()

>>> circuit()
array([[0, 1, 1, 0, 0],
        [1, 0, 1, 1, 1],
        [0, 0, 0, 1, 0],
        [1, 0, 0, 1, 1]])

The devices execution pipeline can be investigated more closely with the following:

.. code-block:: python

    num_qscripts = 5

    qscripts = [
        qp.tape.QuantumScript(
            [qp.Hadamard(wires=[0]), qp.CNOT(wires=[0, 1])],
            [qp.expval(qp.Z(0))]
        )
    ] * num_qscripts

>>> dev = DefaultClifford()
>>> program, execution_config = dev.preprocess()
>>> new_batch, post_processing_fn = program(qscripts)
>>> results = dev.execute(new_batch, execution_config=execution_config)
>>> post_processing_fn(results)
(np.float64(0.0), np.float64(0.0), np.float64(0.0), np.float64(0.0), np.float64(0.0))

.. details::
    :title: Clifford Tableau
    :href: clifford-tableau-theory

    The device's internal state is represented by the following ``Tableau`` described in
    the `Sec. III, Aaronson & Gottesman (2004) <https://arxiv.org/abs/quant-ph/0406196>`_:

    .. math::

        \begin{bmatrix}
        x_{11} & \cdots & x_{1n} &        & z_{11} & \cdots & z_{1n} & &r_{1}\\
        \vdots & \ddots & \vdots & & \vdots & \ddots & \vdots & &\vdots\\
        x_{n1} & \cdots & x_{nn} &        & z_{n1} & \cdots & z_{nn} & &r_{n}\\
        & & & & & & & & \\
        x_{\left(  n+1\right)  1} & \cdots & x_{\left(  n+1\right)  n} & &
        z_{\left(  n+1\right)  1} & \cdots & z_{\left(  n+1\right)  n} & & r_{n+1}\\
        \vdots & \ddots & \vdots  & & \vdots & \ddots & \vdots & & \vdots\\
        x_{\left(  2n\right)  1}  & \cdots & x_{\left(  2n\right)  n} & &
        z_{\left(  2n\right)  1}  & \cdots & z_{\left(  2n\right)  n} & & r_{2n}
        \end{bmatrix}

    The tableau's first `n` rows represent a destabilizer generator, while the
    remaining `n` rows represent the stabilizer generators. The Pauli representation
    for all of these generators are described using the :mod:`binary vector <pennylane.pauli.binary_to_pauli>`
    made from the binary variables :math:`x_{ij},\ z_{ij}`,
    :math:`\forall i\in\left\{1,\ldots,2n\right\}, j\in\left\{1,\ldots,n\right\}`
    and they together form the complete Pauli group.

    Finally, the last column of the tableau, with binary variables
    :math:`r_{i},\ \forall i\in\left\{1,\ldots,2n\right\}`,
    denotes whether the phase is negative (:math:`r_i = 1`) or not, for each generator.
    Maintaining and working with this tableau representation instead of the complete state vector
    makes the calculations of increasingly large Clifford circuits more efficient on this device.

.. details::
    :title: Probabilities for Basis States
    :href: clifford-probabilities

    As the ``default.clifford`` device supports executing quantum circuits with a large number of qubits,
    the ability to compute the ``analytical`` probabilities for ``all`` computational basis states at
    once becomes computationally expensive and challenging as the system size increases. While we don't
    manually restrict users from doing so for any circuit, one can expect the underlying computation
    to reach its limit with ``20-24`` qubits on a typical consumer grade machine.

    As long as number of qubits are below this limit, one can simply use the :func:`qp.probs <pennylane.probs>`
    function with its usual arguments to compute probabilities for the complete computational basis states.
    We test this for a circuit that prepares the ``n``-qubit Greenberger-Horne-Zeilinger (GHZ) state.
    This means that the probabilities for the basis states :math:`|0\rangle^{\otimes n}` and
    :math:`|1\rangle^{\otimes n}` should be :math:`0.5`, and :math:`0.0` for the rest.

    .. code-block:: python

        dev = qp.device("default.clifford")

        num_wires = 3

        @qp.qnode(dev)
        def circuit():
            qp.Hadamard(wires=[0])
            for idx in range(num_wires):
                qp.CNOT(wires=[idx, idx+1])
            return qp.probs()

    >>> circuit()
    array([0.5, 0. , 0. , 0. , 0. , 0. , 0. , 0. , 0. , 0. , 0. , 0. , 0. , 0. , 0. , 0.5])

    Once above the limit (or even otherwise), one can obtain the probability
    of a single target basis state by computing the expectation value of the
    corresponding projector using :mod:`qp.expval <pennylane.expval>` and
    :mod:`qp.Projector <pennylane.Projector>`.

    .. code-block:: python

        num_wires = 4

        @qp.qnode(dev)
        def circuit(state):
            qp.Hadamard(wires=[0])
            for idx in range(num_wires):
                qp.CNOT(wires=[idx, idx+1])
            return qp.expval(qp.Projector(state, wires=range(num_wires)))

    >>> basis_states = np.array([[0, 0, 0, 0], [0, 1, 0, 1], [1, 0, 1, 0]])
    >>> circuit(basis_states[0])
    array(0.5)
    >>> circuit(basis_states[1])
    array(0.)
    >>> circuit(basis_states[2])
    array(0.)

.. details::
    :title: Error Channels
    :href: clifford-errors

    This device supports the finite-shot execution of quantum circuits with
    the following error channels that add Pauli noise, allowing for one to perform
    any sampling-based measurements.

    - *Multi-qubit Pauli errors:* :mod:`qp.PauliError <pennylane.PauliError>`
    - *Single-qubit depolarization errors:* :mod:`qp.DepolarizingChannel <pennylane.DepolarizingChannel>`
    - *Single-qubit flip errors:* :mod:`qp.BitFlip <pennylane.BitFlip>` and :mod:`qp.PhaseFlip <pennylane.PhaseFlip>`

    .. code-block:: python

        import pennylane as qp
        import numpy as np

        dev = qp.device("default.clifford", seed=42)

        num_wires = 3

        @qp.set_shots(shots=1024)
        @qp.qnode(dev)
        def circuit():
            qp.Hadamard(wires=[0])
            for idx in range(num_wires):
                qp.CNOT(wires=[idx, idx+1])
            qp.BitFlip(0.2, wires=[1])
            return qp.counts()

    >>> circuit()
    {np.str_('0000'): np.int64(388), np.str_('0100'): np.int64(120), np.str_('1011'): np.int64(119), np.str_('1111'): np.int64(397)}

.. details::
    :title: Tracking
    :href: clifford-tracking

    ``DefaultClifford`` tracks:

    * ``executions``: the number of unique circuits that would be required on quantum hardware
    * ``shots``: the number of shots
    * ``resources``: the :class:`~.resource.Resources` for the executed circuit.
    * ``simulations``: the number of simulations performed. One simulation can cover multiple QPU executions,
      such as for non-commuting measurements and batched parameters.
    * ``batches``: The number of times :meth:`~.execute` is called.
    * ``results``: The results of each call of :meth:`~.execute`.

.. details::
    :title: Accelerate calculations with multiprocessing
    :href: clifford-multiprocessing

    See the details in :class:`~pennylane.devices.DefaultQubit`'s "Accelerate calculations with multiprocessing"
    section. Additional information regarding multiprocessing can be found in the
    `multiprocessing docs page <https://docs.python.org/3/library/multiprocessing.html#contexts-and-start-methods>`_.

### `name`

```python
def name(self)
```

The name of the device.

### `preprocess`

```python
def preprocess(self, execution_config: ExecutionConfig | None=None) -> tuple[CompilePipeline, ExecutionConfig]
```

This function defines the device compile pileline to be applied and an updated device configuration.

Args:
    execution_config (Union[ExecutionConfig, Sequence[ExecutionConfig]]): A data structure describing the
        parameters needed to fully describe the execution.

Returns:
    CompilePipeline, ExecutionConfig: A compile pileline that when called returns QuantumTapes that the device
    can natively execute as well as a postprocessing function to be called after execution, and a configuration with
    unset specifications filled in.

This device currently does not intrinsically support parameter broadcasting.

### `simulate`

```python
def simulate(self, circuit: QuantumScript, seed=None, debugger=None) -> Result
```

Simulate a single quantum script.

Args:
    circuit (QuantumTape): The single circuit to simulate
    debugger (_Debugger): The debugger to use

Returns:
    tuple(TensorLike): The results of the simulation

This function assumes that all operations are Clifford.

>>> qs = qp.tape.QuantumScript([qp.Hadamard(wires=0)], [qp.expval(qp.Z(0)), qp.state()])
>>> qp.devices.DefaultClifford().simulate(qs)
(np.float64(0.0), array([[0, 1, 0], [1, 0, 0]]))

### `measure_statistical`

```python
def measure_statistical(self, circuit, stim_circuit, seed=None)
```

Given a circuit, compute samples and return the statistical measurement results.

### `measure_analytical`

```python
def measure_analytical(self, circuit, stim_circuit, tableau_simulator, global_phase)
```

Given a circuit, compute tableau and return the analytical measurement results.
