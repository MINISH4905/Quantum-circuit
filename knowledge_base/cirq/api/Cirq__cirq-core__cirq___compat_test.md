---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/_compat_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/_compat_test.py
license: Apache-2.0
---

## `run_in_subprocess`

```python
def run_in_subprocess(test_func, *args)
```

Run a function in a subprocess.

This ensures that sys.modules changes in subprocesses won't impact the parent process.

Args:
    test_func: The function to be run in a subprocess.
    *args: Positional args to pass to the function.

## `test_same_name_submodule_earlier_in_subtree`

```python
def test_same_name_submodule_earlier_in_subtree()
```

Tests whether module resolution works in the right order.

We have two packages with a bool `DUPE_CONSTANT` attribute each:
   1. cirq.testing._compat_test_data.module_a.sub.dupe.DUPE_CONSTANT=True # the right one
   2. cirq.testing._compat_test_data.module_a.dupe.DUPE_CONSTANT=False # the wrong one

If the new module's (in this case cirq.testing._compat_test_data.module_a) path has precedence
during module spec resolution, dupe number 2 is going to get resolved.

You might wonder where this comes up in cirq. There was a bug where the lookup path was not in
the right order. The motivating example is cirq.ops.calibration vs the
cirq.ops.engine.calibration packages. The wrong resolution resulted in false circular
imports!
