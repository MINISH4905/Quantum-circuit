---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/vis/heatmap.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/vis/heatmap.py
license: Apache-2.0
---

## `PolygonUnit`

```python
class PolygonUnit
```

Dataclass to store information about a single polygon unit to plot on the heatmap

For single (grid) qubit heatmaps, the polygon is a square.
For two (grid) qubit interaction heatmaps, the polygon is a hexagon.

Args:
    polygon: Vertices of the polygon to plot.
    value: The value for the heatmap coloring.
    center: The center point of the polygon where annotation text should be printed.
    annot: The annotation string to print on the coupler.

## `Heatmap`

```python
class Heatmap
```

Distribution of a value in 2D qubit lattice as a color map.

### `__init__`

```python
def __init__(self, value_map: Mapping[QubitTuple, SupportsFloat] | Mapping[grid_qubit.GridQubit, SupportsFloat], **kwargs)
```

2D qubit grid Heatmaps

Draw 2D qubit grid heatmap with Matplotlib with parameters to configure the properties of
the plot.

Args:
    value_map: A dictionary of qubits or QubitTuples as keys and corresponding magnitude
        as float values. It corresponds to the data which should be plotted as a heatmap.
    **kwargs: Optional kwargs including
        title: str, default = None
        plot_colorbar: bool, default = True

        annotation_map: dictionary,
            A dictionary of QubitTuples as keys and corresponding annotation str as values.
            It corresponds to the text that should be added on top of each heatmap
            polygon unit.
        annotation_format: str, default = '.2g'
            Formatting string using which annotation_map will be implicitly constructed by
            applying format(value, annotation_format) for each key in value_map.
            This is ignored if annotation_map is explicitly specified.
        annotation_text_kwargs: Matplotlib Text **kwargs,
        highlighted_qubits: An iterable of qubits to highlight.

        colorbar_position: {'right', 'left', 'top', 'bottom'}, default = 'right'
        colorbar_size: str, default = '5%'
        colorbar_pad: str, default = '2%'
        colorbar_options: Matplotlib colorbar **kwargs, default = None,


        collection_options: Matplotlib PolyCollection **kwargs, default
                            {"cmap" : "viridis"}
        vmin, vmax: colormap scaling floats, default = None

### `update_config`

```python
def update_config(self, **kwargs) -> Heatmap
```

Add/Modify **kwargs args passed during initialisation.

### `plot`

```python
def plot(self, ax: plt.Axes | None=None, **kwargs: Any) -> tuple[plt.Axes, mpl_collections.Collection]
```

Plots the heatmap on the given Axes.
Args:
    ax: the Axes to plot on. If not given, a new figure is created,
        plotted on, and shown.
    **kwargs: The optional keyword arguments are used to temporarily
        override the values present in the heatmap config. See
        __init__ for more details on the allowed arguments.
Returns:
    A 2-tuple ``(ax, collection)``. ``ax`` is the `plt.Axes` that
    is plotted on. ``collection`` is the collection of paths drawn and filled.

## `TwoQubitInteractionHeatmap`

```python
class TwoQubitInteractionHeatmap(Heatmap)
```

Visualizing interactions between neighboring qubits on a 2D grid.

### `__init__`

```python
def __init__(self, value_map: Mapping[QubitTuple, SupportsFloat], **kwargs)
```

Heatmap to display two-qubit interaction fidelities.

Draw 2D qubit-qubit interaction heatmap with Matplotlib with arguments to configure the
properties of the plot. The valid argument list includes all arguments of cirq.vis.Heatmap()
plus the following.

Args:
    value_map: A map from a qubit tuple location to a value.
    **kwargs: Optional kwargs including
        coupler_margin: float, default = 0.03
        coupler_width: float, default = 0.6

### `plot`

```python
def plot(self, ax: plt.Axes | None=None, **kwargs: Any) -> tuple[plt.Axes, mpl_collections.Collection]
```

Plots the heatmap on the given Axes.
Args:
    ax: the Axes to plot on. If not given, a new figure is created,
        plotted on, and shown.
    **kwargs: The optional keyword arguments are used to temporarily
        override the values present in the heatmap config. See
        __init__ for more details on the allowed arguments.
Returns:
    A 2-tuple ``(ax, collection)``. ``ax`` is the `plt.Axes` that
    is plotted on. ``collection`` is the collection of paths drawn and filled.
