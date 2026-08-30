---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/measurements/probs.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/measurements/probs.py
license: Apache-2.0
---

## Module `pennylane/measurements/probs.py`

This module contains the qp.probs measurement.

## `ProbabilityMP`

```python
class ProbabilityMP(SampleMeasurement, StateMeasurement)
```

Measurement process that computes the probability of each computational basis state.

Please refer to :func:`pennylane.probs` for detailed documentation.

Args:
    obs (Union[.Operator, .MeasurementValue]): The observable that is to be measured
        as part of the measurement process. Not all measurement processes require observables
        (for example ``Probability``); this argument is optional.
    wires (.Wires): The wires the measurement process applies to.
        This can only be specified if an observable was not provided.
    eigvals (array): A flat array representing the eigenvalues of the measurement.
        This can only be specified if an observable was not provided.
    id (str): custom label given to a measurement instance, can be useful for some applications
        where the instance has to be identified

## `probs`

```python
def probs(wires=None, op=None) -> ProbabilityMP
```

Probability of each computational basis state.

This measurement function accepts either a wire specification or
an observable. Passing wires to the function
instructs the QNode to return a flat array containing the
probabilities :math:`|\langle i | \psi \rangle |^2` of measuring
the computational basis state :math:`| i \rangle` given the current
state :math:`| \psi \rangle`.

Marginal probabilities may also be requested by restricting
the wires to a subset of the full system; the size of the
returned array will be ``[2**len(wires)]``.

.. Note::
    If no wires or observable are given, the probability of all wires is returned.

Args:
    wires (Sequence[int] or int): the wire the operation acts on
    op (Operator or MeasurementValue or Sequence[MeasurementValue]): Observable (with a ``diagonalizing_gates``
        attribute) that rotates the computational basis, or a  ``MeasurementValue``
        corresponding to mid-circuit measurements.

Returns:
    ProbabilityMP: Measurement process instance

**Example:**

.. code-block:: python

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit():
        qp.Hadamard(wires=1)
        return qp.probs(wires=[0, 1])

Executing this QNode:

>>> circuit()
array([0.5, 0.5, 0. , 0. ])

The returned array is in lexicographic order, so corresponds
to a :math:`50\%` chance of measuring either :math:`|00\rangle`
or :math:`|01\rangle`.

.. warning::

   ``qp.probs`` is not compatible with :class:`~.Hermitian`. When using
   ``qp.probs`` with a Hermitian observable, the output might be different than
   expected as the lexicographical ordering of eigenvalues is not guaranteed and
   the diagonalizing gates may exist in a degenerate subspace.

**Example:**

The order of the output might be different when using ``qp.Hermitian``, as in the
following example:

.. code-block:: python

    H = 1 / np.sqrt(2) * np.array([[1, 1], [1, -1]])

    @qp.qnode(dev)
    def circuit():
        qp.H(wires=0)
        return qp.probs(op=qp.Hermitian(H, wires=0)), qp.probs(op=qp.Hadamard(wires=0))

>>> circuit()
(array([0.14644661, 0.85355339]), array([0.85355339, 0.14644661]))

**Example:**

The output might also be different than expected when using ``qp.Hermitian``,
because the probability vector can be expressed in the eigenbasis obtained from
diagonalizing the matrix of the observable, as in the following example:

.. code-block:: python

    ob = qp.X(0) @ qp.Y(1)
    h = qp.Hermitian(ob.matrix(), wires=[0, 1])

    @qp.qnode(dev)
    def circuit():
        return qp.probs(op=h), qp.probs(op=ob)

>>> circuit()
(array([0.5, 0. , 0. , 0.5]), array([0.25, 0.25, 0.25, 0.25]))

Both outputs are in the eigenbasis of the observable, but at different locations in a degenerate subspace.  Both
correspond to half in the ``-1`` eigenvalue and half in the ``+1`` eigenvalue.
