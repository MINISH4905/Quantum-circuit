---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/qasm3/printer.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/qasm3/printer.py
license: Apache-2.0
---

## Module `qiskit/qasm3/printer.py`

Printers for OpenQASM 3 AST nodes.

## `BasicPrinter`

```python
class BasicPrinter
```

An OpenQASM 3 AST visitor which writes the tree out in text mode to a stream, where the only
formatting is simple block indentation.

### `__init__`

```python
def __init__(self, stream: io.TextIOBase, *, indent: str, chain_else_if: bool=False, experimental: ExperimentalFeatures=ExperimentalFeatures(0))
```

Args:
    stream (io.TextIOBase): the stream that the output will be written to.
    indent (str): the string to use as a single indentation level.
    chain_else_if (bool): If ``True``, then constructs of the form::

            if (x == 0) {
                // ...
            } else {
                if (x == 1) {
                    // ...
                } else {
                    // ...
                }
            }

        will be collapsed into the equivalent but flatter::

            if (x == 0) {
                // ...
            } else if (x == 1) {
                // ...
            } else {
                // ...
            }

        This collapsed form may have less support on backends, so it is turned off by
        default.  While the output of this printer is always unambiguous, using ``else``
        without immediately opening an explicit scope with ``{ }`` in nested contexts can
        cause issues, in the general case, which is why it is sometimes less supported.
    experimental: any experimental features to enable during the export.  See
        :class:`ExperimentalFeatures` for more details.

### `visit`

```python
def visit(self, node: ast.ASTNode) -> None
```

Visit this node of the AST, printing it out to the stream in this class instance.

Normally, you will want to call this function on a complete :obj:`~qiskit.qasm3.ast.Program`
node, to print out a complete program to the stream.  The visit can start from any node,
however, if you want to build up a file bit-by-bit manually.

Args:
    node (ASTNode): the node to convert to OpenQASM 3 and write out to the stream.

Raises:
    RuntimeError: if an AST node is encountered that the visitor is unable to parse.  This
        typically means that the given AST was malformed.
