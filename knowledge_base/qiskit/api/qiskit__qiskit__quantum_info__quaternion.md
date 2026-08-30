---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/quaternion.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/quaternion.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/quaternion.py`

A module for using quaternions.

## `Quaternion`

```python
class Quaternion
```

A class representing a Quaternion.

### `norm`

```python
def norm(self)
```

Norm of quaternion.

### `normalize`

```python
def normalize(self, inplace: bool=False) -> Quaternion
```

Normalizes a Quaternion to unit length
so that it represents a valid rotation.

Args:
    inplace (bool): Do an inplace normalization.

Returns:
    Quaternion: Normalized quaternion.

### `to_matrix`

```python
def to_matrix(self) -> np.ndarray
```

Converts a unit-length quaternion to a rotation matrix.

Returns:
    ndarray: Rotation matrix.

### `to_zyz`

```python
def to_zyz(self) -> np.ndarray
```

Converts a unit-length quaternion to a sequence
of ZYZ Euler angles.

Returns:
    ndarray: Array of Euler angles.

### `from_axis_rotation`

```python
def from_axis_rotation(cls, angle: float, axis: str) -> Quaternion
```

Return quaternion for rotation about given axis.

Args:
    angle (float): Angle in radians.
    axis (str): Axis for rotation

Returns:
    Quaternion: Quaternion for axis rotation.

Raises:
    ValueError: Invalid input axis.

### `from_euler`

```python
def from_euler(cls, angles: list | np.ndarray, order: str='yzy') -> Quaternion
```

Generate a quaternion from a set of Euler angles.

Args:
    angles (array_like): Array of Euler angles.
    order (str): Order of Euler rotations.  'yzy' is default.

Returns:
    Quaternion: Quaternion representation of Euler rotation.
