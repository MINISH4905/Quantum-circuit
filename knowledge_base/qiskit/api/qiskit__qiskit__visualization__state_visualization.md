---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/state_visualization.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/state_visualization.py
license: Apache-2.0
---

## Module `qiskit/visualization/state_visualization.py`

Visualization functions for quantum states.

## `plot_state_hinton`

```python
def plot_state_hinton(state, title='', figsize=None, ax_real=None, ax_imag=None, *, filename=None)
```

Plot a hinton diagram for the density matrix of a quantum state.

The hinton diagram represents the values of a matrix using
squares, whose size indicate the magnitude of their corresponding value
and their color, its sign. A white square means the value is positive and
a black one means negative.

Args:
    state (Statevector or DensityMatrix or ndarray): An N-qubit quantum state.
    title (str): a string that represents the plot title
    figsize (tuple): Figure size in inches.
    filename (str | None): The optional file path to save image to. If not specified
        no file is created for the visualization. If this is set the return
        from this function will be ``None``.
    ax_real (matplotlib.axes.Axes): An optional Axes object to be used for
        the visualization output. If none is specified a new matplotlib
        Figure will be created and used. If this is specified without an
        ax_imag only the real component plot will be generated.
        Additionally, if specified there will be no returned Figure since
        it is redundant.
    ax_imag (matplotlib.axes.Axes): An optional Axes object to be used for
        the visualization output. If none is specified a new matplotlib
        Figure will be created and used. If this is specified without an
        ax_imag only the real component plot will be generated.
        Additionally, if specified there will be no returned Figure since
        it is redundant.

Returns:
    :class:`matplotlib:matplotlib.figure.Figure` :
        The matplotlib.Figure of the visualization if
        neither ax_real or ax_imag is set.

Raises:
    MissingOptionalLibraryError: Requires matplotlib.
    VisualizationError: Input is not a valid N-qubit state.

Examples:
    .. plot::
       :alt: Output from the previous code.
       :include-source:

        import numpy as np
        from qiskit import QuantumCircuit
        from qiskit.quantum_info import DensityMatrix
        from qiskit.visualization import plot_state_hinton

        qc = QuantumCircuit(2)
        qc.h([0, 1])
        qc.cz(0,1)
        qc.ry(np.pi/3 , 0)
        qc.rx(np.pi/5, 1)

        state = DensityMatrix(qc)
        plot_state_hinton(state, title="New Hinton Plot")

## `plot_bloch_vector`

```python
def plot_bloch_vector(bloch, title='', ax=None, figsize=None, coord_type='cartesian', font_size=None)
```

Plot the Bloch sphere.

Plot a Bloch sphere with the specified coordinates, that can be given in both
cartesian and spherical systems.

Args:
    bloch (tuple[float, float, float]): tuple of three elements where (<x>, <y>, <z>) (Cartesian)
        or (<r>, <theta>, <phi>) (spherical in radians)
        <theta> is inclination angle from +z direction
        <phi> is azimuth from +x direction
    title (str): a string that represents the plot title
    ax (matplotlib.axes.Axes): An Axes to use for rendering the bloch
        sphere
    figsize (tuple): Figure size in inches. Has no effect if passing ``ax``.
    coord_type (Literal["cartesian", "spherical"]): Either ``"cartesian"`` or ``"spherical"``
        depending on whether the input is given in Cartesian or spherical coordinates.
    font_size (float): Font size.

Returns:
    :class:`matplotlib:matplotlib.figure.Figure` : A matplotlib figure instance if ``ax = None``.

Raises:
    MissingOptionalLibraryError: Requires matplotlib.

Examples:
    .. plot::
       :alt: Output from the previous code.
       :include-source:

       from qiskit.visualization import plot_bloch_vector

       plot_bloch_vector([0,1,0], title="New Bloch Sphere")

    .. plot::
       :alt: Output from the previous code.
       :include-source:

       import numpy as np
       from qiskit.visualization import plot_bloch_vector

       # You can use spherical coordinates instead of cartesian.

       plot_bloch_vector([1, np.pi/2, np.pi/3], coord_type='spherical')

## `plot_bloch_multivector`

```python
def plot_bloch_multivector(state, title='', figsize=None, *, reverse_bits=False, filename=None, font_size=None, title_font_size=None, title_pad=1)
```

Plot a Bloch sphere for each qubit.

Each component :math:`(x,y,z)` of the Bloch sphere labeled as 'qubit i' represents the expected
value of the corresponding Pauli operator acting only on that qubit, that is, the expected value
of :math:`I_{N-1} \otimes\dotsb\otimes I_{i+1}\otimes P_i \otimes I_{i-1}\otimes\dotsb\otimes
I_0`, where :math:`N` is the number of qubits, :math:`P\in \{X,Y,Z\}` and :math:`I` is the
identity operator.

Args:
    state (Statevector or DensityMatrix or ndarray): an N-qubit quantum state.
    title (str): a string that represents the plot title
    figsize (tuple): size of each individual Bloch sphere figure, in inches.
    reverse_bits (bool): If True, plots qubits following Qiskit's convention [Default:False].
    font_size (float): Font size for the Bloch ball figures.
    title_font_size (float): Font size for the title.
    title_pad (float): Padding for the title (suptitle ``y`` position is ``0.98``
    and the image height will be extended by ``1 + title_pad/100``).
    filename (str | None): The optional file path to save image to. If not specified
        no file is created for the visualization. If this is set the return
        from this function will be ``None``.

Returns:
    :class:`matplotlib:matplotlib.figure.Figure` :
        A matplotlib figure instance.

Raises:
    MissingOptionalLibraryError: Requires matplotlib.
    VisualizationError: if input is not a valid N-qubit state.

Examples:
    .. plot::
       :alt: Output from the previous code.
       :include-source:

        from qiskit import QuantumCircuit
        from qiskit.quantum_info import Statevector
        from qiskit.visualization import plot_bloch_multivector

        qc = QuantumCircuit(2)
        qc.h(0)
        qc.x(1)

        state = Statevector(qc)
        plot_bloch_multivector(state)

    .. plot::
       :alt: Output from the previous code.
       :include-source:

       from qiskit import QuantumCircuit
       from qiskit.quantum_info import Statevector
       from qiskit.visualization import plot_bloch_multivector

       qc = QuantumCircuit(2)
       qc.h(0)
       qc.x(1)

       # You can reverse the order of the qubits.

       from qiskit.quantum_info import DensityMatrix

       qc = QuantumCircuit(2)
       qc.h([0, 1])
       qc.t(1)
       qc.s(0)
       qc.cx(0,1)

       matrix = DensityMatrix(qc)
       plot_bloch_multivector(matrix, title='My Bloch Spheres', reverse_bits=True)

## `plot_state_city`

```python
def plot_state_city(state, title='', figsize=None, color=None, alpha=1, ax_real=None, ax_imag=None, *, filename=None)
```

Plot the cityscape of quantum state.

Plot two 3d bar graphs (two dimensional) of the real and imaginary
part of the density matrix rho.

Args:
    state (Statevector or DensityMatrix or ndarray): an N-qubit quantum state.
    title (str): a string that represents the plot title
    figsize (tuple): Figure size in inches.
    color (list): A list of len=2 giving colors for real and
        imaginary components of matrix elements.
    alpha (float): Transparency value for bars
    ax_real (matplotlib.axes.Axes): An optional Axes object to be used for
        the visualization output. If none is specified a new matplotlib
        Figure will be created and used. If this is specified without an
        ax_imag only the real component plot will be generated.
        Additionally, if specified there will be no returned Figure since
        it is redundant.
    ax_imag (matplotlib.axes.Axes): An optional Axes object to be used for
        the visualization output. If none is specified a new matplotlib
        Figure will be created and used. If this is specified without an
        ax_real only the imaginary component plot will be generated.
        Additionally, if specified there will be no returned Figure since
        it is redundant.
    filename (str | None): The optional file path to save image to. If not specified
        no file is created for the visualization. If this is set the return
        from this function will be ``None``.

Returns:
    :class:`matplotlib:matplotlib.figure.Figure` :
        The matplotlib.Figure of the visualization if the
        ``ax_real`` and ``ax_imag`` kwargs are not set

Raises:
    MissingOptionalLibraryError: Requires matplotlib.
    ValueError: When 'color' is not a list of len=2.
    VisualizationError: if input is not a valid N-qubit state.

Examples:
    .. plot::
       :alt: Output from the previous code.
       :include-source:

       # You can choose different colors for the real and imaginary parts of the density matrix.

       from qiskit import QuantumCircuit
       from qiskit.quantum_info import DensityMatrix
       from qiskit.visualization import plot_state_city

       qc = QuantumCircuit(2)
       qc.h(0)
       qc.cx(0, 1)

       state = DensityMatrix(qc)
       plot_state_city(state, color=['midnightblue', 'crimson'], title="New State City")

    .. plot::
       :alt: Output from the previous code.
       :include-source:

       # You can make the bars more transparent to better see the ones that are behind
       # if they overlap.

       import numpy as np
       from qiskit.quantum_info import Statevector
       from qiskit.visualization import plot_state_city
       from qiskit import QuantumCircuit

       qc = QuantumCircuit(2)
       qc.h(0)
       qc.cx(0, 1)


       qc = QuantumCircuit(2)
       qc.h([0, 1])
       qc.cz(0,1)
       qc.ry(np.pi/3, 0)
       qc.rx(np.pi/5, 1)

       state = Statevector(qc)
       plot_state_city(state, alpha=0.6)

## `plot_state_paulivec`

```python
def plot_state_paulivec(state, title='', figsize=None, color=None, ax=None, *, filename=None)
```

Plot the Pauli-vector representation of a quantum state as bar graph.

The Pauli-vector of a density matrix :math:`\rho` is defined by the expectation of each
possible tensor product of single-qubit Pauli operators (including the identity), that is

.. math ::

    \rho = \frac{1}{2^n} \sum_{\sigma \in \{I, X, Y, Z\}^{\otimes n}}
           \mathrm{Tr}(\sigma \rho) \sigma.

This function plots the coefficients :math:`\mathrm{Tr}(\sigma\rho)` as bar graph.

Args:
    state (Statevector or DensityMatrix or ndarray): an N-qubit quantum state.
    title (str): a string that represents the plot title
    figsize (tuple): Figure size in inches.
    color (list or str): Color of the coefficient value bars.
    ax (matplotlib.axes.Axes): An optional Axes object to be used for
        the visualization output. If none is specified a new matplotlib
        Figure will be created and used. Additionally, if specified there
        will be no returned Figure since it is redundant.
    filename (str | None): The optional file path to save image to. If not specified
        no file is created for the visualization. If this is set the return
        from this function will be ``None``.

Returns:
     :class:`matplotlib:matplotlib.figure.Figure` :
        The matplotlib.Figure of the visualization if the
        ``ax`` kwarg is not set

Raises:
    MissingOptionalLibraryError: Requires matplotlib.
    VisualizationError: if input is not a valid N-qubit state.

Examples:
    .. plot::
       :alt: Output from the previous code.
       :include-source:

       # You can set a color for all the bars.

       from qiskit import QuantumCircuit
       from qiskit.quantum_info import Statevector
       from qiskit.visualization import plot_state_paulivec

       qc = QuantumCircuit(2)
       qc.h(0)
       qc.cx(0, 1)

       state = Statevector(qc)
       plot_state_paulivec(state, color='midnightblue', title="New PauliVec plot")

    .. plot::
       :alt: Output from the previous code.
       :include-source:

       # If you introduce a list with less colors than bars, the color of the bars will
       # alternate following the sequence from the list.

       import numpy as np
       from qiskit.quantum_info import DensityMatrix
       from qiskit import QuantumCircuit
       from qiskit.visualization import plot_state_paulivec

       qc = QuantumCircuit(2)
       qc.h(0)
       qc.cx(0, 1)

       qc = QuantumCircuit(2)
       qc.h([0, 1])
       qc.cz(0, 1)
       qc.ry(np.pi/3, 0)
       qc.rx(np.pi/5, 1)

       matrix = DensityMatrix(qc)
       plot_state_paulivec(matrix, color=['crimson', 'midnightblue', 'seagreen'])

## `n_choose_k`

```python
def n_choose_k(n, k)
```

Return the number of combinations for n choose k.

Args:
    n (int): the total number of options .
    k (int): The number of elements.

Returns:
    int: returns the binomial coefficient

## `lex_index`

```python
def lex_index(n, k, lst)
```

Return  the lex index of a combination..

Args:
    n (int): the total number of options .
    k (int): The number of elements.
    lst (list): list

Returns:
    int: returns int index for lex order

Raises:
    VisualizationError: if length of list is not equal to k

## `bit_string_index`

```python
def bit_string_index(s)
```

Return the index of a string of 0s and 1s.

## `phase_to_rgb`

```python
def phase_to_rgb(complex_number)
```

Map a phase of a complex number to a color in (r,g,b).

complex_number is phase is first mapped to angle in the range
[0, 2pi] and then to the HSL color wheel

## `plot_state_qsphere`

```python
def plot_state_qsphere(state, figsize=None, ax=None, show_state_labels=True, show_state_phases=False, use_degrees=False, *, filename=None)
```

Plot the qsphere representation of a quantum state.
Here, the size of the points is proportional to the probability
of the corresponding term in the state and the color represents
the phase.

Args:
    state (Statevector or DensityMatrix or ndarray): an N-qubit quantum state.
    figsize (tuple): Figure size in inches.
    ax (matplotlib.axes.Axes): An optional Axes object to be used for
        the visualization output. If none is specified a new matplotlib
        Figure will be created and used. Additionally, if specified there
        will be no returned Figure since it is redundant.
    show_state_labels (bool): An optional boolean indicating whether to
        show labels for each basis state.
    show_state_phases (bool): An optional boolean indicating whether to
        show the phase for each basis state.
    use_degrees (bool): An optional boolean indicating whether to use
        radians or degrees for the phase values in the plot.
    filename (str | None): The optional file path to save image to. If not specified
        no file is created for the visualization. If this is set the return
        from this function will be ``None``.


Returns:
    :class:`matplotlib:matplotlib.figure.Figure` :
        A matplotlib figure instance if the ``ax`` kwarg is not set

Raises:
    MissingOptionalLibraryError: Requires matplotlib.
    VisualizationError: Input is not a valid N-qubit state.

    QiskitError: Input statevector does not have valid dimensions.

Examples:
    .. plot::
       :alt: Output from the previous code.
       :include-source:

       from qiskit import QuantumCircuit
       from qiskit.quantum_info import Statevector
       from qiskit.visualization import plot_state_qsphere

       qc = QuantumCircuit(2)
       qc.h(0)
       qc.cx(0, 1)

       state = Statevector(qc)
       plot_state_qsphere(state)

    .. plot::
       :alt: Output from the previous code.
       :include-source:

       # You can show the phase of each state and use
       # degrees instead of radians

       from qiskit.quantum_info import DensityMatrix
       import numpy as np
       from qiskit import QuantumCircuit
       from qiskit.visualization import plot_state_qsphere

       qc = QuantumCircuit(2)
       qc.h([0, 1])
       qc.cz(0,1)
       qc.ry(np.pi/3, 0)
       qc.rx(np.pi/5, 1)
       qc.z(1)

       matrix = DensityMatrix(qc)
       plot_state_qsphere(matrix,
            show_state_phases = True, use_degrees = True)

## `generate_facecolors`

```python
def generate_facecolors(x, y, z, dx, dy, dz, color)
```

Generates shaded facecolors for shaded bars.

This is here to work around a Matplotlib bug
where alpha does not work in Bar3D.

Args:
    x (array_like): The x- coordinates of the anchor point of the bars.
    y (array_like): The y- coordinates of the anchor point of the bars.
    z (array_like): The z- coordinates of the anchor point of the bars.
    dx (array_like): Width of bars.
    dy (array_like): Depth of bars.
    dz (array_like): Height of bars.
    color (array_like): sequence of valid color specifications, optional
Returns:
    list: Shaded colors for bars.
Raises:
    MissingOptionalLibraryError: If matplotlib is not installed

## `state_to_latex`

```python
def state_to_latex(state: Statevector | DensityMatrix, dims: bool | None=None, convention: str='ket', **args) -> str
```

Return a Latex representation of a state. Wrapper function
for `qiskit.visualization.array_to_latex` for convention 'vector'.
Adds dims if necessary.
Intended for use within `state_drawer`.

Args:
    state: State to be drawn
    dims (bool): Whether to display the state's `dims`
    convention (str): Either 'vector' or 'ket'. For 'ket' plot the state in the ket-notation.
            Otherwise plot as a vector
    **args: Arguments to be passed directly to `array_to_latex` for convention 'ket'

Returns:
    Latex representation of the state
    MissingOptionalLibrary: If SymPy isn't installed and ``'latex'`` or
        ``'latex_source'`` is selected for ``output``.

## `TextMatrix`

```python
class TextMatrix
```

Text representation of an array, with `__str__` method so it
displays nicely in Jupyter notebooks

## `state_drawer`

```python
def state_drawer(state, output=None, **drawer_args)
```

Returns a visualization of the state.

**repr**: ASCII TextMatrix of the state's ``_repr_``.

**text**: ASCII TextMatrix that can be printed in the console.

**latex**: An IPython Latex object for displaying in Jupyter Notebooks.

**latex_source**: Raw, uncompiled ASCII source to generate array using LaTeX.

**qsphere**: Matplotlib figure, rendering of statevector using `plot_state_qsphere()`.

**hinton**: Matplotlib figure, rendering of statevector using `plot_state_hinton()`.

**bloch**: Matplotlib figure, rendering of statevector using `plot_bloch_multivector()`.

**city**: Matplotlib figure, rendering of statevector using `plot_state_city()`.

**paulivec**: Matplotlib figure, rendering of statevector using `plot_state_paulivec()`.

Args:
    state: State to be drawn
    output (str): Select the output method to use for drawing the
        circuit. Valid choices are ``text``, ``latex``, ``latex_source``,
        ``qsphere``, ``hinton``, ``bloch``, ``city`` or ``paulivec``.
        Default is `'text`'.
    drawer_args: Arguments to be passed to the relevant drawer. For
        'latex' and 'latex_source' see ``array_to_latex``

Returns:
    :class:`matplotlib.figure` or :class:`str` or
    :class:`TextMatrix` or :class:`IPython.display.Latex`:
    Drawing of the state.

Raises:
    MissingOptionalLibraryError: when `output` is `latex` and IPython is not installed.
        or if SymPy isn't installed and ``'latex'`` or ``'latex_source'`` is selected for
        ``output``.

    ValueError: when `output` is not a valid selection.
