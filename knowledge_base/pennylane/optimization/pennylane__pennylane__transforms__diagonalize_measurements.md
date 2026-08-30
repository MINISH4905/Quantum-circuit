---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/diagonalize_measurements.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/diagonalize_measurements.py
license: Apache-2.0
---

## Module `pennylane/transforms/diagonalize_measurements.py`

Transform to diagonalize measurements on a tape, assuming all measurements are commuting.

## `null_postprocessing`

```python
def null_postprocessing(results)
```

A postprocessing function returned by a transform that only converts the batch of results
into a result for a single ``QuantumTape``.

## `diagonalize_measurements`

```python
def diagonalize_measurements(tape, supported_base_obs=_default_supported_obs, to_eigvals=False)
```

Diagonalize a set of measurements into the standard basis. Raises an error if the
measurements do not commute.

See the usage details for more information on which measurements are supported.

Args:
    tape (QNode or QuantumScript or Callable): The quantum circuit to modify the measurements of.
    supported_base_obs (Optional, Iterable(Operator)): A list of supported base observable classes.
        Allowed observables are ``qp.X``, ``qp.Y``, ``qp.Z``, ``qp.Hadamard`` and ``qp.Identity``.
        Z and Identity are always treated as supported, regardless of input. If no list is provided,
        the transform will diagonalize everything into the Z basis. If a list is provided, only
        unsupported observables will be diagonalized to the Z basis.

Returns:
    qnode (QNode) or tuple[List[QuantumScript], function]: The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

.. note::
    An error will be raised if non-commuting terms are encountered. To avoid non-commuting
    terms in circuit measurements, the :func:`split_non_commuting <pennylane.transforms.split_non_commuting>`
    transform can be applied.

    This transform will diagonalize what it can, i.e., ``qp.X``, ``qp.Y``, ``qp.Z``,
    ``qp.Hadamard``, ``qp.Identity``, or a linear combination of them. Any unrecognized
    observable will not raise an error, deferring to the device's validation for supported
    measurements later on. Lastly, if ``diagonalize_measurements`` produces additional gates
    that the device does not support, the :func:`~pennylane.devices.preprocess.decompose`
    transform should be applied to ensure that the additional gates are decomposed to those
    that the device supports.

**Examples:**

This transform allows us to transform QNode measurements into the measurement basis by adding
the relevant diagonalizing gates to the end of the tape operations.

.. code-block:: python

    from pennylane.transforms import diagonalize_measurements

    dev = qp.device("default.qubit")

    @diagonalize_measurements
    @qp.qnode(dev)
    def circuit(x):
        qp.RY(x[0], wires=0)
        qp.RX(x[1], wires=1)
        return qp.expval(qp.X(0) @ qp.Z(1)), qp.var(0.5 * qp.Y(2) + qp.X(0))

Applying the transform appends the relevant gates to the end of the circuit to allow
measurements to be in the Z basis, so the original circuit

>>> print(qp.draw(circuit, level=0)([np.pi/4, np.pi/4]))
0: ──RY(0.79)─┤ ╭<X@Z> ╭Var[𝓗(0.50)]
1: ──RX(0.79)─┤ ╰<X@Z> │
2: ───────────┤        ╰Var[𝓗(0.50)]

becomes

>>> print(qp.draw(circuit)([np.pi/4, np.pi/4]))
0: ──RY(0.79)──H────┤ ╭<Z@Z> ╭Var[𝓗(0.50)]
1: ──RX(0.79)───────┤ ╰<Z@Z> │
2: ──Z─────────S──H─┤        ╰Var[𝓗(0.50)]

>>> circuit([np.pi/4, np.pi/4])
(np.float64(0.5), np.float64(0.749...))

.. details::
    :title: Usage Details

    The transform diagonalizes observables from the local Pauli basis only, i.e. it diagonalizes
    X, Y, Z, and Hadamard. Any other observable will be unaffected:

    .. code-block:: python

        measurements = [
            qp.expval(qp.X(0) + qp.Hermitian([[1, 0], [0, 1]], wires=[1]))
        ]
        tape = qp.tape.QuantumScript(measurements=measurements)
        tapes, processsing_fn = diagonalize_measurements(tape)

    >>> tapes[0].operations
    [H(0)]
    >>> tapes[0].measurements
    [expval(Z(0) + Hermitian(array([[1, 0], [0, 1]]), wires=[1]))]

    The transform can also diagonalize only a subset of these operators. By default, the only
    supported base observable is Z. What if a backend device can handle
    X, Y and Z, but doesn't provide support for Hadamard? We can set this by passing
    ``supported_base_obs`` to the transform. Let's create a tape with some measurements:

    .. code-block:: python

        measurements = [
            qp.expval(qp.X(0) + qp.Hadamard(1)),
            qp.expval(qp.X(0) + 0.2 * qp.Hadamard(1)),
            qp.var(qp.Y(2) + qp.X(0)),
        ]
        tape = qp.tape.QuantumScript(measurements=measurements)
        tapes, processing_fn = diagonalize_measurements(
            tape,
            supported_base_obs=[qp.X, qp.Y, qp.Z]
        )

    Now ``tapes`` is a tuple containing a single tape with the updated measurements,
    where only the Hadamard gate has been diagonalized:

    >>> tapes[0].measurements
    [expval(X(0) + Z(1)), expval(X(0) + 0.2 * Z(1)), var(Y(2) + X(0))]
