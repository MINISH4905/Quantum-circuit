---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/vibrational/pes_generator.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/vibrational/pes_generator.py
license: Apache-2.0
---

## Module `pennylane/qchem/vibrational/pes_generator.py`

This module contains functions to calculate potential energy surfaces
per normal modes on a grid.

## `vibrational_pes`

```python
def vibrational_pes(molecule, n_points=9, method='rhf', optimize=True, localize=True, bins=None, cubic=False, dipole_level=1, num_workers=1, backend='serial')
```

Computes potential energy surfaces along vibrational normal modes.

Args:
    molecule (~qchem.molecule.Molecule): the molecule object
    n_points (int): number of points for computing the potential energy surface. Default value is ``9``.
    method (str): Electronic structure method used to perform geometry optimization.
        Available options are ``"rhf"`` and ``"uhf"`` for restricted and unrestricted
        Hartree-Fock, respectively. Default is ``"rhf"``.
    optimize (bool): if ``True`` perform geometry optimization. Default is ``True``.
    localize (bool): if ``True`` perform normal mode localization. Default is ``False``.
    bins (List[float]): grid of frequencies for grouping normal modes.
        Default is ``None`` which means all frequencies will be grouped in one bin. For
        instance, ``bins = [1300, 2600]`` allows to separately group and localize modes in three
        groups that have frequencies below :math:`1300`, between :math:`1300-2600` and
        above :math:`2600`.
    cubic (bool)): if ``True`` include three-mode couplings. Default is ``False``.
    dipole_level (int): The level up to which dipole moment data are to be calculated. Input
        values can be ``1``, ``2``, or ``3`` for up to one-mode dipole, two-mode dipole and
        three-mode dipole, respectively. Default value is ``1``.
    num_workers (int): the number of concurrent units used for the computation. Default value is
        set to 1.
    backend (string): the executor backend from the list of supported backends. Available
        options are ``mp_pool``, ``cf_procpool``, ``cf_threadpool``, ``serial``,
        ``mpi4py_pool``, ``mpi4py_comm``. Default value is set to ``serial``. See Usage Details
        for more information.

Returns:
   VibrationalPES: the VibrationalPES object

**Example**

>>> symbols  = ['H', 'F']
>>> geometry = np.array([[0.0, 0.0, -0.40277116], [0.0, 0.0, 1.40277116]])
>>> mol = qp.qchem.Molecule(symbols, geometry)
>>> pes = qp.qchem.vibrational_pes(mol, optimize=False)
>>> print(pes.freqs)
[0.02038828]

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
