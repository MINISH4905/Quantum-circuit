---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/qubitization.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/qubitization.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/qubitization.py`

This submodule contains the template for Qubitization.

## `Qubitization`

```python
class Qubitization(Operation)
```

Applies the `Qubitization <https://arxiv.org/abs/2204.11890>`__ operator.

This operator encodes a Hamiltonian, written as a linear combination of unitaries, into a unitary operator.
It is implemented with a quantum walk operator that takes a Hamiltonian as input and generates:

.. math::
    Q =  \text{Prep}_{\mathcal{H}}^{\dagger} \text{Sel}_{\mathcal{H}} \text{Prep}_{\mathcal{H}}(2|0\rangle\langle 0| - I).



.. seealso:: :class:`~.AmplitudeEmbedding` and :class:`~.Select`.

Args:
    hamiltonian (Union[.Hamiltonian, .Sum, .Prod, .SProd, .LinearCombination]): The Hamiltonian written as a linear combination of unitaries.
    control (Iterable[Any], Wires): The control qubits for the Qubitization operator.

**Example**

This operator, when applied in conjunction with QPE, allows computing the eigenvalue of an eigenvector of the Hamiltonian.

.. code-block:: python

    H = qp.dot([0.1, 0.3, -0.3], [qp.Z(0), qp.Z(1), qp.Z(0) @ qp.Z(2)])

    @qp.qnode(qp.device("default.qubit"))
    def circuit():

        # initiate the eigenvector
        qp.PauliX(2)

        # apply QPE
        measurements = qp.iterative_qpe(
            qp.Qubitization(H, control = [3,4]), aux_wire = 5, iters = 3
        )
        return qp.probs(op = measurements)

    output = circuit()

    # post-processing
    lamb = sum([abs(c) for c in H.terms()[0]])

>>> print("eigenvalue: ", lamb * np.cos(2 * np.pi * (np.argmax(output)) / 8))
eigenvalue: 0.7

### `compute_decomposition`

```python
def compute_decomposition(*_, **kwargs)
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.Qubitization.decomposition`.

Args:
    *params (list): trainable parameters of the operator, as stored in the ``parameters`` attribute
    wires (Iterable[Any], Wires): wires that the operator acts on
    **hyperparams (dict): non-trainable hyperparameters of the operator, as stored in the ``hyperparameters`` attribute

Returns:
    list[Operator]: decomposition of the operator

**Example:**

.. code-block:: python

    import pennylane as qp
    from pennylane.wires import Wires

>>> print(qp.Qubitization.compute_decomposition(hamiltonian=0.1 * qp.Z(0), control=Wires(1)))
[Reflection(3.141592653589793, wires=[1]), PrepSelPrep(lcu=0.1 * Z(0), control=Wires([1]))]
