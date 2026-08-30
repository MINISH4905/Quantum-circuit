---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/hardware/azure-quantum/getting_started_honeywell.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/hardware/azure-quantum/getting_started_honeywell.ipynb
license: Apache-2.0
---

# Getting started with Honeywell and Cirq on Azure Quantum
<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/hardware/azure-quantum/getting_started_honeywell"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/hardware/azure-quantum/getting_started_honeywell.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/hardware/azure-quantum/getting_started_honeywell.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/hardware/azure-quantum/getting_started_honeywell.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

This notebook shows how to send a basic quantum circuit to a Honeywell target via Azure Quantum.

## Prerequisites

- To work in Azure Quantum, you need an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).
- Create an Azure Quantum workspace and enable Honeywell. For more information, see [Create an Azure Quantum workspace](https://docs.microsoft.com/azure/quantum/quickstart-microsoft-qc?pivots=platform-honeywell#create-an-azure-quantum-workspace).

First, install `azure-quantum` with the Cirq dependencies:

```python
!pip install 'azure-quantum[cirq]' --quiet
```

## Connecting to the Azure Quantum service

To connect to the Azure Quantum service, find the resource ID and location of your Workspace from the Azure Portal here: https://portal.azure.com. Navigate to your Azure Quantum Workspace and copy the values from the header.

<img src="azure-quantum-resource-id.png">

```python
from azure.quantum.cirq import AzureQuantumService

service = AzureQuantumService(
    resource_id="", location="", default_target="honeywell.hqs-lt-s1-apival"
)
```

### List all Honeywell targets

You can now list all the targets that you have access to, including the current queue time and availability. To only return the Honeywell provider's targets, you can specify the optional `provider_id` input argument:

```python
service.targets(provider_id="honeywell")
```

To read more about the Honeywell API validator and QPU specifications such as number of qubits, connectivity, system time scales and fidelities, you can check out the [Honeywell Provider Reference](https://docs.microsoft.com/azure/quantum/provider-honeywell).

## Run a simple circuit

Now, let's create a simple Cirq circuit to run.

```python
import cirq

q0, q1 = cirq.LineQubit.range(2)
circuit = cirq.Circuit(
    cirq.H(q0),  # Hadamard
    cirq.CNOT(q0, q1),  # CNOT
    cirq.measure(q0, q1, key='b'),  # Measure both qubits into classical register "b"
)
circuit
```

You can now run the program via the Azure Quantum service and get the result. The following cell will submit a job that runs the circuit with 100 repetitions, wait until the job is completed and return the results.

```python
result = service.run(program=circuit, repetitions=100)
```

This returns a `cirq.Result` object. Note that the API validator only returns zeros.

```python
print(result)
```

## Asynchronous workflow using Jobs

For long-running circuits, it can be useful to run them asynchronously. The `service.create_job` method returns a `Job`, which you can use to get the results after the job has run successfully.

```python
job = service.create_job(program=circuit, repetitions=100)
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

This returns a dictionary of lists. The dictionary keys are the name of the classical register prepended with `"m_"`, and the values are a list of bit strings that are measured for each repetition. Since here, in the `cirq` program measures the results for both qubits 0 and 1 into a register `"b"`, you can access the list of measurement results for those qubits with key `"m_b"`. Since here you ran the program with 100 repetitions, the length of the list should be 100:

```python
len(result["m_b"])
```
