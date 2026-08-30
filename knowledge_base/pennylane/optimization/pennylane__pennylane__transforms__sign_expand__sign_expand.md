---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/sign_expand/sign_expand.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/sign_expand/sign_expand.py
license: Apache-2.0
---

## Module `pennylane/transforms/sign_expand/sign_expand.py`

Contains the sign (and xi) decomposition tape transform, implementation of ideas from arXiv:2207.09479

## `controlled_pauli_evolution`

```python
def controlled_pauli_evolution(theta, wires, pauli_word, controls)
```

Controlled Evolution under generic Pauli words, adapted from the decomposition of
qp.PauliRot to suit our needs


Args:
    theta (float): rotation angle :math:`\theta`
    pauli_word (string): the Pauli word defining the rotation
    wires (Iterable, Wires): the wires the operation acts on
    controls (List[control1, control2]): The two additional controls to implement the
      Hadamard test and the quantum signal processing part on

Returns:
    list[Operator]: decomposition that make up the controlled evolution

## `evolve_under`

```python
def evolve_under(ops, coeffs, time, controls)
```

Evolves under the given Hamiltonian deconstructed into its Pauli words

Args:
    ops (List[Operator): List of Pauli words that comprise the Hamiltonian
    coeffs (List[int]): List of the respective coefficients of the Pauliwords of the Hamiltonian
    time (float): At what time to evaluate these Pauliwords

## `calculate_xi_decomposition`

```python
def calculate_xi_decomposition(hamiltonian)
```

Calculates the Xi-decomposition from the given Hamiltonian by constructing the sparse matrix
representing the Hamiltonian, finding its spectrum and then construct projectors and
eigenvalue spacings

Definition of the Xi decomposition of operator O:

.. math::
    \frac{\lambda_0 +\lambda_J}{2} \mathbb{1} + \sum_{x=1}^{J-1} \frac{\delta \lambda_x}{2}\Xi_x ,

where the lambdas are the sorted eigenvalues of O and

..math::
   \Xi_x = \mathbb{1} - \sum_(j<x) 2 \Pi_j \,, \quad \delta \lambda_x = \lambda_x - \lambda_{x-1}


Args:
  hamiltonian (qp.Hamiltonian): The pennylane Hamiltonian to be decomposed

Returns:
  dEs (List[float]): The energy (E_1-E-2)/2 separating the two eigenvalues of the spectrum
  mus (List[float]): The average between the two eigenvalues (E_1+E-2)/2
  times (List[float]): The time for this term group to be evaluated/evolved at
  projs (List[np.array]): The analytical observables associated with these groups,
   to be measured by qp.Hermitian

## `construct_sgn_circuit`

```python
def construct_sgn_circuit(hamiltonian, tape, mus, times, phis, controls)
```

Takes a tape with state prep and ansatz and constructs the individual tapes
approximating/estimating the individual terms of your decomposition

Args:
  hamiltonian (qp.Hamiltonian): The pennylane Hamiltonian to be decomposed
  tape (qp.QuantumTape: Tape containing the circuit to be expanded into the new circuits
  mus (List[float]): The average between the two eigenvalues (E_1+E-2)/2
  times (List[float]): The time for this term group to be evaluated/evolved at
  phis (List[float]): Optimal phi values for the QSP part associated with the respective
    delta and J
  controls (List[control1, control2]): The two additional controls to implement the
      Hadamard test and the quantum signal processing part on

Returns:
  tapes (List[qp.tape]): Expanded tapes from the original tape that measures the terms
    via the approximate sgn decomposition

## `sign_expand`

```python
def sign_expand(tape: QuantumScript, circuit=False, J=10, delta=0.0, controls=('Hadamard', 'Target')) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Splits a tape measuring a (fast-forwardable) Hamiltonian expectation into mutliple tapes of
the Xi or sgn decomposition, and provides a function to recombine the results.

Implementation of ideas from arXiv:2207.09479

For the calculation of variances, one assumes an even distribution of shots among the groups.

Args:
    tape (QNode or QuantumTape): the quantum circuit used when calculating the expectation value of the Hamiltonian
    circuit (bool): Toggle the calculation of the analytical Xi decomposition or if True
      constructs the circuits of the approximate sign decomposition to measure the expectation
      value
    J (int): The times the time evolution of the hamiltonian is repeated in the quantum signal
      processing approximation of the sgn-decomposition
    delta (float): The minimal
    controls (List[control1, control2]): The two additional controls to implement the
      Hadamard test and the quantum signal processing part on, have to be wires on the device

Returns:
    qnode (pennylane.QNode) or tuple[List[.QuantumTape], function]: The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

**Example**

Given a Hamiltonian,

.. code-block:: python

    H = qp.Z(0) + 0.5 * qp.Z(2) + qp.Z(1)

a device with auxiliary qubits,

.. code-block:: python

    dev = qp.device("default.qubit", wires=[0,1,2,'Hadamard','Target'])

and a circuit of the form, with the transform as decorator.

.. code-block:: python

    @qp.transforms.sign_expand
    @qp.qnode(dev)
    def circuit():
        qp.Hadamard(wires=0)
        qp.CNOT(wires=[0, 1])
        qp.X(2)
        return qp.expval(H)

>>> circuit()
np.float64(-0.499...)

You can also work directly on tapes:

.. code-block:: python

    operations = [qp.Hadamard(wires=0), qp.CNOT(wires=[0, 1]), qp.X(2)]
    measurements = [qp.expval(H)]
    tape = qp.tape.QuantumTape(operations, measurements)

We can use the ``sign_expand`` transform to generate new tapes and a classical
post-processing function for computing the expectation value of the Hamiltonian in these new decompositions

>>> tapes, fn = qp.transforms.sign_expand(tape)

We can evaluate these tapes on a device, it needs two additional auxiliary gates labeled 'Hadamard' and 'Target' if
one wants to make the circuit approximation of the decomposition:

>>> dev = qp.device("default.qubit", wires=[0,1,2,'Hadamard','Target'])
>>> res = dev.execute(tapes)
>>> fn(res)
np.float64(-0.499...)

To evaluate the circuit approximation of the decomposition one can construct the sgn-decomposition by changing the
kwarg circuit to True:

>>> tapes, fn = qp.transforms.sign_expand(tape, circuit=True, J=20, delta=0)
>>> dev = qp.device("default.qubit", wires=[0,1,2,'Hadamard','Target'])
>>> dev.execute(tapes)
(np.float64(0.017...), np.float64(0.006...), np.float64(-0.0009...), np.float64(0.0023...), np.float64(-0.977...))
>>> fn(res)
np.float64(-0.249...)


Lastly, as the paper is about minimizing variance, one can also calculate the variance of the estimator by
changing the tape:


.. code-block:: python

    operations = [qp.Hadamard(wires=0), qp.CNOT(wires=[0, 1]), qp.X(2)]
    measurements = [qp.var(H)]
    tape = qp.tape.QuantumTape(operations, measurements)

>>> tapes, fn = qp.transforms.sign_expand(tape, circuit=True, J=20, delta=0)
>>> dev = qp.device("default.qubit", wires=[0,1,2,'Hadamard','Target'])
>>> res = dev.execute(tapes)
>>> fn(res)
np.float64(10.108...)
