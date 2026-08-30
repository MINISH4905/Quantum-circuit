---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/drawer/_add_obj.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/drawer/_add_obj.py
license: Apache-2.0
---

## Module `pennylane/drawer/_add_obj.py`

This module contains the `_add_obj` function and its related utilities for adding objects to the text drawer.

The `_add_obj` function is a generic function that dispatches to specific implementations based on the type of the object being added. These implementations handle various types of quantum operations, measurements, and other constructs, ensuring they are properly represented in the text-based quantum circuit visualization.

Key Features:
- Handles conditional operators, controlled operations, and mid-measurement processes.
- Supports grouping symbols to visually indicate the extent of multi-wire operations.
- Provides specialized handling for mid-circuit measurement statistics.

Usage:
The `_add_obj` function is automatically invoked by the text drawer when rendering a quantum circuit. Users typically do not need to call it directly.
