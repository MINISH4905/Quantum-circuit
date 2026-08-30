---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/fourier/coefficients.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/fourier/coefficients.py
license: Apache-2.0
---

## Module `pennylane/fourier/coefficients.py`

Contains methods for computing Fourier coefficients and frequency spectra of quantum functions.

## `coefficients`

```python
def coefficients(f, n_inputs, degree, lowpass_filter=False, filter_threshold=None, use_broadcasting=False)
```

Computes the first :math:`2d+1` Fourier coefficients of a :math:`2\pi`
periodic function, where :math:`d` is the highest desired frequency (the
degree) of the Fourier spectrum.

While this function can be used to compute Fourier coefficients in general,
the specific use case in PennyLane is to compute coefficients of the
functions that result from measuring expectation values of parametrized
quantum circuits, as described in `Schuld, Sweke, and Meyer (2020)
<https://arxiv.org/abs/2008.08605>`__ and `Vidal and Theis (2019)
<https://arxiv.org/abs/1901.11434>`__.

**Details**

Consider a quantum circuit that depends on a
parameter vector :math:`x` with
length :math:`N`. The circuit involves application of some unitary
operations :math:`U(x)`, and then measurement of an observable
:math:`\langle \hat{O} \rangle`. Analytically, the expectation value is

.. math::

   \langle \hat{O} \rangle = \langle 0 \vert U^\dagger (x) \hat{O} U(x) \vert 0\rangle = \langle
   \psi(x) \vert \hat{O} \vert \psi (x)\rangle.

This output is simply a function :math:`f(x) = \langle \psi(x) \vert \hat{O} \vert \psi
(x)\rangle`. Notably, it is a periodic function of the parameters, and
it can thus be expressed as a multidimensional Fourier series:

.. math::

    f(x) = \sum \limits_{n_1\in \Omega_1} \dots \sum \limits_{n_N \in \Omega_N}
    c_{n_1,\dots, n_N} e^{-i x_1 n_1} \dots e^{-i x_N n_N},

where :math:`n_i` are integer-valued frequencies, :math:`\Omega_i` are the set
of available values for the integer frequencies, and the
:math:`c_{n_1,\ldots,n_N}` are Fourier coefficients.

Args:
    f (callable): Function that takes a 1D tensor of ``n_inputs`` scalar inputs. The function can be a QNode, but
        has to return a real scalar value (such as an expectation).
    n_inputs (int): number of function inputs
    degree (int or tuple[int]): max frequency of Fourier coeffs to be computed. For degree :math:`d`,
        the coefficients from frequencies :math:`-d, -d+1,...0,..., d-1, d` will be computed.
        If multiple degrees are passed, their length must match ``n_inputs``.
    lowpass_filter (bool): If ``True``, a simple low-pass filter is applied prior to
        computing the set of coefficients in order to filter out frequencies above the
        given degree(s). See examples below.
    filter_threshold (None or int or tuple[int]): The integer frequency at which to filter if
        ``lowpass_filter`` is set to ``True``. If set to ``None``, ``2 * degree`` is used.
        If multiple thresholds are passed, their length must match ``n_inputs``.
    use_broadcasting (bool): Whether or not to broadcast the parameters to execute
        multiple function calls at once. Broadcasting is performed along the last axis
        of the grid of evaluation points.

Returns:
    array[complex]: The Fourier coefficients of the function ``f`` up to the specified degree(s).

**Example**

Suppose we have the following quantum function and wish to compute its Fourier
coefficients with respect to the variable ``inpt``, which is an array with 2 values:

.. code-block:: python

    dev = qp.device('default.qubit', wires=['a'])

    @qp.qnode(dev)
    def circuit(weights, inpt):
        qp.RX(inpt[0], wires='a')
        qp.Rot(*weights[0], wires='a')

        qp.RY(inpt[1], wires='a')
        qp.Rot(*weights[1], wires='a')

        return qp.expval(qp.Z('a'))

.. note::

    The QNode has to return a scalar value (such as a single expectation).

Unless otherwise specified, the coefficients will be computed for all input
values. To compute coefficients with respect to only a subset of the input
values, it is necessary to use a wrapper function (e.g.,
``functools.partial``). We do this below, while fixing a value for
``weights``:

>>> from functools import partial
>>> weights = np.array([[0.1, 0.2, 0.3], [-4.1, 3.2, 1.3]])
>>> partial_circuit = partial(circuit, weights)

Now we must specify the number of inputs, and the maximum desired
degree. Based on the underlying theory, we expect the degree to be 1
(frequencies -1, 0, and 1).

>>> num_inputs = 2
>>> degree = 1

Then we can obtain the coefficients:

>>> coeffs = coefficients(partial_circuit, num_inputs, degree)
>>> print(coeffs) # doctest: +SKIP
[[-1.23358114e-17+0.00000000e+00j -4.93432455e-17-3.08395285e-18j
  -4.93432455e-17+3.08395285e-18j]
 [-1.40219669e-03-2.20118490e-02j -3.43071461e-01-4.08458392e-02j
  -1.49310501e-01+3.74473726e-02j]
 [-1.40219669e-03+2.20118490e-02j -1.49310501e-01-3.74473726e-02j
  -3.43071461e-01+4.08458392e-02j]]


If the specified degree is lower than the highest frequency of the function,
aliasing may occur, and the resultant coefficients will be incorrect as they
will include components of the series expansion from higher frequencies. In
order to mitigate aliasing, setting ``lowpass_filter=True`` will apply a
simple low-pass filter prior to computing the coefficients. Coefficients up
to a specified value are computed, and then frequencies higher than the
degree are simply removed. This ensures that the coefficients returned will
have the correct values, though they may not be the full set of
coefficients. If no threshold value is provided, the threshold will be set
to ``2 * degree``.

Consider the circuit below:

.. code-block:: python

    @qp.qnode(qp.device('default.qubit', wires=2))
    def circuit(inpt):
        qp.RX(inpt[0], wires=0)
        qp.RY(inpt[0], wires=1)
        qp.CNOT(wires=[1, 0])
        return qp.expval(qp.Z(0))

One can work out by hand that the Fourier coefficients are :math:`c_0 = 0.5, c_1 = c_{-1} = 0,`
and :math:`c_2 = c_{-2} = 0.25`. Suppose we would like only to obtain the coefficients
:math:`c_0` and :math:`c_1, c_{-1}`. If we simply ask for the coefficients of degree 1,
we will obtain incorrect values due to aliasing:

>>> coefficients(circuit, 1, 1)
array([0.5 +0.j, 0.25+0.j, 0.25+0.j])

However if we enable the low-pass filter, we can still obtain the correct coefficients:

>>> coefficients(circuit, 1, 1, lowpass_filter=True) # doctest: +SKIP
array([5.00000000e-01+0.j, 5.55111512e-17+0.j, 5.55111512e-17+0.j])

Note that in this case, ``2 * degree`` gives us exactly the maximum coefficient;
in other situations it may be desirable to set the threshold value explicitly.

The `coefficients` function can handle qnodes from all PennyLane interfaces and if the
passed function allows broadcasted parameter inputs, the computation of the coefficients
can be accelerated by setting ``use_broadcasting=True``.
