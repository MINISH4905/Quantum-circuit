---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qcut/cutstrategy.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qcut/cutstrategy.py
license: Apache-2.0
---

## Module `pennylane/qcut/cutstrategy.py`

Class CutStrategy, for executing (large) circuits on available (comparably smaller) devices.

## `CutStrategy`

```python
class CutStrategy
```

A circuit-cutting distribution policy for executing (large) circuits on available (comparably
smaller) devices.

.. note::

    This class is part of a work-in-progress feature to support automatic cut placement in the
    circuit cutting workflow. Currently only manual placement of cuts is supported,
    check out the :func:`qp.cut_circuit() <pennylane.cut_circuit>` transform for more details.

Args:
    devices (Union[qp.devices.Device, Sequence[qp.devices.Device]]): Single, or Sequence of, device(s).
        Optional only when ``max_free_wires`` is provided.
    max_free_wires (int): Number of wires for the largest available device. Optional only when
        ``devices`` is provided where it defaults to the maximum number of wires among
        ``devices``.
    min_free_wires (int): Number of wires for the smallest available device, or, equivalently,
        the smallest max fragment-wire-size that the partitioning is allowed to explore.
        When provided, this parameter will be used to derive an upper-bound to the range of
        explored number of fragments.  Optional, defaults to 2 which corresponds to attempting
        the most granular partitioning of max 2-wire fragments.
    num_fragments_probed (Union[int, Sequence[int]]): Single, or 2-Sequence of, number(s)
        specifying the potential (range of) number of fragments for the partitioner to attempt.
        Optional, defaults to probing all valid strategies derivable from the circuit and
        devices. When provided, has precedence over all other arguments affecting partitioning
        exploration, such as ``max_free_wires``, ``min_free_wires``, or ``exhaustive``.
    max_free_gates (int): Maximum allowed circuit depth for the deepest available device.
        Optional, defaults to unlimited depth.
    min_free_gates (int): Maximum allowed circuit depth for the shallowest available device.
        Optional, defaults to ``max_free_gates``.
    imbalance_tolerance (float): The global maximum allowed imbalance for all partition trials.
        Optional, defaults to unlimited imbalance. Used only if there's a known hard balancing
        constraint on the partitioning problem.
    trials_per_probe (int): Number of repeated partitioning trials for a random automatic
        cutting method to attempt per set of partitioning parameters. For a deterministic
        cutting method, this can be set to 1. Defaults to 4.

**Example**

The following cut strategy specifies that a circuit should be cut into between
``2`` to ``5`` fragments, with each fragment having at most ``6`` wires and
at least ``4`` wires:

>>> cut_strategy = qp.qcut.CutStrategy(
...     max_free_wires=6,
...     min_free_wires=4,
...     num_fragments_probed=(2, 5),
... )

### `__post_init__`

```python
def __post_init__(self, devices)
```

Deriving cutting constraints from given devices and parameters.

### `get_cut_kwargs`

```python
def get_cut_kwargs(self, tape_dag, max_wires_by_fragment: Sequence[int]=None, max_gates_by_fragment: Sequence[int]=None, exhaustive: bool=True) -> list[dict[str, Any]]
```

Derive the complete set of arguments, based on a given circuit, for passing to a graph
partitioner.

Args:
    tape_dag (nx.MultiDiGraph): Graph representing a tape, typically the output of
        :func:`tape_to_graph`.
    max_wires_by_fragment (Sequence[int]): User-predetermined list of wire limits by
        fragment. If supplied, the number of fragments will be derived from it and
        exploration of other choices will not be made.
    max_gates_by_fragment (Sequence[int]): User-predetermined list of gate limits by
        fragment. If supplied, the number of fragments will be derived from it and
        exploration of other choices will not be made.
    exhaustive (bool): Toggle for an exhaustive search which will attempt all potentially
        valid numbers of fragments into which the circuit is partitioned. If ``True``,
        for a circuit with N gates, N - 1 attempts will be made with ``num_fragments``
        ranging from [2, N], i.e. from bi-partitioning to complete partitioning where each
        fragment has exactly a single gate. Defaults to ``True``.

Returns:
    List[Dict[str, Any]]: A list of minimal kwargs being passed to a graph
    partitioner method.

**Example**

Deriving kwargs for a given circuit and feeding them to a custom partitioner, along with
extra parameters specified using ``extra_kwargs``:

>>> cut_strategy = qcut.CutStrategy(devices=dev)
>>> cut_kwargs = cut_strategy.get_cut_kwargs(tape_dag)
>>> cut_trials = [
...     my_partition_fn(tape_dag, **kwargs, **extra_kwargs) for kwargs in cut_kwargs
... ]
