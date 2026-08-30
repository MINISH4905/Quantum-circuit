---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/time_evolution/commuting_evolution.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/time_evolution/commuting_evolution.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/time_evolution/commuting_evolution.py`

Contains the CommutingEvolution template.

## `CommutingEvolution`

```python
class CommutingEvolution(Operation)
```

Applies the time-evolution operator for a Hamiltonian expressed as a linear combination
of mutually commuting Pauli words.

A commuting Hamiltonian is of the form

.. math:: H \ = \ \displaystyle\sum_{j} c_j P_j,

where :math:`P_j` are mutually commutative Pauli words and :math:`c_j` are real coefficients.
The time-evolution under a commuting Hamiltonian is given by a unitary of the form

.. math::

    U(t) \ = \ e^{-i H t} \ = \exp(-i t \displaystyle\sum_j c_j P_j) =
    \displaystyle\prod_j \exp(-i t c_j P_j).

If the Hamiltonian has a small number of unique eigenvalues, partial derivatives of observable
expectation values, i.e.

.. math:: \langle 0 | W(t)^\dagger O W(t) | 0 \rangle,

where :math:`W(t) = V U(t) Y` for some :math:`V` and :math:`Y`, taken with respect to
:math:`t` may be efficiently computed through generalized parameter shift rules. When
initialized, this template will automatically compute the parameter-shift rule if given the
Hamiltonian's eigenvalue frequencies, i.e., the unique positive differences between
eigenvalues.

.. warning::

   This template uses the :class:`~.ApproxTimeEvolution` operation with ``n=1`` in order to
   implement the time evolution, as a single-step Trotterization is exact for a commuting
   Hamiltonian.

   - If the input Hamiltonian contains Pauli words which do not commute, the
     compilation of the time evolution operator to a sequence of gates will
     not equate to the exact propagation under the given Hamiltonian.

   - Furthermore, if the specified frequencies do not correspond to the
     true eigenvalue frequency spectrum of the commuting Hamiltonian,
     computed gradients will be incorrect in general.

Args:
    hamiltonian (.Hamiltonian): The commuting Hamiltonian defining the time-evolution operator.
       The Hamiltonian must be explicitly written
       in terms of products of Pauli gates (:class:`~.PauliX`, :class:`~.PauliY`,
       :class:`~.PauliZ`, and :class:`~.Identity`).
    time (int or float): The time of evolution, namely the parameter :math:`t` in :math:`e^{- i H t}`.

Keyword args:
    frequencies (tuple[int or float]): The unique positive differences between eigenvalues in
        the spectrum of the Hamiltonian. If the frequencies are not given, the cost function
        partial derivative will be computed using the standard two-term shift rule applied to
        the constituent Pauli words in the Hamiltonian individually.

    shifts (tuple[int or float]): The parameter shifts to use in obtaining the
        generalized parameter shift rules. If unspecified, equidistant shifts are used.

.. details::
    :title: Usage Details

    The template is used inside a qnode:

    .. code-block:: python

        import pennylane as qp

        n_wires = 2
        dev = qp.device('default.qubit', wires=n_wires)

        coeffs = [1, -1]
        obs = [qp.X(0) @ qp.Y(1), qp.Y(0) @ qp.X(1)]
        hamiltonian = qp.Hamiltonian(coeffs, obs)
        frequencies = (2, 4)

        @qp.qnode(dev)
        def circuit(time):
            qp.X(0)
            qp.CommutingEvolution(hamiltonian, time, frequencies)
            return qp.expval(qp.Z(0))

    >>> circuit(1)
    np.float64(0.653...)

### `compute_decomposition`

```python
def compute_decomposition(time, *_, wires, hamiltonian, **__)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.

Args:
    *time_and_coeffs (list[tensor_like or float]): list of coefficients of the Hamiltonian, prepended by the time
        variable
    wires (Any or Iterable[Any]): wires that the operator acts on
    hamiltonian (.Hamiltonian): The commuting Hamiltonian defining the time-evolution operator.
    frequencies (tuple[int or float]): The unique positive differences between eigenvalues in
        the spectrum of the Hamiltonian.
    shifts (tuple[int or float]): The parameter shifts to use in obtaining the
        generalized parameter shift rules. If unspecified, equidistant shifts are used.

.. seealso:: :meth:`~.CommutingEvolution.decomposition`.

Returns:
    list[.Operator]: decomposition of the operator
