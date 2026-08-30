---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/pulse/transmon.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/pulse/transmon.py
license: Apache-2.0
---

## Module `pennylane/pulse/transmon.py`

This module contains the classes/functions specific for simulation of superconducting transmon hardware systems

## `a`

```python
def a(wire, d=2)
```

creation operator

## `ad`

```python
def ad(wire, d=2)
```

annihilation operator

## `transmon_interaction`

```python
def transmon_interaction(qubit_freq: float | list, connections: list, coupling: float | list, wires: list, anharmonicity=None, d=2)
```

Returns a :class:`ParametrizedHamiltonian` representing the circuit QED Hamiltonian of a
superconducting transmon system.

The Hamiltonian is given by

.. math::

    H = \sum_{q\in \text{wires}} \omega_q b^\dagger_q b_q
    + \sum_{(i, j) \in \mathcal{C}} g_{ij} \left(b^\dagger_i b_j + b_j^\dagger b_i \right)
    + \sum_{q\in \text{wires}} \alpha_q b^\dagger_q b^\dagger_q b_q b_q

where :math:`[b_p, b_q^\dagger] = \delta_{pq}` are creation and annihilation operators.
The first term describes the effect of the dressed qubit frequencies ``qubit_freq`` :math:`= \omega_q/ (2\pi)`,
the second term their ``coupling`` :math:`= g_{ij}/(2\pi)` and the last the
``anharmonicity`` :math:`= \alpha_q/(2\pi)`, which all can vary for
different qubits. In practice, these operators are restricted to a finite dimension of the
local Hilbert space (default ``d=2`` corresponds to qubits).
In that case, the anharmonicity is set to :math:`\alpha=0` and ignored.

The values of :math:`\omega` and :math:`\alpha` are typically around :math:`5 \times 2\pi \text{GHz}`
and :math:`0.3 \times 2\pi \text{GHz}`, respectively.
It is common for different qubits to be out of tune with different energy gaps. The coupling strength
:math:`g` typically varies between :math:`[0.001, 0.1] \times 2\pi \text{GHz}`. For some example parameters,
see e.g. `arXiv:1804.04073 <https://arxiv.org/abs/1804.04073>`_,
`arXiv:2203.06818 <https://arxiv.org/abs/2203.06818>`_, or `arXiv:2210.15812 <https://arxiv.org/abs/2210.15812>`_.

.. note:: Currently only supporting ``d=2`` with qudit support planned in the future. For ``d=2``, we have :math:`b:=\frac{1}{2}(\sigma^x + i \sigma^y)`.

.. seealso::

    :func:`~.transmon_drive`

Args:
    qubit_freq (Union[float, list[float], Callable]): List of dressed qubit frequencies. This should be in units
        of frequency (GHz), and will be converted to angular frequency :math:`\omega` internally where
        needed, i.e. multiplied by :math:`2 \pi`. When passing a single float all qubits are assumed to
        have that same frequency. When passing a parametrized function, it must have two
        arguments, the first one being the trainable parameters and the second one being time.
    connections (list[tuple(int)]): List of connections ``(i, j)`` between qubits i and j.
        When the wires in ``connections`` are not contained in ``wires``, a warning is raised.
    coupling (Union[float, list[float]]): List of coupling strengths. This should be in units
        of frequency (GHz), and will be converted to angular frequency internally where
        needed, i.e. multiplied by :math:`2 \pi`. Needs to match the length of ``connections``.
        When passing a single float need explicit ``wires``.
    anharmonicity (Union[float, list[float]]): List of anharmonicities. This should be in units
        of frequency (GHz), and will be converted to angular frequency internally where
        needed, i.e. multiplied by :math:`2 \pi`. Ignored when ``d=2``.
        When passing a single float all qubits are assumed to have that same anharmonicity.
    wires (list): Needs to be of the same length as qubit_freq. Note that there can be additional
        wires in the resulting operator from the ``connections``, which are treated independently.
    d (int): Local Hilbert space dimension. Defaults to ``d=2`` and is currently the only supported value.

Returns:
    :class:`~.ParametrizedHamiltonian`: a :class:`~.ParametrizedHamiltonian` representing the transmon interaction

**Example**

We can set up the transmon interaction Hamiltonian with uniform coefficients by passing ``float`` values.

.. code-block::

    connections = [[0, 1], [1, 3], [2, 1], [4, 5]]
    H = qp.pulse.transmon_interaction(qubit_freq=0.5, connections=connections, coupling=1., wires=range(6))

The resulting :class:`~.HardwareHamiltonian:` consists of ``4`` coupling terms and ``6`` qubits
because there are six different wire indices in ``connections``.

>>> print(H)
HardwareHamiltonian: terms=10

We can also provide individual values for each of the qubit energies and coupling strengths,
here of order :math:`0.1 \times 2\pi\text{GHz}` and :math:`1 \times 2\pi\text{GHz}`, respectively.

.. code-block::

    qubit_freqs = [0.5, 0.4, 0.3, 0.2, 0.1, 0.]
    couplings= [1., 2., 3., 4.]
    H = qp.pulse.transmon_interaction(qubit_freq=qubit_freqs,
                                       connections=connections,
                                       coupling=couplings,
                                       wires=range(6))

The interaction term is dependent only on the typically fixed transmon energies and coupling strengths.
Executing this as a pulse program via :func:`~.evolve` would correspond to all driving fields being turned off.
To add a driving field, see :func:`~.transmon_drive`.

## `callable_freq_to_angular`

```python
def callable_freq_to_angular(fn)
```

Add a factor of 2pi to a callable result to convert from Hz to rad/s

## `TransmonSettings`

```python
class TransmonSettings
```

Dataclass that contains the information of a Transmon setup.

.. seealso:: :func:`transmon_interaction`

Args:
        connections (List): List `[[idx_q0, idx_q1], ..]` of connected qubits (wires)
        qubit_freq (List[float, Callable]):
        coupling (List[list, TensorLike, Callable]):
        anharmonicity (List[float, Callable]):

## `transmon_drive`

```python
def transmon_drive(amplitude, phase, freq, wires, d=2)
```

Returns a :class:`ParametrizedHamiltonian` representing the drive term of a transmon qubit.

The Hamiltonian is given by

.. math::

    \Omega(t) \sin\left(\phi(t) + \nu t\right) \sum_q Y_q

where :math:`\{Y_q\}` are the Pauli-Y operators on ``wires`` :math:`\{q\}`.
The arguments ``amplitude``, ``phase`` and ``freq`` correspond to :math:`\Omega / (2\pi)`, :math:`\phi`
and :math:`\nu / (2\pi)`, respectively, and can all be either fixed numbers (``float``) or depend on time
(``callable``). If they are time-dependent, they need to abide by the restrictions imposed
in :class:`ParametrizedHamiltonian` and have a signature of two parameters, ``(params, t)``.

Together with the qubit :math:`Z` terms in :func:`transmon_interaction`, driving with this term can generate
:math:`X` and :math:`Y` rotations by setting :math:`\phi` accordingly and driving on resonance
(see eqs. (79) - (92) in `1904.06560 <https://arxiv.org/abs/1904.06560>`_).
Further, it can generate entangling gates by driving at cross-resonance with a coupled qubit
(see eqs. (131) - (137) in `1904.06560 <https://arxiv.org/abs/1904.06560>`_).
Such a coupling is described in :func:`transmon_interaction`.

For realistic simulations, one may restrict the amplitude, phase and drive frequency parameters.
For example, the authors in `2008.04302 <https://arxiv.org/abs/2008.04302>`_ impose the restrictions of
a maximum amplitude :math:`\Omega_{\text{max}} = 20 \text{MHz}` and the carrier frequency to deviate at most
:math:`\nu - \omega = \pm 1 \text{GHz}` from the qubit frequency :math:`\omega`
(see :func:`~.transmon_interaction`).
The phase :math:`\phi(t)` is typically a slowly changing function of time compared to :math:`\Omega(t)`.

.. note:: Currently only supports ``d=2`` with qudit support planned in the future.
    For ``d>2``, we have :math:`Y \mapsto i (\sigma^- - \sigma^+)`
    with lowering and raising operators  :math:`\sigma^{\mp}`.

.. note:: Due to convention in the respective fields, we omit the factor :math:`\frac{1}{2}` present in the related constructor :func:`~.rydberg_drive`

.. seealso::

    :func:`~.rydberg_drive`, :func:`~.transmon_interaction`

Args:
    amplitude (Union[float, callable]): Float or callable representing the amplitude of the driving field.
        This should be in units of frequency (GHz), and will be converted to angular frequency
        :math:`\Omega(t)` internally where needed, i.e. multiplied by :math:`2 \pi`.
    phase (Union[float, callable]): Float or callable returning phase :math:`\phi(t)` (in radians).
        Can be a fixed number (``float``) or depend on time (``callable``)
    freq (Union[float, callable]): Float or callable representing the frequency of the driving field.
        This should be in units of frequency (GHz), and will be converted to angular frequency
        :math:`\nu(t)` internally where needed, i.e. multiplied by :math:`2 \pi`.
    wires (Union[int, list[int]]): Label of the qubit that the drive acts upon. Can be a list of multiple wires.
    d (int): Local Hilbert space dimension. Defaults to ``d=2`` and is currently the only supported value.

Returns:
    :class:`~.ParametrizedHamiltonian`: a :class:`~.ParametrizedHamiltonian` representing the transmon interaction

**Example**

We can construct a drive term acting on qubit ``0`` in the following way. We parametrize the amplitude and phase
via :math:`\Omega(t)/(2 \pi) = A \times \sin^2(\pi t)` and :math:`\phi(t) = \phi_0 (t - \frac{1}{2})`. The squared
sine ensures that the amplitude will be strictly positive (a requirement for some hardware). For simplicity, we
set the drive frequency to zero :math:`\nu=0`.

.. code-block:: python3

    def amp(A, t):
        return A * jnp.exp(-t**2)

    def phase(phi0, t):
        return phi0

    freq = 0

    H = qp.pulse.transmon_drive(amp, phase, freq, 0)

    t = 0.
    A = 1.
    phi0 = jnp.pi/2
    params = [A, phi0]

Evaluated at :math:`t = 0` with the parameters :math:`A = 1` and :math:`\phi_0 = \pi/2` we obtain
:math:`2 \pi A \exp(0) \sin(\pi/2 + 0)\sigma^y = 2 \pi \sigma^y`.

>>> H(params, t)
6.283185307179586 * Y(0)

We can combine ``transmon_drive()`` with :func:`~.transmon_interaction` to create a full driven transmon Hamiltonian.
Let us look at a chain of three transmon qubits that are coupled with their direct neighbors. We provide all
frequencies in GHz (conversion to angular frequency, i.e. multiplication by :math:`2 \pi`, is taken care of
internally where needed).

We use values around :math:`\omega = 5 \times 2\pi \text{GHz}` for resonant frequencies, and coupling strenghts
on the order of around :math:`g = 0.01 \times 2\pi \text{GHz}`.

We parametrize the drive Hamiltonians for the qubits with amplitudes as squared sinusodials of
maximum amplitude :math:`A`, and constant drive frequencies of value :math:`\nu`. We set the
phase to zero :math:`\phi=0`, and we make the parameters :math:`A` and :math:`\nu` trainable
for every qubit. We simulate the evolution for a time window of :math:`[0, 5]\text{ns}`.

.. code-block:: python3

    import jax

    jax.config.update("jax_enable_x64", True)

    qubit_freqs = [5.1, 5., 5.3]
    connections = [[0, 1], [1, 2]]  # qubits 0 and 1 are coupled, as are 1 and 2
    g = [0.02, 0.05]
    H = qp.pulse.transmon_interaction(qubit_freqs, connections, g, wires=range(3))

    def amp(max_amp, t): return max_amp * jnp.sin(t) ** 2
    freq = qp.pulse.constant  # Parametrized constant frequency
    phase = 0.0
    time = 5

    for q in range(3):
        H += qp.pulse.transmon_drive(amp, phase, freq, q)  # Parametrized drive for each qubit

    dev = qp.device("default.qubit", wires=range(3))

    @jax.jit
    @qp.qnode(dev, interface="jax")
    def qnode(params):
        qp.evolve(H)(params, time)
        return qp.expval(qp.Z(0) + qp.Z(1) + qp.Z(2))

We evaluate the Hamiltonian with some arbitrarily chosen maximum amplitudes (here on the order of :math:`0.5 \times 2\pi \text{GHz}`)
and set the drive frequency equal to the qubit frequencies. Note how the order of the construction
of ``H`` determines the order with which the parameters need to be passed to
:class:`~.ParametrizedHamiltonian` and :func:`~.evolve`. We made the drive frequencies
trainable parameters by providing constant callables through :func:`~.pulse.constant` instead of fixed values (like the phase).
This allows us to differentiate with respect to both the maximum amplitudes and the frequencies and optimize them.

>>> max_amp0, max_amp1, max_amp2 = [0.5, 0.3, 0.6]
>>> fr0, fr1, fr2 = qubit_freqs
>>> params = [max_amp0, fr0, max_amp1, fr1, max_amp2, fr2]
>>> qnode(params)
Array(-1.57851962, dtype=float64)
>>> jax.grad(qnode)(params)
[Array(-13.50193649, dtype=float64),
 Array(3.1112141, dtype=float64),
 Array(16.40286521, dtype=float64),
 Array(-4.30485667, dtype=float64),
 Array(4.75813949, dtype=float64),
 Array(3.43272354, dtype=float64)]

## `AmplitudeAndPhaseAndFreq`

```python
class AmplitudeAndPhaseAndFreq
```

Class storing combined amplitude, phase and freq callables
