---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/core/compile_pipeline.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/core/compile_pipeline.py
license: Apache-2.0
---

## Module `pennylane/transforms/core/compile_pipeline.py`

This module contains the ``CompilePipeline`` class.

## `ProtectedLevel`

```python
class ProtectedLevel(StrEnum)
```

Enum for the protected levels of inspection.

## `null_postprocessing`

```python
def null_postprocessing(results: ResultBatch) -> ResultBatch
```

An empty postprocessing function that simply returns its input.

Args:
    results (ResultBatch): Results from executing a batch of :class:`~.QuantumTape`.

Returns:
    ResultBatch: the input to the function.

## `CompilePipeline`

```python
class CompilePipeline
```

A sequence of transforms to be applied to a quantum function or a :class:`~pennylane.QNode`.

Args:
    *transforms (Optional[Sequence[Transform | BoundTransform]]): A sequence of
        transforms with which to initialize the program.
    cotransform_cache (Optional[CotransformCache]): A named tuple containing the ``qnode``,
        ``args``, and ``kwargs`` required to compute classical cotransforms. This argument is
        for use when applying gradient transforms internally before execution, and is not needed
        when defining compilation pipelines to decorate a QNode.

**Example:**

The ``CompilePipeline`` class allows you to chain together multiple quantum function transforms
to create custom circuit optimization pipelines.

For example, consider if you wanted to apply the following optimizations to a quantum circuit:

- pushing all commuting single-qubit gates as far right as possible
  (:func:`~pennylane.transforms.commute_controlled`)
- cancellation of adjacent inverse gates
  (:func:`~pennylane.transforms.cancel_inverses`)
- merging adjacent rotations of the same type
  (:func:`~pennylane.transforms.merge_rotations`)

You can specify a transform program (``pipeline``) by passing these transforms to the ``CompilePipeline``
class. By applying the created ``pipeline`` directly on a quantum function as a decorator, the circuit will
be transformed with each pass within the pipeline sequentially:

.. code-block:: python

    pipeline = qp.CompilePipeline(
        qp.transforms.commute_controlled,
        qp.transforms.cancel_inverses(recursive=True),
        qp.transforms.merge_rotations,
    )
    # Add a marker for inspectability
    pipeline.add_marker("no-transforms", 0)

    @pipeline
    @qp.qnode(qp.device("default.qubit"))
    def circuit(x, y):
        qp.CNOT([1, 0])
        qp.X(0)
        qp.CNOT([1, 0])
        qp.H(0)
        qp.H(0)
        qp.X(0)
        qp.RX(x, wires=0)
        qp.RX(y, wires=0)
        return qp.expval(qp.Z(1))

>>> from pennylane.workflow import get_compile_pipeline
>>> print(get_compile_pipeline(circuit)(0.1, 0.2))
CompilePipeline(
   ├─▶ no-transforms
  [1] commute_controlled(),
  [2] cancel_inverses(recursive=True),
  [3] merge_rotations()
)

>>> print(qp.draw(circuit, level="no-transforms")(0.1, 0.2)) # or level=0
0: ─╭X──X─╭X──H──H──X──RX(0.10)──RX(0.20)─┤
1: ─╰●────╰●──────────────────────────────┤  <Z>

>>> print(qp.draw(circuit)(0.1, 0.2))
0: ──RX(0.30)─┤
1: ───────────┤  <Z>

.. details::
    :title: Manipulating Compilation Pipelines

    Alternatively, the compilation pipeline can be constructed intuitively by combining multiple transforms. For
    example, the transforms can be added together with ``+``:

    >>> pipeline = qp.transforms.merge_rotations + qp.transforms.cancel_inverses(recursive=True)
    >>> print(pipeline)
    CompilePipeline(
      [1] merge_rotations(),
      [2] cancel_inverses(recursive=True)
    )

    Or multiplied by a scalar via ``*``:

    >>> pipeline += 2 * qp.transforms.commute_controlled
    >>> print(pipeline)
    CompilePipeline(
      [1] merge_rotations(),
      [2] cancel_inverses(recursive=True),
      [3] commute_controlled(),
      [4] commute_controlled()
    )

    A compilation pipeline can also be easily modified using operations similar to Python lists, including
    ``insert``, ``append``, ``extend`` and ``pop``:

    >>> pipeline.insert(0, qp.transforms.remove_barrier)
    >>> print(pipeline)
    CompilePipeline(
      [1] remove_barrier(),
      [2] merge_rotations(),
      [3] cancel_inverses(recursive=True),
      [4] commute_controlled(),
      [5] commute_controlled()
    )

    Additionally, multiple compilation pipelines can be concatenated:

    >>> another_pipeline = qp.decompose(gate_set={qp.RX, qp.RZ, qp.CNOT}) + qp.transforms.combine_global_phases
    >>> print(another_pipeline + pipeline)
    CompilePipeline(
      [1] decompose(gate_set=...),
      [2] combine_global_phases(),
      [3] remove_barrier(),
      [4] merge_rotations(),
      [5] cancel_inverses(recursive=True),
      [6] commute_controlled(),
      [7] commute_controlled()
    )

    We can create a new pipeline that will do multiple passes of the original with multiplication:

    >>> original = qp.transforms.merge_rotations + qp.transforms.cancel_inverses
    >>> print(2 * original)
    CompilePipeline(
      [1] merge_rotations(),
      [2] cancel_inverses(),
      [3] merge_rotations(),
      [4] cancel_inverses()
    )

.. details::
    :title: Inspecting and Marking

    Let's create a simple pipeline to inspect,

    >>> pipeline = qp.transforms.commute_controlled + qp.transforms.cancel_inverses + qp.transforms.merge_rotations

    We can inspect the original pipeline by simply printing it,

    >>> print(pipeline)
    CompilePipeline(
      [1] commute_controlled(),
      [2] cancel_inverses(),
      [3] merge_rotations()
    )

    We can add markers (that act as checkpoints) in the pipeline to mark important positions,

    >>> pipeline.add_marker("final-transform")
    >>> print(pipeline)
    CompilePipeline(
      [1] commute_controlled(),
      [2] cancel_inverses(),
      [3] merge_rotations()
       └─▶ final-transform
    )

    >>> pipeline.add_marker("after-commute-controlled", 1)
    >>> print(pipeline)
    CompilePipeline(
      [1] commute_controlled(),
       ├─▶ after-commute-controlled
      [2] cancel_inverses(),
      [3] merge_rotations()
       └─▶ final-transform
    )

    Two different markers can be used to mark the same level, causing them to stack,

    >>> pipeline.add_marker("after-merge-rotations")
    >>> print(pipeline)
    CompilePipeline(
      [1] commute_controlled(),
       ├─▶ after-commute-controlled
      [2] cancel_inverses(),
      [3] merge_rotations()
       └─▶ final-transform, after-merge-rotations
    )

    A marker's level (the index of the transform it follows) can be retrieved with,

    >>> print(pipeline.get_marker_level("final-transform"))
    3

    >>> print(pipeline.get_marker_level("after-merge-rotations"))
    3

    We can remove a ``marker`` using the ``remove_marker`` method,

    >>> pipeline.remove_marker("final-transform")
    >>> pipeline.markers
    ['after-commute-controlled', 'after-merge-rotations']

    The pipeline structure and marker placement are represented as follows,

    .. code-block::

        CompilePipeline(
            ├─▶ markers for level 0 (no transforms)
           [1] transform_1(),
            ├─▶ markers for level 1 (after 1st transform)
           [2] transform_2(),
           ...
           [n] transform_n()
            └─▶ markers for level n (after nth transform)
        )

    Importantly, markers are correctly maintained after pipeline manipulations,

    >>> pipeline * 2 # Markers are not duplicated
    CompilePipeline(
      [1] <commute_controlled()>,
       ├─▶ after-commute-controlled
      [2] <cancel_inverses()>,
      [3] <merge_rotations()>,
       ├─▶ after-merge-rotations
      [4] <commute_controlled()>,
      [5] <cancel_inverses()>,
      [6] <merge_rotations()>
    )

    >>> pipeline + qp.transforms.undo_swaps
    CompilePipeline(
      [1] <commute_controlled()>,
       ├─▶ after-commute-controlled
      [2] <cancel_inverses()>,
      [3] <merge_rotations()>,
       ├─▶ after-merge-rotations
      [4] <undo_swaps()>
    )

    >>> pipeline.pop()
    <merge_rotations()>

    >>> print(pipeline)
    CompilePipeline(
      [1] commute_controlled(),
       ├─▶ after-commute-controlled
      [2] cancel_inverses()
       └─▶ after-merge-rotations
    )

    >>> pipeline[1:] # Get everything after the second transform
    CompilePipeline(
       ├─▶ after-commute-controlled
      [1] <cancel_inverses()>
       └─▶ after-merge-rotations
    )

### `__iter__`

```python
def __iter__(self)
```

list[BoundTransform]: Return an iterator to the underlying compile pipeline.

### `__len__`

```python
def __len__(self) -> int
```

int: Return the number transforms in the program.

### `__getitem__`

```python
def __getitem__(self, idx)
```

(BoundTransform, List[BoundTransform]): Return the indexed transform container from underlying
compile pipeline

### `__radd__`

```python
def __radd__(self, other: BoundTransform | Transform) -> CompilePipeline
```

Right addition to prepend a transform to the program.

Args:
    other: A BoundTransform or Transform to prepend.

Returns:
    CompilePipeline: A new program with the transform prepended.

### `__iadd__`

```python
def __iadd__(self, other: CompilePipeline | BoundTransform | Transform) -> CompilePipeline
```

In-place addition to append a transform to the program.

Args:
    other: A BoundTransform, Transform, or CompilePipeline to append.

Returns:
    CompilePipeline: This program with the transform(s) appended.

### `__mul__`

```python
def __mul__(self, n: int) -> CompilePipeline
```

Right multiplication to repeat a program n times.

Args:
    n (int): Number of times to repeat this program.

Returns:
    CompilePipeline: A new program with this program repeated n times.

### `__str__`

```python
def __str__(self) -> str
```

Returns a user friendly representation of the compile pipeline.

### `__repr__`

```python
def __repr__(self) -> str
```

The detailed string representation of the compile pipeline.

### `remove`

```python
def remove(self, obj: BoundTransform | Transform)
```

In place remove the input containers, specifically,
1. if the input is a Transform, remove all containers matching the transform;
2. if the input is a BoundTransform, remove all containers exactly matching the input.

Args:
    obj (BoundTransform or Transform): The object to remove from the program.

### `append`

```python
def append(self, transform: BoundTransform | Transform)
```

Add a transform to the end of the program.

Args:
    transform (Transform or BoundTransform): A transform represented by its container.

### `extend`

```python
def extend(self, transforms: CompilePipeline | Sequence[BoundTransform | Transform])
```

Extend the pipeline by appending transforms from an iterable.

Args:
    transforms (CompilePipeline, or Sequence[BoundTransform | Transform]): A
        CompilePipeline or an iterable of transforms to append.

### `remove_marker`

```python
def remove_marker(self, label: str) -> None
```

Remove the marker corresponding to the label.

### `add_marker`

```python
def add_marker(self, label: str, level: int | None=None) -> None
```

Add a marker to the compilation pipeline at a given level.

Args:
    label (str): The label for the marker.
    level (int | None): The level position for the marker. If ``None``, the marker
        will be append to the end of the compilation pipeline.

Raises:
    ValueError: If the label corresponds to a protected level, if the label is not unique, or if the level is out of bounds.

**Example:**

>>> pipeline = CompilePipeline()
>>> pipeline += qp.transforms.merge_rotations
>>> pipeline.add_marker("after-merge-rotations")
>>> print(pipeline)
CompilePipeline(
  [1] merge_rotations()
   └─▶ after-merge-rotations
)
>>> pipeline.add_marker("no-transforms", 0)
>>> print(pipeline)
CompilePipeline(
   ├─▶ no-transforms
  [1] merge_rotations()
   └─▶ after-merge-rotations
)

### `markers`

```python
def markers(self) -> list[str]
```

Retrieve list of markers present in the compiliation pipeline.

### `get_marker_level`

```python
def get_marker_level(self, label: str) -> int | None
```

Retrieve the level corresponding to a marker label.

### `add_transform`

```python
def add_transform(self, transform: Transform, *targs, **tkwargs)
```

Add a transform to the end of the program.

Note that this should be a function decorated with/called by
``qp.transform``, and not a ``BoundTransform``.

Args:
    transform (Transform): The transform to add to the compile pipeline.
    *targs: Any additional arguments that are passed to the transform.

Keyword Args:
    **tkwargs: Any additional keyword arguments that are passed to the transform.

### `insert`

```python
def insert(self, index: int, transform: Transform | BoundTransform)
```

Insert a transform at a given index.

Args:
    index (int): The index to insert the transform.
    transform (transform or BoundTransform): the transform to insert

### `pop`

```python
def pop(self, index: int=-1) -> BoundTransform
```

Pop the transform container at a given index of the program.

Args:
    index (int): the index of the transform to remove.

Returns:
    BoundTransform: The removed transform.

### `is_informative`

```python
def is_informative(self) -> bool
```

``True`` if the compile pipeline is informative.

Returns:
    bool: Boolean

### `has_final_transform`

```python
def has_final_transform(self) -> bool
```

``True`` if the compile pipeline has a terminal transform.

### `has_classical_cotransform`

```python
def has_classical_cotransform(self) -> bool
```

Check if the compile pipeline has some classical cotransforms.

Returns:
    bool: Boolean

### `set_classical_component`

```python
def set_classical_component(self, qnode, args, kwargs)
```

Set the classical jacobians and argnums if the transform is hybrid with a classical cotransform.

### `__call_generic`

```python
def __call_generic(self, obj)
```

Apply the transform program to a generic object (QNode, device, callable, etc.).

This method chain-applies each transform using the generic dispatch system.

Args:
    obj: The object to transform (QNode, device, callable, etc.).

Returns:
    The transformed object.
