---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/optimize/adaptive.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/optimize/adaptive.py
license: Apache-2.0
---

## Module `pennylane/optimize/adaptive.py`

Adaptive optimizer

## `append_gate`

```python
def append_gate(tape: QuantumScript, params, gates) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Append parametrized gates to an existing tape.

Args:
    tape (QuantumTape or QNode or Callable): quantum circuit to transform by adding gates
    params (array[float]): parameters of the gates to be added
    gates (list[Operator]): list of the gates to be added

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]: The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

## `AdaptiveOptimizer`

```python
class AdaptiveOptimizer
```

Optimizer for building fully trained quantum circuits by adding gates adaptively.

Quantum circuits can be built by adding gates
`adaptively <https://www.nature.com/articles/s41467-019-10988-2>`_. The adaptive optimizer
implements an algorithm that grows and optimizes an input quantum circuit by selecting and
adding gates from a user-defined collection of operators. The algorithm starts by adding all
the gates to the circuit and computing the circuit gradients with respect to the gate
parameters. The algorithm then retains the gate which has the largest gradient and optimizes its
parameter. The process of growing the circuit can be repeated until the computed gradients
converge to zero within a given threshold. The optimizer returns the fully trained and
adaptively-built circuit. The adaptive optimizer can be used to implement
algorithms such as `ADAPT-VQE <https://www.nature.com/articles/s41467-019-10988-2>`_.

Args:
    param_steps (int): number of steps for optimizing the parameter of a selected gate (default value: 10).
    stepsize (float): step size for optimizing the parameter of a selected gate (default value: 0.5).

**Example**

This examples shows an implementation of the
`ADAPT-VQE <https://www.nature.com/articles/s41467-019-10988-2>`_ algorithm for building an
adaptive circuit for the :math:`\text{H}_3^+` cation.

>>> import pennylane as qp
>>> from pennylane import numpy as np

The molecule is defined and the Hamiltonian is computed with:

>>> symbols = ["H", "H", "H"]
>>> geometry = np.array([[0.01076341, 0.04449877, 0.0],
...                      [0.98729513, 1.63059094, 0.0],
...                      [1.87262415, -0.00815842, 0.0]], requires_grad=False)
>>> H, qubits = qp.qchem.molecular_hamiltonian(symbols, geometry, charge = 1)

The collection of gates to grow the circuit adaptively contains all single and double
excitations:

>>> n_electrons = 2
>>> singles, doubles = qp.qchem.excitations(n_electrons, qubits)
>>> singles_excitations = [qp.SingleExcitation(0.0, x) for x in singles]
>>> doubles_excitations = [qp.DoubleExcitation(0.0, x) for x in doubles]
>>> operator_pool = doubles_excitations + singles_excitations

An initial circuit preparing the Hartree-Fock state and returning the expectation value of the
Hamiltonian is defined:

>>> hf_state = qp.qchem.hf_state(n_electrons, qubits)
>>> dev = qp.device("default.qubit", wires=qubits)
>>> @qp.qnode(dev)
... def circuit():
...     qp.BasisState(hf_state, wires=range(qubits))
...     return qp.expval(H)

The optimizer is instantiated and then the circuit is created and optimized adaptively:

>>> opt = AdaptiveOptimizer()
>>> for i in range(len(operator_pool)):
...     circuit, energy, gradient = opt.step_and_cost(circuit, operator_pool, drain_pool=True)
...     print('Energy:', energy)
...     print(qp.draw(circuit, show_matrices=False)())
...     print('Largest Gradient:', gradient)
...     print()
...     if gradient < 1e-3:
...         break

.. code-block :: pycon

    Energy: -1.2465499384199699
    0: ─╭|Ψ⟩─╭G²(0.20)─┤ ╭<𝓗>
    1: ─├|Ψ⟩─├G²(0.20)─┤ ├<𝓗>
    2: ─├|Ψ⟩─│─────────┤ ├<𝓗>
    3: ─├|Ψ⟩─│─────────┤ ├<𝓗>
    4: ─├|Ψ⟩─├G²(0.20)─┤ ├<𝓗>
    5: ─╰|Ψ⟩─╰G²(0.20)─┤ ╰<𝓗>
    Largest Gradient: 0.1439987277673651

    Energy: -1.2613740231522532
    0: ─╭|Ψ⟩─╭G²(0.20)─╭G²(0.19)─┤ ╭<𝓗>
    1: ─├|Ψ⟩─├G²(0.20)─├G²(0.19)─┤ ├<𝓗>
    2: ─├|Ψ⟩─│─────────├G²(0.19)─┤ ├<𝓗>
    3: ─├|Ψ⟩─│─────────╰G²(0.19)─┤ ├<𝓗>
    4: ─├|Ψ⟩─├G²(0.20)───────────┤ ├<𝓗>
    5: ─╰|Ψ⟩─╰G²(0.20)───────────┤ ╰<𝓗>
    Largest Gradient: 0.13493495624211427

    Energy: -1.2743971719772815
    0: ─╭|Ψ⟩─╭G²(0.20)─╭G²(0.19)──────────┤ ╭<𝓗>
    1: ─├|Ψ⟩─├G²(0.20)─├G²(0.19)─╭G(0.00)─┤ ├<𝓗>
    2: ─├|Ψ⟩─│─────────├G²(0.19)─│────────┤ ├<𝓗>
    3: ─├|Ψ⟩─│─────────╰G²(0.19)─╰G(0.00)─┤ ├<𝓗>
    4: ─├|Ψ⟩─├G²(0.20)────────────────────┤ ├<𝓗>
    5: ─╰|Ψ⟩─╰G²(0.20)────────────────────┤ ╰<𝓗>
    Largest Gradient: 0.0004084175253678331

### `step`

```python
def step(self, circuit, operator_pool, params_zero=True)
```

Update the circuit with one step of the optimizer.

Args:
    circuit (.QNode): user-defined circuit returning an expectation value
    operator_pool (list[Operator]): list of the gates to be used for adaptive optimization
    params_zero (bool): flag to initiate circuit parameters at zero

Returns:
    .QNode: the optimized circuit

### `step_and_cost`

```python
def step_and_cost(self, circuit, operator_pool, drain_pool=False, params_zero=True)
```

Update the circuit with one step of the optimizer, return the corresponding
objective function value prior to the step, and return the maximum gradient

Args:
    circuit (.QNode): user-defined circuit returning an expectation value
    operator_pool (list[Operator]): list of the gates to be used for adaptive optimization
    drain_pool (bool): flag to remove selected gates from the operator pool
    params_zero (bool): flag to initiate circuit parameters at zero

Returns:
    tuple[.QNode, float, float]: the optimized circuit, the objective function output prior
    to the step, and the largest gradient
