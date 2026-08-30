---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/state_preparations/sum_of_slaters.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/state_preparations/sum_of_slaters.py
license: Apache-2.0
---

## Module `pennylane/templates/state_preparations/sum_of_slaters.py`

Contains the SumOfSlatersPrep template.

## `select_sos_rows`

```python
def select_sos_rows(bits: np.ndarray) -> tuple[list[int], np.ndarray]
```

Select rows of a bit array of differing columns such that the stacked array of the
selected rows still contains differing columns. Also memorizes the row indices of the input
array that were selected.

Args:
    bits (np.ndarray): Bit array with differing columns

Returns:
    tuple[list[int], np.ndarray]: Selected row indices to obtain the reduced bit array,
    and the reduced bit array itself. If ``bits`` had shape ``(n_rows, n_cols)`` and the list
    of row indices has length ``r``, the reduced bit array has shape ``(r, n_cols)``.

.. note::

    This function does not come with an optimality guarantee about the number of selected rows.
    That is, there may be selections of fewer rows that maintain differing columns.

Under the hood, this method is not selecting rows, but instead greedily removes rows from the
input. We first attempt to remove rows with a mean weight far away from 0.5, as they are
generically less likely to differentiate many columns from each other.

**Example**

Let's generate a random bit array of ``D = 8`` differing columns of length ``n = 6``, by first
sampling unique integers from the range ``(0, 2**n)`` and converting them to bitstrings.

>>> np.random.seed(31)
>>> D = 8
>>> n = 6
>>> ids = np.random.choice(2**n, size=D, replace=False)
>>> bitstrings = qp.math.int_to_binary(ids, width=n).T
>>> print(bitstrings)
[[0 0 0 1 0 0 1 0]
 [0 0 0 1 0 1 1 1]
 [0 0 0 0 0 1 0 0]
 [0 1 1 1 1 1 1 1]
 [1 0 0 1 1 1 0 0]
 [0 0 1 1 1 0 1 1]]

Then let's select rows that maintain the uniqueness of the rows:

>>> from pennylane.templates.state_preparations.sum_of_slaters import select_sos_rows
>>> selectors, new_bits = select_sos_rows(bitstrings)
>>> selectors
[0, 1, 4, 5]

Indeed, selecting the indicated rows of ``bitstrings``, we still find
unique columns:

>>> print(new_bits)
[[0 0 0 1 0 0 1 0]
 [0 0 0 1 0 1 1 1]
 [1 0 0 1 1 1 0 0]
 [0 0 1 1 1 0 1 1]]

In general, the number of rows :math:`r` selected by the method will satisfy
:math:`\log_2(n_{\text{col}})\leq r\leq \min(n_{\text{row}}, n_{\text{col}})` if
:math:`(n_{\text{row}}, n_{\text{col}})` is the shape of the input array.

## `compute_sos_encoding`

```python
def compute_sos_encoding(bits)
```

Map :math:`D` different bitstrings of length :math:`r` to :math:`D` different
bitstrings :math:`b` of length :math:`m = \min(r, 2d-1)` where
:math:`d=\lceil\log_2(D)\rceil`. The function computes both the mapping :math:`U` and the
output bitstrings :math:`b`.
This algorithm forms the constructive proof of Lemma 1 in
`Fomichev et al., PRX Quantum 5, 040339 <https://doi.org/10.1103/PRXQuantum.5.040339>`__.
It is the main classical coprocessing step required for the sparse state preparation
(sum-of-Slaters preparation) presented in this paper, enabling its resource efficiency.

Args:
    bits (np.ndarray): Bitstrings of length :math:`r` that are input into Lemma 1. The i-th
        bitstring :math:`v_i` is stored in the :math:`i`-th column, so that for :math:`D`
        bitstrings, the input shape is :math:`(r, D)`.

Returns:
    tuple[np.ndarray]: Two bit arrays. The first is :math:`U`, which maps the input ``bits``
    to :math:`D` distinct bitstrings :math:`\{b_i\}` of length :math:`\min(r, m)`, where
    :math:`m=2\lceil \log_2(D)\rceil-1`. The second array are the bitstrings
    :math:`\{b_i\}` themselves, stored as columns.

.. warning::

    It is recommended to first subselect bits via :func:`~.select_sos_rows` in order to
    work with a reduced input here.
    Furthermore, this function assumes that the bitstrings are not overly redundant, so
    that it might error out if ``select_sos_rows`` is not used.

.. seealso:: :func:`~.select_sos_rows`

**Example**

Consider an array of bits with distinct columns:

>>> bits = np.array([
...     [0, 1, 1, 0, 1, 0, 0],
...     [0, 0, 1, 1, 1, 0, 0],
...     [1, 1, 1, 1, 1, 1, 1],
...     [0, 0, 1, 0, 0, 0, 1],
...     [1, 1, 0, 0, 0, 0, 1],
...     [0, 0, 0, 0, 0, 1, 1],
... ])
>>> from pennylane.templates.state_preparations.sum_of_slaters import (
...     compute_sos_encoding, _columns_differ
... )
>>> print(_columns_differ(bits))
True
>>> print(bits.shape)
(6, 7)

Our goal is to encode these bitstrings as new, distinct bitstrings of length ``m=5``:

>>> D = bits.shape[1]
>>> m = 2 * qp.math.ceil_log2(D) - 1
>>> print(m)
5

We can achieve this with ``compute_sos_encoding``, which computes the encoding matrix ``U``
and the obtained encoded bitstrings ``b``:

>>> U, b = compute_sos_encoding(bits)
>>> print(U)
[[1 0 0 0 0 0]
 [0 1 0 0 0 0]
 [0 0 1 0 0 0]
 [0 0 0 1 0 0]
 [0 0 0 0 1 0]]
>>> print(b)
 [[0 1 1 0 1 0 0]
 [0 0 1 1 1 0 0]
 [1 1 1 1 1 1 1]
 [0 0 1 0 0 0 1]
 [1 1 0 0 0 0 1]]
>>> print(_columns_differ(b))
True

The encoded bitstrings ``b`` are provided for convenience. They can equivalently be computed
from ``U`` and the input ``bits`` via ``(U @ bits) % 2``:

>>> np.array_equal((U @ bits) % 2, b)
True

Note that in this particular example, we could have achieved the reduction simply by selecting
:math:`4<m` rows of the input bits, still obtaining different bitstrings. There is a function
that does just that:

>>> from pennylane.templates.state_preparations.sum_of_slaters import select_sos_rows
>>> select_ids, sub_bits = select_sos_rows(bits)
>>> print(sub_bits)
[[0 1 1 0 1 0 0]
 [0 0 1 1 1 0 0]
 [0 0 1 0 0 0 1]
 [1 1 0 0 0 0 1]]

In practice, this sub-selection of bits via ``select_sos_rows`` is combined with
``compute_sos_encoding`` to achieve lowest cost. Note that there may be edge cases where
``compute_sos_encoding`` errors out if ``select_sos_rows`` is not used before, because
the input bitstrings are too redundant in this case.

.. details::
    :title: Implementation notes

    We are given :math:`D` distinct bitstrings :math:`\{v_i\}` with length :math:`r`.
    We assume :math:`D\geq r` and :math:`\operatorname{rank}(V)\geq r`, which can always
    be achieved by first calling ``select_sos_rows`` on the bitstrings.

    Our goal is to find a linear map :math:`U:\mathbb{Z}_2^{r}\to \mathbb{Z}_2^{m}` from
    the input bitstrings to :math:`D` new distinct bitstrings with length
    :math:`m\leq 2d-1`, where :math:`d:=\lceil\log_2(D)\rceil`, such that

    .. math::

        U(v_i-v_j)\neq 0 \ \ \forall i, j, \quad\text{and}\quad
        U(v_i)\neq 0 \ \ \forall i \quad\text{unless}\quad v_i=0.

    It will be instructive to rewrite this as

    .. math::

        v_i-v_j\not\in \ker U \ \ \forall i, j, \quad\text{and}\quad
        v_i\not\in \ker U \ \ \forall i \quad\text{unless}\quad v_i=0.\qquad(1)

    We will speak of :math:`U` and its matrix representation of zeros and ones interchangeably.
    Since :math:`k` bits can represent at most :math:`2^k` different bitstrings, we know that
    :math:`D` different bitstrings :math:`\{v_i\}` require at least :math:`d` bits to
    be represented, i.e. we know that :math:`r\geq d`. We will proceed in two cases from
    here on, differentiated by :math:`r`.

    **Case 1:** :math:`d\leq r\leq 2d-1`

    In this case, we do not need to do anything; the bitstrings :math:`\{v_i\}` already
    have length :math:`m:=r\leq 2d-1`, so we simply set :math:`U` to be the identity map.
    This scenario may actually occur in practice, and it leads to simplifications of the
    quantum circuit for the state preparation. This depends on the specific bitstrings, though.
    This case is handled directly in the main function of ``compute_sos_encoding``.

    **Case 2:** :math:`2d-1 < r`

    Fix :math:`m=2d-1` and define :math:`t:=r-m` so that :math:`r=m+t`. According to the rank
    theorem, any candidate linear map :math:`U` satisfies :math:`\dim (\mathrm{Im} U) + \dim (\ker U)=r`.
    If we guarantee linear independence of the rows of :math:`U`, we know that
    :math:`\dim (\mathrm{Im} U)` matches the dimensions of the target space, :math:`m`, and thus
    :math:`\dim (\ker U)=r-m=t`.

    Our strategy now will be to find :math:`t` linearly independent vectors :math:`\{w_k\}`
    such that the space :math:`\mathcal{W}:=\operatorname{span}\{w_1, \dots w_t\}` spanned by them satisfies

    .. math::

        v_i-v_j\not\in \mathcal{W} \ \ \forall i, j, \quad\text{and}\quad
        v_i\not\in \mathcal{W} \ \ \forall i \quad\text{unless}\quad v_i=0.\qquad (2)

    and to construct a map :math:`U` with linearly independent rows such that
    :math:`U w_k=0 \ \ \forall k`, i.e. :math:`\mathcal{W}\subset\ker U`. Given that we know the
    kernel dimension to be :math:`t` and :math:`\dim(\mathcal{W})=t`, this will imply
    :math:`\mathcal{W}=\ker U`.

    .. admonition:: Math comment

        To see that this strategy actually ensures :math:`U` to have the
        properties we are after, assume that :math:`U v_i=0` for some :math:`i` with
        :math:`v_i\neq 0` (or :math:`U(v_i-v_j)` for some :math:`(i,j)`). Due to
        :math:`\ker U=\mathcal{W}`, this would imply :math:`v_i\in\mathcal{W}` (or
        :math:`v_i-v_j\in\mathcal{W}`), which is false by construction of the vectors
        :math:`\{w_k\}`, in particular due to Eq. (2).

    The main work thus is to actually construct these vectors :math:`\{w_k\}`
    with the required properties. The construction of the map :math:`U` itself will then be a
    simple linear algebraic task. We perform the construction of the vectors iteratively,
    corresponding to a proof by induction on :math:`t`.

    Given :math:`D` vectors :math:`\{v_i\}` of length :math:`r` with rank :math:`r` (i.e.,
    there are at least :math:`r` linearly independent vectors), our task is to build
    :math:`t=r-(2\lceil \log_2 (D)\rceil -1)` linearly independent vectors :math:`\{w_k\}`
    from the space :math:`\operatorname{span}\{v_i\}` such that the
    resulting vector space :math:`\mathcal{W}=\operatorname{span}\{w_k\}` does not contain the
    :math:`\{v_i\}` or their pairwise differences, see Eq.(2).
    We can again separate two scenarios.

    **Case 2a:** :math:`t=1`

    For this case, there is a particularly simple method: we can brute-force a search of
    :math:`w_1` over :math:`\mathbb{Z}_2^r\setminus (\{v_i\}\cup \{v_i-v_j\})`. This is
    implemented in ``_find_single_w``. See "Computing ``U``" below for the remaining
    thing we need to do in this case.

    **Case 2b:** :math:`t>1`

    If :math:`t>1`, we recursively construct the :math:`\{w_k\}`, which is implemented in
    ``_find_w``.
    We proceed in the following steps, thinking of ordered sets whenever we speak of sets.

    1. First, we select :math:`r` of the input vectors :math:`\mathcal{V}=\{v_i\}` that are
       linearly independent (and thus form a--likely not orthonormal--basis of
       :math:`\mathbb{Z}_2^r`). We relabel the vectors so that this selection of vectors has
       the indices :math:`\{1,\dots, r\}`, i.e. the basis is :math:`\mathcal{B}=\{v_1,\dots,v_r\}`.
       This is implemented in ``qp.math.binary_select_basis``, which returns the basis and
       the remaining columns separately. This step will only ever be executed once.
    2. If :math:`t=1` (which can happen despite :math:`t>1` initially, because we will use
       recursion), go to step 3. Else go to step 4.
    3. Brute-force search a linear combination :math:`w_1` of the basis vectors
       :math:`\mathcal{B}` that is not contained in the set
       :math:`\mathcal{V}\cup(\mathcal{V}-\mathcal{V})\cup \{0\}`, where the set difference
       is meant pairwise between elements. Return :math:`\{w_1\}`.
       This is implemented in ``_step_3_in_find_w``.
    4. We split :math:`\mathcal{V}` into three sets: First, :math:`\mathcal{M}` contains all
       vectors that lie in the span :math:`\mathcal{K}` of all but the last basis vector,
       which we denote as :math:`v_l`. The second set is simply :math:`\{v_l\}`. Third,
       :math:`\mathcal{N}` contains all vectors that require both :math:`v_l` and a linear
       combination of the other basis vectors. We maintain the relative ordering within each
       set, so that the first vectors in :math:`\mathcal{M}` correspond to the basis vectors
       (except for :math:`v_l` which is not in :math:`\mathcal{M}` by definition).
    5. Map each vector in :math:`\mathcal{N}` to the space :math:`\mathcal{K}` by
       adding :math:`v_l`, and call the resulting set :math:`\mathcal{N}'`.
    6. Brute-force search a bitstring :math:`\ell` that is not contained in the set
       :math:`\mathcal{L}=\mathcal{M}\cup\mathcal{N}'\cup(\mathcal{M}+\mathcal{N})\cup\{0\}`,
       where addition of sets denotes pairwise addition of elements.
       :math:`\ell` is guaranteed to exist.
    7. Form a new set of vectors
       :math:`\mathcal{V}'=\mathcal{M}\cup(\mathcal{N}'+\ell)\cup\{\ell\}`, while preserving
       ordering. Split off the first vectors :math:`\mathcal{B}'` that correspond to the
       original basis vectors (except for :math:`v_l`) off this set. Set
       :math:`\mathcal{B}\gets\mathcal{B}'`, :math:`\mathcal{V}\gets\mathcal{V}'` and
       :math:`t\gets t'=t-1`, and go to step 2 to compute a set of :math:`t'` vectors
       :math:`\mathcal{W}'` that satisfy the desired properties.
    8. Append :math:`w_t=\ell+v_l` to :math:`\mathcal{W}'` to obtain :math:`\mathcal{W}`
       and return :math:`\mathcal{W}`.

    This procedure will produce the desired linearly independent vectors :math:`\{w_k\}`.

    **Computing** ``U``

    Computing the matrix :math:`U` such that the vectors :math:`\{w_k\}` are in its kernel is
    rather simple. This is because the problem is self-dual, i.e., we actually need to find
    vectors in the kernel of :math:`W^T`, and will construct :math:`U` from the kernel vectors
    as rows. The same is true for case 2b), where we only had to compute a single :math:`w_1`.

## `SumOfSlatersPrep`

```python
class SumOfSlatersPrep(Operation)
```

Prepare an arbitrary quantum state with the sum-of-Slaters technique.

This operation prepares an arbitrary state

.. math:: |\psi\rangle = \sum_{\ell \in L } c_\ell |\ell\rangle,

where :math:`L` denotes the set of ``indices`` and :math:`c_\ell` is the ``coefficient``
corresponding to the index :math:`\ell\in L`.
The state :math:`|\ell\rangle` is a computational basis state, interpreted via the
binary representation of :math:`\ell`.

This state preparation technique was introduced in Sec. III A of
`Fomichev et al., PRX Quantum 5, 040339 <https://doi.org/10.1103/PRXQuantum.5.040339>`__
and is tailored to sparse states.

.. seealso::

    :func:`~.select_sos_rows` and :func:`~.compute_sos_encoding` for the required
    classical coprocessing.

Args:
    coefficients (np.ndarray): Coefficients of the sparse state to prepare. The ordering should
        match that in ``indices``.
    wires (qp.wires.WiresLike): Wires on which to prepare the state. All work wires will be
        allocated dynamically with :func:`~.allocate`.
    indices (tuple[int]): Indices of the sparse state to prepare. The ordering should match
        that in ``coefficients``.

.. warning::

    Note that we require ``coefficients`` to be treated as numerical data in the form of an
    array, whereas the ``indices`` need to be hashable, and thus will be treated as static
    information. This is because ``indices`` significantly impacts the structure and size of
    the circuit that realizes the state preparation.

**Example**

Consider a sparse state specified by normalized coefficients and statevector
indices pointing to the populated computational basis states:

.. code-block:: python

    import pennylane as qp
    import numpy as np

    coefficients = np.array([1, -1j, 1j, 1, 1, -1j, 1, 1j]) / np.sqrt(8)
    indices = (0, 1, 2, 4, 8, 16, 32, 64)
    wires = list(range(7))

This is all the information we require to create the state
preparation: ``coefficients``, ``indices``, and ``wires``.
The ``indices`` correspond to the computational basis states interpreted
via their binary representation (e.g., :math:`|3\rangle = |11\rangle` for two qubits
or :math:`|3\rangle = |011\rangle` for three qubits).

.. code-block:: python

    qp.decomposition.enable_graph()

    gate_set = {"QROM", "TemporaryAND", "Adjoint(TemporaryAND)", "StatePrep", "CNOT", "X"}

    first_free_wire = max(wires)+1

    @qp.transforms.resolve_dynamic_wires(min_int=first_free_wire)
    @qp.decompose(gate_set=gate_set, num_work_wires=14)
    @qp.qnode(qp.device("lightning.qubit", wires=21))
    def circuit():
        qp.SumOfSlatersPrep(coefficients, wires, indices)
        return qp.state()

We can check that we prepared the right state:

>>> prepared_state = circuit()[::2**14] # Slice the state, as there are 14 work wires
>>> where = np.where(prepared_state)
>>> print(where)
(array([ 0,  1,  2,  4,  8, 16, 32, 64]),)
>>> # Adding 0.0 to the rounded result will prevent stochastic signed zeros
>>> print(np.round(prepared_state[where], 4) + 0.0)
[0.3536+0.j     0.    -0.3536j 0.    +0.3536j 0.3536+0.j
 0.3536+0.j     0.    -0.3536j 0.3536+0.j     0.    +0.3536j]

That looks exactly right! Internally, the state preparation looks like this:

>>> print(qp.draw(circuit, show_matrices=False, max_length=180)())
 0: ──────╭QROM(M0)─╭●────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ···
 1: ──────├QROM(M0)─│────────╭●───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ···
 2: ──────├QROM(M0)─│──╭●────│──╭●────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ···
 3: ──────├QROM(M0)─│──│─────│──│─────╭●──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ···
 4: ──────├QROM(M0)─│──│──╭●─│──│──╭●─│──╭●───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ···
 5: ──────├QROM(M0)─│──│──│──│──│──│──│──│──╭●────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ···
 6: ──────├QROM(M0)─│──│──│──│──│──│──│──│──│──╭●─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ···
 7: ─╭|Ψ⟩─├QROM(M0)─│──│──│──│──│──│──│──│──│──│──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╭X──── ···
 8: ─├|Ψ⟩─├QROM(M0)─│──│──│──│──│──│──│──│──│──│───────────────────────────────────────────────────╭X────────────────────────────────╭X───────────────────────────────────│───── ···
 9: ─╰|Ψ⟩─├QROM(M0)─│──│──│──│──│──│──│──│──│──│─────────────────╭X────────────────────────────────│─────────────────────────────────│──╭X────────────────────────────────│───── ···
10: ──────│─────────╰X─╰X─╰X─│──│──│──│──│──│──│───X─╭●──────────│───────────────●╮────╭●──────────│───────────────●╮──X─╭●──────────│──│───────────────●╮──X─╭●──────────│───── ···
11: ──────│──────────────────╰X─╰X─╰X─│──│──│──│───X─├●──────────│───────────────●┤────├●──────────│───────────────●┤──X─├●──────────│──│───────────────●┤──X─├●──────────│───── ···
12: ──────│───────────────────────────╰X─╰X─│──│───X─│──╭●───────│───────────●╮───│────│──╭●───────│───────────●╮───│──X─│──╭●───────│──│───────────●╮───│────│──╭●───────│───── ···
13: ──────│─────────────────────────────────╰X─│───X─│──│──╭●────│───────●╮───│───│──X─│──│──╭●────│───────●╮───│───│──X─│──│──╭●────│──│───────●╮───│───│────│──│──╭●────│───── ···
14: ──────│────────────────────────────────────╰X────│──│──│──╭●─│───●╮───│───│───│──X─│──│──│──╭●─│───●╮───│───│───│────│──│──│──╭●─│──│───●╮───│───│───│────│──│──│──╭●─│───●╮ ···
15: ──────├QROM(M0)──────────────────────────────────│──│──│──│──│────│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│──│────│───│───│───│────│──│──│──│──│────│ ···
16: ──────╰QROM(M0)──────────────────────────────────│──│──│──│──│────│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│──│────│───│───│───│────│──│──│──│──│────│ ···
17: ─────────────────────────────────────────────────╰⊕─├●─│──│──│────│───│──●┤──⊕╯────╰⊕─├●─│──│──│────│───│──●┤──⊕╯────╰⊕─├●─│──│──│──│────│───│──●┤──⊕╯────╰⊕─├●─│──│──│────│ ···
18: ────────────────────────────────────────────────────╰⊕─├●─│──│────│──●┤──⊕╯───────────╰⊕─├●─│──│────│──●┤──⊕╯───────────╰⊕─├●─│──│──│────│──●┤──⊕╯───────────╰⊕─├●─│──│────│ ···
19: ───────────────────────────────────────────────────────╰⊕─├●─│───●┤──⊕╯──────────────────╰⊕─├●─│───●┤──⊕╯──────────────────╰⊕─├●─│──│───●┤──⊕╯──────────────────╰⊕─├●─│───●┤ ···
20: ──────────────────────────────────────────────────────────╰⊕─╰●──⊕╯─────────────────────────╰⊕─╰●──⊕╯─────────────────────────╰⊕─╰●─╰●──⊕╯─────────────────────────╰⊕─╰●──⊕╯ ···
<BLANKLINE>
 0: ··· ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╭●────────────────────────────┤  State
 1: ··· ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────│────────╭●───────────────────┤  State
 2: ··· ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────│──╭●────│──╭●────────────────┤  State
 3: ··· ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────│──│─────│──│─────╭●──────────┤  State
 4: ··· ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────│──│──╭●─│──│──╭●─│──╭●───────┤  State
 5: ··· ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────│──│──│──│──│──│──│──│──╭●────┤  State
 6: ··· ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────│──│──│──│──│──│──│──│──│──╭●─┤  State
 7: ··· ────────────────────────────╭X───────────────────────────────────╭X───────────────────────────────────╭X───────────────────────│──│──│──│──│──│──│──│──│──│──┤  State
 8: ··· ────────────────────────────│────────────────────────────────────│──╭X────────────────────────────────│──╭X────────────────────│──│──│──│──│──│──│──│──│──│──┤  State
 9: ··· ────────────────────────────│──╭X────────────────────────────────│──│─────────────────────────────────│──│──╭X─────────────────│──│──│──│──│──│──│──│──│──│──┤  State
10: ··· ──────────●╮──X─╭●──────────│──│───────────────●╮──X─╭●──────────│──│───────────────●╮──X─╭●──────────│──│──│───────────────●╮─╰X─╰X─╰X─│──│──│──│──│──│──│──┤  State
11: ··· ──────────●┤──X─├●──────────│──│───────────────●┤────├●──────────│──│───────────────●┤──X─├●──────────│──│──│───────────────●┤──X───────╰X─╰X─╰X─│──│──│──│──┤  State
12: ··· ──────●╮───│──X─│──╭●───────│──│───────────●╮───│────│──╭●───────│──│───────────●╮───│────│──╭●───────│──│──│───────────●╮───│──X────────────────╰X─╰X─│──│──┤  State
13: ··· ──●╮───│───│────│──│──╭●────│──│───────●╮───│───│────│──│──╭●────│──│───────●╮───│───│────│──│──╭●────│──│──│───────●╮───│───│──X──────────────────────╰X─│──┤  State
14: ··· ───│───│───│────│──│──│──╭●─│──│───●╮───│───│───│────│──│──│──╭●─│──│───●╮───│───│───│────│──│──│──╭●─│──│──│───●╮───│───│───│──X─────────────────────────╰X─┤  State
15: ··· ───│───│───│────│──│──│──│──│──│────│───│───│───│────│──│──│──│──│──│────│───│───│───│────│──│──│──│──│──│──│────│───│───│───│───────────────────────────────┤  State
16: ··· ───│───│───│────│──│──│──│──│──│────│───│───│───│────│──│──│──│──│──│────│───│───│───│────│──│──│──│──│──│──│────│───│───│───│───────────────────────────────┤  State
17: ··· ───│──●┤──⊕╯────╰⊕─├●─│──│──│──│────│───│──●┤──⊕╯────╰⊕─├●─│──│──│──│────│───│──●┤──⊕╯────╰⊕─├●─│──│──│──│──│────│───│──●┤──⊕╯───────────────────────────────┤  State
18: ··· ──●┤──⊕╯───────────╰⊕─├●─│──│──│────│──●┤──⊕╯───────────╰⊕─├●─│──│──│────│──●┤──⊕╯───────────╰⊕─├●─│──│──│──│────│──●┤──⊕╯───────────────────────────────────┤  State
19: ··· ──⊕╯──────────────────╰⊕─├●─│──│───●┤──⊕╯──────────────────╰⊕─├●─│──│───●┤──⊕╯──────────────────╰⊕─├●─│──│──│───●┤──⊕╯───────────────────────────────────────┤  State
20: ··· ─────────────────────────╰⊕─╰●─╰●──⊕╯─────────────────────────╰⊕─╰●─╰●──⊕╯─────────────────────────╰⊕─╰●─╰●─╰●──⊕╯───────────────────────────────────────────┤  State

Here, the first seven wires (``0`` to ``6``) are the target wires of the state preparation,
wires ``7, 8, 9`` form the enumeration register, the next five wires (``10`` to ``14``)
are the encoding register, and the pair of wires ``15, 16`` as well as the wires ``17``
to ``20`` are work wires for the ``QROM`` and the enumeration uncomputation, respectively.

.. details::
    :title: Usage details

    **Reduced circuit complexity for identity encodings**

    Depending on the ``indices`` passed to the state preparation, they may or may not
    be reducible to short enough sub-bitstrings such that no further encoding is required.
    In this case, the blocks of ``CNOT`` gates after the ``QROM`` and at the end,
    as seen in the example above, are not needed.
    For example, consider the following modification of the example:

    .. code-block:: python

        coefficients = np.array([0.25, 0.25j, -0.25, 0.5, 0.5, 0.25, -0.25j, 0.25, -0.25, 0.25])
        indices = (0, 1, 4, 13, 14, 17, 19, 22, 23, 25)
        wires = list(range(5))
        first_free_wire = max(wires)+1

        @qp.transforms.resolve_dynamic_wires(min_int=first_free_wire)
        @qp.decompose(gate_set=gate_set, num_work_wires=11)
        @qp.qnode(qp.device("lightning.qubit", wires=16))
        def circuit():
            qp.SumOfSlatersPrep(coefficients, wires, indices)
            return qp.state()

    In this case, we only require eight work wires, because the encoding blocks can be skipped.

    >>> prepared_state = circuit()[::2**11] # Slice the state, as there are eleven work wires
    >>> where = np.where(np.abs(prepared_state)>1e-12)
    >>> print(where)
    (array([ 0,  1,  4, 13, 14, 17, 19, 22, 23, 25]),)
    >>> # Adding 0.0 to the rounded result will prevent stochastic signed zeros
    >>> print(np.round(prepared_state[where], 4) + 0.0)
    [ 0.25+0.j    0.  +0.25j -0.25+0.j    0.5 +0.j    0.5 +0.j    0.25+0.j
      0.  -0.25j  0.25+0.j   -0.25+0.j    0.25+0.j  ]

    The reduced circuit looks like this:

    >>> print(qp.draw(circuit, show_matrices=False, max_length=190)())
     0: ──────╭QROM(M0)──X─╭●──────────────────────────●╮────╭●──────────────────────────●╮────╭●─────────────────────────────●╮────╭●──────────────────────────●╮──X─╭●─────────────────── ···
     1: ──────├QROM(M0)──X─├●──────────────────────────●┤────├●──────────────────────────●┤──X─├●─────────────────────────────●┤────├●──────────────────────────●┤──X─├●─────────────────── ···
     2: ──────├QROM(M0)──X─│──╭●───────────────────●╮───│──X─│──╭●───────────────────●╮───│────│──╭●──────────────────────●╮───│────│──╭●───────────────────●╮───│──X─│──╭●──────────────── ···
     3: ──────├QROM(M0)──X─│──│──╭●────────────●╮───│───│────│──│──╭●────────────●╮───│───│────│──│──╭●───────────────●╮───│───│──X─│──│──╭●────────────●╮───│───│──X─│──│──╭●───────────── ···
     4: ──────├QROM(M0)────│──│──│──╭●─────●╮───│───│───│──X─│──│──│──╭●─────●╮───│───│───│──X─│──│──│──╭●────────●╮───│───│───│──X─│──│──│──╭●─────●╮───│───│───│──X─│──│──│──╭●────────●╮ ···
     5: ─╭|Ψ⟩─├QROM(M0)────│──│──│──│───────│───│───│───│────│──│──│──│───────│───│───│───│────│──│──│──│──────────│───│───│───│────│──│──│──│───────│───│───│───│────│──│──│──│──────────│ ···
     6: ─├|Ψ⟩─├QROM(M0)────│──│──│──│───────│───│───│───│────│──│──│──│───────│───│───│───│────│──│──│──│──────────│───│───│───│────│──│──│──│──╭X───│───│───│───│────│──│──│──│──╭X──────│ ···
     7: ─├|Ψ⟩─├QROM(M0)────│──│──│──│───────│───│───│───│────│──│──│──│──╭X───│───│───│───│────│──│──│──│──╭X──────│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│───────│ ···
     8: ─╰|Ψ⟩─├QROM(M0)────│──│──│──│──╭X───│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│──╭X───│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│──╭X───│ ···
     9: ──────├QROM(M0)────│──│──│──│──│────│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│──│────│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│──│────│ ···
    10: ──────├QROM(M0)────│──│──│──│──│────│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│──│────│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│──│────│ ···
    11: ──────╰QROM(M0)────│──│──│──│──│────│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│──│────│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│──│────│ ···
    12: ───────────────────╰⊕─├●─│──│──│────│───│──●┤──⊕╯────╰⊕─├●─│──│──│────│───│──●┤──⊕╯────╰⊕─├●─│──│──│──│────│───│──●┤──⊕╯────╰⊕─├●─│──│──│────│───│──●┤──⊕╯────╰⊕─├●─│──│──│──│────│ ···
    13: ──────────────────────╰⊕─├●─│──│────│──●┤──⊕╯───────────╰⊕─├●─│──│────│──●┤──⊕╯───────────╰⊕─├●─│──│──│────│──●┤──⊕╯───────────╰⊕─├●─│──│────│──●┤──⊕╯───────────╰⊕─├●─│──│──│────│ ···
    14: ─────────────────────────╰⊕─├●─│───●┤──⊕╯──────────────────╰⊕─├●─│───●┤──⊕╯──────────────────╰⊕─├●─│──│───●┤──⊕╯──────────────────╰⊕─├●─│───●┤──⊕╯──────────────────╰⊕─├●─│──│───●┤ ···
    15: ────────────────────────────╰⊕─╰●──⊕╯─────────────────────────╰⊕─╰●──⊕╯─────────────────────────╰⊕─╰●─╰●──⊕╯─────────────────────────╰⊕─╰●──⊕╯─────────────────────────╰⊕─╰●─╰●──⊕╯ ···
    <BLANKLINE>
     0: ··· ──────────●╮────╭●─────────────────────────────●╮────╭●────────────────────────────────●╮────╭●──────────────────────────●╮────╭●─────────────────────────────●╮────┤  State
     1: ··· ──────────●┤────├●─────────────────────────────●┤────├●────────────────────────────────●┤────├●──────────────────────────●┤──X─├●─────────────────────────────●┤────┤  State
     2: ··· ──────●╮───│────│──╭●──────────────────────●╮───│──X─│──╭●─────────────────────────●╮───│────│──╭●───────────────────●╮───│──X─│──╭●──────────────────────●╮───│──X─┤  State
     3: ··· ──●╮───│───│──X─│──│──╭●───────────────●╮───│───│────│──│──╭●──────────────────●╮───│───│────│──│──╭●────────────●╮───│───│──X─│──│──╭●───────────────●╮───│───│──X─┤  State
     4: ··· ───│───│───│────│──│──│──╭●────────●╮───│───│───│──X─│──│──│──╭●───────────●╮───│───│───│──X─│──│──│──╭●─────●╮───│───│───│────│──│──│──╭●────────●╮───│───│───│────┤  State
     5: ··· ───│───│───│────│──│──│──│──────────│───│───│───│────│──│──│──│─────────────│───│───│───│────│──│──│──│──╭X───│───│───│───│────│──│──│──│──╭X──────│───│───│───│────┤  State
     6: ··· ───│───│───│────│──│──│──│──╭X──────│───│───│───│────│──│──│──│──╭X─────────│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│───────│───│───│───│────┤  State
     7: ··· ───│───│───│────│──│──│──│──│──╭X───│───│───│───│────│──│──│──│──│──╭X──────│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│───────│───│───│───│────┤  State
     8: ··· ───│───│───│────│──│──│──│──│──│────│───│───│───│────│──│──│──│──│──│──╭X───│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│──╭X───│───│───│───│────┤  State
     9: ··· ───│───│───│────│──│──│──│──│──│────│───│───│───│────│──│──│──│──│──│──│────│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│──│────│───│───│───│────┤  State
    10: ··· ───│───│───│────│──│──│──│──│──│────│───│───│───│────│──│──│──│──│──│──│────│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│──│────│───│───│───│────┤  State
    11: ··· ───│───│───│────│──│──│──│──│──│────│───│───│───│────│──│──│──│──│──│──│────│───│───│───│────│──│──│──│──│────│───│───│───│────│──│──│──│──│──│────│───│───│───│────┤  State
    12: ··· ───│──●┤──⊕╯────╰⊕─├●─│──│──│──│────│───│──●┤──⊕╯────╰⊕─├●─│──│──│──│──│────│───│──●┤──⊕╯────╰⊕─├●─│──│──│────│───│──●┤──⊕╯────╰⊕─├●─│──│──│──│────│───│──●┤──⊕╯────┤  State
    13: ··· ──●┤──⊕╯───────────╰⊕─├●─│──│──│────│──●┤──⊕╯───────────╰⊕─├●─│──│──│──│────│──●┤──⊕╯───────────╰⊕─├●─│──│────│──●┤──⊕╯───────────╰⊕─├●─│──│──│────│──●┤──⊕╯────────┤  State
    14: ··· ──⊕╯──────────────────╰⊕─├●─│──│───●┤──⊕╯──────────────────╰⊕─├●─│──│──│───●┤──⊕╯──────────────────╰⊕─├●─│───●┤──⊕╯──────────────────╰⊕─├●─│──│───●┤──⊕╯────────────┤  State
    15: ··· ─────────────────────────╰⊕─╰●─╰●──⊕╯─────────────────────────╰⊕─╰●─╰●─╰●──⊕╯─────────────────────────╰⊕─╰●──⊕╯─────────────────────────╰⊕─╰●─╰●──⊕╯────────────────┤  State

    As we can see, the ladders of elbow, or :class:`~.TemporaryAND` gates are now
    controlled on the target register directly, rather than the encoding register, which
    we thus can skip for the identity encoding.

    **Dynamic work wires**

    Note that in the example above, wires with labels ``5`` to ``15`` were dynamically
    allocated. We can see an
    initial dense state preparation via :class:`~.StatePrep` on fewer qubits (depicted as
    ``|Ψ⟩`` on the first four dynamic wires in the above diagram), a :class:`~.QROM` and
    a sequence of elbow ladders that set a caching qubit (qubit index ``15``), which
    then controls :class:`~.CNOT` gates that perform the actual uncomputation.

    Note that we guessed the required number of work wires (``num_work_wires``) in
    :func:`~.pennylane.decompose` and employed :func:`~.transforms.resolve_dynamic_wires` to assign
    integer wire labels to those dynamically allocated wires. If we want to know
    the required wire register sizes ahead of time, they can be computed with
    ``SumOfSlatersPrep.required_register_sizes``:

    >>> prep_op = qp.SumOfSlatersPrep(coefficients, wires, indices)
    >>> prep_op.required_register_sizes(**prep_op.resource_params)
    {'wires': 5,
     'enumeration_wires': 4,
     'identification_wires': 0,
     'qrom_work_wires': 3,
     'mcx_cache_wires': 4}

    Note that work wires of subroutines like ``QROM`` or the elbow ladders that realize a
    :class:`~.MultiControlledX` gate are accounted for explicitly.

### `has_decomposition`

```python
def has_decomposition(self)
```

We are using ``qp.allocate`` in the decomposition, so the validation for
decomposition in the old system breaks. Hence we manually deactivate the fallback
of ``compute_decomposition`` to the new decomp system that is implemented in
``Operator.compute_decomposition``. Accordingly we set ``has_decomposition=False`` here.

### `compute_decomposition`

```python
def compute_decomposition(coefficients, wires, indices)
```

We are using ``qp.allocate`` in the decomposition, so the validation for
decomposition in the old system breaks. Hence we manually deactivate the fallback
of ``compute_decomposition`` to the new decomp system that is implemented in
``Operator.compute_decomposition``.

### `required_register_sizes`

```python
def required_register_sizes(num_entries, num_bits, num_wires)
```

Compute the register sizes required for ``SumOfSlatersPrep``, for given
numbers of bitstrings ``num_entries``, of bits per bitstring (``num_bits``, already
reduced via ``select_sos_rows``) and target wires (``num_wires``).

Args:
    num_entries (int): Number of bitstrings encoded by ``SumOfSlatersPrep``.
    num_bits (int): Number of bits per bitstring.
    num_wires (int): Number of target wires on which ``SumOfSlatersPrep`` will prepare
        the state.

Returns:
    dict[str, int]: Required register size per register name
