---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/dla/recursive_cartan_decomp.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/dla/recursive_cartan_decomp.py
license: Apache-2.0
---

## Module `pennylane/labs/dla/recursive_cartan_decomp.py`

Functionality for Cartan decomposition

## `recursive_cartan_decomp`

```python
def recursive_cartan_decomp(g, chain, validate=True, verbose=True)
```

Apply a recursive Cartan decomposition specified by a chain of decomposition types.
The decompositions will use canonical involutions and hardcoded basis transformations
between them in order to obtain a valid recursion.

This function tries to make sure that only sensible involution sequences are applied,
and to raise an error otherwise. However, the involutions still need to be configured
properly, regarding the wires their conjugation operators act on.

Args:
    g (tensor_like): Basis of the algebra to be decomposed.
    chain (Iterable[Callable]): Sequence of involutions. Each callable should be
        one of
        :func:`~.pennylane.liealg.A`,
        :func:`~.pennylane.liealg.AI`,
        :func:`~.pennylane.liealg.AII`,
        :func:`~.pennylane.liealg.AIII`,
        :func:`~.pennylane.liealg.BD`,
        :func:`~.pennylane.liealg.BDI`,
        :func:`~.pennylane.liealg.DIII`,
        :func:`~.pennylane.liealg.C`,
        :func:`~.pennylane.liealg.CI`,
        :func:`~.pennylane.liealg.CII`,
        or a partial evolution thereof.
    validate (bool): Whether or not to verify that the involutions return a subalgebra.
    verbose (bool): Whether or not to print status updates during the computation.

Returns:
    dict: The decompositions at each level. The keys are (zero-based) integers for the
    different levels of the recursion, the values are tuples ``(k, m)`` with subalgebra
    ``k`` and horizontal space ``m``. For each level, ``k`` and ``m`` combine into
    ``k`` from the previous recursion level.

**Examples**

Let's set up the special unitary algebra on 2 qubits. Note that we are using the Hermitian
matrices that correspond to the skew-Hermitian algebra elements via multiplication
by :math:`i`. Also note that :func:`~.pauli.pauli_group` returns the identity as the first
element, which is not part of the special unitary algebra of traceless matrices.

>>> g = [qp.matrix(op, wire_order=range(2)) for op in qp.pauli.pauli_group(2)] # u(4)
>>> g = g[1:] # Remove identity: u(4) -> su(4)

Now we can apply Cartan decompositions of type AI and DIII in sequence:

>>> from pennylane.labs.dla import recursive_cartan_decomp
>>> from pennylane.liealg import AI, DIII
>>> chain = [AI, DIII]
>>> decompositions = recursive_cartan_decomp(g, chain)
Iteration 0:   15 -----AI---->    6,   9
Iteration 1:    6 ----DIII--->    4,   2

The function prints the progress of the decompositions by default, which can be deactivated by
setting ``verbose=False``. Here we see how the initial :math:`\mathfrak{g}=\mathfrak{su(4)}`
was decomposed by AI into the six-dimensional :math:`\mathfrak{k}_1=\mathfrak{so(4)}` and a
horizontal space of dimension nine. Then, :math:`\mathfrak{k}_1` was further decomposed
by the DIII decomposition into the four-dimensional :math:`\mathfrak{k}_2=\mathfrak{u}(2)`
and a two-dimensional horizontal space.

In a more elaborate example, let's apply a chain of decompositions AII, CI, AI, BDI, and DIII
to the four-qubit unitary algebra. While we took care of the global phase term of :math:`u(4)`
explicitly above, we leave it in the algebra here, and see that it does not cause problems.
We discuss the ``wire`` keyword argument below.

>>> from pennylane.liealg import AII, CI, BD, BDI
>>> from functools import partial
>>> chain = [
...     AII,
...     CI,
...     AI,
...     partial(BDI, wire=1),
...     partial(BD, wire=1),
...     partial(DIII, wire=2),
... ]
>>> g = [qp.matrix(op, wire_order=range(4)) for op in qp.pauli.pauli_group(4)] # u(16)
>>> decompositions = recursive_cartan_decomp(g, chain)
Iteration 0:  256 ---AII--->  136, 120
Iteration 1:  136 ----CI--->   64,  72
Iteration 2:   64 ----AI--->   28,  36
Iteration 3:   28 ---BDI--->   12,  16
Iteration 4:   12 ----BD--->    6,   6
Iteration 5:    6 ---DIII-->    4,   2

The obtained chain of algebras is

.. math::

    \mathfrak{u}(16)
    \rightarrow \mathfrak{sp}(8)
    \rightarrow \mathfrak{u}(8)
    \rightarrow \mathfrak{so}(8)
    \rightarrow \mathfrak{so}(4) \oplus \mathfrak{so}(4)
    \rightarrow \mathfrak{so}(4)
    \rightarrow \mathfrak{u}(2).

What about the wire keyword argument to the used involutions?
A good rule of thumb is that it should start at ``0`` and increment by one every second
involution. For the involution :func:`~.pennylane.liealg.CI` it should additionally be
increased by one. As ``0`` is the default for ``wire``, it usually does not have to be
provided explicitly for the first two involutions, unless ``CI`` is among them.

.. note::

    A typical effect of setting the wire wrongly is that the decomposition does not
    split the subalgebra from the previous step but keeps it intact and returns a
    zero-dimensional horizontal space. For example:

    >>> g = [qp.matrix(op, wire_order=range(2)) for op in qp.pauli.pauli_group(2)] # u(4)
    >>> chain = [AI, DIII, AII]
    >>> decompositions = recursive_cartan_decomp(g, chain)
    Iteration 0:   16 -----AI---->    6,  10
    Iteration 1:    6 ----DIII--->    4,   2
    Iteration 2:    4 ----AII---->    4,   0

    We see that the ``AII`` decomposition did not further decompose :math:`\mathfrak{u}(2)`.
    It works if we provide the correct ``wire`` argument:

    >>> chain = [AI, DIII, partial(AII, wire=1)]
    >>> decompositions = recursive_cartan_decomp(g, chain)
    Iteration 0:   16 -----AI---->    6,  10
    Iteration 1:    6 ----DIII--->    4,   2
    Iteration 2:    4 ----AII---->    3,   1

    We obtain :math:`\mathfrak{sp}(1)` as expected from the decomposition of type AII.
