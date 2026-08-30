---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/debugging/debugger.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/debugging/debugger.py
license: Apache-2.0
---

## Module `pennylane/debugging/debugger.py`

This module contains functionality for the PennyLane Debugger (PLDB) to support
interactive debugging of quantum circuits.

## `PLDB`

```python
class PLDB(pdb.Pdb)
```

Custom debugging class integrated with Pdb.

This class is responsible for storing and updating a global device to be
used for executing quantum circuits while in debugging context. The core
debugger functionality is inherited from the native Python debugger (Pdb).

This class is not directly user-facing, but is interfaced with the
``qp.breakpoint()`` function and ``pldb_device_manager`` context manager.
The former is responsible for launching the debugger prompt and the latter
is responsible with extracting and storing the ``qnode.device``.

The device information is used for validation checks and to execute measurements.

### `__init__`

```python
def __init__(self, *args, **kwargs)
```

Initialize the debugger, and set custom prompt string.

### `valid_context`

```python
def valid_context(cls)
```

Determine if the debugger is called in a valid context.

Raises:
    RuntimeError: breakpoint is called outside of a qnode execution
    TypeError: breakpoints not supported on this device

### `add_device`

```python
def add_device(cls, dev)
```

Update the global active device.

Args:
    dev (Union[Device, "qp.devices.Device"]): the active device

### `get_active_device`

```python
def get_active_device(cls)
```

Return the active device.

Raises:
    RuntimeError: No active device to get

Returns:
    Union[Device, "qp.devices.Device"]: The active device

### `has_active_dev`

```python
def has_active_dev(cls)
```

Determine if there is currently an active device.

Returns:
    bool: True if there is an active device

### `reset_active_dev`

```python
def reset_active_dev(cls)
```

Reset the global active device variable to None.

## `pldb_device_manager`

```python
def pldb_device_manager(device)
```

Context manager to automatically set and reset active
device on the Pennylane Debugger (PLDB).

Args:
    device (Union[Device, "qp.devices.Device"]): the active device instance

## `breakpoint`

```python
def breakpoint()
```

A function which freezes execution and launches the PennyLane debugger (PLDB).

This function marks a location in a quantum circuit (QNode). When it is encountered during
execution of the quantum circuit, an interactive debugging prompt is launched to step
through the circuit execution. Since it is based on the `Python Debugger <https://docs.python.org/3/library/pdb.html>`_ (PDB), commands like
(:code:`list`, :code:`next`, :code:`continue`, :code:`quit`) can be used to navigate the code.

.. seealso:: :doc:`/code/qp_debugging`

**Example**

Consider the following python script containing the quantum circuit with breakpoints.

.. code-block:: python3
    :linenos:

    import pennylane as qp

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit(x):
        qp.breakpoint()

        qp.RX(x, wires=0)
        qp.Hadamard(wires=1)

        qp.breakpoint()

        qp.CNOT(wires=[0, 1])
        return qp.expval(qp.Z(0))

    circuit(1.23)

Running the above python script opens up the interactive :code:`[pldb]` prompt in the terminal.
The prompt specifies the path to the script along with the next line to be executed after the breakpoint.

.. code-block:: console

    > /Users/your/path/to/script.py(9)circuit()
    -> qp.RX(x, wires=0)
    [pldb]

We can interact with the prompt using the commands: :code:`list` , :code:`next`,
:code:`continue`, and :code:`quit`. Additionally, we can also access any variables defined in the function.

.. code-block:: console

    [pldb] x
    1.23

The :code:`list` command will print a section of code around the breakpoint, highlighting the next line
to be executed.

.. code-block:: console

    [pldb] list
    5     @qp.qnode(dev)
    6     def circuit(x):
    7         qp.breakpoint()
    8
    9  ->     qp.RX(x, wires=0)
    10         qp.Hadamard(wires=1)
    11
    12         qp.breakpoint()
    13
    14         qp.CNOT(wires=[0, 1])
    15         return qp.expval(qp.Z(0))
    [pldb]

The :code:`next` command will execute the next line of code, and print the new line to be executed.

.. code-block:: console

    [pldb] next
    > /Users/your/path/to/script.py(10)circuit()
    -> qp.Hadamard(wires=1)
    [pldb]

The :code:`continue` command will resume code execution until another breakpoint is reached. It will
then print the new line to be executed. Finally, :code:`quit` will resume execution of the file and
terminate the debugging prompt.

.. code-block:: console

    [pldb] continue
    > /Users/your/path/to/script.py(14)circuit()
    -> qp.CNOT(wires=[0, 1])
    [pldb] quit

## `debug_state`

```python
def debug_state()
```

Compute the quantum state at the current point in the quantum circuit.

Debugging measurements do not alter the state, it remains the same until the
next operation in the circuit.

Returns:
    Array(complex): quantum state of the circuit

**Example**

While in a "debugging context", we can query the state as we would at the end of a circuit.

.. code-block:: python3

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit(x):
        qp.RX(x, wires=0)
        qp.Hadamard(wires=1)

        qp.breakpoint()

        qp.CNOT(wires=[0, 1])
        return qp.expval(qp.Z(0))

    circuit(1.23)

Running the above python script opens up the interactive :code:`[pldb]` prompt in the terminal.
We can query the state:

.. code-block:: console

    [pldb] longlist
      4     @qp.qnode(dev)
      5     def circuit(x):
      6         qp.RX(x, wires=0)
      7         qp.Hadamard(wires=1)
      8
      9         qp.breakpoint()
     10
     11  ->     qp.CNOT(wires=[0, 1])
     12         return qp.expval(qp.Z(0))
    [pldb] qp.debug_state()
    array([0.57754604+0.j        , 0.57754604+0.j        ,
    0.        -0.40797128j, 0.        -0.40797128j])

## `debug_expval`

```python
def debug_expval(op)
```

Compute the expectation value of an observable at the
current point in the quantum circuit.

Debugging measurements do not alter the state, it remains the same until the
next operation in the circuit.

Args:
    op (Operator): the observable to compute the expectation value for.

Returns:
    complex: expectation value of the operator

**Example**

While in a "debugging context", we can query the expectation value of an observable
as we would at the end of a circuit.

.. code-block:: python3

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit(x):
        qp.RX(x, wires=0)
        qp.Hadamard(wires=1)

        qp.breakpoint()

        qp.CNOT(wires=[0, 1])
        return qp.state()

    circuit(1.23)

Running the above python script opens up the interactive :code:`[pldb]` prompt in the terminal.
We can query the expectation value:

.. code-block:: console

    [pldb] longlist
      4     @qp.qnode(dev)
      5     def circuit(x):
      6         qp.RX(x, wires=0)
      7         qp.Hadamard(wires=1)
      8
      9         qp.breakpoint()
     10
     11  ->     qp.CNOT(wires=[0, 1])
     12         return qp.state()
    [pldb] qp.debug_expval(qp.Z(0))
    0.33423772712450256

## `debug_probs`

```python
def debug_probs(wires=None, op=None)
```

Compute the probability distribution for the state at the current
point in the quantum circuit.

Debugging measurements do not alter the state, it remains the same until the
next operation in the circuit.

Args:
    wires (Union[Iterable, int, str, list]): the wires the operation acts on
    op (Union[Operator, MeasurementValue]): an observable (with a ``diagonalizing_gates``
        attribute) that rotates the computational basis, or a  ``MeasurementValue``
        corresponding to mid-circuit measurements.

Returns:
    Array(float): the probability distribution of the bitstrings for the wires

**Example**

While in a "debugging context", we can query the probability distribution
as we would at the end of a circuit.

.. code-block:: python3

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit(x):
        qp.RX(x, wires=0)
        qp.Hadamard(wires=1)

        qp.breakpoint()

        qp.CNOT(wires=[0, 1])
        return qp.state()

    circuit(1.23)

Running the above python script opens up the interactive :code:`[pldb]` prompt in the terminal.
We can query the probability distribution:

.. code-block:: console

    [pldb] longlist
      4     @qp.qnode(dev)
      5     def circuit(x):
      6         qp.RX(x, wires=0)
      7         qp.Hadamard(wires=1)
      8
      9         qp.breakpoint()
     10
     11  ->     qp.CNOT(wires=[0, 1])
     12         return qp.state()
    [pldb] qp.debug_probs()
    array([0.33355943, 0.33355943, 0.16644057, 0.16644057])

## `debug_tape`

```python
def debug_tape()
```

Access the tape of the quantum circuit.

The tape can then be used to access all properties stored in :class:`~pennylane.tape.QuantumTape`.
This can be used to visualize the gates that have
been applied from the quantum circuit so far or otherwise process the operations.

Returns:
    QuantumTape: the quantum tape representing the circuit

**Example**

While in a "debugging context", we can access the :code:`QuantumTape` representing the
operations we have applied so far:

.. code-block:: python3

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit(x):
        qp.RX(x, wires=0)
        qp.Hadamard(wires=1)
        qp.CNOT(wires=[0, 1])

        qp.breakpoint()

        return qp.expval(qp.Z(0))

    circuit(1.23)

Running the above python script opens up the interactive :code:`[pldb]` prompt in the terminal.
We can access the tape and draw it as follows:

.. code-block:: console

    [pldb] t = qp.debug_tape()
    [pldb] print(t.draw())
    0: ──RX─╭●─┤
    1: ──H──╰X─┤
