---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/templates/trotter.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/templates/trotter.py
license: Apache-2.0
---

## Module `pennylane/estimator/templates/trotter.py`

Contains templates for Suzuki-Trotter approximation based subroutines.

## `TrotterProduct`

```python
class TrotterProduct(ResourceOperator)
```

An operation representing the Suzuki-Trotter product approximation for the complex matrix
exponential of a Hamiltonian operator.

The Suzuki-Trotter product formula provides a method to approximate the matrix exponential of
Hamiltonian expressed as a linear combination of terms which in general do not commute.
Consider the Hamiltonian :math:`H = \Sigma^{N}_{j=0} O_{j}`: the product formula is constructed using
symmetrized products of the terms in the Hamiltonian. The symmetrized products of order
:math:`m \in [1, 2, 4, ..., 2k]` with :math:`k \in \mathbb{N}` are given by:

.. math::

    \begin{align}
        S_{1}(t) &= \Pi_{j=0}^{N} \ e^{i t O_{j}} \\
        S_{2}(t) &= \Pi_{j=0}^{N} \ e^{i \frac{t}{2} O_{j}} \cdot \Pi_{j=N}^{0} \ e^{i \frac{t}{2} O_{j}} \\
        &\vdots \\
        S_{m}(t) &= S_{m-2}(p_{m}t)^{2} \cdot S_{m-2}((1-4p_{m})t) \cdot S_{m-2}(p_{m}t)^{2},
    \end{align}

where the coefficient is :math:`p_{m} = 1 / (4 - \sqrt[m - 1]{4})`. The :math:`m^{\text{th}}` order,
:math:`n`-step Suzuki-Trotter approximation is then defined as:

.. math:: e^{iHt} \approx \left [S_{m}(t / n)  \right ]^{n}.

For more details, see `J. Math. Phys. 32, 400 (1991) <https://pubs.aip.org/aip/jmp/article-abstract/32/2/400/229229>`_.

Args:
    first_order_expansion (list[~pennylane.estimator.ResourceOperator]): A list of operators
        constituting the first order expansion of the Hamiltonian to be approximately exponentiated.
    num_steps (int): number of Trotter steps to perform
    order (int): order of the Suzuki-Trotter approximation; must be ``1`` or an even number
    wires (list[int] | None): The wires on which the operator acts. If provided, these wire
        labels will be used instead of the wires provided by the ResourceOperators in the
        :code:`first_order_expansion`.

Resources:
    The resources are defined according to the recursive formula presented above.
    The number of times an operator :math:`e^{itO_{j}}` is applied depends on the
    number of Trotter steps (`n`) and the order of the approximation (`m`) and is given by:

    .. math:: C_{O_j} = 2 \cdot n \cdot 5^{\frac{m}{2} - 1}

    Furthermore, because of the symmetric form of the recursive formula, the first and last terms are grouped.
    This reduces the counts for those terms to:

    .. math::

        \begin{align}
            C_{O_{0}} &= n \cdot 5^{\frac{m}{2} - 1} + 1,  \\
            C_{O_{N}} &= n \cdot 5^{\frac{m}{2} - 1}.
        \end{align}

.. seealso:: The corresponding PennyLane operation :class:`~.TrotterProduct`

.. seealso::
    :class:`~.estimator.templates.TrotterCDF`,
    :class:`~.estimator.templates.TrotterTHC`,
    :class:`~.estimator.templates.TrotterVibrational`,
    :class:`~.estimator.templates.TrotterVibronic`

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> num_steps, order = (1, 2)
>>> first_order_expansion = [qre.RX(), qre.RY()] # H = X + Y
>>> gate_set = {"RX", "RY"}
>>> res = qre.estimate(qre.TrotterProduct(first_order_expansion, num_steps, order), gate_set=gate_set)
>>> print(res)
--- Resources: ---
 Total wires: 1
    algorithmic wires: 1
    allocated wires: 0
         zero state: 0
         any state: 0
 Total gates : 3
  'RX': 2,
  'RY': 1

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * first_order_expansion (list[:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`]): A list of operators,
          in the compressed representation, constituting the first order expansion of the Hamiltonian to be approximately exponentiated.
        * num_steps (int): number of Trotter steps to perform
        * order (int): order of the Suzuki-Trotter approximation, must be 1 or even
        * num_wires (int): number of wires the operator acts on

### `resource_rep`

```python
def resource_rep(cls, first_order_expansion: list, num_steps: int, order: int, num_wires: int) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    first_order_expansion (list[:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`]): A list of operators,
        in the compressed representation, constituting
        the first order expansion of the Hamiltonian to be approximately exponentiated.
    num_steps (int): number of Trotter steps to perform
    order (int): order of the Suzuki-Trotter approximation, must be 1 or even
    num_wires (int): number of wires the operator acts on

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, first_order_expansion: list, num_steps: int, order: int, num_wires: int) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a
quantum gate and the number of times it occurs in the decomposition.

Args:
    first_order_expansion (list[:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`]): A list of operators,
        in the compressed representation, constituting
        the first order expansion of the Hamiltonian to be approximately exponentiated.
    num_steps (int): number of Trotter steps to perform
    order (int): order of the Suzuki-Trotter approximation, must be 1 or even

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `TrotterCDF`

```python
class TrotterCDF(ResourceOperator)
```

An operation representing the Suzuki-Trotter product approximation for the complex matrix
exponential of a compressed double-factorized (CDF) Hamiltonian.

The Suzuki-Trotter product formula provides a method to approximate the matrix exponential of
Hamiltonian expressed as a linear combination of terms which in general do not commute.
Consider the Hamiltonian :math:`H = \Sigma^{N}_{j=0} O_{j}`: the product formula is constructed using
symmetrized products of the terms in the Hamiltonian. The symmetrized products of order
:math:`m \in [1, 2, 4, ..., 2k]` with :math:`k \in \mathbb{N}` are given by:

.. math::

    \begin{align}
        S_{1}(t) &= \Pi_{j=0}^{N} \ e^{i t O_{j}} \\
        S_{2}(t) &= \Pi_{j=0}^{N} \ e^{i \frac{t}{2} O_{j}} \cdot \Pi_{j=N}^{0} \ e^{i \frac{t}{2} O_{j}} \\
        &\vdots \\
        S_{m}(t) &= S_{m-2}(p_{m}t)^{2} \cdot S_{m-2}((1-4p_{m})t) \cdot S_{m-2}(p_{m}t)^{2},
    \end{align}

where the coefficient is :math:`p_{m} = 1 / (4 - \sqrt[m - 1]{4})`. The :math:`m^{\text{th}}`
order, :math:`n`-step Suzuki-Trotter approximation is then defined as:

.. math::

    e^{iHt} \approx \left [S_{m}(t / n)  \right ]^{n}.

For more details see `J. Math. Phys. 32, 400 (1991) <https://pubs.aip.org/aip/jmp/article-abstract/32/2/400/229229>`_.

Args:
    cdf_ham (:class:`~.pennylane.estimator.compact_hamiltonian.CDFHamiltonian`):
        a compressed double factorized Hamiltonian to be approximately exponentiated
    num_steps (int): number of Trotter steps to perform
    order (int): order of the approximation, must be ``1`` or an even number
    wires (list[int] | None): the wires on which the operator acts

Raises:
    TypeError: if ``cdf_ham`` is not an instance of :class:`~.CDFHamiltonian`
    ValueError: if ``num_steps`` is not a positive integer
    ValueError: if ``order`` is not 1 or a positive even integer
    ValueError: if the number of wires provided does not match the number of wires required by the operator

Resources:
    The resources are defined according to the recursive formula presented above.
    The number of times an operator :math:`e^{itO_{j}}` is applied depends on the
    number of Trotter steps (`n`) and the order of the approximation (`m`) and is given by:

    .. math::

        C_{O_j} = 2 \cdot n \cdot 5^{\frac{m}{2} - 1}.

    Furthermore, because of the symmetric form of the recursive formula, the first and last terms get grouped.
    This reduces the counts for those terms to:

    .. math::

        \begin{align}
            C_{O_{0}} &= n \cdot 5^{\frac{m}{2} - 1} + 1,  \\
            C_{O_{N}} &= n \cdot 5^{\frac{m}{2} - 1}.
        \end{align}

    The resources for a single step expansion of compressed double factorized Hamiltonian are
    calculated based on `arXiv:2506.15784 <https://arxiv.org/abs/2506.15784>`_.

.. seealso::
    :class:`~.estimator.compact_hamiltonian.CDFHamiltonian`

.. seealso:: :class:`~.TrotterProduct`

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> num_steps, order = (1, 2)
>>> cdf_ham = qre.CDFHamiltonian(num_orbitals = 4, num_fragments = 4)
>>> res = qre.estimate(qre.TrotterCDF(cdf_ham, num_steps, order))
>>> print(res)
--- Resources: ---
 Total wires: 8
    algorithmic wires: 8
    allocated wires: 0
         zero state: 0
         any state: 0
 Total gates : 2.238E+4
  'T': 2.075E+4,
  'CNOT': 448,
  'Z': 336,
  'S': 504,
  'Hadamard': 336

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * cdf_ham (:class:`~.pennylane.estimator.templates.compact_hamiltonian.CDFHamiltonian`): a compressed double factorized
          Hamiltonian to be approximately exponentiated
        * num_steps (int): number of Trotter steps to perform
        * order (int): order of the approximation, must be 1 or even.

### `resource_rep`

```python
def resource_rep(cls, cdf_ham: CDFHamiltonian, num_steps: int, order: int) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    cdf_ham (:class:`~.pennylane.estimator.templates.compact_hamiltonian.CDFHamiltonian`):
        a compressed double factorized Hamiltonian to be approximately exponentiated
    num_steps (int): number of Trotter steps to perform
    order (int): order of the approximation, must be 1 or even.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, cdf_ham: CDFHamiltonian, num_steps: int, order: int) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a
quantum gate and the number of times it occurs in the decomposition.

Args:
    cdf_ham (:class:`~.pennylane.estimator.templates.compact_hamiltonian.CDFHamiltonian`): a compressed double factorized
        Hamiltonian to be approximately exponentiated
    num_steps (int): number of Trotter steps to perform
    order (int): order of the approximation, must be 1 or even.

Resources:
    The resources are defined according to the recursive formula presented above.
    The number of times an operator, :math:`e^{itO_{j}}`, is applied depends on the
    number of Trotter steps (`n`) and the order of the approximation (`m`) and is given by:

    .. math::

        C_{O_j} = 2 \cdot n \cdot 5^{\frac{m}{2} - 1}.

    Furthermore, because of the symmetric form of the recursive formula, the first and last terms get grouped.
    This reduces the counts for those terms to:

    .. math::

        \begin{align}
            C_{O_{0}} &= n \cdot 5^{\frac{m}{2} - 1} + 1,  \\
            C_{O_{N}} &= n \cdot 5^{\frac{m}{2} - 1}.
        \end{align}

    The resources for a single step expansion of compressed double factorized Hamiltonian are
    calculated based on `arXiv:2506.15784 <https://arxiv.org/abs/2506.15784>`_.


Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `controlled_resource_decomp`

```python
def controlled_resource_decomp(cls, num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict | None=None)
```

Returns the controlled resource decomposition.

Args:
    num_ctrl_wires (int): the number of qubits the operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are controlled when in the :math:`|0\rangle` state
    target_resource_params (dict): dictionary containing the size of the larger of the two registers being added together

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

Resources:
    The original resources are controlled only on the Z rotation gates.

## `TrotterTHC`

```python
class TrotterTHC(ResourceOperator)
```

An operation representing the Suzuki-Trotter product approximation for the complex matrix
exponential of a tensor hypercontracted (THC) Hamiltonian.

The Suzuki-Trotter product formula provides a method to approximate the matrix exponential of
Hamiltonian expressed as a linear combination of terms which in general do not commute.
Consider the Hamiltonian :math:`H = \Sigma^{N}_{j=0} O_{j}`: the product formula is constructed using
symmetrized products of the terms in the Hamiltonian. The symmetrized products of order
:math:`m \in [1, 2, 4, ..., 2k]` with :math:`k \in \mathbb{N}` are given by:

.. math::

    \begin{align}
        S_{1}(t) &= \Pi_{j=0}^{N} \ e^{i t O_{j}} \\
        S_{2}(t) &= \Pi_{j=0}^{N} \ e^{i \frac{t}{2} O_{j}} \cdot \Pi_{j=N}^{0} \ e^{i \frac{t}{2} O_{j}} \\
        &\vdots \\
        S_{m}(t) &= S_{m-2}(p_{m}t)^{2} \cdot S_{m-2}((1-4p_{m})t) \cdot S_{m-2}(p_{m}t)^{2},
    \end{align}

where the coefficient is :math:`p_{m} = 1 / (4 - \sqrt[m - 1]{4})`. The :math:`m^{\text{th}}`
order, :math:`n`-step Suzuki-Trotter approximation is then defined as:

.. math::

    e^{iHt} \approx \left [S_{m}(t / n)  \right ]^{n}.

For more details see `J. Math. Phys. 32, 400 (1991) <https://pubs.aip.org/aip/jmp/article-abstract/32/2/400/229229>`_.

Args:
    thc_ham (:class:`~.pennylane.estimator.compact_hamiltonian.THCHamiltonian`): a tensor hypercontracted
        Hamiltonian to be approximately exponentiated
    num_steps (int): number of Trotter steps to perform
    order (int): order of the approximation, must be ``1`` or an even number
    wires (list[int] | None): the wires on which the operator acts

Raises:
    TypeError: if ``thc_ham`` is not an instance of :class:`~.THCHamiltonian`
    ValueError: if ``num_steps`` is not a positive integer
    ValueError: if ``order`` is not 1 or a positive even integer
    ValueError: if the number of wires provided does not match the number of expected wires for the operation

Resources:
    The resources are defined according to the recursive formula presented above.
    The number of times an operator :math:`e^{itO_{j}}` is applied depends on the
    number of Trotter steps (`n`) and the order of the approximation (`m`) and is given by:

    .. math::

        C_{O_j} = 2 \cdot n \cdot 5^{\frac{m}{2} - 1}.

    Furthermore, because of the symmetric form of the recursive formula, the first and last
    terms get grouped. This reduces the counts for those terms to:

    .. math::

        \begin{align}
            C_{O_{0}} &= n \cdot 5^{\frac{m}{2} - 1} + 1,  \\
            C_{O_{N}} &= n \cdot 5^{\frac{m}{2} - 1}.
        \end{align}

    The resources for a single step expansion of tensor hypercontracted Hamiltonian are
    calculated based on `arXiv:2407.04432 <https://arxiv.org/abs/2407.04432>`_.

.. seealso::
    :class:`~.estimator.compact_hamiltonian.THCHamiltonian`

.. seealso:: :class:`~.TrotterProduct`

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> num_steps, order = (1, 2)
>>> thc_ham = qre.THCHamiltonian(num_orbitals=4, tensor_rank=4)
>>> res = qre.estimate(qre.TrotterTHC(thc_ham, num_steps, order))
>>> print(res)
--- Resources: ---
 Total wires: 8
    algorithmic wires: 8
    allocated wires: 0
         zero state: 0
         any state: 0
 Total gates : 8.520E+3
  'T': 7.888E+3,
  'CNOT': 128,
  'Z': 144,
  'S': 216,
  'Hadamard': 144

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * thc_ham (:class:`~.pennylane.estimator.templates.compact_hamiltonian.THCHamiltonian`): a tensor hypercontracted
          Hamiltonian to be approximately exponentiated
        * num_steps (int): number of Trotter steps to perform
        * order (int): order of the approximation, must be 1 or even

### `resource_rep`

```python
def resource_rep(cls, thc_ham: THCHamiltonian, num_steps: int, order: int) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    thc_ham (:class:`~.pennylane.estimator.templates.compact_hamiltonian.THCHamiltonian`): a tensor hypercontracted
        Hamiltonian to be approximately exponentiated
    num_steps (int): number of Trotter steps to perform
    order (int): order of the approximation, must be 1 or even

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, thc_ham: THCHamiltonian, num_steps: int, order: int) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a
quantum gate and the number of times it occurs in the decomposition.

Args:
    thc_ham (:class:`~.pennylane.estimator.templates.compact_hamiltonian.THCHamiltonian`): a tensor hypercontracted
        Hamiltonian to be approximately exponentiated
    num_steps (int): number of Trotter steps to perform
    order (int): order of the approximation, must be 1 or even

Resources:
    The resources are defined according to the recursive formula presented above.
    The number of times an operator, :math:`e^{itO_{j}}`, is applied depends on the
    number of Trotter steps (`n`) and the order of the approximation (`m`) and is given by:

    .. math::

        C_{O_j} = 2 \cdot n \cdot 5^{\frac{m}{2} - 1}.

    Furthermore, because of the symmetric form of the recursive formula, the first and last
    terms get grouped. This reduces the counts for those terms to:

    .. math::

        \begin{align}
            C_{O_{0}} &= n \cdot 5^{\frac{m}{2} - 1} + 1,  \\
            C_{O_{N}} &= n \cdot 5^{\frac{m}{2} - 1}.
        \end{align}

    The resources for a single step expansion of tensor hypercontracted Hamiltonian are
    calculated based on `arXiv:2407.04432 <https://arxiv.org/abs/2407.04432>`_.


Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `controlled_resource_decomp`

```python
def controlled_resource_decomp(cls, num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict | None=None)
```

Returns the controlled resource decomposition.

Args:
    num_ctrl_wires (int): the number of qubits the operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are controlled when in the :math:`|0\rangle` state
    target_resource_params (dict): dictionary containing the size of the larger of the two registers being added together

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

Resources:
    The original resources are controlled only on the Z rotation gates

## `TrotterVibrational`

```python
class TrotterVibrational(ResourceOperator)
```

An operation representing the Suzuki-Trotter product approximation for the complex matrix
exponential of a vibrational Hamiltonian.

The Suzuki-Trotter product formula provides a method to approximate the matrix exponential of
Hamiltonian expressed as a linear combination of terms which in general do not commute.
Consider the Hamiltonian :math:`H = \Sigma^{N}_{j=0} O_{j}`: the product formula is constructed using
symmetrized products of the terms in the Hamiltonian. The symmetrized products of order
:math:`m \in [1, 2, 4, ..., 2k]` with :math:`k \in \mathbb{N}` are given by:

.. math::

    \begin{align}
        S_{1}(t) &= \Pi_{j=0}^{N} \ e^{i t O_{j}} \\
        S_{2}(t) &= \Pi_{j=0}^{N} \ e^{i \frac{t}{2} O_{j}} \cdot \Pi_{j=N}^{0} \ e^{i \frac{t}{2} O_{j}} \\
        &\vdots \\
        S_{m}(t) &= S_{m-2}(p_{m}t)^{2} \cdot S_{m-2}((1-4p_{m})t) \cdot S_{m-2}(p_{m}t)^{2},
    \end{align}

where the coefficient is :math:`p_{m} = 1 / (4 - \sqrt[m - 1]{4})`. The :math:`m^\text{th}`
order, :math:`n`-step Suzuki-Trotter approximation is then defined as:

.. math::

    e^{iHt} \approx \left [S_{m}(t / n)  \right ]^{n}.

For more details see `J. Math. Phys. 32, 400 (1991) <https://pubs.aip.org/aip/jmp/article-abstract/32/2/400/229229>`_.

Args:
    vibration_ham (:class:`~.pennylane.estimator.compact_hamiltonian.VibrationalHamiltonian`): a real space vibrational
        Hamiltonian to be approximately exponentiated
    num_steps (int): number of Trotter steps to perform
    order (int): order of the approximation, must be ``1`` or an even number
    phase_grad_precision (float | None): precision for the phase gradient calculation
    coeff_precision (float | None): precision for the loading of coefficients
    wires (list[int] | None): the wires on which the operator acts

Raises:
    TypeError: if ``vibration_ham`` is not an instance of :class:`~.VibrationalHamiltonian`
    ValueError: if ``num_steps`` is not a positive integer
    ValueError: if ``order`` is not 1 or a positive even integer
    ValueError: if the number of wires provided does not match the number of wires expected for the operation

Resources:
    The resources are defined according to the recursive formula presented above.
    The number of times an operator :math:`e^{itO_{j}}` is applied depends on the
    number of Trotter steps (`n`) and the order of the approximation (`m`) and is given by:

    .. math::

        C_{O_j} = 2 \cdot n \cdot 5^{\frac{m}{2} - 1}.

    Furthermore, because of the symmetric form of the recursive formula, the first and last terms get grouped.
    This reduces the counts for those terms to:

    .. math::

        \begin{align}
            C_{O_{0}} &= n \cdot 5^{\frac{m}{2} - 1} + 1,  \\
            C_{O_{N}} &= n \cdot 5^{\frac{m}{2} - 1}.
        \end{align}

    The resources for a single step expansion of vibrational Hamiltonian are calculated based on
    `arXiv:2504.10602 <https://arxiv.org/pdf/2504.10602>`_.

.. seealso::
    :class:`~.estimator.compact_hamiltonian.VibrationalHamiltonian`

.. seealso:: :class:`~.TrotterProduct`

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> num_steps, order = (10, 2)
>>> vibration_ham = qre.VibrationalHamiltonian(num_modes=2, grid_size=4, taylor_degree=2)
>>> res = qre.estimate(qre.TrotterVibrational(vibration_ham, num_steps, order))
>>> print(res)
--- Resources: ---
 Total wires: 83
    algorithmic wires: 8
    allocated wires: 75
         zero state: 75
         any state: 0
 Total gates : 2.195E+5
  'Toffoli': 4.160E+4,
  'T': 749,
  'CNOT': 5.432E+4,
  'X': 1.216E+3,
  'Z': 1,
  'S': 1,
  'Hadamard': 1.216E+5

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * vibration_ham (:class:`~.pennylane.estimator.templates.compact_hamiltonian.VibrationalHamiltonian`): a real space vibrational
          Hamiltonian to be approximately exponentiated.
        * num_steps (int): number of Trotter steps to perform
        * order (int): order of the approximation, must be 1 or even
        * phase_grad_precision (float): precision for the phase gradient calculation,
        * coeff_precision (float): precision for the loading of coefficients,

### `resource_rep`

```python
def resource_rep(cls, vibration_ham: VibrationalHamiltonian, num_steps: int, order: int, phase_grad_precision: float | None=None, coeff_precision: float | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    vibration_ham (:class:`~.pennylane.estimator.templates.compact_hamiltonian.VibrationalHamiltonian`): a real space vibrational
        Hamiltonian to be approximately exponentiated.
    num_steps (int): number of Trotter steps to perform
    order (int): order of the approximation, must be 1 or even
    phase_grad_precision (float | None): precision for the phase gradient calculation
    coeff_precision (float | None): precision for the loading of coefficients

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, vibration_ham: VibrationalHamiltonian, num_steps: int, order: int, phase_grad_precision: float | None=None, coeff_precision: float | None=None) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a quantum gate
and the number of times it occurs in the decomposition.

Args:
    vibration_ham (:class:`~.pennylane.estimator.templates.compact_hamiltonian.VibrationalHamiltonian`): a real space vibrational
        Hamiltonian to be approximately exponentiated.
    num_steps (int): number of Trotter steps to perform
    order (int): order of the approximation, must be 1 or even
    phase_grad_precision (float | None): precision for the phase gradient calculation
    coeff_precision (float | None): precision for the loading of coefficients

Resources:
    The resources are defined according to the recursive formula presented above.
    The number of times an operator, :math:`e^{itO_{j}}`, is applied depends on the
    number of Trotter steps (`n`) and the order of the approximation (`m`) and is given by:

    .. math::

        C_{O_j} = 2 \cdot n \cdot 5^{\frac{m}{2} - 1}.

    Furthermore, because of the symmetric form of the recursive formula, the first and last terms get grouped.
    This reduces the counts for those terms to:

    .. math::

        \begin{align}
            C_{O_{0}} &= n \cdot 5^{\frac{m}{2} - 1} + 1,  \\
            C_{O_{N}} &= n \cdot 5^{\frac{m}{2} - 1}.
        \end{align}

    The resources for a single step expansion of vibrational Hamiltonian are calculated based on
    `arXiv:2504.10602 <https://arxiv.org/pdf/2504.10602>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `TrotterVibronic`

```python
class TrotterVibronic(ResourceOperator)
```

An operation representing the Suzuki-Trotter product approximation for the complex matrix
exponential of a real-space vibronic Hamiltonian.

The Suzuki-Trotter product formula provides a method to approximate the matrix exponential of
Hamiltonian expressed as a linear combination of terms which in general do not commute.
Consider the Hamiltonian :math:`H = \Sigma^{N}_{j=0} O_{j}`: the product formula is constructed using
symmetrized products of the terms in the Hamiltonian. The symmetrized products of order
:math:`m \in [1, 2, 4, ..., 2k]` with :math:`k \in \mathbb{N}` are given by:

.. math::

    \begin{align}
        S_{1}(t) &= \Pi_{j=0}^{N} \ e^{i t O_{j}} \\
        S_{2}(t) &= \Pi_{j=0}^{N} \ e^{i \frac{t}{2} O_{j}} \cdot \Pi_{j=N}^{0} \ e^{i \frac{t}{2} O_{j}} \\
        &\vdots \\
        S_{m}(t) &= S_{m-2}(p_{m}t)^{2} \cdot S_{m-2}((1-4p_{m})t) \cdot S_{m-2}(p_{m}t)^{2},
    \end{align}

where the coefficient is :math:`p_{m} = 1 / (4 - \sqrt[m - 1]{4})`. The :math:`m^{\text{th}}`
order, :math:`n`-step Suzuki-Trotter approximation is then defined as:

.. math::

    e^{iHt} \approx \left [S_{m}(t / n)  \right ]^{n}.

For more details see `J. Math. Phys. 32, 400 (1991) <https://pubs.aip.org/aip/jmp/article-abstract/32/2/400/229229>`_.

Args:
    vibronic_ham (:class:`~.pennylane.estimator.compact_hamiltonian.VibronicHamiltonian`): a real-space vibronic
        Hamiltonian to be approximately exponentiated
    num_steps (int): number of Trotter steps to perform
    order (int): order of the approximation, must be ``1`` or an even number
    phase_grad_precision (float | None): precision for the phase gradient calculation
    coeff_precision (float | None): precision for the loading of coefficients
    wires (list[int] | None): the wires on which the operator acts.

Raises:
    TypeError: if ``vibronic_ham`` is not an instance of :class:`~.VibronicHamiltonian`
    ValueError: if ``num_steps`` is not a positive integer
    ValueError: if ``order`` is not 1 or a positive even integer
    ValueError: if the number of wires provided does not match the number of wires expected by the operator

Resources:
    The resources are defined according to the recursive formula presented above.
    The number of times an operator :math:`e^{itO_{j}}` is applied depends on the
    number of Trotter steps (`n`) and the order of the approximation (`m`) and is given by:

    .. math::

        C_{O_j} = 2 \cdot n \cdot 5^{\frac{m}{2} - 1}.

    Furthermore, because of the symmetric form of the recursive formula, the first and last terms get grouped.
    This reduces the counts for those terms to:

    .. math::

        \begin{align}
            C_{O_{0}} &= n \cdot 5^{\frac{m}{2} - 1} + 1,  \\
            C_{O_{N}} &= n \cdot 5^{\frac{m}{2} - 1}.
        \end{align}

    The resources for a single step expansion of real-space vibronic Hamiltonian are calculated
    based on `arXiv:2411.13669 <https://arxiv.org/abs/2411.13669>`_.

.. seealso::
    :class:`~.estimator.compact_hamiltonian.VibronicHamiltonian`

.. seealso:: :class:`~.TrotterProduct`

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> num_steps, order = (10, 2)
>>> vibronic_ham = qre.VibronicHamiltonian(num_modes=2, num_states=4, grid_size=4, taylor_degree=2)
>>> res = qre.estimate(qre.TrotterVibronic(vibronic_ham, num_steps, order))
>>> print(res)
--- Resources: ---
 Total wires: 85
    algorithmic wires: 10
    allocated wires: 75
         zero state: 75
         any state: 0
 Total gates : 2.288E+5
  'Toffoli': 4.232E+4,
  'T': 749,
  'CNOT': 6.056E+4,
  'X': 1.456E+3,
  'Z': 1,
  'S': 1,
  'Hadamard': 1.237E+5

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * vibronic_ham (:class:`~.pennylane.estimator.templates.compact_hamiltonian.VibronicHamiltonian`): a real-space vibronic
          Hamiltonian to be approximately exponentiated
        * num_steps (int): number of Trotter steps to perform
        * order (int): order of the approximation, must be 1 or even
        * phase_grad_precision (float): precision for the phase gradient calculation
        * coeff_precision (float): precision for the loading of coefficients

### `resource_rep`

```python
def resource_rep(cls, vibronic_ham: VibronicHamiltonian, num_steps: int, order: int, phase_grad_precision: float | None=None, coeff_precision: float | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    vibronic_ham (:class:`~.pennylane.estimator.templates.compact_hamiltonian.VibronicHamiltonian`): a real space vibronic
        Hamiltonian to be approximately exponentiated
    num_steps (int): number of Trotter steps to perform
    order (int): order of the approximation, must be 1 or even
    phase_grad_precision (float | None): precision for the phase gradient calculation
    coeff_precision (float | None): precision for the loading of coefficients
Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, vibronic_ham: VibronicHamiltonian, num_steps: int, order: int, phase_grad_precision: float | None, coeff_precision: float | None) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a quantum gate
and the number of times it occurs in the decomposition.

Args:
    vibronic_ham (:class:`~.pennylane.estimator.templates.compact_hamiltonian.VibronicHamiltonian`): a real space vibronic
        Hamiltonian to be approximately exponentiated
    num_steps (int): number of Trotter steps to perform
    order (int): order of the approximation, must be 1 or even
    phase_grad_precision (float | None): precision for the phase gradient calculation
    coeff_precision (float | None): precision for the loading of coefficients

Resources:
    The resources are defined according to the recursive formula presented above.
    The number of times an operator, :math:`e^{itO_{j}}`, is applied depends on the
    number of Trotter steps (`n`) and the order of the approximation (`m`) and is given by:

    .. math::

        C_{O_j} = 2 \cdot n \cdot 5^{\frac{m}{2} - 1}.

    Furthermore, because of the symmetric form of the recursive formula, the first and last terms get grouped.
    This reduces the counts for those terms to:

    .. math::

        \begin{align}
            C_{O_{0}} &= n \cdot 5^{\frac{m}{2} - 1} + 1,  \\
            C_{O_{N}} &= n \cdot 5^{\frac{m}{2} - 1}.
        \end{align}

    The resources for a single step expansion of real-space vibronic Hamiltonian are calculated
    based on `arXiv:2411.13669 <https://arxiv.org/abs/2411.13669>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `TrotterPauli`

```python
class TrotterPauli(ResourceOperator)
```

A resource operation representing the Suzuki-Trotter product approximation for the complex matrix
exponential of a Hamiltonian represented as a linear combination of tensor products of Pauli operators.

The Suzuki-Trotter product formula provides a method to approximate the matrix exponential of
Hamiltonian expressed as a linear combination of terms which in general do not commute.
For instance, in the Hamiltonian :math:`H = \Sigma^{N}_{j=0} \alpha_{j} \cdot O_{j}`, the product formula is
constructed using symmetrized products of the terms in the Hamiltonian. The symmetrized products
of order :math:`m \in [1, 2, 4, ..., 2k]` with :math:`k \in \mathbb{N}` are given by:

.. math::

    \begin{align}
        S_{1}(t) &= \Pi_{j=0}^{N} \ e^{i t \alpha_{j} O_{j}} \\
        S_{2}(t) &= \Pi_{j=0}^{N} \ e^{i \frac{t}{2} \alpha_{j} O_{j}} \cdot \Pi_{j=N}^{0} \ e^{i \frac{t}{2} \alpha_{j} O_{j}} \\
        &\vdots \\
        S_{m}(t) &= S_{m-2}(p_{m}t)^{2} \cdot S_{m-2}((1-4p_{m})t) \cdot S_{m-2}(p_{m}t)^{2},
    \end{align}

where the coefficient is :math:`p_{m} = 1 / (4 - \sqrt[m - 1]{4})`. The :math:`m^{\text{th}}`
order, :math:`n`-step Suzuki-Trotter approximation is then defined as:

.. math::

    e^{iHt} \approx \left [S_{m}(t / n)  \right ]^{n}.

For more details see `J. Math. Phys. 32, 400 (1991) <https://pubs.aip.org/aip/jmp/article-abstract/32/2/400/229229>`_.

Args:
    pauli_ham (:class:`~.pennylane.estimator.compact_hamiltonian.PauliHamiltonian`):
        the Hamiltonian to be approximately exponentiated
    num_steps (int): number of Trotter steps to perform
    order (int): order of the approximation, must be ``1`` or an even number
    wires (WiresLike | None): the wires on which the operator acts

Raises:
    TypeError: if ``pauli_ham`` is not an instance of :class:`~.PauliHamiltonian`
    ValueError: if ``num_steps`` is not a positive integer
    ValueError: if ``order`` is not 1 or a positive even integer
    ValueError: if the number of wires provided does not match the wires expected by the operator

Resources:
    The resources are defined according to the recursive formula presented above.
    The number of times an operator :math:`e^{itO_{j}}` is applied depends on the
    number of Trotter steps (`n`) and the order of the approximation (`m`) as:

    .. math:: C_{O_j} = 2 \cdot n \cdot 5^{\frac{m}{2} - 1}

    Furthermore, because of the symmetric form of the recursive formula, the first and last terms are grouped.
    This reduces the counts for those terms to:

    .. math::

        \begin{align}
            C_{O_{0}} &= n \cdot 5^{\frac{m}{2} - 1} + 1,  \\
            C_{O_{N}} &= n \cdot 5^{\frac{m}{2} - 1}.
        \end{align}

.. seealso:: :class:`~.estimator.compact_hamiltonian.PauliHamiltonian`, :class:`~.TrotterProduct`

**Example**

The resources for this operation are computed using the code below.

>>> pauli_terms = {"X":10, "XX":5, "XXXX":3, "YY": 5, "ZZ":5, "Z": 2}
>>> pauli_ham = qre.PauliHamiltonian(num_qubits=10, pauli_terms=pauli_terms)
>>> num_steps, order = (1, 2)
>>> res = qre.estimate(qre.TrotterPauli(pauli_ham, num_steps, order))
>>> print(res)
--- Resources: ---
 Total wires: 10
   algorithmic wires: 10
   allocated wires: 0
     zero state: 0
     any state: 0
 Total gates : 2.844E+3
   'T': 2.640E+3,
   'CNOT': 96,
   'Z': 20,
   'S': 40,
   'Hadamard': 48

.. details::
    :title: Usage Details

    This example computes the resources for a Hamiltonian partitioned into commuting groups of
    Pauli terms. See :class:`~.estimator.compact_hamiltonian.PauliHamiltonian` for more
    information. Note that placing the largest commuting groups at the
    boundaries, either the beginning or the end of the list, optimizes resource reduction. This
    efficiency is achieved by merging the final operation of the Trotter step ``i`` with the initial
    operation of step ``i+1`` which effectively minimizes gate overhead.

    >>> commuting_groups = (
    ...     {"X":10, "XX":5, "XXXX":3},
    ...     {"YY": 5, "ZZ":5},
    ...     {"Z": 2},
    ... )
    >>> pauli_ham = qre.PauliHamiltonian(num_qubits=10, pauli_terms=commuting_groups)
    >>> num_steps, order = (1, 2)
    >>> res = qre.estimate(qre.TrotterPauli(pauli_ham, num_steps, order))
    >>> print(res)
    --- Resources: ---
     Total wires: 10
       algorithmic wires: 10
       allocated wires: 0
         zero state: 0
         any state: 0
     Total gates : 2.756E+3
       'T': 2.552E+3,
       'CNOT': 96,
       'Z': 20,
       'S': 40,
       'Hadamard': 48

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * pauli_ham (:class:`~.pennylane.estimator.templates.compact_hamiltonian.PauliHamiltonian`):
          The Hamiltonian to be approximately exponentiated
        * num_steps (int): number of Trotter steps to perform
        * order (int): order of the approximation, must be 1 or even.

### `resource_rep`

```python
def resource_rep(cls, pauli_ham: PauliHamiltonian, num_steps: int, order: int) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    pauli_ham (:class:`~.pennylane.estimator.templates.compact_hamiltonian.PauliHamiltonian`):
        The Hamiltonian to be approximately exponentiated
    num_steps (int): number of Trotter steps to perform
    order (int): order of the approximation, must be 1 or even.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, pauli_ham: PauliHamiltonian, num_steps: int, order: int) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a
quantum gate and the number of times it occurs in the decomposition.

Args:
    pauli_ham (:class:`~.pennylane.estimator.templates.compact_hamiltonian.PauliHamiltonian`):
        The Hamiltonian to be approximately exponentiated
    num_steps (int): number of Trotter steps to perform
    order (int): order of the approximation, must be 1 or even.

Resources:
    The resources are defined according to the recursive formula presented above.
    The number of times an operator :math:`e^{itO_{j}}` is applied depends on the
    number of Trotter steps (`n`) and the order of the approximation (`m`) as:

    .. math:: C_{O_j} = 2 \cdot n \cdot 5^{\frac{m}{2} - 1}

    Furthermore, because of the symmetric form of the recursive formula, the first and last terms are grouped.
    This reduces the counts for those terms to:

    .. math::

        \begin{align}
            C_{O_{0}} &= n \cdot 5^{\frac{m}{2} - 1} + 1,  \\
            C_{O_{N}} &= n \cdot 5^{\frac{m}{2} - 1}.
        \end{align}

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.
