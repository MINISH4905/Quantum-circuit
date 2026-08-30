---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/style.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/style.py
license: Apache-2.0
---

## Module `qiskit/visualization/style.py`

Generic style visualization library.

## `StyleDict`

```python
class StyleDict(dict)
```

Attributes:
    VALID_FIELDS (set): Set of valid field inputs to a function that supports a style parameter
    ABBREVIATIONS (dict): Mapping of abbreviation:field for abbreviated inputs to VALID_FIELDS
        (must exist in VALID FIELDS)
    NESTED_ATTRS (set): Set of fields that are dictionaries, and need to be updated with .update

## `DefaultStyle`

```python
class DefaultStyle
```

Attributes:
    DEFAULT_STYLE_NAME (str): style name for the default style
    STYLE_PATH: file path where DEFAULT_STYLE_NAME.json is located

## `load_style`

```python
def load_style(style: dict | str | None, style_dict: type[StyleDict], default_style: DefaultStyle, user_config_opt: str, user_config_path_opt: str, raise_error_if_not_found: bool=False) -> tuple[StyleDict, float]
```

Utility function to load style from json files.

Args:
    style: Depending on the type, this acts differently:

        * If a string, it can specify a supported style name (such
          as "iqp" or "clifford"). It can also specify the name of
          a custom color scheme stored as JSON file. This JSON file
          _must_ specify a complete set of colors.
        * If a dictionary, it may specify the style name via a
          ``{"name": "<desired style>"}`` entry. If this is not given,
          the default style will be used. The remaining entries in the
          dictionary can be used to override certain specs.
          E.g. ``{"name": "iqp", "ec": "#FF0000"}`` will use the ``"iqp"``
          color scheme but set the edgecolor to red.
    style_dict: The class used to define the options for loading styles
    default_style: DefaultStyle dictionary definition and documentation
    user_config_opt: User config field in the Qiskit User Configuration File
        used to define the style loaded
    user_config_path_opt: User config field in the Qiskit User Configuration File
        used to define the path to the style loaded
    raise_error_if_not_found: When True, load_style will throw a VisualizationError
        if the style parameter file is not found. When False, load_style will load
        the style passed in by the default_style parameter.


Returns:
    A tuple containing the style as dictionary and the default font ratio.
