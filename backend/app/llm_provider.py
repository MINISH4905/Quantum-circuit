"""
LLM provider interface for the AI tutor. `TutorLLMProvider` is a small
Protocol so tutor.py never depends on a specific vendor SDK — only
`OllamaTutorProvider` (below) knows about the Ollama HTTP API. Swap in a
different implementation of the same interface to use another provider
without touching tutor.py or main.py.

Runs entirely against a local Ollama server (https://ollama.com) serving
llama3 — no API key, no cloud dependency. Configure with the
OLLAMA_BASE_URL / OLLAMA_MODEL environment variables if you need to point
at a different host or model.
"""

from __future__ import annotations

import json
import os
from typing import Protocol

DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434"
DEFAULT_OLLAMA_MODEL = "llama3"

TUTOR_JSON_SCHEMA = {
    "type": "object",
    "properties": {
        "explanation": {"type": "string"},
        "warningDetected": {"type": "boolean"},
        "warningMessage": {"type": "string"},
        "optimization": {"type": "string"},
    },
    "required": ["explanation", "warningDetected", "warningMessage", "optimization"],
    "additionalProperties": False,
}

TUTOR_SYSTEM_PROMPT = (
    "You are a quantum computing tutor embedded in a circuit editor. You are shown the EXACT "
    "current circuit, its EXACT simulated results, and a list of issues an automated checker "
    "already found (which may be empty). Ground every statement strictly in this data — never "
    "invent gates, qubits, or behavior that isn't given. Write for a beginner. Respond ONLY with "
    "the requested JSON fields: "
    "`explanation` is 2-4 plain-English sentences describing what this specific circuit does, "
    "referencing the actual gates/qubits/probabilities given. "
    "`warningDetected`/`warningMessage`: if the automated checker found issues, set "
    "warningDetected=true and rewrite them as one clear, encouraging, pedagogical sentence or two "
    "(don't just repeat them verbatim); if the checker found nothing and you don't see another "
    "clear, concrete conceptual mistake yourself, set warningDetected=false and warningMessage to "
    "an empty string — never invent a warning just to fill the field. "
    "`optimization` is exactly ONE concrete, useful suggestion to improve this specific circuit "
    "(fewer gates, clearer structure, a missing measurement, etc.); if the circuit is empty or "
    "already minimal, say so plainly instead of inventing a change."
)


class LLMNotConfiguredError(RuntimeError):
    """Raised when generate() is called but no provider credentials are set."""


class LLMProviderError(RuntimeError):
    """Raised when the provider is configured but the request itself failed
    (network error, malformed response, etc.)."""


class TutorLLMOutput:
    __slots__ = ("explanation", "warning_detected", "warning_message", "optimization")

    def __init__(self, explanation: str, warning_detected: bool, warning_message: str, optimization: str):
        self.explanation = explanation
        self.warning_detected = warning_detected
        self.warning_message = warning_message
        self.optimization = optimization


class TutorLLMProvider(Protocol):
    def is_configured(self) -> bool: ...

    def generate(
        self, *, circuit_summary: str, simulation_summary: str, detected_issues: list[str]
    ) -> TutorLLMOutput: ...

    def warm_up(self) -> None:
        """Best-effort, non-blocking hint to get the model ready before the
        first real request. No-op for providers with no cold-start cost."""
        ...


def _build_user_prompt(circuit_summary: str, simulation_summary: str, detected_issues: list[str]) -> str:
    issues_block = "\n".join(f"- {issue}" for issue in detected_issues) if detected_issues else "(none found)"
    return (
        f"Circuit:\n{circuit_summary}\n\n"
        f"Simulated results:\n{simulation_summary}\n\n"
        f"Automated checker findings:\n{issues_block}"
    )


class OllamaTutorProvider:
    """Local LLM via Ollama (https://ollama.com) — no API key required, runs
    entirely on the machine running the backend. Configure with the
    OLLAMA_BASE_URL / OLLAMA_MODEL env vars (defaults: localhost:11434 /
    llama3). Uses Ollama's schema-constrained `format` option for reliable,
    guaranteed-parseable structured output."""

    def __init__(self, base_url: str | None = None, model: str | None = None, timeout: float = 60.0):
        self._base_url = (base_url or os.environ.get("OLLAMA_BASE_URL", DEFAULT_OLLAMA_BASE_URL)).rstrip("/")
        self._model = model or os.environ.get("OLLAMA_MODEL", DEFAULT_OLLAMA_MODEL)
        # Generous default: an unloaded model's first response can take tens
        # of seconds while Ollama loads weights into memory.
        self._timeout = timeout

    def is_configured(self) -> bool:
        # No credential is required for a local Ollama server — connectivity
        # failures (server down, model not pulled) surface from generate()
        # as LLMProviderError, which the caller already treats as "fall back
        # to deterministic", so there's nothing extra to gate on here.
        return True

    def warm_up(self) -> None:
        """Ollama unloads an idle model after a few minutes; reloading it
        from disk can take 30-60s, which blows past any reasonable request
        timeout. Fire a trivial request in a background thread at backend
        startup so the model is already resident before the first real
        tutor request — failures here are silently ignored, generate()
        still works (just slower) if this doesn't get a chance to run."""
        import threading

        import httpx

        def _ping() -> None:
            try:
                httpx.post(
                    f"{self._base_url}/api/chat",
                    json={
                        "model": self._model,
                        "messages": [{"role": "user", "content": "Reply with OK."}],
                        "stream": False,
                        "keep_alive": "30m",
                    },
                    timeout=self._timeout,
                )
            except httpx.HTTPError:
                pass

        threading.Thread(target=_ping, daemon=True).start()

    def generate(
        self, *, circuit_summary: str, simulation_summary: str, detected_issues: list[str]
    ) -> TutorLLMOutput:
        import httpx

        payload = {
            "model": self._model,
            "messages": [
                {"role": "system", "content": TUTOR_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": _build_user_prompt(circuit_summary, simulation_summary, detected_issues),
                },
            ],
            "format": TUTOR_JSON_SCHEMA,
            "stream": False,
            "options": {"temperature": 0.2},
            # Keep the model loaded for 30 minutes of idle time instead of
            # Ollama's default 5 — avoids repeated cold reloads mid-demo.
            "keep_alive": "30m",
        }

        try:
            resp = httpx.post(f"{self._base_url}/api/chat", json=payload, timeout=self._timeout)
            resp.raise_for_status()
            body = resp.json()
        except httpx.HTTPError as exc:
            raise LLMProviderError(f"Ollama request failed: {exc}") from exc
        except json.JSONDecodeError as exc:
            raise LLMProviderError(f"Ollama returned a non-JSON response: {exc}") from exc

        try:
            text = body["message"]["content"]
            data = json.loads(text)
            return TutorLLMOutput(
                explanation=data["explanation"],
                warning_detected=bool(data["warningDetected"]),
                warning_message=data["warningMessage"],
                optimization=data["optimization"],
            )
        except (KeyError, json.JSONDecodeError) as exc:
            raise LLMProviderError(f"Unexpected Ollama response shape: {exc}") from exc
