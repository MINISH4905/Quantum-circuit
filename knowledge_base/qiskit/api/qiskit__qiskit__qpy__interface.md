---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/qpy/interface.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/qpy/interface.py
license: Apache-2.0
---

## Module `qiskit/qpy/interface.py`

User interface of qpy serializer.

## `dump`

```python
def dump(programs: list[QPY_SUPPORTED_TYPES] | QPY_SUPPORTED_TYPES, file_obj: BinaryIO, metadata_serializer: type[JSONEncoder] | None=None, use_symengine: bool=False, version: int=common.QPY_VERSION, annotation_factories: Mapping[str, Callable[[], annotation.QPYSerializer]] | None=None)
```

Write QPY binary data to a file

This function is used to save a circuit to a file for later use or transfer
between machines. The QPY format is backwards compatible and can be
loaded with future versions of Qiskit.

For example:

.. plot::
   :include-source:
   :nofigs:
   :context: reset

    from qiskit.circuit import QuantumCircuit
    from qiskit import qpy

    qc = QuantumCircuit(2, name='Bell', metadata={'test': True})
    qc.h(0)
    qc.cx(0, 1)
    qc.measure_all()

from this you can write the qpy data to a file:

.. code-block:: python

    with open('bell.qpy', 'wb') as fd:
        qpy.dump(qc, fd)

or a gzip compressed file:

.. code-block:: python

    import gzip

    with gzip.open('bell.qpy.gz', 'wb') as fd:
        qpy.dump(qc, fd)

Which will save the qpy serialized circuit to the provided file.

Args:
    programs: QPY supported object(s) to store in the specified file like object.
        QPY supports :class:`.QuantumCircuit`.
    file_obj: The file like object to write the QPY data too
    metadata_serializer: An optional JSONEncoder class that
        will be passed the ``.metadata`` attribute for each program in ``programs`` and will be
        used as the ``cls`` kwarg on the `json.dump()`` call to JSON serialize that dictionary.
    use_symengine: This flag is no longer used by QPY versions supported by this function and
        will have no impact on the generated QPY payload except to set a field in a QPY v13 file
        header which is unused.
    version: The QPY format version to emit. By default this defaults to
        the latest supported format of :attr:`~.qpy.QPY_VERSION`, however for
        compatibility reasons if you need to load the generated QPY payload with an older
        version of Qiskit you can also select an older QPY format version down to the minimum
        supported export version, which only can change during a Qiskit major version release,
        to generate an older QPY format version.  You can access the current QPY version and
        minimum compatible version with :attr:`.qpy.QPY_VERSION` and
        :attr:`.qpy.QPY_COMPATIBILITY_VERSION` respectively.

        .. note::

            If specified with an older version of QPY the limitations and potential bugs stemming
            from the QPY format at that version will persist. This should only be used if
            compatibility with loading the payload with an older version of Qiskit is necessary.

    annotation_factories: Mapping of namespaces to functions that create new instances of
        :class:`.annotation.QPUSerializer`, for handling the dumping of custom
        :class:`.Annotation` objects.  The subsequent call to :func:`load` will need to use
        similar serializer objects, that understand the custom output format of those
        serializers.

Raises:
    TypeError: When invalid data type is input.
    ValueError: When an unsupported version number is passed in for the ``version`` argument.

## `load`

```python
def load(file_obj: BinaryIO, metadata_deserializer: type[JSONDecoder] | None=None, annotation_factories: Mapping[str, Callable[[], annotation.QPYSerializer]] | None=None) -> list[QPY_SUPPORTED_TYPES]
```

Load a QPY binary file

This function is used to load a serialized QPY Qiskit program file and create
:class:`~qiskit.circuit.QuantumCircuit` objects from its contents.
For example:

.. code-block:: python

    from qiskit import qpy

    with open('bell.qpy', 'rb') as fd:
        circuits = qpy.load(fd)

or with a gzip compressed file:

.. code-block:: python

    import gzip
    from qiskit import qpy

    with gzip.open('bell.qpy.gz', 'rb') as fd:
        circuits = qpy.load(fd)

which will read the contents of the qpy and return a list of
:class:`~qiskit.circuit.QuantumCircuit` objects from the file.

Args:
    file_obj: A file like object that contains the QPY binary
        data for a circuit.
    metadata_deserializer: An optional JSONDecoder class
        that will be used for the ``cls`` kwarg on the internal
        ``json.load`` call used to deserialize the JSON payload used for
        the ``.metadata`` attribute for any programs in the QPY file.
        If this is not specified the circuit metadata will
        be parsed as JSON with the stdlib ``json.load()`` function using
        the default ``JSONDecoder`` class.
    annotation_factories: Mapping of namespaces to functions that create new instances of
        :class:`.annotation.QPUSerializer`, for handling the loading of custom
        :class:`.Annotation` objects.

Returns:
    The list of Qiskit programs contained in the QPY data.
    A list is always returned, even if there is only 1 program in the QPY data.

Raises:
    QiskitError: if ``file_obj`` is not a valid QPY file
    TypeError: When invalid data type is loaded.
    MissingOptionalLibraryError: If the ``symengine`` engine library is
        not installed when loading a QPY version 10, 11, or 12 payload
        that is using symengine symbolic encoding and contains
        :class:`.ParameterExpression` instances.
    QpyError: if known but unsupported data type is loaded.

## `get_qpy_version`

```python
def get_qpy_version(file_obj: BinaryIO) -> int
```

This function identifies the QPY version of the file.

This function will read the header of ``file_obj`` and will
return the QPY format version. It will **not** advance the
cursor of ``file_obj``. If you are using this for a subsequent
read, such as to call :func:`.load`, you can pass ``file_obj``
directly. For example::

    from qiskit import qpy

    qpy_version = qpy.get_qpy_version(qpy_file)
    if qpy_version > 12:
        qpy.load(qpy_file)

Args:
    file_obj: A file like object that contains the QPY binary
        data for a circuit.

Returns:
    The QPY version of the specified file.
