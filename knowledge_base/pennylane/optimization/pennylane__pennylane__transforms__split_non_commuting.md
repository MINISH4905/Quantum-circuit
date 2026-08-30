---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/split_non_commuting.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/split_non_commuting.py
license: Apache-2.0
---

## Module `pennylane/transforms/split_non_commuting.py`

Contains the tape transform that splits a tape into tapes measuring commuting observables.

## `SingleTermMP`

```python
class SingleTermMP
```

A dataclass to represent a single-term observable in a list of measurement processes.

Args:
    indices (list[int]): indices of the single-term observable in the list of measurement processes
    coeffs (list[complex]): coefficients of the single-term observable in the list of measurement processes
    group_idx (int): index of the commuting group the single-term observable belongs to
    idx_in_group (int): index of the single-term observable in his own commuting group

## `null_postprocessing`

```python
def null_postprocessing(results)
```

A postprocessing function returned by a transform that only converts the batch of results
into a result for a single ``QuantumTape``.

## `shot_vector_support`

```python
def shot_vector_support(initial_postprocessing: PostprocessingFn) -> PostprocessingFn
```

Convert a postprocessing function to one with shot vector support.

## `split_non_commuting`

```python
def split_non_commuting(tape: QuantumScript, grouping_strategy: Literal['default', 'wires', 'qwc'] | None='default', shot_dist: ShotDistFunction | Literal['uniform', 'weighted', 'weighted_random'] | None=None, seed: np.random.Generator | int | None=None) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Splits a circuit into tapes measuring groups of commuting observables.

Args:
    tape (QNode or QuantumScript or Callable): The quantum circuit to be split.
    grouping_strategy (str): The strategy to use for computing disjoint groups of
        commuting observables, can be ``"default"``, ``"wires"``, ``"qwc"``,
        or ``None`` to disable grouping.
    shot_dist (str or Callable or None): The strategy to use for shot distribution
        over the disjoint groups of commuting observables. Values can be ``"uniform"``
        (evenly distributes the number of ``shots`` across all groups of commuting terms),
        ``"weighted"`` (distributes the number of ``shots`` according to weights proportional
        to the L1 norm of the coefficients in each group), ``"weighted_random"`` (same
        as ``"weighted"``, but the numbers of ``shots`` are sampled from a multinomial distribution)
        or a custom callable. ``None`` will disable any shot distribution strategy.
        See Usage Details for more information.
    seed (Generator or int or None): A seed-like parameter used only when the shot distribution
        strategy involves a non-deterministic sampling process (e.g. ``"weighted_random"``).

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumScript], function]:
    the transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

Raises:
    TypeError: if ``shot_dist`` is not a str or Callable or None.
    ValueError: if ``shot_dist`` is a str but not an available strategy.

.. note::
    This transform splits expectation values of sums into separate terms, and also distributes the terms into
    multiple executions if there are terms that do not commute with one another. For state-based simulators
    that are able to handle non-commuting measurements in a single execution, but don't natively support sums
    of observables, consider :func:`split_to_single_terms <pennylane.transforms.split_to_single_terms>` instead.

**Examples:**

This transform allows us to transform a QNode measuring multiple observables into multiple
circuit executions, each measuring a group of commuting observables.

.. code-block:: python

    dev = qp.device("default.qubit", wires=2)

    @qp.transforms.split_non_commuting
    @qp.qnode(dev)
    def circuit(x):
        qp.RY(x[0], wires=0)
        qp.RX(x[1], wires=1)
        return [
            qp.expval(qp.X(0)),
            qp.expval(qp.Y(1)),
            qp.expval(qp.Z(0) @ qp.Z(1)),
            qp.expval(qp.X(0) @ qp.Z(1) + 0.5 * qp.Y(1) + qp.Z(0)),
        ]

Instead of decorating the QNode, we can also create a new function that yields the same
result in the following way:

.. code-block:: python

    @qp.qnode(dev)
    def circuit(x):
        qp.RY(x[0], wires=0)
        qp.RX(x[1], wires=1)
        return [
            qp.expval(qp.X(0)),
            qp.expval(qp.Y(1)),
            qp.expval(qp.Z(0) @ qp.Z(1)),
            qp.expval(qp.X(0) @ qp.Z(1) + 0.5 * qp.Y(1) + qp.Z(0)),
        ]

    circuit = qp.transforms.split_non_commuting(circuit)

Internally, the QNode is split into multiple circuits when executed:

>>> print(qp.draw(circuit)([np.pi/4, np.pi/4]))
0: ──RY(0.79)─┤  <X> ╭<X@Z>
1: ──RX(0.79)─┤      ╰<X@Z>
<BLANKLINE>
0: ──RY(0.79)─┤
1: ──RX(0.79)─┤  <Y>
<BLANKLINE>
0: ──RY(0.79)─┤ ╭<Z@Z>  <Z>
1: ──RX(0.79)─┤ ╰<Z@Z>

Note that the observable ``Y(1)`` occurs twice in the original QNode, but only once in the
transformed circuits. When there are multiple expectation value measurements that rely on
the same observable, this observable is measured only once, and the result is copied to each
original measurement.

While internally multiple tapes are created, the end result has the same ordering as the user
provides in the return statement. Executing the above QNode returns the original ordering of
the expectation values.

>>> circuit([np.pi/4, np.pi/4])
[np.float64(0.707...), np.float64(-0.707...), np.float64(0.499...), np.float64(0.853...)]

There are two algorithms used to compute disjoint groups of commuting observables: ``"qwc"``
grouping uses :func:`~pennylane.pauli.group_observables` which computes groups of qubit-wise
commuting observables, producing the fewest number of circuit executions, but can be expensive
to compute for large multi-term Hamiltonians, while ``"wires"`` grouping simply ensures
that no circuit contains two measurements with overlapping wires, disregarding commutativity
between the observables being measured.

The ``grouping_strategy`` keyword argument can be used to specify the grouping strategy. By
default, qwc grouping is used whenever possible, except when the circuit contains multiple
measurements that includes an expectation value of a ``qp.Hamiltonian``, in which case wires
grouping is used in case the Hamiltonian is very large, to save on classical runtime. To force
qwc grouping in all cases, set ``grouping_strategy="qwc"``. Similarly, to force wires grouping,
set ``grouping_strategy="wires"``:

.. code-block:: python

    import functools

    @qp.transforms.split_non_commuting(grouping_strategy="wires")
    @qp.qnode(dev)
    def circuit(x):
        qp.RY(x[0], wires=0)
        qp.RX(x[1], wires=1)
        return [
            qp.expval(qp.X(0)),
            qp.expval(qp.Y(1)),
            qp.expval(qp.Z(0) @ qp.Z(1)),
            qp.expval(qp.X(0) @ qp.Z(1) + 0.5 * qp.Y(1) + qp.Z(0)),
        ]

In this case, four circuits are created as follows:

>>> print(qp.draw(circuit)([np.pi/4, np.pi/4]))
0: ──RY(0.79)─┤  <X>
1: ──RX(0.79)─┤  <Y>
<BLANKLINE>
0: ──RY(0.79)─┤ ╭<Z@Z>
1: ──RX(0.79)─┤ ╰<Z@Z>
<BLANKLINE>
0: ──RY(0.79)─┤ ╭<X@Z>
1: ──RX(0.79)─┤ ╰<X@Z>
<BLANKLINE>
0: ──RY(0.79)─┤  <Z>
1: ──RX(0.79)─┤

Alternatively, to disable grouping completely, set ``grouping_strategy=None``:

.. code-block:: python

    @qp.transforms.split_non_commuting(grouping_strategy=None)
    @qp.qnode(dev)
    def circuit(x):
        qp.RY(x[0], wires=0)
        qp.RX(x[1], wires=1)
        return [
            qp.expval(qp.X(0)),
            qp.expval(qp.Y(1)),
            qp.expval(qp.Z(0) @ qp.Z(1)),
            qp.expval(qp.X(0) @ qp.Z(1) + 0.5 * qp.Y(1) + qp.Z(0)),
        ]

In this case, each observable is measured in a separate circuit execution.

>>> print(qp.draw(circuit)([np.pi/4, np.pi/4]))
0: ──RY(0.79)─┤  <X>
1: ──RX(0.79)─┤
<BLANKLINE>
0: ──RY(0.79)─┤
1: ──RX(0.79)─┤  <Y>
<BLANKLINE>
0: ──RY(0.79)─┤ ╭<Z@Z>
1: ──RX(0.79)─┤ ╰<Z@Z>
<BLANKLINE>
0: ──RY(0.79)─┤ ╭<X@Z>
1: ──RX(0.79)─┤ ╰<X@Z>
<BLANKLINE>
0: ──RY(0.79)─┤  <Z>
1: ──RX(0.79)─┤

Note that there is an exception to the above rules: if the circuit only contains a single
expectation value measurement of a ``Hamiltonian`` or ``Sum`` with pre-computed grouping
indices, the grouping information will be used regardless of the requested ``grouping_strategy``

.. details::
    :title: Usage Details

    **Shot distribution**

    With finite-shot measurements, the default behaviour of ``split_non_commuting`` is to perform one
    execution with the total number of ``shots`` for each group of commuting terms. With the
    ``shot_dist`` argument, this behaviour can be changed. For example,
    ``shot_dist = "weighted"`` will partition the number of shots performed for
    each commuting group according to the L1 norm of each group's coefficients:

    .. code-block:: python

        import pennylane as qp
        from pennylane.transforms import split_non_commuting

        ham = qp.Hamiltonian(
            coeffs=[10, 0.1, 20, 100, 0.2],
            observables=[
                qp.X(0) @ qp.Y(1),
                qp.Z(0) @ qp.Z(2),
                qp.Y(1),
                qp.X(1) @ qp.X(2),
                qp.Z(0) @ qp.Z(1) @ qp.Z(2)
            ]
        )

        dev = qp.device("default.qubit")

        @split_non_commuting(shot_dist="weighted")
        @qp.qnode(dev, shots=10000)
        def circuit():
            return qp.expval(ham)

        with qp.Tracker(dev) as tracker:
            circuit()

    >>> print(tracker.history["shots"])
    [2303, 23, 7674]

    The ``shot_dist`` strategy can be also defined by a custom function. For example:

    .. code-block:: python

        import numpy as np

        def my_shot_dist(total_shots, coeffs_per_group, seed):
            max_per_group = [np.max(np.abs(coeffs)) for coeffs in coeffs_per_group]
            prob_shots = np.array(max_per_group) / np.sum(max_per_group)
            return np.round(total_shots * prob_shots)

        @split_non_commuting(shot_dist=my_shot_dist)
        @qp.qnode(dev, shots=10000)
        def circuit():
            return qp.expval(ham)

        with qp.Tracker(dev) as tracker:
            circuit()

    >>> print(tracker.history["shots"])
    [1664, 17, 8319]

    **Internal details**

    Internally, this function works with tapes. We can create a tape with multiple
    measurements of non-commuting observables:

    .. code-block:: python

        measurements = [
            qp.expval(qp.Z(0) @ qp.Z(1)),
            qp.expval(qp.X(0) @ qp.X(1)),
            qp.expval(qp.Z(0)),
            qp.expval(qp.X(0))
        ]
        tape = qp.tape.QuantumScript(measurements=measurements)
        tapes, processing_fn = qp.transforms.split_non_commuting(tape)

    Now ``tapes`` is a list of two tapes, each contains a group of commuting observables:

    >>> [t.measurements for t in tapes]
    [[expval(Z(0) @ Z(1)), expval(Z(0))], [expval(X(0) @ X(1)), expval(X(0))]]

    The processing function becomes important as the order of the inputs has been modified.

    >>> dev = qp.device("default.qubit", wires=2)
    >>> result_batch = [dev.execute(t) for t in tapes]
    >>> result_batch
    [(np.float64(1.0), np.float64(1.0)), (np.float64(0.0), np.float64(0.0))]

    The processing function can be used to reorganize the results:

    >>> processing_fn(result_batch)
    (np.float64(1.0), np.float64(0.0), np.float64(1.0), np.float64(0.0))

    Measurements that accept both observables and ``wires`` so that e.g. ``qp.counts``,
    ``qp.probs`` and ``qp.sample`` can also be used. When initialized using only ``wires``,
    these measurements are interpreted as measuring with respect to the observable
    ``qp.Z(wires[0])@qp.Z(wires[1])@...@qp.Z(wires[len(wires)-1])``

    .. code-block:: python

        measurements = [
            qp.expval(qp.X(0)),
            qp.probs(wires=[1]),
            qp.probs(wires=[0, 1])
        ]
        tape = qp.tape.QuantumScript(measurements=measurements)
        tapes, processing_fn = qp.transforms.split_non_commuting(tape)

    This results in two tapes, each with commuting measurements:

    >>> [t.measurements for t in tapes]
    [[expval(X(0)), probs(wires=[1])], [probs(wires=[0, 1])]]
