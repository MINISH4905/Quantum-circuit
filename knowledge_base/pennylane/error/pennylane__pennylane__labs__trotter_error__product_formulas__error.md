---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/labs/trotter_error/product_formulas/error.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/trotter_error/product_formulas/error.py
license: Apache-2.0
---

## Module `pennylane/labs/trotter_error/product_formulas/error.py`

Functions for retreiving effective error from fragments

## `effective_hamiltonian`

```python
def effective_hamiltonian(product_formula: ProductFormula, fragments: dict[Hashable, Fragment], order: int, timestep: float=1.0, num_workers: int=1, backend: str='serial')
```

Compute the effective Hamiltonian :math:`\hat{H}_{eff} = \hat{H} + \hat{\epsilon}` that
corresponds to a given product formula.

Args:
    product_formula (ProductFormula): A product formula used to approximate the time-evolution
        operator for a Hamiltonian.
    fragments (Dict[Hashable, :class:`~.pennylane.labs.trotter_error.Fragment`): The fragments
        that sum to the Hamiltonian. The keys in the dictionary must match the labels used to
        build the :class:`~.pennylane.labs.trotter_error.ProductFormula` object.
    order (int): The order of the approximatation.
    timestep (float): The timestep for simulation.
    num_workers (int): the number of concurrent units used for the computation. Default value is
        set to 1.
    backend (string): the executor backend from the list of supported backends.
        Available options : "mp_pool", "cf_procpool", "cf_threadpool", "serial", "mpi4py_pool",
        "mpi4py_comm". Default value is set to "serial".

**Example**

>>> import numpy as np
>>> from pennylane.labs.trotter_error.fragments import vibrational_fragments
>>> from pennylane.labs.trotter_error.product_formulas import ProductFormula, effective_hamiltonian
>>>
>>> n_modes = 4
>>> r_state = np.random.RandomState(42)
>>> freqs = r_state.random(4)
>>> taylor_coeffs = [
>>>     np.array(0),
>>>     r_state.random(size=(n_modes, )),
>>>     r_state.random(size=(n_modes, n_modes)),
>>>     r_state.random(size=(n_modes, n_modes, n_modes))
>>> ]
>>>
>>> delta = 0.001
>>> frag_labels = [0, 1, 1, 0]
>>> frag_coeffs = [1/2, 1/2, 1/2, 1/2]
>>>
>>> pf = ProductFormula(frag_labels, coeffs=frag_coeffs)
>>> frags = dict(enumerate(vibrational_fragments(n_modes, freqs, taylor_coeffs)))
>>> type(effective_hamiltonian(pf, frags, order=5, timestep=delta))
<class 'pennylane.labs.trotter_error.realspace.realspace_operator.RealspaceSum'>

## `perturbation_error`

```python
def perturbation_error(product_formula: ProductFormula, fragments: dict[Hashable, Fragment], states: Sequence[AbstractState], max_order: int, timestep: float=1.0, num_workers: int=1, backend: str='serial', parallel_mode: str='state') -> list[float]
```

Computes the perturbation theory error using the effective Hamiltonian :math:`\hat{\epsilon} = \hat{H}_{eff} - \hat{H}` for a  given product formula.


For a state :math:`\left| \psi \right\rangle` the perturbation theory error is given by the expectation value :math:`\left\langle \psi \right| \hat{\epsilon} \left| \psi \right\rangle`.

Args:
    product_formula (ProductFormula): the :class:`~.pennylane.labs.trotter_error.ProductFormula` used to obtain the effective Hamiltonian
    fragments (Sequence[Fragments]): the set of :class:`~.pennylane.labs.trotter_error.Fragment`
        objects to compute the perturbation error from
    states (Sequence[AbstractState]): the states to compute expectation values from
    max_order (float): the maximum commutator order to compute in BCH
    timestep (float): time step for the Trotter error operator.
    num_workers (int): the number of concurrent units used for the computation. Default value is set to 1.
    backend (string): the executor backend from the list of supported backends.
        Available options : "mp_pool", "cf_procpool", "cf_threadpool", "serial", "mpi4py_pool", "mpi4py_comm". Default value is set to "serial".
    parallel_mode (str): the mode of parallelization to use.
        Options are "state" or "commutator".
        "state" parallelizes the computation of expectation values per state,
        while "commutator" parallelizes the application of commutators to each state.
        Default value is set to "state".

Returns:
    List[Dict[int, float]]: the list of dictionaries of expectation values computed from the Trotter error operator and the input states.
        The dictionary is indexed by the commutator orders and its value is the error obtained from the commutators of that order.

**Example**

>>> import numpy as np
>>> from pennylane.labs.trotter_error import HOState, ProductFormula, vibrational_fragments, perturbation_error
>>>
>>> frag_labels = [0, 1, 1, 0]
>>> frag_coeffs = [1/2, 1/2, 1/2, 1/2]
>>> pf = ProductFormula(frag_labels, coeffs=frag_coeffs)
>>>
>>> n_modes = 2
>>> r_state = np.random.RandomState(42)
>>> freqs = r_state.random(n_modes)
>>> taylor_coeffs = [
>>>     np.array(0),
>>>     r_state.random(size=(n_modes, )),
>>>     r_state.random(size=(n_modes, n_modes)),
>>>     r_state.random(size=(n_modes, n_modes, n_modes))
>>> ]
>>> frags = dict(enumerate(vibrational_fragments(n_modes, freqs, taylor_coeffs)))
>>>
>>> gridpoints = 5
>>> state1 = HOState(n_modes, gridpoints, {(0, 0): 1})
>>> state2 = HOState(n_modes, gridpoints, {(1, 1): 1})
>>>
>>> errors = perturbation_error(pf, frags, [state1, state2], max_order=3)
>>> print(errors)
[{3: 0.9189251160920876j}, {3: 4.7977166824268505j}]
