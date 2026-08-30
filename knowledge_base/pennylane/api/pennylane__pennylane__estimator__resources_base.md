---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/resources_base.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/resources_base.py
license: Apache-2.0
---

## Module `pennylane/estimator/resources_base.py`

Base class for storing resources.

## `Resources`

```python
class Resources
```

Stores the estimated resource requirements of a quantum circuit.

The :func:`~pennylane.estimator.estimate` function returns an object of this class. It contains
estimates of all resource types tracked by the resource estimation pipeline, including the
number of gates and the number of wires.

Args:
    zeroed_wires (int): Number of allocated wires returned in the zeroed state.
    any_state_wires (int): Number of allocated wires returned in an unknowned state.
    algo_wires (int): Number of algorithmic wires, default value is ``0``.
    gate_types (dict): A dictionary mapping operations (:class:`~.pennylane.estimator.ResourceOperator`) to
        their number of occurences in the decomposed circuit.

**Example**

.. code-block:: python

    import pennylane.estimator as qre

    def circuit():
        qre.Hadamard()
        qre.CNOT()
        qre.RX(precision=1e-8)
        qre.RX(precision=1e-6)
        qre.AliasSampling(num_coeffs=3)

>>> res = qre.estimate(circuit, gate_set={"RX", "Toffoli", "T", "CNOT", "Hadamard"})()
>>> print(res)
--- Resources: ---
 Total wires: 123
   algorithmic wires: 2
   allocated wires: 121
     zero state: 58
     any state: 63
 Total gates : 2.112E+3
   'RX': 2,
   'Toffoli': 64,
   'T': 856,
   'CNOT': 589,
   'Hadamard': 601

You can also access a more detailed breakdown of resources using the
:meth:`~.estimator.resources_base.Resources.gate_breakdown` method

>>> print(res.gate_breakdown())
RX total: 2
    RX {'precision': 1e-08}: 1
    RX {'precision': 1e-06}: 1
Toffoli total: 64
    Toffoli {'elbow': None}: 4
    Toffoli {'elbow': 'left'}: 60
T total: 856
CNOT total: 589
Hadamard total: 601

### `__init__`

```python
def __init__(self, zeroed_wires: int, any_state_wires: int=0, algo_wires: int=0, gate_types: dict | None=None)
```

Initialize the Resources class.

### `add_series`

```python
def add_series(self, other: Resources) -> Resources
```

Add two Resources objects in series.

When combining resources for serial execution, the following rules apply:

* Zeroed wires: The total ``zeroed`` auxiliary wires are the maximum of the ``zeroed``
  wires in each circuit, as they can be reused.
* Any state wires: The ``any_state`` wires are added together, as they cannot be reused.
* Algorithmic wires: The total ``algo_wires`` are the maximum of the ``algo_wires``
  from each circuit.
* Gates: The gates from each circuit are added together.

Args:
    other (:class:`~.pennylane.estimator.Resources`): the other resource object to add in series with

Returns:
    :class:`~.pennylane.estimator.Resources`: combined resources

**Example**

>>> import pennylane.estimator as qre
>>> gate_set = {"X", "Y", "Z", "CNOT", "T", "S", "Hadamard"}
>>> res1 = qre.estimate(qre.Toffoli(), gate_set)
>>> res2 = qre.estimate(qre.QFT(num_wires=4), gate_set)
>>> res_in_series = res1.add_series(res2)
>>> print(res_in_series)
--- Resources: ---
 Total wires: 6
    algorithmic wires: 4
    allocated wires: 2
         zero state: 2
         any state: 0
 Total gates : 838
  'T': 796,
  'CNOT': 28,
  'Z': 2,
  'S': 3,
  'Hadamard': 9

### `add_parallel`

```python
def add_parallel(self, other: Resources) -> Resources
```

Add two Resources objects in parallel.

When combining resources for parallel execution, the following rules apply:

* Zeroed wires: The maximum of the ``zeroed`` auxiliary wires is used, as they can
  be reused across parallel circuits.
* Any state wires: The ``any_state`` wires are added together, as they cannot be
  reused between circuits.
* Algorithmic wires: The ``algo_wires`` are added together, as each circuit is a
  separate unit running simultaneously.
* Gates: The gates from each circuit are added together.

Args:
    other (:class:`~.pennylane.estimator.Resources`): other resource object to combine with

Returns:
    :class:`~.pennylane.estimator.Resources`: combined resources

**Example**

>>> import pennylane.estimator as qre
>>> gate_set = {"X", "Y", "Z", "CNOT", "T", "S", "Hadamard"}
>>> res1 = qre.estimate(qre.Toffoli(), gate_set)
>>> res2 = qre.estimate(qre.QFT(num_wires=4), gate_set)
>>> res_in_parallel = res1.add_parallel(res2)
>>> print(res_in_parallel)
--- Resources: ---
 Total wires: 9
    algorithmic wires: 7
    allocated wires: 2
         zero state: 2
         any state: 0
 Total gates : 838
  'T': 796,
  'CNOT': 28,
  'Z': 2,
  'S': 3,
  'Hadamard': 9

### `__eq__`

```python
def __eq__(self, other: Resources) -> bool
```

Determine if two resources objects are equal

### `multiply_series`

```python
def multiply_series(self, scalar: int) -> Resources
```

Scale a Resources object in series

Args:
    scalar (int): integer value by which to scale the resources

Returns:
    :class:`~.pennylane.estimator.Resources`: scaled resources

**Example**

>>> import pennylane.estimator as qre
>>> gate_set = {"X", "Y", "Z", "CNOT", "T", "S", "Hadamard"}
>>> res1 = qre.estimate(qre.Toffoli(), gate_set)
>>> res_in_series = res1.multiply_series(3)
>>> print(res_in_series)
--- Resources: ---
 Total wires: 5
    algorithmic wires: 3
    allocated wires: 2
         zero state: 2
         any state: 0
 Total gates : 72
  'T': 12,
  'CNOT': 30,
  'Z': 6,
  'S': 9,
  'Hadamard': 15

### `multiply_parallel`

```python
def multiply_parallel(self, scalar: int) -> Resources
```

Scale a Resources object in parallel

Args:
    scalar (int): integer value by which to scale the resources

Returns:
    :class:`~.pennylane.estimator.Resources`: scaled resources

**Example**

>>> import pennylane.estimator as qre
>>> gate_set = {"X", "Y", "Z", "CNOT", "T", "S", "Hadamard"}
>>> res1 = qre.estimate(qre.Toffoli(), gate_set)
>>> res_in_parallel = res1.multiply_parallel(3)
>>> print(res_in_parallel)
--- Resources: ---
 Total wires: 11
    algorithmic wires: 9
    allocated wires: 2
         zero state: 2
         any state: 0
 Total gates : 72
  'T': 12,
  'CNOT': 30,
  'Z': 6,
  'S': 9,
  'Hadamard': 15

### `gate_counts`

```python
def gate_counts(self) -> dict
```

Produce a dictionary which stores the gate counts
using the operator names as keys.

Returns:
    dict: A dictionary with operator names (str) as keys
        and the number of occurrences in the circuit (int) as values.

### `total_wires`

```python
def total_wires(self) -> int
```

The total number of wires counted.

Returns:
    int: The total number of wires tracked. This is the sum of ``zeroed_wires``,
        ``any_state_wires`` and ``algo_wires``.

### `total_gates`

```python
def total_gates(self) -> int
```

The total number of gates.

Returns:
    int: The total number of gates. This is the sum of all of the counts of gates
        tracked in the ``gate_counts`` dictionary.

### `__str__`

```python
def __str__(self)
```

Generates a string representation of the Resources object.

### `gate_breakdown`

```python
def gate_breakdown(self, gate_set=None)
```

Generates a string breakdown of gate counts by type and parameters,
optionally for a specific set of gates.

Args:
    gate_set (list): A list of gate names to break down.
        If ``None``, details will be provided for all gate types.

**Example**

>>> import pennylane.estimator as qre
>>> def circ():
...     qre.SemiAdder(10)
...     qre.Toffoli()
...     qre.RX(precision=1e-5)
...     qre.RX(precision=1e-7)
>>> res1 = qre.estimate(circ, gate_set=['Toffoli', 'RX', 'CNOT', 'Hadamard'])()
>>> print(res1.gate_breakdown())
RX total: 2
    RX {'precision': 1e-05}: 1
    RX {'precision': 1e-07}: 1
Toffoli total: 10
    Toffoli {'elbow': 'left'}: 9
    Toffoli {'elbow': None}: 1
CNOT total: 60
Hadamard total: 27

### `__repr__`

```python
def __repr__(self)
```

Compact string representation of the Resources object
