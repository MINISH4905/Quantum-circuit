---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/measures.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/measures.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/measures.py`

A collection of useful quantum information functions for operators.

## `process_fidelity`

```python
def process_fidelity(channel: Operator | QuantumChannel, target: Operator | QuantumChannel | None=None, require_cp: bool=True, require_tp: bool=True) -> float
```

Return the process fidelity of a noisy quantum channel.


The process fidelity :math:`F_{\text{pro}}(\mathcal{E}, \mathcal{F})`
between two quantum channels :math:`\mathcal{E}, \mathcal{F}` is given by

.. math::
    F_{\text{pro}}(\mathcal{E}, \mathcal{F})
        = F(\rho_{\mathcal{E}}, \rho_{\mathcal{F}})

where :math:`F` is the :func:`~qiskit.quantum_info.state_fidelity`,
:math:`\rho_{\mathcal{E}} = \Lambda_{\mathcal{E}} / d` is the
normalized :class:`~qiskit.quantum_info.Choi` matrix for the channel
:math:`\mathcal{E}`, and :math:`d` is the input dimension of
:math:`\mathcal{E}`.

When the target channel is unitary this is equivalent to

.. math::
    F_{\text{pro}}(\mathcal{E}, U)
        = \frac{Tr[S_U^\dagger S_{\mathcal{E}}]}{d^2}

where :math:`S_{\mathcal{E}}, S_{U}` are the
:class:`~qiskit.quantum_info.SuperOp` matrices for the *input* quantum
channel :math:`\mathcal{E}` and *target* unitary :math:`U` respectively,
and :math:`d` is the input dimension of the channel.

Args:
    channel (Operator or QuantumChannel): input quantum channel.
    target (Operator or QuantumChannel or None): target quantum channel.
        If `None` target is the identity operator [Default: None].
    require_cp (bool): check if input and target channels are
                       completely-positive and if non-CP log warning
                       containing negative eigenvalues of Choi-matrix
                       [Default: True].
    require_tp (bool): check if input and target channels are
                       trace-preserving and if non-TP log warning
                       containing negative eigenvalues of partial
                       Choi-matrix :math:`Tr_{\text{out}}[\mathcal{E}] - I`
                       [Default: True].

Returns:
    float: The process fidelity :math:`F_{\text{pro}}`.

Raises:
    QiskitError: if the channel and target do not have the same dimensions.

## `average_gate_fidelity`

```python
def average_gate_fidelity(channel: QuantumChannel | Operator, target: Operator | None=None, require_cp: bool=True, require_tp: bool=False) -> float
```

Return the average gate fidelity of a noisy quantum channel.

The average gate fidelity :math:`F_{\text{ave}}` is given by

.. math::
    \begin{aligned}
    F_{\text{ave}}(\mathcal{E}, U)
        &= \int d\psi \langle\psi|U^\dagger
            \mathcal{E}(|\psi\rangle\!\langle\psi|)U|\psi\rangle \\
        &= \frac{d F_{\text{pro}}(\mathcal{E}, U) + 1}{d + 1}
    \end{aligned}

where :math:`F_{\text{pro}}(\mathcal{E}, U)` is the
:meth:`~qiskit.quantum_info.process_fidelity` of the input quantum
*channel* :math:`\mathcal{E}` with a *target* unitary :math:`U`, and
:math:`d` is the dimension of the *channel*.

Args:
    channel (QuantumChannel or Operator): noisy quantum channel.
    target (Operator or None): target unitary operator.
        If `None` target is the identity operator [Default: None].
    require_cp (bool): check if input and target channels are
                       completely-positive and if non-CP log warning
                       containing negative eigenvalues of Choi-matrix
                       [Default: True].
    require_tp (bool): check if input and target channels are
                       trace-preserving and if non-TP log warning
                       containing negative eigenvalues of partial
                       Choi-matrix :math:`Tr_{\text{out}}[\mathcal{E}] - I`
                       [Default: True].

Returns:
    float: The average gate fidelity :math:`F_{\text{ave}}`.

Raises:
    QiskitError: if the channel and target do not have the same dimensions,
                 or have different input and output dimensions.

## `gate_error`

```python
def gate_error(channel: QuantumChannel, target: Operator | None=None, require_cp: bool=True, require_tp: bool=False) -> float
```

Return the gate error of a noisy quantum channel.

The gate error :math:`E` is given by the average gate infidelity

.. math::
    E(\mathcal{E}, U) = 1 - F_{\text{ave}}(\mathcal{E}, U)

where :math:`F_{\text{ave}}(\mathcal{E}, U)` is the
:meth:`~qiskit.quantum_info.average_gate_fidelity` of the input
quantum *channel* :math:`\mathcal{E}` with a *target* unitary
:math:`U`.

Args:
    channel (QuantumChannel): noisy quantum channel.
    target (Operator or None): target unitary operator.
        If `None` target is the identity operator [Default: None].
    require_cp (bool): check if input and target channels are
                       completely-positive and if non-CP log warning
                       containing negative eigenvalues of Choi-matrix
                       [Default: True].
    require_tp (bool): check if input and target channels are
                       trace-preserving and if non-TP log warning
                       containing negative eigenvalues of partial
                       Choi-matrix :math:`Tr_{\text{out}}[\mathcal{E}] - I`
                       [Default: True].

Returns:
    float: The average gate error :math:`E`.

Raises:
    QiskitError: if the channel and target do not have the same dimensions,
                 or have different input and output dimensions.

## `diamond_norm`

```python
def diamond_norm(choi: Choi | QuantumChannel, solver: str='SCS', **kwargs) -> float
```

Return the diamond norm of the input quantum channel object.

This function computes the completely-bounded trace-norm (often
referred to as the diamond-norm) of the input quantum channel object
using the semidefinite-program from reference [1].

Args:
    choi(Choi or QuantumChannel): a quantum channel object or
                                  Choi-matrix array.
    solver (str): The solver to use.
    kwargs: optional arguments to pass to CVXPY solver.

Returns:
    float: The completely-bounded trace norm :math:`\|\mathcal{E}\|_{\diamond}`.

Raises:
    QiskitError: if CVXPY package cannot be found.

Additional Information:
    The input to this function is typically *not* a CPTP quantum
    channel, but rather the *difference* between two quantum channels
    :math:`\|\Delta\mathcal{E}\|_\diamond` where
    :math:`\Delta\mathcal{E} = \mathcal{E}_1 - \mathcal{E}_2`.

Reference:
    J. Watrous. "Simpler semidefinite programs for completely bounded
    norms", arXiv:1207.5726 [quant-ph] (2012).

.. note::

    This function requires the optional CVXPY package to be installed.
    Any additional kwargs will be passed to the ``cvxpy.solve``
    function. See the CVXPY documentation for information on available
    SDP solvers.
