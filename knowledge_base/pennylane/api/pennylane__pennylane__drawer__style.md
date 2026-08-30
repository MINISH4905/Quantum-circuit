---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/drawer/style.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/drawer/style.py
license: Apache-2.0
---

## Module `pennylane/drawer/style.py`

This module contains styles for using matplotlib graphics.

To add a new style:
* create a private function that modifies ``plt.rcParams``.
* add an entry to the private dictionary ``_style_map``.
* update the docstrings for ``use_style`` and ``draw_mpl``.
* Add an entry to ``doc/code/qp_drawer.rst``
* Add a test in ``tests/drawer/test_style.py``

Use the decorator ``_needs_mpl`` on style functions to raise appropriate
errors if ``matplotlib`` is not installed.

## `available_styles`

```python
def available_styles()
```

Get available style specification strings.

Returns:
    tuple(str)

## `use_style`

```python
def use_style(style: str)
```

Set a style setting. Reset to default style using ``use_style('black_white')``

Args:
    style (str): A style specification.

Current styles:

* ``'default'``
* ``'black_white'``
* ``'black_white_dark'``
* ``'sketch'``
* ``'pennylane'``
* ``'pennylane_sketch'``
* ``'sketch_dark'``
* ``'solarized_light'``
* ``'solarized_dark'``

**Example**:

.. code-block:: python

    qp.drawer.use_style('black_white')

    @qp.qnode(qp.device('lightning.qubit', wires=(0,1,2,3)))
    def circuit(x, z):
        qp.QFT(wires=(0,1,2,3))
        qp.Toffoli(wires=(0,1,2))
        qp.CSWAP(wires=(0,2,3))
        qp.RX(x, wires=0)
        qp.CRZ(z, wires=(3,0))
        return qp.expval(qp.Z(0))


    fig, ax = qp.draw_mpl(circuit)(1.2345,1.2345)
    fig.show()

.. figure:: ../../_static/style/black_white_style.png
        :align: center
        :width: 60%
        :target: javascript:void(0);
