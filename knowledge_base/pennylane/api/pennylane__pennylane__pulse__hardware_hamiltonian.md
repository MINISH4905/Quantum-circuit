---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/pulse/hardware_hamiltonian.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/pulse/hardware_hamiltonian.py
license: Apache-2.0
---

## Module `pennylane/pulse/hardware_hamiltonian.py`

This module contains the classes/functions needed to simulate and execute the evolution of real
Hardware Hamiltonians

## `drive`

```python
def drive(amplitude, phase, wires)
```

Returns a :class:`ParametrizedHamiltonian` representing the action of a driving electromagnetic
field with a set of qubits.

.. math::
    \frac{1}{2} \sum_{j \in \text{wires}} \Omega(t) \left(e^{i \phi(t)} \sigma^+_j + e^{-i \phi(t)} \sigma^-_j \right)

where :math:`\Omega` and :math:`\phi` correspond to the amplitude and phase of the
electromagnetic driving field and :math:`j` corresponds to the wire index. We are describing the Hamiltonian
in terms of ladder operators :math:`\sigma^\pm = \frac{1}{2}(\sigma_x \pm i \sigma_y)`. Note that depending on the
hardware realization (neutral atoms, superconducting qubits), there are different conventions and notations.
E.g., for superconducting qubits it is common to describe the exponent of the phase factor as :math:`\exp(i(\phi(t) + \nu t))`, where :math:`\nu` is the
drive frequency. We describe their relations in the theoretical background section below.

Common hardware systems are superconducting qubits and neutral atoms. The electromagnetic field of the drive is
realized by microwave and laser fields, respectively, operating at very different wavelengths.
To avoid numerical problems due to using both very large and very small numbers, it is advisable to match
the order of magnitudes of frequency and time arguments.
Read the usage details for more information on how to choose :math:`\Omega` and :math:`\phi`.

Args:
    amplitude (Union[float, Callable]): float or callable returning the amplitude of an
        electromagnetic field
    phase (Union[float, Callable]): float or callable returning the phase (in radians) of the electromagnetic field
    wires (Union[int, List[int]]): integer or list containing wire values for the qubits that
        the electromagnetic field acts on

Returns:
    ParametrizedHamiltonian: a :class:`~.ParametrizedHamiltonian` representing the action of the electromagnetic field
    on the qubits.

.. seealso::

    :func:`~.rydberg_interaction`, :class:`~.ParametrizedHamiltonian`, :class:`~.ParametrizedEvolution`
    and :func:`~.evolve`

**Example**

We create a Hamiltonian describing an electromagnetic field acting on 4 qubits with a fixed
phase, as well as a parametrized, time-dependent amplitude. The Hamiltonian includes an interaction term for
inter-qubit interactions.

.. code-block:: python3

    import jax.numpy as jnp

    wires = [0, 1, 2, 3]
    H_int = sum([qp.X(i) @ qp.X((i+1)%len(wires)) for i in wires])

    amplitude = lambda p, t: p * jnp.sin(jnp.pi * t)
    phase = jnp.pi / 2
    H_d = qp.pulse.drive(amplitude, phase, wires)

>>> H_int
(
X(0) @ X(1)
+ X(1) @ X(2)
+ X(2) @ X(3)
+ X(3) @ X(0)
)
>>> H_d
HardwareHamiltonian:: terms=2

The terms of the drive Hamiltonian ``H_d`` correspond to the two terms
:math:`\Omega e^{i \phi(t)} \sigma^+_j + \Omega e^{-i \phi(t)} \sigma^-_j`,
describing a drive between the ground and excited states.
In this case, the drive term corresponds to a global drive, as it acts on all 4 wires of
the device.

The full Hamiltonian can be evaluated:

.. code-block:: python3

    import jax

    jax.config.update("jax_enable_x64", True)

    dev = qp.device("default.qubit", wires=wires)

    @qp.qnode(dev, interface="jax")
    def circuit(params):
        qp.evolve(H_int + H_d)(params, t=[0, 10])
        return qp.expval(qp.Z(0))

>>> params = [2.4]
>>> circuit(params)
Array(-0.17375104, dtype=float64)
>>> jax.grad(circuit)(params)
[Array(13.66916253, dtype=float64, weak_type=True)]

We can also create a Hamiltonian with multiple local drives. The following circuit corresponds to the
evolution where an additional local drive that changes in time is acting on wires ``[0, 1]`` is added to the Hamiltonian:

.. code-block:: python3

    amplitude_local = lambda p, t: p[0] * jnp.sin(2 * jnp.pi * t) + p[1]
    phase_local = lambda p, t: p * jnp.exp(-0.25 * t)
    H_local = qp.pulse.drive(amplitude_local, phase_local, [0, 1])

    H = H_int + H_d + H_local

    @jax.jit
    @qp.qnode(dev, interface="jax")
    def circuit_local(params):
        qp.evolve(H)(params, t=[0, 10])
        return qp.expval(qp.Z(0))

    p_global = 2.4
    p_amp = [1.3, -2.0]
    p_phase = 0.5
    params = (p_global, p_amp, p_phase)

>>> circuit_local(params)
Array(0.37385014, dtype=float64)
>>> jax.grad(circuit_local)(params)
(Array(-3.35835837, dtype=float64),
 [Array(-1.02229985, dtype=float64, weak_type=True),
  Array(2.82368978, dtype=float64, weak_type=True)],
 Array(0.1339487, dtype=float64))

.. details::
    :title: Theoretical background
    :href: theory

    Depending on the community and field it is often common to write the driving field Hamiltonian as

    .. math::
        H = \frac{1}{2} \Omega(t) \sum_{j \in \text{wires}} \left(e^{i (\phi(t) + \nu t)} \sigma^+_j + e^{-i (\phi(t) + \nu t)} \sigma^-_j \right)
        + \omega_q \sum_{j \in \text{wires}} \sigma^z_j,

    with amplitude :math:`\Omega`, phase :math:`\phi` and drive frequency :math:`\nu` of the electromagnetic field, as well as the qubit frequency :math:`\omega_q`.
    We can move to the rotating frame of the driving field by applying :math:`U = e^{-i\nu t \sigma^z}` which yields the new Hamiltonian

    .. math::
        H = \frac{1}{2} \Omega(t) \sum_{j \in \text{wires}} \left(e^{i \phi(t)} \sigma^+_j + e^{-i \phi(t)} \sigma^-_j \right)
        - (\nu - \omega_q) \sum_{j \in \text{wires}} \sigma^z_j

    The latter formulation is more common in neutral atom systems where we define the detuning from the atomic energy gap
    as :math:`\Delta = \nu - \omega_q`. This is because here all atoms have the same energy gap, whereas for superconducting
    qubits that is typically not the case.
    Note that a potential anharmonicity term, as is common for transmon systems when taking into account higher energy
    levels, is unaffected by this transformation.

    Further, note that the factor :math:`\frac{1}{2}` is a matter of convention. We keep it for ``drive()`` as well as :func:`~.rydberg_drive`,
    but omit it in :func:`~.transmon_drive`, as is common in the respective fields.

.. details::
    **Neutral Atom Rydberg systems**

    In neutral atom systems for quantum computation and quantum simulation, a Rydberg transition is driven by an optical laser that is close to the transition's resonant frequency (with a potential detuning with regards to the resonant frequency on the order of MHz).
    The interaction between different atoms is given by the :func:`rydberg_interaction`, for which we pass the atomic coordinates (in µm),
    here arranged in a square of length :math:`4 \mu m`.

    .. code-block:: python3

        atom_coordinates = [[0, 0], [0, 4], [4, 0], [4, 4]]
        wires = [1, 2, 3, 4]
        assert len(wires) == len(atom_coordinates)
        H_i = qp.pulse.rydberg_interaction(atom_coordinates, wires)

    We can now simulate driving those atoms with an oscillating amplitude :math:`\Omega` that is trainable, for a duration of :math:`10 \mu s`.

    .. code-block:: python3

        amplitude = lambda p, t: p * jnp.sin(jnp.pi * t)
        phase = jnp.pi / 2

        H_d = qp.pulse.drive(amplitude, phase, wires)

        # detuning term
        H_z = qp.dot([-3*jnp.pi/4]*len(wires), [qp.Z(i) for i in wires])


    The total Hamiltonian of that evolution is given by

    .. math::
        \frac{1}{2} p \sin(\pi t) \sum_{j \in \text{wires}} \left(e^{i \pi/2} \sigma^+_j + e^{-i \pi/2} \sigma^-_j \right) -
        \frac{3 \pi}{4} \sum_{j \in \text{wires}} \sigma^z_j + \sum_{k<\ell} V_{k \ell} n_k n_\ell

    and can be executed and differentiated via the following code.

    .. code-block:: python3

        dev = qp.device("default.qubit", wires=wires)
        @qp.qnode(dev, interface="jax")
        def circuit(params):
            qp.evolve(H_i + H_z + H_d)(params, t=[0, 10])
            return qp.expval(qp.Z(1))

    >>> params = [2.4]
    >>> circuit(params)
    Array(0.96347734, dtype=float64)
    >>> jax.grad(circuit)(params)
    [Array(-0.4311521, dtype=float64, weak_type=True)]

## `HardwareHamiltonian`

```python
class HardwareHamiltonian(ParametrizedHamiltonian)
```

Internal class used to keep track of the required information to translate a ``ParametrizedHamiltonian``
into hardware.

This class contains the ``coeffs`` and the ``observables`` to construct the :class:`ParametrizedHamiltonian`,
but on top of that also contains attributes that store parameteres relevant for real hardware execution.

.. warning::

    This class should NEVER be initialized directly! Please use the functions
    :func:`rydberg_interaction` and :func:`drive` instead.

.. seealso:: :func:`rydberg_interaction`, :func:`drive`, :class:`ParametrizedHamiltonian`

Args:
    coeffs (Union[float, callable]): coefficients of the Hamiltonian expression, which may be
        constants or parametrized functions. All functions passed as ``coeffs`` must have two
        arguments, the first one being the trainable parameters and the second one being time.
    observables (Iterable[Operator]): observables in the Hamiltonian expression, of same
        length as ``coeffs``

Keyword Args:
    reorder_fn (callable): function for reordering the parameters before calling.
        This allows automatically copying parameters when they are used for different terms,
        as well as allowing single terms to depend on multiple parameters, as is the case for
        drive Hamiltonians. Note that in order to add two HardwareHamiltonians,
        the reorder_fn needs to be matching.
    settings Union[RydbergSettings, TransmonSettings]: Dataclass containing the hardware specific settings. Default is ``None``.
    pulses (list[HardwarePulse]): list of ``HardwarePulse`` dataclasses containing the information about the
        amplitude, phase, drive frequency and wires of each pulse

Returns:
    HardwareHamiltonian: class representing the Hamiltonian of Rydberg or Transmon device.

### `__radd__`

```python
def __radd__(self, other)
```

Deals with the special case where a HardwareHamiltonian is added to a
ParametrizedHamiltonian. Ensures that this returns a HardwareHamiltonian where
the order of the parametrized coefficients and operators matches the order of
the hamiltonians, i.e. that
ParametrizedHamiltonian + HardwareHamiltonian
returns a HardwareHamiltonian where the call expects params = [params_PH] + [params_RH]

## `HardwarePulse`

```python
class HardwarePulse
```

Dataclass that contains the information of a single drive pulse. This class is used
internally in PL to group into a single object all the data related to a single EM field.
Args:
    amplitude (Union[float, Callable]): float or callable returning the amplitude of an EM
        field
    phase (Union[float, Callable]): float containing the phase (in radians) of the EM field
    frequency (Union[float, Callable]): float or callable returning the frequency of a
        EM field. In the case of superconducting transmon systems this is the drive frequency.
        In the case of neutral atom rydberg systems this is the detuning between the drive frequency
        and energy gap.
    wires (Union[int, List[int]]): integer or list containing wire values that the EM field
        acts on

## `amplitude_and_phase`

```python
def amplitude_and_phase(trig_fn, amp, phase, hz_to_rads=2 * np.pi)
```

Wrapper function for combining amplitude and phase into a single callable
(or constant if neither amplitude nor phase are callable). The factor of :math:`2 \pi` converts
amplitude in Hz to amplitude in radians/second.

## `AmplitudeAndPhase`

```python
class AmplitudeAndPhase
```

Class storing combined amplitude and phase callable if either or both
of amplitude or phase are callable.
