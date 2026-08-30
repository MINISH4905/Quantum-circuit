---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/unitary/aqc/aqc.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/unitary/aqc/aqc.py
license: Apache-2.0
---

## Module `qiskit/synthesis/unitary/aqc/aqc.py`

A generic implementation of Approximate Quantum Compiler.

## `Minimizer`

```python
class Minimizer(Protocol)
```

Callable Protocol for minimizer.

This interface is based on `SciPy's optimize module
<https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.minimize.html>`__.

 This protocol defines a callable taking the following parameters:

     fun
         The objective function to minimize.
     x0
         The initial point for the optimization.
     jac
         The gradient of the objective function.
     bounds
         Parameters bounds for the optimization. Note that these might not be supported
         by all optimizers.

 and which returns a SciPy minimization result object.

### `__call__`

```python
def __call__(self, fun: Callable[[np.ndarray], float], x0: np.ndarray, jac: Callable[[np.ndarray], np.ndarray] | None=None, bounds: list[tuple[float, float]] | None=None) -> scipy.optimize.OptimizeResult
```

Minimize the objective function.

This interface is based on `SciPy's optimize module <https://docs.scipy.org/doc
/scipy/reference/generated/scipy.optimize.minimize.html>`__.

Args:
    fun: The objective function to minimize.
    x0: The initial point for the optimization.
    jac: The gradient of the objective function.
    bounds: Parameters bounds for the optimization. Note that these might not be supported
        by all optimizers.

Returns:
     The SciPy minimization result object.

## `AQC`

```python
class AQC
```

A generic implementation of the Approximate Quantum Compiler. This implementation is agnostic of
the underlying implementation of the approximate circuit, objective, and optimizer. Users may
pass corresponding implementations of the abstract classes:

* The *optimizer* is an implementation of the :class:`~.Minimizer` protocol, a callable used to run
  the optimization process. The choice of optimizer may affect overall convergence, required time
  for the optimization process and achieved objective value.

* The *approximate circuit* represents a template which parameters we want to optimize.  Currently,
  there's only one implementation based on 4-rotations CNOT unit blocks:
  :class:`.CNOTUnitCircuit`. See the paper for more details.

* The *approximate objective* is tightly coupled with the approximate circuit implementation and
  provides two methods for computing objective function and gradient with respect to approximate
  circuit parameters. This objective is passed to the optimizer. Currently, there are two
  implementations based on 4-rotations CNOT unit blocks: :class:`.DefaultCNOTUnitObjective` and
  its accelerated version :class:`.FastCNOTUnitObjective`. Both implementations share the same
  idea of maximization the Hilbert-Schmidt product between the target matrix and its
  approximation. The former implementation approach should be considered as a baseline one. It
  may suffer from performance issues, and is mostly suitable for a small number of qubits
  (up to 5 or 6), whereas the latter, accelerated one, can be applied to larger problems.

* One should take into consideration the exponential growth of matrix size with the number of
  qubits because the implementation not only creates a potentially large target matrix, but
  also allocates a number of temporary memory buffers comparable in size to the target matrix.

### `__init__`

```python
def __init__(self, optimizer: Minimizer | None=None, seed: int | None=None)
```

Args:
    optimizer: an optimizer to be used in the optimization procedure of the search for
        the best approximate circuit. By default, the scipy minimizer with the
        ``L-BFGS-B`` method is used with max iterations set to 1000.
    seed: a seed value to be used by a random number generator.

### `compile_unitary`

```python
def compile_unitary(self, target_matrix: np.ndarray, approximate_circuit: ApproximateCircuit, approximating_objective: ApproximatingObjective, initial_point: np.ndarray | None=None) -> None
```

Approximately compiles a circuit represented as a unitary matrix by solving an optimization
problem defined by ``approximating_objective`` and using ``approximate_circuit`` as a
template for the approximate circuit.

Args:
    target_matrix: a unitary matrix to approximate.
    approximate_circuit: a template circuit that will be filled with the parameter values
        obtained in the optimization procedure.
    approximating_objective: a definition of the optimization problem.
    initial_point: initial values of angles/parameters to start optimization from.
