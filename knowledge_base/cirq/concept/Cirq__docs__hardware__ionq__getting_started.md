---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/hardware/ionq/getting_started.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/hardware/ionq/getting_started.ipynb
license: Apache-2.0
---

# Getting Started with IonQ and Cirq

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/hardware/ionq/getting_started"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/hardware/ionq/getting_started.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/hardware/ionq/getting_started.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/hardware/ionq/getting_started.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

This notebook shows how to get up and running with the IonQ API.  As of February 2021, this API is limited to partners only. More information about partnerships can be found at [ionq.com/get-started](https://ionq.com/get-started).

To get started, first you must install Cirq. 

> NOTE: Currently this notebook requires the version of Cirq 0.10 or higher.

```python
try:
    import cirq

    version = cirq.__version__.split(".")
    assert int(version[0]) > 0 or int(version[1]) > 9, "Cirq version >0.9 required"
except (ImportError, AssertionError):
    print("Installing Cirq...")
    !pip install --quiet cirq
    print("Cirq installed.")
```

Given that the above cell runs, you have installed Cirq and imported it.  To simplify using the ionq api it is also suggested that you import ionq. Notice how nice it is that cirq and ionq are four letter words ending in "q".

```python
import cirq
import cirq_ionq as ionq
```

## Constructing an IonQ Service object

The main object that you use to access the IonQ API is an instance of the `cirq_ionq.Service` class.  To construct this you need an API key. Both should be supplied to partners. Please be careful when using notebooks and version control to not save your API key in a public location!

Given these bits of information you get a service object by simply running

```python
API_KEY = 'tomyheart'  # Replace with your IonQ API key

service = ionq.Service(api_key=API_KEY, default_target='simulator')
```

Note that we have set the `default_target` to `simulator`.  The other option would be to set it to `qpu`.

## Running a simple circuit

The IonQ API supports a limited set of gates natively.  Circuit built with these gates do not need any modification and can be run directly against the API.  For a list of the API supported gates see [circuit documentation](./circuits.md).  One supported gate is the square root of not gate, which we use here in conjunction with a controlled-not gate. The following cell will run the circuit below, blocking until the program has run and results have been returned:

```python
q0, q1 = cirq.LineQubit.range(2)
circuit = cirq.Circuit(
    cirq.X(q0) ** 0.5,  # Square root of X
    cirq.CX(q0, q1),  # CNOT
    cirq.measure(q0, q1, key='b'),  # Measure both qubits
)
result = service.run(circuit, repetitions=100)
print(result)
```

Because we did not specify a `target` and we ran this against a service with `default_target='simulator'`, this ran against the simulator. To run against the QPU simply add the target to the `run` method (note that this may take a while since the queue for the qpu is much longer than that for the simulator):

```python
result = service.run(circuit, repetitions=100, target='qpu')
print(result)
```

## Jobs

In the above section, the `run` method blocked on awaiting the program to run and return results. A different pattern is to asynchronously create jobs, which return an id that they can be used to identify the job, and fetch the results at a later time.

```python
job = service.create_job(circuit, repetitions=100)
job_id = job.job_id()
print(f'Job id: {job_id}')
```

Given the `job` object above, you can check on the status of the job

```python
print(f'Status: {job.status()}')
```

Or if you only have the job id, you can use this to get the job and create a new `cirq_ionq.Job` object to query.

```python
same_job = service.get_job(job_id=job_id)
print(f'Status: {same_job.status()}')
```

To get the results from the job, you can get the results of the job using the `results()` method.  Note, however that this will block if the job is not completed, polling until the status is `completed`.

```python
results = same_job.results()
print(results)
```

Note that the results are not `cirq.Result`. To convert these to a `cirq.Result`, you can use `to_cirq_result()`

```python
print(results.to_cirq_result())
```

## Next steps

Check out the documentation on fully using the Cirq IonQ integration

[Learn how to build circuits for the API](./circuits.md)

[How to use the service API](./jobs.md)

[Learn how to query the performance of a processor by accessing IonQ calibrations](./calibrations.md)
