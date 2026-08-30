---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/simulate/virtual_engine_interface.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/simulate/virtual_engine_interface.ipynb
license: Apache-2.0
---

##### Copyright 2022 The Cirq Developers

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

# Quantum Virtual Engine

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/simulate/virtual_engine_interface"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/simulate/virtual_engine_interface.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/simulate/virtual_engine_interface.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/simulate/virtual_engine_interface.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

Cirq provides the [Quantum Virtual Machine](./quantum_virtual_machine.ipynb), which consists of two components: 
- The Quantum Virtual Engine: A class that implements the same interface as `cirq_google.Engine`, allowing you to simulate circuits with the same software interface that the real hardware uses. 
- Realistic noise models that mimic the behavior of real quantum hardware.

This tutorial covers the former of the two components, the Quantum Virtual Engine, and how to run circuits on existing and custom virtual processor models.

## Setup

```python
try:
    import cirq
    import cirq_google
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq
    print("installed cirq.")
    import cirq
    import cirq_google

import sympy
```

Communication with real quantum hardware in Cirq is done through the `cirq_google.Engine` class. Each `Engine` can contain multiple quantum processors, and the `Engine` class provides functions to run circuits and manage jobs sent to those processors. The Virtual Engine in Cirq is an instance of the class `cirq_google.SimulatedLocalEngine` that runs circuits on the built-in Cirq [Simulator](./simulation.ipynb) instead of on hardware, but uses the same interface as `Engine`. This is useful for testing your circuit and code pipeline before running on actual hardware, and can be used as a substitute when the real hardware is not available.

The interface implemented by both `cirq_google.Engine` and `cirq_google.SimulatedLocalEngine` is called `cirq_google.AbstractEngine`, and defines the various functions and types involved with using either option. When writing functions of your own, this interface enables you to seamlessly support simulated and real-hardware versions of the `Engine` interface.

## Instantiate a virtual Engine

The easiest way to create a `cirq_google.SimulatedLocalEngine` is to make one from one or more processor templates. 
Example processor device specifications can be found in 
the [devices/specifications](https://github.com/quantumlib/Cirq/tree/main/cirq-google/cirq_google/devices/specifications) folder of `cirq_google` in the Cirq GitHub repository.  These device specifications closely match previous versions of Google quantum hardware, and can serve as templates for processors in a `SimulatedLocalEngine`. When Google hardware becomes publicly available again in the future, it will have device specifications like these that differ in details, but not in format.

You can create a `cirq_google.SimulatedLocalEngine` that includes these example device specifications using `cirq_google.engine.create_noiseless_virtual_engine_from_latest_templates()`.  For example:

```python
engine = cirq_google.engine.create_noiseless_virtual_engine_from_latest_templates()
```

You can then use this Engine object to perform operations as if it included real hardware.  However, all interactions will be local and mocked with these example processors.  Program execution will be done by the Cirq Simulator.

For instance, you can list the processors and their device layouts, which are the same as those specified in the `devices/specification` folder:

```python
for proc in engine.list_processors():
    print(proc.processor_id)
    print('-----------------')
    print(proc.get_device())
    print('\n\n\n')
```

## Run circuits and sweeps

After creating the `SimulatedLocalEngine`, you can use any function that you might use with a normal `Engine` that has real quantum processors in it. Most importantly, this includes the ability to run circuits.

```python
# Choose one of the (simulated) processors to run on.
weber = engine.get_processor('weber')
sampler = weber.get_sampler()

# Run a simple circuit for ten repetitions
result = sampler.run(cirq.Circuit(cirq.measure(cirq.GridQubit(7, 2))), repetitions=10)
print(result)
```

Note that, even though this is a simulated processor device, there are still device constraints that must be met by a circit in order for it to be executed. For example, the gates and qubits used by the circuit must be supported by the device:

```python
# Weber does not have a (7, 1) qubit.
try:
    sampler.run(cirq.Circuit(cirq.measure(cirq.GridQubit(7, 1))), repetitions=10)
except ValueError as e:
    print(e)
```

You can also run [Parameter Sweeps](./params.ipynb) with the `run_sweep` function, which returns a `cirq.Job`-type object instead of a `Result`. This way, jobs can be prepared and run asynchronously. When running a parameter sweep over many parameter options, or with particularly large circuits, it can be useful to set the job running and return for the results later, with the ability to check job execution status in between.

```python
qubit = cirq.GridQubit(7, 2)
circuit = cirq.Circuit(cirq.X(qubit) ** sympy.Symbol('t'), cirq.measure(qubit, key='m'))
job = weber.run_sweep(circuit, params=cirq.Linspace('t', 0, 2, 20), repetitions=1000)
print(f'job is type {type(job)}')
print(f'job has id {job.id()} and status {job.execution_status()}')
print('')

print('Now executing results!')
results = job.results()
print('')
print(f'job has id {job.id()} and status {job.execution_status()}')

print('')
print('Results:')
for result in results:
    print(result.histogram(key='m'))
```

## Reservations and scheduling

Other functions are available to `Engine` classes that are part of using the `Engine` as a service. These include reservations, scheduling, downtime, and others. These functions are also available with the virtual processors, though all of them will generally succeed since there are no other users using the virtual service.

```python
print(f'Next expected downtime: {weber.expected_down_time()}')
print(f'Next expected recovery: {weber.expected_recovery_time()}')

# Creating two example reservations
import datetime

now = datetime.datetime.now()
hour = datetime.timedelta(hours=1)
try:
    weber.create_reservation(start_time=now, end_time=now + hour)
    weber.create_reservation(
        start_time=now + 2 * hour,
        end_time=now + 3 * hour,
        allowlisted_users=['mysterious_fake_user@nonexistentwebsite.domain'],
    )
except ValueError as e:
    # If you re-run this cell, it will note that you already have a reservation
    print('Cannot reserve time, did you already reserve it?  Error:')
    print(e)

print('')
print('Reservations:')
print('---------------')
print(f'{weber.list_reservations()}')
```

The processor also comes with a stock calibration metric report. By default, all of the error values are zero.

```python
print('Calibrations:')
print('---------------')
calibration = weber.list_calibrations()[0]
print(f"Calibration metrics: \n    {list(calibration.keys())}")
# Example calibration data
for metric in ["single_qubit_p00_error", "two_qubit_sycamore_gate_xeb_average_error_per_cycle"]:
    print(metric)
    data = calibration[metric]
    # Only print the first couple qubits/qubit pairs
    for key in list(data.keys())[:3]:
        print(f'   {key}: {data[key]}')
```

## Create a custom processor from a device

You can also create processors to mimic other devices as needed.  Each of these classes is customizable and can be modified to suit your simulation needs.

You can create processors from existing devices, like `cirq_google.Sycamore`, with `cirq_google.engine.create_noiseless_virtual_engine_from_device`:

```python
sycamore_engine = cirq_google.engine.create_noiseless_virtual_engine_from_device(
    'sycamore', cirq_google.Sycamore
)

# Note that the previous function creates an engine with just one processor
print([proc.processor_id for proc in sycamore_engine.list_processors()])
print(sycamore_engine.get_processor('sycamore').get_device())
```

## Create a custom processor from a specification

You can also create virtual engines from device specifications written in the [Protocol Buffer](https://developers.google.com/protocol-buffers) structured-data file format. This allows for detailed custom device creation, in the case where you want to see how a slightly modified existing device, or a completely new device, would work in Cirq.

The previous specification files mentioned in the [devices/specifications](https://github.com/quantumlib/Cirq/tree/main/cirq-google/cirq_google/devices/specifications) in the Cirq repository are already in this file format. The details of this format are subject to change as Cirq is updated, but it is designed to be human-readable. If you want to work with a very custom device, the best place to start is by inspecting one of these files, but be aware that the format may change without notice.

```python
import importlib
from cirq_google.devices import specifications

# Get the processor identifier and file location from MOST_RECENT_TEMPLATES.
processor_id, template_name = next(
    iter(cirq_google.engine.virtual_engine_factory.MOST_RECENT_TEMPLATES.items())
)
# Read the protobuf template.
device_str = importlib.resources.files(specifications).joinpath(template_name).read_text()
# Print just the first 10 lines of the very long protobuf specification.
print(f'Processor: {processor_id}')
print('\n'.join(device_str.splitlines()[:10]))
print('...')
```

In order to use this specification protobuf file string, parse it with `google.protobuf.text_format` and create the `SimulatedLocalEngine` with `cirq_google.engine.create_noiseless_virtual_engine_from_proto`.

```python
import google.protobuf.text_format as text_format

# Import the spec.
device_spec = cirq_google.api.v2.device_pb2.DeviceSpecification()
text_format.Parse(device_str, device_spec)
four_engine = cirq_google.engine.create_noiseless_virtual_engine_from_proto(
    processor_id, device_spec
)
# Prepare a sampler.
print([proc.processor_id for proc in four_engine.list_processors()])
processor = four_engine.get_processor(processor_id)
print(processor.get_device())
sampler = processor.get_sampler()

q1_1 = cirq.GridQubit(1, 1)
q1_2 = cirq.GridQubit(1, 2)
q2_1 = cirq.GridQubit(2, 1)
# Run a circuit with one each of Z, CZ, Measure, and CircuitOperation.
circuit = cirq.Circuit(
    cirq.CircuitOperation(cirq.FrozenCircuit(cirq.Z(q2_1), cirq.CZ(q1_1, q1_2))),
    cirq.measure(q1_1),
    cirq.measure(q2_1),
)
print('results', '\n')
try:
    print(sampler.run(circuit))
except ValueError as e:
    print(e)
```

# Summary

Cirq provides the `cirq.SimulatedLocalEngine`. which allows you to run circuits on the Cirq Simulator through the same interface as the `cirq.Engine` object, which is used for running on real quantum hardware. This is useful both as a preparation step before running on real quantum hardware, and as a substitute when real hardware is unavailable.

As presented in this page, the virtual Engine is completely noiseless. In order to learn about using the virtual Engine with noise models, including realistic noise models which closely mimic actual hardware, see the [Quantum Virtual Machine](./quantum_virtual_machine.ipynb) page.
