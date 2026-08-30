---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/one_qubit/one_qubit_decompose.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/one_qubit/one_qubit_decompose.py
license: Apache-2.0
---

## Module `qiskit/synthesis/one_qubit/one_qubit_decompose.py`

Decompose a single-qubit unitary via Euler angles.

## `OneQubitEulerDecomposer`

```python
class OneQubitEulerDecomposer
```

A class for decomposing 1-qubit unitaries into Euler angle rotations.

The resulting decomposition is parameterized by 3 Euler rotation angle
parameters :math:`(\theta, \phi, \lambda)`, and a phase parameter
:math:`\gamma`. The value of the parameters for an input unitary depends
on the decomposition basis. Allowed bases and the resulting circuits are
shown in the following table. Note that for the non-Euler bases (:math:`U3`,
:math:`U1X`, :math:`RR`), the :math:`ZYZ` Euler parameters are used.

.. list-table:: Supported circuit bases
    :widths: auto
    :header-rows: 1

    * - Basis
      - Euler Angle Basis
      - Decomposition Circuit
    * - 'ZYZ'
      - :math:`Z(\phi) Y(\theta) Z(\lambda)`
      - :math:`e^{i\gamma} R_Z(\phi).R_Y(\theta).R_Z(\lambda)`
    * - 'ZXZ'
      - :math:`Z(\phi) X(\theta) Z(\lambda)`
      - :math:`e^{i\gamma} R_Z(\phi).R_X(\theta).R_Z(\lambda)`
    * - 'XYX'
      - :math:`X(\phi) Y(\theta) X(\lambda)`
      - :math:`e^{i\gamma} R_X(\phi).R_Y(\theta).R_X(\lambda)`
    * - 'XZX'
      - :math:`X(\phi) Z(\theta) X(\lambda)`
      - :math:`e^{i\gamma} R_X(\phi).R_Z(\theta).R_X(\lambda)`
    * - 'U3'
      - :math:`Z(\phi) Y(\theta) Z(\lambda)`
      - :math:`e^{i\gamma} U_3(\theta,\phi,\lambda)`
    * - 'U321'
      - :math:`Z(\phi) Y(\theta) Z(\lambda)`
      - :math:`e^{i\gamma} U_3(\theta,\phi,\lambda)`
    * - 'U'
      - :math:`Z(\phi) Y(\theta) Z(\lambda)`
      - :math:`e^{i\gamma} U_3(\theta,\phi,\lambda)`
    * - 'PSX'
      - :math:`Z(\phi) Y(\theta) Z(\lambda)`
      - :math:`e^{i\gamma} U_1(\phi+\pi).R_X\left(\frac{\pi}{2}\right).`
        :math:`U_1(\theta+\pi).R_X\left(\frac{\pi}{2}\right).U_1(\lambda)`
    * - 'ZSX'
      - :math:`Z(\phi) Y(\theta) Z(\lambda)`
      - :math:`e^{i\gamma} R_Z(\phi+\pi).\sqrt{X}.`
        :math:`R_Z(\theta+\pi).\sqrt{X}.R_Z(\lambda)`
    * - 'ZSXX'
      - :math:`Z(\phi) Y(\theta) Z(\lambda)`
      - :math:`e^{i\gamma} R_Z(\phi+\pi).\sqrt{X}.R_Z(\theta+\pi).\sqrt{X}.R_Z(\lambda)`
        or
        :math:`e^{i\gamma} R_Z(\phi+\pi).X.R_Z(\lambda)`
    * - 'U1X'
      - :math:`Z(\phi) Y(\theta) Z(\lambda)`
      - :math:`e^{i\gamma} U_1(\phi+\pi).R_X\left(\frac{\pi}{2}\right).`
        :math:`U_1(\theta+\pi).R_X\left(\frac{\pi}{2}\right).U_1(\lambda)`
    * - 'RR'
      - :math:`Z(\phi) Y(\theta) Z(\lambda)`
      - :math:`e^{i\gamma} R\left(-\pi,\frac{\phi-\lambda+\pi}{2}\right).`
        :math:`R\left(\theta+\pi,\frac{\pi}{2}-\lambda\right)`

.. automethod:: __call__

### `__init__`

```python
def __init__(self, basis: str='U3', use_dag: bool=False)
```

Initialize decomposer

Supported bases are: ``'U'``, ``'PSX'``, ``'ZSXX'``, ``'ZSX'``, ``'U321'``, ``'U3'``,
``'U1X'``, ``'RR'``, ``'ZYZ'``, ``'ZXZ'``, ``'XYX'``, ``'XZX'``.

Args:
    basis: the decomposition basis [Default: ``'U3'``]
    use_dag: If true the output from calls to the decomposer
        will be a :class:`~qiskit.dagcircuit.DAGCircuit` object instead of
        :class:`~qiskit.circuit.QuantumCircuit`.

Raises:
    QiskitError: If input basis is not recognized.

### `build_circuit`

```python
def build_circuit(self, gates, global_phase) -> QuantumCircuit | DAGCircuit
```

Return the circuit or dag object from a list of gates.

### `__call__`

```python
def __call__(self, unitary: Operator | Gate | np.ndarray, simplify: bool=True, atol: float=DEFAULT_ATOL) -> QuantumCircuit | DAGCircuit
```

Decompose single qubit gate into a circuit.

Args:
    unitary: 1-qubit unitary matrix
    simplify: reduce gate count in decomposition [Default: True].
    atol: absolute tolerance for checking angles when simplifying
                 returned circuit [Default: 1e-12].

Returns:
    QuantumCircuit: the decomposed single-qubit gate circuit

Raises:
    QiskitError: if input is invalid or synthesis fails.

### `basis`

```python
def basis(self)
```

The decomposition basis.

### `basis`

```python
def basis(self, basis)
```

Set the decomposition basis.

### `angles`

```python
def angles(self, unitary: np.ndarray) -> tuple
```

Return the Euler angles for input array.

Args:
    unitary: :math:`2\times2` unitary matrix.

Returns:
    tuple: ``(theta, phi, lambda)``.

### `angles_and_phase`

```python
def angles_and_phase(self, unitary: np.ndarray) -> tuple
```

Return the Euler angles and phase for input array.

Args:
    unitary: :math:`2\times2`

Returns:
    tuple: ``(theta, phi, lambda, phase)``.
