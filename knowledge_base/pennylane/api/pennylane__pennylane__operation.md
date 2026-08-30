---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/operation.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/operation.py
license: Apache-2.0
---

## Module `pennylane/operation.py`

This module contains the abstract base classes for defining PennyLane
operations and observables.

.. warning::

    Unless you are a PennyLane or plugin developer, you likely do not need
    to use these classes directly.

    See the :doc:`main operations page <../introduction/operations>` for
    details on available operations and observables.

Description
-----------

Qubit Operations
~~~~~~~~~~~~~~~~
The :class:`Operator` class serves as a base class for operators,
and is inherited by the
:class:`Operation` class. These classes are subclassed to implement quantum operations
and measure observables in PennyLane.

* Each :class:`~.Operator` subclass represents a general type of
  map between physical states. Each instance of these subclasses
  represents either

  - an application of the operator or
  - an instruction to measure and return the respective result.

  Operators act on a sequence of wires (subsystems) using given parameter values.

* Each :class:`~.Operation` subclass represents a type of quantum operation,
  for example a unitary quantum gate. Each instance of these subclasses
  represents an application of the operation with given parameter values to
  a given sequence of wires (subsystems).


Differentiation
^^^^^^^^^^^^^^^

In general, an :class:`Operation` is differentiable (at least using the finite-difference
method) with respect to a parameter iff

* the domain of that parameter is continuous.

For an :class:`Operation` to be differentiable with respect to a parameter using the
analytic method of differentiation, it must satisfy an additional constraint:

* the parameter domain must be real.

.. note::

    These conditions are *not* sufficient for analytic differentiation. For example,
    CV gates must also define a matrix representing their Heisenberg linear
    transformation on the quadrature operators.

CV Operation base classes
~~~~~~~~~~~~~~~~~~~~~~~~~

Due to additional requirements, continuous-variable (CV) operations must subclass the
:class:`~.CVOperation` or :class:`~.CVObservable` classes instead of :class:`~.Operation`.

Differentiation
^^^^^^^^^^^^^^^

To enable gradient computation using the analytic method for Gaussian CV operations, in addition, you need to
provide the static class method :meth:`~.CV._heisenberg_rep` that returns the Heisenberg representation of
the operation given its list of parameters, namely:

* For Gaussian CV Operations this method should return the matrix of the linear transformation carried out by the
  operation on the vector of quadrature operators :math:`\mathbf{r}` for the given parameter
  values.

* For Gaussian CV Observables this method should return a real vector (first-order observables)
  or symmetric matrix (second-order observables) of coefficients of the quadrature
  operators :math:`\x` and :math:`\p`.

PennyLane uses the convention :math:`\mathbf{r} = (\I, \x, \p)` for single-mode operations and observables
and :math:`\mathbf{r} = (\I, \x_0, \p_0, \x_1, \p_1, \ldots)` for multi-mode operations and observables.

.. note::
    Non-Gaussian CV operations and observables are currently only supported via
    the finite-difference method of gradient computation.

Contents
--------

.. currentmodule:: pennylane.operation

Operator Types
~~~~~~~~~~~~~~

.. currentmodule:: pennylane.operation

.. autosummary::
    :toctree: api

    ~Operator
    ~Operation
    ~CV
    ~CVObservable
    ~CVOperation
    ~Channel
    ~StatePrepBase

.. currentmodule:: pennylane.operation

.. inheritance-diagram:: Operator Operation Channel CV CVObservable CVOperation StatePrepBase
    :parts: 1


Boolean Functions
~~~~~~~~~~~~~~~~~

:class:`~.BooleanFn`'s are functions of a single object that return ``True`` or ``False``.
The ``operation`` module provides the following:

.. currentmodule:: pennylane.operation

.. autosummary::
    :toctree: api

    ~is_trainable

Other
~~~~~

.. currentmodule:: pennylane.operation

.. autosummary::
    :toctree: api

    ~operation_derivative

.. currentmodule:: pennylane

PennyLane also provides a function for checking the consistency and correctness of an operator instance.

.. autosummary::
    :toctree: api

    ~ops.functions.assert_valid

Operation attributes
~~~~~~~~~~~~~~~~~~~~

PennyLane contains a mechanism for storing lists of operations with similar
attributes and behaviour (for example, those that are their own inverses).
The attributes below are already included, and are used primarily for the
purpose of compilation transforms. New attributes can be added by instantiating
new :class:`~pennylane.ops.qubit.attributes.Attribute` objects. Please note that
these objects are located in ``pennylane.ops.qubit.attributes``, not ``pennylane.operation``.

.. currentmodule:: pennylane

.. autosummary::
    :toctree: api

    ~ops.qubit.attributes.Attribute
    ~ops.qubit.attributes.composable_rotations
    ~ops.qubit.attributes.diagonal_in_z_basis
    ~ops.qubit.attributes.has_unitary_generator
    ~ops.qubit.attributes.self_inverses
    ~ops.qubit.attributes.supports_broadcasting
    ~ops.qubit.attributes.symmetric_over_all_wires
    ~ops.qubit.attributes.symmetric_over_control_wires

## `ClassPropertyDescriptor`

```python
class ClassPropertyDescriptor
```

Allows a class property to be defined

### `setter`

```python
def setter(self, func)
```

Set the function as a class method, and store as an attribute.

## `classproperty`

```python
def classproperty(func) -> ClassPropertyDescriptor
```

The class property decorator

## `create_operator_primitive`

```python
def create_operator_primitive(operator_type: type['qp.operation.Operator']) -> Optional['jax.extend.core.Primitive']
```

Create a primitive corresponding to an operator type.

Called when defining any :class:`~.Operator` subclass, and is used to set the
``Operator._primitive`` class property.

Args:
    operator_type (type): a subclass of qp.operation.Operator

Returns:
    Optional[jax.extend.core.Primitive]: A new jax primitive with the same name as the operator subclass.
    ``None`` is returned if jax is not available.

## `Operator`

```python
class Operator(abc.ABC, metaclass=capture.ABCCaptureMeta)
```

Base class representing quantum operators.

Operators are uniquely defined by their name, the wires they act on, their (trainable) parameters,
and their (non-trainable) hyperparameters. The trainable parameters
can be tensors of any supported auto-differentiation framework.

An operator can define any of the following representations:

* Representation as a **matrix** (:meth:`.Operator.matrix`), as specified by a
  global wire order that tells us where the wires are found on a register.

* Representation as a **sparse matrix** (:meth:`.Operator.sparse_matrix`). Currently, this
  is a SciPy CSR matrix format.

* Representation via the **eigenvalue decomposition** specified by eigenvalues
  (:meth:`.Operator.eigvals`) and diagonalizing gates (:meth:`.Operator.diagonalizing_gates`).

* Representation as a **product of operators** (:meth:`.Operator.decomposition`).

* Representation as a **linear combination of operators** (:meth:`.Operator.terms`).

* Representation by a **generator** via :math:`e^{G}` (:meth:`.Operator.generator`).

Each representation method comes with a static method prefixed by ``compute_``, which
takes the signature ``(*parameters, **hyperparameters)`` (for numerical representations that do not need
to know about wire labels) or ``(*parameters, wires, **hyperparameters)``, where ``parameters``, ``wires``, and
``hyperparameters`` are the respective attributes of the operator class.

.. warning::

    The ``id`` keyword argument is deprecated and will be removed in v0.46.

Args:
    *params (tuple[tensor_like]): trainable parameters
    wires (Iterable[Any] | Any): Wire label(s) that the operator acts on.
        If not given, args[-1] is interpreted as wires.
    id (str | None): *Deprecated* A custom label given to an operator instance,
        can be useful for some applications where the instance has to be identified

**Example**

A custom operator can be created by inheriting from :class:`~.Operator` or one of its subclasses.

The following is an example for a custom gate that inherits from the :class:`~.Operation` subclass.
It acts by potentially flipping a qubit and rotating another qubit.
The custom operator defines a decomposition, which the devices can use (since it is unlikely that a device
knows a native implementation for ``FlipAndRotate``). It also defines an adjoint operator.

.. code-block:: python

    import pennylane as qp


    class FlipAndRotate(qp.operation.Operation):

        # This attribute tells PennyLane what differentiation method to use. Here
        # we request parameter-shift (or "analytic") differentiation.
        grad_method = "A"

        def __init__(self, angle, wire_rot, wire_flip=None, do_flip=False):

            # checking the inputs --------------

            if do_flip and wire_flip is None:
                raise ValueError("Expected a wire to flip; got None.")

            #------------------------------------

            # do_flip is not trainable but influences the action of the operator,
            # which is why we define it to be a hyperparameter
            self._hyperparameters = {
                "do_flip": do_flip
            }

            # we extract all wires that the operator acts on,
            # relying on the Wire class arithmetic
            all_wires = qp.wires.Wires(wire_rot) + qp.wires.Wires(wire_flip)

            # The parent class expects all trainable parameters to be fed as positional
            # arguments, and all wires acted on fed as a keyword argument.
            # The id keyword argument allows users to give their instance a custom name.
            super().__init__(angle, wires=all_wires)

        @property
        def num_params(self):
            # if it is known before creation, define the number of parameters to expect here,
            # which makes sure an error is raised if the wrong number was passed. The angle
            # parameter is the only trainable parameter of the operation
            return 1

        @property
        def ndim_params(self):
            # if it is known before creation, define the number of dimensions each parameter
            # is expected to have. This makes sure to raise an error if a wrongly-shaped
            # parameter was passed. The angle parameter is expected to be a scalar
            return (0,)

        @staticmethod
        def compute_decomposition(angle, wires, do_flip):  # pylint: disable=arguments-differ
            # Overwriting this method defines the decomposition of the new gate, as it is
            # called by Operator.decomposition().
            # The general signature of this function is (*parameters, wires, **hyperparameters).
            op_list = []
            if do_flip:
                op_list.append(qp.X(wires[1]))
            op_list.append(qp.RX(angle, wires=wires[0]))
            return op_list

        def adjoint(self):
            # the adjoint operator of this gate simply negates the angle
            return FlipAndRotate(-self.parameters[0], self.wires[0], self.wires[1], do_flip=self.hyperparameters["do_flip"])

We can use the operation as follows:

.. code-block:: python

    from pennylane import numpy as np

    dev = qp.device("default.qubit", wires=["q1", "q2", "q3"])

    @qp.qnode(dev)
    def circuit(angle):
        FlipAndRotate(angle, wire_rot="q1", wire_flip="q1")
        return qp.expval(qp.Z("q1"))

>>> a = np.array(3.14)
>>> circuit(a)
tensor(-0.99999873, requires_grad=True)

.. details::
    :title: Serialization and Pytree format
    :href: serialization

    PennyLane operations are automatically registered as `Pytrees <https://jax.readthedocs.io/en/latest/pytrees.html>`_ .

    For most operators, this process will happen automatically without need for custom implementations.

    Customization of this process must occur if:

    * The data and hyperparameters are insufficient to reproduce the original operation via its initialization
    * The hyperparameters contain a non-hashable component, such as a list or dictionary.

    Some examples include arithmetic operators, like :class:`~.Adjoint` or :class:`~.Sum`, or templates that
    perform preprocessing during initialization.

    See the ``Operator._flatten`` and ``Operator._unflatten`` methods for more information.

    >>> op = qp.PauliRot(1.2, "XY", wires=(0,1))
    >>> op._flatten()
    ((1.2,), (Wires([0, 1]), (('pauli_word', 'XY'),)))
    >>> qp.PauliRot._unflatten(*op._flatten())
    PauliRot(1.2, XY, wires=[0, 1])


.. details::
    :title: Parameter broadcasting
    :href: parameter-broadcasting

    Many quantum functions are executed repeatedly at different parameters, which
    can be done with parameter broadcasting. For usage details and examples see the
    :class:`~.pennylane.QNode` documentation.

    In order to support parameter broadcasting with an operator class,
    the following steps are necessary:

    #. Define the class attribute ``ndim_params``, a tuple that indicates
       the expected number of dimensions for each operator argument
       *without broadcasting*. For example, ``FlipAndRotate``
       above has ``ndim_params = (0,)`` for a single scalar argument.
       An operator taking a matrix argument and a scalar would have ``ndim_params = (2, 0)``.
       Note that ``ndim_params`` does *not require the size* of the axes.
    #. Make the representations of the operator broadcasting-compatible. Typically, one or
       multiple of the methods ``compute_matrix``, ``compute_eigvals`` and
       ``compute_decomposition`` are defined by an operator, and these need to work with
       the original input and output as well as with broadcasted inputs and outputs
       that have an additional, leading axis. See below for an example.
    #. Make sure that validation within the above representation methods and
       ``__init__``---if it is overwritten by the operator class---allow
       for broadcasted inputs. For custom operators this usually is a minor
       step or not necessary at all.
    #. For proper registration, add the name of the operator to
       :obj:`~.pennylane.ops.qubit.attributes.supports_broadcasting` in the file
       ``pennylane/ops/qubit/attributes.py``.
    #. Make sure that the operator's ``_check_batching`` method is called in all
       places required. This is typically done automatically but needs to be assured.
       See further below for details.

    **Examples**

    Consider an operator with the same matrix as ``qp.RX``. A basic variant of
    ``compute_matrix`` (which will not be compatible with all autodifferentiation
    frameworks or backpropagation) is

    .. code-block:: python

        @staticmethod
        def compute_matrix(theta):
            '''Broadcasting axis ends up in the wrong position.'''
            c = qp.math.cos(theta / 2)
            s = qp.math.sin(theta / 2)
            return qp.math.array([[c, -1j * s], [-1j * s, c]])

    If we passed a broadcasted argument ``theta`` of shape ``(batch_size,)`` to this method,
    which would have one instead of zero dimensions, ``cos`` and ``sin`` would correctly
    be applied elementwise.
    We would also obtain the correct matrix with shape ``(2, 2, batch_size)``.
    However, the broadcasting axis needs to be the *first* axis by convention, so that we need
    to move the broadcasting axis--if it exists--to the front before returning the matrix:

    .. code-block:: python

        @staticmethod
        def compute_matrix(theta):
            '''Broadcasting axis ends up in the correct leading position.'''
            c = qp.math.cos(theta / 2)
            s = qp.math.sin(theta / 2)
            mat = qp.math.array([[c, -1j * s], [-1j * s, c]])
            # Check whether the input has a broadcasting axis
            if qp.math.ndim(theta)==1:
                # Move the broadcasting axis to the first position
                return qp.math.moveaxis(mat, 2, 0)
            return mat

    Adapting ``compute_eigvals`` to broadcasting looks similar.

    Usually no major changes are required for ``compute_decomposition``, but we need
    to take care of the correct mapping of input arguments to the operators in the
    decomposition. As an example, consider the operator that represents a layer of
    ``RX`` rotations with individual angles for each rotation. Without broadcasting,
    it takes one onedimensional array, i.e. ``ndim_params=(1,)``.
    Its decomposition, which is a convenient way to support this custom operation
    on all devices that implement ``RX``, might look like this:

    .. code-block:: python

        @staticmethod
        def compute_decomposition(theta, wires):
            '''Iterate over the first axis of theta.'''
            decomp_ops = [qp.RX(x, wires=w) for x, w in zip(theta, wires)]
            return decomp_ops

    If ``theta`` is a broadcasted argument, its first axis is the broadcasting
    axis and we would like to iterate over the *second* axis within the ``for``
    loop instead. This is easily achieved by adding a transposition of ``theta``
    that switches the axes in this case. Conveniently this does not have any
    effect in the non-broadcasted case, so that we do not need to handle two
    cases separately.

    .. code-block:: python

        @staticmethod
        def compute_decomposition(theta, wires):
            '''Iterate over the last axis of theta, which is also the first axis
            or the second axis without and with broadcasting, respectively.'''
            decomp_ops = [qp.RX(x, wires=w) for x, w in zip(qp.math.T(theta), wires)]
            return decomp_ops

    **The ``_check_batching`` method**

    Each operator determines whether it is used with a batch of parameters within
    the ``_check_batching`` method, by comparing the shape of the input data to
    the expected shape. Therefore, it is necessary to call ``_check_batching`` on
    any new input parameters passed to the operator. By default, any class inheriting
    from :class:`~.operation.Operator` will do so the first time its
    ``batch_size`` property is accessed.

    ``_check_batching`` modifies the following instance attributes:

    - ``_ndim_params``: The number of dimensions of the parameters passed to
      ``_check_batching``. For an ``Operator`` that does _not_ set the ``ndim_params``
      attribute, ``_ndim_params`` is used as a surrogate, interpreting any parameters
      as "not broadcasted". This attribute should be understood as temporary and likely
      should not be used in other contexts.

    - ``_batch_size``: If the ``Operator`` is broadcasted: The batch size/size of the
      broadcasting axis. If it is not broadcasted: ``None``. An ``Operator`` that does
      not support broadcasting will report to not be broadcasted independently of the
      input.

    These two properties are defined lazily, and accessing the public version of either
    one of them (in other words, without the leading underscore) for the first time will
    trigger a call to ``_check_batching``, which validates and sets these properties.

### `hash`

```python
def hash(self) -> int
```

int: Integer hash that uniquely represents the operator.

### `compute_matrix`

```python
def compute_matrix(*params: TensorLike, **hyperparams: dict[str, Any]) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`.Operator.matrix` and :func:`qp.matrix() <pennylane.matrix>`

Args:
    *params (list): trainable parameters of the operator, as stored in the ``parameters`` attribute
    **hyperparams (dict): non-trainable hyperparameters of the operator, as stored in the ``hyperparameters`` attribute

Returns:
    tensor_like: matrix representation

### `has_matrix`

```python
def has_matrix(cls) -> bool
```

Bool: Whether or not the Operator returns a defined matrix.

Note: Child classes may have this as an instance property instead of as a class property.

### `matrix`

```python
def matrix(self, wire_order: WiresLike | None=None) -> TensorLike
```

Representation of the operator as a matrix in the computational basis.

If ``wire_order`` is provided, the numerical representation considers the position of the
operator's wires in the global wire order. Otherwise, the wire order defaults to the
operator's wires.

If the matrix depends on trainable parameters, the result
will be cast in the same autodifferentiation framework as the parameters.

A ``MatrixUndefinedError`` is raised if the matrix representation has not been defined.

.. seealso:: :meth:`~.Operator.compute_matrix`

Args:
    wire_order (Iterable): global wire order, must contain all wire labels from the operator's wires

Returns:
    tensor_like: matrix representation

### `compute_sparse_matrix`

```python
def compute_sparse_matrix(*params: TensorLike, format: str='csr', **hyperparams: dict[str, Any]) -> spmatrix
```

Representation of the operator as a sparse matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.Operator.sparse_matrix`

Args:
    *params (list): trainable parameters of the operator, as stored in the ``parameters`` attribute
    format (str): format of the returned scipy sparse matrix, for example 'csr'
    **hyperparams (dict): non-trainable hyperparameters of the operator, as stored in the ``hyperparameters``
        attribute

Returns:
    scipy.sparse._csr.csr_matrix: sparse matrix representation

### `has_sparse_matrix`

```python
def has_sparse_matrix(cls) -> bool
```

Bool: Whether the Operator returns a defined sparse matrix.

Note: Child classes may have this as an instance property instead of as a class property.

### `sparse_matrix`

```python
def sparse_matrix(self, wire_order: WiresLike | None=None, format='csr') -> spmatrix
```

Representation of the operator as a sparse matrix in the computational basis.

If ``wire_order`` is provided, the numerical representation considers the position of the
operator's wires in the global wire order. Otherwise, the wire order defaults to the
operator's wires.

A ``SparseMatrixUndefinedError`` is raised if the sparse matrix representation has not been defined.

.. seealso:: :meth:`~.Operator.compute_sparse_matrix`

Args:
    wire_order (Iterable): global wire order, must contain all wire labels from the operator's wires
    format (str): format of the returned scipy sparse matrix, for example 'csr'

Returns:
    scipy.sparse._csr.csr_matrix: sparse matrix representation

### `compute_eigvals`

```python
def compute_eigvals(*params: TensorLike, **hyperparams) -> TensorLike
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`Operator.eigvals() <.eigvals>` and :func:`qp.eigvals() <pennylane.eigvals>`

Args:
    *params (list): trainable parameters of the operator, as stored in the ``parameters`` attribute
    **hyperparams (dict): non-trainable hyperparameters of the operator, as stored in the ``hyperparameters`` attribute

Returns:
    tensor_like: eigenvalues

### `eigvals`

```python
def eigvals(self) -> TensorLike
```

Eigenvalues of the operator in the computational basis.

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`, the operator
can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. note::
    When eigenvalues are not explicitly defined, they are computed automatically from the matrix representation.
    Currently, this computation is *not* differentiable.

A ``EigvalsUndefinedError`` is raised if the eigenvalues have not been defined and cannot be
inferred from the matrix representation.

.. seealso:: :meth:`~.Operator.compute_eigvals` and :func:`qp.eigvals() <pennylane.eigvals>`

Returns:
    tensor_like: eigenvalues

### `terms`

```python
def terms(self) -> tuple[list[TensorLike], list['Operation']]
```

Representation of the operator as a linear combination of other operators.

.. math:: O = \sum_i c_i O_i

A ``TermsUndefinedError`` is raised if no representation by terms is defined.

Returns:
    tuple[list[tensor_like or float], list[.Operation]]: list of coefficients :math:`c_i`
    and list of operations :math:`O_i`

### `name`

```python
def name(self) -> str
```

String for the name of the operator.

### `id`

```python
def id(self) -> str
```

Custom string to label a specific operator instance.

.. warning::

    The ``id`` keyword argument is deprecated and will be removed in v0.46.

### `label`

```python
def label(self, decimals: int | None=None, base_label: str | None=None, cache: dict | None=None) -> str
```

A customizable string representation of the operator.

Args:
    decimals=None (int): If ``None``, no parameters are included. Else,
        specifies how to round the parameters.
    base_label=None (str): overwrite the non-parameter component of the label
    cache=None (dict): dictionary that carries information between label calls
        in the same drawing

Returns:
    str: label to use in drawings

**Example:**

>>> op = qp.RX(1.23456, wires=0)
>>> op.label()
'RX'
>>> op.label(base_label="my_label")
'my_label'
>>> op = qp.RX(1.23456, wires=0)
>>> op.label()
'RX'
>>> op.label(decimals=2)
'RX\n(1.23)'
>>> op.label(base_label="my_label")
'my_label'
>>> op.label(decimals=2, base_label="my_label")
'my_label\n(1.23)'

If the operation has a matrix-valued parameter and a cache dictionary is provided,
unique matrices will be cached in the ``'matrices'`` key list. The label will contain
the index of the matrix in the ``'matrices'`` list.

>>> op2 = qp.QubitUnitary(np.eye(2), wires=0)
>>> cache = {'matrices': []}
>>> op2.label(cache=cache)
'U\n(M0)'
>>> cache['matrices']
[tensor([[1., 0.],
 [0., 1.]], requires_grad=True)]
>>> op3 = qp.QubitUnitary(np.eye(4), wires=(0,1))
>>> op3.label(cache=cache)
'U\n(M1)'
>>> cache['matrices']
[tensor([[1., 0.],
        [0., 1.]], requires_grad=True),
tensor([[1., 0., 0., 0.],
        [0., 1., 0., 0.],
        [0., 0., 1., 0.],
        [0., 0., 0., 1.]], requires_grad=True)]

### `__repr__`

```python
def __repr__(self) -> str
```

Constructor-call-like representation.

### `num_params`

```python
def num_params(self) -> int
```

Number of trainable parameters that the operator depends on.

By default, this property returns as many parameters as were used for the
operator creation. If the number of parameters for an operator subclass is fixed,
this property can be overwritten to return the fixed value.

Returns:
    int: number of parameters

### `ndim_params`

```python
def ndim_params(self) -> tuple[int]
```

Number of dimensions per trainable parameter of the operator.

By default, this property returns the numbers of dimensions of the parameters used
for the operator creation. If the parameter sizes for an operator subclass are fixed,
this property can be overwritten to return the fixed value.

Returns:
    tuple: Number of dimensions for each trainable parameter.

### `batch_size`

```python
def batch_size(self) -> int | None
```

Batch size of the operator if it is used with broadcasted parameters.

The ``batch_size`` is determined based on ``ndim_params`` and the provided parameters
for the operator. If (some of) the latter have an additional dimension, and this
dimension has the same size for all parameters, its size is the batch size of the
operator. If no parameter has an additional dimension, the batch size is ``None``.

Returns:
    int or None: Size of the parameter broadcasting dimension if present, else ``None``.

### `wires`

```python
def wires(self) -> Wires
```

Wires that the operator acts on.

Returns:
    Wires: wires

### `parameters`

```python
def parameters(self) -> list[TensorLike]
```

Trainable parameters that the operator depends on.

### `hyperparameters`

```python
def hyperparameters(self) -> dict[str, Any]
```

dict: Dictionary of non-trainable variables that this operation depends on.

### `pauli_rep`

```python
def pauli_rep(self) -> Optional['qp.pauli.PauliSentence']
```

A :class:`~.PauliSentence` representation of the Operator, or ``None`` if it doesn't have one.

### `is_verified_hermitian`

```python
def is_verified_hermitian(self) -> bool
```

This property determines if an operator is verified to be Hermitian.

.. note::

    This property provides a fast, non-exhaustive check used for internal
    optimizations. It relies on quick, provable shortcuts (e.g., operator
    properties) rather than a full, computationally expensive check.

    For a definitive check, use the :func:`pennylane.is_hermitian` function.
    Please note that this comes with increased computational cost.

Returns:
    bool: The property will return ``True`` if the operator is guaranteed to be Hermitian and
    ``False`` if the check is inconclusive and the operator may or may not be Hermitian.

Consider this operator,

>>> op = (qp.X(0) @ qp.Y(0) - qp.X(0) @ qp.Z(0)) * 1j

In this case, Hermicity cannot be verified and leads to an inconclusive result:

>>> op.is_verified_hermitian # inconclusive
False

However, using :func:`pennylane.is_hermitian` will give the correct answer:

>>> qp.is_hermitian(op) # definitive
True

### `has_decomposition`

```python
def has_decomposition(self) -> bool
```

Bool: Whether or not the Operator returns a defined decomposition.

### `decomposition`

```python
def decomposition(self) -> list['Operator']
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n

A ``DecompositionUndefinedError`` is raised if no representation by decomposition is defined.

.. seealso:: :meth:`~.Operator.compute_decomposition`.

Returns:
    list[Operator]: decomposition of the operator

### `compute_decomposition`

```python
def compute_decomposition(*params: TensorLike, wires: WiresLike | None=None, **hyperparameters: dict[str, Any]) -> list['Operator']
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

.. note::

    Operations making up the decomposition should be queued within the
    ``compute_decomposition`` method.

.. seealso:: :meth:`~.Operator.decomposition`.

Args:
    *params (list): trainable parameters of the operator, as stored in the ``parameters`` attribute
    wires (Iterable[Any], Wires): wires that the operator acts on
    **hyperparams (dict): non-trainable hyperparameters of the operator, as stored in the ``hyperparameters`` attribute

Returns:
    list[Operator]: decomposition of the operator

### `resource_params`

```python
def resource_params(self) -> dict
```

A dictionary containing the minimal information needed to compute a
resource estimate of the operator's decomposition.

The keys of this dictionary should match the ``resource_keys`` attribute of the operator
class. Two instances of the same operator type should have identical ``resource_params`` iff
their decompositions exhibit the same counts for each gate type, even if the individual
gate parameters differ.

**Examples**

The ``MultiRZ`` has non-empty ``resource_keys``:

>>> qp.MultiRZ.resource_keys
{'num_wires'}

The ``resource_params`` of an instance of ``MultiRZ`` will contain the number of wires:

>>> op = qp.MultiRZ(0.5, wires=[0, 1])
>>> op.resource_params
{'num_wires': 2}

Note that another ``MultiRZ`` may have different parameters but the same ``resource_params``:

>>> op2 = qp.MultiRZ(0.7, wires=[1, 2])
>>> op2.resource_params
{'num_wires': 2}

### `has_diagonalizing_gates`

```python
def has_diagonalizing_gates(cls) -> bool
```

Bool: Whether or not the Operator returns defined diagonalizing gates.

Note: Child classes may have this as an instance property instead of as a class property.

### `compute_diagonalizing_gates`

```python
def compute_diagonalizing_gates(*params: TensorLike, wires: WiresLike, **hyperparams: dict[str, Any]) -> list['Operator']
```

Sequence of gates that diagonalize the operator in the computational basis (static method).

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

.. seealso:: :meth:`~.Operator.diagonalizing_gates`.

Args:
    params (list): trainable parameters of the operator, as stored in the ``parameters`` attribute
    wires (Iterable[Any], Wires): wires that the operator acts on
    hyperparams (dict): non-trainable hyperparameters of the operator, as stored in the ``hyperparameters`` attribute

Returns:
    list[.Operator]: list of diagonalizing gates

### `diagonalizing_gates`

```python
def diagonalizing_gates(self) -> list['Operator']
```

Sequence of gates that diagonalize the operator in the computational basis.

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

A ``DiagGatesUndefinedError`` is raised if no representation by decomposition is defined.

.. seealso:: :meth:`~.Operator.compute_diagonalizing_gates`.

Returns:
    list[.Operator] or None: a list of operators

### `has_generator`

```python
def has_generator(cls) -> bool
```

Bool: Whether or not the Operator returns a defined generator.

Note: Child classes may have this as an instance property instead of as a class property.

### `generator`

```python
def generator(self) -> 'Operator'
```

Generator of an operator that is in single-parameter-form.

For example, for operator

.. math::

    U(\phi) = e^{i\phi (0.5 Y + Z\otimes X)}

we get the generator

>>> U.generator() # doctest: +SKIP
0.5 * Y(0) + Z(0) @ X(1)

The generator may also be provided in the form of a dense or sparse Hamiltonian
(using :class:`.LinearCombination` and :class:`.SparseHamiltonian` respectively).

### `pow`

```python
def pow(self, z: float) -> list['Operator']
```

A list of new operators equal to this one raised to the given power. This method is used to simplify
:class:`~.Pow` instances created by :func:`~.pow` or ``op ** power``.

``Operator.pow`` can be optionally defined by Operator developers, while :func:`~.pow` or ``op ** power``
are the entry point for constructing generic powers to exponents.

Args:
    z (float): exponent for the operator

Returns:
    list[:class:`~.operation.Operator`]

>>> class MyClass(qp.operation.Operator):
...
...     def pow(self, z):
...         return [MyClass(self.data[0]*z, self.wires)]
...
>>> op = MyClass(0.5, 0) ** 2
>>> op
MyClass(0.5, wires=[0])**2
>>> op.decomposition()
[MyClass(1.0, wires=[0])]
>>> op.simplify()
MyClass(1.0, wires=[0])

### `queue`

```python
def queue(self, context: QueuingManager=QueuingManager)
```

Append the operator to the Operator queue.

### `has_adjoint`

```python
def has_adjoint(cls) -> bool
```

Bool: Whether or not the Operator can compute its own adjoint.

Note: Child classes may have this as an instance property instead of as a class property.

### `adjoint`

```python
def adjoint(self) -> 'Operator'
```

Create an operation that is the adjoint of this one. Used to simplify
:class:`~.Adjoint` operators constructed by :func:`~.adjoint`.

Adjointed operations are the conjugated and transposed version of the
original operation. Adjointed ops are equivalent to the inverted operation for unitary
gates.

``Operator.adjoint`` can be optionally defined by Operator developers, while :func:`~.adjoint`
is the entry point for constructing generic adjoint representations.

Returns:
    The adjointed operation.

>>> class MyClass(qp.operation.Operator):
...
...     def adjoint(self):
...         return self
...
>>> op = qp.adjoint(MyClass(wires=0))
>>> op
Adjoint(MyClass(wires=[0]))
>>> op.decomposition()
[MyClass(wires=[0])]
>>> op.simplify()
MyClass(wires=[0])

### `arithmetic_depth`

```python
def arithmetic_depth(self) -> int
```

Arithmetic depth of the operator.

### `map_wires`

```python
def map_wires(self, wire_map: dict[Hashable, Hashable]) -> 'Operator'
```

Returns a copy of the current operator with its wires changed according to the given
wire map.

Args:
    wire_map (dict): dictionary containing the old wires as keys and the new wires as values

Returns:
    .Operator: new operator

### `simplify`

```python
def simplify(self) -> 'Operator'
```

Reduce the depth of nested operators to the minimum.

Returns:
    .Operator: simplified operator

### `__add__`

```python
def __add__(self, other: Union['Operator', TensorLike]) -> 'Operator'
```

The addition operation of Operator-Operator objects and Operator-scalar.

### `__mul__`

```python
def __mul__(self, other: Callable | TensorLike) -> 'Operator'
```

The scalar multiplication between scalars and Operators.

### `__truediv__`

```python
def __truediv__(self, other: TensorLike)
```

The division between an Operator and a number.

### `__matmul__`

```python
def __matmul__(self, other: 'Operator') -> 'Operator'
```

The product operation between Operator objects.

### `__sub__`

```python
def __sub__(self, other: Union['Operator', TensorLike]) -> 'Operator'
```

The subtraction operation of Operator-Operator objects and Operator-scalar.

### `__rsub__`

```python
def __rsub__(self, other: Union['Operator', TensorLike])
```

The reverse subtraction operation of Operator-Operator objects and Operator-scalar.

### `__neg__`

```python
def __neg__(self)
```

The negation operation of an Operator object.

### `__pow__`

```python
def __pow__(self, other: TensorLike) -> 'Operator'
```

The power operation of an Operator object.

## `Operation`

```python
class Operation(Operator)
```

Base class representing quantum gates or channels applied to quantum states.

Operations define some additional properties, that are used for external
transformations such as gradient transforms.

The following three class attributes are optional, but in most cases
at least one should be clearly defined to avoid unexpected behaviour during
differentiation.

* :attr:`~.Operation.grad_recipe`
* :attr:`~.Operation.parameter_frequencies`
* :attr:`~.Operation.generator`

Note that ``grad_recipe`` takes precedence when computing parameter-shift
derivatives. Finally, these optional class attributes are used by certain
transforms, quantum optimizers, and gradient methods.
For details on how they are used during differentiation and other transforms,
please see the documentation for :class:`~.gradients.param_shift`,
:class:`~.metric_tensor`, :func:`~.reconstruct`.

.. warning::

    The ``id`` argument is deprecated and will be removed in v0.46.

Args:
    *params (tuple[tensor_like]): trainable parameters
    wires (Iterable[Any] or Any): Wire label(s) that the operator acts on.
        If not given, args[-1] is interpreted as wires.
    id (str | None): *Deprecated* A custom label given to an operator instance,
        can be useful for some applications where the instance has to be identified

### `grad_method`

```python
def grad_method(self) -> Literal['A', 'F', None]
```

Gradient computation method.

* ``'A'``: analytic differentiation using the parameter-shift method.
* ``'F'``: finite difference numerical differentiation.
* ``None``: the operation may not be differentiated.

Default is ``'F'``, or ``None`` if the Operation has zero parameters.

### `basis`

```python
def basis(self) -> Literal['X', 'Y', 'Z', None]
```

str or None: The basis of an operation, or for controlled gates, of the
target operation. If not ``None``, should take a value of ``"X"``, ``"Y"``,
or ``"Z"``.

For example, ``X`` and ``CNOT`` have ``basis = "X"``, whereas
``ControlledPhaseShift`` and ``RZ`` have ``basis = "Z"``.

### `control_wires`

```python
def control_wires(self) -> Wires
```

Control wires of the operator.

For operations that are not controlled,
this is an empty ``Wires`` object of length ``0``.

Returns:
    Wires: The control wires of the operation.

### `single_qubit_rot_angles`

```python
def single_qubit_rot_angles(self) -> tuple[float, float, float]
```

The parameters required to implement a single-qubit gate as an
equivalent ``Rot`` gate, up to a global phase.

Returns:
    tuple[float, float, float]: A list of values :math:`[\phi, \theta, \omega]`
    such that :math:`RZ(\omega) RY(\theta) RZ(\phi)` is equivalent to the
    original operation.

### `parameter_frequencies`

```python
def parameter_frequencies(self) -> list[tuple[float | int]]
```

Returns the frequencies for each operator parameter with respect
to an expectation value of the form
:math:`\langle \psi | U(\mathbf{p})^\dagger \hat{O} U(\mathbf{p})|\psi\rangle`.

These frequencies encode the behaviour of the operator :math:`U(\mathbf{p})`
on the value of the expectation value as the parameters are modified.
For more details, please see the :mod:`.pennylane.fourier` module.

Returns:
    list[tuple[int or float]]: Tuple of frequencies for each parameter.
    Note that only non-negative frequency values are returned.

**Example**

>>> op = qp.CRot(0.4, 0.1, 0.3, wires=[0, 1])
>>> op.parameter_frequencies
[(0.5, 1.0), (0.5, 1.0), (0.5, 1.0)]

For operators that define a generator, the parameter frequencies are directly
related to the eigenvalues of the generator:

>>> op = qp.ControlledPhaseShift(0.1, wires=[0, 1])
>>> op.parameter_frequencies
[(1,)]
>>> gen = qp.generator(op, format="observable")
>>> gen_eigvals = qp.eigvals(gen)
>>> qp.gradients.eigvals_to_frequencies(tuple(gen_eigvals))
(np.float64(1.0),)

For more details on this relationship, see :func:`.eigvals_to_frequencies`.

## `Channel`

```python
class Channel(Operation, abc.ABC)
```

Base class for quantum channels.

Quantum channels have to define an additional numerical representation
as Kraus matrices.

Args:
    params (tuple[tensor_like]): trainable parameters
    wires (Iterable[Any] or Any): Wire label(s) that the operator acts on.
        If not given, args[-1] is interpreted as wires.
    id (str): custom label given to an operator instance,
        can be useful for some applications where the instance has to be identified

### `compute_kraus_matrices`

```python
def compute_kraus_matrices(*params, **hyperparams) -> list[np.ndarray]
```

Kraus matrices representing a quantum channel, specified in
the computational basis.

This is a static method that should be defined for all
new channels, and which allows matrices to be computed
directly without instantiating the channel first.

To return the Kraus matrices of an *instantiated* channel,
please use the :meth:`~.Operator.kraus_matrices()` method instead.

.. note::
    This method gets overwritten by subclasses to define the kraus matrix representation
    of a particular operator.

Args:
    *params (list): trainable parameters of the operator, as stored in the ``parameters`` attribute
    **hyperparams (dict): non-trainable hyperparameters of the operator,
        as stored in the ``hyperparameters`` attribute

Returns:
    list (array): list of Kraus matrices

**Example**

>>> qp.AmplitudeDamping.compute_kraus_matrices(0.1)
[array([[1.       , 0.       ],
        [0.       , 0.9486833]]),
 array([[0.        , 0.31622777],
        [0.        , 0.        ]])]

### `kraus_matrices`

```python
def kraus_matrices(self)
```

Kraus matrices of an instantiated channel
in the computational basis.

Returns:
    list (array): list of Kraus matrices

** Example**

>>> U = qp.AmplitudeDamping(0.1, wires=1)
>>> U.kraus_matrices()
[array([[1.       , 0.       ],
        [0.       , 0.9486833]]),
 array([[0.        , 0.31622777],
        [0.        , 0.        ]])]

## `CV`

```python
class CV
```

A mixin base class denoting a continuous-variable operation.

### `heisenberg_expand`

```python
def heisenberg_expand(self, U, wire_order)
```

Expand the given local Heisenberg-picture array into a full-system one.

Args:
    U (array[float]): array to expand (expected to be of the dimension ``1+2*self.num_wires``)
    wire_order (Wires): global wire order defining which subspace the operator acts on

Raises:
    ValueError: if the size of the input matrix is invalid or `num_wires` is incorrect

Returns:
    array[float]: expanded array, dimension ``1+2*num_wires``

### `supports_heisenberg`

```python
def supports_heisenberg(self)
```

Whether a CV operator defines a Heisenberg representation.

This indicates that it is Gaussian and does not block the use
of the parameter-shift differentiation method if found between the differentiated gate
and an observable.

Returns:
    boolean

## `CVOperation`

```python
class CVOperation(CV, Operation)
```

Base class representing continuous-variable quantum gates.

CV operations provide a special Heisenberg representation, as well as custom methods
for differentiation.

Args:
    params (tuple[tensor_like]): trainable parameters
    wires (Iterable[Any] or Any): Wire label(s) that the operator acts on.
        If not given, args[-1] is interpreted as wires.
    id (str): custom label given to an operator instance,
        can be useful for some applications where the instance has to be identified

### `supports_parameter_shift`

```python
def supports_parameter_shift(self)
```

Returns True iff the CV Operation supports the parameter-shift differentiation method.
This means that it has ``grad_method='A'`` and
has overridden the :meth:`~.CV._heisenberg_rep` static method.

### `heisenberg_pd`

```python
def heisenberg_pd(self, idx)
```

Partial derivative of the Heisenberg picture transform matrix.

Computed using grad_recipe.

Args:
    idx (int): index of the parameter with respect to which the
        partial derivative is computed.
Returns:
    array[float]: partial derivative

### `heisenberg_tr`

```python
def heisenberg_tr(self, wire_order, inverse=False)
```

Heisenberg picture representation of the linear transformation carried
out by the gate at current parameter values.

Given a unitary quantum gate :math:`U`, we may consider its linear
transformation in the Heisenberg picture, :math:`U^\dagger(\cdot) U`.

If the gate is Gaussian, this linear transformation preserves the polynomial order
of any observables that are polynomials in :math:`\mathbf{r} = (\I, \x_0, \p_0, \x_1, \p_1, \ldots)`.
This also means it maps :math:`\text{span}(\mathbf{r})` into itself:

.. math:: U^\dagger \mathbf{r}_i U = \sum_j \tilde{U}_{ij} \mathbf{r}_j

For Gaussian CV gates, this method returns the transformation matrix for
the current parameter values of the Operation. The method is not defined
for non-Gaussian (and non-CV) gates.

Args:
    wire_order (Wires): global wire order defining which subspace the operator acts on
    inverse  (bool): if True, return the inverse transformation instead

Raises:
    RuntimeError: if the specified operation is not Gaussian or is missing the `_heisenberg_rep` method

Returns:
    array[float]: :math:`\tilde{U}`, the Heisenberg picture representation of the linear transformation

## `CVObservable`

```python
class CVObservable(CV, Operator)
```

Base class representing continuous-variable observables.

CV observables provide a special Heisenberg representation.

The class attribute :attr:`~.ev_order` can be defined to indicate
to PennyLane whether the corresponding CV observable is a polynomial in the
quadrature operators. If so,

* ``ev_order = 1`` indicates a first order polynomial in quadrature
  operators :math:`(\x, \p)`.

* ``ev_order = 2`` indicates a second order polynomial in quadrature
  operators :math:`(\x, \p)`.

If :attr:`~.ev_order` is not ``None``, then the Heisenberg representation
of the observable should be defined in the static method :meth:`~.CV._heisenberg_rep`,
returning an array of the correct dimension.

Args:
   params (tuple[tensor_like]): trainable parameters
   wires (Iterable[Any] or Any): Wire label(s) that the operator acts on.
       If not given, args[-1] is interpreted as wires.
   id (str): custom label given to an operator instance,
       can be useful for some applications where the instance has to be identified

### `queue`

```python
def queue(self, context=QueuingManager)
```

Avoids queuing the observable.

### `heisenberg_obs`

```python
def heisenberg_obs(self, wire_order)
```

Representation of the observable in the position/momentum operator basis.

Returns the expansion :math:`q` of the observable, :math:`Q`, in the
basis :math:`\mathbf{r} = (\I, \x_0, \p_0, \x_1, \p_1, \ldots)`.

* For first-order observables returns a real vector such
  that :math:`Q = \sum_i q_i \mathbf{r}_i`.

* For second-order observables returns a real symmetric matrix
  such that :math:`Q = \sum_{ij} q_{ij} \mathbf{r}_i \mathbf{r}_j`.

Args:
    wire_order (Wires): global wire order defining which subspace the operator acts on
Returns:
    array[float]: :math:`q`

## `StatePrepBase`

```python
class StatePrepBase(Operation)
```

An interface for state-prep operations.

### `state_vector`

```python
def state_vector(self, wire_order: WiresLike | None=None) -> TensorLike
```

Returns the initial state vector for a circuit given a state preparation.

Args:
    wire_order (Iterable): global wire order, must contain all wire labels
        from the operator's wires

Returns:
    array: A state vector for all wires in a circuit

## `operation_derivative`

```python
def operation_derivative(operation: Operation) -> TensorLike
```

Calculate the derivative of an operation.

For an operation :math:`e^{i \hat{H} \phi t}`, this function returns the matrix representation
in the standard basis of its derivative with respect to :math:`t`, i.e.,

.. math:: \frac{d \, e^{i \hat{H} \phi t}}{dt} = i \phi \hat{H} e^{i \hat{H} \phi t},

where :math:`\phi` is a real constant.

Args:
    operation (.Operation): The operation to be differentiated.

Returns:
    array: the derivative of the operation as a matrix in the standard basis

Raises:
    ValueError: if the operation does not have a generator or is not composed of a single
        trainable parameter

## `is_trainable`

```python
def is_trainable(obj)
```

Returns ``True`` if any of the parameters of an operator is trainable
according to ``qp.math.requires_grad``.

## `__getattr__`

```python
def __getattr__(name)
```

To facilitate StatePrep rename
