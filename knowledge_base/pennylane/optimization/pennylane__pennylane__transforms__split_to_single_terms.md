---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/split_to_single_terms.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/split_to_single_terms.py
license: Apache-2.0
---

## Module `pennylane/transforms/split_to_single_terms.py`

Contains the tape transform that splits multi-term measurements on a tape into single-term measurements,
all included on the same tape. This transform expands sums but does not divide non-commuting measurements
between different tapes.

## `null_postprocessing`

```python
def null_postprocessing(results)
```

A postprocessing function returned by a transform that only converts the batch of results
into a result for a single ``QuantumTape``.

## `split_to_single_terms`

```python
def split_to_single_terms(tape)
```

Splits any expectation values of multi-term observables in a circuit into single term
expectation values for devices that don't natively support measuring expectation values
of sums of observables.

Args:
    tape (QNode or QuantumScript or Callable): The quantum circuit to modify the measurements of.

Returns:
    qnode (QNode) or tuple[List[QuantumScript], function]: The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

.. note::
    This transform doesn't split non-commuting terms into multiple executions. It is suitable for state-based
    simulators that don't natively support sums of observables, but *can* handle non-commuting measurements.
    For hardware or hardware-like simulators based on projective measurements,
    :func:`split_non_commuting <pennylane.transforms.split_non_commuting>` should be used instead.

**Examples:**

This transform allows us to transform a QNode that measures multi-term observables into individual measurements,
each corresponding to a single term.

.. code-block:: python

    dev = qp.device("default.qubit", wires=2)

    @qp.transforms.split_to_single_terms
    @qp.qnode(dev)
    def circuit(x):
        qp.RY(x[0], wires=0)
        qp.RX(x[1], wires=1)
        return [qp.expval(qp.X(0) @ qp.Z(1) + 0.5 * qp.Y(1) + qp.Z(0)),
               qp.expval(qp.X(1) + qp.Y(1))]

Instead of decorating the QNode, we can also create a new function that yields the same
result in the following way:

.. code-block:: python

    @qp.qnode(dev)
    def circuit(x):
        qp.RY(x[0], wires=0)
        qp.RX(x[1], wires=1)
        return [qp.expval(qp.X(0) @ qp.Z(1) + 0.5 * qp.Y(1) + qp.Z(0)),
               qp.expval(qp.X(1) + qp.Y(1))]

    circuit = qp.transforms.split_to_single_terms(circuit)

Internally, the QNode measures the individual measurements

>>> print(qp.draw(circuit)([np.pi/4, np.pi/4]))
0: ──RY(0.79)─┤ ╭<X@Z>  <Z>
1: ──RX(0.79)─┤ ╰<X@Z>  <Y>  <X>

Note that the observable ``Y(1)`` occurs twice in the original QNode, but only once in the
transformed circuits. When there are multiple expectation value measurements that rely on
the same observable, the observable is measured only once, and the result is copied to each
original measurement.

While the execution is split into single terms internally, the final result has the same ordering
as the user provides in the return statement.

>>> circuit([np.pi/4, np.pi/4])
[np.float64(0.853...), np.float64(-0.707...)]

.. details::
    :title: Usage Details

    Internally, this function works with tapes. We can create a tape that returns
    expectation values of multi-term observables:

    .. code-block:: python

        measurements = [
            qp.expval(qp.Z(0) + qp.Z(1)),
            qp.expval(qp.X(0) + 0.2 * qp.X(1) + 2 * qp.Identity()),
            qp.expval(qp.X(1) + qp.Z(1)),
        ]
        tape = qp.tape.QuantumScript(measurements=measurements)
        tapes, processing_fn = qp.transforms.split_to_single_terms(tape)

    Now ``tapes`` is a tuple containing a single tape with the updated measurements,
    which are now the single-term observables that the original sum observables are
    composed of:

    >>> tapes[0].measurements
    [expval(Z(0)), expval(Z(1)), expval(X(0)), expval(X(1))]

    The processing function becomes important as the order of the inputs has been modified.
    Instead of evaluating the observables in the returned expectation values directly, the
    four single-term observables are measured, resulting in 4 return values for the execution:

    >>> dev = qp.device("default.qubit", wires=2)
    >>> results = dev.execute(tapes)
    >>> results
    ((np.float64(1.0), np.float64(1.0), np.float64(0.0), np.float64(0.0)),)

    The processing function can be used to reorganize the results to get the 3 expectation
    values returned by the circuit:

    >>> processing_fn(results)
    (np.float64(2.0), np.float64(2.0), np.float64(1.0))

.. details::
    :title: Usage with Catalyst (qjit)

    This transform is compatible with ``qjit`` with a few minor differences to be aware of.
    Currently, when combined with ``qjit``, this transform will not work with shot vectors
    and will not simplify any tensor products like ``X(0) @ Y(0)`` contained in measurements.

    We can apply the MLIR pass by simply decorating our ``QNode`` with ``@qp.qjit``:

    .. code-block:: python

        @qp.qjit
        @qp.transforms.split_to_single_terms
        @qp.qnode(qp.device("lightning.qubit", wires=2))
        def circ():
            return qp.expval(qp.X(0)+2*qp.Y(1))
