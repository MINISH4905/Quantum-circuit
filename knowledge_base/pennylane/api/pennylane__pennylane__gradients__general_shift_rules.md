---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/gradients/general_shift_rules.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/gradients/general_shift_rules.py
license: Apache-2.0
---

## Module `pennylane/gradients/general_shift_rules.py`

Contains a function for generating generalized parameter shift rules and
helper methods for processing shift rules as well as for creating tapes with
shifted parameters.

## `process_shifts`

```python
def process_shifts(rule, tol=1e-10, batch_duplicates=True)
```

Utility function to process gradient rules.

Args:
    rule (array): a ``(M, N)`` array corresponding to ``M`` terms
        with parameter shifts. ``N`` has to be either ``2`` or ``3``.
        The first column corresponds to the linear combination coefficients;
        the last column contains the shift values.
        If ``N=3``, the middle column contains the multipliers.
    tol (float): floating point tolerance used when comparing shifts/coefficients
        Terms with coefficients below ``tol`` will be removed.
    batch_duplicates (bool): whether to check the input ``rule`` for duplicate
        shift values in its second column.

Returns:
    array: The processed shift rule with small entries rounded to 0, sorted
    with respect to the absolute value of the shifts, and groups of shift
    terms with identical (multiplier and) shift fused into one term each,
    if ``batch_duplicates=True``.

This utility function accepts coefficients and shift values as well as optionally
multipliers, and performs the following processing:

- Set all small (within absolute tolerance ``tol``) coefficients and shifts to 0

- Remove terms where the coefficients are 0 (including the ones set to 0 in the previous step)

- Terms with the same shift value (and multiplier) are combined into a single term.

- Finally, the terms are sorted according to the absolute value of ``shift``,
  This ensures that a zero-shift term, if it exists, is returned first.
  For equal absolute values of two shifts, the positive shift is sorted to come first.

## `eigvals_to_frequencies`

```python
def eigvals_to_frequencies(eigvals)
```

Convert an eigenvalue spectrum to frequency values, defined
as the the set of positive, unique differences of the eigenvalues in the spectrum.

Args:
    eigvals (tuple[int, float]): eigenvalue spectra

Returns:
    tuple[int, float]: frequencies

**Example**

>>> eigvals = (-0.5, 0, 0, 0.5)
>>> eigvals_to_frequencies(eigvals)
(0.5, 1.0)

## `frequencies_to_period`

```python
def frequencies_to_period(frequencies, decimals=5)
```

Returns the period of a Fourier series as defined
by a set of frequencies.

The period is simply :math:`2\pi/gcd(frequencies)`,
where :math:`\text{gcd}` is the greatest common divisor.

Args:
    spectra (tuple[int, float]): frequency spectra
    decimals (int): Number of decimal places to round to
        if there are non-integral frequencies.

Returns:
    tuple[int, float]: frequencies

**Example**

>>> frequencies = (0.5, 1.0)
>>> frequencies_to_period(frequencies)
12.566370614359172

## `generate_shift_rule`

```python
def generate_shift_rule(frequencies, shifts=None, order=1)
```

Computes the parameter shift rule for a unitary based on its generator's eigenvalue
frequency spectrum.

To compute gradients of circuit parameters in variational quantum algorithms, expressions for
cost function first derivatives with respect to the variational parameters can be cast into
linear combinations of expectation values at shifted parameter values. The coefficients and
shifts defining the linear combination can be obtained from the unitary generator's eigenvalue
frequency spectrum. Details can be found in
`Wierichs et al. (2022) <https://doi.org/10.22331/q-2022-03-30-677>`__.

Args:
    frequencies (tuple[int or float]): The tuple of eigenvalue frequencies. Eigenvalue
        frequencies are defined as the unique positive differences obtained from a set of
        eigenvalues.
    shifts (tuple[int or float]): the tuple of shift values. If unspecified,
        equidistant shifts are assumed. If supplied, the length of this tuple should match the
        number of given frequencies.
    order (int): the order of differentiation to compute the shift rule for

Returns:
    tuple: a tuple of coefficients and shifts describing the gradient rule for the
    parameter-shift method. For parameter :math:`\phi`, the coefficients :math:`c_i` and the
    shifts :math:`s_i` combine to give a gradient rule of the following form:

    .. math:: \frac{\partial}{\partial\phi}f = \sum_{i} c_i f(\phi + s_i).

    where :math:`f(\phi) = \langle 0|U(\phi)^\dagger \hat{O} U(\phi)|0\rangle`
    for some observable :math:`\hat{O}` and the unitary :math:`U(\phi)=e^{iH\phi}`.

Raises:
    ValueError: if ``frequencies`` is not a list of unique positive values, or if ``shifts``
        (if specified) is not a list of unique values the same length as ``frequencies``.

**Examples**

An example of obtaining the frequencies from generator eigenvalues, and obtaining the parameter
shift rule:

>>> eigvals = (-0.5, 0, 0, 0.5)
>>> frequencies = eigvals_to_frequencies(eigvals)
>>> generate_shift_rule(frequencies)
array([[ 0.4267767 ,  1.57079633],
       [-0.4267767 , -1.57079633],
       [-0.0732233 ,  4.71238898],
       [ 0.0732233 , -4.71238898]])

An example with explicitly specified shift values:

>>> frequencies = (1, 2, 4)
>>> shifts = (np.pi / 3, 2 * np.pi / 3, np.pi / 4)
>>> generate_shift_rule(frequencies, shifts)
array([[ 3.        ,  0.78539816],
       [-3.        , -0.78539816],
       [-2.09077028,  1.04719755],
       [ 2.09077028, -1.04719755],
       [ 0.2186308 ,  2.0943951 ],
       [-0.2186308 , -2.0943951 ]])

Higher order shift rules (corresponding to the :math:`n`-th derivative of the parameter) can be
requested via the ``order`` argument. For example, to extract the second order shift rule for a
gate with generator :math:`X/2`:

>>> eigvals = (0.5, -0.5)
>>> frequencies = eigvals_to_frequencies(eigvals)
>>> generate_shift_rule(frequencies, order=2)
array([[-0.5       ,  0.        ],
       [ 0.5       , -3.14159265]])

This corresponds to the shift rule
:math:`\frac{\partial^2 f}{\partial \phi^2} = \frac{1}{2} \left[f(\phi) - f(\phi-\pi)\right]`.

## `generate_multi_shift_rule`

```python
def generate_multi_shift_rule(frequencies, shifts=None, orders=None)
```

Computes the parameter shift rule with respect to two parametrized unitaries,
given their generator's eigenvalue frequency spectrum. This corresponds to a
shift rule that computes off-diagonal elements of higher order derivative tensors.
For the second order, this corresponds to the Hessian.

Args:
    frequencies (list[tuple[int or float]]): List of eigenvalue frequencies corresponding
        to the each parametrized unitary.
    shifts (list[tuple[int or float]]): List of shift values corresponding to each parametrized
        unitary. If unspecified, equidistant shifts are assumed. If supplied, the length
        of each tuple in the list must be the same as the length of the corresponding tuple in
        ``frequencies``.
    orders (list[int]): the order of differentiation for each parametrized unitary.
        If unspecified, the first order derivative shift rule is computed for each parametrized
        unitary.

Returns:
    tuple: a tuple of coefficients, shifts for the first parameter, and shifts for the
    second parameter, describing the gradient rule
    for the parameter-shift method.

    For parameters :math:`\phi_a` and :math:`\phi_b`, the
    coefficients :math:`c_i` and the shifts :math:`s^{(a)}_i`, :math:`s^{(b)}_i`,
    combine to give a gradient rule of the following form:

    .. math::

        \frac{\partial^2}{\partial\phi_a \partial\phi_b}f
        = \sum_{i} c_i f(\phi_a + s^{(a)}_i, \phi_b + s^{(b)}_i).

    where :math:`f(\phi_a, \phi_b) = \langle 0|U(\phi_a)^\dagger V(\phi_b)^\dagger \hat{O} V(\phi_b) U(\phi_a)|0\rangle`
    for some observable :math:`\hat{O}` and unitaries :math:`U(\phi_a)=e^{iH_a\phi_a}` and :math:`V(\phi_b)=e^{iH_b\phi_b}`.

**Example**

>>> generate_multi_shift_rule([(1,), (1,)])
array([[ 0.25      ,  1.57079633,  1.57079633],
       [-0.25      ,  1.57079633, -1.57079633],
       [-0.25      , -1.57079633,  1.57079633],
       [ 0.25      , -1.57079633, -1.57079633]])

This corresponds to the gradient rule

.. math::

    \begin{align*}
    \frac{\partial^2 f}{\partial x\partial y} &= \frac{1}{4}
    [f(x+\pi/2, y+\pi/2) - f(x+\pi/2, y-\pi/2)\\
    &\phantom{\frac{1}{4}[}-f(x-\pi/2, y+\pi/2) + f(x-\pi/2, y-\pi/2) ].
    \end{align*}

## `generate_shifted_tapes`

```python
def generate_shifted_tapes(tape, index, shifts, multipliers=None, broadcast=False)
```

Generate a list of tapes or a single broadcasted tape, where one marked
trainable parameter has been shifted by the provided shift values.

Args:
    tape (.QuantumTape): input quantum tape
    index (int): index of the trainable parameter to shift
    shifts (Sequence[float or int]): sequence of shift values.
        The length determines how many parameter-shifted tapes are created.
    multipliers (Sequence[float or int]): sequence of multiplier values.
        The length should match the one of ``shifts``. Each multiplier scales the
        corresponding gate parameter before the shift is applied. If not provided, the
        parameters will not be scaled.
    broadcast (bool): Whether or not to use broadcasting to create a single tape
        with the shifted parameters.

Returns:
    list[QuantumTape]: List of quantum tapes. In each tape the parameter indicated
        by ``index`` has been shifted by the values in ``shifts``. The number of tapes
        matches the length of ``shifts`` and ``multipliers`` (if provided).
        If ``broadcast=True`` was used, the list contains a single broadcasted tape
        with all shifts distributed over the broadcasting dimension. In this case,
        the ``batch_size`` of the returned tape matches the length of ``shifts``.

## `generate_multishifted_tapes`

```python
def generate_multishifted_tapes(tape, indices, shifts, multipliers=None)
```

Generate a list of tapes where multiple marked trainable
parameters have been shifted by the provided shift values.

Args:
    tape (.QuantumTape): input quantum tape
    indices (Sequence[int]): indices of the trainable parameters to shift
    shifts (Sequence[Sequence[float or int]]): Nested sequence of shift values.
        The length of the outer Sequence determines how many parameter-shifted
        tapes are created. The lengths of the inner sequences should match and
        have the same length as ``indices``.
    multipliers (Sequence[Sequence[float or int]]): Nested sequence
        of multiplier values of the same format as `shifts``. Each multiplier
        scales the corresponding gate parameter before the shift is applied.
        If not provided, the parameters will not be scaled.

Returns:
    list[QuantumTape]: List of quantum tapes. Each tape has the marked parameters
        indicated by ``indices`` shifted by the values of ``shifts``. The number
        of tapes will match the summed lengths of all inner sequences in ``shifts``
        and ``multipliers`` (if provided).
