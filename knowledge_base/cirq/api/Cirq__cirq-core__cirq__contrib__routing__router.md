---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/routing/router.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/routing/router.py
license: Apache-2.0
---

## `route_circuit`

```python
def route_circuit(circuit: circuits.Circuit, device_graph: nx.Graph, *, algo_name: str | None=None, router: Callable[..., SwapNetwork] | None=None, **kwargs) -> SwapNetwork
```

Routes a circuit on a given device.

Exactly one of algo_name and router must be specified.

Args:
    circuit: The circuit to route.
    device_graph: The device's graph, in which each vertex is a qubit and each edge indicates
        the ability to do an operation on those qubits.
    algo_name: The name of a routing algorithm. Must be in ROUTERS.
    router: The function that actually does the routing.
    **kwargs: Arguments to pass to the routing algorithm.

Raises:
    ValueError: If the circuit contains operations on more than two qubits, the number of
        qubits in the circuit are more than those of the device, both `algo_name` and `router`
        are specified, or no routing algorithm is specified.
