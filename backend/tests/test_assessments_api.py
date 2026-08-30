"""Tests for /api/assessments.

Runs against a temp-file SQLite database rather than Postgres: the models use
portable column types (JSON, not JSONB), so the same metadata creates cleanly on
both. `get_db` and the auth dependencies are overridden so no Redis session or
Google OAuth round-trip is needed.

Fixtures are synchronous (the rest of the suite has no pytest-asyncio) — setup
runs through `asyncio.run`, and the engine uses NullPool so no connection is
carried from that throwaway loop into the one TestClient runs the app on. A
file-backed DB rather than `:memory:` for the same reason: an in-memory SQLite
database only exists for the connection that created it.
"""

from __future__ import annotations

import asyncio
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.db.models import Base, GroupMembership, InstructorGroup, User, UserRole
from app.db.session import get_db
from app.deps import get_current_user
from app.main import app


@pytest.fixture
def session_factory(tmp_path):
    engine = create_async_engine(f"sqlite+aiosqlite:///{tmp_path}/test.db", poolclass=NullPool)

    async def create_all():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    asyncio.run(create_all())
    yield async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    asyncio.run(engine.dispose())


@pytest.fixture
def users(session_factory):
    """A student, the instructor who owns their group, and an unrelated instructor."""
    student = User(id=uuid.uuid4(), google_id="g-s", email="s@x.test", name="Sam Student")
    instructor = User(
        id=uuid.uuid4(), google_id="g-i", email="i@x.test", name="Ivy Instructor", role=UserRole.INSTRUCTOR
    )
    other = User(
        id=uuid.uuid4(), google_id="g-o", email="o@x.test", name="Otto Other", role=UserRole.INSTRUCTOR
    )
    group = InstructorGroup(id=uuid.uuid4(), name="QC 101", code="ABC123", instructor_id=instructor.id)
    membership = GroupMembership(id=uuid.uuid4(), user_id=student.id, group_id=group.id)

    async def seed():
        async with session_factory() as db:
            db.add_all([student, instructor, other, group, membership])
            await db.commit()

    asyncio.run(seed())
    return {"student": student, "instructor": instructor, "other": other, "group": group}


@pytest.fixture
def client(session_factory, users):
    """TestClient with the DB overridden; call `as_user` to set the caller.

    Deliberately *not* used as a context manager — that would run the app's
    startup lifespan, which calls init_redis() and create_tables() against the
    real Redis and Postgres. The rest of the suite avoids it for the same
    reason.
    """

    async def override_get_db():
        async with session_factory() as db:
            yield db

    app.dependency_overrides[get_db] = override_get_db
    current = {"user": users["student"]}

    async def override_current_user():
        return current["user"]

    app.dependency_overrides[get_current_user] = override_current_user

    c = TestClient(app)
    c.as_user = lambda u: current.__setitem__("user", u)  # type: ignore[attr-defined]
    yield c

    app.dependency_overrides.clear()


def _quiz(source_file="courses/a.ipynb-assessment", score=4, max_score=5, passed=False):
    return {
        "source_file": source_file,
        "concept_title": "Assessment — CHSH game",
        "kind": "quiz",
        "challenge_id": None,
        "score": score,
        "max_score": max_score,
        "passed": passed,
        "answers": [{"index": 0, "id": "Q1", "chosen": "C"}],
    }


class TestRecordAttempt:
    def test_records_and_returns_the_attempt(self, client):
        res = client.post("/api/assessments/attempts", json=_quiz())
        assert res.status_code == 201, res.text
        body = res.json()
        assert body["score"] == 4
        assert body["max_score"] == 5
        assert body["kind"] == "quiz"
        assert body["concept_title"] == "Assessment — CHSH game"
        assert uuid.UUID(body["id"])

    def test_rejects_a_score_above_max_score(self, client):
        res = client.post("/api/assessments/attempts", json=_quiz(score=9, max_score=5))
        assert res.status_code == 422
        assert "max_score" in res.text

    def test_rejects_an_unknown_kind(self, client):
        res = client.post("/api/assessments/attempts", json={**_quiz(), "kind": "essay"})
        assert res.status_code == 422

    def test_accepts_a_challenge_attempt_with_submitted_code(self, client):
        res = client.post(
            "/api/assessments/attempts",
            json={
                "source_file": "courses/a.ipynb-assessment",
                "concept_title": "Assessment — CHSH game",
                "kind": "challenge",
                "challenge_id": "challenge-1",
                "score": 1,
                "max_score": 1,
                "passed": True,
                "answers": {"code": "qc = QuantumCircuit(2)\nqc.h(0)"},
            },
        )
        assert res.status_code == 201
        assert res.json()["challenge_id"] == "challenge-1"
        assert res.json()["passed"] is True


class TestMyProgress:
    def test_keeps_the_best_score_across_retries_and_counts_attempts(self, client):
        client.post("/api/assessments/attempts", json=_quiz(score=2))
        client.post("/api/assessments/attempts", json=_quiz(score=5, passed=True))
        client.post("/api/assessments/attempts", json=_quiz(score=3))

        res = client.get("/api/assessments/progress")
        assert res.status_code == 200
        assessments = res.json()["assessments"]
        assert len(assessments) == 1
        assert assessments[0]["best_score"] == 5, "a later worse retry must not lower the best score"
        assert assessments[0]["attempts"] == 3
        assert assessments[0]["passed"] is True

    def test_separates_distinct_assessments(self, client):
        client.post("/api/assessments/attempts", json=_quiz(source_file="courses/a", score=5))
        client.post("/api/assessments/attempts", json=_quiz(source_file="courses/b", score=1))
        res = client.get("/api/assessments/progress")
        by_source = {a["source_file"]: a for a in res.json()["assessments"]}
        assert by_source["courses/a"]["best_score"] == 5
        assert by_source["courses/b"]["best_score"] == 1

    def test_is_empty_for_a_learner_with_no_attempts(self, client):
        assert client.get("/api/assessments/progress").json()["assessments"] == []

    def test_reports_challenges_separately_from_the_quiz_mark(self, client):
        client.post("/api/assessments/attempts", json=_quiz(score=4, max_score=5))
        for cid in ("challenge-1", "challenge-2", "challenge-1"):  # repeat must not double-count
            client.post(
                "/api/assessments/attempts",
                json={**_quiz(), "kind": "challenge", "challenge_id": cid, "score": 1, "max_score": 1, "passed": True},
            )

        row = client.get("/api/assessments/progress").json()["assessments"][0]
        assert row["best_score"] == 4, "a 1/1 challenge must not overwrite the quiz mark"
        assert row["max_score"] == 5
        assert row["attempts"] == 1, "challenge attempts are not quiz attempts"
        assert row["challenges_passed"] == 2

    def test_a_challenge_only_assessment_has_no_quiz_mark(self, client):
        client.post(
            "/api/assessments/attempts",
            json={**_quiz(), "kind": "challenge", "challenge_id": "challenge-1", "score": 1, "max_score": 1, "passed": True},
        )
        row = client.get("/api/assessments/progress").json()["assessments"][0]
        # 0/0 rather than 1/1, so it can't be mistaken for — or averaged as — 100%.
        assert (row["best_score"], row["max_score"]) == (0, 0)
        assert row["challenges_passed"] == 1
        assert row["passed"] is True

    def test_does_not_leak_another_learners_attempts(self, client, users):
        client.post("/api/assessments/attempts", json=_quiz(score=5))
        client.as_user(users["instructor"])
        assert client.get("/api/assessments/progress").json()["assessments"] == []


class TestGroupProgress:
    def test_instructor_sees_their_members_scores(self, client, users):
        client.post("/api/assessments/attempts", json=_quiz(score=4, max_score=5, passed=True))
        client.post(
            "/api/assessments/attempts",
            json={**_quiz(), "kind": "challenge", "challenge_id": "challenge-1", "score": 1, "max_score": 1, "passed": True},
        )

        client.as_user(users["instructor"])
        res = client.get(f"/api/assessments/groups/{users['group'].id}/progress")
        assert res.status_code == 200, res.text
        members = res.json()["members"]
        assert len(members) == 1
        row = members[0]
        assert row["name"] == "Sam Student"
        assert row["quizzes_attempted"] == 1
        assert row["challenges_passed"] == 1
        assert row["average_percent"] == 80.0
        assert row["last_activity_at"] is not None

    def test_reports_a_member_with_no_attempts_rather_than_omitting_them(self, client, users):
        client.as_user(users["instructor"])
        res = client.get(f"/api/assessments/groups/{users['group'].id}/progress")
        members = res.json()["members"]
        assert len(members) == 1
        assert members[0]["average_percent"] is None
        assert members[0]["quizzes_attempted"] == 0

    def test_forbids_an_instructor_reading_someone_elses_group(self, client, users):
        client.as_user(users["other"])
        res = client.get(f"/api/assessments/groups/{users['group'].id}/progress")
        assert res.status_code == 403

    def test_forbids_a_student_entirely(self, client, users):
        res = client.get(f"/api/assessments/groups/{users['group'].id}/progress")
        assert res.status_code == 403

    def test_admin_may_read_any_group(self, client, users, session_factory):
        client.post("/api/assessments/attempts", json=_quiz(score=5, passed=True))
        users["other"].role = UserRole.ADMIN
        client.as_user(users["other"])
        res = client.get(f"/api/assessments/groups/{users['group'].id}/progress")
        assert res.status_code == 200
        assert res.json()["members"][0]["average_percent"] == 100.0

    def test_404s_on_an_unknown_group(self, client, users):
        client.as_user(users["instructor"])
        res = client.get(f"/api/assessments/groups/{uuid.uuid4()}/progress")
        assert res.status_code == 404


class TestAuthRequired:
    def test_anonymous_callers_are_rejected(self, session_factory):
        """With no get_current_user override, the real dependency runs and 401s.

        No session cookie is sent, so the session middleware never reaches Redis
        and hands the request an empty session.
        """

        async def override_get_db():
            async with session_factory() as db:
                yield db

        app.dependency_overrides[get_db] = override_get_db
        try:
            c = TestClient(app)
            assert c.get("/api/assessments/progress").status_code == 401
            assert c.post("/api/assessments/attempts", json=_quiz()).status_code == 401
            assert c.get(f"/api/assessments/groups/{uuid.uuid4()}/progress").status_code == 401
        finally:
            app.dependency_overrides.clear()
