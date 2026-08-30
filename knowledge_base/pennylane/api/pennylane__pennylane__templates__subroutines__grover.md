---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/grover.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/grover.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/grover.py`

Contains the Grover Operation template.

## `GroverOperator`

```python
class GroverOperator(Operation)
```

Performs the Grover Diffusion Operator.

.. math::

    G = 2 |s \rangle \langle s | - I
    = H^{\bigotimes n} \left( 2 |0\rangle \langle 0| - I \right) H^{\bigotimes n}

where :math:`n` is the number of wires, and :math:`|s\rangle` is the uniform superposition:

.. math::

    |s\rangle = H^{\bigotimes n} |0\rangle =  \frac{1}{\sqrt{2^n}} \sum_{i=0}^{2^n-1} | i \rangle.

For this template, the operator is implemented with a layer of Hadamards, a layer of :math:`X`,
followed by a multi-controlled :math:`Z` gate, then another layer of :math:`X` and Hadamards.
This is expressed in a compact form by the circuit below:

.. figure:: ../../_static/templates/subroutines/grover.svg
    :align: center
    :width: 60%
    :target: javascript:void(0);

The open circles on the controlled gate indicate control on 0 instead of 1.
The ``Z`` gates on the last wire result from leveraging the circuit identity :math:`HXH = Z`,
where the last ``H`` gate converts the multi-controlled :math:`Z` gate into a
multi-controlled :math:`X` gate.

Args:
    wires (Union[Wires, Sequence[int], or int]): the wires to apply to
    work_wires (Union[Wires, Sequence[int], or int]): optional auxiliary wires to assist
        in the decomposition of :class:`~.MultiControlledX`.

**Example**

The Grover Diffusion Operator amplifies the magnitude of the basis state with
a negative phase.  For example, if the solution to the search problem is the :math:`|111\rangle`
state, we require an oracle that flips its phase; this could be implemented using a `CCZ` gate:

.. code-block:: python

    n_wires = 3
    wires = list(range(n_wires))

    def oracle():
        qp.Hadamard(wires[-1])
        qp.Toffoli(wires=wires)
        qp.Hadamard(wires[-1])

We can then implement the entire Grover Search Algorithm for ``num_iterations`` iterations by alternating calls to the oracle and the diffusion operator:

.. code-block:: python

    dev = qp.device('default.qubit', wires=wires)

    @qp.qnode(dev)
    def GroverSearch(num_iterations=1):
        for wire in wires:
            qp.Hadamard(wire)

        for _ in range(num_iterations):
            oracle()
            qp.templates.GroverOperator(wires=wires)
        return qp.probs(wires)

>>> GroverSearch(num_iterations=1) # doctest: +SKIP
array([0.0312, 0.0312, 0.0312, 0.0312, 0.0312, 0.0312, 0.0312, 0.7812])
>>> GroverSearch(num_iterations=2) # doctest: +SKIP
array([0.0078, 0.0078, 0.0078, 0.0078, 0.0078, 0.0078, 0.0078, 0.9453])

We can see that the marked :math:`|111\rangle` state has the greatest probability amplitude.

Optimally, the oracle-operator pairing should be repeated :math:`\lceil \frac{\pi}{4}\sqrt{2^{n}} \rceil` times.

### `work_wires`

```python
def work_wires(self)
```

Additional auxiliary wires that can be used in the decomposition of :class:`~.MultiControlledX`.

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike, work_wires: WiresLike, **kwargs)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.GroverOperator.decomposition`.

Args:
    wires (Any or Iterable[Any]): wires that the operator acts on
    work_wires (Any or Iterable[Any]): optional auxiliary wires to assist
        in the decomposition of :class:`~.MultiControlledX`.

Returns:
    list[.Operator]: decomposition of the operator

### `compute_matrix`

```python
def compute_matrix(n_wires, work_wires)
```

Representation of the operator as a canonical matrix in the computational basis
(static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`.GroverOperator.matrix` and :func:`qp.matrix() <pennylane.matrix>`

Args:
    n_wires (int): Number of wires the ``GroverOperator`` acts on
    work_wires (Any or Iterable[Any]): optional auxiliary wires to assist decompositions.
        *Unused argument*.

Returns:
    tensor_like: matrix representation

The Grover diffusion operator is :math:`2|+\rangle\langle +| - \mathbb{I}`.
The first term is an all-ones matrix multiplied with two times the squared
normalization factor of the all-plus state, i.e. all entries of the first term are
:math:`2^{1-N}` for :math:`N` wires.
