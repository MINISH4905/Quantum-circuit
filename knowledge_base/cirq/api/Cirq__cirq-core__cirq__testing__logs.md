---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/logs.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/logs.py
license: Apache-2.0
---

## Module `cirq-core/cirq/testing/logs.py`

Helper for testing python logging statements.

## `assert_logs`

```python
def assert_logs(*matches: str, count: int | None=1, min_level: int=logging.WARNING, max_level: int=logging.CRITICAL, capture_warnings: bool=True) -> Iterator[list[logging.LogRecord]]
```

A context manager for testing logging and warning events.

To use this one wraps the code that is to be tested for log events within
the context of this method's return value:

    with assert_logs(count=2, 'first_match', 'second_match') as logs:
        <code that produces python logs>

This captures the logging that occurs in the context of the with statement,
asserts that the number of logs is equal to `count`, and then asserts that
all of the strings in `matches` appear in the messages of the logs.
Further, the captured logs are accessible as `logs` and further testing
can be done beyond these simple asserts.

Args:
    *matches: Each of these is checked to see if they match, as a substring,
        any of the captures log messages.
    count: The expected number of messages in logs. Defaults to 1. If None is passed in counts
        are not checked.
    min_level: The minimum level at which to capture the logs. See the python logging
        module for valid levels. By default this captures at the
        `logging.WARNING` level and above, so this does not capture `logging.INFO`
        or `logging.DEBUG` logs by default.
    max_level: The maximum level at which to capture the logs. See the python logging
        module for valid levels. By default this captures to the `logging.CRITICAL` level
        thus, all the errors and critical messages will be captured as well.
    capture_warnings: Whether warnings from the python's `warnings` module
        are redirected to the logging system and captured.

Returns:
    A ContextManager that can be entered into which captures the logs
    for code executed within the entered context. This ContextManager
    checks that the asserts for the logs are true on exit.

Raises:
    ValueError: If `min_level` is greater than `max_level`.
