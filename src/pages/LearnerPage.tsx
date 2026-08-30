import { useCallback, useMemo, useState } from "react";
import "./PageHeader.css";
import "./LearnerPage.css";
import "../App.css";
import { useCircuitStore } from "../state/circuit-store";
import { useUiStore } from "../state/ui-store";
import {
  useLearnerProgressStore,
  getTopicStatus,
  getOverallProgress,
  getRecommendedTopic,
  STATUS_GLYPH,
} from "../state/learner-progress-store";
import {
  ROADMAP,
  getTopic,
  getNextTopic,
  getSectionForTopic,
  type RoadmapTopic,
  type RoadmapSection,
} from "../learner/roadmap";
import { TopicDetailPanel } from "./learner/TopicDetailPanel";
import { RoadmapFlow } from "./learner/RoadmapFlow";
import { RoadmapMainTree } from "./learner/RoadmapMainTree";

interface LearnerPageProps {
  onHome: () => void;
  onOpenEditor: () => void;
}

type StatusFilter = "all" | "completed" | "in-progress" | "available";

const STATUS_FILTER_LABEL: Record<StatusFilter, string> = {
  all: "All",
  completed: "Completed",
  "in-progress": "In Progress",
  available: "Available",
};

export function LearnerPage({ onHome, onOpenEditor }: LearnerPageProps) {
  const setCircuit = useCircuitStore((s) => s.setCircuit);
  const setCircuitName = useCircuitStore((s) => s.setName);
  const select = useUiStore((s) => s.select);

  const completedTopicIds = useLearnerProgressStore((s) => s.completedTopicIds);
  const currentTopicId = useLearnerProgressStore((s) => s.currentTopicId);
  const markComplete = useLearnerProgressStore((s) => s.markComplete);
  const setCurrent = useLearnerProgressStore((s) => s.setCurrent);

  const progress = useMemo(() => ({ completedTopicIds, currentTopicId }), [completedTopicIds, currentTopicId]);
  const overall = useMemo(() => getOverallProgress(progress), [progress]);
  const recommended = useMemo(() => getRecommendedTopic(progress), [progress]);
  const nextUpTopicId = currentTopicId ?? recommended?.id;
  const nextUpSectionId = nextUpTopicId ? getSectionForTopic(nextUpTopicId)?.id : undefined;

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(currentTopicId);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const loadExampleCircuit = useCallback(
    (topic: RoadmapTopic) => {
      if (!topic.exampleCircuit) return;
      setCircuit(topic.exampleCircuit());
      setCircuitName(topic.title);
      select(null);
    },
    [setCircuit, setCircuitName, select]
  );

  // Selecting a topic always navigates into its section's curriculum too —
  // whether the topic came from the main tree, a search result, "Next
  // Topic →", or "Continue Learning" — so the view never gets out of sync
  // with what's selected.
  const handleSelectTopic = useCallback(
    (id: string) => {
      const topic = getTopic(id);
      if (!topic) return;
      setSelectedTopicId(id);
      setCurrent(id);
      loadExampleCircuit(topic);
      const section = getSectionForTopic(id);
      if (section) setSelectedSectionId(section.id);
      setSearchQuery("");
    },
    [setCurrent, loadExampleCircuit]
  );

  const handleContinueLearning = useCallback(() => {
    handleSelectTopic(nextUpTopicId ?? ROADMAP[0].topics[0].id);
  }, [nextUpTopicId, handleSelectTopic]);

  const handleMarkComplete = useCallback(
    (topic: RoadmapTopic) => {
      markComplete(topic.id);
      const next = getNextTopic(topic.id);
      if (next) handleSelectTopic(next.id);
    },
    [markComplete, handleSelectTopic]
  );

  const query = searchQuery.trim().toLowerCase();
  // A status filter only has meaning across sections (a section "tab" isn't
  // itself completed/available) — so it drops into the same flat, searched
  // results view as a text search, rather than trying to filter tabs.
  const isListMode = query !== "" || (statusFilter !== "all" && !selectedSectionId);

  const matchesFilters = useCallback(
    (topic: RoadmapTopic) => {
      const status = getTopicStatus(topic, progress);
      if (statusFilter === "completed" && status !== "completed") return false;
      if (statusFilter === "in-progress" && status !== "current") return false;
      if (statusFilter === "available" && status !== "available") return false;
      if (query && !topic.title.toLowerCase().includes(query) && !topic.description.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    },
    [statusFilter, query, progress]
  );

  const flatMatches = useMemo(() => {
    if (!isListMode) return [];
    const results: { topic: RoadmapTopic; section: RoadmapSection }[] = [];
    for (const section of ROADMAP) {
      for (const topic of section.topics) {
        if (matchesFilters(topic)) results.push({ topic, section });
      }
    }
    return results;
  }, [isListMode, matchesFilters]);

  const currentSection = selectedSectionId ? ROADMAP.find((s) => s.id === selectedSectionId) : undefined;
  const curriculumTopics = useMemo(
    () => (currentSection ? currentSection.topics.filter((t) => matchesFilters(t)) : []),
    [currentSection, matchesFilters]
  );

  const selectedTopic = selectedTopicId ? getTopic(selectedTopicId) : undefined;
  const selectedStatus = selectedTopic ? getTopicStatus(selectedTopic, progress) : undefined;
  const selectedNextTopic = selectedTopic ? getNextTopic(selectedTopic.id) : undefined;

  return (
    <div className="learner-page">
      <header className="page-nav">
        <span className="page-brand">Quantum Circuit Lab</span>
        <button type="button" className="page-home-btn" onClick={onHome}>
          ← Home
        </button>
      </header>

      <div className="page-intro">
        <p className="page-eyebrow">Learner</p>
        <h1 className="page-title">Your Quantum Learning Journey</h1>
        <p className="page-subtitle">
          A roadmap.sh-style path through quantum computing, built from Qiskit's learning curriculum — every topic
          turns into a real, live experiment in this app's circuit editor and visualizations.
        </p>
      </div>

      <section className="learner-dashboard-summary" aria-label="Learning progress">
        <div
          className="roadmap-progress-bar"
          role="progressbar"
          aria-valuenow={overall.percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="roadmap-progress-fill" style={{ width: `${overall.percent}%` }} />
        </div>
        <div className="learner-dashboard-summary-row">
          <span className="learner-dashboard-summary-stat">
            {overall.percent}% complete — {overall.completed} / {overall.total} topics
          </span>
          <button type="button" className="landing-cta learner-continue-btn" onClick={handleContinueLearning}>
            Continue Learning
            <span className="landing-cta-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
        {nextUpTopicId && <p className="learner-dashboard-summary-next">Next → {getTopic(nextUpTopicId)?.title}</p>}
      </section>

      <div className="learner-toolbar">
        <input
          type="search"
          className="roadmap-search-input"
          placeholder="Search quantum topics…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search roadmap topics"
        />
        <div className="roadmap-filter-chips" role="group" aria-label="Filter by status">
          {(Object.keys(STATUS_FILTER_LABEL) as StatusFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              className={`roadmap-filter-chip${statusFilter === f ? " is-active" : ""}`}
              onClick={() => setStatusFilter(f)}
            >
              {STATUS_FILTER_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="learner-split">
        <div className="roadmap-list" aria-label="Quantum computing roadmap">
          {isListMode ? (
            flatMatches.length > 0 ? (
              <div className="roadmap-search-results">
                {flatMatches.map(({ topic, section }) => {
                  const status = getTopicStatus(topic, progress);
                  const isSelected = topic.id === selectedTopicId;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      className={`roadmap-branch-node is-${status}${isSelected ? " is-selected" : ""}`}
                      onClick={() => handleSelectTopic(topic.id)}
                      disabled={status === "locked"}
                      aria-current={isSelected ? "true" : undefined}
                    >
                      <span className="roadmap-search-result-section">{section.title.replace(/^\d+\s*—\s*/, "")}</span>
                      <span className="roadmap-node-head">
                        <span className={`roadmap-branch-status is-${status}`} aria-hidden="true">
                          {STATUS_GLYPH[status]}
                        </span>
                        <span className="roadmap-node-title">{topic.title}</span>
                        <span className={`roadmap-node-difficulty is-${topic.difficulty}`}>{topic.difficulty}</span>
                      </span>
                      <p className="roadmap-node-snippet">{topic.description}</p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="roadmap-empty-hint">No topics match your search/filters.</p>
            )
          ) : currentSection ? (
            <div className="roadmap-curriculum">
              <button type="button" className="roadmap-back-btn" onClick={() => setSelectedSectionId(null)}>
                ← Back to Roadmap
              </button>
              <RoadmapFlow
                sections={[{ section: currentSection, topics: curriculumTopics }]}
                progress={progress}
                selectedTopicId={selectedTopicId}
                onSelectTopic={handleSelectTopic}
              />
            </div>
          ) : (
            <RoadmapMainTree
              sections={ROADMAP}
              completedTopicIds={completedTopicIds}
              highlightSectionId={nextUpSectionId}
              onSelectSection={setSelectedSectionId}
            />
          )}
        </div>

        <div className="topic-detail-column">
          {selectedTopic && selectedStatus ? (
            <TopicDetailPanel
              topic={selectedTopic}
              status={selectedStatus}
              nextTopic={selectedNextTopic}
              onMarkComplete={() => handleMarkComplete(selectedTopic)}
              onSelectTopic={handleSelectTopic}
              onOpenEditor={onOpenEditor}
              onReloadExampleCircuit={() => loadExampleCircuit(selectedTopic)}
            />
          ) : (
            <div className="topic-detail-placeholder">
              <p>Select a topic from the roadmap to start learning.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
