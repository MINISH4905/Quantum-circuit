---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/order_tester.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/order_tester.py
license: Apache-2.0
---

## Module `cirq-core/cirq/testing/order_tester.py`

A utility class for testing ordering methods.

To test an ordering method, create an OrderTester and add several
equivalence groups or items to it. The order tester will check that
the items within each group are all equal to each other, and every new
added item or group is strictly ascending with regard to the previously
added items or groups.

It will also check that a==b implies hash(a)==hash(b).

## `OrderTester`

```python
class OrderTester
```

Tests ordering against user-provided disjoint ordered groups or items.

### `add_ascending`

```python
def add_ascending(self, *items: Any) -> None
```

Tries to add a sequence of ascending items to the order tester.

This methods asserts that items must all be ascending
with regard to both each other and the elements which have been already
added during previous calls.
Some of the previously added elements might be equivalence groups,
which are supposed to be equal to each other within that group.

Args:
  *items: The sequence of strictly ascending items.

Raises:
    AssertionError: Items are not ascending either
        with regard to each other, or with regard to the elements
        which have been added before.

### `add_ascending_equivalence_group`

```python
def add_ascending_equivalence_group(self, *group_items: Any) -> None
```

Tries to add an ascending equivalence group to the order tester.

Asserts that the group items are equal to each other, but strictly
ascending with regard to the already added groups.

Adds the objects as a group.

Args:
    *group_items: items making the equivalence group

Raises:
    AssertionError: The group elements aren't equal to each other,
        or items in another group overlap with the new group.
