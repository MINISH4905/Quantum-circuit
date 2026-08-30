---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/data_manager/params.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/data_manager/params.py
license: Apache-2.0
---

## Module `pennylane/data/data_manager/params.py`

Contains types and functions for dataset parameters.

## `ParamArg`

```python
class ParamArg(enum.Enum)
```

Enum representing special args to ``load()``.

FULL: used to request all attributes
DEFAULT: used to request the default attribute

### `values`

```python
def values(cls) -> frozenset[str]
```

Returns all values.

### `is_arg`

```python
def is_arg(cls, val: Union['ParamArg', str]) -> bool
```

Returns true if ``val`` is a ``ParamArg``, or one
of its values.

## `Description`

```python
class Description(Mapping[ParamName, ParamVal])
```

An immutable and hashable dictionary that contains all the parameter
values for a dataset.

## `format_param_args`

```python
def format_param_args(param: ParamName, details: Any) -> ParamArg | list[ParamVal]
```

Ensures each user-inputted parameter is a properly typed list.
Also provides custom support for certain parameters.

## `format_params`

```python
def format_params(**params: Any) -> list[dict[str:ParamName, str:ParamArg | ParamVal]]
```

Converts params to a list of dictionaries whose values are parameter names and
single ``ParamaterArg`` objects or lists of parameter values.

## `provide_defaults`

```python
def provide_defaults(data_name: str, params: list[dict[str:ParamName, str:ParamArg | ParamVal]]) -> list[dict[str:ParamName, str:ParamArg | ParamVal]]
```

Provides default parameters to the qchem and qspin query parameters if the parameter
names are missing from the provided ``params``.
