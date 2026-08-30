---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/vibrational/christiansen_utils.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/vibrational/christiansen_utils.py
license: Apache-2.0
---

## Module `pennylane/qchem/vibrational/christiansen_utils.py`

Utility functions related to the construction of the taylor form Hamiltonian.

## `christiansen_integrals`

```python
def christiansen_integrals(pes, n_states=16, cubic=False, num_workers=1, backend='serial')
```

Computes Christiansen vibrational Hamiltonian integrals.

The Christiansen vibrational Hamiltonian is defined based on Eqs. D4-D7 of
`arXiv:2504.10602 <https://arxiv.org/abs/2504.10602>`_ as:

.. math::

    H = \sum_{i}^M \sum_{k_i, l_i}^{N_i} C_{k_i, l_i}^{(i)} b_{k_i}^{\dagger} b_{l_i} +
    \sum_{i<j}^{M} \sum_{k_i,l_i}^{N_i} \sum_{k_j,l_j}^{N_j} C_{k_i k_j, l_i l_j}^{(i,j)}
    b_{k_i}^{\dagger} b_{k_j}^{\dagger} b_{l_i} b_{l_j},

where :math:`b^{\dagger}` and :math:`b` are the creation and annihilation
operators, :math:`M` represents the number of normal modes and :math:`N` is the number of
modals. The coefficients :math:`C` represent the one-mode and two-mode integrals defined as

.. math::

    C_{k_i, l_i}^{(i)} = \int \phi_i^{k_i}(Q_i) \left( T(Q_i) +
    V_1^{(i)}(Q_i) \right) \phi_i^{h_i}(Q_i),

and

.. math::

    C_{k_i, k_j, l_i, l_j}^{(i,j)} = \int \int \phi_i^{k_i}(Q_i) \phi_j^{k_j}(Q_j)
    V_2^{(i,j)}(Q_i, Q_j) \phi_i^{l_i}(Q_i) \phi_j^{l_j}(Q_j) \; \text{d} Q_i \text{d} Q_j,

where :math:`\phi` represents a modal, :math:`Q` represents a normal coordinate, :math:`T`
represents  the kinetic energy operator and :math:`V` represents the potential energy operator
obtained from the expansion

.. math::

    V({Q}) = \sum_i V_1(Q_i) + \sum_{i>j} V_2(Q_i,Q_j) + ....

Similarly, the three-mode integrals can be obtained
following Eq. D7 of `arXiv:2504.10602 <https://arxiv.org/abs/2504.10602>`_.

This function computes the coefficients :math:`C` efficiently by using the
`Gauss-Hermite quadrature <https://en.wikipedia.org/wiki/Gauss%E2%80%93Hermite_quadrature>`_,
which expresses the integral as

.. math::

    \sum_{p=1}^{P} w_p f(x_p),

where :math:`P` is the degree of the quadrature with associated weights :math:`w` and quadrature
points :math:`x` obtained from the potential energy data along the normal modes. The function
:math:`f(x)` represents the potential energy surface here.

Args:
    pes(VibrationalPES): object containing the vibrational potential energy surface data
    n_states(int): maximum number of bosonic states per mode
    cubic(bool): Whether to include three-mode integrals. Default is ``False``.
    num_workers (int): the number of concurrent units used for the computation. Default value is
        set to 1.
    backend (string): the executor backend from the list of supported backends. Available
        options are ``mp_pool``, ``cf_procpool``, ``cf_threadpool``, ``serial``,
        ``mpi4py_pool``, ``mpi4py_comm``. Default value is set to ``serial``. See Usage Details
        for more information.

Returns:
    List[TensorLike[float]]: the one-mode and two-mode integrals for the Christiansen Hamiltonian

.. note::

    This function requires the ``h5py`` package to be installed.
    It can be installed with ``pip install h5py``.

**Example**

>>> symbols  = ['H', 'F']
>>> geometry = np.array([[0.0, 0.0, -0.40277116], [0.0, 0.0, 1.40277116]])
>>> mol = qp.qchem.Molecule(symbols, geometry)
>>> pes = qp.qchem.vibrational_pes(mol, optimize=False)
>>> integrals = qp.qchem.vibrational.christiansen_integrals(pes,n_states=4)
>>> print(integrals[0])
[[[0.0103548  0.0019394  0.00046436 0.0016381 ]
  [0.0019394  0.03139978 0.00558    0.00137586]
  [0.00046436 0.00558    0.05314478 0.01047909]
  [0.0016381  0.00137586 0.01047909 0.07565063]]]

.. details::
    :title: Usage Details

    The ``backend`` options allow to run calculations using multiple threads or multiple
    processes.

    * ``serial``: This executor wraps Python standard library calls without support for
      multithreaded or multiprocess execution. Any calls to external libraries that utilize
      threads, such as BLAS through numpy, can still use multithreaded calls at that layer.

    * ``mp_pool``: This executor wraps Python standard library `multiprocessing.Pool <https://docs.python.org/3/library/multiprocessing.html#module-multiprocessing.pool>`_
      interface, and provides support for execution using multiple processes.

    * ``cf_procpool``: This executor wraps Python standard library `concurrent.futures.ProcessPoolExecutor <https://docs.python.org/3/library/concurrent.futures.html#processpoolexecutor>`_
      interface, and provides support for execution using multiple processes.

    * ``cf_threadpool``: This executor wraps Python standard library `concurrent.futures.ThreadPoolExecutor <https://docs.python.org/3/library/concurrent.futures.html#threadpoolexecutor>`_
      interface, and provides support for execution using multiple threads. The threading
      executor may not provide execution speed-ups for tasks when using a GIL-enabled Python.

    * ``mpi4py_pool``: This executor wraps the `mpi4py.futures.MPIPoolExecutor <https://mpi4py.readthedocs.io/en/stable/mpi4py.futures.html#mpipoolexecutor>`_
      class, and provides support for execution using multiple processes launched using MPI.

    * ``mpi4py_comm``: This executor wraps the `mpi4py.futures.MPICommExecutor <https://mpi4py.readthedocs.io/en/stable/mpi4py.futures.html#mpicommexecutor>`_
      class, and provides support for execution using multiple processes launched using MPI.

## `christiansen_integrals_dipole`

```python
def christiansen_integrals_dipole(pes, n_states=16, num_workers=1, backend='serial')
```

Computes Christiansen vibrational dipole integrals.

The Christiansen dipole operator is constructed similar to the vibrational Hamiltonian operator
defined in Eqs. D4-D7 of `arXiv:2504.10602 <https://arxiv.org/abs/2504.10602>`_. The dipole
operator is defined as

.. math::

    \mu = \sum_{i}^M \sum_{k_i, l_i}^{N_i} C_{k_i, l_i}^{(i)} b_{k_i}^{\dagger} b_{l_i} +
    \sum_{i<j}^{M} \sum_{k_i,l_i}^{N_i} \sum_{k_j,l_j}^{N_j} C_{k_i k_j, l_i l_j}^{(i,j)}
    b_{k_i}^{\dagger} b_{k_j}^{\dagger} b_{l_i} b_{l_j},


where :math:`b^{\dagger}` and :math:`b` are the creation and annihilation
operators, :math:`M` represents the number of normal modes and :math:`N` is the number of
modals. The coefficients :math:`C` represent the one-mode and two-mode integrals defined as

.. math::

    C_{k_i, l_i}^{(i)} = \int \phi_i^{k_i}(Q_i) \left( D_1^{(i)}(Q_i) \right) \phi_i^{h_i}(Q_i),

and

.. math::

    C_{k_i, k_j, l_i, l_j}^{(i,j)} = \int \int \phi_i^{k_i}(Q_i) \phi_j^{k_j}(Q_j)
    D_2^{(i,j)}(Q_i, Q_j) \phi_i^{l_i}(Q_i) \phi_j^{l_j}(Q_j) \; \text{d} Q_i \text{d} Q_j,

where :math:`\phi` represents a modal, :math:`Q` represents a normal coordinate and :math:`D`
represents the dipole function obtained from the expansion

.. math::

    D({Q}) = \sum_i D_1(Q_i) + \sum_{i>j} D_2(Q_i,Q_j) + ....

Similarly, the three-mode integrals can be obtained
following Eq. D7 of `arXiv:2504.10602 <https://arxiv.org/abs/2504.10602>`_.

Args:
    pes(VibrationalPES): object containing the vibrational potential energy surface data
    n_states(int): maximum number of bosonic states per mode
    num_workers (int): the number of concurrent units used for the computation. Default value is
        set to 1.
    backend (string): the executor backend from the list of supported backends. Available
        options are ``mp_pool``, ``cf_procpool``, ``cf_threadpool``, ``serial``,
        ``mpi4py_pool``, ``mpi4py_comm``. Default value is set to ``serial``. See Usage Details
        for more information.

Returns:
    List[TensorLike[float]]: the integrals for the Christiansen dipole operator

.. note::

    This function requires the ``h5py`` package to be installed.
    It can be installed with ``pip install h5py``.

**Example**

>>> symbols  = ['H', 'F']
>>> geometry = np.array([[0.0, 0.0, -0.40277116], [0.0, 0.0, 1.40277116]])
>>> mol = qp.qchem.Molecule(symbols, geometry)
>>> pes = qp.qchem.vibrational_pes(mol, optimize = False, dipole_level = 3, cubic=True)
>>> integrals = qp.qchem.vibrational.christiansen_integrals_dipole(pes, n_states = 2)
>>> print(integrals[0][2])
[[[-0.00074107 -0.02287269]
[-0.02287269 -0.00216419]]]

.. details::
    :title: Usage Details

    The ``backend`` options allow to run calculations using multiple threads or multiple
    processes.

    * ``serial``: This executor wraps Python standard library calls without support for
      multithreaded or multiprocess execution. Any calls to external libraries that utilize
      threads, such as BLAS through numpy, can still use multithreaded calls at that layer.

    * ``mp_pool``: This executor wraps Python standard library `multiprocessing.Pool <https://docs.python.org/3/library/multiprocessing.html#module-multiprocessing.pool>`_
      interface, and provides support for execution using multiple processes.

    * ``cf_procpool``: This executor wraps Python standard library `concurrent.futures.ProcessPoolExecutor <https://docs.python.org/3/library/concurrent.futures.html#processpoolexecutor>`_
      interface, and provides support for execution using multiple processes.

    * ``cf_threadpool``: This executor wraps Python standard library `concurrent.futures.ThreadPoolExecutor <https://docs.python.org/3/library/concurrent.futures.html#threadpoolexecutor>`_
      interface, and provides support for execution using multiple threads. The threading
      executor may not provide execution speed-ups for tasks when using a GIL-enabled Python.

    * ``mpi4py_pool``: This executor wraps the `mpi4py.futures.MPIPoolExecutor <https://mpi4py.readthedocs.io/en/stable/mpi4py.futures.html#mpipoolexecutor>`_
      class, and provides support for execution using multiple processes launched using MPI.

    * ``mpi4py_comm``: This executor wraps the `mpi4py.futures.MPICommExecutor <https://mpi4py.readthedocs.io/en/stable/mpi4py.futures.html#mpicommexecutor>`_
      class, and provides support for execution using multiple processes launched using MPI.
