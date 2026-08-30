---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/circuit/_utils.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/circuit/_utils.py
license: Apache-2.0
---

## Module `qiskit/visualization/circuit/_utils.py`

Common circuit visualization utilities.

## `get_gate_ctrl_text`

```python
def get_gate_ctrl_text(op, drawer, style=None)
```

Load the gate_text and ctrl_text strings based on names and labels

## `get_param_str`

```python
def get_param_str(op, drawer, ndigits=3)
```

Get the params as a string to add to the gate text display

## `get_wire_map`

```python
def get_wire_map(circuit, bits, cregbundle)
```

Map the bits and registers to the index from the top of the drawing.
The key to the dict is either the (Qubit, Clbit) or if cregbundle True,
the register that is being bundled.

Args:
    circuit (QuantumCircuit): the circuit being drawn
    bits (list(Qubit, Clbit)): the Qubit's and Clbit's in the circuit
    cregbundle (bool): if True bundle classical registers. Default: ``True``.

Returns:
    dict((Qubit, Clbit, ClassicalRegister): index): map of bits/registers
        to index

## `get_bit_register`

```python
def get_bit_register(circuit, bit)
```

Get the register for a bit if there is one

Args:
    circuit (QuantumCircuit): the circuit being drawn
    bit (Qubit, Clbit): the bit to use to find the register and indexes

Returns:
    ClassicalRegister: register associated with the bit

## `get_bit_reg_index`

```python
def get_bit_reg_index(circuit, bit)
```

Get the register for a bit if there is one, and the index of the bit
from the top of the circuit, or the index of the bit within a register.

Args:
    circuit (QuantumCircuit): the circuit being drawn
    bit (Qubit, Clbit): the bit to use to find the register and indexes

Returns:
    (ClassicalRegister, None): register associated with the bit
    int: index of the bit from the top of the circuit
    int: index of the bit within the register, if there is a register

## `get_wire_label`

```python
def get_wire_label(drawer, register, index, layout=None, cregbundle=True)
```

Get the bit labels to display to the left of the wires.

Args:
    drawer (str): which drawer is calling ("text", "mpl", or "latex")
    register (QuantumRegister or ClassicalRegister): get wire_label for this register
    index (int): index of bit in register
    layout (Layout): Optional. mapping of virtual to physical bits
    cregbundle (bool): Optional. if set True bundle classical registers.
        Default: ``True``.

Returns:
    str: label to display for the register/index

## `get_condition_label_val`

```python
def get_condition_label_val(condition, circuit, cregbundle)
```

Get the label and value list to display a condition

Args:
    condition (Union[Clbit, ClassicalRegister], int): classical condition
    circuit (QuantumCircuit): the circuit that is being drawn
    cregbundle (bool): if set True bundle classical registers

Returns:
    str: label to display for the condition
    list(str): list of 1's and 0's indicating values of condition

## `fix_special_characters`

```python
def fix_special_characters(label)
```

Convert any special characters for mpl and latex drawers.
Currently only checks for multiple underscores in register names
and uses wider space for mpl and latex drawers.

Args:
    label (str): the label to fix

Returns:
    str: label to display

## `generate_latex_label`

```python
def generate_latex_label(label)
```

Convert a label to a valid latex string.
