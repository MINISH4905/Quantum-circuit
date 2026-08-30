---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/circuits/_bucket_priority_queue.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/circuits/_bucket_priority_queue.py
license: Apache-2.0
---

## `BucketPriorityQueue`

```python
class BucketPriorityQueue(Generic[TItem])
```

A priority queue for when priorities are integers over a small range.

Items are dequeued in ascending priority order. Items with the same priority
are dequeued in FIFO order.

Works by having an explicit list for each priority (from the current min
priority to the current max priority). Enqueued items are placed into the
list corresponding to their bucket (after adding more buckets if necessary).
Dequeued items come from the lowest list containing items, and result in
empty buckets at the bottom end of the range being removed.

Let P be the length of the priority range, and N be the number of items that
are enqueued and dequeued. If the priority of items being enqueued is never
smaller than the priority of previously dequeued items (the "monotonic use
case"), then the worst case runtime complexity is O(N+P). In more general
use the worst case runtime complexity is O(N*P).

### `__init__`

```python
def __init__(self, entries: Iterable[tuple[int, TItem]]=(), *, drop_duplicate_entries: bool=False)
```

Initializes a new priority queue.

Args:
    entries: Initial contents of the priority queue.
    drop_duplicate_entries: If set, the priority queue will ignore
        operations that enqueue a (priority, item) pair that is already
        in the priority queue. Note that duplicates of an item may still
        be enqueued, as long as they have different priorities.

### `__bool__`

```python
def __bool__(self) -> bool
```

Returns whether or not the priority queue contains any items.

### `__len__`

```python
def __len__(self) -> int
```

Returns how many items are in the priority queue.

### `__iter__`

```python
def __iter__(self) -> Iterator[tuple[int, TItem]]
```

Iterates the (priority, item) entries in the queue.

### `enqueue`

```python
def enqueue(self, priority: int, item: TItem) -> bool
```

Adds an entry to the priority queue.

If drop_duplicate_entries is set and there is already a (priority, item)
entry in the queue, then the enqueue is ignored. Check the return value
to determine if an enqueue was kept or dropped.

Args:
    priority: The priority of the item. Lower priorities dequeue before
        higher priorities.
    item: The item associated with the given priority.

Returns:
    True if the item was enqueued. False if drop_duplicate_entries is
    set and the item is already in the queue.

### `dequeue`

```python
def dequeue(self) -> tuple[int, TItem]
```

Removes and returns an item from the priority queue.

Returns:
    A tuple whose first element is the priority of the dequeued item
    and whose second element is the dequeued item.

Raises:
    ValueError:
        The queue is empty.
