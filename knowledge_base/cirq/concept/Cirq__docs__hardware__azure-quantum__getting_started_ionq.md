---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/hardware/azure-quantum/getting_started_ionq.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/hardware/azure-quantum/getting_started_ionq.ipynb
license: Apache-2.0
---

# Getting started with IonQ and Cirq on Azure Quantum
<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/hardware/azure-quantum/getting_started_ionq"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/hardware/azure-quantum/getting_started_ionq.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/hardware/azure-quantum/getting_started_ionq.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/hardware/azure-quantum/getting_started_ionq.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

This notebooks shows how to send a basic quantum circuit to an IonQ target via Azure Quantum.

## Prerequisites

- To work in Azure Quantum, you need an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).
- Create an Azure Quantum workspace and enable IonQ. For more information, see [Create an Azure Quantum workspace](https://docs.microsoft.com/azure/quantum/quickstart-microsoft-qc?pivots=platform-ionq#create-an-azure-quantum-workspace).

First, install `azure-quantum` with the Cirq dependencies:

```python
!pip install 'azure-quantum[cirq]' --quiet
```

## Connecting to the Azure Quantum service

To connect to the Azure Quantum service, find the resource ID and location of your Workspace from the Azure Quantum portal here: https://portal.azure.com. Navigate to your Azure Quantum workspace and copy the values from the header.

<img src="azure-quantum-resource-id.png">

Paste the values into the `AzureQuantumService` constructor below to create a `service` that connects to your Azure Quantum Workspace. Optionally, specify a default target:

```python
from azure.quantum.cirq import AzureQuantumService

service = AzureQuantumService(resource_id="", location="", default_target="ionq.simulator")
```

### List all IonQ targets

You can now list all the targets that you have access to, including the current queue time and availability. To only return the IonQ provider's targets, you can specify the optional `provider_id` input argument:

```python
service.targets(provider_id="ionq")
```

To read more about the Simulator and QPU specifications such as number of qubits, connectivity, system time scales and fidelities, you can check out the [IonQ Provider Reference](https://docs.microsoft.com/azure/quantum/provider-ionq).

## Run a simple circuit

Let's create a simple Cirq circuit to run. This circuit uses the square root of X gate, native to the IonQ hardware system.

```python
import cirq

q0, q1 = cirq.LineQubit.range(2)
circuit = cirq.Circuit(
    cirq.X(q0) ** 0.5,  # Square root of X
    cirq.CX(q0, q1),  # CNOT
    cirq.measure(q0, q1, key='b'),  # Measure both qubits
)
circuit
```

You can now run the program via the Azure Quantum service and get the result. The following cell will submit a job that runs the circuit with 100 repetitions, wait until the job is completed and return the results.

```python
result = service.run(program=circuit, repetitions=100)
```

This returns a `cirq.Result` object.

```python
print(result)
```

### Run on IonQ QPU

#### Note: The time required to run a circuit on the QPU may vary depending on current queue times.

The previous job ran on the default simulator you specified, `"ionq.simulator"`. To run on the QPU, provide `"ionq.qpu"` as the `target` argument:

```python
result = service.run(
    program=circuit,
    repetitions=100,
    target="ionq.qpu",
    timeout_seconds=500,  # Set timeout to 500 seconds to accommodate current queue time on QPU
)
```

Again, this returns a `cirq.Result` object.

```python
print(result)
```

## Asynchronous model using Jobs

For long-running circuits, it can be useful to run them asynchronously. The `service.create_job` method returns a `Job`, which you can use to get the results after the job has run successfully.

```python
job = service.create_job(program=circuit, repetitions=100, target="ionq.simulator")
```

To check on the job status, use `job.status()`:

```python
job.status()
```

To wait for the job to be done and get the results, use the blocking call `job.results()`:

```python
result = job.results()
print(result)
```

This returns a `SimulatorResult` object that contains the state probabilities to represent the output. For instance, in the example above, you measure either "00" or "11". To get the probabilities for each bit string, use the `.probabilities()` method. This returns a dictionary where the keys are the classical register values:

```python
result.probabilities()
```

To convert this to a `cirq.Result` object, use `result.to_cirq_result()`:

```python
result.to_cirq_result()
```
