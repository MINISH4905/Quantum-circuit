---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passmanager.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passmanager.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passmanager.py`

Manager for a set of Passes and their scheduling during transpilation.

## `PassManager`

```python
class PassManager(BasePassManager)
```

Manager for a set of Passes and their scheduling during transpilation.

### `__init__`

```python
def __init__(self, passes: Task | list[Task]=(), max_iteration: int=1000)
```

Initialize an empty pass manager object.

Args:
    passes: A pass set to be added to the pass manager schedule.
    max_iteration: The maximum number of iterations the schedule will be looped if the
        condition is not met.

### `append`

```python
def append(self, passes: Task | list[Task]) -> None
```

Append a Pass Set to the schedule of passes.

Args:
    passes: A set of transpiler passes to be added to schedule.

Raises:
    TranspilerError: if a pass in passes is not a proper pass.

### `replace`

```python
def replace(self, index: int, passes: Task | list[Task]) -> None
```

Replace a particular pass in the scheduler.

Args:
    index: Pass index to replace, based on the position in passes().
    passes: A pass set to be added to the pass manager schedule.

### `run`

```python
def run(self, circuits: _CircuitsT, output_name: str | None=None, callback: Callable | None=None, num_processes: int | None=None, *, property_set: dict[str, object] | None=None) -> _CircuitsT
```

Run all the passes on the specified ``circuits``.

Args:
    circuits: Circuit(s) to transform via all the registered passes.
    output_name: The output circuit name. If ``None``, it will be set to the same as the
        input circuit name.
    callback: A callback function that will be called after each pass execution. The
        function will be called with 5 keyword arguments::

            pass_ (Pass): the pass being run
            dag (DAGCircuit): the dag output of the pass
            time (float): the time to execute the pass
            property_set (PropertySet): the property set
            count (int): the index for the pass execution

        .. note::

            Beware that the keyword arguments here are different to those used by the
            generic :class:`.BasePassManager`.  This pass manager will translate those
            arguments into the form described above.

        The exact arguments pass expose the internals of the pass
        manager and are subject to change as the pass manager internals
        change. If you intend to reuse a callback function over
        multiple releases be sure to check that the arguments being
        passed are the same.

        To use the callback feature you define a function that will
        take in kwargs dict and access the variables. For example::

            def callback_func(**kwargs):
                pass_ = kwargs['pass_']
                dag = kwargs['dag']
                time = kwargs['time']
                property_set = kwargs['property_set']
                count = kwargs['count']
                ...

        .. note::

            When running transpilation with multi-processing,
            the callback function is invoked within the context
            of each sub-process, independently of the
            parent process.

    num_processes: The maximum number of parallel processes to launch if parallel
        execution is enabled. This argument overrides ``num_processes`` in the user
        configuration file, and the ``QISKIT_NUM_PROCS`` environment variable. If set
        to ``None`` the system default or local user configuration will be used.
    property_set: If given, the initial value to use as the :class:`.PropertySet` for the
        pass manager pipeline.  This can be used to persist analysis from one run to
        another, in cases where you know the analysis is safe to share.  Beware that some
        analysis will be specific to the input circuit and the particular :class:`.Target`,
        so you should take a lot of care when using this argument.

Returns:
    The transformed circuit(s).

### `draw`

```python
def draw(self, filename=None, style=None, raw=False)
```

Draw the pass manager.

This function needs `pydot <https://github.com/erocarrera/pydot>`__, which in turn needs
`Graphviz <https://www.graphviz.org/>`__ to be installed.

.. warning::
    This function will call the system Graphviz tool on a file involving user-controllable
    strings (such as pass names).  It is recommended to only call this function on trusted
    input.

Args:
    filename (str): file path to save image to.
    style (dict): keys are the pass classes and the values are the colors to make them. An
        example can be seen in the DEFAULT_STYLE. An ordered dict can be used to ensure
        a priority coloring when pass falls into multiple categories. Any values not
        included in the provided dict will be filled in from the default dict.
    raw (bool): If ``True``, save the raw Dot output instead of the image.

Returns:
    Optional[PassManager]: an in-memory representation of the pass manager, or ``None``
    if no image was generated or `Pillow <https://pypi.org/project/Pillow/>`__
    is not installed.

Raises:
    ImportError: when nxpd or pydot not installed.

## `StagedPassManager`

```python
class StagedPassManager(PassManager)
```

A pass manager pipeline built from individual stages.

This class enables building a compilation pipeline out of fixed stages.
Each ``StagedPassManager`` defines a list of stages which are executed in
a fixed order, and each stage is defined as a standalone :class:`~.PassManager`
instance. There are also ``pre_`` and ``post_`` stages for each defined stage.
This enables easily composing and replacing different stages and also adding
hook points to enable programmatic modifications to a pipeline. When using a staged
pass manager you are not able to modify the individual passes and are only able
to modify stages.

By default, instances of ``StagedPassManager`` define a typical full compilation
pipeline from an abstract virtual circuit to one that is optimized and
capable of running on the specified backend. The default pre-defined stages are:

#. ``init`` - Initial passes to run before embedding the circuit to the backend.
#. ``layout`` - Maps the virtual qubits in the circuit to the physical qubits on
   the backend.
#. ``routing`` - Inserts gates as needed to move the qubit states around until
   the circuit can be run with the chosen layout on the backend's coupling map.
#. ``translation`` - Translates the gates in the circuit to the target backend's
   basis gate set.
#. ``optimization`` - Optimizes the circuit to reduce the cost of executing it.
   These passes will typically run in a loop until a convergence criteria is met.
   For example, the convergence criteria might be that the circuit depth does not
   decrease in successive iterations.
#. ``scheduling`` - Hardware-aware passes that schedule the operations in the
   circuit.

.. note::

    For backwards compatibility the relative positioning of these default
    stages will remain stable moving forward. However, new stages may be
    added to the default stage list in between current stages. For example,
    in a future release a new phase, something like ``logical_optimization``, could be added
    immediately after the existing ``init`` stage in the default stage list.
    This would preserve compatibility for pre-existing ``StagedPassManager``
    users as the relative positions of the stage are preserved so the behavior
    will not change between releases.

These stages will be executed in order and any stage set to ``None`` will be skipped.
If a stage is provided multiple times (i.e. at different relative positions), the
associated passes, including pre and post, will run once per declaration.
If a :class:`~qiskit.transpiler.PassManager` input is being used for more than 1 stage here
(for example in the case of a :class:`~.Pass` that covers both Layout and Routing) you will
want to set that to the earliest stage in sequence that it covers.

### `__init__`

```python
def __init__(self, stages: Iterable[str] | None=None, **kwargs) -> None
```

Initialize a new StagedPassManager object

Args:
    stages (Iterable[str]): An optional list of stages to use for this
        instance. If this is not specified the default stages list
        ``['init', 'layout', 'routing', 'translation', 'optimization', 'scheduling']`` is
        used. After instantiation, the final list will be immutable and stored as tuple.
        If a stage is provided multiple times (i.e. at different relative positions), the
        associated passes, including pre and post, will run once per declaration.
    kwargs: The initial :class:`~.PassManager` values for any stages
        defined in ``stages``. If a argument is not defined the
        stages will default to ``None`` indicating an empty/undefined
        stage.

Raises:
    AttributeError: If a stage in the input keyword arguments is not defined.
    ValueError: If an invalid stage name is specified.

### `stages`

```python
def stages(self) -> tuple[str, ...]
```

Pass manager stages

### `expanded_stages`

```python
def expanded_stages(self) -> tuple[str, ...]
```

Expanded Pass manager stages including ``pre_`` and ``post_`` phases.

### `draw`

```python
def draw(self, filename=None, style=None, raw=False)
```

Draw the staged pass manager.

.. warning::
    This function will call the system Graphviz tool on a file involving user-controllable
    strings (such as pass names).  It is recommended to only call this function on trusted
    input.

Args:
    filename (str): file path to save image to.
    style (dict): keys are the pass classes and the values are the colors to make them. An
        example can be seen in the DEFAULT_STYLE. An ordered dict can be used to ensure
        a priority coloring when pass falls into multiple categories. Any values not
        included in the provided dict will be filled in from the default dict.
    raw (bool): If ``True``, save the raw Dot output instead of the image.
