from fastapi.testclient import TestClient

from app.llm_provider import LLMProviderError, TutorLLMOutput
from app.main import app, get_tutor_provider

client = TestClient(app)


class FakeProvider:
    def __init__(self, configured=True, output=None, raise_error=None):
        self._configured = configured
        self._output = output or TutorLLMOutput(
            explanation="This circuit puts qubit 0 into superposition with H.",
            warning_detected=False,
            warning_message="",
            optimization="Nothing to simplify here.",
        )
        self._raise_error = raise_error

    def is_configured(self):
        return self._configured

    def generate(self, *, circuit_summary, simulation_summary, detected_issues):
        if self._raise_error:
            raise self._raise_error
        return self._output


def _circuit(ops, qubits=2, classical_bits=2):
    return {"version": 1, "qubits": qubits, "classicalBits": classical_bits, "operations": ops}


def teardown_function():
    app.dependency_overrides.clear()


def test_analyze_with_configured_llm_returns_llm_output():
    app.dependency_overrides[get_tutor_provider] = lambda: FakeProvider()
    resp = client.post(
        "/api/tutor/analyze",
        json={"circuit": _circuit([{"id": "a", "gate": "h", "targets": [0], "timeStep": 0}])},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["source"] == "llm"
    assert "superposition" in data["explanation"]
    assert data["warning"]["detected"] is False


def test_analyze_without_configured_llm_falls_back_to_deterministic():
    app.dependency_overrides[get_tutor_provider] = lambda: FakeProvider(configured=False)
    resp = client.post(
        "/api/tutor/analyze",
        json={
            "circuit": _circuit(
                [
                    {"id": "a", "gate": "h", "targets": [0], "timeStep": 0},
                    {"id": "b", "gate": "h", "targets": [0], "timeStep": 1},
                ]
            )
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["source"] == "deterministic"
    assert data["warning"]["detected"] is True  # redundant H;H pair caught deterministically


def test_deterministic_warning_survives_even_if_llm_misses_it():
    llm_output = TutorLLMOutput(
        explanation="Circuit applies two Hadamards to qubit 0.",
        warning_detected=False,  # LLM missed it
        warning_message="",
        optimization="Remove the redundant pair.",
    )
    app.dependency_overrides[get_tutor_provider] = lambda: FakeProvider(output=llm_output)
    resp = client.post(
        "/api/tutor/analyze",
        json={
            "circuit": _circuit(
                [
                    {"id": "a", "gate": "h", "targets": [0], "timeStep": 0},
                    {"id": "b", "gate": "h", "targets": [0], "timeStep": 1},
                ]
            )
        },
    )
    data = resp.json()
    assert data["warning"]["detected"] is True  # deterministic finding wasn't dropped


def test_invalid_circuit_returns_422():
    app.dependency_overrides[get_tutor_provider] = lambda: FakeProvider()
    resp = client.post(
        "/api/tutor/analyze",
        json={"circuit": _circuit([{"id": "a", "gate": "toffoli", "targets": [0], "timeStep": 0}])},
    )
    assert resp.status_code == 422


def test_llm_failure_falls_back_to_deterministic():
    app.dependency_overrides[get_tutor_provider] = lambda: FakeProvider(raise_error=LLMProviderError("boom"))
    resp = client.post(
        "/api/tutor/analyze",
        json={"circuit": _circuit([{"id": "a", "gate": "h", "targets": [0], "timeStep": 0}])},
    )
    assert resp.status_code == 200
    assert resp.json()["source"] == "deterministic"


def test_empty_circuit_analyzes_cleanly():
    app.dependency_overrides[get_tutor_provider] = lambda: FakeProvider()
    resp = client.post("/api/tutor/analyze", json={"circuit": _circuit([])})
    assert resp.status_code == 200
    data = resp.json()
    assert data["warning"]["detected"] is False
