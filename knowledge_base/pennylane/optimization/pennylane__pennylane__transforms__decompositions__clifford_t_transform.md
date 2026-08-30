---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/decompositions/clifford_t_transform.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/decompositions/clifford_t_transform.py
license: Apache-2.0
---

## Module `pennylane/transforms/decompositions/clifford_t_transform.py`

Transform function for the Clifford+T decomposition.

## `check_clifford_t`

```python
def check_clifford_t(op, use_decomposition=False)
```

Checks whether the gate is in the standard Clifford+T basis.

For a given unitary operator :math:`U` acting on :math:`N` qubits, which is not a T-gate,
this method checks that the transformation :math:`UPU^{\dagger}` maps the Pauli tensor products
:math:`P = {I, X, Y, Z}^{\otimes N}` to Pauli tensor products using the decomposition of the
matrix for :math:`U` in the Pauli basis.

Args:
    op (~pennylane.operation.Operation): the operator that needs to be checked
    use_decomposition (bool): if ``True``, use operator's decomposition to compute the matrix, in case
        it doesn't define a ``compute_matrix`` method. Default is ``False``.

Returns:
    Bool that represents whether the provided operator is Clifford+T or not.

## `clifford_t_decomposition`

```python
def clifford_t_decomposition(tape: QuantumScript, epsilon=0.0001, method='gridsynth', cache_size=1000, cache_eps_rtol=None, **method_kwargs) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Decomposes a circuit into the Clifford+T basis.

This method first decomposes the gate operations to a basis comprised of Clifford, :class:`~.T`, :class:`~.RZ` and
:class:`~.GlobalPhase` operations (and their adjoints). The Clifford gates include the following PennyLane operations:

- Single qubit gates - :class:`~.Identity`, :class:`~.PauliX`, :class:`~.PauliY`, :class:`~.PauliZ`,
  :class:`~.SX`, :class:`~.S`, and :class:`~.Hadamard`.
- Two qubit gates - :class:`~.CNOT`, :class:`~.CY`, :class:`~.CZ`, :class:`~.SWAP`, and :class:`~.ISWAP`.

Then, the leftover single qubit :class:`~.RZ` operations are approximated in the Clifford+T basis with
:math:`\epsilon > 0` error. By default, the Ross-Selinger algorithm described in
`Ross and Selinger (2016) <https://arxiv.org/abs/1403.2975v3>`_ is used for this. Alternatively,
the Solovay-Kitaev algorithm described in `Dawson and Nielsen (2005) <https://arxiv.org/abs/quant-ph/0505030>`_
is available by setting ``method="sk"``.

.. note::

    The ``clifford_t_decomposition`` transform is incompatible with program capture.
    For compatibility with :func:`~.qjit`, either turn off program capture with ``qp.capture.disable()``
    or use :func:`~.transforms.decompose` with a Clifford+T ``gate_set`` in tandem with
    :func:`~.transforms.gridnsynth` .

Args:
    tape (QNode or QuantumTape or Callable): The quantum circuit to be decomposed.
    epsilon (float): The maximum permissible operator norm error of the complete circuit decomposition. Defaults to ``0.0001``.
    method (str): Method to be used for Clifford+T decomposition. Default value is ``"gridsynth"`` for the Ross-Selinger algorithm.
        Alternatively, use the value ``"sk"`` for the Solovay-Kitaev algorithm.
    cache_size (int): The size of the cache built for the decomposition function based on the angle. Defaults to ``1000``.
    cache_eps_rtol (Optional[float]): The relative tolerance for ``epsilon`` values between which the cache may be reused.
        Defaults to ``None``, which means that a cached decomposition will be used if it is `at least as precise` as the requested error.
    **method_kwargs: Keyword argument to pass options for the ``method`` used for decompositions.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]: The transformed circuit as described
    in the :func:`qp.transform <pennylane.transform>`.

**Keyword Arguments**

- Ross-Selinger (``gridsynth``) decomposition --
    **max_search_trials** (int), **max_factoring_trials** (int) -- arguments for the ``"gridsynth"`` method,
    where the decomposition is performed using the :func:`~.rs_decomposition` method.

- Solovay-Kitaev decomposition --
    **max_depth** (int), **basis_set** (list[str]), **basis_length** (int) -- arguments for the ``"sk"`` method,
    where the decomposition is performed using the :func:`~.sk_decomposition` method.

Raises:
    ValueError: If a gate operation does not have a decomposition when required.
    NotImplementedError: If chosen decomposition ``method`` is not supported.

.. seealso:: :func:`~.rs_decomposition` and :func:`~.sk_decomposition` for the Ross-Selinger and Solovay-Kitaev decomposition methods, respectively.

**Example**

.. code-block:: python

    @qp.qnode(qp.device("default.qubit"))
    def circuit(x, y):
        qp.RX(x, 0)
        qp.CNOT([0, 1])
        qp.RY(y, 0)
        return qp.expval(qp.Z(0))

    x, y = 1.1, 2.2
    decomposed_circuit = qp.transforms.clifford_t_decomposition(circuit)
    result = circuit(x, y)
    approx = decomposed_circuit(x, y)

>>> result
np.float64(-0.2669...)
>>> approx
np.float64(-0.26...)
>>> qp.math.allclose(result, approx, atol=1e-2)
True
