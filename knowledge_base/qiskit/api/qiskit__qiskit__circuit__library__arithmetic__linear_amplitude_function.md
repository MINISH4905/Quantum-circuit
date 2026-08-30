---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/linear_amplitude_function.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/linear_amplitude_function.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/linear_amplitude_function.py`

A class implementing a (piecewise-) linear function on qubit amplitudes.

## `LinearAmplitudeFunction`

```python
class LinearAmplitudeFunction(QuantumCircuit)
```

A circuit implementing a (piecewise) linear function on qubit amplitudes.

An amplitude function :math:`F` of a function :math:`f` is a mapping

.. math::

    F|x\rangle|0\rangle = \sqrt{1 - \hat{f}(x)} |x\rangle|0\rangle + \sqrt{\hat{f}(x)}
        |x\rangle|1\rangle.

for a function :math:`\hat{f}: \{ 0, ..., 2^n - 1 \} \rightarrow [0, 1]`, where
:math:`|x\rangle` is a :math:`n` qubit state.

This circuit implements :math:`F` for piecewise linear functions :math:`\hat{f}`.
In this case, the mapping :math:`F` can be approximately implemented using a Taylor expansion
and linearly controlled Pauli-Y rotations, see [1, 2] for more detail. This approximation
uses a ``rescaling_factor`` to determine the accuracy of the Taylor expansion.

In general, the function of interest :math:`f` is defined from some interval :math:`[a,b]`,
the ``domain`` to :math:`[c,d]`, the ``image``, instead of :math:`\{ 1, ..., N \}` to
:math:`[0, 1]`. Using an affine transformation we can rescale :math:`f` to :math:`\hat{f}`:

.. math::

    \hat{f}(x) = \frac{f(\phi(x)) - c}{d - c}

with

.. math::

    \phi(x) = a + \frac{b - a}{2^n - 1} x.

If :math:`f` is a piecewise linear function on :math:`m` intervals
:math:`[p_{i-1}, p_i], i \in \{1, ..., m\}` with slopes :math:`\alpha_i` and
offsets :math:`\beta_i` it can be written as

.. math::

    f(x) = \sum_{i=1}^m 1_{[p_{i-1}, p_i]}(x) (\alpha_i x + \beta_i)

where :math:`1_{[a, b]}` is an indicator function that is 1 if the argument is in the interval
:math:`[a, b]` and otherwise 0. The breakpoints :math:`p_i` can be specified by the
``breakpoints`` argument.

References:

[1] Woerner, S., & Egger, D. J. (2018). Quantum Risk Analysis.
`arXiv:1806.06893 <https://arxiv.org/abs/1806.06893>`_

[2] Gacon, J., Zoufal, C., & Woerner, S. (2020). Quantum-Enhanced Simulation-Based Optimization.
`arXiv:2005.10780 <https://arxiv.org/abs/2005.10780>`_

### `__init__`

```python
def __init__(self, num_state_qubits: int, slope: float | list[float], offset: float | list[float], domain: tuple[float, float], image: tuple[float, float], rescaling_factor: float=1, breakpoints: list[float] | None=None, name: str='F') -> None
```

Args:
    num_state_qubits: The number of qubits used to encode the variable :math:`x`.
    slope: The slope of the linear function. Can be a list of slopes if it is a piecewise
        linear function.
    offset: The offset of the linear function. Can be a list of offsets if it is a piecewise
        linear function.
    domain: The domain of the function as tuple :math:`(x_\min{}, x_\max{})`.
    image: The image of the function as tuple :math:`(f_\min{}, f_\max{})`.
    rescaling_factor: The rescaling factor to adjust the accuracy in the Taylor
        approximation.
    breakpoints: The breakpoints if the function is piecewise linear. If None, the function
        is not piecewise.
    name: Name of the circuit.

### `post_processing`

```python
def post_processing(self, scaled_value: float) -> float
```

Map the function value of the approximated :math:`\hat{f}` to :math:`f`.

Args:
    scaled_value: A function value from the Taylor expansion of :math:`\hat{f}(x)`.

Returns:
    The ``scaled_value`` mapped back to the domain of :math:`f`, by first inverting
    the transformation used for the Taylor approximation and then mapping back from
    :math:`[0, 1]` to the original domain.

## `LinearAmplitudeFunctionGate`

```python
class LinearAmplitudeFunctionGate(Gate)
```

A circuit implementing a (piecewise) linear function on qubit amplitudes.

An amplitude function :math:`F` of a function :math:`f` is a mapping

.. math::

    F|x\rangle|0\rangle = \sqrt{1 - \hat{f}(x)} |x\rangle|0\rangle + \sqrt{\hat{f}(x)}
        |x\rangle|1\rangle.

for a function :math:`\hat{f}: \{ 0, ..., 2^n - 1 \} \rightarrow [0, 1]`, where
:math:`|x\rangle` is a :math:`n` qubit state.

This circuit implements :math:`F` for piecewise linear functions :math:`\hat{f}`.
In this case, the mapping :math:`F` can be approximately implemented using a Taylor expansion
and linearly controlled Pauli-Y rotations, see [1, 2] for more detail. This approximation
uses a ``rescaling_factor`` to determine the accuracy of the Taylor expansion.

In general, the function of interest :math:`f` is defined from some interval :math:`[a,b]`,
the ``domain`` to :math:`[c,d]`, the ``image``, instead of :math:`\{ 1, ..., N \}` to
:math:`[0, 1]`. Using an affine transformation we can rescale :math:`f` to :math:`\hat{f}`:

.. math::

    \hat{f}(x) = \frac{f(\phi(x)) - c}{d - c}

with

.. math::

    \phi(x) = a + \frac{b - a}{2^n - 1} x.

If :math:`f` is a piecewise linear function on :math:`m` intervals
:math:`[p_{i-1}, p_i], i \in \{1, ..., m\}` with slopes :math:`\alpha_i` and
offsets :math:`\beta_i` it can be written as

.. math::

    f(x) = \sum_{i=1}^m 1_{[p_{i-1}, p_i]}(x) (\alpha_i x + \beta_i)

where :math:`1_{[a, b]}` is an indicator function that is 1 if the argument is in the interval
:math:`[a, b]` and otherwise 0. The breakpoints :math:`p_i` can be specified by the
``breakpoints`` argument.

References:

[1] Woerner, S., & Egger, D. J. (2018).
Quantum Risk Analysis.
`arXiv:1806.06893 <https://arxiv.org/abs/1806.06893>`_

[2] Gacon, J., Zoufal, C., & Woerner, S. (2020).
Quantum-Enhanced Simulation-Based Optimization.
`arXiv:2005.10780 <https://arxiv.org/abs/2005.10780>`_

### `__init__`

```python
def __init__(self, num_state_qubits: int, slope: float | list[float], offset: float | list[float], domain: tuple[float, float], image: tuple[float, float], rescaling_factor: float=1, breakpoints: list[float] | None=None, label: str='F') -> None
```

Args:
    num_state_qubits: The number of qubits used to encode the variable :math:`x`.
    slope: The slope of the linear function. Can be a list of slopes if it is a piecewise
        linear function.
    offset: The offset of the linear function. Can be a list of offsets if it is a piecewise
        linear function.
    domain: The domain of the function as tuple :math:`(x_\min{}, x_\max{})`.
    image: The image of the function as tuple :math:`(f_\min{}, f_\max{})`.
    rescaling_factor: The rescaling factor to adjust the accuracy in the Taylor
        approximation.
    breakpoints: The breakpoints if the function is piecewise linear. If None, the function
        is not piecewise.
    label: A label for the gate.

### `post_processing`

```python
def post_processing(self, scaled_value: float) -> float
```

Map the function value of the approximated :math:`\hat{f}` to :math:`f`.

Args:
    scaled_value: A function value from the Taylor expansion of :math:`\hat{f}(x)`.

Returns:
    The ``scaled_value`` mapped back to the domain of :math:`f`, by first inverting
    the transformation used for the Taylor approximation and then mapping back from
    :math:`[0, 1]` to the original domain.
