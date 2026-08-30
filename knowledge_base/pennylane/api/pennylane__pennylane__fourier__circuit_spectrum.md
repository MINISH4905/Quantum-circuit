---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/fourier/circuit_spectrum.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/fourier/circuit_spectrum.py
license: Apache-2.0
---

## Module `pennylane/fourier/circuit_spectrum.py`

Contains a transform that computes the simple frequency spectrum
of a quantum circuit, that is the frequencies without considering
preprocessing in the QNode.

## `circuit_spectrum`

```python
def circuit_spectrum(tape: QuantumScript, encoding_gates=None, decimals=8) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Compute the frequency spectrum of the Fourier representation of
simple quantum circuits ignoring classical preprocessing.

The circuit must only use simple single-parameter gates of the form :math:`e^{-i x_j G}` as
input-encoding gates, which allows the computation of the spectrum by inspecting the gates'
generators :math:`G`. The most important example of such gates are Pauli rotations.

.. note::

    More precisely, the ``circuit_spectrum`` function relies on the gate to
    define a ``generator``, and will fail if gates marked as inputs do not
    have this attribute.

Gates are marked as input-encoding gates in the quantum function by giving them an ``mark``.

>>> marked_op = qp.fourier.mark(qp.H(0), "marked-h")
>>> print(marked_op.marker)
marked-h

If two gates have the same ``marker``, they are considered
to be used to encode the same input :math:`x_j`. The ``encoding_gates`` argument can be used
to indicate that only gates with a specific ``marker`` should be interpreted as input-encoding gates.
Otherwise, all gates with an explicit ``marker`` are considered to be input-encoding gates.

.. note::
    If no input-encoding gates are found, an empty dictionary is returned.

Args:
    tape (QNode or QuantumTape or Callable): a quantum circuit in which
        input-encoding gates are marked by their ``marker`` attribute
    encoding_gates (list[str]): list of input-encoding gate ``marker`` strings
        for which to compute the frequency spectra
    decimals (int): number of decimals to which to round frequencies.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`. Executing this circuit
    will return a dictionary with the input-encoding gate ``marker`` as keys and their frequency spectra as values.


**Details**

A circuit that returns an expectation value which depends on
:math:`N` scalar inputs :math:`x_j` can be interpreted as a function
:math:`f: \mathbb{R}^N \rightarrow \mathbb{R}`. This function can always be
expressed by a Fourier-type sum

.. math::

    \sum \limits_{\omega_1\in \Omega_1} \dots \sum \limits_{\omega_N \in \Omega_N}
    c_{\omega_1,\dots, \omega_N} e^{-i x_1 \omega_1} \dots e^{-i x_N \omega_N}

over the *frequency spectra* :math:`\Omega_j \subseteq \mathbb{R},`
:math:`j=1,\dots,N`. Each spectrum has the property that
:math:`0 \in \Omega_j`, and the spectrum is
symmetric (for every :math:`\omega \in \Omega_j` we have that :math:`-\omega \in
\Omega_j`). If all frequencies are integer-valued, the Fourier sum becomes a
*Fourier series*.

As shown in `Vidal and Theis (2019)
<https://arxiv.org/abs/1901.11434>`_ and `Schuld, Sweke and Meyer (2020)
<https://arxiv.org/abs/2008.08605>`_, if an input :math:`x_j, j = 1 \dots N`,
only enters into single-parameter gates of the form :math:`e^{-i x_j G}` (where :math:`G` is a Hermitian generator),
the frequency spectrum :math:`\Omega_j` is fully determined by the eigenvalues
of :math:`G`. In many situations, the spectra are limited
to a few frequencies only, which in turn limits the function class that the circuit
can express.

The ``circuit_spectrum`` function computes all frequencies that will potentially appear in the
sets :math:`\Omega_1` to :math:`\Omega_N`.

**Example**

Consider the following example, which uses non-trainable inputs ``x`` and
trainable parameters ``w`` as arguments to the qnode.

.. code-block:: python

    import pennylane as qp
    from pennylane.fourier import mark
    import numpy as np

    n_layers = 2
    n_qubits = 3
    dev = qp.device("default.qubit", wires=n_qubits)

    @qp.qnode(dev)
    def circuit(x, w):
        for l in range(n_layers):
            for i in range(n_qubits):
                mark(qp.RX(x[i], wires=i), "x"+str(i))
                qp.Rot(w[l,i,0], w[l,i,1], w[l,i,2], wires=i)
        mark(qp.RZ(x[0], wires=0), "x0")
        return qp.expval(qp.Z(0))

    x = np.array([1, 2, 3])
    rng = np.random.default_rng(seed=42)
    w = rng.random((n_layers, n_qubits, 3))
    res = qp.fourier.circuit_spectrum(circuit)(x, w)

>>> print(qp.draw(circuit)(x, w))
0: ──RX(1.00, "x0")──Rot(0.77,0.44,0.86)──RX(1.00, "x0")──Rot(0.45,0.37,0.93)──RZ(1.00, "x0")─┤  <Z>
1: ──RX(2.00, "x1")──Rot(0.70,0.09,0.98)──RX(2.00, "x1")──Rot(0.64,0.82,0.44)─────────────────┤
2: ──RX(3.00, "x2")──Rot(0.76,0.79,0.13)──RX(3.00, "x2")──Rot(0.23,0.55,0.06)─────────────────┤

>>> for inp, freqs in res.items():
...     print(f"{inp}: {freqs}")
x0: [np.float64(-3.0), np.float64(-2.0), np.float64(-1.0), 0, np.float64(1.0), np.float64(2.0), np.float64(3.0)]
x1: [np.float64(-2.0), np.float64(-1.0), 0, np.float64(1.0), np.float64(2.0)]
x2: [np.float64(-2.0), np.float64(-1.0), 0, np.float64(1.0), np.float64(2.0)]

.. note::
    While the Fourier spectrum usually does not depend
    on trainable circuit parameters or the actual values of the inputs,
    it may still change based on inputs to the QNode that alter the architecture
    of the circuit.

The input-encoding gates to consider can also be explicitly selected by using the
``encoding_gates`` keyword argument:

.. code-block:: python

    dev = qp.device("default.qubit", wires=1)

    @qp.qnode(dev)
    def circuit(x):
        mark(qp.RX(x[0], wires=0), "x0")
        mark(qp.PhaseShift(x[0], wires=0), "x0")
        mark(qp.RX(x[1], wires=0), "x1")
        return qp.expval(qp.Z(0))

    x = np.array([1, 2])
    res = qp.fourier.circuit_spectrum(circuit, encoding_gates=["x0"])(x)

>>> for inp, freqs in res.items():
...     print(f"{inp}: {freqs}")
x0: [np.float64(-2.0), np.float64(-1.0), 0, np.float64(1.0), np.float64(2.0)]

.. note::
    The ``circuit_spectrum`` function does not check if the result of the
    circuit is an expectation, or if gates with the same ``marker``
    take the same value in a given call of the function.

The ``circuit_spectrum`` function works in all interfaces:

.. code-block:: python

    dev = qp.device("default.qubit", wires=1)

    @qp.qnode(dev)
    def circuit(x):
        mark(qp.RX(x[0], wires=0), "x0")
        mark(qp.PhaseShift(x[1], wires=0), "x1")
        return qp.expval(qp.Z(0))

    x = torch.tensor([1, 2])
    res = qp.fourier.circuit_spectrum(circuit)(x)

>>> for inp, freqs in res.items():
...     print(f"{inp}: {freqs}")
x0: [np.float64(-1.0), 0, np.float64(1.0)]
x1: [np.float64(-1.0), 0, np.float64(1.0)]
