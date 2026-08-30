# Quantum knowledge base — source collection

Raw documentation collected from Qiskit, Cirq and PennyLane, organised by
framework and document type for a quantum-computing AI tutor.

**This phase collects source documents only.** No embeddings, no vector
database, no chunking. Content is reproduced verbatim — nothing here is
summarised, rewritten or paraphrased.

Self-contained: nothing outside this directory is read or modified.

## Layout

```
knowledge_base/
  qiskit/      concept/  api/  error/  optimization/
  cirq/        concept/  api/  error/  optimization/
  pennylane/   concept/  api/  error/  optimization/
  source_manifest.json    pinned refs + per-type file counts
  ingestion_summary.md    counts, skips/failures, classification rules
  _ingest/                the collector (see below)
```

Every file carries YAML frontmatter:

```yaml
---
framework: qiskit | cirq | pennylane
api_version: <pinned tag or short commit>
doc_type: concept | api | error | optimization
source_path: <path inside the upstream repo>
source_url: <permalink to the exact pinned commit>
license: Apache-2.0 | CC-BY-SA-4.0
---
```

## Running it

Requires only Python 3.10+ and `git`. No third-party packages.

```bash
python3 knowledge_base/_ingest/collect.py qiskit
python3 knowledge_base/_ingest/collect.py cirq
python3 knowledge_base/_ingest/collect.py pennylane
```

One framework at a time. Each run wipes and rebuilds only its own four
folders, then merges its results into the manifest and summary, so the runs
are independent and repeatable.

```bash
# regenerate ingestion_summary.md without re-downloading anything
python3 knowledge_base/_ingest/collect.py qiskit --summary-only

# keep the upstream checkouts for inspection
python3 knowledge_base/_ingest/collect.py cirq --keep-sources
```

Checkouts go to a scratch directory in the system temp dir, **outside** this
repository, and are deleted after each framework unless `--keep-sources` is
passed. Nothing needs adding to `.gitignore`.

Fetching uses blobless partial clones (`--filter=blob:none`) with cone-mode
sparse-checkout limited to the directories actually collected — full clones of
all five repos do not fit in a typical disk budget.

## Pinned sources

| Repo | Pin | Kind | License |
|---|---|---|---|
| `Qiskit/documentation` | `1a3b8eb3e102` | commit | CC-BY-SA-4.0 |
| `Qiskit/qiskit` | `2.5.2` | tag | Apache-2.0 |
| `quantumlib/Cirq` | `v1.7.0` | tag | Apache-2.0 |
| `PennyLaneAI/pennylane` | `v0.45.1` | tag | Apache-2.0 |
| `PennyLaneAI/qml` | `cf4629f869bf` | commit | Apache-2.0 |

`Qiskit/documentation` and `PennyLaneAI/qml` publish **no release tags**
(verified with `git ls-remote --tags`), so they are pinned to an immutable
commit SHA. That gives the same reproducibility guarantee as a tag: re-running
never silently drifts with `main`.

## What gets collected

| Source | → doc_type |
|---|---|
| Qiskit learning courses (3 courses) | `concept` |
| Qiskit `docs/api/qiskit/transpiler*` | `optimization` |
| Qiskit SDK docstrings | `api` / `error` / `optimization` |
| Cirq `docs/` | `concept` |
| Cirq `cirq-core` docstrings | `api` / `error` / `optimization` |
| PennyLane `doc/` | `concept` |
| PennyLane docstrings | `api` / `error` / `optimization` |
| PennyLane `qml` demos (218) | `concept` |

Format handling:

- **`.md` / `.mdx` / `.rst`** — passed through; only upstream frontmatter,
  HTML comments and MDX `import`/`export` plumbing are stripped. Fenced code
  is masked before the MDX stripper runs, so a line starting with `import`
  *inside* a Python example is never touched.
- **`.ipynb`** — flattened preserving cell order; markdown cells as-is, code
  cells as fenced blocks. Outputs dropped. These notebooks carry their own
  YAML frontmatter inside the first markdown cell, which is stripped so the
  file does not end up with two `---` blocks.
- **Python docstrings** — extracted with `ast`; each definition rendered as
  its signature plus its docstring, verbatim. Undocumented and private
  definitions are skipped.
- **sphinx-gallery demos** — `PennyLaneAI/qml` ships demos as executable
  Python (reST narrative in `#`-prefixed blocks interleaved with code), not
  notebooks. Narrative and code are separated so the prose isn't buried in a
  Python blob.

Code blocks are never split: one output file per source file, always.

See `ingestion_summary.md` for how each Python module resolves to a single
`doc_type`, and why some filenames appear in both `api/` and `error/`.

## Licensing

Qiskit, Cirq and PennyLane source repos are **Apache-2.0**. The Qiskit
learning-course prose is **CC BY-SA 4.0**. Both permit verbatim inclusion with
attribution, which is why every file records its `license` and a `source_url`
permalink to the exact pinned commit.

**Do not add Nielsen & Chuang or any other copyrighted textbook content to
this pipeline without a separate licensing review.** The Apache-2.0 / CC BY-SA
terms on these repos do not extend to textbook material quoted inside them.
