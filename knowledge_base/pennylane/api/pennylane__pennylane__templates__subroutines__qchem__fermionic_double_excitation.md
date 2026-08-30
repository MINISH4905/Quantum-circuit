---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/qchem/fermionic_double_excitation.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/qchem/fermionic_double_excitation.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/qchem/fermionic_double_excitation.py`

Contains the FermionicDoubleExcitation template.

## `FermionicDoubleExcitation`

```python
class FermionicDoubleExcitation(Operation)
```

Circuit to exponentiate the tensor product of Pauli matrices representing the
double-excitation operator entering the Unitary Coupled-Cluster Singles
and Doubles (UCCSD) ansatz. UCCSD is a VQE ansatz commonly used to run quantum
chemistry simulations.

The CC double-excitation operator is given by

.. math::

    \hat{U}_{pqrs}(\theta) = \mathrm{exp} \{ \theta (\hat{c}_p^\dagger \hat{c}_q^\dagger
    \hat{c}_r \hat{c}_s - \mathrm{H.c.}) \},

where :math:`\hat{c}` and :math:`\hat{c}^\dagger` are the fermionic annihilation and
creation operators and the indices :math:`r, s` and :math:`p, q` run over the occupied and
unoccupied molecular orbitals, respectively. Using the `Jordan-Wigner transformation
<https://arxiv.org/abs/1208.5986>`_ the fermionic operator defined above can be written
in terms of Pauli matrices (for more details see
`arXiv:1805.04340 <https://arxiv.org/abs/1805.04340>`_):

.. math::

    \hat{U}_{pqrs}(\theta) = \mathrm{exp} \Big\{
    \frac{i\theta}{8} \bigotimes_{b=s+1}^{r-1} \hat{Z}_b \bigotimes_{a=q+1}^{p-1}
    \hat{Z}_a (\hat{X}_s \hat{X}_r \hat{Y}_q \hat{X}_p +
    \hat{Y}_s \hat{X}_r \hat{Y}_q \hat{Y}_p + \hat{X}_s \hat{Y}_r \hat{Y}_q \hat{Y}_p +
    \hat{X}_s \hat{X}_r \hat{X}_q \hat{Y}_p - \mathrm{H.c.}  ) \Big\}

The quantum circuit to exponentiate the tensor product of Pauli matrices entering
the latter equation is shown below (see `arXiv:1805.04340 <https://arxiv.org/abs/1805.04340>`_):

|

.. figure:: ../../_static/templates/subroutines/double_excitation_unitary.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

|

As explained in `Seely et al. (2012) <https://arxiv.org/abs/1208.5986>`_,
the exponential of a tensor product of Pauli-Z operators can be decomposed in terms of
:math:`2(n-1)` CNOT gates and a single-qubit Z-rotation referred to as :math:`U_\theta` in
the figure above. If there are :math:`X` or:math:`Y` Pauli matrices in the product, the
Hadamard (:math:`H`) or :math:`R_x` gate has to be applied to change to the :math:`X`
or :math:`Y` basis, respectively. The latter operations are denoted as
:math:`U_1`, :math:`U_2`, :math:`U_3` and :math:`U_4` in the figure above. See the
Usage Details section for more details.

Args:
    weight (TensorLike): angle :math:`\theta` entering the Z rotation acting on wire ``p``
    wires1 (WiresLike): Wires of the qubits representing the subset of occupied orbitals
        in the interval ``[s, r]``. The first wire is interpreted as ``s``
        and the last wire as ``r``.
        Wires in between are acted on with CNOT gates to compute the parity of the set of qubits.
    wires2 (WiresLike): Wires of the qubits representing the subset of unoccupied
        orbitals in the interval ``[q, p]``. The first wire is interpreted as ``q`` and
        the last wire is interpreted as ``p``. Wires in between are acted on with CNOT gates
        to compute the parity of the set of qubits.

.. details::
    :title: Usage Details

    Notice that:

    #. :math:`\hat{U}_{pqrs}(\theta)` involves eight exponentiations where
       :math:`\hat{U}_1`, :math:`\hat{U}_2`, :math:`\hat{U}_3`, :math:`\hat{U}_4` and
       :math:`\hat{U}_\theta` are defined as follows,

       .. math::

           [U_1, && U_2, U_3, U_4, U_{\theta}] = \\
           && \Bigg\{\bigg[H, H, R_x(-\frac{\pi}{2}), H, R_z(\theta/8)\bigg],
           \bigg[R_x(-\frac{\pi}{2}), H, R_x(-\frac{\pi}{2}), R_x(-\frac{\pi}{2}),
           R_z(\frac{\theta}{8}) \bigg], \\
           && \bigg[H, R_x(-\frac{\pi}{2}), R_x(-\frac{\pi}{2}), R_x(-\frac{\pi}{2}),
           R_z(\frac{\theta}{8}) \bigg], \bigg[H, H, H, R_x(-\frac{\pi}{2}),
           R_z(\frac{\theta}{8}) \bigg], \\
           && \bigg[R_x(-\frac{\pi}{2}), H, H, H, R_z(-\frac{\theta}{8}) \bigg],
           \bigg[H, R_x(-\frac{\pi}{2}), H, H, R_z(-\frac{\theta}{8}) \bigg], \\
           && \bigg[R_x(-\frac{\pi}{2}), R_x(-\frac{\pi}{2}), R_x(-\frac{\pi}{2}),
           H, R_z(-\frac{\theta}{8}) \bigg], \bigg[R_x(-\frac{\pi}{2}), R_x(-\frac{\pi}{2}),
           H, R_x(-\frac{\pi}{2}), R_z(-\frac{\theta}{8}) \bigg] \Bigg\}

    #. For a given quadruple ``[s, r, q, p]`` with :math:`p>q>r>s`, seventy-two single-qubit
       and ``16*(len(wires1)-1 + len(wires2)-1 + 1)`` CNOT operations are applied.
       Consecutive CNOT gates act on qubits with indices between ``s`` and ``r`` and
       ``q`` and ``p`` while a single CNOT acts on wires ``r`` and ``q``. The operations
       performed across these qubits are shown in dashed lines in the figure above.

    An example of how to use this template is shown below:

    .. code-block:: python

        import pennylane as qp

        dev = qp.device('default.qubit', wires=5)

        @qp.qnode(dev)
        def circuit(weight, wires1, wires2):
            qp.FermionicDoubleExcitation(weight, wires1=wires1, wires2=wires2)
            return qp.expval(qp.Z(0))

        weight = 1.34817
        print(circuit(weight, wires1=[0, 1], wires2=[2, 3, 4]))

### `compute_decomposition`

```python
def compute_decomposition(weight, wires, wires1, wires2)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.FermionicDoubleExcitation.decomposition`.

Args:
    weight (float or tensor_like): angle :math:`\theta` entering the Z rotation
    wires (Any or Iterable[Any]): full set of wires that the operator acts on
    wires1 (Iterable): Wires of the qubits representing the subset of occupied orbitals
        in the interval ``[s, r]``.
    wires2 (Iterable): Wires of the qubits representing the subset of unoccupied
        orbitals in the interval ``[q, p]``.

Returns:
    list[.Operator]: decomposition of the operator
