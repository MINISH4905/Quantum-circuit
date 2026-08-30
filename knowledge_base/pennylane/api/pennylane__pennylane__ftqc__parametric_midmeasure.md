---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ftqc/parametric_midmeasure.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ftqc/parametric_midmeasure.py
license: Apache-2.0
---

## Module `pennylane/ftqc/parametric_midmeasure.py`

This module contains the classes and functions for creating and diagonalizing
mid-circuit measurements with a parameterized measurement axis.

## `measure_arbitrary_basis`

```python
def measure_arbitrary_basis(wires: Hashable | Wires, angle: float, plane: str, reset: bool=False, postselect: int | None=None)
```

Perform a mid-circuit measurement in the basis defined by the plane and angle on the
supplied qubit.

The measurements are performed using the 0, 1 convention rather than the ±1 convention.

If a device doesn't support mid-circuit measurements natively, then the desired ``mcm_method`` for
executing mid-circuit measurements should be passed to the QNode.

.. warning::
    Measurements should be diagonalized before execution for any device that only natively supports
    mid-circuit measurements in the computational basis. To diagonalize, the :func:`diagonalize_mcms <pennylane.ftqc.diagonalize_mcms>`
    transform can be applied.

    Skipping diagonalization for a circuit containing parametric mid-circuit measurements may result
    in a completed execution with incorrect results.

Args:
    wires (Wires): The wire to measure.
    angle (float): The angle of rotation defining the axis, specified in radians.
    plane (str): The plane the measurement basis lies in. Options are "XY", "YZ" and "ZX"
    reset (Optional[bool]): Whether to reset the wire to the :math:`|0 \rangle`
        state after measurement.
    postselect (Optional[int]): Which basis state to postselect after a mid-circuit
        measurement. None by default. If postselection is requested, only the post-measurement
        state that is used for postselection will be considered in the remaining circuit.

Returns:
    MeasurementValue: The mid-circuit measurement result linked to the created ``MidMeasure``.

Raises:
    QuantumFunctionError: if multiple wires were specified

.. note::
    Reset behaviour will depend on the execution method for mid-circuit measurements,
    and may not work for all configurations.

**Example:**

.. code-block:: python

    from pennylane.ftqc import diagonalize_mcms, measure_arbitrary_basis

    dev = qp.device("default.qubit", wires=3)

    @diagonalize_mcms
    @qp.qnode(dev, mcm_method="tree-traversal")
    def func(x, y):
        qp.RY(x, wires=0)
        qp.CNOT(wires=[0, 1])
        m_0 = measure_arbitrary_basis(1, angle=np.pi/3, plane="XY")

        qp.cond(m_0, qp.RY)(y, wires=0)
        return qp.probs(wires=[0])

Executing this QNode:

>>> pars = np.array([0.643, 0.246])
>>> func(*pars)
array([0.91237915, 0.08762085])

.. details::
    :title: Plane and angle

    The plane and angle are related to the axis of measurement by the following formulas:

    .. math:: M_{XY}(\phi) =\frac{1}{\sqrt{2}} (|0\rangle + e^{i\phi} |1\rangle),

    .. math:: M_{YZ}(\theta) =\cos{\frac{\theta}{2}}|0\rangle + i \sin{\frac{\theta}{2}} |1\rangle,\text{ and}

    .. math:: M_{ZX}(\theta) = \cos{\frac{\theta}{2}}|0\rangle + \sin{\frac{\theta}{2}} |1\rangle

    where, in terms of `spherical coordinates <https://en.wikipedia.org/wiki/Spherical_coordinate_system>`_ in
    the physics convention, the angles :math:`\phi` and :math:`\theta` are the azimuthal and polar angles,
    respectively.

.. details::
    :title: Using mid-circuit measurements

    Measurement outcomes can be used to conditionally apply operations, and measurement
    statistics can be gathered and returned by a quantum function. Measurement outcomes can
    also be manipulated using arithmetic operators like ``+``, ``-``, ``*``, ``/``, etc. with
    other mid-circuit measurements or scalars.

    See the :func:`qp.measure <pennylane.measurements.measure>` function
    for details on the available arithmetic operators for mid-circuit measurement results.

    Mid-circuit measurement results can be processed with the usual measurement functions such as
    :func:`~.expval`. For QNodes with finite shots, :func:`~.sample` applied to a mid-circuit measurement
    result will return a binary sequence of samples.
    See :ref:`here <mid_circuit_measurements_statistics>` for more details.

## `measure_x`

```python
def measure_x(wires: Hashable | Wires, reset: bool=False, postselect: int | None=None)
```

Perform a mid-circuit measurement in the X basis. The measurements are performed using the 0, 1
convention rather than the ±1 convention.

For more details on the results of mid-circuit measurements and how to use them,
see :func:`qp.measure <pennylane.measure>`.

For more details on mid-circuit measurements in an arbitrary basis (besides the computational basis),
see :func:`measure_arbitrary_basis <pennylane.ftqc.measure_arbitrary_basis>`.

.. warning::
    Measurements should be diagonalized before execution for any device that only natively supports
    mid-circuit measurements in the computational basis. To diagonalize, the :func:`diagonalize_mcms <pennylane.ftqc.diagonalize_mcms>`
    transform can be applied.

    Skipping diagonalization for a circuit containing parametric mid-circuit measurements may result
    in a completed execution with incorrect results.

Args:
    wires (Wires): The wire to measure.
    reset (Optional[bool]): Whether to reset the wire to the :math:`|0 \rangle`
        state after measurement.
    postselect (Optional[int]): Which basis state to postselect after a mid-circuit
        measurement. None by default. If postselection is requested, only the post-measurement
        state that is used for postselection will be considered in the remaining circuit.

Returns:
    MeasurementValue: The mid-circuit measurement result linked to the created ``MidMeasure``.

Raises:
    QuantumFunctionError: if multiple wires were specified

## `measure_y`

```python
def measure_y(wires: Hashable | Wires, reset: bool=False, postselect: int | None=None)
```

Perform a mid-circuit measurement in the Y basis. The measurements are performed using the 0, 1
convention rather than the ±1 convention.

For more details on the results of mid-circuit measurements and how to use them,
see :func:`qp.measure <pennylane.measure>`.

For more details on mid-circuit measurements in an arbitrary basis (besides the computational basis),
see :func:`measure_arbitrary_basis <pennylane.ftqc.measure_arbitrary_basis>`.

.. warning::
    Measurements should be diagonalized before execution for any device that only natively supports
    mid-circuit measurements in the computational basis. To diagonalize, the :func:`diagonalize_mcms <pennylane.ftqc.diagonalize_mcms>`
    transform can be applied.

    Skipping diagonalization for a circuit containing parametric mid-circuit measurements may result
    in a completed execution with incorrect results.

Args:
    wires (Wires): The wire to measure.
    reset (Optional[bool]): Whether to reset the wire to the :math:`|0 \rangle`
        state after measurement.
    postselect (Optional[int]): Which basis state to postselect after a mid-circuit
        measurement. None by default. If postselection is requested, only the post-measurement
        state that is used for postselection will be considered in the remaining circuit.

Returns:
    MeasurementValue: The mid-circuit measurement result linked to the created ``MidMeasure``.

Raises:
    QuantumFunctionError: if multiple wires were specified

## `measure_z`

```python
def measure_z(wires: Hashable | Wires, reset: bool=False, postselect: int | None=None)
```

Perform a mid-circuit measurement in the Z basis. The measurements are performed using the 0, 1
convention rather than the ±1 convention.

.. note::
    This function dispatches to :func:`qp.measure <pennylane.measure>`

For more details on the results of mid-circuit measurements and how to use them,
see :func:`qp.measure <pennylane.measure>`.

Args:
    wires (Wires): The wire to measure.
    reset (Optional[bool]): Whether to reset the wire to the :math:`|0 \rangle`
        state after measurement.
    postselect (Optional[int]): Which basis state to postselect after a mid-circuit
        measurement. None by default. If postselection is requested, only the post-measurement
        state that is used for postselection will be considered in the remaining circuit.

Returns:
    MeasurementValue: The mid-circuit measurement result linked to the created ``MidMeasure``.

Raises:
    QuantumFunctionError: if multiple wires were specified

## `ParametricMidMeasure`

```python
class ParametricMidMeasure(MidMeasure)
```

Parametric mid-circuit measurement. The basis for the measurement is parametrized by
a plane ("XY", "YZ" or "ZX"), and an angle within the plane.

This class additionally stores information about unknown measurement outcomes in the qubit model.
Measurements on a single qubit are assumed.

.. warning::
    Measurements should be diagonalized before execution for any device that only natively supports
    mid-circuit measurements in the computational basis. To diagonalize, the :func:`diagonalize_mcms <pennylane.ftqc.diagonalize_mcms>`
    transform can be applied.

    Skipping diagonalization for a circuit containing parametric mid-circuit measurements may result
    in a completed execution with incorrect results.

Args:
    wires (.Wires): The wires the measurement process applies to.
        This can only be specified if an observable was not provided.

Keyword Args:
    angle (float): The angle in radians
    plane (str): The plane the measurement basis lies in. Options are "XY", "ZX" and "YZ"
    reset (bool): Whether to reset the wire after measurement.
    postselect (Optional[int]): Which basis state to postselect after a mid-circuit
        measurement. None by default. If postselection is requested, only the post-measurement
        state that is used for postselection will be considered in the remaining circuit.
    id (str): Custom label given to a measurement instance.

### `plane`

```python
def plane(self) -> str | None
```

The plane the measurement basis lies in. Options are "XY", "ZX" and "YZ

### `angle`

```python
def angle(self)
```

The angle in radians

### `hash`

```python
def hash(self)
```

int: Returns an integer hash uniquely representing the measurement process

### `__repr__`

```python
def __repr__(self)
```

Representation of this class.

### `diagonalizing_gates`

```python
def diagonalizing_gates(self)
```

Decompose to a diagonalizing gate and a standard MCM in the computational basis

### `label`

```python
def label(self, decimals: int=None, base_label: Iterable[str]=None, cache: dict=None)
```

How the mid-circuit measurement is represented in diagrams and drawings.

Args:
    decimals: If ``None``, no parameters are included. Else,
        how to round the parameters. Defaults to None.
    base_label: overwrite the non-parameter component of the label.
        Required to match general call signature. Not used.
    cache: dictionary that carries information between label calls in the
        same drawing. Required to match general call signature. Not used.

Returns:
    str: label to use in drawings

## `XMidMeasure`

```python
class XMidMeasure(ParametricMidMeasure)
```

A subclass of ParametricMidMeasure that uses the X measurement basis
(angle=0, plane="XY"). For labels and visualizations, this will be represented
as a X measurement. It is otherwise identical to the parent class.

### `__repr__`

```python
def __repr__(self)
```

Representation of this class.

### `label`

```python
def label(self, decimals: int=None, base_label: Iterable[str]=None, cache: dict=None)
```

How the mid-circuit measurement is represented in diagrams and drawings.

Args:
    decimals: If ``None``, no parameters are included. Else, how to round
        the parameters. Required to match general call signature. Not used.
    base_label: overwrite the non-parameter component of the label.
        Required to match general call signature. Not used.
    cache: dictionary that carries information between label calls in the
        same drawing. Required to match general call signature. Not used.

Returns:
    str: label to use in drawings

### `diagonalizing_gates`

```python
def diagonalizing_gates(self)
```

Decompose to a diagonalizing gate and a standard MCM in the computational basis

## `YMidMeasure`

```python
class YMidMeasure(ParametricMidMeasure)
```

A subclass of ParametricMidMeasure that uses the Y measurement basis
(angle=pi/2, plane="XY"). For labels and visualizations, this will be represented
as a Y measurement. It is otherwise identical to the parent class.

### `__repr__`

```python
def __repr__(self)
```

Representation of this class.

### `label`

```python
def label(self, decimals: int=None, base_label: str=None, cache: dict=None)
```

How the mid-circuit measurement is represented in diagrams and drawings.

Args:
    decimals: If ``None``, no parameters are included. Else, how to round
        the parameters. Required to match general call signature. Not used.
    base_label: overwrite the non-parameter component of the label.
        Required to match general call signature. Not used.
    cache: dictionary that carries information between label calls in the
        same drawing. Required to match general call signature. Not used.

Returns:
    str: label to use in drawings

### `diagonalizing_gates`

```python
def diagonalizing_gates(self)
```

Decompose to a diagonalizing gate and a standard MCM in the computational basis

## `null_postprocessing`

```python
def null_postprocessing(results)
```

A postprocessing function returned by a transform that only converts the batch of results
into a result for a single ``QuantumTape``.

## `diagonalize_mcms`

```python
def diagonalize_mcms(tape)
```

Diagonalize any mid-circuit measurements in a parameterized basis into the computational basis.

Args:
    tape (QNode or QuantumScript or Callable): The quantum circuit to modify the mid-circuit measurements of.

Returns:
    qnode (QNode) or tuple[List[QuantumScript], function]: The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

**Examples:**

This transform allows us to transform mid-circuit measurements into the measurement basis by adding
the relevant diagonalizing gates to the tape just before the measurement is performed.

.. code-block:: python

    from pennylane.ftqc import ParametricMidMeasure, diagonalize_mcms

    dev = qp.device("default.qubit")

    @diagonalize_mcms
    @qp.set_shots(shots=1000)
    @qp.qnode(dev, mcm_method="one-shot")
    def circuit(x):
        qp.RX(x, wires=0)
        m = measure_y(0)
        qp.cond(m, qp.X)(1)
        return qp.expval(qp.Z(1))

Applying the transform inserts the relevant gates before the measurement to allow
measurements to be in the Z basis, so the original circuit

>>> print(qp.draw(circuit, level=0)(np.pi/4))
0: ──RX(0.79)──┤↗ʸ├────┤
1: ─────────────║────X─┤  <Z>
                ╚════╝

becomes

>>> print(qp.draw(circuit)(np.pi/4))
0: ──RX(0.79)──S†──H──┤↗├────┤
1: ────────────────────║───X─┤  <Z>
                       ╚═══╝


.. details::
    :title: Conditional measurements

    The transform can also handle diagonalization of conditional measurements created by
    :func:`qp.ftqc.cond_measure <pennylane.ftqc.cond_measure>`. This is done by replacing the
    measurements for the true and false condition with conditional diagonalizing gates,
    and a single measurement in the computational basis:

    .. code-block:: python

        from pennylane.ftqc import cond_measure, diagonalize_mcms, measure_x

        dev = qp.device("default.qubit")

        @diagonalize_mcms
        @qp.qnode(dev)
        def circuit(x):
            qp.RY(x[0], wires=0)
            qp.RX(x[1], wires=1)
            m = qp.measure(0)
            m2 = cond_measure(m, measure_x, measure_y)(1)
            qp.cond(m2, qp.X)(1)
            return qp.expval(qp.Z(1))

    The :func:`cond_measure <pennylane.ftqc.cond_measure>` function adds a conditional X-basis
    measurement and a conditional Y basis measurement to the circuit, with opposite conditions.
    When the transform is applied, the diagonalizing gates of the measurements are conditional.
    The two conditional measurements then become equivalent measurements in the computational basis
    with opposite conditions, and can be simplified to a single, unconditional measurement in the
    computational basis.

    This circuit thus diagonalizes to:

    >>> print(qp.draw(circuit)([np.pi, np.pi/4]))
    0: ──RY(3.14)──┤↗├───────────────────┤
    1: ──RX(0.79)───║───H──S†──H──┤↗├──X─┤  <Z>
                    ╚═══╩══╩═══╝   ╚═══╝

    where the initial Hadamard gate on wire 1 has the same condition as the original X-basis
    measurement, and the adjoint S gate and second Hadamard share a condition with the Y-basis
    measurement.
