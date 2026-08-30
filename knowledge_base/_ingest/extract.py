"""
Content extraction. Nothing here summarises, rewrites or paraphrases — this is
a raw collection phase. Prose is passed through with only navigation chrome
removed; docstrings and code are reproduced exactly as written upstream.
"""

from __future__ import annotations

import ast
import json
import re
from pathlib import Path

from config import (
    ERROR_MODULE_NAMES,
    EXCEPTION_BASE_HINTS,
    OPTIMIZATION_PATH_MARKERS,
)


class ExtractError(RuntimeError):
    """Raised when a file cannot be parsed. Always recorded, never swallowed."""


# --- prose -------------------------------------------------------------------

_FRONTMATTER = re.compile(r"\A\s*---\r?\n.*?\r?\n---\r?\n", re.DOTALL)
_HTML_COMMENT = re.compile(r"<!--.*?-->", re.DOTALL)
# MDX plumbing: `import {X} from '...'` / `export const y = ...` at line start.
_MDX_IMPORT = re.compile(r"^(?:import|export)\s+.*?$\n?", re.MULTILINE)
# MDX expression comments, e.g. {/* cspell:ignore operatorname */}
_MDX_COMMENT = re.compile(r"\{/\*.*?\*/\}", re.DOTALL)


def clean_prose(text: str) -> str:
    """Strip navigation chrome and MDX plumbing.

    Headings, prose and code blocks are left byte-identical. Fenced code is
    masked out before the MDX import stripper runs, so a line beginning with
    `import` *inside* a Python example is never touched.
    """
    text = _FRONTMATTER.sub("", text, count=1)
    text = _HTML_COMMENT.sub("", text)

    fences: list[str] = []

    def _stash(match: re.Match[str]) -> str:
        fences.append(match.group(0))
        return f"\x00FENCE{len(fences) - 1}\x00"

    text = re.sub(r"```.*?```", _stash, text, flags=re.DOTALL)
    text = _MDX_IMPORT.sub("", text)
    text = _MDX_COMMENT.sub("", text)
    for i, block in enumerate(fences):
        text = text.replace(f"\x00FENCE{i}\x00", block)

    return text.strip() + "\n"


def extract_notebook(raw: str) -> str:
    """Flatten a .ipynb into markdown, preserving cell order and cell type.

    Markdown cells pass through as-is; code cells become fenced blocks. Outputs
    are dropped — they are mostly base64 images and execution noise.
    """
    try:
        nb = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ExtractError(f"invalid notebook JSON: {exc}") from exc

    lang = (
        nb.get("metadata", {}).get("language_info", {}).get("name")
        or nb.get("metadata", {}).get("kernelspec", {}).get("language")
        or "python"
    )

    parts: list[str] = []
    for cell in nb.get("cells", []):
        source = cell.get("source", "")
        body = "".join(source) if isinstance(source, list) else str(source)
        if not body.strip():
            continue
        kind = cell.get("cell_type")
        if kind == "markdown":
            parts.append(body.rstrip())
        elif kind == "code":
            parts.append(f"```{lang}\n{body.rstrip()}\n```")
    if not parts:
        raise ExtractError("notebook contained no markdown or code cells")
    return "\n\n".join(parts).strip() + "\n"


# --- python docstrings -------------------------------------------------------


def _signature(node: ast.FunctionDef | ast.AsyncFunctionDef | ast.ClassDef) -> str:
    """Reconstruct a source-accurate signature line via ast.unparse."""
    if isinstance(node, ast.ClassDef):
        bases = [ast.unparse(b) for b in node.bases]
        kw = [f"{k.arg}={ast.unparse(k.value)}" for k in node.keywords if k.arg]
        joined = ", ".join(bases + kw)
        return f"class {node.name}({joined})" if joined else f"class {node.name}"
    prefix = "async def" if isinstance(node, ast.AsyncFunctionDef) else "def"
    returns = f" -> {ast.unparse(node.returns)}" if node.returns else ""
    return f"{prefix} {node.name}({ast.unparse(node.args)}){returns}"


def _is_exception_class(node: ast.ClassDef) -> bool:
    for base in node.bases:
        name = ast.unparse(base).split(".")[-1]
        if any(hint in name for hint in EXCEPTION_BASE_HINTS):
            return True
    return False


def extract_docstrings(raw: str, rel_path: str) -> tuple[str, dict]:
    """Render every public documented definition in a module as markdown.

    Returns (markdown, stats). Private names (leading underscore, except
    dunder) are skipped, as are undocumented definitions — a bare signature
    with no docstring carries nothing for a tutor to retrieve.
    """
    try:
        tree = ast.parse(raw)
    except SyntaxError as exc:
        raise ExtractError(f"SyntaxError line {exc.lineno}: {exc.msg}") from exc

    blocks: list[str] = []
    n_classes = n_funcs = n_exceptions = 0

    module_doc = ast.get_docstring(tree)
    if module_doc:
        blocks.append(f"## Module `{rel_path}`\n\n{module_doc.strip()}")

    def render(node, depth: int) -> None:
        nonlocal n_classes, n_funcs, n_exceptions
        name = node.name
        if name.startswith("_") and not name.startswith("__"):
            return
        doc = ast.get_docstring(node)
        if not doc:
            return

        if isinstance(node, ast.ClassDef):
            n_classes += 1
            if _is_exception_class(node):
                n_exceptions += 1
        else:
            n_funcs += 1

        heading = "#" * min(depth + 2, 6)
        blocks.append(f"{heading} `{name}`\n\n```python\n{_signature(node)}\n```\n\n{doc.strip()}")

        if isinstance(node, ast.ClassDef):
            for child in node.body:
                if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    render(child, depth + 1)

    for node in tree.body:
        if isinstance(node, (ast.ClassDef, ast.FunctionDef, ast.AsyncFunctionDef)):
            render(node, 0)

    if not blocks:
        raise ExtractError("no public documented definitions")

    stats = {"classes": n_classes, "functions": n_funcs, "exceptions": n_exceptions}
    return "\n\n".join(blocks).strip() + "\n", stats


_GALLERY_SEPARATOR = re.compile(r"^#{20,}\s*$", re.MULTILINE)


def extract_gallery_py(raw: str) -> str:
    """Convert a sphinx-gallery demo (`demo.py`) into markdown.

    PennyLaneAI/qml ships its demos as executable Python, not notebooks: a
    leading reST module docstring, then alternating blocks of `# `-prefixed
    reST narrative (delimited by long `####...` rules) and real code. Emitting
    the file raw would bury the prose inside a Python blob, so narrative and
    code are separated here — which is exactly the concept+code pairing these
    demos are valuable for.

    Prose and code are reproduced verbatim; only the `# ` comment prefix and
    the separator rules are removed.
    """
    body = raw
    try:
        tree = ast.parse(raw)
        module_doc = ast.get_docstring(tree)
    except SyntaxError:
        module_doc = None

    parts: list[str] = []
    if module_doc:
        parts.append(module_doc.strip())
        # Drop the docstring node from the text so it isn't repeated as code.
        match = re.search(r'^\s*[rubRUB]{0,2}("""|\'\'\')', body)
        if match:
            quote = match.group(1)
            end = body.find(quote, match.end())
            if end != -1:
                body = body[end + len(quote) :]

    for segment in _GALLERY_SEPARATOR.split(body):
        lines = segment.splitlines()
        prose: list[str] = []
        code: list[str] = []
        in_prose = True
        for line in lines:
            if in_prose and (line.startswith("# ") or line.strip() == "#"):
                prose.append(line[2:] if line.startswith("# ") else "")
            elif not line.strip() and in_prose:
                prose.append("")
            else:
                in_prose = False
                code.append(line)

        prose_text = "\n".join(prose).strip()
        code_text = "\n".join(code).strip()
        if prose_text:
            parts.append(prose_text)
        if code_text:
            parts.append(f"```python\n{code_text}\n```")

    return "\n\n".join(p for p in parts if p).strip() + "\n"


def extract_error_surface(raw: str, rel_path: str) -> str | None:
    """Render a module's documented *error surface*: exception classes plus
    validation callables.

    Returns None when the module has neither.

    Two reasons this is broader than "classes deriving from Exception":

    1. Cirq and PennyLane raise most errors from classes defined inside
       ordinary API modules, not a dedicated exceptions.py — restricting
       error/ to exception-only modules leaves it nearly empty.
    2. Cirq in particular defines only three exception classes in cirq-core
       and documents just one of them. Its real "why did this fail" surface is
       the validate_* family (validate_operation, validate_moment, ...), which
       is what a debugging query actually needs to retrieve.

    Nothing is merged: the emitted file still derives from exactly one source
    file, so the one-output-per-source rule holds.
    """
    try:
        tree = ast.parse(raw)
    except SyntaxError:
        return None

    exceptions: list[str] = []
    validators: list[str] = []

    def is_validator(name: str) -> bool:
        return name.startswith("validate") or name.startswith("_validate")

    def render(node, depth: int, owner: str | None = None) -> str | None:
        doc = ast.get_docstring(node)
        if not doc:
            return None
        label = f"{owner}.{node.name}" if owner else node.name
        heading = "#" * min(depth + 2, 6)
        return f"{heading} `{label}`\n\n```python\n{_signature(node)}\n```\n\n{doc.strip()}"

    for node in tree.body:
        if isinstance(node, ast.ClassDef):
            if not node.name.startswith("_") and _is_exception_class(node):
                block = render(node, 0)
                if block:
                    exceptions.append(block)
            # validate_* methods hang off device/gate classes, so descend.
            for child in node.body:
                if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef)) and is_validator(child.name):
                    block = render(child, 1, owner=node.name)
                    if block:
                        validators.append(block)
        elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and is_validator(node.name):
            block = render(node, 0)
            if block:
                validators.append(block)

    if not exceptions and not validators:
        return None

    parts = [f"## Error surface of `{rel_path}`"]
    if exceptions:
        parts.append("### Exceptions\n\n" + "\n\n".join(exceptions))
    if validators:
        parts.append("### Validation\n\n" + "\n\n".join(validators))
    return "\n\n".join(parts).strip() + "\n"


def classify_python(rel_path: str, raw: str) -> tuple[str, bool]:
    """Resolve a Python file to its primary doc_type.

    Returns (doc_type, defines_exceptions). The flag drives the companion
    error/ file described in extract_exception_docstrings.

    A module counts as `error` only when it is *essentially nothing but*
    exceptions — named for them, or all-exception-classes with no public
    function surface. Requiring the function check matters: cirq's
    linalg/transformations.py defines ~30 public functions and a single
    EntangledStateError, and a classes-only rule mislabelled the whole module
    as error.
    """
    posix = rel_path.replace("\\", "/")
    stem = Path(posix).stem

    exception_classes = 0
    public_classes = 0
    public_functions = 0
    try:
        tree = ast.parse(raw)
        for node in tree.body:
            if isinstance(node, ast.ClassDef) and not node.name.startswith("_"):
                public_classes += 1
                if _is_exception_class(node):
                    exception_classes += 1
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and not node.name.startswith("_"):
                public_functions += 1
    except SyntaxError:
        pass  # fall back to the path heuristics below

    has_exceptions = exception_classes > 0

    if stem in ERROR_MODULE_NAMES:
        return "error", False
    if public_classes and exception_classes == public_classes and public_functions == 0:
        return "error", False

    if any(marker in posix for marker in OPTIMIZATION_PATH_MARKERS):
        return "optimization", has_exceptions

    return "api", has_exceptions
