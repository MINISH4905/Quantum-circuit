---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/default_gaussian.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/default_gaussian.py
license: Apache-2.0
---

## Module `pennylane/devices/default_gaussian.py`

The :code:`default.gaussian` device is a simulator for Gaussian continuous-variable
quantum computations, and can be used as a template for writing PennyLane
devices for new CV backends.

It implements the necessary :class:`~pennylane.devices._legacy_device.Device` methods as well as all built-in
:mod:`continuous-variable Gaussian operations <pennylane.ops.cv>`, and provides a very simple simulation of a
Gaussian-based quantum circuit architecture.

## `partitions`

```python
def partitions(s, include_singles=True)
```

Partitions a sequence into all groupings of pairs and singles of elements.

Args:
    s (sequence): the sequence to partition
    include_singles (bool): if False, only partitions into pairs
        is returned.

Returns:
    tuple: returns a nested tuple, containing all partitions of the sequence.

## `fock_prob`

```python
def fock_prob(cov, mu, event, hbar=2.0)
```

Returns the probability of detection of a particular PNR detection event.

For more details, see:

* Kruse, R., Hamilton, C. S., Sansoni, L., Barkhofen, S., Silberhorn, C., & Jex, I.
  "A detailed study of Gaussian Boson Sampling." `arXiv:1801.07488. (2018).
  <https://arxiv.org/abs/1801.07488>`_

* Hamilton, C. S., Kruse, R., Sansoni, L., Barkhofen, S., Silberhorn, C., & Jex, I.
  "Gaussian boson sampling." `Physical review letters, 119(17), 170501. (2017).
  <https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.119.170501>`_

Args:
    cov (array): :math:`2N\times 2N` covariance matrix
    mu (array): length-:math:`2N` means vector
    event (array): length-:math:`N` array of non-negative integers representing the
        PNR detection event of the multi-mode system.
    hbar (float): (default 2) the value of :math:`\hbar` in the commutation
        relation :math:`[\x,\p]=i\hbar`.

Returns:
    float: probability of detecting the event

## `rotation`

```python
def rotation(phi)
```

Rotation in the phase space.

Args:
    phi (float): rotation parameter

Returns:
    array: symplectic transformation matrix

## `displacement`

```python
def displacement(state, wire, alpha, hbar=2)
```

Displacement in the phase space.

Args:
    state (tuple): contains covariance matrix and means vector
    wire (int): wire that the displacement acts on
    alpha (float): complex displacement

Returns:
    tuple: contains the covariance matrix and the vector of means

## `squeezing`

```python
def squeezing(r, phi)
```

Squeezing in the phase space.

Args:
    r (float): squeezing magnitude
    phi (float): rotation parameter

Returns:
    array: symplectic transformation matrix

## `quadratic_phase`

```python
def quadratic_phase(s)
```

Quadratic phase shift.

Args:
    s (float): gate parameter

Returns:
    array: symplectic transformation matrix

## `beamsplitter`

```python
def beamsplitter(theta, phi)
```

Beamsplitter.

Args:
    theta (float): transmittivity angle (:math:`t=\cos\theta`)
    phi (float): phase angle (:math:`r=e^{i\phi}\sin\theta`)

Returns:
    array: symplectic transformation matrix

## `two_mode_squeezing`

```python
def two_mode_squeezing(r, phi)
```

Two-mode squeezing.

Args:
    r (float): squeezing magnitude
    phi (float): rotation parameter

Returns:
    array: symplectic transformation matrix

## `controlled_addition`

```python
def controlled_addition(s)
```

CX gate.

Args:
    s (float): gate parameter

Returns:
    array: symplectic transformation matrix

## `controlled_phase`

```python
def controlled_phase(s)
```

CZ gate.

Args:
    s (float): gate parameter

Returns:
    array: symplectic transformation matrix

## `interferometer_unitary`

```python
def interferometer_unitary(U)
```

InterferometerUnitary

Args:
    U (array): unitary matrix

Returns:
    array: symplectic transformation matrix

## `squeezed_cov`

```python
def squeezed_cov(r, phi, hbar=2)
```

Returns the squeezed covariance matrix of a squeezed state.

Args:
    r (float): the squeezing magnitude
    p (float): the squeezing phase :math:`\phi`
    hbar (float): (default 2) the value of :math:`\hbar` in the commutation
        relation :math:`[\x,\p]=i\hbar`
Returns:
    array: the squeezed state

## `vacuum_state`

```python
def vacuum_state(wires, hbar=2.0)
```

Returns the vacuum state.

Args:
    wires (int): the number of wires to initialize in the vacuum state
    hbar (float): (default 2) the value of :math:`\hbar` in the commutation
        relation :math:`[\x,\p]=i\hbar`
Returns:
    array: the vacuum state

## `coherent_state`

```python
def coherent_state(a, phi=0, hbar=2.0)
```

Returns a coherent state.

Args:
    a (complex) : the displacement
    phi (float): the phase
    hbar (float): (default 2) the value of :math:`\hbar` in the commutation
        relation :math:`[\x,\p]=i\hbar`
Returns:
    array: the coherent state

## `squeezed_state`

```python
def squeezed_state(r, phi, hbar=2.0)
```

Returns a squeezed state.

Args:
    r (float): the squeezing magnitude
    phi (float): the squeezing phase :math:`\phi`
    hbar (float): (default 2) the value of :math:`\hbar` in the commutation
        relation :math:`[\x,\p]=i\hbar`

Returns:
    array: the squeezed state

## `displaced_squeezed_state`

```python
def displaced_squeezed_state(a, phi_a, r, phi_r, hbar=2.0)
```

Returns a squeezed coherent state

Args:
    a (real): the displacement magnitude
    phi_a (real): the displacement phase
    r (float): the squeezing magnitude
    phi_r (float): the squeezing phase :math:`\phi_r`
    hbar (float): (default 2) the value of :math:`\hbar` in the commutation
        relation :math:`[\x,\p]=i\hbar`

Returns:
    array: the squeezed coherent state

## `thermal_state`

```python
def thermal_state(nbar, hbar=2.0)
```

Returns a thermal state.

Args:
    nbar (float): the mean photon number
    hbar (float): (default 2) the value of :math:`\hbar` in the commutation
        relation :math:`[\x,\p]=i\hbar`

Returns:
    array: the thermal state

## `gaussian_state`

```python
def gaussian_state(cov, mu, hbar=2.0)
```

Returns a Gaussian state.

This is simply a bare wrapper function,
since the covariance matrix and means vector
can be passed via the parameters unchanged.

Note that both the covariance and means vector
matrix should be in :math:`(\x_1,\dots, \x_N, \p_1, \dots, \p_N)`
ordering.

Args:
    cov (array): covariance matrix. Must be dimension :math:`2N\times 2N`,
        where N is the number of modes
    mu (array): vector means. Must be length-:math:`2N`,
        where N is the number of modes
    hbar (float): (default 2) the value of :math:`\hbar` in the commutation
        relation :math:`[\x,\p]=i\hbar`

Returns:
    tuple: the mean and the covariance matrix of the Gaussian state

## `set_state`

```python
def set_state(state, wire, cov, mu)
```

Inserts a single mode Gaussian into the
state representation of the complete system.

Args:
    state (tuple): contains covariance matrix
        and means vector of existing state
    wire (Wires): wire corresponding to the new Gaussian state
    cov (array): covariance matrix to insert
    mu (array): vector of means to insert

Returns:
    tuple: contains the vector of means and covariance matrix.

## `photon_number`

```python
def photon_number(cov, mu, params, hbar=2.0)
```

Calculates the mean photon number for a given one-mode state.

Args:
    cov (array): :math:`2\times 2` covariance matrix
    mu (array): length-2 vector of means
    params (None): no parameters are used for this expectation value
    hbar (float): (default 2) the value of :math:`\hbar` in the commutation
        relation :math:`[\x,\p]=i\hbar`

Returns:
    tuple: contains the photon number expectation and variance

## `homodyne`

```python
def homodyne(phi: float | None=None)
```

Function factory that returns the Homodyne expectation of a one mode state.

Args:
    phi (Optional[float]): the default phase space axis to perform the Homodyne measurement

Returns:
    function: A function that accepts a single mode means vector, covariance matrix,
    and phase space angle phi, and returns the quadrature expectation
    value and variance.

## `poly_quad_expectations`

```python
def poly_quad_expectations(cov, mu, wires, device_wires, params, hbar=2.0)
```

Calculates the expectation and variance for an arbitrary
polynomial of quadrature operators.

Args:
    cov (array): covariance matrix
    mu (array): vector of means
    wires (Wires): wires to calculate the expectation for
    device_wires (Wires): corresponding wires on the device
    params (array): a :math:`(2N+1)\times (2N+1)` array containing the linear
        and quadratic coefficients of the quadrature operators
        :math:`(\I, \x_0, \p_0, \x_1, \p_1,\dots)`
    hbar (float): (default 2) the value of :math:`\hbar` in the commutation
        relation :math:`[\x,\p]=i\hbar`

Returns:
    tuple: the mean and variance of the quadrature-polynomial observable

## `fock_expectation`

```python
def fock_expectation(cov, mu, params, hbar=2.0)
```

Calculates the expectation and variance of a Fock state probability.

Args:
    cov (array): :math:`2N\times 2N` covariance matrix
    mu (array): length-:math:`2N` vector of means
    params (Sequence[int]): the Fock state to return the expectation value for
    hbar (float): (default 2) the value of :math:`\hbar` in the commutation
        relation :math:`[\x,\p]=i\hbar`

Returns:
    tuple: the Fock state expectation and variance

## `identity`

```python
def identity(*_, **__)
```

Returns 1.

Returns:
    tuple: the Fock state expectation and variance

## `DefaultGaussian`

```python
class DefaultGaussian(Device)
```

Default Gaussian device for PennyLane.

Args:
    wires (int, Iterable[Number, str]): Number of subsystems represented by the device,
        or iterable that contains unique labels for the subsystems as numbers (i.e., ``[-1, 0, 2]``)
        or strings (``['auxiliary', 'q1', 'q2']``). Default 1 if not specified.
    shots (None, int): How many times the circuit should be evaluated (or sampled) to estimate
        the expectation values. If ``None``, the results are analytically computed and hence deterministic.
    hbar (float): (default 2) the value of :math:`\hbar` in the commutation
        relation :math:`[\x,\p]=i\hbar`

### `expand`

```python
def expand(self, S, wires)
```

Expands a Symplectic matrix S to act on the entire subsystem.

Args:
    S (array): a :math:`2M\times 2M` Symplectic matrix
    wires (Wires): wires of the modes that S acts on

Returns:
    array: the resulting :math:`2N\times 2N` Symplectic matrix

### `sample`

```python
def sample(self, observable, wires, par)
```

Return a sample of an observable.

.. note::

    The ``default.gaussian`` plugin only supports sampling
    from :class:`~.X`, :class:`~.P`, and :class:`~.QuadOperator`
    observables.

Args:
    observable (str): name of the observable
    wires (Wires): wires the observable is to be measured on
    par (tuple): parameters for the observable

Returns:
    array[float]: samples in an array of dimension ``(n, num_wires)``

### `reset`

```python
def reset(self)
```

Reset the device

### `reduced_state`

```python
def reduced_state(self, wires)
```

Returns the covariance matrix and the vector of means of the specified wires.

Args:
    wires (Wires): requested wires

Returns:
    tuple (cov, means): cov is a square array containing the covariance matrix,
    and means is an array containing the vector of means
