---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/estimator_beta/estimate.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/estimator_beta/estimate.py
license: Apache-2.0
---

## Module `pennylane/labs/estimator_beta/estimate.py`

Core resource estimation logic.

## `estimate`

```python
def estimate(workflow: Callable | ResourceOperator | Resources | QNode, gate_set: set[str] | None=None, zeroed_wires: int=0, any_state_wires: int=0, tight_wires_budget: bool=False, config: LabsResourceConfig | None=None) -> Resources | Callable[..., Resources]
```

Estimate the quantum resources required to implement a circuit or operator in terms of a given gateset.

This function improves upon the :func:`~.pennylane.estimator.estimate()` function in two main ways:

- Firstly, it uses a new system for wire tracking that more accurately estimates the number of auxiliary
  wires required for any quantum workflow.
- Secondly, this function uses the :class:`~.pennylane.labs.estimator_beta.resource_config.LabsResourceConfig`
  by default. As a result it comes preloaded with experimental and state of the art resource decompositions
  that lead to more optimal resource estimates.

Args:
    workflow (Callable | :class:`~.pennylane.estimator.resource_operator.ResourceOperator` | :class:`~.pennylane.estimator.resources_base.Resources` | :class:`~.Operator` | QNode):
        The quantum circuit or operator for which to estimate resources.
    gate_set (set[str] | None): A set of names (strings) of the fundamental operators to count
        throughout the quantum workflow. If not provided, the default gate set will be used,
        i.e., ``{'Toffoli', 'T', 'CNOT', 'X', 'Y', 'Z', 'S', 'Hadamard'}``.
    zeroed_wires (int): Number of work wires pre-allocated in the zeroed state. Default is ``0``.
    any_state_wires (int): Number of work wires pre-allocated in an unknown state. Default is ``0``.
    tight_wires_budget (bool): If True, extra work wires may not be allocated in addition to the pre-allocated ones. The default is ``False``.
    config (:class:`~.pennylane.labs.estimator_beta.resource_config.LabsResourceConfig` | None): Configurations for the resource estimation pipeline.

Returns:
    :class:`~.pennylane.estimator.resources_base.Resources` | Callable[..., :class:`~.pennylane.estimator.resources_base.Resources`]:
        The estimated quantum resources required to execute the circuit.

Raises:
    TypeError: If the ``workflow`` is of an invalid type.

**Example**

The resources of a quantum workflow can be estimated by supplying a quantum function describing
the workflow. The function can be written in terms of resource operators:

.. code-block:: python

    import pennylane.labs.estimator_beta as qre

    def circuit():
        qre.Hadamard()
        qre.CNOT()
        qre.QFT(num_wires=4)

>>> res = qre.estimate(circuit)()
>>> print(res)
--- Resources: ---
 Total wires: 4
   algorithmic wires: 4
   allocated wires: 0
     zero state: 0
     any state: 0
 Total gates : 816
   'T': 792,
   'CNOT': 19,
   'Hadamard': 5

The resource estimation can be performed with respect to an alternative gate set:

>>> res = qre.estimate(circuit, gate_set={"RX", "RZ", "Hadamard", "CNOT"})()
>>> print(res)
--- Resources: ---
 Total wires: 4
   algorithmic wires: 4
   allocated wires: 0
     zero state: 0
     any state: 0
 Total gates : 42
   'RZ': 18,
   'CNOT': 19,
   'Hadamard': 5

.. details::
    :title: Usage Details

    Most PennyLane operators have a corresponding resource operator defined in the ``pennylane.estimator``
    module. The resource operator is a lightweight representation of an operator that contains the
    minimum information required to perform resource estimation. For most basic operators, it is simply
    the type of the operator. For more complex operators and templates, you may be required to provide
    more information as specified in the operator's ``resource_params``, such as the number of wires.

    .. code-block:: python

        import pennylane.labs.estimator_beta as qre

        def circuit():
            qre.CNOT()
            qre.MultiRZ(num_wires=3)
            qre.CNOT()
            qre.MultiRZ(num_wires=3)

    >>> res = qre.estimate(circuit)()
    >>> print(res)
    --- Resources: ---
     Total wires: 3
       algorithmic wires: 3
       allocated wires: 0
         zero state: 0
         any state: 0
     Total gates : 98
       'T': 88,
       'CNOT': 10

    The ``estimate`` function returns a :class:`~pennylane.estimator.resources_base.Resources`
    object, which contains an estimate of the total number of gates (after decomposing to the
    fundamental gate set) and the total number of wires that the gates in this circuit act on
    (i.e., the "algorithmic wires"). When explicit wire labels are not provided, the operators
    are assumed to be overlapping, which may lead to an underestimate. For a more accurate
    estimate of the number of wires used by a circuit, you may optionally provide explicit
    wire labels via the ``wires`` argument:

    .. code-block:: python

        import pennylane.labs.estimator_beta as qre

        def circuit():
            qre.CNOT()
            qre.MultiRZ(wires=[0, 1, 2])
            qre.CNOT()
            qre.MultiRZ(wires=[2, 3, 4])

    >>> res = qre.estimate(circuit)()
    >>> print(res)
    --- Resources: ---
     Total wires: 7
       algorithmic wires: 7
       allocated wires: 0
         zero state: 0
         any state: 0
     Total gates : 98
       'T': 88,
       'CNOT': 10

    For a detailed explanation of the "allocated wires", see the "Dynamic work wire allocation
    in decompositions" section below.

.. details::
    :title: Dynamic work wire allocation in decompositions

    Some operators require additional auxiliary wires (work wires) to decompose. These wires
    are not part of the operator's definition, so they will be dynamically allocated when
    performing the operator's decomposition. The ``estimate`` function also tracks the usage
    of these dynamically allocated wires.

    .. code-block:: python

        import pennylane.labs.estimator_beta as qre

        def circuit():
            qre.Hadamard()
            qre.CNOT()
            qre.AliasSampling(num_coeffs=3)

    >>> res = qre.estimate(circuit)()
    >>> print(res)
    --- Resources: ---
     Total wires: 123
       algorithmic wires: 2
       allocated wires: 121
         zero state: 58
         any state: 63
     Total gates : 1.150E+3
       'Toffoli': 64,
       'T': 88,
       'CNOT': 589,
       'X': 192,
       'Hadamard': 217

    In the above example, a total of 121 work wires were allocated (in the zeroed state) to
    perform the decomposition of the ``AliasSampling``, 58 of which were restored to the
    original zeroed state before deallocation, and the rest were deallocated in an unknown
    state. You may also pre-allocate work wires:

    >>> res = qre.estimate(circuit, zeroed_wires=150)()
    >>> print(res)
    --- Resources: ---
     Total wires: 152
       algorithmic wires: 2
       allocated wires: 150
         zero state: 87
         any state: 63
     Total gates : 1.150E+3
       'Toffoli': 64,
       'T': 88,
       'CNOT': 589,
       'X': 192,
       'Hadamard': 217

    In this case, you have the option to treat this pre-allocated pool of work wires as the
    only work wires available, by setting ``tight_wires_budget=True``, then an error is
    raised if the required number of wires exceeds the number of pre-allocated wires.

.. details::
    :title: Estimate the resources of a standard PennyLane circuit

    The ``estimate`` function can also be used to estimate the resources of a standard PennyLane circuit.

    .. code-block:: python

        import pennylane as qp
        import pennylane.labs.estimator_beta as qre

        @qp.qnode(qp.device("default.qubit"))
        def circuit():
            qp.Hadamard(0)
            qp.CNOT(wires=[0, 1])
            qp.QFT(wires=[0, 1, 2, 3])

    >>> res = qre.estimate(circuit)()
    >>> print(res)
    --- Resources: ---
     Total wires: 4
       algorithmic wires: 4
       allocated wires: 0
         zero state: 0
         any state: 0
     Total gates : 816
       'T': 792,
       'CNOT': 19,
       'Hadamard': 5
