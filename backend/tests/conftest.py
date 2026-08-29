import sys
from pathlib import Path

# Ensure `backend/` (the parent of this tests/ dir) is on sys.path so
# `import app...` resolves regardless of how pytest is invoked/rootdir'd.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
