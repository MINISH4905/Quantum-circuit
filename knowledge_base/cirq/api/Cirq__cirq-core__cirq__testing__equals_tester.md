---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/equals_tester.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/equals_tester.py
license: Apache-2.0
---

## Module `cirq-core/cirq/testing/equals_tester.py`

A utility class for testing equality methods.

To test an equality method, create an EqualityTester and add several groups
of items to it. The equality tester will check that the items within each
group are all equal to each other, but that items between each group are never
equal to each other. It will also check that a==b implies hash(a)==hash(b).

## `EqualsTester`

```python
class EqualsTester
```

Tests equality against user-provided disjoint equivalence groups.

### `add_equality_group`

```python
def add_equality_group(self, *group_items: Any) -> None
```

Tries to add a disjoint equivalence group to the equality tester.

This methods asserts that items within the group must all be equal to
each other, but not equal to any items in other groups that have been
or will be added.

Args:
  *group_items: The items making up the equivalence group.

Raises:
    AssertionError: Items within the group are not equal to each other,
        or items in another group are equal to items within the new
        group, or the items violate the equals-implies-same-hash rule.

### `make_equality_group`

```python
def make_equality_group(self, *factories: Callable[[], Any]) -> None
```

Tries to add a disjoint equivalence group to the equality tester.

Uses the factory methods to produce two different objects with the same
initialization for each factory. Asserts that the objects are equal, but
not equal to any items in other groups that have been or will be added.
Adds the objects as a group.

Args:
    *factories: Methods for producing independent copies of an item.

Raises:
    AssertionError: The factories produce items not equal to the others,
        or items in another group are equal to items from the factory,
        or the items violate the equal-implies-same-hash rule.
