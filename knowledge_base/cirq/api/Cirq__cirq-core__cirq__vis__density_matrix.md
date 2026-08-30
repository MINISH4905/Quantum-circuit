---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/vis/density_matrix.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/vis/density_matrix.py
license: Apache-2.0
---

## Module `cirq-core/cirq/vis/density_matrix.py`

Tool to visualize the magnitudes and phases in the density matrix

## `plot_density_matrix`

```python
def plot_density_matrix(matrix: np.ndarray, ax: plt.Axes | None=None, *, show_text: bool=False, title: str | None=None) -> plt.Axes
```

Generates a plot for a given density matrix.

1. Each entry of the density matrix, a complex number, is plotted as an
Argand Diagram where the partially filled red circle represents the magnitude
and the line represents the phase angle, going anti-clockwise from positive x - axis.
2. The blue rectangles on the diagonal elements represent the probability
of measuring the system in state $|i\rangle$.
Rendering scheme is inspired from https://algassert.com/quirk

Args:
    matrix: The density matrix to visualize
    show_text: If true, the density matrix values are also shown as text labels
    ax: The axes to plot on
    title: Title of the plot
