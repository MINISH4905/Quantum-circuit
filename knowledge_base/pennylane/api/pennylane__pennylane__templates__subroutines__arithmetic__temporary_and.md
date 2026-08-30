---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/arithmetic/temporary_and.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/arithmetic/temporary_and.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/arithmetic/temporary_and.py`

Contains the TemporaryAND template, which also is known as Elbow.

## `TemporaryAND`

```python
class TemporaryAND(Operation)
```

TemporaryAND(wires, control_values)

The ``TemporaryAND`` operation is a three-qubit gate equivalent to a reversible ``AND``,
or :class:`~pennylane.Toffoli`, gate that leverages extra information about the target
wire to enable more efficient circuit decompositions. ``TemporaryAND`` assumes the target qubit
to be in the state :math:`|0\rangle`, while ``Adjoint(TemporaryAND)`` assumes the target output
to be :math:`|0\rangle`. For more details, see Fig. 4
in `arXiv:1805.03662 <https://arxiv.org/abs/1805.03662>`_.

.. note::

    For correct usage of this operation, the user must ensure
    that before using ``TemporaryAND`` the input state of the target wire is :math:`|0\rangle`,
    and that after uncomputation, i.e., after using ``Adjoint(TemporaryAND)``, the output
    state of the target wire is :math:`|0\rangle`,
    when using ``TemporaryAND`` or ``Adjoint(TemporaryAND)``, respectively.
    Otherwise, behaviour may differ from the expected ``AND``.

**Details:**

* Number of wires: 3
* Number of parameters: 0

Args:
    wires (Sequence[int]): the subsystem the gate acts on. The first two wires are the
        control wires and the third one is the target wire.
    control_values (tuple[bool or int]): The values on the control wires for which the target
        operator is applied. Integers other than 0 or 1 will be treated as ``int(bool(x))``.
        Default is ``(1, 1)``, corresponding to a traditional ``AND`` gate.


.. seealso:: The alias :class:`~Elbow`.

**Example**

.. code-block:: python

    import pennylane as qp

    @qp.set_shots(1)
    @qp.qnode(qp.device("default.qubit"))
    def circuit():
        # |0000⟩
        qp.X(0) # |1000⟩
        qp.X(1) # |1100⟩
        # The target wire is in state |0>, so we can apply TemporaryAND
        qp.TemporaryAND([0,1,2]) # |1110⟩
        qp.CNOT([2,3]) # |1111⟩
        # The target wire will be in state |0> after adjoint(TemporaryAND) gate is applied,
        # so we can apply adjoint(TemporaryAND)
        qp.adjoint(qp.TemporaryAND([0,1,2])) # |1101⟩
        return qp.sample(wires=[0,1,2,3])

>>> print(qp.draw(circuit)())
0: ──X─╭●─────●╮─┤ ╭Sample
1: ──X─├●─────●┤─┤ ├Sample
2: ────╰⊕─╭●──⊕╯─┤ ├Sample
3: ───────╰X─────┤ ╰Sample
>>> print(circuit())
[[1 1 0 1]]

There is also a decomposition of ``TemporaryAND`` into a standard ``Toffoli`` gate, in order
to provide a compilation path into gate sets like Clifford + Toffoli:

.. code-block:: python

    import pennylane as qp

    qp.decomposition.enable_graph()

    @qp.decompose(gate_set={qp.Toffoli, qp.X})
    def circuit():
        qp.TemporaryAND((0, 1, 2))
        return qp.expval(qp.Z(2))

>>> print(qp.draw(circuit)())
0: ─╭●─┤
1: ─├●─┤
2: ─╰X─┤  <Z>

Note that we had to add ``qp.X`` to the gate set passed to ``decompose``, because the
decomposition may contain bit flips on the control qubits, depending on potentially dynamic
control values.

### `compute_matrix`

```python
def compute_matrix(**kwargs)
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

Returns:
    array_like: matrix

**Example**

>>> print(qp.TemporaryAND.compute_matrix(control_values = (1,1)))
[[ 1.+0.j  0.+0.j  0.+0.j  0.+0.j  0.+0.j  0.+0.j  0.+0.j  0.+0.j]
 [ 0.+0.j -0.-1.j  0.+0.j  0.+0.j  0.+0.j  0.+0.j  0.+0.j  0.+0.j]
 [ 0.+0.j  0.+0.j  1.+0.j  0.+0.j  0.+0.j  0.+0.j  0.+0.j  0.+0.j]
 [ 0.+0.j  0.+0.j  0.+0.j -0.-1.j  0.+0.j  0.+0.j  0.+0.j  0.+0.j]
 [ 0.+0.j  0.+0.j  0.+0.j  0.+0.j  1.+0.j  0.+0.j  0.+0.j  0.+0.j]
 [ 0.+0.j  0.+0.j  0.+0.j  0.+0.j  0.+0.j  0.+1.j  0.+0.j  0.+0.j]
 [ 0.+0.j  0.+0.j  0.+0.j  0.+0.j  0.+0.j  0.+0.j  0.+0.j -0.-1.j]
 [ 0.+0.j  0.+0.j  0.+0.j  0.+0.j  0.+0.j  0.+0.j  1.+0.j  0.+0.j]]
