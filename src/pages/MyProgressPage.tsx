import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProgress, type AssessmentSummary } from "../api/assessments-api";
import { useAssessmentStore } from "../state/assessment-store";
import { useLearningData } from "./learning-center/useLearningData";
import { isAutoGradable } from "./learning-center/assessment/grading";
import "./PageHeader.css";
import "./MyProgressPage.css";

interface AssessmentRow extends AssessmentSummary {
  /** Total questions in the assessment, from the content — lets a partial
   * attempt be shown against the real denominator. */
  totalQuestions: number;
  totalChallenges: number;
  moduleTitle: string;
}

const percentOf = (row: { best_score: number; max_score: number }) =>
  row.max_score > 0 ? Math.round((row.best_score / row.max_score) * 100) : null;

export function MyProgressPage() {
  const navigate = useNavigate();
  const { roadmap } = useLearningData();
  const bestScores = useAssessmentStore((s) => s.bestScores);
  const passedChallenges = useAssessmentStore((s) => s.passedChallenges);

  const [remote, setRemote] = useState<AssessmentSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  // Every assessment in the content, so the page can show what is left to do —
  // not only what has been attempted.
  const catalogue = useMemo(() => {
    const map = new Map<string, { title: string; moduleTitle: string; questions: number; challenges: number }>();
    for (const stage of roadmap) {
      for (const learningModule of stage.modules) {
        for (const concept of learningModule.concepts) {
          if (concept.type !== "assessment" || !concept.assessment) continue;
          map.set(concept.sourceFile, {
            title: concept.title,
            moduleTitle: learningModule.title,
            questions: concept.assessment.questions?.length ?? 0,
            challenges: (concept.assessment.challenges ?? []).filter(isAutoGradable).length,
          });
        }
      }
    }
    return map;
  }, [roadmap]);

  // No setState before the first await — `loading` already starts true, and a
  // synchronous set here would cascade an extra render on mount.
  const load = useCallback(async () => {
    try {
      const data = await getMyProgress();
      setRemote(data.assessments);
      setOffline(false);
    } catch {
      // Signed out or backend down — fall back to the local store below.
      setRemote(null);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /** Server rows when available, otherwise the localStorage copy, so the page
   * is still useful offline. Titles come from the content in both cases. */
  const rows = useMemo<AssessmentRow[]>(() => {
    const source: AssessmentSummary[] =
      remote ??
      Object.entries(bestScores).map(([sourceFile, best]) => ({
        source_file: sourceFile,
        concept_title: catalogue.get(sourceFile)?.title ?? sourceFile,
        best_score: best.score,
        max_score: best.maxScore,
        attempts: best.attempts,
        challenges_passed: Object.keys(passedChallenges).filter((k) => k.startsWith(`${sourceFile}::`)).length,
        passed: best.maxScore > 0 && best.score === best.maxScore,
        last_attempt_at: best.updatedAt,
      }));

    return source
      .map((row) => {
        const meta = catalogue.get(row.source_file);
        return {
          ...row,
          concept_title: row.concept_title || meta?.title || row.source_file,
          moduleTitle: meta?.moduleTitle ?? "",
          totalQuestions: meta?.questions ?? row.max_score,
          totalChallenges: meta?.challenges ?? 0,
        };
      })
      .sort((a, b) => b.last_attempt_at.localeCompare(a.last_attempt_at));
  }, [remote, bestScores, passedChallenges, catalogue]);

  const stats = useMemo(() => {
    const scored = rows.filter((r) => r.max_score > 0);
    const average = scored.length
      ? Math.round(scored.reduce((sum, r) => sum + r.best_score / r.max_score, 0) / scored.length * 100)
      : null;
    return {
      attempted: rows.length,
      total: catalogue.size,
      average,
      perfect: scored.filter((r) => r.best_score === r.max_score).length,
      needsWork: scored.filter((r) => percentOf(r)! < 60).length,
      challenges: rows.reduce((sum, r) => sum + r.challenges_passed, 0),
    };
  }, [rows, catalogue]);

  return (
    <div className="progress-page">
      <header className="page-header">
        <button type="button" className="page-home-btn" onClick={() => navigate("/learner-module")}>
          ← Back to Roadmap
        </button>
      </header>

      <div className="page-intro">
        <p className="page-eyebrow">Learner</p>
        <h1 className="page-title">My Assessment Progress</h1>
        <p className="page-subtitle">Best score for every assessment you've attempted.</p>
      </div>

      {offline && (
        <p className="progress-notice">
          Showing locally saved results — sign in, or start the backend, to see progress synced across devices.
        </p>
      )}

      {loading && rows.length === 0 ? (
        <p className="progress-empty">Loading your progress…</p>
      ) : rows.length === 0 ? (
        <div className="progress-empty">
          <p>You haven't submitted an assessment yet.</p>
          <button type="button" className="page-home-btn" onClick={() => navigate("/learner-module")}>
            Go to the roadmap →
          </button>
        </div>
      ) : (
        <>
          <div className="progress-stats">
            <StatTile label="Assessments attempted" value={`${stats.attempted} / ${stats.total}`} />
            <StatTile label="Average score" value={stats.average === null ? "—" : `${stats.average}%`} />
            <StatTile label="Full marks" value={String(stats.perfect)} />
            <StatTile label="Challenges passed" value={String(stats.challenges)} />
            <StatTile label="Below 60%" value={String(stats.needsWork)} tone={stats.needsWork > 0 ? "warn" : undefined} />
          </div>

          <div className="progress-table-wrap">
            <table className="progress-table">
              <thead>
                <tr>
                  <th>Assessment</th>
                  <th>Module</th>
                  <th>Best score</th>
                  <th>%</th>
                  <th>Attempts</th>
                  <th>Challenges</th>
                  <th>Last attempt</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const pct = percentOf(row);
                  return (
                    <tr key={row.source_file}>
                      <td className="progress-title-cell">{row.concept_title}</td>
                      <td className="progress-module-cell">{row.moduleTitle || "—"}</td>
                      <td>
                        {row.max_score > 0 ? (
                          `${row.best_score} / ${row.max_score}`
                        ) : (
                          <span className="progress-muted">quiz not attempted</span>
                        )}
                      </td>
                      <td>
                        {pct === null ? (
                          <span className="progress-muted">—</span>
                        ) : (
                          <span className={`progress-pct ${pct === 100 ? "is-perfect" : pct >= 60 ? "is-pass" : "is-low"}`}>
                            {pct}%
                          </span>
                        )}
                      </td>
                      <td>{row.attempts}</td>
                      <td>
                        {row.totalChallenges > 0 ? `${row.challenges_passed} / ${row.totalChallenges}` : "—"}
                      </td>
                      <td>{new Date(row.last_attempt_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function StatTile({ label, value, tone }: { label: string; value: string; tone?: "warn" }) {
  return (
    <div className={`progress-stat ${tone === "warn" ? "is-warn" : ""}`}>
      <span className="progress-stat-value">{value}</span>
      <span className="progress-stat-label">{label}</span>
    </div>
  );
}
