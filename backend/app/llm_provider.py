"""
LLM provider interface for the AI tutor. `TutorLLMProvider` is a small
Protocol so tutor.py never depends on a specific vendor SDK — swap in a
different implementation of the same interface to use another provider
without touching tutor.py or main.py.

Default provider: Groq (https://groq.com) serving qwen/qwen3.8-27b
via their cloud API. Requires a GROQ_API_KEY environment variable.
"""

from __future__ import annotations

import itertools
import json
import os
import re
import threading
from collections.abc import AsyncIterator
from typing import Protocol

GROQ_DEFAULT_MODEL = "qwen/qwen3.8-27b"

_LATEX_GREEK = {
    "alpha": "α", "beta": "β", "gamma": "γ", "delta": "δ", "epsilon": "ε",
    "zeta": "ζ", "eta": "η", "theta": "θ", "iota": "ι", "kappa": "κ",
    "lambda": "λ", "mu": "μ", "nu": "ν", "xi": "ξ", "pi": "π",
    "rho": "ρ", "sigma": "σ", "tau": "τ", "upsilon": "υ", "phi": "φ",
    "chi": "χ", "psi": "ψ", "omega": "ω",
    "Gamma": "Γ", "Delta": "Δ", "Theta": "Θ", "Lambda": "Λ", "Xi": "Ξ",
    "Pi": "Π", "Sigma": "Σ", "Phi": "Φ", "Psi": "Ψ", "Omega": "Ω",
}

def _strip_latex(text: str) -> str:
    """Convert LaTeX math notation to plain Unicode text."""
    text = re.sub(r"\\\[", "", text)
    text = re.sub(r"\\\]", "", text)
    text = re.sub(r"\\\(", "", text)
    text = re.sub(r"\\\)", "", text)
    text = re.sub(r"\$\$?", "", text)
    text = re.sub(r"\\frac\{([^}]*)\}\{([^}]*)\}", r"\1/\2", text)
    text = re.sub(r"\\sqrt\{([^}]*)\}", r"√\1", text)

    def _convert_matrix(m: re.Match) -> str:
        body = m.group(1).strip()
        rows = [r.strip() for r in body.split("\\\\")]
        converted = []
        for row in rows:
            cells = [c.strip() for c in row.split("&")]
            converted.append("[" + ", ".join(cells) + "]")
        return "[" + ", ".join(converted) + "]"

    text = re.sub(
        r"\\begin\{[bp]?matrix\}([\s\S]*?)\\end\{[bp]?matrix\}",
        _convert_matrix, text
    )

    for cmd, char in _LATEX_GREEK.items():
        text = re.sub(rf"\\{cmd}(?![a-zA-Z])", char, text)

    text = text.replace("\\cdot", "·")
    text = text.replace("\\times", "×")
    text = text.replace("\\pm", "±")
    text = text.replace("\\mp", "∓")
    text = text.replace("\\leq", "≤")
    text = text.replace("\\geq", "≥")
    text = text.replace("\\neq", "≠")
    text = text.replace("\\approx", "≈")
    text = text.replace("\\infty", "∞")
    text = text.replace("\\langle", "⟨")
    text = text.replace("\\rangle", "⟩")
    text = text.replace("\\otimes", "⊗")
    text = text.replace("\\oplus", "⊕")
    text = text.replace("\\dagger", "†")
    text = text.replace("\\hbar", "ℏ")
    text = text.replace("\\ket", "|")
    text = text.replace("\\bra", "⟨")

    text = re.sub(r"\^(\{[^}]*\}|\w)", lambda m: m.group(1).strip("{}"), text)
    text = re.sub(r"_(\{[^}]*\}|\w)", lambda m: m.group(1).strip("{}"), text)

    text = re.sub(r"\\(?:text|mathrm|mathbf|mathit|operatorname)\{([^}]*)\}", r"\1", text)
    text = re.sub(r"\\[a-zA-Z]+", "", text)

    text = text.replace("{", "").replace("}", "")
    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()

TUTOR_JSON_SCHEMA = {
    "type": "object",
    "properties": {
        "explanation": {"type": "string"},
        "steps": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "step": {"type": "integer"},
                    "gate": {"type": "string"},
                    "qubits": {"type": "string"},
                    "action": {"type": "string"},
                    "stateAfter": {"type": "string"},
                },
                "required": ["step", "gate", "qubits", "action", "stateAfter"],
            },
        },
        "gateDefinitions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "gate": {"type": "string"},
                    "definition": {"type": "string"},
                    "matrix": {"type": "string"},
                },
                "required": ["gate", "definition"],
            },
        },
        "algorithm": {"type": "string"},
        "warningDetected": {"type": "boolean"},
        "warningMessage": {"type": "string"},
        "optimization": {"type": "string"},
    },
    "required": [
        "explanation",
        "steps",
        "gateDefinitions",
        "algorithm",
        "warningDetected",
        "warningMessage",
        "optimization",
    ],
    "additionalProperties": False,
}

TUTOR_SYSTEM_PROMPT = """\
You are a quantum computing tutor embedded in a visual circuit editor for beginners and \
intermediate learners. You receive the EXACT circuit (gates, qubits, time steps), its EXACT \
simulated results (statevector probabilities and Bloch sphere data), and any issues found by an \
automated rule-based checker. Ground EVERY claim strictly in this data — never invent gates, \
qubits, probabilities, or behavior not present.

Respond ONLY with a JSON object containing these fields:

1. "explanation" (string, 3-5 sentences):
   - Start by naming what the circuit does in plain English (e.g. "This circuit creates a Bell \
state — a maximally entangled pair of qubits.").
   - Reference the exact gates and qubits from the input.
   - Explain the key quantum phenomena at work (superposition, entanglement, interference, phase \
kickback, etc.) with a one-sentence definition the FIRST time each concept appears.
   - Tie the explanation to the simulation results: mention the actual probabilities or Bloch \
sphere states given.

2. "steps" (array of objects — one per gate/operation in time order):
   These steps are LAB INSTRUCTIONS — a learner should be able to rebuild this entire circuit \
from scratch by following them sequentially. Each step tells the learner what to place and why.
   Each step has:
   - "step": integer (1-based)
   - "gate": the gate name (e.g. "H", "CNOT", "RX(π/4)")
   - "qubits": which qubits it acts on (e.g. "q0", "q0 → q1")
   - "action": a lab-style instruction with two parts: (1) a placement directive telling the \
learner which gate to drag onto which qubit, and (2) one sentence explaining WHY this step \
matters and what it achieves in the context of the circuit. Use positional language: \
"Start by placing…" for step 1, "Next, place…" for middle steps, "Finally, add…" for \
measurement steps. \
(e.g. "Start by placing an H gate on q0. This puts q0 into superposition, preparing it for \
entanglement in the next step.")
   - "stateAfter": the quantum state after this step in Dirac notation \
(e.g. "(|00⟩ + |10⟩)/√2" or "|11⟩"). Use exact amplitudes from the simulation when possible.

3. "gateDefinitions" (array of objects — one per UNIQUE gate type used in this circuit):
   Each definition has:
   - "gate": gate name (e.g. "Hadamard (H)")
   - "definition": 1-2 sentence precise definition (e.g. "The Hadamard gate creates an equal \
superposition by mapping |0⟩ to (|0⟩+|1⟩)/√2 and |1⟩ to (|0⟩-|1⟩)/√2.")
   - "matrix" (optional): the matrix representation as a string (e.g. "[[1/√2, 1/√2], [1/√2, -1/√2]]")

4. "algorithm" (string):
   - If the circuit matches a known quantum algorithm or pattern, name it and give a one-sentence \
description. Known patterns: Bell state preparation, GHZ state, quantum teleportation, Deutsch \
algorithm, Bernstein-Vazirani, QFT, Grover diffusion, phase estimation, swap test, superdense \
coding, quantum error correction, variational circuit.
   - If it doesn't match any known pattern, say "Custom circuit — no standard algorithm detected."

5. "warningDetected" (boolean) and "warningMessage" (string):
   - If the automated checker found issues: set warningDetected=true, rewrite each issue as a \
clear, encouraging sentence explaining WHY it's a problem and HOW to fix it.
   - If the checker found nothing and you don't see a clear conceptual mistake in the data: set \
warningDetected=false and warningMessage="".
   - NEVER invent warnings. Only flag issues you can prove from the given circuit and results.

6. "optimization" (string):
   - Give exactly ONE concrete, actionable suggestion specific to THIS circuit.
   - Examples: "Remove the redundant H-H pair on q0", "Add measurements to see classical output", \
"Replace the three CNOT gates with a single Toffoli", "This 3-qubit circuit could be reduced to \
2 qubits."
   - If the circuit is empty, say "Add gates to build a circuit."
   - If the circuit is already minimal, say so clearly.

PRECISION RULES:
- Use Dirac notation (|0⟩, |1⟩, |+⟩, |−⟩) for states.
- Write rotation angles as fractions of π when applicable (π/2, π/4, not 1.5708).
- For entangled states, explicitly note which qubits are entangled and what that means \
for measurement correlation.
- When describing probabilities, use percentages matching the simulation data (e.g. "50.0%").
- If a qubit's Bloch vector has r < 1, explain it's in a mixed state due to entanglement.
"""


CHAT_SYSTEM_PROMPT = """\
You are the AI Tutor for Quantum Circuit Lab — a friendly, knowledgeable assistant who helps \
learners explore quantum computing and related computer science concepts.

=== SCOPE ===

Your primary focus is quantum computing, but you are conversational and flexible:

- **Core topics** (answer fully): quantum computing, quantum circuits, quantum gates, quantum \
  algorithms, quantum physics, quantum information, and this lab's interface.
- **Related CS & math** (answer when relevant): linear algebra, complexity theory, classical \
  logic gates, Boolean algebra, probability, Python/Qiskit/Cirq/PennyLane programming, data \
  structures and algorithms that connect to quantum (e.g. classical vs quantum search, \
  classical simulation of circuits, binary representations, Fourier transforms, cryptography, \
  number theory for Shor's, optimization for QAOA/VQE).
- **General CS** (answer briefly, then bridge to quantum): if someone asks about a general CS \
  concept like Big-O, sorting, or classical gates, give a concise answer and show how it \
  connects to quantum computing when possible.
- **Completely off-topic** (politely redirect): if the question has no connection to CS, math, \
  or quantum (e.g. cooking, geography, celebrities), gently say you're focused on quantum \
  computing and suggest a relevant question instead. Keep it friendly, not robotic.

=== CONVERSATION FLOW ===

- Always maintain context from the conversation history. If the user asks a follow-up like \
  "why?", "how?", "explain more", "what do you mean?", or "and then?" — continue from where \
  you left off. Never treat follow-ups as new isolated questions.
- If the user refers to something discussed earlier ("that algorithm", "the gate you mentioned", \
  "like you said"), connect back to it naturally.
- Greetings and casual conversation starters are fine — respond warmly and invite a quantum \
  question. Don't refuse simple "hi" or "how does this work?" messages.
- If the user asks "how does this lab work?" or "what can I do here?", explain the Quantum \
  Circuit Lab features.

=== CONTEXT AWARENESS ===

If the user's current circuit is provided, reference it in your answers when relevant. \
If no circuit is provided, give general explanations with simple illustrative examples.

=== PEDAGOGICAL APPROACH ===

1. Start with intuition before formalism — explain "why" before math.
2. Use analogies when helpful, but clarify where they break down.
3. Give a one-sentence definition, then a concrete circuit example.
4. Correct misconceptions gently with an explanation of why it matters.
5. Build on what the user already knows from earlier in the conversation.
6. Break algorithms into stages before showing the full circuit.
7. Encourage experimentation — suggest circuits to build in the lab.

=== FORMATTING RULES ===

- Use **bold** for key terms the first time they appear
- Use `backticks` for gate names: `H`, `CNOT`, `RY(π/2)`, `Measure`
- Use bullet lists (- item) for steps or comparisons
- Use numbered lists (1. item) for sequential procedures
- Use ### for section headings when the answer has multiple parts
- Quantum states: use Dirac notation with Unicode — |0⟩, |1⟩, |+⟩, |−⟩, |ψ⟩
- Matrices: write inline — [[1/√2, 1/√2], [1/√2, -1/√2]]
- NEVER use LaTeX (no \\( \\) \\[ \\] $ $$ \\begin \\end \\frac \\sqrt). The UI cannot render it.
- Fractions: 1/√2, cos(θ/2) — plain text only
- Greek letters: use Unicode — θ, π, φ, ψ — never \\theta, \\pi
- Code examples: use ```python blocks with valid Qiskit/Cirq/PennyLane syntax
- Keep answers under 300 words unless a full algorithm walkthrough is needed

=== LAB REFERENCE ===

Quantum Circuit Lab features (reference when guiding users):
- **Circuit Editor**: Drag-and-drop gates (H, X, Y, Z, S, T, S†, T†, RX, RY, RZ, CNOT, CZ, \
  SWAP, Toffoli, Measure) onto qubit wires
- **Simulation Panel**: Measurement probabilities as a bar chart
- **Bloch Spheres**: 3D visualization of each qubit's state
- **Q-Sphere**: Full multi-qubit state visualization
- **Code View**: Auto-generated Qiskit, Cirq, or PennyLane code
- **Backend Comparison**: Run on all three backends simultaneously
- **Tutorials**: Bell state, GHZ, superdense coding, teleportation, Deutsch-Jozsa, Grover's
- **Circuit Library**: Pre-built examples and saved circuits
- **Learner Page**: 10 concept cards (qubits through quantum algorithms)
"""


CIRCUIT_GEN_SYSTEM_PROMPT = """\
You generate a single short Qiskit circuit that demonstrates a specific quantum computing \
concept, for an editor that only understands a small, strict, line-oriented subset of Qiskit.

=== OUTPUT FORMAT — FOLLOW EXACTLY ===

Output ONLY Python code. No markdown code fences, no explanation, no comments — just the \
code, one statement per line, in this exact order: the QuantumCircuit line first, then gates, \
then measurements last.

Allowed lines (nothing else is understood):
  qc = QuantumCircuit(<qubits>, <classicalBits>)
  qc.h(<qubit>)
  qc.x(<qubit>)
  qc.y(<qubit>)
  qc.z(<qubit>)
  qc.s(<qubit>)
  qc.t(<qubit>)
  qc.rx(<theta>, <qubit>)
  qc.ry(<theta>, <qubit>)
  qc.rz(<theta>, <qubit>)
  qc.cx(<control>, <target>)
  qc.cz(<control>, <target>)
  qc.swap(<q0>, <q1>)
  qc.measure(<qubit>, <qubit>)

<theta> may be a number, "pi", "pi/2", "2*pi", or "-pi/4" — no variables, no other functions.
qc.measure's two arguments must be the same qubit index (e.g. qc.measure(1, 1)).

=== HARD RULES ===

- Exactly one qc = QuantumCircuit(...) line, and it must be first.
- No loops, no conditionals, no variables, no functions, no imports, no print statements, no \
  comments, no blank lines — only the exact statement forms listed above, one per line.
- Use 2 to 4 qubits. classicalBits must equal qubits.
- End with one qc.measure(i, i) line for every qubit, in order, so the result is visible.
- The circuit must genuinely illustrate the given concept, using real gates that connect to \
  it — not a generic filler circuit. If the concept itself isn't a specific gate/algorithm \
  (e.g. it's about hardware, history, or business context), build the closest reasonable \
  illustrative circuit (e.g. superposition or entanglement) rather than refusing.
"""


class LLMNotConfiguredError(RuntimeError):
    """Raised when generate() is called but no provider credentials are set."""


class LLMProviderError(RuntimeError):
    """Raised when the provider is configured but the request itself failed
    (network error, malformed response, etc.)."""


class TutorLLMOutput:
    __slots__ = (
        "explanation",
        "steps",
        "gate_definitions",
        "algorithm",
        "warning_detected",
        "warning_message",
        "optimization",
    )

    def __init__(
        self,
        explanation: str,
        warning_detected: bool,
        warning_message: str,
        optimization: str,
        steps: list[dict] | None = None,
        gate_definitions: list[dict] | None = None,
        algorithm: str = "",
    ):
        self.explanation = explanation
        self.steps = steps or []
        self.gate_definitions = gate_definitions or []
        self.algorithm = algorithm
        self.warning_detected = warning_detected
        self.warning_message = warning_message
        self.optimization = optimization


class TutorLLMProvider(Protocol):
    def is_configured(self) -> bool: ...

    def generate(
        self, *, circuit_summary: str, simulation_summary: str, detected_issues: list[str]
    ) -> TutorLLMOutput: ...

    def warm_up(self) -> None: ...


def _build_user_prompt(circuit_summary: str, simulation_summary: str, detected_issues: list[str]) -> str:
    issues_block = "\n".join(f"- {issue}" for issue in detected_issues) if detected_issues else "(none found)"
    return (
        f"=== CIRCUIT ===\n{circuit_summary}\n\n"
        f"=== SIMULATION RESULTS ===\n{simulation_summary}\n\n"
        f"=== AUTOMATED CHECKER FINDINGS ===\n{issues_block}\n\n"
        "Analyze this circuit. Respond with the JSON object described in your instructions."
    )


class GroqTutorProvider:
    """Cloud LLM via Groq (https://groq.com) — requires a GROQ_API_KEY
    environment variable. Uses Groq's OpenAI-compatible chat completions API.

    Default model: qwen/qwen3.8-27b.
    Override with the GROQ_MODEL env var.

    Supports automatic key rotation: set GROQ_API_KEYS as a comma-separated
    list of keys. On 429/401 errors, the provider rotates to the next key."""

    def __init__(self, api_key: str | None = None, model: str | None = None, timeout: float = 60.0):
        keys_csv = os.environ.get("GROQ_API_KEYS", "")
        if keys_csv:
            self._keys = [k.strip() for k in keys_csv.split(",") if k.strip()]
        else:
            single = api_key or os.environ.get("GROQ_API_KEY", "")
            self._keys = [single] if single else []
        self._key_cycle = itertools.cycle(self._keys) if self._keys else None
        self._lock = threading.Lock()
        self._api_key = self._next_key()
        self._model = model or os.environ.get("GROQ_MODEL", GROQ_DEFAULT_MODEL)
        self._base_url = "https://api.groq.com/openai/v1/chat/completions"
        self._timeout = timeout

    def _next_key(self) -> str:
        if not self._key_cycle:
            return ""
        with self._lock:
            return next(self._key_cycle)

    def _rotate_key(self) -> str:
        key = self._next_key()
        self._api_key = key
        return key

    def is_configured(self) -> bool:
        return bool(self._api_key)

    def warm_up(self) -> None:
        pass

    def _post_with_rotation(self, payload: dict) -> dict:
        """POST to the Groq API, rotating keys on 429/401 errors."""
        import httpx

        last_exc = None
        for _ in range(len(self._keys) or 1):
            try:
                resp = httpx.post(
                    self._base_url,
                    json=payload,
                    headers={
                        "Authorization": f"Bearer {self._api_key}",
                        "Content-Type": "application/json",
                    },
                    timeout=self._timeout,
                )
                resp.raise_for_status()
                return resp.json()
            except httpx.HTTPStatusError as exc:
                if exc.response.status_code in (429, 401) and len(self._keys) > 1:
                    self._rotate_key()
                    last_exc = exc
                    continue
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

        error_detail = ""
        if last_exc:
            try:
                error_detail = last_exc.response.json().get("error", {}).get("message", "")
            except Exception:
                pass
        raise LLMProviderError(f"All API keys exhausted (rate limited): {error_detail}")

    def generate(
        self, *, circuit_summary: str, simulation_summary: str, detected_issues: list[str]
    ) -> TutorLLMOutput:
        if not self._api_key:
            raise LLMNotConfiguredError(
                "GROQ_API_KEY environment variable is not set. "
                "Get a free key at https://console.groq.com"
            )

        payload = {
            "model": self._model,
            "messages": [
                {"role": "system", "content": TUTOR_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": _build_user_prompt(circuit_summary, simulation_summary, detected_issues),
                },
            ],
            "temperature": 0.15,
            "max_tokens": 2048,
            "response_format": {"type": "json_object"},
        }

        body = self._post_with_rotation(payload)

        try:
            text = body["choices"][0]["message"]["content"]
            text = re.sub(r"<think>[\s\S]*?</think>\s*", "", text)
            data = json.loads(text)
            return TutorLLMOutput(
                explanation=data["explanation"],
                steps=data.get("steps", []),
                gate_definitions=data.get("gateDefinitions", []),
                algorithm=data.get("algorithm", ""),
                warning_detected=bool(data["warningDetected"]),
                warning_message=data.get("warningMessage", ""),
                optimization=data.get("optimization", ""),
            )
        except (KeyError, IndexError, json.JSONDecodeError) as exc:
            raise LLMProviderError(f"Unexpected Groq response shape: {exc}") from exc

    def _build_chat_messages(
        self,
        question: str,
        circuit_context: str | None = None,
        history: list[dict[str, str]] | None = None,
        rag_context: str | None = None,
    ) -> list[dict]:
        messages: list[dict] = [{"role": "system", "content": CHAT_SYSTEM_PROMPT}]

        if rag_context:
            messages.append({
                "role": "system",
                "content": (
                    "=== KNOWLEDGE BASE CONTEXT ===\n"
                    "The following excerpts come from authoritative quantum computing documentation. "
                    "Ground your answer in these sources. Cite them using bracketed numbers like [1], [2]. "
                    "If the excerpts don't contain enough information to answer, say so honestly and answer "
                    "from your general knowledge, making it clear you're doing so.\n\n"
                    f"{rag_context}"
                ),
            })

        if circuit_context:
            messages.append({
                "role": "system",
                "content": f"The user's current circuit:\n{circuit_context}",
            })

        if history:
            messages.extend(history)

        messages.append({"role": "user", "content": question})
        return messages

    def chat(
        self,
        *,
        question: str,
        circuit_context: str | None = None,
        history: list[dict[str, str]] | None = None,
        rag_context: str | None = None,
    ) -> str:
        if not self._api_key:
            raise LLMNotConfiguredError(
                "GROQ_API_KEY environment variable is not set. "
                "Get a free key at https://console.groq.com"
            )

        messages = self._build_chat_messages(question, circuit_context, history, rag_context)

        body = self._post_with_rotation({
            "model": self._model,
            "messages": messages,
            "temperature": 0.3,
            "max_tokens": 1024,
        })

        try:
            raw = body["choices"][0]["message"]["content"]
            raw = re.sub(r"<think>[\s\S]*?</think>\s*", "", raw)
            return _strip_latex(raw)
        except (KeyError, IndexError) as exc:
            raise LLMProviderError(f"Unexpected Groq response shape: {exc}") from exc

    async def chat_stream(
        self,
        *,
        question: str,
        circuit_context: str | None = None,
        history: list[dict[str, str]] | None = None,
        rag_context: str | None = None,
    ) -> AsyncIterator[str]:
        if not self._api_key:
            raise LLMNotConfiguredError(
                "GROQ_API_KEY environment variable is not set. "
                "Get a free key at https://console.groq.com"
            )

        import httpx

        messages = self._build_chat_messages(question, circuit_context, history, rag_context)

        payload = {
            "model": self._model,
            "messages": messages,
            "temperature": 0.3,
            "max_tokens": 1024,
            "stream": True,
        }

        in_think = False
        last_exc = None
        for _ in range(len(self._keys) or 1):
            try:
                async with httpx.AsyncClient(timeout=self._timeout) as client:
                    async with client.stream(
                        "POST",
                        self._base_url,
                        json=payload,
                        headers={
                            "Authorization": f"Bearer {self._api_key}",
                            "Content-Type": "application/json",
                        },
                    ) as resp:
                        if resp.status_code in (429, 401) and len(self._keys) > 1:
                            self._rotate_key()
                            payload_copy = payload.copy()
                            last_exc = LLMProviderError(f"HTTP {resp.status_code}")
                            continue
                        resp.raise_for_status()

                        async for line in resp.aiter_lines():
                            if not line.startswith("data: "):
                                continue
                            data_str = line[6:]
                            if data_str.strip() == "[DONE]":
                                return
                            try:
                                chunk = json.loads(data_str)
                                delta = chunk["choices"][0].get("delta", {})
                                token = delta.get("content", "")
                            except (json.JSONDecodeError, KeyError, IndexError):
                                continue

                            if not token:
                                continue

                            if "<think>" in token:
                                in_think = True
                                token = token.split("<think>")[0]
                            if in_think:
                                if "</think>" in token:
                                    in_think = False
                                    token = token.split("</think>", 1)[1]
                                else:
                                    continue

                            if token:
                                yield token
                        return
            except httpx.HTTPStatusError as exc:
                if exc.response.status_code in (429, 401) and len(self._keys) > 1:
                    self._rotate_key()
                    last_exc = exc
                    continue
                raise LLMProviderError(
                    f"Groq API returned {exc.response.status_code}"
                ) from exc
            except httpx.HTTPError as exc:
                raise LLMProviderError(f"Groq streaming request failed: {exc}") from exc

        raise LLMProviderError(f"All API keys exhausted (rate limited)")

    def generate_circuit_code(self, *, title: str, description: str) -> str:
        if not self._api_key:
            raise LLMNotConfiguredError(
                "GROQ_API_KEY environment variable is not set. "
                "Get a free key at https://console.groq.com"
            )

        user_prompt = f"Concept: {title}\n\nContent excerpt:\n{description[:2000]}\n\nGenerate the circuit now."

        body = self._post_with_rotation({
            "model": self._model,
            "messages": [
                {"role": "system", "content": CIRCUIT_GEN_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.2,
            "max_tokens": 512,
        })

        try:
            raw = body["choices"][0]["message"]["content"]
        except (KeyError, IndexError) as exc:
            raise LLMProviderError(f"Unexpected Groq response shape: {exc}") from exc

        raw = re.sub(r"<think>[\s\S]*?</think>\s*", "", raw).strip()
        # Defensive: strip a markdown fence if the model adds one despite instructions.
        raw = re.sub(r"^```(?:python)?\s*\n?", "", raw)
        raw = re.sub(r"\n?```\s*$", "", raw)
        return raw.strip()
