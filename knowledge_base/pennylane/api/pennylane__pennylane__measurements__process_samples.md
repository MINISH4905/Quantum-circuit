---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/measurements/process_samples.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/measurements/process_samples.py
license: Apache-2.0
---

## Module `pennylane/measurements/process_samples.py`

A helper method for processing raw samples.

## `process_raw_samples`

```python
def process_raw_samples(mp: MeasurementProcess, samples: TensorLike, wire_order: WiresLike, shot_range: Sequence[int], bin_size: int, dtype=None) -> TensorLike
```

Slice the samples for a measurement process.

Args:
    mp (MeasurementProcess): the measurement process containing the wires, observable, and mcms for the processing
    samples (TensorLike): the raw samples
    wire_order (WiresLike): the wire order for the raw samples
    shot_range (tuple[int]): 2-tuple of integers specifying the range of samples
        to use. If not specified, all samples are used.
    bin_size (int): Divides the shot range into bins of size ``bin_size``, and
        returns the measurement statistic separately over each bin. If not
        provided, the entire shot range is treated as a single bin.
    dtype: The dtype of the samples returned by this measurement process.

This function matches `SampleMP.process_samples`, but does not have a dependence on the measurement process.
