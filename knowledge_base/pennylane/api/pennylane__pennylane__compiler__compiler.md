---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/compiler/compiler.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/compiler/compiler.py
license: Apache-2.0
---

## Module `pennylane/compiler/compiler.py`

Compiler developer functions

## `AvailableCompilers`

```python
class AvailableCompilers
```

This contains data of installed PennyLane compiler packages.

## `available_compilers`

```python
def available_compilers() -> list[str]
```

Load and return a list of available compilers that are
installed and compatible with the :func:`~.qjit` decorator.

**Example**

This method returns the name of installed compiler packages supported in
PennyLane. For example, after installing the
`Catalyst <https://github.com/pennylaneai/catalyst>`__
compiler, this will now appear as an available compiler:

>>> qp.compiler.available_compilers()
['catalyst']

## `available`

```python
def available(compiler='catalyst') -> bool
```

Check the availability of the given compiler package.

Args:
    compiler (str): Name of the compiler package (default value is ``catalyst``)

Returns:
    bool: ``True`` if the compiler package is installed on the system

**Example**

Before installing the ``pennylane-catalyst`` package:

>>> qp.compiler.available("catalyst")
False

After installing the ``pennylane-catalyst`` package:

>>> qp.compiler.available("catalyst")
True

## `active_compiler`

```python
def active_compiler() -> str | None
```

Check which compiler is activated inside a :func:`~.qjit` evaluation context.

This helper function may be used during implementation
to allow differing logic for transformations or operations that are
just-in-time compiled, versus those that are not.

Returns:
    Optional[str]: Name of the active compiler inside a :func:`~.qjit` evaluation
    context. If there is no active compiler, ``None`` will be returned.

**Example**

This method can be used to execute logical
branches that are conditioned on whether hybrid compilation with a specific
compiler is occurring.

.. code-block:: python

    dev = qp.device("lightning.qubit", wires=2)

    @qp.qnode(dev)
    def circuit(phi, theta):
        if qp.compiler.active_compiler() == "catalyst":
            qp.RX(phi, wires=0)
        qp.CNOT(wires=[0, 1])
        qp.PhaseShift(theta, wires=0)
        return qp.expval(qp.Z(0))

>>> circuit(np.pi, np.pi / 2)
1.0
>>> qp.qjit(circuit)(np.pi, np.pi / 2)
-1.0

## `active`

```python
def active() -> bool
```

Check whether the caller is inside a :func:`~.qjit` evaluation context.

This helper function may be used during implementation
to allow differing logic for circuits or operations that are
just-in-time compiled versus those that are not.

Returns:
    bool: ``True`` if the caller is inside a QJIT evaluation context

**Example**

For example, you can use this method in your hybrid program to execute it
conditionally whether called inside :func:`~.qjit` or not.

.. code-block:: python

    dev = qp.device("lightning.qubit", wires=2)

    @qp.qnode(dev)
    def circuit(phi, theta):
        if qp.compiler.active():
            qp.RX(phi, wires=0)
        qp.CNOT(wires=[0, 1])
        qp.PhaseShift(theta, wires=0)
        return qp.expval(qp.Z(0))

>>> circuit(np.pi, np.pi / 2)
1.0
>>> qp.qjit(circuit)(np.pi, np.pi / 2)
-1.0
