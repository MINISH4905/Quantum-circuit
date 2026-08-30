---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/qpy/binary_io/value.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/qpy/binary_io/value.py
license: Apache-2.0
---

## Module `qiskit/qpy/binary_io/value.py`

Binary IO for any value objects, such as numbers, string, parameters.

## `read_standalone_vars`

```python
def read_standalone_vars(file_obj, num_vars)
```

Read the ``num_vars`` standalone variable declarations from the file.

Args:
    file_obj (File): a file-like object to read from.
    num_vars (int): the number of variables to read.

Returns:
    tuple[dict, list]: the first item is a mapping of the ``ExprVarDeclaration`` type keys to
    the variables defined by that type key, and the second is the total order of variable
    declarations.

## `write_standalone_vars`

```python
def write_standalone_vars(file_obj, circuit, version)
```

Write the standalone variables out from a circuit.

Args:
    file_obj (File): the file-like object to write to.
    circuit (QuantumCircuit): the circuit to take the variables from.
    version (int): the QPY target version.

Returns:
    dict[expr.Var | expr.Stretch, int]: a mapping of the variables written to the
        index that they were written at.

## `dumps_value`

```python
def dumps_value(obj, *, version, index_map=None, use_symengine=False, standalone_var_indices=None)
```

Serialize input value object.

Args:
    obj (any): Arbitrary value object to serialize.
    version (int): the target QPY version for the dump.
    index_map (dict): Dictionary with two keys, "q" and "c".  Each key has a value that is a
        dictionary mapping :class:`.Qubit` or :class:`.Clbit` instances (respectively) to their
        integer indices.
    use_symengine (bool): If True, symbolic objects will be serialized using symengine's
        native mechanism. This is a faster serialization alternative, but not supported in all
        platforms. Please check that your target platform is supported by the symengine library
        before setting this option, as it will be required by qpy to deserialize the payload.
    standalone_var_indices (dict): Dictionary that maps standalone :class:`.expr.Var` entries to
        the index that should be used to refer to them.

Returns:
    tuple: TypeKey and binary data.

Raises:
    QpyError: Serializer for given format is not ready.

## `write_value`

```python
def write_value(file_obj, obj, *, version, index_map=None, use_symengine=False, standalone_var_indices=None)
```

Write a value to the file like object.

Args:
    file_obj (File): A file like object to write data.
    obj (any): Value to write.
    version (int): the target QPY version for the dump.
    index_map (dict): Dictionary with two keys, "q" and "c".  Each key has a value that is a
        dictionary mapping :class:`.Qubit` or :class:`.Clbit` instances (respectively) to their
        integer indices.
    use_symengine (bool): If True, symbolic objects will be serialized using symengine's
        native mechanism. This is a faster serialization alternative, but not supported in all
        platforms. Please check that your target platform is supported by the symengine library
        before setting this option, as it will be required by qpy to deserialize the payload.
    standalone_var_indices (dict): Dictionary that maps standalone :class:`.expr.Var` entries to
        the index that should be used to refer to them.

## `loads_value`

```python
def loads_value(type_key, binary_data, version, vectors, *, clbits=(), cregs=None, use_symengine=False, standalone_vars=())
```

Deserialize input binary data to value object.

Args:
    type_key (ValueTypeKey): Type enum information.
    binary_data (bytes): Data to deserialize.
    version (int): QPY version.
    vectors (dict): ParameterVector in current scope.
    clbits (Sequence[Clbit]): Clbits in the current scope.
    cregs (Mapping[str, ClassicalRegister]): Classical registers in the current scope.
    use_symengine (bool): If True, symbolic objects will be de-serialized using symengine's
        native mechanism. This is a faster serialization alternative, but not supported in all
        platforms. Please check that your target platform is supported by the symengine library
        before setting this option, as it will be required by qpy to deserialize the payload.
    standalone_vars (Sequence[Var]): standalone :class:`.expr.Var` nodes in the order that they
        were declared by the circuit header.
Returns:
    any: Deserialized value object.

Raises:
    QpyError: Serializer for given format is not ready.

## `read_value`

```python
def read_value(file_obj, version, vectors, *, clbits=(), cregs=None, use_symengine=False, standalone_vars=())
```

Read a value from the file like object.

Args:
    file_obj (File): A file like object to write data.
    version (int): QPY version.
    vectors (dict): ParameterVector in current scope.
    clbits (Sequence[Clbit]): Clbits in the current scope.
    cregs (Mapping[str, ClassicalRegister]): Classical registers in the current scope.
    use_symengine (bool): If True, symbolic objects will be de-serialized using symengine's
        native mechanism. This is a faster serialization alternative, but not supported in all
        platforms. Please check that your target platform is supported by the symengine library
        before setting this option, as it will be required by qpy to deserialize the payload.
    standalone_vars (Sequence[expr.Var]): standalone variables in the order they were defined in
        the QPY payload.

Returns:
    any: Deserialized value object.
