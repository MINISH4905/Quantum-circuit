---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/tracker.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/tracker.py
license: Apache-2.0
---

## Module `pennylane/devices/tracker.py`

This module contains a class for updating and recording information about device executions.

## `Tracker`

```python
class Tracker
```

This class stores information about device executions and allows users to interact with that
data upon individual executions and batches, even within parameter-shift gradients and
optimization steps.

The information is stored in three class attribute dictionaries: ``totals``, ``history``,
and ``latest``:

* ``latest`` tracks the last set of information passed to the tracker.
* ``history`` stores a list of values passed for each keyword.
* ``totals`` keeps a running sum per keyword when the values are numeric.

Standard devices will track the number of executions, number of shots, number of batch
executions, batch execution length, and results of circuit executions, but plugins may store
additional information with no changes to this class.

Information is only stored when the class attribute ``active`` is set to ``True``. This
attribute can be toggled via a context manager and Python's ``with`` statement. Upon entering a
context, the stored information is reset, unless ``persistent=True``. Tracking mode can also be
manually triggered by setting ``tracker.active = True`` without the use of a context manager.

Args:
    dev (.devices.Device): A PennyLane compatible device
    callback=None (callable or None): A function of the keywords ``totals``,
        ``history`` and ``latest``.  Run on each ``record`` call with current values of
        the corresponding attributes.
    persistent=False (bool): Whether to reset stored information upon
        entering a runtime context.


**Example**

Using a ``with`` statement to toggle the active mode, we can see the number of executions
and shots used to calculate a parameter-shift derivative.

.. code-block:: python

    import pennylane as qp

    dev = qp.device('default.qubit', wires=1, seed=42)

    @qp.set_shots(shots=100)
    @qp.qnode(dev, diff_method="parameter-shift")
    def circuit(x):
        qp.RX(x, wires=0)
        return qp.expval(qp.Z(0))

    x = qp.numpy.array(0.1, requires_grad=True)

    with qp.Tracker(dev) as tracker:
        qp.grad(circuit)(x)

You can then access the tabulated information through ``totals``, ``history``, and ``latest``:

>>> tracker.totals
{'batches': 2, 'simulations': 3, 'executions': 3, 'results': np.float64(1.02), 'shots': 300}
>>> import pprint
>>> pprint.pprint(tracker.latest)
{'errors': {},
 'executions': 1,
 'resources': SpecsResources(gate_types={'RX': 1},
                             gate_sizes={1: 1},
                             measurements={'expval(PauliZ)': 1},
                             num_allocs=1,
                             depth=1),
 'results': np.float64(0.12),
 'shots': 100,
 'simulations': 1}
>>> tracker.history.keys()
dict_keys(['batches', 'simulations', 'executions', 'results', 'shots', 'resources', 'errors'])
>>> tracker.history['results']
[np.float64(1.0), np.float64(-0.1), np.float64(0.12)]
>>> print(tracker.history['resources'][0])
Wire allocations: 1
Total gates: 1
Gate counts:
- RX: 1
Measurements:
- expval(PauliZ): 1
Depth: 1

We can see that calculating the gradient of ``circuit`` takes three total evaluations: one
forward pass and one batch of length two for the derivative of ``qp.RX``.

.. details::
    :title: Usage Details

    .. note::
        With backpropagation, this function should take ``qnode.device``
        instead of the device used to create the QNode.

    Users can pass a custom callback function to the ``callback`` keyword. This
    function is run each time the ``record()`` method is called, which occurs near
    the end of a device's ``execute`` and ``batch_execute`` methods. Using ``print``
    or logging, users can monitor completion during a long set of jobs.

    The function passed must accept ``totals``, ``history``, and ``latest`` as
    keyword arguments. The dictionary ``latest`` will contain different keywords based on whether
    whether ``execute`` or ``batch_execute`` last performed an update.

    >>> def shots_info(totals, history, latest):
    ...     if 'shots' in latest:
    ...         print("Total shots: ", totals['shots'])
    >>> x = qp.numpy.array(0.1, requires_grad=True)
    >>> with qp.Tracker(circuit.device, callback=shots_info) as tracker:
    ...     _ = qp.grad(circuit)(x)
    Total shots:  100
    Total shots:  200
    Total shots:  300

    By specifying ``persistent=True``, you can reuse the same tracker across
    multiple contexts.

    >>> with qp.Tracker(circuit.device, persistent=True) as tracker:
    ...     circuit(0.1)
    np.float64(0.96)
    >>> with tracker:
    ...     circuit(0.2)
    np.float64(0.98)
    >>> tracker.totals['executions']
    2

    When used with the null qubit device (eg. ``dev = qp.device("null.qubit")``), we can track the resources
    used in the circuit without execution!

    >>> dev = qp.device("null.qubit", wires=[0])
    >>> @qp.set_shots(shots=10)
    ... @qp.qnode(dev)
    ... def circuit(x):
    ...     qp.RX(x, wires=0)
    ...     return qp.expval(qp.Z(0))
    ...
    >>> with qp.Tracker(dev) as tracker:
    ...     circuit(0.1)
    ...
    array(0.)
    >>> resources_lst = tracker.history['resources']
    >>> print(resources_lst[0])
    Wire allocations: 1
    Total gates: 1
    Gate counts:
    - RX: 1
    Measurements:
    - expval(PauliZ): 1
    Depth: 1

### `update`

```python
def update(self, **kwargs)
```

Store passed keyword-value pairs into ``totals``,``history``, and ``latest`` attributes.

There is no restriction on the key-value pairs passed, but in the standard devices, the
device ``execute`` method will pass ``executions`` and ``shots``, and the ``batch_execute``
method will pass ``batches`` and ``batch_len``.

Only numeric values will be added to ``totals``.

>>> tracker.update(a=1, b=2, c="c")
>>> tracker.latest
{'a': 1, 'b': 2, 'c': 'c'}
>>> import pprint
>>> pprint.pprint(tracker.history)
{'a': [1],
 'b': [2],
 'batches': [1],
 'c': ['c'],
 'errors': [{}],
 'executions': [1],
 'resources': [SpecsResources(gate_types={'RX': 1},
                              gate_sizes={1: 1},
                              measurements={'expval(PauliZ)': 1},
                              num_allocs=1,
                              depth=1)],
 'results': [array(0.)],
 'shots': [10],
 'simulations': [1]}
>>> tracker.totals
{'batches': 1, 'simulations': 1, 'executions': 1, 'shots': 10, 'a': 1, 'b': 2}

### `reset`

```python
def reset(self)
```

Resets stored information.

### `record`

```python
def record(self)
```

This method allows users to interact with the stored data.  While it's intended purpose
is monitoring large jobs through ``print`` statements or logging, the function is
completely flexible and customizable.

If a user provided a ``callback`` function during initialization, that function is called
with the current ``totals``, ``history``, and ``latest`` data variables as keyword arguments.
