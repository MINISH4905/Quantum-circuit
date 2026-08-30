---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/math/decomposition.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/math/decomposition.py
license: Apache-2.0
---

## Module `pennylane/math/decomposition.py`

Utility functions for decompositions are available from ``qp.math.decomposition``.

## `zyz_rotation_angles`

```python
def zyz_rotation_angles(U, return_global_phase=False)
```

Compute the rotation angles :math:`\phi`, :math:`\theta`, and :math:`\omega` and the
phase :math:`\alpha` of a 2x2 unitary matrix as a product of Z and Y rotations in the form
:math:`e^{i\alpha} RZ(\omega) RY(\theta) RZ(\phi)`

Args:
    U (array): 2x2 unitary matrix
    return_global_phase (bool): if True, returns the global phase as well.

Returns:
    tuple: The rotation angles :math:`\phi`, :math:`\theta`, and :math:`\omega` and the
    global phase :math:`\alpha` if ``return_global_phase=True``.

## `xyx_rotation_angles`

```python
def xyx_rotation_angles(U, return_global_phase=False)
```

Compute the rotation angles :math:`\lambda`, :math:`\theta`, and :math:`\phi` and the
phase :math:`\alpha` of a 2x2 unitary matrix as a product of X and Y rotations in the form
:math:`e^{i\alpha} RX(\phi) RY(\theta) RX(\lambda)`.

Args:
    U (array): 2x2 unitary matrix
    return_global_phase (bool): if True, returns the global phase as well.

Returns:
    tuple: The rotation angles :math:`\lambda`, :math:`\theta`, and :math:`\phi` and the
    global phase :math:`\alpha` if ``return_global_phase=True``.

## `xzx_rotation_angles`

```python
def xzx_rotation_angles(U, return_global_phase=False)
```

Compute the rotation angles :math:`\lambda`, :math:`\theta`, and :math:`\phi` and the
phase :math:`\alpha` of a 2x2 unitary matrix as a product of X and Z rotations in the form
:math:`e^{i\alpha} RX(\phi) RZ(\theta) RX(\lambda)`.

Args:
    U (array): 2x2 unitary matrix
    return_global_phase (bool): if True, returns the global phase as well.

Returns:
    tuple: The rotation angles :math:`\lambda`, :math:`\theta`, and :math:`\phi` and the
    global phase :math:`\alpha` if ``return_global_phase=True``.

## `zxz_rotation_angles`

```python
def zxz_rotation_angles(U, return_global_phase=False)
```

Compute the rotation angles :math:`\lambda`, :math:`\theta`, and :math:`\phi` and the
phase :math:`\alpha` of a 2x2 unitary matrix as a product of Z and X rotations in the form
:math:`e^{i\alpha} RZ(\phi) RX(\theta) RZ(\lambda)`.

Args:
    U (array): 2x2 unitary matrix
    return_global_phase (bool): if True, returns the global phase as well.

Returns:
    tuple: The rotation angles :math:`\lambda`, :math:`\theta`, and :math:`\phi` and the
    global phase :math:`\alpha` if ``return_global_phase=True``.

## `su2su2_to_tensor_products`

```python
def su2su2_to_tensor_products(U)
```

Given a matrix :math:`U = A \otimes B` in SU(2) x SU(2), extract A and B

This process has been described in detail in the Appendix of Coffey & Deiotte
https://link.springer.com/article/10.1007/s11128-009-0156-3

## `decomp_int_to_powers_of_two`

```python
def decomp_int_to_powers_of_two(k: int, n: int) -> list[int]
```

Decompose an integer :math:`k<=2^{n-1}` into additions and subtractions of the
smallest-possible number of powers of two.

Args:
    k (int): Integer to be decomposed
    n (int): Number of bits to consider

Returns:
    list[int]: A list with length ``n``, with entry :math:`c_i` at position :math:`i`.

This function is documented in ``pennylane/ops/qubit/pcphase_decomposition.md``.

As an example, consider the number
:math:`k=121_{10}=01111001_2`, which can be (trivially) decomposed into a sum of
five powers of two by reading off the bits:
:math:`k = 2^6 + 2^5 + 2^4 + 2^3 + 2^0 = 64 + 32 + 16 + 8 + 1`.
The decomposition here, however, allows for minus signs and achieves the decomposition
:math:`k = 2^7 - 2^3 + 2^0 = 128 - 8 + 1`, which only requires three powers of two.

## `givens_decomposition`

```python
def givens_decomposition(unitary)
```

Decompose a unitary into a sequence of Givens rotation gates with phase shifts and a diagonal phase matrix.

Args:
    unitary (tensor): unitary matrix on which decomposition will be performed

Returns:
    (tensor_like, list[(tensor_like, tuple)]): diagonal elements of the phase matrix :math:`D` and Givens rotation matrix :math:`T` with their indices

Raises:
    ValueError: if the provided matrix is not square.

This decomposition is based on the construction scheme given in `Optica, 3, 1460 (2016) <https://opg.optica.org/optica/fulltext.cfm?uri=optica-3-12-1460&id=355743>`_\ ,
which allows one to write any :math:`N\times N` unitary matrix :math:`U` as:

.. math::

    U = D \left(\prod_{m \in G} T_m(\theta, \phi)\right),

where :math:`D` is a diagonal phase matrix, :math:`T_m(\theta, \phi)` is the Givens rotation
(with phase shift) between matrix indices :math:`m` and :math:`m+1` (zero-based indexing),
and :math:`G` defines the ordered sequence of the Givens rotations. The explicit form of the
Givens rotation with phase shift reads:

.. math:: T(\theta, \phi) = \begin{bmatrix}
                                \mathbb{I}_{m} & 0 & 0 & 0 \\
                                0 & e^{i \phi} \cos(\theta) & -\sin(\theta) & 0 \\
                                0 & e^{i \phi} \sin(\theta) & \cos(\theta) & 0 \\
                                0 & 0 & 0 & \mathbb{I}_{N-m-2}
                            \end{bmatrix},

where :math:`\theta \in [0, \pi/2]` is the angle of rotation
and :math:`\phi \in [0, 2 \pi]` represents the phase shift.

For real-valued matrices with unit determinant, i.e. special orthogonal :math:`U`,
all phase angles :math:`\phi` vanish and :math:`D` can be fixed to the identity,
absorbing its phases :math:`\pm 1` (with an even number of :math:`-1`\ s due to the
determinant constraint) into the :math:`T` matrices.
Whether :math:`U` is orthogonal is inferred from the data type of ``unitary``.
If the determinant of an orthogonal :math:`U` is negative, this will show as a single
negative phase in the first output value of ``givens_decomposition``.

**Example**

.. code-block:: python

    unitary = np.array([[ 0.73678+0.27511j, -0.5095 +0.10704j, -0.06847+0.32515j],
                        [-0.21271+0.34938j, -0.38853+0.36497j,  0.61467-0.41317j],
                        [ 0.41356-0.20765j, -0.00651-0.66689j,  0.32839-0.48293j]])

    phase_mat, ordered_rotations = givens_decomposition(unitary)

>>> phase_mat
tensor([-0.20604358+0.9785369j , -0.82993272+0.55786114j,
        0.56230612-0.82692833j], requires_grad=True)
>>> ordered_rotations
[(tensor([[-0.65087861-0.63937521j, -0.40933651-0.j        ],
        [-0.29201359-0.28685265j,  0.91238348-0.j        ]], requires_grad=True),
(0, 1)),
(tensor([[ 0.47970366-0.33308926j, -0.8117487 -0.j        ],
        [ 0.66677093-0.46298215j,  0.5840069 -0.j        ]], requires_grad=True),
(1, 2)),
(tensor([[ 0.36147547+0.73779454j, -0.57008306-0.j        ],
        [ 0.2508207 +0.51194108j,  0.82158706-0.j        ]], requires_grad=True),
(0, 1))]

.. details::
    :title: Theory and Pseudocode

    **Pseudocode**

    The algorithm that implements the decomposition is the following:

    .. code-block:: python

        def givens_decomposition(U):
            for i in range(1, N):
                if i % 2:
                    for j in range(0, i):
                        # Find T^-1(i-j, i-j+1) matrix that nulls element (N-j, i-j) of U
                        # Update U = U @ T^-1(i-j, i-j+1)
                else:
                    for j in range(i):
                        # Find T(N+j-i-1, N+j-i) matrix that nulls element (N+j-i, j) of U
                        # Update U = T(N+j-i-1, N+j-i) @ U

            if real_data_type:
                # Absorb the diagonal phases, which can only be 1s and an even number of
                # -1s, in the T gates. Adjust ordering and/or matrices of left-applied
                # and right-applied T matrices so that they make up U instead of U^{-1}.
            else:
                # Commute the diagonal phases from between the left-applied and right-applied
                # T matrices to the left. Adjust ordering and/or matrices of left-applied
                # and right-applied T matrices so that they make up U instead of U^{-1}.
