---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/work/observable_grouping.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/work/observable_grouping.py
license: Apache-2.0
---

## `group_settings_greedy`

```python
def group_settings_greedy(settings: Iterable[InitObsSetting]) -> dict[InitObsSetting, list[InitObsSetting]]
```

Greedily group settings which can be simultaneously measured.

We construct a dictionary keyed by `max_setting` (see docstrings
for `_max_weight_state` and `_max_weight_observable`) where the value
is a list of settings compatible with `max_setting`. For each new setting,
we try to find an existing group to add it and update `max_setting` for
that group if necessary. Otherwise, we make a new group.

In practice, this greedy algorithm performs comparably to something
more complicated by solving the clique cover problem on a graph
of simultaneously-measurable settings.

Args:
    settings: The settings to group.

Returns:
    A dictionary keyed by `max_setting` which need not exist in the
    input list of settings. Each dictionary value is a list of
    settings compatible with `max_setting`.
