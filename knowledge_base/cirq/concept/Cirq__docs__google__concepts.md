---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/google/concepts.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/google/concepts.ipynb
license: Apache-2.0
---

##### Copyright 2020 The Cirq Developers

```python
# @title Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
```

# Google Quantum Computing Service

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/google/concepts"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/google/concepts.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/google/concepts.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/google/concepts.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

```python
try:
    import cirq
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq
    print("installed cirq.")
    import cirq
```

*Run quantum computing programs on Google’s quantum processors*

Quantum Computing Service gives customers access to Google's quantum computing hardware.  Programs that are written in Cirq, an open-source quantum computing program language, can be sent to run on a quantum computer in Google’s quantum computing lab in Santa Barbara, CA. You will be able to do  arbitrary single qubit rotations as well as several choices of two qubit gates.  Measurements of all qubits as a final step are also supported. 

**Access is currently only granted to those on an approved list.** No public access to the service is available at this time.

## Concepts

Quantum Computing Service uses Cirq, an open source Python framework for creating quantum programs and running them against real quantum computers.  Here we provide a conceptual overview of how to run a quantum program on a quantum processor.

### Circuits

The language of quantum computing is the quantum circuit model.  Cirq is our open source framework which allows one to write a quantum circuit model in Python.  To learn more about Cirq itself, we recommend starting with the [Tutorial](../start/basics.ipynb).  Conceptually, Cirq can be thought of as a way to create a quantum circuit as an object in Python.  For example, we create a single circuit made up of square root of NOT gates, controlled-Z gates, and a measurement:

```python
q0, q1, q2 = cirq.GridQubit.rect(1, 3)
circuit = cirq.Circuit(
    (cirq.X**0.5).on_each(q0, q1, q2), cirq.CZ(q0, q1), cirq.CZ(q1, q2), cirq.measure(q2, key='m')
)
print(circuit)
```

### Quantum Engine API

Quantum Engine is the name of the cloud API which one can call to run the circuits you create in Cirq on quantum computers.  When access is enabled, users can call this API to run circuits on Google’s quantum hardware.  Read more about how to do this using Cirq's `Engine` class [here](./engine.md).

![Quantum Engine Conceptual Diagram](https://github.com/quantumlib/Cirq/blob/main/docs/images/engine_diagram.png?raw=1)

### Quantum Programs

In Cirq, one creates a `Circuit` in Python.  If one then wants to run it using Quantum Engine, one must then upload this Circuit to the Quantum Engine API.  The uploaded version of the Circuit is called a Program.  Programs are not the Python code itself, but a representation of the Circuit suitable for running on hardware.  The `Engine` class and its corresponding `sampler` will translate the circuit into the format needed by the API for you.  You will need to make sure that your circuit uses only gates and qubits compatible with the hardware.

![Quantum Program Conceptual Diagram](https://github.com/quantumlib/Cirq/blob/main/docs/images/engine_program.png?raw=1)

When you upload a program to Quantum Engine, the program is given a name.  The organizational unit of Quantum Engine is the cloud project (see below), so when you create a program it is identified by the project id and the program id.  We write this as a path

```
<PROJECT_ID>/programs/<PROGRAM_ID>
```

### Cloud Project

Quantum Engine interfaces with Google Cloud.  In Google Cloud, one can create different projects with different names.  It is typical to create one project for each experiment you run on the quantum computer, to keep data and access compartmentalized.  Everything under your cloud project can be seen by navigating to the Google Cloud console.  Here, for example, we see the programs that have been uploaded to a quantum projected called “Quantum Cloud Client”:

![Quantum Cloud Conceptual Diagram](https://github.com/quantumlib/Cirq/blob/main/docs/images/engine_cloud.png?raw=1)

See the [Getting Started](../tutorials/google/start.ipynb) guide for step-by-step instructions on how to create a project and enable the API.

### Jobs

Once a circuit has been uploaded as a program to Quantum Engine, you can run this program by creating a job.  When you create a job on Quantum Engine, the quantum engine then is responsible for routing your program and the information about the job to the appropriate quantum processor.  Note that there is a time limit for job length, so you will want to separate your programs into multiple jobs below this limit.

![Quantum Jobs Conceptual Diagram](https://github.com/quantumlib/Cirq/blob/main/docs/images/engine_job.png?raw=1)

Quantum Engine is designed so that you can upload a program once and then, if that program has different parameters (see below), you can run this program multiple times by creating multiple jobs for a given program.  Jobs are associated with programs, so they have names which include everything about your program, plus a job id:

```
<project id>/programs/<program id>/jobs/<job id>  
```

### Parameterized Circuits and Job Context

Circuits in Cirq can have quantum gates that are “parameterized”.  For example, a gate may represent a rotation of a qubit about the Z axis of the bloch sphere by an angle theta.  For a parameterized circuit, this angle theta is specified by a variable, such as “my-theta”.  In order to run such a circuit, you will need to be able to tell the circuit what value of “my-theta” should be supplied.  To do this, you create a sweep, or run context, that maps “my-theta” to a (list of) specific parameter values.

### Results

Once a job has been scheduled to run on a quantum processor, the machine returns the results of the program to the Quantum Engine.  The Quantum Engine stores these results.  Users can then query for these results:

![Quantum Results Conceptual Diagram](https://github.com/quantumlib/Cirq/blob/main/docs/images/engine_result.png?raw=1)

There is only one result for one job, so results can be identified via the identity of the job followed by result:

```
<project id>/programs/<program id>/jobs/<job id>/result
```

### Processors

When creating a job to run a program, one must specify where the job should run.  This can be a very specific machine to run on, or it can be specified more generally.  Each location that we can schedule a job to run on is described as a processor.  Different processors are available to different users, so processors appear under a project and have a processor id.

```
<project id>/processors/<processor id>
```

For example, one processor is the “rainbow” processor, which corresponds to a quantum computer located in Santa Barbara.

Processor have state associated with them.  For instance, a processor can be “online” or they can be in “maintenance” mode.

### Calibration Metrics

Processors that are quantum computers periodically undergo calibrations to maintain the quality of the programs that can be run on these processors.  During this calibration metrics about the performance of the quantum computer is collected.  This calibration data is stored by Quantum Engine and users can then query for the state of the calibration (one can ask for the latest calibration, or what the state of calibration was at a given point in time).  Calibrations are also available for past jobs.

Calibration metrics and can be retrieved via the console or via Cirq calls.  See more details on the [Calibration Metrics](./calibration.md) page.

### Reservations

Processor schedules are managed by a reservation system, assigning blocks of time as "time slots" with four possible states:

*  OPEN_SWIM: Anyone with processor access may run jobs.  There may be additional restrictions per processor that restrict large jobs.
*  MAINTENANCE: restrictions behave the same as during open swim, but there are no guarantees about the availability of the processor or quality of jobs run during this period.
*  RESERVATION: The processor is reserved for restricted use by a user or set of users. Reservations are rooted under a project and editors of that project may run jobs during that project's reservations while using any project they wish. Additional users may also be allowlisted to specific reservations.
*  UNALLOCATED: The processor has not been scheduled for any purpose. A reservation may be made during this time. If nothing is scheduled during this block, it will default to behaving as open swim.

During non-reservation times, jobs are restricted to run for at most 5 minutes and may have no more than 1,500,000 total shots on the processor.

The schedule of a processor is "frozen" for 4 hours into the immediate future so that users can rely on it for the coming day.

The ability to make reservations is restricted by budgets that are delegated by Quantum Computing Service admins.
