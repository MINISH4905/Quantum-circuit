---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/qchem/fermionic_single_excitation.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/qchem/fermionic_single_excitation.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/qchem/fermionic_single_excitation.py`

Contains the FermionicSingleExcitation template.

## `FermionicSingleExcitation`

```python
class FermionicSingleExcitation(Operation)
```

Circuit to exponentiate the tensor product of Pauli matrices representing the
single-excitation operator entering the Unitary Coupled-Cluster Singles
and Doubles (UCCSD) ansatz. UCCSD is a VQE ansatz commonly used to run quantum
chemistry simulations.

The CC single-excitation operator is given by

.. math::

    \hat{U}_{pr}(\theta) = \mathrm{exp} \{ \theta_{pr} (\hat{c}_p^\dagger \hat{c}_r
    -\mathrm{H.c.}) \},

where :math:`\hat{c}` and :math:`\hat{c}^\dagger` are the fermionic annihilation and
creation operators and the indices :math:`r` and :math:`p` run over the occupied and
unoccupied molecular orbitals, respectively. Using the `Jordan-Wigner transformation
<https://arxiv.org/abs/1208.5986>`_ the fermionic operator defined above can be written
in terms of Pauli matrices (for more details see
`arXiv:1805.04340 <https://arxiv.org/abs/1805.04340>`_).

.. math::

    \hat{U}_{pr}(\theta) = \mathrm{exp} \Big\{ \frac{i\theta}{2}
    \bigotimes_{a=r+1}^{p-1}\hat{Z}_a (\hat{Y}_r \hat{X}_p) \Big\}
    \mathrm{exp} \Big\{ -\frac{i\theta}{2}
    \bigotimes_{a=r+1}^{p-1} \hat{Z}_a (\hat{X}_r \hat{Y}_p) \Big\}.

The quantum circuit to exponentiate the tensor product of Pauli matrices entering
the latter equation is shown below (see `arXiv:1805.04340 <https://arxiv.org/abs/1805.04340>`_):

|

.. figure:: ../../_static/templates/subroutines/single_excitation_unitary.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

|

As explained in `Seely et al. (2012) <https://arxiv.org/abs/1208.5986>`_,
the exponential of a tensor product of Pauli-Z operators can be decomposed in terms of
:math:`2(n-1)` CNOT gates and a single-qubit Z-rotation referred to as :math:`U_\theta` in
the figure above. If there are :math:`X` or :math:`Y` Pauli matrices in the product,
the Hadamard (:math:`H`) or :math:`R_x` gate has to be applied to change to the
:math:`X` or :math:`Y` basis, respectively. The latter operations are denoted as
:math:`U_1` and :math:`U_2` in the figure above. See the Usage Details section for more
information.

Args:
    weight (float): angle :math:`\theta` entering the Z rotation acting on wire ``p``
    wires (WiresLike): Wires that the template acts on.
        The wires represent the subset of orbitals in the interval ``[r, p]``. Must be of
        minimum length 2. The first wire is interpreted as ``r`` and the last wire as ``p``.
        Wires in between are acted on with CNOT gates to compute the parity of the set
        of qubits.

.. details::
    :title: Usage Details

    Notice that:

    #. :math:`\hat{U}_{pr}(\theta)` involves two exponentiations where :math:`\hat{U}_1`,
       :math:`\hat{U}_2`, and :math:`\hat{U}_\theta` are defined as follows,

       .. math::
           [U_1, U_2, U_{\theta}] = \Bigg\{\bigg[R_x(-\pi/2), H, R_z(\theta/2)\bigg],
           \bigg[H, R_x(-\frac{\pi}{2}), R_z(-\theta/2) \bigg] \Bigg\}

    #. For a given pair ``[r, p]``, ten single-qubit and ``4*(len(wires)-1)`` CNOT
       operations are applied. Notice also that CNOT gates act only on qubits
       ``wires[1]`` to ``wires[-2]``. The operations performed across these qubits
       are shown in dashed lines in the figure above.

    An example of how to use this template is shown below:

    .. code-block:: python

        import pennylane as qp

        dev = qp.device('default.qubit', wires=3)

        @qp.qnode(dev)
        def circuit(weight, wires=None):
            qp.FermionicSingleExcitation(weight, wires=wires)
            return qp.expval(qp.Z(0))

        weight = 0.56
        print(circuit(weight, wires=[0, 1, 2]))

### `compute_decomposition`

```python
def compute_decomposition(weight, wires)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.FermionicSingleExcitation.decomposition`.

Args:
    weight (float): angle entering the Z rotation
    wires (Any or Iterable[Any]): wires that the operator acts on

Returns:
    list[.Operator]: decomposition of the operator
