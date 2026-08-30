---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/registers.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/registers.py
license: Apache-2.0
---

## Module `pennylane/registers.py`

This module contains the :func:`registers` function.

## `registers`

```python
def registers(register_dict)
```

Returns a dictionary that maps register names to :class:`~.Wires`.

This function helps to group qubits and abstract away the finer details of running quantum
algorithms. Register names and their total number of wires are typically known in advance,
but managing the specific wire range for each register can be a challenge. The ``qp.registers()``
function creates a dictionary that maps register names to :class:`~.Wires` objects. Moreover,
it allows one to input a nested structure where registers contain sub-registers, as illustrated
in the examples below.

Args:
    register_dict (dict): a dictionary where keys are register names and values are either
        positive integers indicating the number of qubits or nested dictionaries of more registers

Returns:
    dict: Dictionary where the keys are the names (str) of the registers, and the
    values are :class:`~.Wires` objects.

**Example**

Given flat input dictionary:

>>> qp.registers({"alice": 2, "bob": 3})
{'alice': Wires([0, 1]), 'bob': Wires([2, 3, 4])}

Given nested input dictionary:

>>> wire_registers = qp.registers({"people": {"alice": 2, "bob": 1}})
>>> wire_registers
{'alice': Wires([0, 1]), 'bob': Wires([2]), 'people': Wires([0, 1, 2])}
>>> wire_registers['bob']
Wires([2])
>>> wire_registers['alice'][1]
1

A simple example showcasing how to implement the `SWAP <https://en.wikipedia.org/wiki/Swap_test>`_ test:

.. code-block:: python

    dev = qp.device("default.qubit")
    reg = qp.registers({"aux": 1, "phi": 5, "psi": 5})

    @qp.qnode(dev)
    def circuit():
        for state in ["phi", "psi"]:
             qp.BasisState([1, 1, 0, 0, 0], reg[state])

        qp.Hadamard(reg["aux"])
        for i in range(len(reg["phi"])):
            qp.CSWAP(reg["aux"] + reg["phi"][i] + reg["psi"][i])
        qp.Hadamard(reg["aux"])

        return qp.expval(qp.Z(wires=reg["aux"]))

>>> print(circuit())
0.999...
