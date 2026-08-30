---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/fourier/reconstruct.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/fourier/reconstruct.py
license: Apache-2.0
---

## Module `pennylane/fourier/reconstruct.py`

Contains a function that computes the fourier series of
a quantum expectation value.

## `reconstruct`

```python
def reconstruct(qnode, ids=None, nums_frequency=None, spectra=None, shifts=None)
```

Reconstruct an expectation value QNode along a single parameter direction.
This means we restrict the QNode to vary only one parameter, a univariate restriction.
For common quantum gates, such restrictions are finite Fourier series with known
frequency spectra. Thus they may be reconstructed using Dirichlet kernels or
a non-uniform Fourier transform.

Args:
    qnode (pennylane.QNode): Quantum node to be reconstructed, representing a
        circuit that outputs an expectation value.
    ids (dict or Sequence or str): Indices for the QNode parameters with respect to which
        the QNode should be reconstructed as a univariate function, per QNode argument.
        Each key of the dict, entry of the list, or the single ``str`` has to be the name
        of an argument of ``qnode`` .
        If a ``dict`` , the values of ``ids`` have to contain the parameter indices
        for the respective array-valued QNode argument represented by the key.
        These indices always are tuples, i.e., ``()`` for scalar and ``(i,)`` for
        one-dimensional arguments.
        If a ``list`` , the parameter indices are inferred from ``nums_frequency`` if
        given or ``spectra`` else.
        If ``None``, all keys present in ``nums_frequency`` / ``spectra`` are considered.
    nums_frequency (dict[dict]): Numbers of integer frequencies -- and biggest
        frequency -- per QNode parameter. The keys have to be argument names of ``qnode``
        and the inner dictionaries have to be mappings from parameter indices to the
        respective integer number of frequencies. If the QNode frequencies are not contiguous
        integers, the argument ``spectra`` should be used to save evaluations of ``qnode`` .
        Takes precedence over ``spectra`` and leads to usage of equidistant shifts.
    spectra (dict[dict]): Frequency spectra per QNode parameter.
        The keys have to be argument names of ``qnode`` and the inner dictionaries have to
        be mappings from parameter indices to the respective frequency spectrum for that
        parameter. Ignored if ``nums_frequency!=None``.
    shifts (dict[dict]): Shift angles for the reconstruction per QNode parameter.
        The keys have to be argument names of ``qnode`` and the inner dictionaries have to
        be mappings from parameter indices to the respective shift angles to be used for that
        parameter. For :math:`R` non-zero frequencies, there must be :math:`2R+1` shifts
        given. Ignored if ``nums_frequency!=None``.

Returns:
    function: Function which accepts the same arguments as the QNode and one additional
    keyword argument ``f0`` to provide the QNode value at the given arguments.
    When called, this function will return a dictionary of dictionaries,
    formatted like ``nums_frequency`` or ``spectra`` ,
    that contains the univariate reconstructions per QNode parameter.

For each provided ``id`` in ``ids``, the QNode is restricted to varying the single QNode
parameter corresponding to the ``id`` . This univariate function is then reconstructed
via a Fourier transform or Dirichlet kernels, depending on the provided input.
Either the frequency ``spectra`` of the QNode with respect to its input parameters or
the numbers of frequencies, ``nums_frequency`` , per parameter must be provided.

For quantum-circuit specific details, we refer the reader to
`Vidal and Theis (2018) <https://arxiv.org/abs/1812.06323>`__ ,
`Vidal and Theis (2020) <https://www.frontiersin.org/articles/10.3389/fphy.2020.00297/full>`__ ,
`Schuld, Sweke and Meyer (2021) <https://journals.aps.org/pra/abstract/10.1103/PhysRevA.103.032430>`__ ,
and
`Wierichs, Izaac, Wang and Lin (2022) <https://doi.org/10.22331/q-2022-03-30-677>`__ .
An introduction to the concept of quantum circuits as Fourier series can also be found in
the
:doc:`Quantum models as Fourier series <demo:demos/tutorial_expressivity_fourier_series>`
and :doc:`General parameter-shift rules <demo:demos/tutorial_general_parshift>` demos as well
as the :mod:`qp.fourier <pennylane.fourier>` module docstring.

**Example**

Consider the following QNode:

.. code-block:: python

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit(x, Y):
        qp.RX(x, wires=0)
        qp.RY(Y[0], wires=0)
        qp.RY(Y[1], wires=1)
        qp.CNOT(wires=[0, 1])
        qp.RY(5*Y[1], wires=1)
        return qp.expval(qp.Z(0) @ qp.Z(1))

    x = pnp.array(0.4)
    Y = pnp.array([1.9, -0.5])
    f = 2.3

    circuit_value = circuit(x, Y)

It has three variational parameters ``x`` (a scalar) and two entries of ``Y``
(an array-like).
A reconstruction job could then be with respect to the two entries of ``Y``,
which enter the circuit with one and six integer frequencies, respectively
(see the additional examples below for details on how to obtain the frequency
spectrum if it is not known):

>>> nums_frequency = {"Y": {(0,): 1, (1,): 6}}
>>> with qp.Tracker(circuit.device) as tracker:
...     rec = qp.fourier.reconstruct(circuit, {"Y": [(0,), (1,)]}, nums_frequency)(x, Y)
>>> rec.keys()
dict_keys(['Y'])
>>> print(*rec["Y"].items(), sep="\n")
((0,), <function _reconstruct_equ.<locals>._reconstruction at 0x...>)
((1,), <function _reconstruct_equ.<locals>._reconstruction at 0x...>)
>>> recon_Y0 = rec["Y"][(0,)]
>>> recon_Y1 = rec["Y"][(1,)]
>>> print(np.isclose(recon_Y0(Y[0]), circuit_value))
True
>>> print(np.isclose(recon_Y1(Y[1]+1.3), circuit(x, Y+np.eye(2)[1]*1.3)))
True

We successfully reconstructed the dependence on the two entries of ``Y`` ,
keeping ``x`` and the respective other entry in ``Y`` at their initial values.
Let us also see how many executions of the device were used to obtain the
reconstructions:

>>> tracker.totals
{'batches': 15, 'simulations': 15, 'executions': 15}

The example above used that we already knew the frequency spectra of the
QNode of interest. However, this is in general not the case and we may need
to compute the spectrum first. This can be done with
:func:`.fourier.qnode_spectrum` :

>>> spectra = qp.fourier.qnode_spectrum(circuit)(x, Y)
>>> spectra.keys()
dict_keys(['x', 'Y'])
>>> spectra["x"]
{(): [np.float64(-1.0), 0.0, np.float64(1.0)]}
>>> print(*spectra["Y"].items(), sep="\n")
((0,), [np.float64(-1.0), 0.0, np.float64(1.0)])
((1,), [np.float64(-6.0), np.float64(-5.0), np.float64(-4.0), np.float64(-1.0), 0.0, np.float64(1.0), np.float64(4.0), np.float64(5.0), np.float64(6.0)])

For more detailed explanations, usage details and additional examples, see
the usage details section below.

.. details::
    :title: Usage Details

    **Input formatting**

    As described briefly above, the essential inputs to ``reconstruct`` that provide information
    about the QNode are given as dictionaries of dictionaries, where the outer keys reference
    the argument names of ``qnode`` and the inner keys reference the parameter indices within
    each array-valued QNode argument. These parameter indices always are tuples, so that
    for scalar-valued QNode parameters, the parameter index is ``()`` by convention and the
    ``i`` -th parameter of a one-dimensional array can be accessed via ``(i,)`` .
    For example, providing ``nums_frequency``

    - for a scalar argument: ``nums_frequency = {"x": {(): 4}}``
    - for a one-dimensional argument: ``nums_frequency = {"Y": {(0,): 2, (1,): 9, (4,): 1}}``
    - for a three-dimensional argument: ``nums_frequency = {"Z": {(0, 2, 5): 2, (1, 1, 4): 1}}``

    This applies to ``nums_frequency`` , ``spectra`` , and ``shifts`` .

    Note that the information provided in ``nums_frequency`` / ``spectra`` is essential for
    the correctness of the reconstruction.

    On the other hand, the input format for ``ids`` is flexible and allows a collection of
    parameter indices for each QNode argument name (as a ``dict`` ), a collection of argument
    names (as a ``list``, ``set``, ``tuple`` or similar), or a single argument name
    (as a ``str`` ) to be defined. For ``ids=None`` , all argument names contained in
    ``nums_frequency`` -- or ``spectra`` if ``nums_frequency`` is not used -- are considered.
    For inputs that do not specify parameter indices per QNode argument name (all formats but
    ``dict`` ), these parameter indices are inferred from ``nums_frequency`` / ``spectra`` .

    **Reconstruction cost**

    The reconstruction cost -- in terms of calls to ``qnode`` -- depend on the number of
    frequencies given via ``nums_frequency`` or ``spectra`` . A univariate reconstruction
    for :math:`R` frequencies takes :math:`2R+1` evaluations. If multiple univariate
    reconstructions are performed at the same point with various numbers of frequencies
    :math:`R_k` , the cost are :math:`1+2\sum_k R_k` if the shift :math:`0` is used in all
    of them. This is in particular the case if ``nums_frequency`` or ``spectra`` with
    ``shifts=None`` is used.

    If the number of frequencies is too large or the given frequency spectrum contains
    more than the spectrum of ``qnode`` , the reconstruction is performed suboptimally
    but remains correct.
    For integer-valued spectra with gaps, the equidistant reconstruction is thus suboptimal
    and the non-equidistant version method be used (also see the examples below).

    **Numerical stability**

    In general, the reconstruction with equidistant shifts for equidistant frequencies
    (used if ``nums_frequency`` is provided) is more stable numerically than the more
    general Fourier reconstruction (used if ``nums_frequency=None`` ).
    If the system of equations to be solved in the Fourier transform is
    ill-conditioned, a warning is raised as the output might become unstable.
    Examples for this are shift values or frequencies that lie very close to each other.

    **Differentiability**

    The returned scalar functions are differentiable in all interfaces with respect
    to their scalar input variable. They expect these inputs to be in the same
    interface as the one used by the QNode. More advanced differentiability, for example
    of the reconstructions with respect to QNode properties, is not supported
    reliably yet.

    .. warning::

        When using ``TensorFlow`` or ``Autograd`` *and* ``nums_frequency`` ,
        the reconstructed functions are not differentiable at the point of
        reconstruction. One workaround for this is to use ``spectra`` as
        input instead and to thereby use the Fourier transform instead of
        Dirichlet kernels. Alternatively, the original QNode evaluation can
        be used.

    **More examples**

    Consider the QNode from the example above, now with an additional, tunable frequency
    ``f`` for the Pauli-X rotation that is controlled by ``x`` :

    .. code-block:: python

        @qp.qnode(dev)
        def circuit(x, Y, f=1.0):
            qp.RX(f * x, wires=0)
            qp.RY(Y[0], wires=0)
            qp.RY(Y[1], wires=1)
            qp.CNOT(wires=[0, 1])
            qp.RY(5*  Y[1], wires=1)
            return qp.expval(qp.Z(0) @ qp.Z(1))

        f = 2.3

        circuit_value = circuit(x, Y)


    We repeat the reconstruction job for the dependence on ``Y[1]`` .
    Note that even though information about ``Y[0]`` is contained in ``nums_frequency`` ,
    ``ids`` determines which reconstructions are performed.

    >>> with qp.Tracker(circuit.device) as tracker:
    ...     rec = qp.fourier.reconstruct(circuit, {"Y": [(1,)]}, nums_frequency)(x, Y)
    >>> tracker.totals
    {'batches': 13, 'simulations': 13, 'executions': 13}

    As expected, we required :math:`2R+1=2\cdot 6+1=13` circuit executions. However, not
    all frequencies below :math:`f_\text{max}=6` are present in the circuit, so that
    a reconstruction using knowledge of the full frequency spectrum will be cheaper:

    >>> spectra = {"Y": {(1,): [0., 1., 4., 5., 6.]}}
    >>> with tracker:
    ...     rec = qp.fourier.reconstruct(circuit, {"Y": [(1,)]}, None, spectra)(x, Y)
    >>> tracker.totals
    {'batches': 9, 'simulations': 9, 'executions': 9}

    We again obtain the full univariate dependence on ``Y[1]`` but with considerably
    fewer executions on the quantum device.
    Once we obtained the classical function that describes the dependence, no
    additional circuit evaluations are performed:

    >>> with tracker:
    ...     for Y1 in np.arange(-np.pi, np.pi, 20):
    ...         rec["Y"][(1,)](-2.1)
    tensor(0.013..., requires_grad=True)
    >>> tracker.totals
    {}

    If we want to reconstruct the dependence of ``circuit`` on ``x`` , we cannot use
    ``nums_frequency`` if ``f`` is not an integer. One could rescale ``x`` to obtain
    the frequency :math:`1` again, or directly use ``spectra`` . We will combine the
    latter with another reconstruction with respect to ``Y[0]`` :

    >>> spectra = {"x": {(): [0., f]}, "Y": {(0,): [0., 1.]}}
    >>> with tracker:
    ...     rec = qp.fourier.reconstruct(circuit, None, None, spectra)(x, Y, f=f)
    >>> tracker.totals
    {'batches': 5, 'simulations': 5, 'executions': 5}
    >>> recon_x = rec["x"][()]
    >>> print(np.isclose(recon_x(x+0.5), circuit(x+0.5, Y, f=f)))
    True

    Note that by convention, the parameter index for a scalar variable is ``()`` and
    that the frequency :math:`0` always needs to be included in the spectra.
    Furthermore, we here skipped the input ``ids`` so that the reconstruction
    was performed for all keys in ``spectra`` .
    The reconstruction with a single non-zero frequency
    costs three evaluations of ``circuit`` for each, ``x`` and ``Y[0]`` . Performing
    both reconstructions at the same position allowed us to save one of the
    evaluations and reduce the number of calls to :math:`5`.
