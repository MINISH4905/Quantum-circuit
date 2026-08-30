---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/exceptions.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/exceptions.py
license: Apache-2.0
---

## Module `pennylane/exceptions.py`

This module contains all the custom exceptions and warnings used in PennyLane.

.. warning::

    Unless you are a PennyLane or plugin developer, you will likely not need
    to use these classes directly. They are raised by PennyLane functions
    when errors are encountered.

Contents
--------

The exceptions and warnings are organized by their category of use.

.. currentmodule:: pennylane.exceptions

General Execution Errors
~~~~~~~~~~~~~~~~~~~~~~~~

.. autosummary::
    :toctree: api

    ~AllocationError
    ~CaptureError
    ~DeviceError
    ~QuantumFunctionError
    ~TransformError
    ~ConditionalTransformError
    ~QueuingError
    ~WireError
    ~MeasurementShapeError
    ~AutoGraphError
    ~CompileError
    ~DecompositionError
    ~InvalidCapabilitiesError
    ~NonDifferentiableError

Operator Property Errors
~~~~~~~~~~~~~~~~~~~~~~~~

.. autosummary::
    :toctree: api

    ~OperatorPropertyUndefined
    ~DecompositionUndefinedError
    ~TermsUndefinedError
    ~MatrixUndefinedError
    ~SparseMatrixUndefinedError
    ~EigvalsUndefinedError
    ~DiagGatesUndefinedError
    ~AdjointUndefinedError
    ~PowUndefinedError
    ~GeneratorUndefinedError
    ~ParameterFrequenciesUndefinedError

User Warnings
~~~~~~~~~~~~~

.. autosummary::
    :toctree: api

    ~PennyLaneDeprecationWarning
    ~ExperimentalWarning
    ~AutoGraphWarning
    ~DecompositionWarning

## `AllocationError`

```python
class AllocationError(RuntimeError)
```

An error arising from trying handling a dynamically allocated wire.

## `CaptureError`

```python
class CaptureError(Exception)
```

Errors related to PennyLane's Program Capture execution pipeline.

## `DeviceError`

```python
class DeviceError(Exception)
```

Exception raised when it encounters an illegal operation in the quantum circuit.

## `QuantumFunctionError`

```python
class QuantumFunctionError(Exception)
```

Exception raised when an illegal operation is defined in a quantum function.

## `TransformError`

```python
class TransformError(Exception)
```

Raised when there is an error with the transform logic.

## `ConditionalTransformError`

```python
class ConditionalTransformError(ValueError)
```

Error for using qp.cond incorrectly

## `QueuingError`

```python
class QueuingError(Exception)
```

Exception that is raised when there is a queuing error

## `WireError`

```python
class WireError(Exception)
```

Exception raised by a :class:`~.pennylane.wires.Wire` object when it is unable to process wires.

## `MeasurementShapeError`

```python
class MeasurementShapeError(ValueError)
```

An error raised when an unsupported operation is attempted with a
quantum tape.

## `OperatorPropertyUndefined`

```python
class OperatorPropertyUndefined(Exception)
```

Generic exception to be used for undefined
Operator properties or methods.

## `DecompositionUndefinedError`

```python
class DecompositionUndefinedError(OperatorPropertyUndefined)
```

Raised when an Operator's representation as a decomposition is undefined.

## `TermsUndefinedError`

```python
class TermsUndefinedError(OperatorPropertyUndefined)
```

Raised when an Operator's representation as a linear combination is undefined.

## `MatrixUndefinedError`

```python
class MatrixUndefinedError(OperatorPropertyUndefined)
```

Raised when an Operator's matrix representation is undefined.

## `SparseMatrixUndefinedError`

```python
class SparseMatrixUndefinedError(OperatorPropertyUndefined)
```

Raised when an Operator's sparse matrix representation is undefined.

## `EigvalsUndefinedError`

```python
class EigvalsUndefinedError(OperatorPropertyUndefined)
```

Raised when an Operator's eigenvalues are undefined.

## `DiagGatesUndefinedError`

```python
class DiagGatesUndefinedError(OperatorPropertyUndefined)
```

Raised when an Operator's diagonalizing gates are undefined.

## `AdjointUndefinedError`

```python
class AdjointUndefinedError(OperatorPropertyUndefined)
```

Raised when an Operator's adjoint version is undefined.

## `PowUndefinedError`

```python
class PowUndefinedError(OperatorPropertyUndefined)
```

Raised when an Operator's power is undefined.

## `GeneratorUndefinedError`

```python
class GeneratorUndefinedError(OperatorPropertyUndefined)
```

Exception used to indicate that an operator
does not have a generator

## `ParameterFrequenciesUndefinedError`

```python
class ParameterFrequenciesUndefinedError(OperatorPropertyUndefined)
```

Exception used to indicate that an operator
does not have parameter_frequencies

## `ResourcesUndefinedError`

```python
class ResourcesUndefinedError(Exception)
```

Exception to be raised when a ``ResourceOperator`` does not implement resource_decomp

## `PennyLaneDeprecationWarning`

```python
class PennyLaneDeprecationWarning(UserWarning)
```

Warning raised when a PennyLane feature is being deprecated.

## `ExperimentalWarning`

```python
class ExperimentalWarning(UserWarning)
```

Warning raised to indicate experimental/non-stable feature or support.

## `AutoGraphWarning`

```python
class AutoGraphWarning(Warning)
```

Warnings related to PennyLane's AutoGraph submodule.

## `CaptureWarning`

```python
class CaptureWarning(Warning)
```

Warnings related to the capture of the program into a condensed PLxPR format.

## `DecompositionWarning`

```python
class DecompositionWarning(Warning)
```

Warning when a decomposition rule isn't found by the graph.

## `AutoGraphError`

```python
class AutoGraphError(Exception)
```

Errors related to PennyLane's AutoGraph submodule.

## `CompileError`

```python
class CompileError(Exception)
```

Error encountered in the compilation phase.

## `DecompositionError`

```python
class DecompositionError(Exception)
```

Base class for decomposition errors.

## `InvalidCapabilitiesError`

```python
class InvalidCapabilitiesError(Exception)
```

Exception raised from invalid TOML files.

## `NonDifferentiableError`

```python
class NonDifferentiableError(Exception)
```

Exception raised if attempting to differentiate non-trainable
:class:`~.tensor` using Autograd.
