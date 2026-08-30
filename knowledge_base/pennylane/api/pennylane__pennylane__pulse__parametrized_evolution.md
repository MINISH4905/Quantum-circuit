---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/pulse/parametrized_evolution.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/pulse/parametrized_evolution.py
license: Apache-2.0
---

## Module `pennylane/pulse/parametrized_evolution.py`

This file contains the ``ParametrizedEvolution`` operator.

## `ParametrizedEvolution`

```python
class ParametrizedEvolution(Operation)
```

ParametrizedEvolution(H, params=None, t=None, return_intermediate=False, complementary=False, id=None, **odeint_kwargs)

Parametrized evolution gate, created by passing a :class:`~.ParametrizedHamiltonian` to
the :func:`~.pennylane.evolve` function

For a time-dependent Hamiltonian of the form

.. math:: H(\{v_j\}, t) = H_\text{drift} + \sum_j f_j(v_j, t) H_j

it implements the corresponding time-evolution operator :math:`U(t_0, t_1)`, which is the
solution to the time-dependent Schrodinger equation.

.. math:: \frac{d}{dt}U(t) = -i H(\{v_j\}, t) U(t).

Under the hood, it is using a numerical ordinary differential equation (ODE) solver. It requires ``jax``,
and will not work with other machine learning frameworks typically encountered in PennyLane.

Args:
    H (ParametrizedHamiltonian): Hamiltonian to evolve
    params (Optional[list]): trainable parameters, passed as list where each element corresponds to
        the parameters of a scalar-valued function of the Hamiltonian being evolved.
    t (Union[float, List[float]]): If a float, it corresponds to the duration of the evolution.
        If a list of floats, the ODE solver will use all the provided time values, and
        perform intermediate steps if necessary. It is recommended to just provide a start
        and end time unless matrices of the time evolution at intermediate times need
        to be computed. Note that such absolute times only have meaning within an instance of
        ``ParametrizedEvolution`` and will not affect other gates.
        To return the matrix at intermediate evolution times, activate ``return_intermediate``
        (see below).
    id (str or None): id for the scalar product operator. Default is None.

Keyword Args:
    atol (float, optional): Absolute error tolerance for the ODE solver. Defaults to ``1.4e-8``.
    rtol (float, optional): Relative error tolerance for the ODE solver. The error is estimated
        from comparing a 4th and 5th order Runge-Kutta step in the Dopri5 algorithm. This error
        is guaranteed to stay below ``tol = atol + rtol * abs(y)`` through adaptive step size
        selection. Defaults to 1.4e-8.
    mxstep (int, optional): maximum number of steps to take for each timepoint for the
        ODE solver. Defaults to ``jnp.inf``.
    hmax (float, optional): maximum step size allowed for the ODE solver. Defaults to ``jnp.inf``.
    return_intermediate (bool): Whether or not the ``matrix`` method returns all intermediate
        solutions of the time evolution at the times provided in ``t = [t_0,...,t_f]``.
        If ``False`` (the default), only the matrix for the full time evolution is returned.
        If ``True``, all solutions including the initial condition are returned;
        when used in a circuit, this results in ``ParametrizedEvolution`` being a broadcasted
        operation, see the usage details ("Computing intermediate time evolution") below.
    complementary (bool): Whether or not to compute the complementary time evolution when using
        ``return_intermediate=True`` (ignored otherwise).
        If ``False`` (the default), the usual solutions to the Schrodinger equation
        :math:`\{U(t_0, t_0), U(t_0, t_1),\dots, U(t_0, t_f)\}` are computed,
        where :math:`t_i` are the additional times provided in ``t``.
        If ``True``, the *remaining* time evolution to :math:`t_f` is computed instead, returning
        :math:`\{U(t_0, t_f), U(t_1, t_f),\dots, U(t_{f-1}, t_f), U(t_f, t_f)\}`.
    dense (bool): Whether the evolution should use dense matrices. Per default, this is decided by
        the number of wires, i.e. ``dense = len(wires) < 3``.

.. warning::
    The :class:`~.ParametrizedHamiltonian` must be Hermitian at all times. This is not explicitly checked
    when creating a :class:`~.ParametrizedEvolution` from the :class:`~.ParametrizedHamiltonian`.

**Example**

To create a :class:`~.ParametrizedEvolution`, we first define a :class:`~.ParametrizedHamiltonian`
describing the system, and then pass it to :func:`~pennylane.evolve`:



.. code-block:: python

    from jax import numpy as jnp

    f1 = lambda p, t: jnp.sin(p * t)
    H = f1 * qp.Y(0)

    ev = qp.evolve(H)

The initial :class:`~.ParametrizedEvolution` does not have set parameters, and so will not
have a matrix defined. To obtain an Operator with a matrix, it must be passed parameters and
a time interval:

>>> qp.matrix(ev([1.2], t=[0, 4]))
Array([[ 0.72454906+0.j, -0.6892243 +0.j],
       [ 0.6892243 +0.j,  0.72454906+0.j]], dtype=complex64)

The parameters can be updated by calling the :class:`~.ParametrizedEvolution` again with different inputs.

When calling the :class:`~.ParametrizedEvolution`, keyword arguments can be passed to specify
behaviour of the ODE solver.

The :class:`~.ParametrizedEvolution` can be implemented in a QNode:

.. code-block:: python

    import jax

    jax.config.update("jax_enable_x64", True)

    dev = qp.device("default.qubit", wires=1)
    @jax.jit
    @qp.qnode(dev, interface="jax")
    def circuit(params):
        qp.evolve(H)(params, t=[0, 10])
        return qp.expval(qp.Z(0))

>>> params = [1.2]
>>> circuit(params)
Array(0.96632722, dtype=float64)

>>> jax.grad(circuit)(params)
[Array(2.35694829, dtype=float64)]

.. note::
    In the example above, the decorator ``@jax.jit`` is used to compile this execution just-in-time. This means
    the first execution will typically take a little longer with the benefit that all following executions
    will be significantly faster, see the jax docs on jitting. JIT-compiling is optional, and one can remove
    the decorator when only single executions are of interest.

.. warning::

    The time argument ``t`` corresponds to the time window used to compute the scalar-valued
    functions present in the :class:`ParametrizedHamiltonian` class. Consequently, executing
    two ``ParametrizedEvolution`` operators using the same time window does not mean both
    operators are executed simultaneously, but rather that both evaluate their respective
    scalar-valued functions using the same time window. See Usage Details.

.. note::

    Using ``return_intermediate`` in a quantum circuit leads to broadcasted execution,
    which can lead to unintended additional computational cost.
    Also consider the usage details below.

.. details::
    :title: Usage Details

    The parameters used when calling the ``ParametrizedEvolution`` are expected to have the same order
    as the functions used to define the :class:`~.ParametrizedHamiltonian`. For example:

    .. code-block:: python3

        def f1(p, t):
            return jnp.sin(p[0] * t**2) + p[1]

        def f2(p, t):
            return p * jnp.cos(t)

        H = 2 * qp.X(0) + f1 * qp.Y(0) + f2 * qp.Z(0)
        ev = qp.evolve(H)

    >>> params = [[4.6, 2.3], 1.2]
    >>> qp.matrix(ev(params, t=0.5))
    Array([[-0.18354285-0.26303384j, -0.7271658 -0.606923j  ],
           [ 0.7271658 -0.606923j  , -0.18354285+0.26303384j]],      dtype=complex64)

    Internally the solver is using ``f1([4.6, 2.3], t)`` and ``f2(1.2, t)`` at each timestep when
    finding the matrix.

    In the case where we have defined two Hamiltonians, ``H1`` and ``H2``, and we want to find a time evolution
    where the two are driven simultaneously for some period of time, it is important that both are included in
    the same call of :func:`~.pennylane.evolve`.
    For non-commuting operations, applying ``qp.evolve(H1)(params, t=[0, 10])`` followed by
    ``qp.evolve(H2)(params, t=[0, 10])`` will **not** apply the two pulses simultaneously, despite the overlapping
    time window. Instead, it will execute ``H1`` in the ``[0, 10]`` time window, and then subsequently execute
    ``H2`` using the same time window to calculate the evolution, but without taking into account how the time
    evolution of ``H1`` affects the evolution of ``H2`` and vice versa.

    Consider two non-commuting :class:`ParametrizedHamiltonian` objects:

    .. code-block:: python

        from jax import numpy as jnp

        ops = [qp.X(0), qp.Y(1), qp.Z(2)]
        coeffs = [lambda p, t: p for _ in range(3)]
        H1 = qp.dot(coeffs, ops)  # time-independent parametrized Hamiltonian

        ops = [qp.Z(0), qp.Y(1), qp.X(2)]
        coeffs = [lambda p, t: p * jnp.sin(t) for _ in range(3)]
        H2 = qp.dot(coeffs, ops) # time-dependent parametrized Hamiltonian

    The evolutions of the :class:`ParametrizedHamiltonian` can be used in a QNode.

    .. code-block:: python

        dev = qp.device("default.qubit", wires=3)

        @qp.qnode(dev, interface="jax")
        def circuit1(params):
            qp.evolve(H1)(params, t=[0, 10])
            qp.evolve(H2)(params, t=[0, 10])
            return qp.expval(qp.Z(0) @ qp.Z(1) @ qp.Z(2))

        @qp.qnode(dev, interface="jax")
        def circuit2(params):
            qp.evolve(H1 + H2)(params, t=[0, 10])
            return qp.expval(qp.Z(0) @ qp.Z(1) @ qp.Z(2))

    In ``circuit1``, the two Hamiltonians are evolved over the same time window, but inside different operators.
    In ``circuit2``, we add the two to form a single :class:`~.ParametrizedHamiltonian`. This will combine the
    two so that the expected parameters will be ``params1 + params2`` (as an addition of ``list``).
    They can then be included inside a single :class:`~.ParametrizedEvolution`.

    The resulting evolutions of ``circuit1`` and ``circuit2`` are **not** identical:

    >>> params = jnp.array([1., 2., 3.])
    >>> circuit1(params)
    Array(-0.01542578, dtype=float64)

    >>> params = jnp.concatenate([params, params])  # H1 + H2 requires 6 parameters!
    >>> circuit2(params)
    Array(-0.78235162, dtype=float64)

    Here, ``circuit1`` is not executing the evolution of ``H1`` and ``H2`` simultaneously, but rather
    executing ``H1`` in the ``[0, 10]`` time window and then executing ``H2`` with the same time window,
    without taking into account how the time evolution of ``H1`` affects the evolution of ``H2`` and vice versa!

    One can also provide a list of time values that the ODE solver will use to calculate the evolution of the
    ``ParametrizedHamiltonian``. Keep in mind that the ODE solver uses an adaptive step size, thus
    it might use additional intermediate time values.

    .. code-block:: python

        t = jnp.arange(0., 10.1, 0.1)
        @qp.qnode(dev, interface="jax")
        def circuit(params):
            qp.evolve(H1 + H2)(params, t=t)
            return qp.expval(qp.Z(0) @ qp.Z(1) @ qp.Z(2))

    >>> circuit(params)
    Array(-0.78235162, dtype=float64)
    >>> jax.grad(circuit)(params)
    Array([-4.80708632,  3.70323783, -1.32958799, -2.40642477,  0.68105214,
        -0.52269657], dtype=float64)

    Given that we used the same time window (``[0, 10]``), the results are the same as before.

    **Computing intermediate time evolution**

    As discussed above, the ODE solver will evaluate the Schrodinger equation at
    intermediate times in any case. By passing additional time values explicitly in the time
    window ``t`` and setting ``return_intermediate=True``, the ``matrix`` method will
    return the matrices for the intermediate time evolutions as well:

    .. math::

        \{U(t_0, t_0), U(t_0, t_1), \dots, U(t_0, t_{f-1}), U(t_0, t_f)\}.

    The first entry here is the initial condition :math:`U(t_0, t_0)=1`. For a simple
    time-dependent single-qubit Hamiltonian, this feature looks like the following:

    .. code-block:: python

        ops = [qp.Z(0), qp.Y(0), qp.X(0)]
        coeffs = [lambda p, t: p * jnp.cos(t) for _ in range(3)]
        H = qp.dot(coeffs, ops) # time-dependent parametrized Hamiltonian

        param = [jnp.array(0.2), jnp.array(1.1), jnp.array(-1.3)]
        time = jnp.linspace(0.1, 0.4, 6) # Six time points from 0.1 to 0.4

        ev = qp.evolve(H)(param, time, return_intermediate=True)

    >>> ev_mats = ev.matrix()
    >>> ev_mats.shape
    (6, 2, 2)

    Note that the broadcasting axis has length ``len(time)`` and is the first axis of the
    returned tensor.
    We may use this feature within QNodes executed on a simulator, returning the
    measurements for all intermediate time steps:

    .. code-block:: python

        dev = qp.device("default.qubit", wires=1)

        @qp.qnode(dev, interface="jax")
        def circuit(param, time):
            qp.evolve(H)(param, time, return_intermediate=True)
            return qp.probs(wires=[0])

    >>> circuit(param, time)
    Array([[1.        , 0.        ],
           [0.98977406, 0.01022594],
           [0.95990416, 0.04009584],
           [0.91236167, 0.08763833],
           [0.84996865, 0.15003133],
           [0.77614817, 0.22385181]], dtype=float64)


    **Computing complementary time evolution**

    When using ``return_intermediate=True``, the partial time evolutions share the *initial*
    time :math:`t_0`. For some applications, however, it may be useful to compute the
    complementary time evolutions, i.e. the partial evolutions that share the *final* time
    :math:`t_f`. This can be activated by setting ``complementary=True``, which will make
    ``ParametrizedEvolution.matrix`` return the matrices

    .. math::

        \{U(t_0, t_f), U(t_1, t_f), \dots, U(t_f, t_f)\}.

    Using the Hamiltonian from the example above:

    >>> complementary_ev = ev(param, time, return_intermediate=True, complementary=True)
    >>> comp_ev_mats = complementary_ev.matrix()
    >>> comp_ev_mats.shape
    (6, 2, 2)

    If we multiply the matrices computed before with ``complementary=False`` with these
    complementary evolution matrices from the left, we obtain the full time evolution,
    which we can check by comparing to the last entry of ``ev_mats``:

    >>> for mat, c_mat in zip(ev_mats, comp_ev_mats):
    ...     print(qp.math.allclose(c_mat @ mat, ev_mats[-1]))
    True
    True
    True
    True
    True
    True

### `hash`

```python
def hash(self)
```

int: Integer hash that uniquely represents the operator.

### `label`

```python
def label(self, decimals=None, base_label=None, cache=None)
```

A customizable string representation of the operator.

Args:
    decimals=None (int): If ``None``, no parameters are included. Else,
        specifies how to round the parameters.
    base_label=None (str): overwrite the non-parameter component of the label
    cache=None (dict): dictionary that carries information between label calls
        in the same drawing

Returns:
    str: label to use in drawings

**Example:**

>>> H = qp.X(1) + qp.pulse.constant * qp.Y(0) + jnp.polyval * qp.Y(1)
>>> params = [0.2, [1, 2, 3]]
>>> op = qp.evolve(H)(params, t=2)
>>> cache = {'matrices': []}

>>> op.label()
"Parametrized\nEvolution"
>>> op.label(decimals=2, cache=cache)
"Parametrized\nEvolution\n(p=[0.20,M0], t=[0. 2.])"
>>> op.label(base_label="my_label")
"my_label"
>>> op.label(decimals=2, base_label="my_label", cache=cache)
"my_label\n(p=[0.20,M0], t=[0. 2.])"

Array-like parameters are stored in ``cache['matrices']``.
