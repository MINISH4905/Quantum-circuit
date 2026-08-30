---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/tutorials/google/colab.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/tutorials/google/colab.ipynb
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

# Notebook template

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/tutorials/google/colab"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/tutorials/google/colab.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/tutorials/google/colab.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/tutorials/google/colab.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

## Setup

```python
try:
    import cirq
    import cirq_google
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq-google
    print("installed cirq.")
    import cirq
    import cirq_google
```

## Make a copy of this template

You will need to have access to Quantum Computing Service before running this colab.

This notebook can serve as a starter kit for you to run programs on Google's quantum hardware.  You can download it using the directions below, open it in colab (or Jupyter), and modify it to begin your experiments.

## How to download iPython notebooks from GitHub

You can retrieve iPython notebooks in the Cirq repository by
going to the [docs/ directory](https://github.com/quantumlib/Cirq/tree/main/docs).  For instance, this Colab template is found [here](https://github.com/quantumlib/Cirq/blob/main/docs/tutorials/google/colab.ipynb). Select the file that you would like to download and then click the *Raw* button in the upper-right part of the window:

<img src="https://raw.githubusercontent.com/quantumlib/Cirq/main/docs/images/colab_github.png" alt="GitHub UI button to view raw file">

This will show the entire file contents.  Right-click and select *Save as* to save this file to your computer.  Make sure to save to a file with a `.ipynb` extension (you may need to select *All files* from the format dropdown instead of *text*). You can also get to this Colab's [raw content directly](https://raw.githubusercontent.com/quantumlib/Cirq/main/docs/tutorials/google/colab.ipynb)

You can also retrieve the entire Cirq repository by running the following command in a terminal that has `git` installed:

```
git clone https://github.com/quantumlib/Cirq.git
```

## How to open Google Colab

You can open a new Colab notebook from your Google Drive window or by visiting the [Colab site](https://colab.research.google.com/notebooks/intro.ipynb).  From the Colaboratory site, you can use the menu to upload an iPython notebook:

<img src="https://raw.githubusercontent.com/quantumlib/Cirq/main/docs/images/colab_upload.png" alt="Google Colab's upload notebook entry in File menu.">

This will upload the ipynb file that you downloaded before.  You can now run all the commands, modify it to suit your goals, and share it with others.

### More Documentation Links

* [Quantum Engine concepts](../../google/concepts.ipynb)
* [Quantum Engine documentation](../../google/engine.md)
* [Cirq documentation](https://quantumai.google/cirq)
* [Colab documentation](https://colab.research.google.com/notebooks/welcome.ipynb)

## Authenticate with Quantum Computing Service and install Cirq

For details of authentication and installation, please see [Get started with Quantum Computing Service](start.ipynb).

Note:  The below code will install the latest stable release of Cirq.  If you need the latest and greatest features and don't mind if a few things aren't quite working correctly, you can install the pre-release version of `cirq` using `pip install --upgrade cirq~=1.0.dev` instead of `pip install cirq` to get the most up-to-date features of Cirq.

1. Enter the Cloud project ID you'd like to use in the `project_id` field.
2. Then run the cell below (and go through the auth flow for access to the project id you entered).

<img src="https://raw.githubusercontent.com/quantumlib/Cirq/main/docs/images/run-code-block.png" alt="Quantum Engine console">

```python
# The Google Cloud Project id to use.
project_id = ''  # @param {type:"string"}
processor_id = ""  # @param {type:"string"}

from cirq_google.engine.qcs_notebook import get_qcs_objects_for_notebook

# For real engine instances, delete 'virtual=True' below.
qcs_objects = get_qcs_objects_for_notebook(project_id, processor_id, virtual=True)
engine = qcs_objects.engine
processor_id = qcs_objects.processor_id
```

## Create an Engine variable

The following creates an engine variable which can be used to run programs under the project ID you entered above.

```python
from google.auth.exceptions import DefaultCredentialsError
from google.api_core.exceptions import PermissionDenied

# Create an Engine object to use, providing the project id and the args
try:
    if qcs_objects.signed_in:  # This line only needed for colab testing.
        engine = cirq_google.get_engine()
    print(f"Successful authentication using project {project_id}!")
    print('Available Processors: ')
    print(engine.list_processors())
    print(f'Using processor: {processor_id}')
    processor = engine.get_processor(processor_id)
except DefaultCredentialsError as err:
    print("Could not authenticate to Google Quantum Computing Service.")
    print(" Tips: If you are using Colab: make sure the previous cell was executed successfully.")
    print(
        "       If this notebook is not in Colab (e.g. Jupyter notebook), make sure gcloud is installed and `gcloud auth application-default login` was executed."
    )
    print()
    print("Error message:")
    print(err)
except PermissionDenied as err:
    print(
        f"While you are authenticated to Google Cloud it seems the project '{project_id}' does not exist or does not have the Quantum Engine API enabled."
    )
    print("Error message:")
    print(err)
```

## Example

```python
# A simple example.
q = cirq.GridQubit(5, 2)
circuit = cirq.Circuit(cirq.X(q) ** 0.5, cirq.measure(q, key='m'))

job = processor.run_sweep(program=circuit, repetitions=1000)

results = [str(int(b)) for b in job.results()[0].measurements['m'][:, 0]]
print('Success!  Results:')
print(''.join(results))
```
