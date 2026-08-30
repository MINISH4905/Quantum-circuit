---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/qcircuit/qcircuit_pdf.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/qcircuit/qcircuit_pdf.py
license: Apache-2.0
---

## `circuit_to_pdf_using_qcircuit_via_tex`

```python
def circuit_to_pdf_using_qcircuit_via_tex(circuit: cirq.Circuit, filepath: str, pdf_kwargs=None, qcircuit_kwargs=None, clean_ext=('dvi', 'ps'), documentclass='article') -> None
```

Compiles the QCircuit-based latex diagram of the given circuit.

Args:
    circuit: The circuit to produce a pdf of.
    filepath: Where to output the pdf.
    pdf_kwargs: The arguments to pass to generate_pdf.
    qcircuit_kwargs: The arguments to pass to
        circuit_to_latex_using_qcircuit.
    clean_ext: The file extensions to clean up after compilation. By
        default, latexmk is used with the '-pdfps' flag, which produces
        intermediary dvi and ps files.
    documentclass: The documentclass of the latex file.

Raises:
    OSError, IOError: If cleanup fails.
