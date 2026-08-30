---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/configuration.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/configuration.py
license: Apache-2.0
---

## Module `pennylane/configuration.py`

This module contains the :class:`Configuration` class, which is used to
load, store, save, and modify configuration options for PennyLane and all
supported plugins and devices.

## `Configuration`

```python
class Configuration
```

Configuration class.

This class is responsible for loading, saving, and storing PennyLane
and plugin/device configurations.

Args:
    name (str): filename of the configuration file.
        This should be a valid TOML file. You may also pass an absolute
        or a relative file path to the configuration file.

### `path`

```python
def path(self)
```

Return the path of the loaded configuration file.

Returns:
    str: If no configuration is loaded, this returns ``None``.

### `load`

```python
def load(self, filepath)
```

Load a configuration file.

Args:
    filepath (str): path to the configuration file.

### `save`

```python
def save(self, filepath)
```

Save a configuration file.

Args:
    filepath (str): path to the configuration file.

### `safe_set`

```python
def safe_set(dct, value, *keys)
```

Safely set the value of a key from a nested dictionary.

If any key provided does not exist, a dictionary containing the
remaining keys is dynamically created and set to the required value.

Args:
    dct (dict): the dictionary to set the value of.
    value: the value to set. Can be any valid type.
    *keys: each additional argument corresponds to a nested key.

### `safe_get`

```python
def safe_get(dct, *keys)
```

Safely return value from a nested dictionary.

If any key provided does not exist, an empty dictionary is returned.

Args:
    dct (dict): the dictionary to set the value of.
    *keys: each additional argument corresponds to a nested key.

Returns:
    value corresponding to ``dct[keys[0]][keys[1]]`` etc.
