---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qcut/processing.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qcut/processing.py
license: Apache-2.0
---

## Module `pennylane/qcut/processing.py`

Processing functions for circuit cutting.

## `qcut_processing_fn`

```python
def qcut_processing_fn(results: Sequence[Sequence], communication_graph, prepare_nodes: Sequence[Sequence[PrepareNode]], measure_nodes: Sequence[Sequence[MeasureNode]], use_opt_einsum: bool=False)
```

Processing function for the :func:`cut_circuit() <pennylane.cut_circuit>` transform.

.. note::

    This function is designed for use as part of the circuit cutting workflow.
    Check out the :func:`qp.cut_circuit() <pennylane.cut_circuit>` transform for more details.

Args:
    results (Sequence[Sequence]): A collection of execution results generated from the
        expansion of circuit fragments over measurement and preparation node configurations.
        These results are processed into tensors and then contracted.
    communication_graph (nx.MultiDiGraph): the communication graph determining connectivity
        between circuit fragments
    prepare_nodes (Sequence[Sequence[PrepareNode]]): a sequence of size
        ``len(communication_graph.nodes)`` that determines the order of preparation indices in
        each tensor
    measure_nodes (Sequence[Sequence[MeasureNode]]): a sequence of size
        ``len(communication_graph.nodes)`` that determines the order of measurement indices in
        each tensor
    use_opt_einsum (bool): Determines whether to use the
        `opt_einsum <https://dgasmith.github.io/opt_einsum/>`__ package. This package is useful
        for faster tensor contractions of large networks but must be installed separately using,
        e.g., ``pip install opt_einsum``. Both settings for ``use_opt_einsum`` result in a
        differentiable contraction.

Returns:
    float or tensor_like: the output of the original uncut circuit arising from contracting
    the tensor network of circuit fragments

## `qcut_processing_fn_sample`

```python
def qcut_processing_fn_sample(results: Sequence, communication_graph, shots: int) -> list
```

Function to postprocess samples for the :func:`cut_circuit_mc() <pennylane.cut_circuit_mc>`
transform. This removes superfluous mid-circuit measurement samples from fragment
circuit outputs.

.. note::

    This function is designed for use as part of the sampling-based circuit cutting workflow.
    Check out the :func:`qp.cut_circuit_mc() <pennylane.cut_circuit_mc>` transform for more details.

Args:
    results (Sequence): a collection of sample-based execution results generated from the
        random expansion of circuit fragments over measurement and preparation node configurations
    communication_graph (nx.MultiDiGraph): the communication graph determining connectivity
        between circuit fragments
    shots (int): the number of shots

Returns:
    List[tensor_like]: the sampled output for all terminal measurements over the number of shots given

## `qcut_processing_fn_mc`

```python
def qcut_processing_fn_mc(results: Sequence, communication_graph, settings: pnp.ndarray, shots: int, classical_processing_fn: callable)
```

Function to postprocess samples for the :func:`cut_circuit_mc() <pennylane.cut_circuit_mc>`
transform. This takes a user-specified classical function to act on bitstrings and
generates an expectation value.

.. note::

    This function is designed for use as part of the sampling-based circuit cutting workflow.
    Check out the :func:`qp.cut_circuit_mc() <pennylane.cut_circuit_mc>` transform for more details.

Args:
    results (Sequence): a collection of sample-based execution results generated from the
        random expansion of circuit fragments over measurement and preparation node configurations
    communication_graph (nx.MultiDiGraph): the communication graph determining connectivity
        between circuit fragments
    settings (np.ndarray): Each element is one of 8 unique values that tracks the specific
        measurement and preparation operations over all configurations. The number of rows is determined
        by the number of cuts and the number of columns is determined by the number of shots.
    shots (int): the number of shots
    classical_processing_fn (callable): A classical postprocessing function to be applied to
        the reconstructed bitstrings. The expected input is a bitstring; a flat array of length ``wires``
        and the output should be a single number within the interval :math:`[-1, 1]`.

Returns:
    float or tensor_like: the expectation value calculated in accordance to Eq. (35) of
    `Peng et al. <https://arxiv.org/abs/1904.00102>`__

## `contract_tensors`

```python
def contract_tensors(tensors: Sequence, communication_graph, prepare_nodes: Sequence[Sequence[PrepareNode]], measure_nodes: Sequence[Sequence[MeasureNode]], use_opt_einsum: bool=False)
```

Contract tensors according to the edges specified in the communication graph.

.. note::

    This function is designed for use as part of the circuit cutting workflow.
    Check out the :func:`qp.cut_circuit() <pennylane.cut_circuit>` transform for more details.

Consider the three tensors :math:`T^{(1)}`, :math:`T^{(2)}`, and :math:`T^{(3)}`, along with
their contraction equation

.. math::

    \sum_{ijklmn} T^{(1)}_{ij,km} T^{(2)}_{kl,in} T^{(3)}_{mn,jl}

Each tensor is the result of the tomography of a circuit fragment and has some indices
corresponding to state preparations (marked by the indices before the comma) and some indices
corresponding to measurements (marked by the indices after the comma).

An equivalent representation of the contraction equation is to use a directed multigraph known
as the communication/quotient graph. In the communication graph, each tensor is assigned a node
and edges are added between nodes to mark a contraction along an index. The communication graph
resulting from the above contraction equation is a complete directed graph.

In the communication graph provided by :func:`fragment_graph`, edges are composed of
:class:`PrepareNode` and :class:`MeasureNode` pairs. To correctly map back to the contraction
equation, we must keep track of the order of preparation and measurement indices in each tensor.
This order is specified in the ``prepare_nodes`` and ``measure_nodes`` arguments.

Args:
    tensors (Sequence): the tensors to be contracted
    communication_graph (nx.MultiDiGraph): the communication graph determining connectivity
        between the tensors
    prepare_nodes (Sequence[Sequence[PrepareNode]]): a sequence of size
        ``len(communication_graph.nodes)`` that determines the order of preparation indices in
        each tensor
    measure_nodes (Sequence[Sequence[MeasureNode]]): a sequence of size
        ``len(communication_graph.nodes)`` that determines the order of measurement indices in
        each tensor
    use_opt_einsum (bool): Determines whether to use the
        `opt_einsum <https://dgasmith.github.io/opt_einsum/>`__ package. This package is useful
        for faster tensor contractions of large networks but must be installed separately using,
        e.g., ``pip install opt_einsum``. Both settings for ``use_opt_einsum`` result in a
        differentiable contraction.

Returns:
    float or tensor_like: the result of contracting the tensor network

**Example**

We first set up the tensors and their corresponding :class:`~.PrepareNode` and
:class:`~.MeasureNode` orderings:

.. code-block:: python

    from pennylane.transforms import qcut
    import networkx as nx
    import numpy as np

    tensors = [np.arange(4), np.arange(4, 8)]
    prep = [[], [qcut.PrepareNode(wires=0)]]
    meas = [[qcut.MeasureNode(wires=0)], []]

The communication graph describing edges in the tensor network must also be constructed.
The nodes of the fragment graphs are formatted as ``WrappedObj(op)``, where ``WrappedObj.obj``
is the operator, and the same format should be preserved in the pairs stored
with the edge data of the communication graph:

.. code-block:: python

    graph = nx.MultiDiGraph(
        [(0, 1, {"pair": (WrappedObj(meas[0][0]), WrappedObj(prep[1][0]))})]
    )

The network can then be contracted using:

>>> qp.qcut.contract_tensors(tensors, graph, prep, meas)
38
