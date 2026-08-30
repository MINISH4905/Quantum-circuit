---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/arithmetic/out_poly.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/arithmetic/out_poly.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/arithmetic/out_poly.py`

Contains the OutPoly template.

## `OutPoly`

```python
class OutPoly(Operation)
```

Performs the out-of-place polynomial operation.

Given a function :math:`f(x_1, \dots, x_m)` and an integer modulus :math:`mod`, this operator performs:

.. math::

    \text{OutPoly}_{f, mod} |x_1 \rangle \dots |x_m \rangle |0 \rangle
    = |x_1 \rangle \dots |x_m \rangle |f(x_1, \dots, x_m)\, \text{mod} \; mod\rangle,

where the integer inputs :math:`x_i` are embedded in the ``input_registers``. The result of the
polynomial function :math:`f(x_1, \dots, x_m)` is computed modulo :math:`mod` in the computational
basis and stored in the ``output_wires``. If the output wires are not initialized to zero, the evaluated
result :math:`f(x_1, \dots, x_m)\ \text{mod}\ mod` will be added to the value initialized in the output register.
This implementation is based on the Section II-B of `arXiv:2112.10537 <https://arxiv.org/abs/2112.10537>`_.


.. note::

    The integer values :math:`x_i` stored in each input register must
    be smaller than the modulus ``mod``.

Args:

    polynomial_function (callable): The polynomial function to be applied. The number of arguments in the function
        must be equal to the number of input registers.
    input_registers (List[Union[Wires, Sequence[int]]]): List containing the wires (or the wire indices) used to
        store each variable of the polynomial.
    output_wires (Union[Wires, Sequence[int]]): The wires (or wire indices) used to store the output of the operation.
    mod (int, optional): The integer for performing the modulo on the result of the polynomial operation. If not provided,
        it defaults to :math:`2^{n}`, where :math:`n` is the number of qubits in the output register.
    work_wires (Union[Wires, Sequence[int]], optional): The auxiliary wires to use for performing the polynomial operation.
        The work wires are not needed if :math:`mod=2^{\text{length(output_wires)}}`, otherwise two work wires should be
        provided. Defaults to empty tuple.

Raises:
    ValueError: If `mod` is not :math:`2^{\text{length(output_wires)}}` and insufficient number of work wires are provided.
    ValueError: If the wires used in the input and output registers overlap.
    ValueError: If the function is not defined with integer coefficients.

Example:
    Given a polynomial function :math:`f(x, y) = x^2 + y`,
    we can calculate :math:`f(3, 2)` as follows:

    .. code-block:: python

        wires = qp.registers({"x": 2, "y": 2, "output": 4})

        def f(x, y):
            return x ** 2 + y

        @qp.qnode(qp.device("default.qubit"), shots=1)
        def circuit():
            # load values of x and y
            qp.BasisEmbedding(3, wires=wires["x"])
            qp.BasisEmbedding(2, wires=wires["y"])

            # apply the polynomial
            qp.OutPoly(
                f,
                input_registers = [wires["x"], wires["y"]],
                output_wires = wires["output"])

            return qp.sample(wires=wires["output"])

    >>> print(circuit())
    [[1 0 1 1]]

    The result, :math:`[[1 0 1 1]]`, is the binary representation of :math:`3^2 + 2 = 11`.
    Note that the default value of `mod` in this example is :math:`2^{\text{len(output_wires)}} = 2^4 = 16`.
    For more information on using `mod`, see the Usage Details section.

.. seealso:: The decomposition of this operator consists of controlled :class:`~.PhaseAdder` gates.

.. details::
    :title: Usage Details

    If the value of `mod` is not :math:`2^{\text{length(output_wires)}}`, then two auxiliary qubits must be provided.

    .. code-block:: python

        x_wires = [0, 1, 2]
        y_wires = [3, 4, 5]
        input_registers = [x_wires, y_wires]

        output_wires = [6, 7, 8]
        work_wires = [9,10]


        def f(x, y):
            return x ** 2 + y

        @qp.qnode(qp.device("default.qubit"), shots=1)
        def circuit():
            # loading values for x and y
            qp.BasisEmbedding(3, wires=x_wires)
            qp.BasisEmbedding(2, wires=y_wires)
            qp.BasisEmbedding(1, wires=output_wires)

            # applying the polynomial
            qp.OutPoly(
                f,
                input_registers,
                output_wires,
                mod = 7,
                work_wires = work_wires
            )

            return qp.sample(wires=output_wires)

    >>> print(circuit())
    [[1 0 1]]

    The result, :math:`[[1 0 1]]`, is the binary representation
    of :math:`1 + f(3, 2) = 1 + 3^2 + 2  \; \text{mod} \; 7 = 5`.
    In this example ``output_wires`` is initialized to :math:`1`, so this value is added to the solution.
    Generically, the expression is definded as:

    .. math::

        \text{OutPoly}_{f, mod} |x_1 \rangle \dots |x_m \rangle |b \rangle
        = |x_1 \rangle \dots |x_m \rangle |b + f(x_1, \dots, x_m) \mod mod \rangle.

### `__init__`

```python
def __init__(self, polynomial_function, input_registers, output_wires: WiresLike, mod=None, work_wires: WiresLike=(), id=None, **kwargs)
```

Initialize the OutPoly class

### `compute_decomposition`

```python
def compute_decomposition(polynomial_function, input_registers, output_wires: WiresLike, mod=None, work_wires: WiresLike=(), **kwargs)
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.OutPoly.decomposition`.

**Example:**

.. code-block:: python

    from pprint import pprint

    ops = qp.OutPoly.compute_decomposition(
        lambda x, y: x + y,
        input_registers=[[0, 1],[2,3]],
        output_wires=[4, 5],
        mod=4,
        )
    pprint(ops)

.. code-block::

    [QFT(wires=[4, 5]),
    Controlled(PhaseAdder(wires=[4, 5]), control_wires=[3]),
    Controlled(PhaseAdder(wires=[4, 5]), control_wires=[2]),
    Controlled(PhaseAdder(wires=[4, 5]), control_wires=[1]),
    Controlled(PhaseAdder(wires=[4, 5]), control_wires=[0]),
    Adjoint(QFT(wires=[4, 5]))]
