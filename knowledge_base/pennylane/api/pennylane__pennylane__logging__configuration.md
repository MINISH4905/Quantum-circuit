---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/logging/configuration.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/logging/configuration.py
license: Apache-2.0
---

## Module `pennylane/logging/configuration.py`

This module contains support methods for configuring the logging functionality.

## `enable_logging`

```python
def enable_logging(config_file: str='log_config.toml')
```

This method allows to selectively enable logging throughout PennyLane, following the configuration options defined in the ``log_config.toml`` file.

Enabling logging through this method will override any externally defined logging configurations.

Args:
    config_file (str): The path to a given log configuration file, parsed as TOML and adhering to the ``logging.config.dictConfig`` end-point. The default argument uses the PennyLane ecosystem log-file configuration, located at the directory returned from :func:`pennylane.logging.config_path`.

**Example**

>>> qp.logging.enable_logging()

## `config_path`

```python
def config_path()
```

This method returns the full absolute path to the the ``log_config.toml`` configuration file.

Returns:
    str: System path to the ``log_config.toml`` file.

**Example**

>>> config_path() # doctest: +SKIP
/home/user/pyenv/lib/python3.10/site-packages/pennylane/logging/log_config.toml

## `show_system_config`

```python
def show_system_config()
```

This function opens the logging configuration file in the system-default browser.

## `edit_system_config`

```python
def edit_system_config(wait_on_close=False)
```

This function opens the log configuration file using OS-specific editors.

Setting the ``EDITOR`` environment variable will override ``xdg-open/open`` on
Linux and MacOS, and allows use of ``wait_on_close`` for editor close before
continuing execution.

.. warning::

    As each OS configuration differs user-to-user, you may wish to
    instead open this file manually with the ``config_path()`` provided path.
