---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/user_config.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/user_config.py
license: Apache-2.0
---

## Module `qiskit/user_config.py`

Utils for reading a user preference config files.

## `UserConfig`

```python
class UserConfig
```

Class representing a user config file

The config file format should look like:

[default]
circuit_drawer = mpl
circuit_mpl_style = default
circuit_mpl_style_path = ~/.qiskit:<default location>
circuit_reverse_bits = True
circuit_idle_wires = False
transpile_optimization_level = 1
transpiler_seed = 42
parallel = False
num_processes = 4
sabre_all_threads = true
min_qpy_version = 13

### `__init__`

```python
def __init__(self, filename=None)
```

Create a UserConfig

Args:
    filename (str): The path to the user config file. If one isn't
        specified, ~/.qiskit/settings.conf is used.

### `read_config_file`

```python
def read_config_file(self)
```

Read config file and parse the contents into the settings attr.

## `set_config`

```python
def set_config(key, value, section=None, file_path=None)
```

Adds or modifies a user configuration

It will add configuration to the currently configured location
or the value of file argument.

Only valid user config can be set in 'default' section. Custom
user config can be added in any other sections.

Changes to the existing config file will not be reflected in
the current session since the config file is parsed at import time.

Args:
    key (str): name of the config
    value (obj): value of the config
    section (str, optional): if not specified, adds it to the
        `default` section of the config file.
    file_path (str, optional): the file to which config is added.
        If not specified, adds it to the default config file or
        if set, the value of `QISKIT_SETTINGS` env variable.

Raises:
    QiskitUserConfigError: if the config is invalid

## `get_config`

```python
def get_config()
```

Read the config file from the default location or env var.

It will read a config file at the location specified by the ``QISKIT_SETTINGS`` environment
variable if set, or ``$HOME/.qiskit/settings.conf`` if not.

If the environment variable ``QISKIT_IGNORE_USER_SETTINGS`` is set to the string ``TRUE``, this
will return an empty configuration, regardless of all other variables.

Returns:
    dict: The settings dict from the parsed config file.
