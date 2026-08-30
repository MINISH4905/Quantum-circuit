---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/drawer/tape_text.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/drawer/tape_text.py
license: Apache-2.0
---

## Module `pennylane/drawer/tape_text.py`

This module contains logic for the text based circuit drawer through the ``tape_text`` function.

## `tape_text`

```python
def tape_text(tape, wire_order=None, *, show_all_wires=False, decimals=None, max_length=100, show_matrices=True, show_wire_labels=True, cache=None)
```

Text based diagram for a Quantum Tape.

Args:
    tape (QuantumTape): the operations and measurements to draw

Keyword Args:
    wire_order (Sequence[Any]): the order (from top to bottom) to print the wires of the circuit
    show_all_wires (bool): If True, all wires, including empty wires, are printed.
    decimals (int): How many decimal points to include when formatting operation parameters.
        Default ``None`` will omit parameters from operation labels.
    max_length (Int) : Maximum length of a individual line.  After this length, the diagram will
        begin anew beneath the previous lines.
    show_matrices=True (bool): show matrix valued parameters below all circuit diagrams
    show_wire_labels (bool): Whether or not to show the wire labels.
    cache (dict): Used to store information between recursive calls. Necessary keys are ``'tape_offset'``
        and ``'matrices'``.

Returns:
    str : String based graphic of the circuit.

**Example:**

.. code-block:: python

    ops = [
        qp.QFT(wires=(0, 1, 2)),
        qp.RX(1.234, wires=0),
        qp.RY(1.234, wires=1),
        qp.RZ(1.234, wires=2),
        qp.Toffoli(wires=(0, 1, "aux"))
    ]
    measurements = [
        qp.expval(qp.Z("aux")),
        qp.var(qp.Z(0) @ qp.Z(1)),
        qp.probs(wires=(0, 1, 2, "aux"))
    ]
    tape = qp.tape.QuantumTape(ops, measurements)

>>> print(qp.drawer.tape_text(tape))
  0: ─╭QFT──RX─╭●─┤ ╭Var[Z@Z] ╭Probs
  1: ─├QFT──RY─├●─┤ ╰Var[Z@Z] ├Probs
  2: ─╰QFT──RZ─│──┤           ├Probs
aux: ──────────╰X─┤  <Z>      ╰Probs

.. details::
    :title: Usage Details

By default, parameters are omitted. By specifying the ``decimals`` keyword, parameters
are displayed to the specified precision. Matrix-valued parameters are never displayed.

>>> print(qp.drawer.tape_text(tape, decimals=2))
  0: ─╭QFT──RX(1.23)─╭●─┤ ╭Var[Z@Z] ╭Probs
  1: ─├QFT──RY(1.23)─├●─┤ ╰Var[Z@Z] ├Probs
  2: ─╰QFT──RZ(1.23)─│──┤           ├Probs
aux: ────────────────╰X─┤  <Z>      ╰Probs


The ``max_length`` keyword wraps long circuits:

.. code-block:: python

    rng = np.random.default_rng(seed=42)
    shape = qp.StronglyEntanglingLayers.shape(n_wires=5, n_layers=5)
    params = rng.random(shape)
    op = qp.StronglyEntanglingLayers(params, wires=range(5))
    tape2 = qp.tape.QuantumScript(op.decomposition())
    print(qp.drawer.tape_text(tape2, max_length=60))


.. code-block:: none

    0: ──Rot─╭●──────────╭X──Rot─╭●───────╭X──Rot──────╭●────╭X
    1: ──Rot─╰X─╭●───────│───Rot─│──╭●────│──╭X────Rot─│──╭●─│─
    2: ──Rot────╰X─╭●────│───Rot─╰X─│──╭●─│──│─────Rot─│──│──╰●
    3: ──Rot───────╰X─╭●─│───Rot────╰X─│──╰●─│─────Rot─╰X─│────
    4: ──Rot──────────╰X─╰●──Rot───────╰X────╰●────Rot────╰X───

    ───Rot───────────╭●─╭X──Rot──────╭●──────────────╭X─┤
    ──╭X────Rot──────│──╰●─╭X────Rot─╰X───╭●─────────│──┤
    ──│────╭X────Rot─│─────╰●───╭X────Rot─╰X───╭●────│──┤
    ──╰●───│─────Rot─│──────────╰●───╭X────Rot─╰X─╭●─│──┤
    ───────╰●────Rot─╰X──────────────╰●────Rot────╰X─╰●─┤


The ``wire_order`` keyword specifies the order of the wires from
top to bottom:

>>> print(qp.drawer.tape_text(tape, wire_order=["aux", 2, 1, 0]))
aux: ──────────╭X─┤  <Z>      ╭Probs
  2: ─╭QFT──RZ─│──┤           ├Probs
  1: ─├QFT──RY─├●─┤ ╭Var[Z@Z] ├Probs
  0: ─╰QFT──RX─╰●─┤ ╰Var[Z@Z] ╰Probs

If the wire order contains empty wires, they are only shown if the ``show_all_wires=True``.

>>> print(qp.drawer.tape_text(tape, wire_order=["a", "b", "aux", 0, 1, 2], show_all_wires=True))
  a: ─────────────┤
  b: ─────────────┤
aux: ──────────╭X─┤  <Z>      ╭Probs
  0: ─╭QFT──RX─├●─┤ ╭Var[Z@Z] ├Probs
  1: ─├QFT──RY─╰●─┤ ╰Var[Z@Z] ├Probs
  2: ─╰QFT──RZ────┤           ╰Probs

Matrix valued parameters are always denoted by ``M`` followed by an integer corresponding to
unique matrices.  The list of unique matrices can be printed at the end of the diagram by
selecting ``show_matrices=True`` (the default):

.. code-block:: python

    ops = [
        qp.QubitUnitary(np.eye(2), wires=0),
        qp.QubitUnitary(np.eye(2), wires=1)
    ]
    measurements = [qp.expval(qp.Hermitian(np.eye(4), wires=(0,1)))]
    tape = qp.tape.QuantumTape(ops, measurements)

>>> print(qp.drawer.tape_text(tape))
0: ──U(M0)─┤ ╭<𝓗(M1)>
1: ──U(M0)─┤ ╰<𝓗(M1)>
M0 =
[[1. 0.]
[0. 1.]]
M1 =
[[1. 0. 0. 0.]
[0. 1. 0. 0.]
[0. 0. 1. 0.]
[0. 0. 0. 1.]]

An existing matrix cache can be passed via the ``cache`` keyword. Note that the dictionary
passed to ``cache`` will be modified during execution to contain any new matrices and the
tape offset.

>>> cache = {'matrices': [-np.eye(3)]}
>>> print(qp.drawer.tape_text(tape, cache=cache))
0: ──U(M1)─┤ ╭<𝓗(M2)>
1: ──U(M1)─┤ ╰<𝓗(M2)>
M0 =
[[-1. -0. -0.]
[-0. -1. -0.]
[-0. -0. -1.]]
M1 =
[[1. 0.]
[0. 1.]]
M2 =
[[1. 0. 0. 0.]
[0. 1. 0. 0.]
[0. 0. 1. 0.]
[0. 0. 0. 1.]]
>>> cache
{'matrices': [array([[-1., -0., -0.],
       [-0., -1., -0.],
       [-0., -0., -1.]]), array([[1., 0.],
       [0., 1.]]), array([[1., 0., 0., 0.],
       [0., 1., 0., 0.],
       [0., 0., 1., 0.],
       [0., 0., 0., 1.]])], 'tape_offset': 0}

When the provided tape has nested tapes inside, this function is called recursively.
To maintain numbering of tapes to arbitrary levels of nesting, the ``cache`` keyword
uses the ``"tape_offset"`` value to determine numbering. Note that the value is updated
during the call.

.. code-block:: python

    with qp.tape.QuantumTape() as tape:
        with qp.tape.QuantumTape() as tape_inner:
            qp.X(0)

    cache = {'tape_offset': 3}
    print(qp.drawer.tape_text(tape, cache=cache))
    print("New tape offset: ", cache['tape_offset'])


.. code-block:: none

    0: ──Tape:3─┤

    Tape:3
    0: ──X─┤
    New tape offset:  4
