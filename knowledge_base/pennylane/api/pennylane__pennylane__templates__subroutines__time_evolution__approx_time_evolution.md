---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/time_evolution/approx_time_evolution.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/time_evolution/approx_time_evolution.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/time_evolution/approx_time_evolution.py`

Contains the ApproxTimeEvolution template.

## `ApproxTimeEvolution`

```python
class ApproxTimeEvolution(Operation)
```

Applies the Trotterized time-evolution operator for an arbitrary Hamiltonian, expressed in terms
of Pauli gates.

.. note::

    We recommend using :class:`~.TrotterProduct` as the more general operation for approximate
    matrix exponentiation. One can recover the behaviour of :class:`~.ApproxTimeEvolution` by
    taking the adjoint:

    >>> qp.adjoint(qp.TrotterProduct(hamiltonian, time, order=1, n=n)) # doctest: +SKIP

The general time-evolution operator for a time-independent Hamiltonian is given by

.. math:: U(t) \ = \ e^{-i H t},

for some Hamiltonian of the form:

.. math:: H \ = \ \displaystyle\sum_{j} H_j.

Implementing this unitary with a set of quantum gates is difficult, as the terms :math:`H_j` don't
necessarily commute with one another. However, we are able to exploit the Trotter-Suzuki decomposition formula,

.. math:: e^{A \ + \ B} \ = \ \lim_{n \to \infty} \Big[ e^{A/n} e^{B/n} \Big]^n,

to implement an approximation of the time-evolution operator as

.. math:: U \ \approx \ \displaystyle\prod_{k \ = \ 1}^{n} \displaystyle\prod_{j} e^{-i H_j t / n},

with the approximation becoming better for larger :math:`n`.
The circuit implementing this unitary is of the form:

.. figure:: ../../_static/templates/subroutines/approx_time_evolution.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

It is also important to note that
this decomposition is exact for any value of :math:`n` when each term of the Hamiltonian
commutes with every other term.

.. warning::

    The Trotter-Suzuki decomposition depends on the order of the summed observables. Two mathematically identical :class:`~.LinearCombination` objects may undergo different time evolutions
    due to the order in which those observables are stored.

.. note::

   This template uses the :class:`~.PauliRot` operation in order to implement
   exponentiated terms of the input Hamiltonian. This operation only takes
   terms that are explicitly written in terms of products of Pauli matrices (:class:`~.PauliX`,
   :class:`~.PauliY`, :class:`~.PauliZ`, and :class:`~.Identity`).
   Thus, each term in the Hamiltonian must be expressed this way upon input, or else an error will be raised.

Args:
    hamiltonian (.Hamiltonian): The Hamiltonian defining the
       time-evolution operator.
       The Hamiltonian must be explicitly written
       in terms of products of Pauli gates (:class:`~.PauliX`, :class:`~.PauliY`,
       :class:`~.PauliZ`, and :class:`~.Identity`).
    time (int or float): The time of evolution, namely the parameter :math:`t` in :math:`e^{- i H t}`.
    n (int): The number of Trotter steps used when approximating the time-evolution operator.

.. seealso:: :class:`~.TrotterProduct`.

.. details::
    :title: Usage Details

    The template is used inside a qnode:

    .. code-block:: python

        import pennylane as qp
        from pennylane import ApproxTimeEvolution

        n_wires = 2
        wires = range(n_wires)

        dev = qp.device('default.qubit', wires=n_wires)

        coeffs = [1, 1]
        obs = [qp.X(0), qp.X(1)]
        hamiltonian = qp.Hamiltonian(coeffs, obs)

        @qp.qnode(dev)
        def circuit(time):
            ApproxTimeEvolution(hamiltonian, time, 1)
            return [qp.expval(qp.Z(i)) for i in wires]

    >>> circuit(1)
    [np.float64(-0.416...), np.float64(-0.416...)]

### `compute_decomposition`

```python
def compute_decomposition(*coeffs_and_time, wires, hamiltonian, n)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.ApproxTimeEvolution.decomposition`.

Args:
    *coeffs_and_time (TensorLike): coefficients of the Hamiltonian, appended by the time.
    wires (Any or Iterable[Any]): wires that the operator acts on
    hamiltonian (.Hamiltonian): The Hamiltonian defining the
       time-evolution operator. The Hamiltonian must be explicitly written
       in terms of products of Pauli gates (:class:`~.PauliX`, :class:`~.PauliY`,
       :class:`~.PauliZ`, and :class:`~.Identity`).
    n (int): The number of Trotter steps used when approximating the time-evolution operator.

Returns:
    list[.Operator]: decomposition of the operator


.. code-block:: python

    import pennylane as qp
    from pennylane import ApproxTimeEvolution

    num_qubits = 2

    hamiltonian = qp.Hamiltonian(
        [0.1, 0.2, 0.3], [qp.Z(0) @ qp.Z(1), qp.X(0), qp.X(1)]
    )

    evolution_time = 0.5
    trotter_steps = 1

    coeffs_and_time = [*hamiltonian.coeffs, evolution_time]


>>> ApproxTimeEvolution.compute_decomposition(
...     *coeffs_and_time, wires=range(num_qubits), n=trotter_steps, hamiltonian=hamiltonian
... )
[PauliRot(0.1, ZZ, wires=[0, 1]), PauliRot(0.2, X, wires=[0]), PauliRot(0.3, X, wires=[1])]
