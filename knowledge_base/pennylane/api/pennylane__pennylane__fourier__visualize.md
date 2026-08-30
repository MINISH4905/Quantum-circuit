---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/fourier/visualize.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/fourier/visualize.py
license: Apache-2.0
---

## Module `pennylane/fourier/visualize.py`

Contains visualization functions for Fourier series and coefficients.

## `violin`

```python
def violin(coeffs, n_inputs, ax, colour_dict=None, show_freqs=True)
```

Plots a list of sets of Fourier coefficients as a violin plot.

Args:
    coeffs (list[array[complex]]): A list of sets of Fourier coefficients. The shape of the
        coefficient arrays should resemble that of the output of NumPy/SciPy's ``fftn`` function, or
        :func:`~.pennylane.fourier.coefficients`.
    n_inputs (int): The number of input variables in the function.
    ax (array[matplotlib.axes.Axes]): Axis on which to plot. Must
        be a pair of axes from a subplot where ``sharex="row"`` and ``sharey="col"``.
    colour_dict (dict[str, str]): A dictionary of the form ``{"real" : colour_string,
        "imag" : other_colour_string}`` indicating which colours should be used in the plot.
    show_freqs (bool): Whether or not to print the frequency labels on the plot axis.

Returns:
    array[matplotlib.axes.Axes]: The axes on which the data is plotted.

**Example**

Suppose we have the following quantum function:

.. code-block:: python

    dev = qp.device('default.qubit', wires=2)

    @qp.qnode(dev)
    def circuit_with_weights(w, x):
        qp.RX(x[0], wires=0)
        qp.RY(x[1], wires=1)
        qp.CNOT(wires=[1, 0])

        qp.Rot(*w[0], wires=0)
        qp.Rot(*w[1], wires=1)
        qp.CNOT(wires=[1, 0])

        qp.RX(x[0], wires=0)
        qp.RY(x[1], wires=1)
        qp.CNOT(wires=[1, 0])

        return qp.expval(qp.Z(0))

We would like to compute and plot the distribution of Fourier coefficients
for many random values of the weights ``w``. First, we generate all the coefficients:

.. code-block:: python

    from functools import partial

    coeffs = []

    n_inputs = 2
    degree = 2

    for _ in range(100):
        weights = np.random.normal(0, 1, size=(2, 3))
        c = qp.fourier.coefficients(partial(circuit_with_weights, weights), n_inputs, degree)
        coeffs.append(c)

We can now plot by setting up a pair of ``matplotlib`` axes and passing them
to the plotting function:

>>> import matplotlib.pyplot as plt
>>> from pennylane.fourier.visualize import violin
>>> fig, ax = plt.subplots(2, 1, sharey=True, figsize=(15, 4))
>>> violin(coeffs, n_inputs, ax, show_freqs=True)
array([<Axes: ylabel='real'>, <Axes: ylabel='imag'>], dtype=object)

.. image:: ../../_static/fourier_vis_violin.png
    :align: center
    :width: 800px
    :target: javascript:void(0);

## `box`

```python
def box(coeffs, n_inputs, ax, colour_dict=None, show_freqs=True, show_fliers=True)
```

Plot a list of sets of Fourier coefficients as a box plot.

Args:
    coeffs (list[array[complex]]): A list of sets of Fourier coefficients. The shape of the
        coefficient arrays should resemble that of the output of numpy/scipy's ``fftn``
        function, or :func:`~.pennylane.fourier.coefficients`.
    n_inputs (int): The number of input variables in the function.
    ax (array[matplotlib.axes.Axes]): Axis on which to plot. Must
        be a pair of axes from a subplot where ``sharex="row"`` and ``sharey="col"``.
    colour_dict (dict[str, str]): A dictionary of the form {"real" : colour_string,
        "imag" : other_colour_string} indicating which colours should be used in the plot.
    show_freqs (bool): Whether or not to print the frequency labels on the plot axis.
    show_fliers (bool): Whether to display the box plot outliers.

Returns:
    array[matplotlib.axes.Axes]: The axes after plotting is complete.

**Example**

Suppose we have the following quantum function:

.. code-block:: python

    dev = qp.device('default.qubit', wires=2)

    @qp.qnode(dev)
    def circuit_with_weights(w, x):
        qp.RX(x[0], wires=0)
        qp.RY(x[1], wires=1)
        qp.CNOT(wires=[1, 0])

        qp.Rot(*w[0], wires=0)
        qp.Rot(*w[1], wires=1)
        qp.CNOT(wires=[1, 0])

        qp.RX(x[0], wires=0)
        qp.RY(x[1], wires=1)
        qp.CNOT(wires=[1, 0])

        return qp.expval(qp.Z(0))

We would like to compute and plot the distribution of Fourier coefficients
for many random values of the weights ``w``. First, we generate all the coefficients:

.. code-block:: python

    from functools import partial

    coeffs = []

    n_inputs = 2
    degree = 2

    for _ in range(100):
        weights = np.random.normal(0, 1, size=(2, 3))
        c = qp.fourier.coefficients(partial(circuit_with_weights, weights), n_inputs, degree)
        coeffs.append(c)

We can now plot by setting up a pair of ``matplotlib`` axes and passing them
to the plotting function:

>>> import matplotlib.pyplot as plt
>>> from pennylane.fourier.visualize import box
>>> fig, ax = plt.subplots(2, 1, sharey=True, figsize=(15, 4))
>>> box(coeffs, n_inputs, ax, show_freqs=True)
array([<Axes: ylabel='real'>, <Axes: ylabel='imag'>], dtype=object)

.. image:: ../../_static/fourier_vis_box.png
    :align: center
    :width: 800px
    :target: javascript:void(0);

## `bar`

```python
def bar(coeffs, n_inputs, ax, colour_dict=None, show_freqs=True)
```

Plot a set of Fourier coefficients as a bar plot.

Args:

    coeffs (array[complex]): A single set of Fourier coefficients. The dimensions of the coefficient
        array should be ``(2d + 1, ) * n_inputs`` where ``d`` is the largest frequency.
    n_inputs (int): The number of input variables in the function.
    ax (list[matplotlib.axes.Axes]): Axis on which to plot. Must
        be a pair of axes from a subplot where ``sharex="row"`` and ``sharey="col"``.
    colour_dict (dict[str, str]): A dictionary of the form ``{"real" : colour_string,
        "imag" : other_colour_string}`` indicating which colours should be used in the plot.
    show_freqs (bool): Whether or not to print the frequency labels on the plot axis.

 Returns:
    array[matplotlib.axes.Axes]: The axes after plotting is complete.

**Example**

Suppose we have the following quantum function:

.. code-block:: python

    dev = qp.device('default.qubit', wires=2)

    @qp.qnode(dev)
    def circuit_with_weights(w, x):
        qp.RX(x[0], wires=0)
        qp.RY(x[1], wires=1)
        qp.CNOT(wires=[1, 0])

        qp.Rot(*w[0], wires=0)
        qp.Rot(*w[1], wires=1)
        qp.CNOT(wires=[1, 0])

        qp.RX(x[0], wires=0)
        qp.RY(x[1], wires=1)
        qp.CNOT(wires=[1, 0])

        return qp.expval(qp.Z(0))

We would like to compute and plot a single set of Fourier coefficients. We will
choose some values for ``w`` at random:

.. code-block:: python

    from functools import partial

    n_inputs = 2
    degree = 2

    weights = np.random.normal(0, 1, size=(2, 3))
    coeffs = qp.fourier.coefficients(partial(circuit_with_weights, weights), n_inputs, degree)

We can now plot by setting up a pair of ``matplotlib`` axes and passing them
to the plotting function:

>>> import matplotlib.pyplot as plt
>>> from pennylane.fourier.visualize import bar
>>> fig, ax = plt.subplots(2, 1, sharey=True, figsize=(15, 4))
>>> bar(coeffs, n_inputs, ax, colour_dict={"real" : "red", "imag" : "blue"})
array([<Axes: ylabel='real'>, <Axes: ylabel='imag'>], dtype=object)

.. image:: ../../_static/fourier_vis_bar_plot_2.png
    :align: center
    :width: 800px
    :target: javascript:void(0);

## `panel`

```python
def panel(coeffs, n_inputs, ax, colour=None)
```

Plot a list of sets of coefficients in the complex plane for a 1- or 2-dimensional function.

Args:
    coeffs (list[array[complex]]): A list of sets of Fourier coefficients. The shape of the
        coefficient arrays must all be either 1- or 2-dimensional, i.e.,
        each array should have shape ``(2d + 1,)``
        for the 1-dimensional case, or ``(2d + 1, 2d + 1)`` where ``d`` is the
        degree, i.e., the maximum frequency of present in the coefficients.
        Such an array may be the output of the numpy/scipy ``fft``/``fft2`` functions,
        or :func:`~.pennylane.fourier.coefficients`.
    n_inputs (int): The number of variables in the function.
    ax (array[matplotlib.axes._subplots.AxesSubplot]): Axis on which to plot. For
        1-dimensional data, length must be the number of frequencies. For 2-dimensional
        data, must be a grid that matches the dimensions of a single set of coefficients.
    colour (str): The outline colour of the points on the plot.

Returns:
    array[matplotlib.axes.Axes]: The axes after plotting is complete.

**Example**

Suppose we have the following quantum function:

.. code-block:: python

    dev = qp.device('default.qubit', wires=2)

    @qp.qnode(dev)
    def circuit_with_weights(w, x):
        qp.RX(x[0], wires=0)
        qp.RY(x[1], wires=1)
        qp.CNOT(wires=[1, 0])

        qp.Rot(*w[0], wires=0)
        qp.Rot(*w[1], wires=1)
        qp.CNOT(wires=[1, 0])

        qp.RX(x[0], wires=0)
        qp.RY(x[1], wires=1)
        qp.CNOT(wires=[1, 0])

        return qp.expval(qp.Z(0))

We would like to compute and plot the distribution of Fourier coefficients
for many random values of the weights ``w``. First, we generate all the coefficients:

.. code-block:: python

    from functools import partial

    coeffs = []

    n_inputs = 2
    degree = 2

    for _ in range(100):
        weights = np.random.normal(0, 1, size=(2, 3))
        c = qp.fourier.coefficients(partial(circuit_with_weights, weights), n_inputs, degree)
        coeffs.append(c)

We can now plot by setting up a pair of ``matplotlib`` axes and passing them
to the plotting function. The of axes must be large enough to represent all
the available coefficients (in this case, since we have 2 variables and use
degree 2, we need a 5x5 grid.

>>> import matplotlib.pyplot as plt
>>> from pennylane.fourier.visualize import panel
>>> fig, ax = plt.subplots(5, 5, figsize=(12, 10), sharex=True, sharey=True)
>>> panel(coeffs, n_inputs, ax)
 array([[<Axes: title={'center': '0, 0'}>,
        ...
        <Axes: title={'center': '-1, -1'}>]], dtype=object)

.. image:: ../../_static/fourier_vis_panel.png
    :align: center
    :width: 800px
    :target: javascript:void(0);

## `radial_box`

```python
def radial_box(coeffs, n_inputs, ax, show_freqs=True, colour_dict=None, show_fliers=True)
```

Plot a list of sets of Fourier coefficients on a radial plot as box plots.

Produces a 2-panel plot in which the left panel represents the real parts of
Fourier coefficients. This method accepts multiple sets of coefficients, and
plots the distribution of each coefficient as a boxplot.

Args:
    coeffs (list[array[complex]]): A list of sets of Fourier coefficients. The shape of the
        coefficient arrays should resemble that of the output of numpy/scipy's ``fftn`` function, or
        :func:`~.pennylane.fourier.coefficients`.
    n_inputs (int): Dimension of the transformed function.
    ax (array[matplotlib.axes.Axes]): Axes to plot on. For this function, subplots
        must specify ``subplot_kw={"polar":True}`` upon construction.
    show_freqs (bool): Whether or not to label the frequencies on
        the radial axis. Turn off for large plots.
    colour_dict (dict[str, str]): Specify a colour mapping for positive and negative
        real/imaginary components. If none specified, will default to:
        ``{"real" : "red", "imag" : "black"}``
    showfliers (bool): Whether or not to plot outlying "fliers" on the boxplots.
    merge_plots (bool): Whether to plot real/complex values on the same panel, or
        on separate panels. Default is to plot real/complex values on separate panels.

Returns:
    array[matplotlib.axes.Axes]: The axes after plotting is complete.

**Example**

Suppose we have the following quantum function:

.. code-block:: python

    dev = qp.device('default.qubit', wires=2)

    @qp.qnode(dev)
    def circuit_with_weights(w, x):
        qp.RX(x[0], wires=0)
        qp.RY(x[1], wires=1)
        qp.CNOT(wires=[1, 0])

        qp.Rot(*w[0], wires=0)
        qp.Rot(*w[1], wires=1)
        qp.CNOT(wires=[1, 0])

        qp.RX(x[0], wires=0)
        qp.RY(x[1], wires=1)
        qp.CNOT(wires=[1, 0])

        return qp.expval(qp.Z(0))

We would like to compute and plot the distribution of Fourier coefficients
for many random values of the weights ``w``. First, we generate all the coefficients:

.. code-block:: python

    from functools import partial

    coeffs = []

    n_inputs = 2
    degree = 2

    for _ in range(100):
        weights = np.random.normal(0, 1, size=(2, 3))
        c = qp.fourier.coefficients(partial(circuit_with_weights, weights), n_inputs, degree)
        coeffs.append(c)

We can now plot by setting up a pair of ``matplotlib`` axes and passing them
to the plotting function. Note that the axes passed must use polar coordinates.

.. code-block:: python

    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(
        1, 2, sharex=True, sharey=True,
        subplot_kw={"polar": True},
        figsize=(15, 8)
    )

    qp.fourier.visualize.radial_box(coeffs, 2, ax, show_freqs=True, show_fliers=False)

.. image:: ../../_static/fourier_vis_radial_box.png
    :align: center
    :width: 800px
    :target: javascript:void(0);
