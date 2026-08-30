---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qaoa/layers.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qaoa/layers.py
license: Apache-2.0
---

## Module `pennylane/qaoa/layers.py`

Methods that define cost and mixer layers for use in QAOA workflows.

## `cost_layer`

```python
def cost_layer(gamma, hamiltonian)
```

Applies the QAOA cost layer corresponding to a cost Hamiltonian.

For the cost Hamiltonian :math:`H_C`, this is defined as the following unitary:

.. math:: U_C \ = \ e^{-i \gamma H_C}

where :math:`\gamma` is a variational parameter.

Args:
    gamma (int or float): The variational parameter passed into the cost layer
    hamiltonian (.Hamiltonian): The cost Hamiltonian

Raises:
    ValueError: if the terms of the supplied cost Hamiltonian are not exclusively products of diagonal Pauli gates

.. details::
    :title: Usage Details

    We first define a cost Hamiltonian:

    .. code-block:: python3

        from pennylane import qaoa
        import pennylane as qp

        cost_h = qp.Hamiltonian([1, 1], [qp.Z(0), qp.Z(0) @ qp.Z(1)])

    We can then pass it into ``qaoa.cost_layer``, within a quantum circuit:

    .. code-block:: python

        dev = qp.device('default.qubit', wires=2)

        @qp.qnode(dev)
        def circuit(gamma):

            for i in range(2):
                qp.Hadamard(wires=i)

            qaoa.cost_layer(gamma, cost_h)

            return [qp.expval(qp.Z(i)) for i in range(2)]

    which gives us a circuit of the form:

    >>> print(qp.draw(circuit)(0.5))
    0: ──H─╭ApproxTimeEvolution(1.00,1.00,0.50)─┤  <Z>
    1: ──H─╰ApproxTimeEvolution(1.00,1.00,0.50)─┤  <Z>
    >>> print(qp.draw(circuit, level="device")(0.5))
    0: ──H──RZ(1.00)─╭RZZ(1.00)─┤  <Z>
    1: ──H───────────╰RZZ(1.00)─┤  <Z>

## `mixer_layer`

```python
def mixer_layer(alpha, hamiltonian)
```

Applies the QAOA mixer layer corresponding to a mixer Hamiltonian.

For a mixer Hamiltonian :math:`H_M`, this is defined as the following unitary:

.. math:: U_M \ = \ e^{-i \alpha H_M}

where :math:`\alpha` is a variational parameter.

Args:
    alpha (int or float): The variational parameter passed into the mixer layer
    hamiltonian (.Hamiltonian): The mixer Hamiltonian

.. details::
    :title: Usage Details

    We first define a mixer Hamiltonian:

    .. code-block:: python3

        from pennylane import qaoa
        import pennylane as qp

        mixer_h = qp.Hamiltonian([1, 1], [qp.X(0), qp.X(0) @ qp.X(1)])

    We can then pass it into ``qaoa.mixer_layer``, within a quantum circuit:

    .. code-block:: python

        dev = qp.device('default.qubit', wires=2)

        @qp.qnode(dev)
        def circuit(alpha):

            for i in range(2):
                qp.Hadamard(wires=i)

            qaoa.mixer_layer(alpha, mixer_h)

            return [qp.expval(qp.Z(i)) for i in range(2)]

    which gives us a circuit of the form:

    >>> print(qp.draw(circuit)(0.5))
    0: ──H─╭ApproxTimeEvolution(1.00,1.00,0.50)─┤  <Z>
    1: ──H─╰ApproxTimeEvolution(1.00,1.00,0.50)─┤  <Z>
    >>> print(qp.draw(circuit, level="device")(0.5))
    0: ──H──RX(1.00)─╭RXX(1.00)─┤  <Z>
    1: ──H───────────╰RXX(1.00)─┤  <Z>
