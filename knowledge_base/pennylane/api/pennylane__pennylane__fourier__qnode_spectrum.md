---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/fourier/qnode_spectrum.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/fourier/qnode_spectrum.py
license: Apache-2.0
---

## Module `pennylane/fourier/qnode_spectrum.py`

Contains a transform that computes the frequency spectrum of a quantum
circuit including classical preprocessing within the QNode.

## `qnode_spectrum`

```python
def qnode_spectrum(qnode, encoding_args=None, argnum=None, decimals=8, validation_kwargs=None)
```

Compute the frequency spectrum of the Fourier representation of quantum circuits,
including classical preprocessing.

The circuit must only use gates as input-encoding gates that can be decomposed
into single-parameter gates of the form :math:`e^{-i x_j G}` , which allows the
computation of the spectrum by inspecting the gates' generators :math:`G`.
The most important example of such single-parameter gates are Pauli rotations.

The argument ``argnum`` controls which QNode arguments are considered as encoded
inputs and the spectrum is computed only for these arguments.
The input-encoding *gates* are those that are controlled by input-encoding QNode arguments.
If no ``argnum`` is given, all QNode arguments are considered to be input-encoding
arguments.

.. note::

    Arguments of the QNode or parameters within an array-valued QNode argument
    that do not contribute to the Fourier series of the QNode
    with any frequency are considered as contributing with a constant term.
    That is, a parameter that does not control any gate has the spectrum ``[0]``.

Args:
    qnode (pennylane.QNode): :class:`~.pennylane.QNode` to compute the spectrum for
    encoding_args (dict[str, list[tuple]], set): Parameter index dictionary;
        keys are argument names, values are index tuples for that argument
        or an ``Ellipsis``. If a ``set``, all values are set to ``Ellipsis``.
        The contained argument and parameter indices indicate the scalar variables
        for which the spectrum is computed
    argnum (list[int]): Numerical indices for arguments with respect to which
        to compute the spectrum
    decimals (int): number of decimals to which to round frequencies.
    validation_kwargs (dict): Keyword arguments passed to
        :func:`~.pennylane.math.is_independent` when testing for linearity of
        classical preprocessing in the QNode.

Returns:
    function: Function which accepts the same arguments as the QNode.
    When called, this function will return a dictionary of dictionaries
    containing the frequency spectra per QNode parameter.

**Details**

A circuit that returns an expectation value of a Hermitian observable which depends on
:math:`N` scalar inputs :math:`x_j` can be interpreted as a function
:math:`f: \mathbb{R}^N \rightarrow \mathbb{R}`.
This function can always be expressed by a Fourier-type sum

.. math::

    \sum \limits_{\omega_1\in \Omega_1} \dots \sum \limits_{\omega_N \in \Omega_N}
    c_{\omega_1,\dots, \omega_N} e^{-i x_1 \omega_1} \dots e^{-i x_N \omega_N}

over the *frequency spectra* :math:`\Omega_j \subseteq \mathbb{R},`
:math:`j=1,\dots,N`. Each spectrum has the property that
:math:`0 \in \Omega_j`, and the spectrum is symmetric
(i.e., for every :math:`\omega \in \Omega_j` we have that :math:`-\omega \in\Omega_j`).
If all frequencies are integer-valued, the Fourier sum becomes a *Fourier series*.

As shown in `Vidal and Theis (2019) <https://arxiv.org/abs/1901.11434>`_ and
`Schuld, Sweke and Meyer (2020) <https://arxiv.org/abs/2008.08605>`_,
if an input :math:`x_j, j = 1 \dots N`,
only enters into single-parameter gates of the form :math:`e^{-i x_j G}`
(where :math:`G` is a Hermitian generator),
the frequency spectrum :math:`\Omega_j` is fully determined by the eigenvalues
of the generators :math:`G`. In many situations, the spectra are limited
to a few frequencies only, which in turn limits the function class that the circuit
can express.

The ``qnode_spectrum`` function computes all frequencies that will
potentially appear in the sets :math:`\Omega_1` to :math:`\Omega_N`.

.. note::

    The ``qnode_spectrum`` function also supports
    preprocessing of the QNode arguments before they are fed into the gates,
    as long as this processing is *linear*. In particular, constant
    prefactors for the encoding arguments are allowed.

.. warning::

    In order to validate the preprocessing of the QNode arguments, automatic
    differentiation is used by ``qnode_spectrum``. Therefore, pure Numpy parameters
    are not supported, but one of the machine learning frameworks has to be used.

**Example**

Consider the following example, which uses non-trainable inputs ``x``, ``y`` and ``z``
as well as trainable parameters ``w`` as arguments to the QNode.

.. code-block:: python

    n_qubits = 3
    dev = qp.device("default.qubit", wires=n_qubits)

    @qp.qnode(dev)
    def circuit(x, y, z, w):
        for i in range(n_qubits):
            qp.RX(0.5*x[i], wires=i)
            qp.Rot(w[0,i,0], w[0,i,1], w[0,i,2], wires=i)
            qp.RY(2.3*y[i], wires=i)
            qp.Rot(w[1,i,0], w[1,i,1], w[1,i,2], wires=i)
            qp.RX(z, wires=i)
        return qp.expval(qp.Z(0))

This circuit looks as follows:

>>> x = pnp.array([1., 2., 3.])
>>> y = pnp.array([0.1, 0.3, 0.5])
>>> z = pnp.array(-1.8)
>>> rng = pnp.random.default_rng(seed=42)
>>> w = rng.random((2, n_qubits, 3))
>>> w = pnp.array(w)
>>> print(qp.draw(circuit)(x, y, z, w))
0: ──RX(0.50)──Rot(0.77,0.44,0.86)──RY(0.23)──Rot(0.45,0.37,0.93)──RX(-1.80)─┤  <Z>
1: ──RX(1.00)──Rot(0.70,0.09,0.98)──RY(0.69)──Rot(0.64,0.82,0.44)──RX(-1.80)─┤
2: ──RX(1.50)──Rot(0.76,0.79,0.13)──RY(1.15)──Rot(0.23,0.55,0.06)──RX(-1.80)─┤

Applying the ``qnode_spectrum`` function to the circuit for
the non-trainable parameters, we obtain:

>>> res = qp.fourier.qnode_spectrum(circuit, argnum=[0, 1, 2])(x, y, z, w)
>>> for inp, freqs in res.items():
...     print(f"{inp}: {freqs}")
x: {(0,): [np.float64(-0.5), 0.0, np.float64(0.5)], (1,): [np.float64(-0.5), 0.0, np.float64(0.5)], (2,): [np.float64(-0.5), 0.0, np.float64(0.5)]}
y: {(0,): [np.float64(-2.3), 0.0, np.float64(2.3)], (1,): [np.float64(-2.3), 0.0, np.float64(2.3)], (2,): [np.float64(-2.3), 0.0, np.float64(2.3)]}
z: {(): [np.float64(-3.0), np.float64(-2.0), np.float64(-1.0), 0.0, np.float64(1.0), np.float64(2.0), np.float64(3.0)]}

.. note::
    While the Fourier spectrum usually does not depend
    on trainable circuit parameters or the actual values of the inputs,
    it may still change based on inputs to the QNode that alter the architecture
    of the circuit.

.. details::
    :title: Usage Details

    Above, we selected all input-encoding parameters for the spectrum computation, using
    the ``argnum`` keyword argument. We may also restrict the full analysis to a single
    QNode argument, again using ``argnum``:

    >>> res = qp.fourier.qnode_spectrum(circuit, argnum=[0])(x, y, z, w)
    >>> for inp, freqs in res.items():
    ...     print(f"{inp}: {freqs}")
    x: {(0,): [np.float64(-0.5), 0.0, np.float64(0.5)], (1,): [np.float64(-0.5), 0.0, np.float64(0.5)], (2,): [np.float64(-0.5), 0.0, np.float64(0.5)]}

    Selecting arguments by name instead of index is possible via the
    ``encoding_args`` argument:

    >>> res = qp.fourier.qnode_spectrum(circuit, encoding_args={"y"})(x, y, z, w)
    >>> for inp, freqs in res.items():
    ...     print(f"{inp}: {freqs}")
    y: {(0,): [np.float64(-2.3), 0.0, np.float64(2.3)], (1,): [np.float64(-2.3), 0.0, np.float64(2.3)], (2,): [np.float64(-2.3), 0.0, np.float64(2.3)]}

    Note that for array-valued arguments the spectrum for each element of the array
    is computed. A more fine-grained control is available by passing index tuples
    for the respective argument name in ``encoding_args``:

    >>> encoding_args = {"y": [(0,),(2,)]}
    >>> res = qp.fourier.qnode_spectrum(circuit, encoding_args=encoding_args)(x, y, z, w)
    >>> for inp, freqs in res.items():
    ...     print(f"{inp}: {freqs}")
    y: {(0,): [np.float64(-2.3), 0.0, np.float64(2.3)], (2,): [np.float64(-2.3), 0.0, np.float64(2.3)]}

    .. warning::
        The ``qnode_spectrum`` function checks whether the classical preprocessing between
        QNode and gate arguments is linear by computing the Jacobian of the processing
        and applying :func:`~.pennylane.math.is_independent`. This makes it unlikely
        -- *but not impossible* -- that non-linear functions go undetected.
        The number of additional points at which the Jacobian is computed in the numerical
        test of ``is_independent`` as well as other options for this function
        can be controlled via ``validation_kwargs``.
        Furthermore, the QNode arguments *not* marked in ``argnum`` will not be
        considered in this test and if they resemble encoded inputs, the entire
        spectrum might be incorrect or the circuit might not even admit one.

    The ``qnode_spectrum`` function works in all interfaces:

    .. code-block:: python

        dev = qp.device("default.qubit", wires=1)

        @qp.qnode(dev)
        def circuit(x):
            qp.RX(0.4*x[0], wires=0)
            qp.PhaseShift(x[1]*np.pi, wires=0)
            return qp.expval(qp.Z(0))

        x = torch.tensor([1.0, 3.0], requires_grad=True)
        res = qp.fourier.qnode_spectrum(circuit)(x)

    >>> print(res)
    {'x': {(0,): [np.float64(-0.40...), 0.0, np.float64(0.40...)], (1,): [np.float64(-3.14...), 0.0, np.float64(3.14...)]}}

    Finally, compare ``qnode_spectrum`` with :func:`~.circuit_spectrum`, using
    the following circuit.

    .. code-block:: python

        dev = qp.device("default.qubit", wires=2)

        @qp.qnode(dev)
        def circuit(x, y, z):
            qp.RX(0.5*x**2, wires=0, id="x")
            qp.RY(2.3*y, wires=1, id="y0")
            qp.CNOT(wires=[1,0])
            qp.RY(z, wires=0, id="y1")
            return qp.expval(qp.Z(0))

    First, note that we assigned ``id`` labels to the gates for which we will use
    ``circuit_spectrum``. This allows us to choose these gates in the computation:

    >>> x, y, z = pnp.array([0.1, 0.2, 0.3])
    >>> circuit_spec_fn = qp.fourier.circuit_spectrum(circuit, encoding_gates=["x","y0","y1"])
    >>> circuit_spec = circuit_spec_fn(x, y, z)
    >>> for _id, spec in circuit_spec.items():
    ...     print(f"{_id}: {spec}")
    x: [np.float64(-1.0), 0, np.float64(1.0)]
    y0: [np.float64(-1.0), 0, np.float64(1.0)]
    y1: [np.float64(-1.0), 0, np.float64(1.0)]

    As we can see, the preprocessing in the QNode is not included in the simple spectrum.
    In contrast, the output of ``qnode_spectrum`` is:

    >>> adv_spec = qp.fourier.qnode_spectrum(circuit, encoding_args={"y", "z"})(x, y, z)
    >>> for _id, spec in adv_spec.items():
    ...     print(f"{_id}: {spec}")
    y: {(): [np.float64(-2.3), 0.0, np.float64(2.3)]}
    z: {(): [np.float64(-1.0), 0.0, np.float64(1.0)]}

    Note that the values of the output are dictionaries instead of the spectrum lists, that
    they include the prefactors introduced by classical preprocessing, and
    that we would not be able to compute the advanced spectrum for ``x`` because it is
    preprocessed non-linearly in the gate ``qp.RX(0.5*x**2, wires=0, id="x")``.
