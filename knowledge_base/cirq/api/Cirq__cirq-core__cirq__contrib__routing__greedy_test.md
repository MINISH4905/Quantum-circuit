---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/routing/greedy_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/routing/greedy_test.py
license: Apache-2.0
---

## `test_bad_args`

```python
def test_bad_args() -> None
```

Test zero valued arguments in greedy router.

## `create_circuit_and_device`

```python
def create_circuit_and_device() -> tuple[cirq.Circuit, nx.Graph]
```

Construct a small circuit and a device with line connectivity
to test the greedy router. This instance hangs router in Cirq 8.2.

## `create_hanging_routing_instance`

```python
def create_hanging_routing_instance(circuit, device_graph) -> None
```

Create a test problem instance.

## `test_router_hanging`

```python
def test_router_hanging() -> None
```

Run a separate process and check if greedy router hits timeout (20s).
