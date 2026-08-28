from app.models import QuantumCircuitModel
from app.models import QuantumOperationModel as Op
from app.tutor_checks import (
    analyze_circuit,
    find_gates_after_measurement,
    find_measurement_before_entanglement,
    find_missing_superposition_before_control,
    find_redundant_self_inverse_pairs,
)


def _circuit(ops, qubits=2, classical_bits=2):
    return QuantumCircuitModel(version=1, qubits=qubits, classicalBits=classical_bits, operations=ops)


def _op(id_, gate, targets, controls=None, timeStep=0, parameters=None):
    return Op(id=id_, gate=gate, targets=targets, controls=controls, timeStep=timeStep, parameters=parameters)


def test_empty_circuit_has_no_issues():
    assert analyze_circuit(_circuit([])) == []


def test_redundant_hh_pair_detected():
    c = _circuit([_op("a", "h", [0], timeStep=0), _op("b", "h", [0], timeStep=1)])
    issues = find_redundant_self_inverse_pairs(c)
    assert len(issues) == 1
    assert "cancels" in issues[0]


def test_redundant_pair_not_flagged_across_different_qubits():
    c = _circuit([_op("a", "h", [0], timeStep=0), _op("b", "h", [1], timeStep=1)])
    assert find_redundant_self_inverse_pairs(c) == []


def test_redundant_pair_not_flagged_if_interrupted():
    c = _circuit(
        [
            _op("a", "h", [0], timeStep=0),
            _op("b", "x", [0], timeStep=1),
            _op("c", "h", [0], timeStep=2),
        ]
    )
    assert find_redundant_self_inverse_pairs(c) == []


def test_non_self_inverse_gate_never_flagged():
    c = _circuit([_op("a", "t", [0], timeStep=0), _op("b", "t", [0], timeStep=1)])
    assert find_redundant_self_inverse_pairs(c) == []


def test_measurement_before_entanglement_detected():
    c = _circuit(
        [
            _op("a", "h", [0], timeStep=0),
            _op("m", "measure", [0], timeStep=1),
            _op("cx", "cx", [1], controls=[0], timeStep=2),
        ]
    )
    issues = find_measurement_before_entanglement(c)
    assert len(issues) == 1
    assert "measured" in issues[0]


def test_no_measurement_before_entanglement_when_entangled_first():
    c = _circuit(
        [
            _op("a", "h", [0], timeStep=0),
            _op("cx", "cx", [1], controls=[0], timeStep=1),
            _op("m", "measure", [0], timeStep=2),
        ]
    )
    assert find_measurement_before_entanglement(c) == []


def test_gate_after_measurement_detected():
    c = _circuit([_op("m", "measure", [0], timeStep=0), _op("x", "x", [0], timeStep=1)])
    issues = find_gates_after_measurement(c)
    assert len(issues) == 1


def test_missing_superposition_before_cx_control_detected():
    c = _circuit([_op("cx", "cx", [1], controls=[0], timeStep=0)])
    issues = find_missing_superposition_before_control(c)
    assert len(issues) == 1
    assert "qubit 0" in issues[0]


def test_h_before_cx_control_suppresses_warning():
    c = _circuit(
        [
            _op("h", "h", [0], timeStep=0),
            _op("cx", "cx", [1], controls=[0], timeStep=1),
        ]
    )
    assert find_missing_superposition_before_control(c) == []


def test_analyze_circuit_aggregates_all_checks():
    c = _circuit(
        [
            _op("a", "h", [0], timeStep=0),
            _op("b", "h", [0], timeStep=1),
            _op("cx", "cx", [1], controls=[0], timeStep=2),
        ]
    )
    issues = analyze_circuit(c)
    assert len(issues) >= 1
