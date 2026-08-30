"""
Source pins and collection rules for the quantum-computing knowledge base.

LICENSING
---------
Qiskit SDK, Cirq and PennyLane are Apache-2.0. The prose in Qiskit/documentation
(the learning courses) is CC BY-SA 4.0. Both permit verbatim inclusion with
attribution, which is why every emitted file carries `license` and `source_url`
in its frontmatter.

Do NOT add Nielsen & Chuang or any other copyrighted textbook content to this
pipeline without a separate licensing review. Apache-2.0 / CC BY-SA on these
repos does not extend to textbook material quoted inside them.

PINNING
-------
Qiskit/documentation and PennyLaneAI/qml publish no release tags (checked via
`git ls-remote --tags`), so they are pinned to an immutable commit SHA instead.
That gives the same reproducibility guarantee as a tag — what matters is that
re-running never silently picks up drift from main.
"""

from __future__ import annotations

from dataclasses import dataclass, field

APACHE = "Apache-2.0"
CC_BY_SA = "CC-BY-SA-4.0"

DOC_TYPES = ("concept", "api", "error", "optimization")
FRAMEWORKS = ("qiskit", "cirq", "pennylane")


@dataclass(frozen=True)
class PrefixRule:
    """Maps a path prefix inside a repo to a doc_type, for prose files."""

    prefix: str
    doc_type: str


@dataclass(frozen=True)
class Repo:
    key: str
    framework: str
    url: str
    ref: str
    ref_kind: str  # "tag" | "commit"
    license: str
    # Directories fetched via sparse-checkout. Keeping this tight matters:
    # full clones of these repos do not fit in the disk budget.
    sparse_paths: list[str]
    # Prose (.md/.mdx/.rst/.ipynb) collection rules.
    prose_rules: list[PrefixRule] = field(default_factory=list)
    # Roots under which Python source is walked for docstring extraction.
    source_roots: list[str] = field(default_factory=list)


REPOS: list[Repo] = [
    Repo(
        key="qiskit/documentation",
        framework="qiskit",
        url="https://github.com/Qiskit/documentation",
        ref="1a3b8eb3e102668f9612ac64c80f384b28683681",
        ref_kind="commit",
        license=CC_BY_SA,
        sparse_paths=[
            "learning/courses/basics-of-quantum-information",
            "learning/courses/fundamentals-of-quantum-algorithms",
            "learning/courses/general-formulation-of-quantum-information",
            "docs/api/qiskit",
        ],
        prose_rules=[
            PrefixRule("learning/courses/basics-of-quantum-information", "concept"),
            PrefixRule("learning/courses/fundamentals-of-quantum-algorithms", "concept"),
            PrefixRule("learning/courses/general-formulation-of-quantum-information", "concept"),
            # Only the transpiler slice of the API docs is wanted, as optimization.
            PrefixRule("docs/api/qiskit/transpiler", "optimization"),
            PrefixRule("docs/api/qiskit/qiskit.transpiler", "optimization"),
        ],
    ),
    Repo(
        key="Qiskit/qiskit",
        framework="qiskit",
        url="https://github.com/Qiskit/qiskit",
        ref="2.5.2",
        ref_kind="tag",
        license=APACHE,
        sparse_paths=["qiskit"],
        source_roots=["qiskit"],
    ),
    Repo(
        key="quantumlib/Cirq",
        framework="cirq",
        url="https://github.com/quantumlib/Cirq",
        ref="v1.7.0",
        ref_kind="tag",
        license=APACHE,
        sparse_paths=["docs", "cirq-core/cirq"],
        prose_rules=[PrefixRule("docs", "concept")],
        source_roots=["cirq-core/cirq"],
    ),
    Repo(
        key="PennyLaneAI/pennylane",
        framework="pennylane",
        url="https://github.com/PennyLaneAI/pennylane",
        ref="v0.45.1",
        ref_kind="tag",
        license=APACHE,
        sparse_paths=["doc", "pennylane"],
        prose_rules=[PrefixRule("doc", "concept")],
        source_roots=["pennylane"],
    ),
    Repo(
        key="PennyLaneAI/qml",
        framework="pennylane",
        url="https://github.com/PennyLaneAI/qml",
        ref="cf4629f869bf4dbc8ce0f9a5a3256eda138c7bbb",
        ref_kind="commit",
        license=APACHE,
        # Demos live under demonstrations_v2/<name>/demo.py at this commit —
        # there is no `demonstrations/` directory, and they are sphinx-gallery
        # Python rather than notebooks. See extract_gallery_py.
        sparse_paths=["demonstrations_v2"],
        prose_rules=[PrefixRule("demonstrations_v2", "concept")],
    ),
]


# --- Python source classification -------------------------------------------
#
# Every Python file resolves to exactly ONE doc_type, because the brief requires
# one output file per source file. A file cannot be split across api/ and error/.
# Precedence, highest first:
#
#   error         module is named for exceptions, OR every public class in it
#                 derives from an Exception type
#   optimization  path sits under a transpiler-pass / transformer / optimizer
#                 module — these are the "how do I make this circuit better"
#                 surfaces
#   api           everything else
#
# Files classified `api` that still contain a stray exception class are counted
# and reported in ingestion_summary.md, so the compromise is visible rather than
# silent.

ERROR_MODULE_NAMES = {"exceptions", "exception", "errors", "error", "_exceptions", "_errors"}

OPTIMIZATION_PATH_MARKERS = (
    "transpiler/passes",
    "transpiler/preset_passmanagers",
    "transpiler/passmanager",
    "transforms",
    "optimizers",
    "transformers",
    "optimization",
)

# Bases that mark a class as an exception even without resolving the full MRO.
EXCEPTION_BASE_HINTS = (
    "Exception",
    "Error",
    "Warning",
    "QiskitError",
    "TranspilerError",
    "CircuitError",
    "PennyLaneError",
    "QuantumFunctionError",
    "DeviceError",
)

PROSE_EXTENSIONS = (".md", ".mdx", ".rst", ".ipynb")

# Directories never worth collecting.
SKIP_DIR_PARTS = {
    "__pycache__",
    "test",
    "tests",
    "_build",
    "node_modules",
    ".git",
    "site-packages",
}

# Sphinx-gallery demos in PennyLaneAI/qml are .py files that are really prose:
# a long module docstring plus narrative comments. They are collected as prose,
# not run through the docstring extractor.
GALLERY_PROSE_REPOS = {"PennyLaneAI/qml"}
