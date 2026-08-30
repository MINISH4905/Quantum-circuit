---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/transform/routing_transformer.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/transform/routing_transformer.ipynb
license: Apache-2.0
---

```python
# @title Copyright 2022 The Cirq Developers
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
```

# Qubit Routing

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/transform/routing_transformer"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/transform/routing_transformer.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/transform/routing_transformer.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/transform/routing_transformer.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

In order to execute a circuit on quantum hardware, the logical qubits of a quantum circuit must be placed onto the physical qubits of the hardware device. Moreover, this placement is often not enough to guarantee that all 2-qubit operations between logical qubits in the ciruit correpond to 2-qubit operations between physical qubits on the device that are adjacent. So in addition to mapping logical qubits to physical qubits, it is often required to insert additional SWAP gates in the circuit to ensure that all 2-qubit operations are executed between physically adjacent qubits.

## Setup

```python
try:
    import cirq
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq
    import cirq

    print("installed cirq.")
```

## Routing as a `@cirq.transformer`

Routing in Cirq is implemented as a transformer class `RouteCQC`. An instance of `RouteCQC` is instantiated with a `nx.Graph` device graph. We will refer to this as the *router*. Calling this router on a `cirq.AbstractCircuit` circuit returns a *routed* `cirq.AbstractCircuit` circuit that is made of the device's physical qubits and contains only 2-qubit operations that are between physically adjacent qubits.

Before proceeding any further, we give a high-level overview of the algorithm implemented in `RouteCQC`. It is a heuristic that proceeds as follows:

* Compute the **timesteps** of the circuit: considering operations in the given circuit from beginning to end, the next timestep is a maximal set of 2-qubit operations that act on disjoint qubits. It is 'maximal' because any 2-qubit gate's qubits in the next timestep must intersect with the qubits that are acted on in the current timestep.
* Place the logical qubits in the input circuit onto some input device graph by using an initial mapping strategy.
* Insert necessary swaps to ensure all 2-qubit gates are between adjacent qubits on the device graph by traversing the timesteps from left to right and for each timestep:
  1. Remove any single qubit gate and executable 2-qubit gate in the current timestep and add it to the output routed circuit.
  2. If there aren't any gates left in the current timestep, move on to the next.
  3. If there are gates remaining in the current timestep, consider a set of candidate swaps on them and rank them based on a **heuristic cost function**. Pick the swap that minimises the cost and use it to update our logical to physical mapping. Repeat from 1.

**Note**: All n-qubit operations in the given circuit are assumed to be decomposed into 1/2-qubit operations (our transformer raises an error otherwise).

### A Simple Example

```python
# The circuit to be routed
q = cirq.LineQubit.range(4)
circuit = cirq.Circuit(
    [
        cirq.Moment(cirq.CNOT(q[2], q[0]), cirq.CNOT(q[1], q[3])),
        cirq.Moment(cirq.X(q[0]), cirq.CNOT(q[1], q[2])),
        cirq.Moment(cirq.CNOT(q[0], q[1])),
        cirq.Moment(cirq.H.on_each(q[1], q[2])),
        cirq.Moment(cirq.CNOT(q[1], q[0]), cirq.CNOT(q[3], q[2])),
    ]
)
print(circuit)
```

```python
# Initialize the router with Sycamore device hardware
import cirq_google as cg

device = cg.Sycamore
device_graph = device.metadata.nx_graph
router = cirq.RouteCQC(device_graph)

# Let's look at what the device architecture looks like
print(device)
```

```python
routed_circuit = router(circuit)
print(routed_circuit)
```

```python
# Compile the gates in routed_circuit to Sycamore gates (this is done because `validate_circuit` checks
# that all 2-qubit operations are physically adjacent AND that all gates are part of the device's gateset).
routed_circuit = cirq.optimize_for_target_gateset(
    routed_circuit, gateset=cg.SycamoreTargetGateset()
)
# Validate our circuit
device.validate_circuit(routed_circuit)
```

### Optional Arguments

The `__call__` method of a router takes several optional arguments:
1. `lookahead_radius: int`: a tunable argument that controls a convergence parameter for the heuristic cost function. It corresponds to the maximum number of succeeding timesteps the algorithm will consider for ranking candidate swaps with the cost cost function.
2. `tag_inserted_swaps: bool`: whether or not a `cirq.RoutingSwapTag` should be attached to inserted swap operations in order to distinguish inserted SWAP gates by the routing procedure from SWAP gates part of the input circuit.
3. `initial_mapper: Optional['cirq.AbstractInitialMapper']`: an initial mapping strategy (placement) of logical qubits in the circuit onto physical qubits on the device. If not provided, defaults to an instance of `cirq.LineInitialMapper`.

Here is an example of routing the same circuit on the same device with non-default optional arguments.

```python
# Use a hard-coded initial mapping strategy of logical to physical that places q0, q1, q2, q3 onto
# Grid(3, 5), Grid(3, 4), Grid(2, 5), Grid(2, 4), respectively
gq = cirq.GridQubit(3, 5)
hc_initial_mapper = cirq.HardCodedInitialMapper(
    {q[0]: gq, q[1]: gq + (0, -1), q[2]: gq + (-1, 0), q[3]: gq + (-1, -1)}
)
print(hc_initial_mapper)
```

```python
routed_circuit = router(
    circuit, lookahead_radius=5, tag_inserted_swaps=True, initial_mapper=hc_initial_mapper
)
print(routed_circuit)
```

### Unitary Equivalence

It is often the case that the routing process will return a routed circuit that is unitarily equivalent to the input circuit but with the order of the qubits permuted. This is handled by calling the method of the router `route_circuit` with the input ciruit as an argument instead of calling the router. 

In addition to returning the routed circuit, `route_circuit` also returns the initial mapping of logical to physical qubits and the permutation of qubits caused by insertion of SWAP gates. For example, one way to recover the input circuit's unitary is to permute the routed circuit's qubits as in the example below:

```python
# Example with appending a QubitPermutationGate to `routed_circuit` and permuting initial order of qubits.
routed_circuit, initial_mapping, swap_mapping = router.route_circuit(
    circuit, initial_mapper=hc_initial_mapper
)
print(circuit)
print(routed_circuit)

# The following line that asserts `circuit` and `routed_circuit` have the same unitary will raise an error if uncommented.
# cirq.testing.assert_allclose_up_to_global_phase(circuit.unitary(), routed_circuit.unitary(), atol=1e-8)
```

Below we show one way of reordering the qubits in `routed_circuit` using `initial_mapping` and `swap_map` to yield the same unitary as the original input circuit.

```python
# Add a permutation gate that undoes the action of inserted SWAP gates
initial_qubits, sorted_qubits = zip(*sorted(swap_mapping.items(), key=lambda x: x[1]))
inverse_swap_permutation = [sorted_qubits.index(q) for q in initial_qubits]
routed_circuit.append(cirq.QubitPermutationGate(list(inverse_swap_permutation)).on(*sorted_qubits))
```

```python
# Reorder to initial physical qubits in `routed_circuit` based on their ordering in `circuit`
_, order = zip(*sorted(list(initial_mapping.items()), key=lambda x: x[0]))
```

```python
print(circuit)
print(routed_circuit)

# This will not raise an errors now
cirq.testing.assert_allclose_up_to_global_phase(
    circuit.unitary(), routed_circuit.unitary(qubit_order=order), atol=1e-8
)
```

**Note**: the decomposition of the `QubitPermutationGate` is a series of SWAP gates that may be applied on qubits that are not physically adjacent. 

In practice, the user would seldom need to undo the permutation due to inserted SWAP gates as they are often just doing some measurement at the end. Instead, this can be done correctly by just keeping track of the qubit with terminal measurement gate using *measurement keys* (which are unaffected by routing) or by looking at `initial_mapping` and `swap_mapping` to manually trace the permutation of the qubit in question.

## Extending the Routing API

### By Overriding the Heuristic Cost Function

A user may decide that the existing cost function in `RouteCQC` can be improved or they may have a cost function that performs better in particular cases (injecting noise awareness, working devices with fixed topologies, etc.) We provide an easy to override the existing cost function by means of class extension. For example,

```python
from typing import Sequence, Any

QidIntPair = tuple[int, int]


class RouteCQCSimpleCostFunction(cirq.RouteCQC):
    @classmethod
    def _cost(
        cls,
        mm: cirq.MappingManager,
        swaps: tuple[QidIntPair, ...],
        two_qubit_ops: Sequence[QidIntPair],
    ) -> Any:
        """Computes the # of 2-qubit gates executable after applying SWAPs."""
        for swap in swaps:
            mm.apply_swap(*swap)
        ret = sum(1 for op_ints in two_qubit_ops if mm.is_adjacent(*op_ints))
        for swap in swaps:
            mm.apply_swap(*swap)
        return ret
```

```python
new_router = RouteCQCSimpleCostFunction(device_graph)
routed_circuit = new_router(circuit)
print(circuit)
print(routed_circuit)
```

### By Defining a new Initial Mapping Strategy

Similarly, any concrete class that implements the interface `cirq.AbstractInitialMapper` can be used as an optional argument to the `__call__` or `route_circuit` method in `RouteCQC`. 

The use cases for this are also similar to overriding the cost function. For example, placing logical qubits on a subset of the physical qubits that are well calibrated or taking advantage of certain device topologies to come up with a initial mapping strategy that yields a more highly connected image under the initial mapping.
