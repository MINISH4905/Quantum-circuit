---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/flip_sign.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/flip_sign.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/flip_sign.py`

Contains the FlipSign template.

## `FlipSign`

```python
class FlipSign(Operation)
```

Flips the sign of a given basis state.

This template performs the following operation:

FlipSign(n) :math:`|m\rangle = -|m\rangle` if :math:`m = n`

FlipSign(n) :math:`|m\rangle = |m\rangle` if :math:`m \not = n`,

where n is the basis state to flip and m is the input.

Args:
    n (array[int] or int): binary array or integer value representing the state on which to flip the sign
    wires (array[int] or int): wires that the template acts on

**Example**

This template changes the sign of the basis state passed as an argument.
In this example, when passing the element ``[1, 0]``, we will change the sign of the state :math:`|10\rangle`.
We could alternatively pass the integer ``2`` and get the same result since its binary representation is ``[1, 0]``.

.. code-block:: python

    num_wires = 2
    dev = qp.device("default.qubit", wires=num_wires)

    @qp.qnode(dev)
    def circuit():
        for wire in range(num_wires):
            qp.Hadamard(wire)
        qp.FlipSign([1, 0], wires=range(num_wires))
        return qp.state()

The result for the above circuit is:

>>> circuit()
array([ 0.5+0.j,  0.5+0.j, -0.5+0.j,  0.5+0.j])

### `to_list`

```python
def to_list(n, n_wires)
```

Convert the given basis state from integer number into list of bits.

Args:
    n (int): basis state as integer number
    n_wires (int): number of wires

Raises:
    ValueError: "Cannot encode basis state ``n`` on ``n_wires`` wires."

Returns:
    list[int]: basis state as list of bits

### `compute_decomposition`

```python
def compute_decomposition(wires, arr_bin)
```

Representation of the operator

.. seealso:: :meth:`~.FlipSign.decomposition`.

Args:
    wires (array[int]): wires that the operator acts on
    arr_bin (array[int]): binary array vector representing the state to flip the sign

Raises:
    ValueError: "Wires length and flipping state length does not match, they must be equal length "

Returns:
    list[Operator]: decomposition of the operator
