---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/vis/histogram.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/vis/histogram.py
license: Apache-2.0
---

## `integrated_histogram`

```python
def integrated_histogram(data: Sequence[SupportsFloat] | Mapping[Any, SupportsFloat], ax: plt.Axes | None=None, *, cdf_on_x: bool=False, axis_label: str='', semilog: bool=True, median_line: bool=True, median_label: str | None='median', mean_line: bool=False, mean_label: str | None='mean', show_zero: bool=False, title: str | None=None, **kwargs) -> plt.Axes
```

Plot the integrated histogram for an array of data.

Suppose the input is a list of gate fidelities. The x-axis of the plot will
be gate fidelity, and the y-axis will be the probability that a random gate
fidelity from the list is less than the x-value. It will look something like
this

1.0
|              |
|           ___|
|           |
|       ____|
|      |
|      |
|_____|_______________
0.0

Another way of saying this is that we assume the probability distribution
function (pdf) of gate fidelities is a set of equally weighted delta
functions at each value in the list. Then, the "integrated histogram"
is the cumulative distribution function (cdf) for this pdf.

Args:
    data: Data to histogram. If the data is a `Mapping`, we histogram the
        values. All nans will be removed.
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
