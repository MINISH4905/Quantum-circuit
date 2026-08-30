---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/optimization/single_qubit_fusion.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/optimization/single_qubit_fusion.py
license: Apache-2.0
---

## Module `pennylane/transforms/optimization/single_qubit_fusion.py`

Transform for fusing sequences of single-qubit gates.

## `single_qubit_fusion`

```python
def single_qubit_fusion(tape: QuantumScript, atol: float | None=1e-08, exclude_gates: list[str] | None=None) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Quantum function transform to fuse together groups of single-qubit
operations into a general single-qubit unitary operation (:class:`~.Rot`).

Fusion is performed only between gates that implement the property
``single_qubit_rot_angles``. Any sequence of two or more single-qubit gates
(on the same qubit) with that property defined will be fused into one ``Rot``.

Args:
    tape (QNode or QuantumTape or Callable): A quantum circuit (QNode or quantum function).
    atol (float): An absolute tolerance for which to apply a rotation after
        fusion. After fusion of gates, if the fused angles :math:`\theta` are such that
        :math:`|\theta|\leq \text{atol}`, no rotation gate will be applied.
    exclude_gates (None or list[str]): A list of gates that should be excluded
        from full fusion. If set to ``None``, all single-qubit gates that can
        be fused will be fused.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], Callable]:
    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

**Example**

You can apply the transform directly on :class:`QNode`.

.. code-block:: python

    import pennylane as qp

    dev = qp.device('default.qubit', wires=1)

    @qp.transforms.single_qubit_fusion
    @qp.qnode(device=dev)
    def qfunc(r1, r2):
        qp.Hadamard(wires=0)
        qp.Rot(*r1, wires=0)
        qp.Rot(*r2, wires=0)
        qp.RZ(r1[0], wires=0)
        qp.RZ(r2[0], wires=0)
        return qp.expval(qp.X(0))

>>> print(qp.draw(qfunc)([0.1, 0.2, 0.3], [0.4, 0.5, 0.6]))
0: ──Rot(3.57,2.09,2.05)──GlobalPhase(-1.57)─┤  <X>

The single qubit gates are fused before execution.

.. note::

    - The fused angles between two sets of rotation angles are not always defined uniquely because Euler angles are not unique for some rotations. ``single_qubit_fusion`` makes a particular choice in this case.
    - The order of the gates resulting from the fusion may be different depending on whether program capture is enabled or not. This only impacts the order of operations that do not share any wires, so the correctness of the circuit is not affected.

.. warning::

    - This function is not differentiable everywhere. It has singularities for specific input rotation angles, where the derivative will be ``NaN``.
    - This function is numerically unstable at its singular points. It is recommended to use it with 64-bit floating point precision.

.. details::
    :title: Usage Details

    Consider the following quantum function.

    .. code-block:: python

        def qfunc(r1, r2):
            qp.Hadamard(wires=0)
            qp.Rot(*r1, wires=0)
            qp.Rot(*r2, wires=0)
            qp.RZ(r1[0], wires=0)
            qp.RZ(r2[0], wires=0)
            return qp.expval(qp.X(0))

    The circuit before optimization:

    >>> qnode = qp.QNode(qfunc, dev)
    >>> print(qp.draw(qnode)([0.1, 0.2, 0.3], [0.4, 0.5, 0.6]))
    0: ──H──Rot(0.10,0.20,0.30)──Rot(0.40,0.50,0.60)──RZ(0.10)──RZ(0.40)─┤  <X>

    Full single-qubit gate fusion allows us to collapse this entire sequence into a
    single ``qp.Rot`` rotation gate.

    >>> optimized_qfunc = qp.transforms.single_qubit_fusion(qfunc)
    >>> optimized_qnode = qp.QNode(optimized_qfunc, dev)
    >>> print(qp.draw(optimized_qnode)([0.1, 0.2, 0.3], [0.4, 0.5, 0.6]))
    0: ──Rot(3.57,2.09,2.05)──GlobalPhase(-1.57)─┤  <X>

.. details::
    :title: Derivation
    :href: derivation

    The matrix for an individual rotation is given by

    .. math::

        R(\phi_j,\theta_j,\omega_j)
        &= \begin{bmatrix}
        e^{-i(\phi_j+\omega_j)/2}\cos(\theta_j/2) & -e^{i(\phi_j-\omega_j)/2}\sin(\theta_j/2)\\
        e^{-i(\phi_j-\omega_j)/2}\sin(\theta_j/2) & e^{i(\phi_j+\omega_j)/2}\cos(\theta_j/2)
        \end{bmatrix}\\
        &= \begin{bmatrix}
        e^{-i\alpha_j}c_j & -e^{i\beta_j}s_j \\
        e^{-i\beta_j}s_j & e^{i\alpha_j}c_j
        \end{bmatrix},

    where we introduced abbreviations :math:`\alpha_j,\beta_j=\frac{\phi_j\pm\omega_j}{2}`,
    :math:`c_j=\cos(\theta_j / 2)` and :math:`s_j=\sin(\theta_j / 2)` for notational brevity.
    The upper left entry of the matrix product
    :math:`R(\phi_2,\theta_2,\omega_2)R(\phi_1,\theta_1,\omega_1)` reads

    .. math::

        x = e^{-i(\alpha_2+\alpha_1)} c_2 c_1 - e^{i(\beta_2-\beta_1)} s_2 s_1

    and should equal :math:`e^{-i\alpha_f}c_f` for the fused rotation angles.
    This means that we can obtain :math:`\theta_f` from the magnitude of the matrix product
    entry above, choosing :math:`c_f=\cos(\theta_f / 2)` to be non-negative:

    .. math::

        c_f = |x| &=
        \left|
        e^{-i(\alpha_2+\alpha_1)} c_2 c_1
        -e^{i(\beta_2-\beta_1)} s_2 s_1
        \right| \\
        &= \sqrt{c_1^2 c_2^2 + s_1^2 s_2^2 - 2 c_1 c_2 s_1 s_2 \cos(\omega_1 + \phi_2)}.

    Now we again make a choice and pick :math:`\theta_f` to be non-negative:

    .. math::

        \theta_f = 2\arccos(|x|).

    We can also extract the angle combination :math:`\alpha_f` from :math:`x` via
    :math:`\operatorname{arg}(x)`, which can be readily computed with :math:`\arctan`:

    .. math::

        \alpha_f = -\arctan\left(
        \frac{-c_1c_2\sin(\alpha_1+\alpha_2)-s_1s_2\sin(\beta_2-\beta_1)}
        {c_1c_2\cos(\alpha_1+\alpha_2)-s_1s_2\cos(\beta_2-\beta_1)}
        \right).

    We can use the standard numerical function ``arctan2``, which
    computes :math:`\arctan(x_1/x_2)` from :math:`x_1` and :math:`x_2` while handling
    special points suitably, to obtain the argument of the underlying complex number
    :math:`x_2 + x_1 i`.

    Finally, to obtain :math:`\beta_f`, we need a second element of the matrix product from
    above. We compute the lower-left entry to be

    .. math::

        y = e^{-i(\beta_2+\alpha_1)} s_2 c_1 + e^{i(\alpha_2-\beta_1)} c_2 s_1,

    which should equal :math:`e^{-i \beta_f}s_f`. From this, we can compute

    .. math::

        \beta_f = -\arctan\left(
        \frac{-c_1s_2\sin(\alpha_1+\beta_2)+s_1c_2\sin(\alpha_2-\beta_1)}
        {c_1s_2\cos(\alpha_1+\beta_2)+s_1c_2\cos(\alpha_2-\beta_1)}
        \right).

    From this, we may extract

    .. math::

        \phi_f = \alpha_f + \beta_f\qquad
        \omega_f = \alpha_f - \beta_f

    and are done.

    **Special cases:**

    There are a number of special cases for which we can skip the computation above and
    can combine rotation angles directly.

    1. If :math:`\omega_1=\phi_2=0`, we can simply merge the ``RY`` rotation angles
       :math:`\theta_j` and obtain :math:`(\phi_1, \theta_1+\theta_2, \omega_2)`.

    2. If :math:`\theta_j=0`, we can merge the two ``RZ`` rotations of the same ``Rot``
       and obtain :math:`(\phi_1+\omega_1+\phi_2, \theta_2, \omega_2)` or
       :math:`(\phi_1, \theta_1, \omega_1+\phi_2+\omega_2)`. If both ``RY`` angles vanish
       we get :math:`(\phi_1+\omega_1+\phi_2+\omega_2, 0, 0)`.

    Note that this optimization is not performed for differentiable input parameters,
    in order to maintain differentiability.

    **Mathematical properties:**

    All functions above are well-defined on the domain we are using them on,
    if we handle :math:`\arctan` via standard numerical implementations such as
    ``np.arctan2``.
    Based on the choices we made in the derivation above, the fused angles will lie in
    the intervals

    .. math::

        \phi_f, \omega_f \in [-\pi, \pi],\quad \theta_f \in [0, \pi].

    Close to the boundaries of these intervals, ``single_qubit_fusion`` exhibits
    discontinuities, depending on the combination of input angles.
    These discontinuities also lead to singular (non-differentiable) points as discussed below.

    **Differentiability:**

    The function derived above is differentiable almost everywhere.
    In particular, there are two problematic scenarios at which the derivative is not defined.
    First, the square root is not differentiable at :math:`0`, making all input angles with
    :math:`|x|=0` singular. Second, :math:`\arccos` is not differentiable at :math:`1`, making
    all input angles with :math:`|x|=1` singular.
