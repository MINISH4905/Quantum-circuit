"""
Sparse, pinned checkouts of the upstream documentation repos.

Full clones of these five repos do not fit in the available disk budget, so
each is fetched as a *blobless partial clone* (`--filter=blob:none`) with a
cone-mode sparse-checkout limited to the directories config.py actually
collects from. Git then downloads blobs only for those paths.

Nothing here writes into the project. Clones land in a scratch directory
outside the repository (default: system temp), so no .gitignore change is
needed and the working tree stays clean.
"""

from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

from config import Repo

DEFAULT_SCRATCH = Path(tempfile.gettempdir()) / "qkb-sources"


class FetchError(RuntimeError):
    pass


def _run(args: list[str], cwd: Path | None = None, timeout: int = 900) -> str:
    proc = subprocess.run(
        args,
        cwd=str(cwd) if cwd else None,
        capture_output=True,
        text=True,
        timeout=timeout,
    )
    if proc.returncode != 0:
        raise FetchError(f"{' '.join(args[:4])}... failed:\n{proc.stderr.strip()[:600]}")
    return proc.stdout.strip()


def fetch(repo: Repo, scratch: Path = DEFAULT_SCRATCH) -> tuple[Path, str]:
    """Check out `repo` at its pinned ref. Returns (checkout_path, commit_sha).

    Idempotent: if the directory already sits at the requested ref, it is
    reused rather than re-downloaded.
    """
    scratch.mkdir(parents=True, exist_ok=True)
    dest = scratch / repo.key.replace("/", "__")

    if dest.exists():
        try:
            head = _run(["git", "-C", str(dest), "rev-parse", "HEAD"])
            if _resolves_to(dest, repo.ref, head):
                # Re-apply the sparse spec even on reuse: config.py's
                # sparse_paths may have changed since this directory was
                # created, and a stale cone silently yields zero files.
                if repo.sparse_paths:
                    _run(["git", "-C", str(dest), "sparse-checkout", "set", *repo.sparse_paths])
                return dest, head
        except FetchError:
            pass  # corrupt or partial — fall through and re-clone
        _run(["rm", "-rf", str(dest)])

    _run(
        [
            "git",
            "clone",
            "--filter=blob:none",
            "--no-checkout",
            "--sparse",
            repo.url,
            str(dest),
        ]
    )

    # Cone mode keeps the sparse spec to whole directories, which is both
    # faster to apply and far easier to reason about than pattern mode.
    _run(["git", "-C", str(dest), "sparse-checkout", "init", "--cone"])
    if repo.sparse_paths:
        _run(["git", "-C", str(dest), "sparse-checkout", "set", *repo.sparse_paths])

    # Tags need fetching explicitly on a partial clone before they can be
    # checked out; commits are already reachable.
    if repo.ref_kind == "tag":
        _run(["git", "-C", str(dest), "fetch", "--depth", "1", "origin", "tag", repo.ref])
    _run(["git", "-C", str(dest), "checkout", repo.ref])

    commit = _run(["git", "-C", str(dest), "rev-parse", "HEAD"])
    return dest, commit


def _resolves_to(dest: Path, ref: str, head: str) -> bool:
    if head.startswith(ref):
        return True
    try:
        return _run(["git", "-C", str(dest), "rev-parse", f"{ref}^{{commit}}"]) == head
    except FetchError:
        return False


def disk_free_mb(path: Path = DEFAULT_SCRATCH) -> int:
    import shutil

    target = path if path.exists() else path.parent
    return shutil.disk_usage(target).free // (1024 * 1024)


def purge(repo: Repo, scratch: Path = DEFAULT_SCRATCH) -> None:
    """Delete a checkout once it has been collected from.

    Called between frameworks so peak disk usage stays near the size of the
    single largest repo rather than the sum of all five.
    """
    dest = scratch / repo.key.replace("/", "__")
    if dest.exists():
        _run(["rm", "-rf", str(dest)])
