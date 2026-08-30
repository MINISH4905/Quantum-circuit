---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/mid_measure/pauli_measure.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/mid_measure/pauli_measure.py
license: Apache-2.0
---

## Module `pennylane/ops/mid_measure/pauli_measure.py`

Implements the pauli measurement.

## `PauliMeasure`

```python
class PauliMeasure(Operator)
```

A Pauli product measurement.

### `meas_uid`

```python
def meas_uid(self) -> str | None
```

The custom ID associated with the measurement instance.

### `pauli_word`

```python
def pauli_word(self) -> str
```

The Pauli word for the measurement.

### `postselect`

```python
def postselect(self) -> int | None
```

Which outcome to postselect after the measurement.

### `label`

```python
def label(self, decimals=None, base_label=None, cache=None, wire=None) -> str
```

How the pauli-product measurement is represented in diagrams and drawings.

### `hash`

```python
def hash(self) -> int
```

int: An integer hash uniquely representing the measurement.

## `pauli_measure`

```python
def pauli_measure(pauli_word: str, wires: WiresLike, postselect: int | None=None)
```

Perform a Pauli product measurement.

A Pauli product measurement (PPM) is the measurement of a tensor product of Pauli observables (``X``, ``Y``, ``Z``, and ``I``).

The eigenvalue of this tensor product is one of 1 or -1, which is mapped to the 0 or 1 outcome of
the PPM, respectively. After the measurement, the state collapses to the superpositions of all
degenerate eigenstates corresponding to the measured eigenvalue.

.. note::

    Circuits comprising ``pauli_measure`` are currently not executable on any backend.
    This function is only for analysis using the ``null.qubit`` device and potential future execution when a suitable backend is
    available.

.. seealso::
    For more information on Pauli product measurements, check out the `Quantum Compilation hub <https://pennylane.ai/compilation/pauli-based-computation>`_ and
    :func:`catalyst.passes.ppm_compilation` for compiling these circuits with Catalyst.

Args:
    pauli_word (str): The Pauli word to measure.
    wires (Wires): The wires that the Pauli word acts on.
    postselect (Optional[int]): The postselection value, one of ``0`` or ``1``. It determines which subspace of
        degenerate eigenstates to postselect after a Pauli product measurement. ``None`` by default.

Returns:
    MeasurementValue: A reference to the future result of the Pauli product measurement

Raises:
    ValueError: if the Pauli word has characters other than X, Y and Z.
    ValueError: if the number of wires does not match the length of the Pauli word.

**Example:**

The following example illustrates how to include a Pauli product measurement (PPM) in a circuit by specifiying
the Pauli word and the wires it acts on.

.. code-block:: python

    @qp.qnode(qp.device("null.qubit", wires=3))
    def circuit():
        qp.Hadamard(0)
        qp.Hadamard(2)

        ppm = qp.pauli_measure(pauli_word="XY", wires=[0, 2])
        qp.cond(ppm, qp.X)(wires=1)

        return qp.expval(qp.Z(0))

The ``X`` operation on wire ``1`` will be applied conditionally on the value of the PPM outcome:

>>> print(qp.draw(circuit)())
0: ──H─╭┤↗X├────┤  <Z>
1: ────│──────X─┤
2: ──H─╰┤↗Y├──║─┤
         ╚════╝

Additionally, the number of PPM operations in a circuit can be easily inspected with :func:`~.specs`
where they are denoted as a :class:`~.ops.mid_measure.pauli_measure.PauliMeasure` gate type:

>>> print(qp.specs(circuit)()['resources'])
Wire allocations: 3
Total gates: 4
Gate counts:
- Hadamard: 2
- PauliMeasure: 1
- Conditional(PauliX): 1
Measurements:
- expval(PauliZ): 1
Depth: 3
