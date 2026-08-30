---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/hardware/pasqal/access.md
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/hardware/pasqal/access.md
license: Apache-2.0
---

# Access and Authentication

Pasqal's API is not yet open for public access. In case you're interested, contact
us through our [website](https://pasqal.io/contact/) to request access.

## API Access

Pasqal's API uses token-based authentication. If you have a valid token, use it when
submitting your circuit through the `PasqalSampler` class. For more information on
this, visit [Pasqal Sampler](sampler.md).


## Next Steps

Access to Pasqal's API is not required for using Cirq to create quantum circuits
specifically tailored for our devices.

Regardless of whether you have access or not, you can start playing around with Pasqal's classes with the
tutorial [Quantum Circuits on Pasqal Devices](./getting_started.ipynb).
