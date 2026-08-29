"""
LLM provider interface for the AI tutor. `TutorLLMProvider` is a small
Protocol so tutor.py never depends on a specific vendor SDK — swap in a
different implementation of the same interface to use another provider
without touching tutor.py or main.py.

Default provider: Groq (https://groq.com) serving llama-3.3-70b-versatile
via their cloud API. Requires a GROQ_API_KEY environment variable.
"""

from __future__ import annotations

import json
import os
from typing import Protocol

GROQ_DEFAULT_MODEL = "llama-3.3-70b-versatile"

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


class GroqTutorProvider:
    """Cloud LLM via Groq (https://groq.com) — requires a GROQ_API_KEY
    environment variable. Uses Groq's OpenAI-compatible chat completions API
    with JSON mode for structured output.

    Default model: llama-3.3-70b-versatile (fast inference via Groq's LPU).
    Override with the GROQ_MODEL env var."""

    def __init__(self, api_key: str | None = None, model: str | None = None, timeout: float = 30.0):
        self._api_key = api_key or os.environ.get("GROQ_API_KEY", "")
        self._model = model or os.environ.get("GROQ_MODEL", GROQ_DEFAULT_MODEL)
        self._timeout = timeout

    def is_configured(self) -> bool:
        return bool(self._api_key)

    def warm_up(self) -> None:
        pass

    def generate(
        self, *, circuit_summary: str, simulation_summary: str, detected_issues: list[str]
    ) -> TutorLLMOutput:
        if not self._api_key:
            raise LLMNotConfiguredError(
                "GROQ_API_KEY environment variable is not set. "
                "Get a free key at https://console.groq.com/keys"
            )

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
            "temperature": 0.2,
            "max_tokens": 1024,
            "response_format": {"type": "json_object"},
        }

        try:
            resp = httpx.post(
                "https://api.groq.com/openai/v1/chat/completions",
                json=payload,
                headers={
                    "Authorization": f"Bearer {self._api_key}",
                    "Content-Type": "application/json",
                },
                timeout=self._timeout,
            )
            resp.raise_for_status()
            body = resp.json()
        except httpx.HTTPStatusError as exc:
            error_detail = ""
            try:
                error_detail = exc.response.json().get("error", {}).get("message", "")
            except Exception:
                pass
            raise LLMProviderError(
                f"Groq API returned {exc.response.status_code}: {error_detail or str(exc)}"
            ) from exc
        except httpx.HTTPError as exc:
            raise LLMProviderError(f"Groq request failed: {exc}") from exc
        except json.JSONDecodeError as exc:
            raise LLMProviderError(f"Groq returned a non-JSON response: {exc}") from exc

        try:
            text = body["choices"][0]["message"]["content"]
            data = json.loads(text)
            return TutorLLMOutput(
                explanation=data["explanation"],
                warning_detected=bool(data["warningDetected"]),
                warning_message=data.get("warningMessage", ""),
                optimization=data.get("optimization", ""),
            )
        except (KeyError, IndexError, json.JSONDecodeError) as exc:
            raise LLMProviderError(f"Unexpected Groq response shape: {exc}") from exc
