---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/swapnetworks/ccl2.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/swapnetworks/ccl2.py
license: Apache-2.0
---

## Module `pennylane/templates/swapnetworks/ccl2.py`

Contains the TwoLocalSwapNetwork template.

## `TwoLocalSwapNetwork`

```python
class TwoLocalSwapNetwork(Operation)
```

Apply two-local gate operations using a canonical 2-complete linear (2-CCL) swap network.

Args:
    wires (Iterable or Wires): ordered sequence of wires on which the swap network acts
    acquaintances (Callable): callable `func(index, wires, param=None, **kwargs)` that returns
        a two-local operation applied on a pair of logical wires specified by `index` currently
        stored in physical wires provided by `wires` before they are swapped apart.
        Parameters for the operation are specified using `param`, and any additional
        keyword arguments for the callable should be provided using the ``kwargs`` separately
    weights (tensor): weight tensor for the parametrized acquaintances of length
        :math:`N \times (N - 1) / 2`, where `N` is the length of `wires`
    fermionic (bool): If ``True``, qubits are realized as fermionic modes and :class:`~.pennylane.FermionicSWAP` with :math:`\phi=\pi` is used instead of :class:`~.pennylane.SWAP`
    shift (bool): If ``True``, odd-numbered layers begins from the second qubit instead of first one
    **kwargs: additional keyword arguments for `acquaintances`

Raises:
    ValueError: if inputs do not have the correct format

**Example**

>>> import pennylane as qp
>>> dev = qp.device('default.qubit', wires=5)
>>> acquaintances = lambda index, wires, param=None: qp.CNOT(index)
>>> @qp.qnode(dev)
... def swap_network_circuit():
...    qp.templates.TwoLocalSwapNetwork(dev.wires, acquaintances, fermionic=True, shift=False)
...    return qp.state()
>>> print(qp.draw(swap_network_circuit, level='device')())
0: ─╭●─╭fSWAP(3.14)─────────────────╭●─╭fSWAP(3.14)─────────────────╭●─╭fSWAP(3.14)─┤ ╭State
1: ─╰X─╰fSWAP(3.14)─╭●─╭fSWAP(3.14)─╰X─╰fSWAP(3.14)─╭●─╭fSWAP(3.14)─╰X─╰fSWAP(3.14)─┤ ├State
2: ─╭●─╭fSWAP(3.14)─╰X─╰fSWAP(3.14)─╭●─╭fSWAP(3.14)─╰X─╰fSWAP(3.14)─╭●─╭fSWAP(3.14)─┤ ├State
3: ─╰X─╰fSWAP(3.14)─╭●─╭fSWAP(3.14)─╰X─╰fSWAP(3.14)─╭●─╭fSWAP(3.14)─╰X─╰fSWAP(3.14)─┤ ├State
4: ─────────────────╰X─╰fSWAP(3.14)─────────────────╰X─╰fSWAP(3.14)─────────────────┤ ╰State

.. details::
    :title: Usage Details

    More complex acquaintances can be utilized with the template. For example:

    >>> dev = qp.device('default.qubit', wires=5)
    >>> rng = np.random.default_rng(12345)
    >>> weights = rng.random(size=qp.TwoLocalSwapNetwork.shape(len(dev.wires)))
    >>> print(weights) # doctest: +SKIP
    [0.2273 0.3168 0.7974 0.6763 0.3911 0.3328 0.5983 0.1867 0.6728 0.9418]
    >>> acquaintances = lambda index, wires, param: (qp.CRY(param, wires=index)
    ...                                  if np.abs(wires[0]-wires[1]) else qp.CRZ(param, wires=index))
    >>> @qp.qnode(dev)
    ... def swap_network_circuit():
    ...    qp.templates.TwoLocalSwapNetwork(dev.wires, acquaintances, weights, fermionic=False)
    ...    return qp.state()
    >>> print(qp.draw(swap_network_circuit, level='device')())
    0: ─╭●────────╭SWAP─────────────────╭●────────╭SWAP─────────────────╭●────────╭SWAP─┤ ╭State
    1: ─╰RY(0.23)─╰SWAP─╭●────────╭SWAP─╰RY(0.39)─╰SWAP─╭●────────╭SWAP─╰RY(0.67)─╰SWAP─┤ ├State
    2: ─╭●────────╭SWAP─╰RY(0.80)─╰SWAP─╭●────────╭SWAP─╰RY(0.60)─╰SWAP─╭●────────╭SWAP─┤ ├State
    3: ─╰RY(0.32)─╰SWAP─╭●────────╭SWAP─╰RY(0.33)─╰SWAP─╭●────────╭SWAP─╰RY(0.94)─╰SWAP─┤ ├State
    4: ─────────────────╰RY(0.68)─╰SWAP─────────────────╰RY(0.19)─╰SWAP─────────────────┤ ╰State

### `compute_decomposition`

```python
def compute_decomposition(weights=None, wires=None, acquaintances=None, fermionic=True, shift=False, **kwargs)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.TwoLocalSwapNetwork.decomposition`.

Args:
    weights (tensor): weight tensor for the parametrized acquaintances of length :math:`N \times (N - 1) / 2`, where `N` is the length of `wires`
    wires (Iterable or Wires): ordered sequence of wires on which the swap network acts
    acquaintances (Callable): callable `func(index, wires, param=None, **kwargs)` that returns a two-local operation, which is applied on a pair of logical wires specified by `index`. This corresponds to applying the operation on physical wires provided by `wires` before any SWAP gates occurred. Parameters for the operation are specified using `param`, and any additional keyword arguments for the callable should be provided using the ``kwargs`` separately
    fermionic (bool): If ``True``, qubits are realized as fermionic modes and :class:`~.pennylane.FermionicSWAP` with :math:`\phi=\pi` is used instead of :class:`~.pennylane.SWAP`
    shift (bool): If ``True``, odd-numbered layers begins from the second qubit instead of first one
    **kwargs: additional keyword arguments for `acquaintances`

Returns:
    list[.Operator]: decomposition of the operator

**Example**

>>> import pennylane as qp
>>> dev = qp.device('default.qubit', wires=5)
>>> acquaintances = lambda index, wires, param=None: qp.CNOT(index)
>>> qp.TwoLocalSwapNetwork.compute_decomposition(wires=dev.wires,
...        acquaintances=acquaintances, fermionic=True, shift=False)
[CNOT(wires=[0, 1]), FermionicSWAP(3.141592653589793, wires=[0, 1]),
CNOT(wires=[2, 3]), FermionicSWAP(3.141592653589793, wires=[2, 3]),
CNOT(wires=[1, 2]), FermionicSWAP(3.141592653589793, wires=[1, 2]),
CNOT(wires=[3, 4]), FermionicSWAP(3.141592653589793, wires=[3, 4]),
CNOT(wires=[0, 1]), FermionicSWAP(3.141592653589793, wires=[0, 1]),
CNOT(wires=[2, 3]), FermionicSWAP(3.141592653589793, wires=[2, 3]),
CNOT(wires=[1, 2]), FermionicSWAP(3.141592653589793, wires=[1, 2]),
CNOT(wires=[3, 4]), FermionicSWAP(3.141592653589793, wires=[3, 4]),
CNOT(wires=[0, 1]), FermionicSWAP(3.141592653589793, wires=[0, 1]),
CNOT(wires=[2, 3]), FermionicSWAP(3.141592653589793, wires=[2, 3])]

### `shape`

```python
def shape(n_wires)
```

Returns the shape of the weight tensor required for using parametrized acquaintances in the template.
Args:
    n_wires (int): Number of qubits
Returns:
    tuple[int]: shape
