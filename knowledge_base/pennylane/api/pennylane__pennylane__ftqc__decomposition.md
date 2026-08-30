---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ftqc/decomposition.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ftqc/decomposition.py
license: Apache-2.0
---

## Module `pennylane/ftqc/decomposition.py`

Contains functions to convert a PennyLane tape to the textbook MBQC formalism

## `ppr_to_mbqc_setup_inputs`

```python
def ppr_to_mbqc_setup_inputs()
```

Specify that the MLIR compiler pass for lowering Pauli Product Rotations (PPR)
and Pauli Product Measurements (PPM) to a measurement-based quantum computing
(MBQC) style circuit will be applied.

This pass replaces PBC operations (``pbc.ppr`` and ``pbc.ppm``) with a
gate-based sequence in the Quantum dialect using universal gates and
measurements that are supported as MBQC gate set.
For details, see the Figure 2 of `Measurement-based Quantum Computation on cluster states <https://arxiv.org/abs/quant-ph/0301052>`_.

Conceptually, each Pauli product is handled by:

- Mapping its Pauli string to the Z basis via per-qubit conjugations
  (e.g., ``H`` for ``X``; specialized ``RotXZX`` sequences for ``Y``).
- Accumulating parity onto the first qubit with a right-to-left CNOT ladder.
- Emitting the kernel operation:
  - **PPR**: apply an ``RZ`` with an angle derived from the rotation kind.
  - **PPM**: perform a measurement and return an ``i1`` result.
- Uncomputing by reversing the CNOT ladder and the conjugations.
- Conjugating the qubits back to the original basis.

.. note::

    This pass expects PPR/PPM operations to be present. In practice, use it
    after ``to_ppr``.

Args:
    fn (QNode): QNode to apply the pass to.

Returns:
    :class:`QNode <pennylane.QNode>`

**Example**

Convert a simple Clifford+T circuit to PPRs, then lower them to an
MBQC-style circuit. Note that this pass should be applied before
``ppr_to_ppm`` since it requires the actual PPR/PPM operations.

.. code-block::

    import pennylane as qp
    from pennylane.ftqc.decomposition import ppr_to_mbqc
    from pennylane.transforms.decompositions import to_ppr

    p = [("my_pipe", ["quantum-compilation-stage"])]

    @qp.qjit(pipelines=p, target="mlir", keep_intermediate=True)
    @ppr_to_mbqc
    @to_ppr
    @qp.qnode(qp.device("null.qubit", wires=2))
    def circuit():
        qp.H(0)
        qp.CNOT([0, 1])
        return

    print(circuit.mlir_opt)

Example MLIR excerpt (structure only):

.. code-block::

    ...
    %cst = arith.constant -1.5707963267948966 : f64
    %cst_0 = arith.constant 1.5707963267948966 : f64
    %0 = quantum.alloc( 2) : !quantum.reg
    %1 = quantum.extract %0[ 0] : !quantum.reg -> !quantum.bit
    %2 = quantum.extract %0[ 1] : !quantum.reg -> !quantum.bit
    %out_qubits = quantum.custom "RZ"(%cst_0) %1 : !quantum.bit
    %out_qubits_1 = quantum.custom "H"() %out_qubits : !quantum.bit
    %out_qubits_2 = quantum.custom "RZ"(%cst_0) %out_qubits_1 : !quantum.bit
    %out_qubits_3 = quantum.custom "H"() %out_qubits_2 : !quantum.bit
    %out_qubits_4 = quantum.custom "RZ"(%cst_0) %out_qubits_3 : !quantum.bit
    %out_qubits_5 = quantum.custom "H"() %2 : !quantum.bit
    %out_qubits_6:2 = quantum.custom "CNOT"() %out_qubits_5, %out_qubits_4 : !quantum.bit, !quantum.bit
    %out_qubits_7 = quantum.custom "RZ"(%cst_0) %out_qubits_6#1 : !quantum.bit
    %out_qubits_8:2 = quantum.custom "CNOT"() %out_qubits_6#0, %out_qubits_7 : !quantum.bit, !quantum.bit
    %out_qubits_9 = quantum.custom "H"() %out_qubits_8#0 : !quantum.bit
    %out_qubits_10 = quantum.custom "RZ"(%cst) %out_qubits_8#1 : !quantum.bit
    %out_qubits_11 = quantum.custom "H"() %out_qubits_9 : !quantum.bit
    %out_qubits_12 = quantum.custom "RZ"(%cst) %out_qubits_11 : !quantum.bit
    %out_qubits_13 = quantum.custom "H"() %out_qubits_12 : !quantum.bit
    %mres, %out_qubit = quantum.measure %out_qubits_13 : i1, !quantum.bit
    ...

## `convert_to_mbqc_gateset`

```python
def convert_to_mbqc_gateset(tape)
```

Converts a circuit expressed in arbitrary gates to the limited gate set that we can
convert to the textbook MBQC formalism

## `convert_to_mbqc_formalism`

```python
def convert_to_mbqc_formalism(tape, diagonalize_mcms=False)
```

Convert a circuit to the textbook MBQC formalism based on the procedures outlined in
Raussendorf et al. 2003, https://doi.org/10.1103/PhysRevA.68.022312. The circuit must
be decomposed to the gate set {CNOT, H, S, RotXZX, RZ, X, Y, Z, Identity, GlobalPhase}
before applying the transform.

Note that this transform leaves all Paulis and Identities as physical gates, and applies
all byproduct operations online immediately after their respective measurement procedures.

Args:
    diagonalize_mcms (bool, optional): When set, the transform inserts diagonalizing gates
        before arbitrary-basis mid-circuit measurements. Defaults to False.

## `queue_single_qubit_gate`

```python
def queue_single_qubit_gate(q_mgr, op, in_wire, diagonalize_mcms)
```

Queue the resource state preparation, measurements and byproducts
to execute the operation in the MBQC formalism. This implementation
follows the procedures defined in Raussendorf et al. 2003,
https://doi.org/10.1103/PhysRevA.68.022312, see Fig. 2

## `queue_measurements`

```python
def queue_measurements(op, wires, diagonalize_mcms=False)
```

Queue the measurements needed to execute the operation in the MBQC formalism

## `queue_corrections`

```python
def queue_corrections(op, measurements)
```

Queue the byproduct corrections associated with the operation in the
MBQC formalism, based on the operation and the measurement results

## `queue_cnot`

```python
def queue_cnot(q_mgr, ctrl_idx, target_idx, diagonalize_mcms=False)
```

Queue the resource state preparation, measurements and byproducts to execute
the operation in the MBQC formalism. This is the 15-qubit procedure from
Raussendorf et al. 2003, https://doi.org/10.1103/PhysRevA.68.022312, Fig. 2

## `cnot_measurements`

```python
def cnot_measurements(wires, diagonalize_mcms=False)
```

Queue the measurements needed to execute CNOT in the MBQC formalism.
Numbering convention follows the procedure in Raussendorf et al. 2003,
https://doi.org/10.1103/PhysRevA.68.022312, see Fig. 2

## `cnot_corrections`

```python
def cnot_corrections(measurements)
```

Queue the byproduct corrections associated with the CNOT gate in
the MBQC formalism, based on measurement results
