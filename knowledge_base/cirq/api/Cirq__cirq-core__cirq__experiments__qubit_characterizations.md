---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/experiments/qubit_characterizations.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/experiments/qubit_characterizations.py
license: Apache-2.0
---

## `Cliffords`

```python
class Cliffords
```

The single-qubit Clifford group, decomposed into elementary gates.

The decomposition of the Cliffords follows those described in
Barends et al., Nature 508, 500 (https://arxiv.org/abs/1402.4848).

Decompositions of the Clifford group:
    c1_in_xy: decomposed into XPowGate and YPowGate.
    c1_in_xz: decomposed into XPowGate and ZPowGate, with at most one
        XPowGate (one microwave gate) per Clifford.

Subsets used to generate the 2-qubit Clifford group (see paper table S7):
    s1
    s1_x
    s1_y

## `RandomizedBenchMarkResult`

```python
class RandomizedBenchMarkResult
```

Results from a randomized benchmarking experiment.

### `__init__`

```python
def __init__(self, num_cliffords: Sequence[int], ground_state_probabilities: Sequence[float], ground_state_probabilities_std: Optional[Sequence[float]] | None=None)
```

Inits RandomizedBenchMarkResult.

Args:
    num_cliffords: The different numbers of Cliffords in the RB
        study.
    ground_state_probabilities: The corresponding average ground state
        probabilities.
    ground_state_probabilities_std: The standard deviation of the probabilities.

### `data`

```python
def data(self) -> Sequence[tuple[int, float]]
```

Returns a sequence of tuple pairs with the first item being a
number of Cliffords and the second item being the corresponding average
ground state probability.

### `plot`

```python
def plot(self, ax: plt.Axes | None=None, **plot_kwargs: Any) -> plt.Axes
```

Plots the average ground state probability vs the number of
Cliffords in the RB study.

Args:
    ax: the plt.Axes to plot on. If not given, a new figure is created,
        plotted on, and shown.
    **plot_kwargs: Arguments to be passed to 'plt.Axes.plot'.
Returns:
    The plt.Axes containing the plot.

### `pauli_error`

```python
def pauli_error(self) -> float
```

Returns the Pauli error inferred from randomized benchmarking.

If sequence fidelity $F$ decays with number of gates $m$ as

$$F = A p^m + B,$$

where $0 < p < 1$, then the Pauli error $r_p$ is given by

$$r_p = (1 - 1/d^2) * (1 - p),$$

where $d = 2^{N_Q}$ is the Hilbert space dimension and $N_Q$ is the number of qubits.

## `ParallelRandomizedBenchmarkingResult`

```python
class ParallelRandomizedBenchmarkingResult
```

Results from a parallel randomized benchmarking experiment.

### `plot_single_qubit`

```python
def plot_single_qubit(self, qubit: cirq.Qid, ax: plt.Axes | None=None, **plot_kwargs: Any) -> plt.Axes
```

Plot the raw data for the specified qubit.

Args:
    qubit: Plot data for this qubit.
    ax: the plt.Axes to plot on. If not given, a new figure is created,
        plotted on, and shown.
    **plot_kwargs: Arguments to be passed to 'plt.Axes.plot'.
Returns:
    The plt.Axes containing the plot.

### `pauli_error`

```python
def pauli_error(self) -> Mapping[cirq.Qid, float]
```

Return a dictionary of Pauli errors.
Returns:
    A dictionary containing the Pauli errors for all qubits.

### `plot_heatmap`

```python
def plot_heatmap(self, ax: plt.Axes | None=None, annotation_format: str='0.1%', title: str='Single-qubit Pauli error', **plot_kwargs: Any) -> plt.Axes
```

Plot a heatmap of the Pauli errors. If qubits are not cirq.GridQubits, throws an error.

Args:
    ax: the plt.Axes to plot on. If not given, a new figure is created,
        plotted on, and shown.
    annotation_format: The format string for the numbers in the heatmap.
    title: The title printed above the heatmap.
    **plot_kwargs: Arguments to be passed to 'cirq.Heatmap.plot()'.
Returns:
    The plt.Axes containing the plot.

### `plot_integrated_histogram`

```python
def plot_integrated_histogram(self, ax: plt.Axes | None=None, cdf_on_x: bool=False, axis_label: str='Pauli error', semilog: bool=True, median_line: bool=True, median_label: str | None='median', mean_line: bool=False, mean_label: str | None='mean', show_zero: bool=False, title: str | None=None, **kwargs) -> plt.Axes
```

Plot the Pauli errors using cirq.integrated_histogram().

Args:
    ax: The axis to plot on. If None, we generate one.
    cdf_on_x: If True, flip the axes compared the above example.
    axis_label: Label for x axis (y-axis if cdf_on_x is True).
    semilog: If True, force the x-axis to be logarithmic.
    median_line: If True, draw a vertical line on the median value.
    median_label: If drawing median line, optional label for it.
    mean_line: If True, draw a vertical line on the mean value.
    mean_label: If drawing mean line, optional label for it.
    title: Title of the plot. If None, we assign "N={len(data)}".
    show_zero: If True, moves the step plot up by one unit by prepending 0
        to the data.
    **kwargs: Kwargs to forward to `ax.step()`. Some examples are
        color: Color of the line.
        linestyle: Linestyle to use for the plot.
        lw: linewidth for integrated histogram.
        ms: marker size for a histogram trace.
        label: An optional label which can be used in a legend.
Returns:
    The axis that was plotted on.

## `TomographyResult`

```python
class TomographyResult
```

Results from a state tomography experiment.

### `__init__`

```python
def __init__(self, density_matrix: np.ndarray)
```

Inits TomographyResult.

Args:
    density_matrix: The density matrix obtained from tomography.

### `data`

```python
def data(self) -> np.ndarray
```

Returns an n^2 by n^2 complex matrix representing the density
matrix of the n-qubit system.

### `plot`

```python
def plot(self, axes: list[plt.Axes] | None=None, **plot_kwargs: Any) -> list[plt.Axes]
```

Plots the real and imaginary parts of the density matrix as two 3D bar plots.

Args:
    axes: A list of 2 `plt.Axes` instances. Note that they must be in
        3d projections. If not given, a new figure is created with 2
        axes and the plotted figure is shown.
    **plot_kwargs: The optional kwargs passed to bar3d.

Returns:
    the list of `plt.Axes` being plotted on.

Raises:
    ValueError: If axes is a list with length != 2.

## `RBParameters`

```python
class RBParameters
```

Parameters for running randomized benchmarking.

Arguments:
    num_clifford_range: The different numbers of Cliffords in the RB study.
    num_circuits: The number of random circuits generated for each
        number of Cliffords.
    repetitions: The number of repetitions of each circuit.
    use_xy_basis: Determines if the Clifford gates are built with x and y
        rotations (True) or x and z rotations (False).
    strict_basis: whether to use only cliffords that can be represented by at
        most 2 gates of the choses basis. For example,
        if True and use_xy_basis is True, this excludes $I, Z, \sqrt(Z), \-sqrt(Z)^\dagger$.
        if True and use_xy_basis is False, this excludes $I, Y, \sqrt(Y), -\sqrt(Y)^\dagger$.

## `single_qubit_randomized_benchmarking`

```python
def single_qubit_randomized_benchmarking(sampler: cirq.Sampler, qubit: cirq.Qid, use_xy_basis: bool=True, *, num_clifford_range: Sequence[int]=tuple(np.logspace(np.log10(5), 3, 5, dtype=int)), num_circuits: int=10, repetitions: int=600) -> RandomizedBenchMarkResult
```

Clifford-based randomized benchmarking (RB) of a single qubit.

A total of num_circuits random circuits are generated, each of which
contains a fixed number of single-qubit Clifford gates plus one
additional Clifford that inverts the whole sequence and a measurement in
the z-basis. Each circuit is repeated a number of times and the average
|0> state population is determined from the measurement outcomes of all
of the circuits.

The above process is done for different circuit lengths specified by the
integers in num_clifford_range. For example, an integer 10 means the
random circuits will contain 10 Clifford gates each plus one inverting
Clifford. The user may use the result to extract an average gate fidelity,
by analyzing the change in the average |0> state population at different
circuit lengths. For actual experiments, one should choose
num_clifford_range such that a clear exponential decay is observed in the
results.

See Barends et al., Nature 508, 500 for details.

Args:
    sampler: The quantum engine or simulator to run the circuits.
    qubit: The qubit under test.
    use_xy_basis: Determines if the Clifford gates are built with x and y
        rotations (True) or x and z rotations (False).
    num_clifford_range: The different numbers of Cliffords in the RB study.
    num_circuits: The number of random circuits generated for each
        number of Cliffords.
    repetitions: The number of repetitions of each circuit.

Returns:
    A RandomizedBenchMarkResult object that stores and plots the result.

## `parallel_single_qubit_randomized_benchmarking`

```python
def parallel_single_qubit_randomized_benchmarking(sampler: cirq.Sampler, qubits: Sequence[cirq.Qid], use_xy_basis: bool=True, *, num_clifford_range: Sequence[int]=tuple(np.logspace(np.log10(5), np.log10(1000), 5, dtype=int)), num_circuits: int=10, repetitions: int=1000) -> ParallelRandomizedBenchmarkingResult
```

Clifford-based randomized benchmarking (RB) single qubits in parallel.

This is the same as `single_qubit_randomized_benchmarking` except on all
of the specified qubits in parallel, i.e. with the individual randomized
benchmarking circuits zipped together.

Args:
    sampler: The quantum engine or simulator to run the circuits.
    use_xy_basis: Determines if the Clifford gates are built with x and y
        rotations (True) or x and z rotations (False).
    qubits: The qubits to benchmark.
    num_clifford_range: The different numbers of Cliffords in the RB study.
    num_circuits: The number of random circuits generated for each
        number of Cliffords.
    repetitions: The number of repetitions of each circuit.
Returns:
    A dictionary from qubits to RandomizedBenchMarkResult objects.

## `single_qubit_rb`

```python
def single_qubit_rb(sampler: cirq.Sampler, qubit: cirq.Qid, parameters: RBParameters=RBParameters(), rng_or_seed: np.random.Generator | int | None=None) -> RandomizedBenchMarkResult
```

Clifford-based randomized benchmarking (RB) on a single qubit.

Args:
    sampler: The quantum engine or simulator to run the circuits.
    qubit: The qubit(s) to benchmark.
    parameters: The parameters of the experiment.
    rng_or_seed: A np.random.Generator object or seed.
Returns:
    A dictionary from qubits to RandomizedBenchMarkResult objects.

## `parallel_single_qubit_rb`

```python
def parallel_single_qubit_rb(sampler: cirq.Sampler, qubits: Sequence[cirq.Qid], parameters: RBParameters=RBParameters(), rng_or_seed: np.random.Generator | int | None=None) -> ParallelRandomizedBenchmarkingResult
```

Clifford-based randomized benchmarking (RB) single qubits in parallel.

Args:
    sampler: The quantum engine or simulator to run the circuits.
    qubits: The qubit(s) to benchmark.
    parameters: The parameters of the experiment.
    rng_or_seed: A np.random.Generator object or seed.
Returns:
    A dictionary from qubits to RandomizedBenchMarkResult objects.

## `two_qubit_randomized_benchmarking`

```python
def two_qubit_randomized_benchmarking(sampler: cirq.Sampler, first_qubit: cirq.Qid, second_qubit: cirq.Qid, *, num_clifford_range: Sequence[int]=range(5, 50, 5), num_circuits: int=20, repetitions: int=1000) -> RandomizedBenchMarkResult
```

Clifford-based randomized benchmarking (RB) of two qubits.

A total of num_circuits random circuits are generated, each of which
contains a fixed number of two-qubit Clifford gates plus one additional
Clifford that inverts the whole sequence and a measurement in the
z-basis. Each circuit is repeated a number of times and the average
|00> state population is determined from the measurement outcomes of all
of the circuits.

The above process is done for different circuit lengths specified by the
integers in num_clifford_range. For example, an integer 10 means the
random circuits will contain 10 Clifford gates each plus one inverting
Clifford. The user may use the result to extract an average gate fidelity,
by analyzing the change in the average |00> state population at different
circuit lengths. For actual experiments, one should choose
num_clifford_range such that a clear exponential decay is observed in the
results.

The two-qubit Cliffords here are decomposed into CZ gates plus single-qubit
x and y rotations. See Barends et al., Nature 508, 500 for details.

Args:
    sampler: The quantum engine or simulator to run the circuits.
    first_qubit: The first qubit under test.
    second_qubit: The second qubit under test.
    num_clifford_range: The different numbers of Cliffords in the RB study.
    num_circuits: The number of random circuits generated for each
        number of Cliffords.
    repetitions: The number of repetitions of each circuit.

Returns:
    A RandomizedBenchMarkResult object that stores and plots the result.

## `single_qubit_state_tomography`

```python
def single_qubit_state_tomography(sampler: cirq.Sampler, qubit: cirq.Qid, circuit: cirq.AbstractCircuit, repetitions: int=1000) -> TomographyResult
```

Single-qubit state tomography.

The density matrix of the output state of a circuit is measured by first
doing projective measurements in the z-basis, which determine the
diagonal elements of the matrix. A X/2 or Y/2 rotation is then added before
the z-basis measurement, which determines the imaginary and real parts of
the off-diagonal matrix elements, respectively.

See Vandersypen and Chuang, Rev. Mod. Phys. 76, 1037 for details.

Args:
    sampler: The quantum engine or simulator to run the circuits.
    qubit: The qubit under test.
    circuit: The circuit to execute on the qubit before tomography.
    repetitions: The number of measurements for each basis rotation.

Returns:
    A TomographyResult object that stores and plots the density matrix.

## `two_qubit_state_tomography`

```python
def two_qubit_state_tomography(sampler: cirq.Sampler, first_qubit: cirq.Qid, second_qubit: cirq.Qid, circuit: cirq.AbstractCircuit, repetitions: int=1000) -> TomographyResult
```

Two-qubit state tomography.

To measure the density matrix of the output state of a two-qubit circuit,
different combinations of I, X/2 and Y/2 operations are applied to the
two qubits before measurements in the z-basis to determine the state
probabilities $P_{00}, P_{01}, P_{10}.$

The density matrix rho is decomposed into an operator-sum representation
$\sum_{i, j} c_{ij} * \sigma_i \bigotimes \sigma_j$, where $i, j = 0, 1, 2,
3$ and $\sigma_0 = I, \sigma_1 = \sigma_x, \sigma_2 = \sigma_y, \sigma_3 =
\sigma_z$ are the single-qubit Identity and Pauli matrices.

Based on the measured probabilities probs and the transformations of the
measurement operator by different basis rotations, one can build an
overdetermined set of linear equations.

As an example, if the identity operation (I) is applied to both qubits, the
measurement operators are $(I +/- \sigma_z) \bigotimes (I +/- \sigma_z)$.
The state probabilities $P_{00}, P_{01}, P_{10}$ thus obtained contribute
to the following linear equations (setting $c_{00} = 1$):

$$
\begin{align}
c_{03} + c_{30} + c_{33} &= 4*P_{00} - 1 \\
-c_{03} + c_{30} - c_{33} &= 4*P_{01} - 1 \\
c_{03} - c_{30} - c_{33} &= 4*P_{10} - 1
\end{align}
$$

And if a Y/2 rotation is applied to the first qubit and a X/2 rotation
is applied to the second qubit before measurement, the measurement
operators are $(I -/+ \sigma_x) \bigotimes (I +/- \sigma_y)$. The
probabilities obtained instead contribute to the following linear equations:

$$
\begin{align}
c_{02} - c_{10} - c_{12} &= 4*P_{00} - 1 \\
-c_{02} - c_{10} + c_{12} &= 4*P_{01} - 1 \\
c_{02} + c_{10} + c_{12} &= 4*P_{10} - 1
\end{align}
$$

Note that this set of equations has the same form as the first set under
the transformation $c_{03}$ <-> $c_{02}, c_{30}$ <-> $-c_{10}$ and
$c_{33}$ <-> $-c_{12}$.

Since there are 9 possible combinations of rotations (each producing 3
independent probabilities) and a total of 15 unknown coefficients $c_{ij}$,
one can cast all the measurement results into a overdetermined set of
linear equations numpy.dot(mat, c) = probs. Here c is of length 15 and
contains all the $c_{ij}$'s (except $c_{00}$ which is set to 1), and mat
is a 27 by 15 matrix having three non-zero elements in each row that are
either 1 or -1.

The least-square solution to the above set of linear equations is then
used to construct the density matrix rho.

See Vandersypen and Chuang, Rev. Mod. Phys. 76, 1037 for details and
Steffen et al, Science 313, 1423 for a related experiment.

Args:
    sampler: The quantum engine or simulator to run the circuits.
    first_qubit: The first qubit under test.
    second_qubit: The second qubit under test.
    circuit: The circuit to execute on the qubits before tomography.
    repetitions: The number of measurements for each basis rotation.

Returns:
    A TomographyResult object that stores and plots the density matrix.
