---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/two_qubit_to_sqrt_iswap.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/two_qubit_to_sqrt_iswap.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/analytical_decompositions/two_qubit_to_sqrt_iswap.py`

Utility methods for decomposing two-qubit unitaries into sqrt-iSWAP gates.

References:
    Towards ultra-high fidelity quantum operations: SQiSW gate as a native
    two-qubit gate
    https://arxiv.org/abs/2105.06074

## `parameterized_2q_op_to_sqrt_iswap_operations`

```python
def parameterized_2q_op_to_sqrt_iswap_operations(op: cirq.Operation, *, use_sqrt_iswap_inv: bool=False) -> protocols.decompose_protocol.DecomposeResult
```

Tries to decompose a parameterized 2q operation into √iSWAP's + parameterized 1q rotations.

Currently only supports decomposing the following gates:
    a) `cirq.CZPowGate`
    b) `cirq.SwapPowGate`
    c) `cirq.ISwapPowGate`
    d) `cirq.FSimGate`

Args:
    op: Parameterized two qubit operation to be decomposed into sqrt-iswaps.
    use_sqrt_iswap_inv: If True, `cirq.SQRT_ISWAP_INV` is used as the target 2q gate, instead
        of `cirq.SQRT_ISWAP`.

Returns:
    A parameterized `cirq.OP_TREE` implementing `op` using only `cirq.SQRT_ISWAP`
    (or `cirq.SQRT_ISWAP_INV`) and parameterized single qubit rotations OR
    None or NotImplemented if decomposition of `op` is not known.

## `two_qubit_matrix_to_sqrt_iswap_operations`

```python
def two_qubit_matrix_to_sqrt_iswap_operations(q0: cirq.Qid, q1: cirq.Qid, mat: np.ndarray, *, required_sqrt_iswap_count: int | None=None, use_sqrt_iswap_inv: bool=False, atol: float=1e-08, check_preconditions: bool=True, clean_operations: bool=False) -> Sequence[cirq.Operation]
```

Decomposes a two-qubit operation into ZPow/XPow/YPow/sqrt-iSWAP gates.

This method uses the KAK decomposition of the matrix to determine how many
sqrt-iSWAP gates are needed and which single-qubit gates to use in between
each sqrt-iSWAP.

All operations can be synthesized with exactly three sqrt-iSWAP gates and
about 79% of operations (randomly chosen under the Haar measure) can also be
synthesized with two sqrt-iSWAP gates.  Only special cases locally
equivalent to identity or sqrt-iSWAP can be synthesized with zero or one
sqrt-iSWAP gates respectively.  Unless ``required_sqrt_iswap_count`` is
specified, the fewest possible number of sqrt-iSWAP will be used.

Args:
    q0: The first qubit being operated on.
    q1: The other qubit being operated on.
    mat: Defines the operation to apply to the pair of qubits.
    required_sqrt_iswap_count: When specified, exactly this many sqrt-iSWAP
        gates will be used even if fewer is possible (maximum 3).  Raises
        ``ValueError`` if impossible.
    use_sqrt_iswap_inv: If True, returns a decomposition using
        ``SQRT_ISWAP_INV`` gates instead of ``SQRT_ISWAP``.  This
        decomposition is identical except for the addition of single-qubit
        Z gates.
    atol: A limit on the amount of absolute error introduced by the
        construction.
    check_preconditions: If set, verifies that the input corresponds to a
        4x4 unitary before decomposing.
    clean_operations: Merges runs of single qubit gates to a single `cirq.PhasedXZGate` in
        the resulting operations list.

Returns:
    A list of operations implementing the matrix including at most three
    ``SQRT_ISWAP`` (sqrt-iSWAP) gates and ZPow, XPow, and YPow single-qubit
    gates.

Raises:
    ValueError:
        If ``required_sqrt_iswap_count`` is specified, the minimum number of
        sqrt-iSWAP gates needed to decompose the given matrix is greater
        than ``required_sqrt_iswap_count``.

References:
    Towards ultra-high fidelity quantum operations: SQiSW gate as a native
    two-qubit gate
    https://arxiv.org/abs/2105.06074
