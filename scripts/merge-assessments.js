#!/usr/bin/env node
/**
 * Merge generated assessments from src/data/tests_data/ into
 * src/data/learning-content.json as `type: "assessment"` nodes.
 *
 * Design constraints (see src/data/_schema_notes.md):
 *
 * - MATCH BY sourceFile ONLY. Concept `id` is not unique — not even within a
 *   single module ("introduction" occurs 23x, "exam" 12x). An assessment is
 *   attached only when its directory slug (or, failing that, its frontmatter
 *   `concept:` title) resolves to EXACTLY ONE concept inside the course's own
 *   module. Anything ambiguous is skipped and reported, never guessed.
 *
 * - The 24 unmatched assessments (final-batch-*, sho-detail*, ...) are excluded
 *   by construction: they resolve to nothing, so they fall into the skip report.
 *   See src/data/_unmatched_review.md.
 *
 * - "No circuit challenge" targets are INTENTIONAL quiz-only content, not a
 *   parse failure. They yield { quizOnly: true, target: null }.
 *
 * - Idempotent: a node whose id already exists is replaced in place, never
 *   duplicated. Safe to run repeatedly.
 *
 * - Concepts with type "exam" are never touched.
 *
 * - learning-content.json is backed up to a timestamped copy before writing.
 *
 * Ordering note: every concept in learning-content.json has `order: null`, so
 * sequence is array position only. Assessment nodes are spliced immediately
 * after their matched concept rather than given an ordinal.
 *
 * Usage:
 *   node scripts/merge-assessments.js [--dry-run] [--quiet]
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT = join(ROOT, "src/data/learning-content.json");
const TESTS = join(ROOT, "src/data/tests_data/modules");

const DRY = process.argv.includes("--dry-run");
const QUIET = process.argv.includes("--quiet");

const log = (...a) => { if (!QUIET) console.log(...a); };

/* ---------------------------------------------------------------- parsing */

function parseFrontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return { data: {}, body: text };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([a-z_]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith("[") && v.endsWith("]")) {
      v = v.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    }
    data[kv[1]] = v;
  }
  return { data, body: text.slice(m[0].length).trim() };
}

function parseQuestions(body) {
  const quiz = body.split(/^## Challenges\s*$/m)[0];
  const parts = quiz.split(/^### (Q\d+)\s*$/m).slice(1);
  const out = [];
  for (let i = 0; i < parts.length; i += 2) {
    const label = parts[i];
    const b = parts[i + 1] ?? "";
    // Tolerant of the "**Question**" (no colon) variant that appeared in 11 files.
    const q = /^\*\*Question:?\*\*\s*([\s\S]*?)(?=\r?\n- [A-Z]\)|\r?\n\*\*Correct)/m.exec(b);
    const options = [...b.matchAll(/^-\)?\s*([A-Z])\)\s*(.*)$/gm)].map((x) => ({
      key: x[1],
      text: x[2].trim(),
    }));
    const correct = /^\*\*Correct:\*\*\s*([A-Z])/m.exec(b);
    const expl = /^\*\*Explanation:\*\*\s*([\s\S]*?)(?=\r?\n### |\r?\n## |$)/m.exec(b);
    out.push({
      id: label,
      question: q ? q[1].trim() : null,
      options,
      correct: correct ? correct[1] : null,
      explanation: expl ? expl[1].trim() : null,
    });
  }
  return out;
}

function parseChallenges(body) {
  const idx = body.search(/^## Challenges\s*$/m);
  if (idx === -1) return [];
  const section = body.slice(idx);
  const parts = section.split(/^### Challenge (\d+)\s*(?:[—-]\s*(.*))?$/m).slice(1);
  const out = [];
  for (let i = 0; i < parts.length; i += 3) {
    const num = parts[i];
    const title = (parts[i + 1] ?? "").trim();
    const b = parts[i + 2] ?? "";
    const diff = /^\*\*Difficulty:\*\*\s*(.*)$/m.exec(b);
    const desc = /^\*\*Description:\*\*\s*([\s\S]*?)(?=\r?\n\*\*|$)/m.exec(b);
    const rawTarget = /\*\*Target:\*\*\s*([\s\S]*?)(?=\*\*Starter code:\*\*|\r?\n### |$)/.exec(b);
    const starter = /\*\*Starter code:\*\*\s*```(?:python)?\s*([\s\S]*?)```/.exec(b);

    let target = null;
    let quizOnly = false;
    if (rawTarget) {
      const raw = rawTarget[1].trim();
      const fenced = /```json\s*([\s\S]*?)```/.exec(raw);
      if (fenced) {
        try {
          target = JSON.parse(fenced[1].trim());
        } catch {
          target = null; // malformed JSON — recorded as a warning by the caller
        }
      } else if (/No circuit challenge/i.test(raw)) {
        // Intentional quiz-only content, NOT a parse failure.
        quizOnly = true;
      }
    }
    out.push({
      id: `challenge-${num}`,
      title,
      difficulty: diff ? diff[1].trim() : null,
      description: desc ? desc[1].trim() : null,
      target,
      quizOnly,
      starterCode: starter ? starter[1].trim() : null,
    });
  }
  return out;
}

/* ------------------------------------------------------------- collection */

function walkAssessments(dir) {
  const found = [];
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name === "assessment.md") found.push(p);
    }
  };
  walk(dir);
  return found.sort();
}

/* ------------------------------------------------------------------- main */

function main() {
  if (!existsSync(CONTENT)) {
    console.error(`FATAL: ${CONTENT} not found`);
    process.exit(1);
  }
  if (!existsSync(TESTS)) {
    console.error(`FATAL: ${TESTS} not found`);
    process.exit(1);
  }

  const data = JSON.parse(readFileSync(CONTENT, "utf-8"));

  // Index concepts by module. sourceFile is the only unique key.
  const modules = new Map();
  let conceptsBefore = 0;
  let existingAssessments = 0;
  for (const stage of data.roadmap) {
    for (const m of stage.modules) {
      modules.set(m.id, m);
      for (const c of m.concepts) {
        conceptsBefore++;
        if (c.type === "assessment") existingAssessments++;
      }
    }
  }

  const files = walkAssessments(TESTS);
  const inserted = [];
  const replaced = [];
  const skipped = [];
  const warnings = [];
  const claimed = new Set();

  // ---- phase 1: resolve every file to a concept, without mutating anything.
  const records = [];
  for (const file of files) {
    const rel = relative(TESTS, file).split(sep);
    const course = rel[0];
    const slug = rel[rel.length - 2];
    const repoRel = relative(ROOT, file).split(sep).join("/");
    const text = readFileSync(file, "utf-8");

    if (!text.trim()) {
      skipped.push({ slug, reason: "empty file — needs regeneration" });
      continue;
    }

    const { data: fm, body } = parseFrontmatter(text);
    const moduleId = `courses-${course}`;
    const mod = modules.get(moduleId);
    if (!mod) {
      skipped.push({ slug, reason: `no module '${moduleId}' in learning-content.json` });
      continue;
    }

    // Resolution: slug -> concept.id, else frontmatter title -> concept.title.
    // Must be unique WITHIN the module, otherwise it is ambiguous and skipped.
    let hits = mod.concepts.filter((c) => c.id === slug);
    let how = "slug";
    if (hits.length === 0 && fm.concept) {
      const t = String(fm.concept).trim().toLowerCase();
      hits = mod.concepts.filter((c) => c.title.trim().toLowerCase() === t);
      how = "title";
    }

    if (hits.length === 0) {
      skipped.push({ slug, reason: "no matching concept (see _unmatched_review.md)" });
      continue;
    }
    if (hits.length > 1) {
      skipped.push({
        slug,
        reason: `ambiguous — ${how} matches ${hits.length} concepts: ${hits.map((h) => h.sourceFile).join(", ")}`,
      });
      continue;
    }
    records.push({ slug, repoRel, fm, body, mod, how, target: hits[0] });
  }

  // An exact directory-slug match is a stronger claim than a frontmatter-title
  // match, so slug matches are applied first. Otherwise 'channel-basics' (title)
  // would claim quantum-channel-basics.ipynb ahead of the 'quantum-channel-basics'
  // directory that names it exactly, purely because of alphabetical order.
  records.sort((a, b) => (a.how === b.how ? 0 : a.how === "slug" ? -1 : 1));

  // ---- phase 2: apply.
  for (const r of records) {
    const { slug, repoRel, fm, body, mod, how, target } = r;

    if (target.type === "exam") {
      skipped.push({ slug, reason: `refused — target concept is type "exam" (${target.sourceFile})` });
      continue;
    }
    if (claimed.has(target.sourceFile)) {
      skipped.push({ slug, reason: `collision — ${target.sourceFile} already claimed (by a ${how === "slug" ? "title" : "slug"}-match)` });
      continue;
    }

    const questions = parseQuestions(body);
    const challenges = parseChallenges(body);

    for (const q of questions) {
      if (!q.correct) warnings.push(`${slug} ${q.id}: no **Correct:** answer`);
      else if (!q.options.some((o) => o.key === q.correct)) {
        warnings.push(`${slug} ${q.id}: correct '${q.correct}' not among options`);
      }
      if (!q.question) warnings.push(`${slug} ${q.id}: no question text`);
    }
    if (questions.length === 0) warnings.push(`${slug}: no questions parsed`);

    // Frontmatter sanity: flag a concept: field that disagrees with the concept
    // it resolved to. quantum-channel-basics ships `concept: Shor's Algorithm`.
    if (how === "slug" && fm.concept) {
      const a = String(fm.concept).trim().toLowerCase();
      const b = target.title.trim().toLowerCase();
      if (a !== b && !a.includes(b) && !b.includes(a)) {
        warnings.push(`${slug}: frontmatter concept '${fm.concept}' disagrees with matched title '${target.title}'`);
      }
    }

    const node = {
      id: `${target.sourceFile}-assessment`,
      title: `Assessment — ${target.title}`,
      type: "assessment",
      content: body,
      order: null,
      sourceFile: repoRel,
      githubUrl: "",
      assessment: {
        forSourceFile: target.sourceFile,
        matchedBy: how,
        module: fm.module ?? null,
        concept: fm.concept ?? null,
        difficultyProgression: fm.difficulty_progression ?? [],
        katasReferenceCategories: fm.katas_reference_categories ?? [],
        sourceReference: fm.source_reference ?? null,
        questionCount: questions.length,
        challengeCount: challenges.length,
        quizOnly: challenges.length > 0 && challenges.every((c) => c.quizOnly),
        questions,
        challenges,
      },
    };

    claimed.add(target.sourceFile);

    // Idempotency: replace an existing node with the same id, else splice in
    // immediately after the matched concept.
    const existingIdx = mod.concepts.findIndex((c) => c.id === node.id);
    if (existingIdx !== -1) {
      mod.concepts[existingIdx] = node;
      replaced.push({ slug, target: target.sourceFile });
    } else {
      const at = mod.concepts.findIndex((c) => c.sourceFile === target.sourceFile);
      mod.concepts.splice(at + 1, 0, node);
      inserted.push({ slug, how, target: target.sourceFile });
    }
  }

  // ---- report
  let conceptsAfter = 0;
  let assessmentNodes = 0;
  for (const stage of data.roadmap) {
    for (const m of stage.modules) {
      for (const c of m.concepts) {
        conceptsAfter++;
        if (c.type === "assessment") assessmentNodes++;
      }
    }
  }

  log(`assessment files scanned : ${files.length}`);
  log(`concepts before          : ${conceptsBefore}  (${existingAssessments} existing assessment nodes)`);
  log(`inserted                 : ${inserted.length}`);
  log(`replaced (idempotent)    : ${replaced.length}`);
  log(`skipped                  : ${skipped.length}`);
  log(`concepts after           : ${conceptsAfter}  (${assessmentNodes} assessment nodes)`);

  if (inserted.length) {
    log(`\ninserted:`);
    for (const i of inserted) log(`  [${i.how}] ${i.slug}  ->  ${i.target}`);
  }
  if (replaced.length) {
    log(`\nreplaced:`);
    for (const r of replaced) log(`  ${r.slug}  ->  ${r.target}`);
  }
  if (skipped.length) {
    log(`\nskipped (${skipped.length}) — nothing guessed:`);
    for (const s of skipped) log(`  ${s.slug}: ${s.reason}`);
  }
  if (warnings.length) {
    log(`\ncontent warnings (${warnings.length}):`);
    for (const w of warnings) log(`  ${w}`);
  }

  if (DRY) {
    log(`\n--dry-run: nothing written.`);
    return;
  }

  // Back up before writing.
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backup = CONTENT.replace(/\.json$/, `.backup-${stamp}.json`);
  copyFileSync(CONTENT, backup);
  log(`\nbackup  : ${relative(ROOT, backup)}`);

  data.metadata = {
    ...data.metadata,
    totalConcepts: conceptsAfter,
    assessmentNodes,
    assessmentsMergedAt: new Date().toISOString(),
  };

  writeFileSync(CONTENT, JSON.stringify(data, null, 2), "utf-8");
  log(`written : ${relative(ROOT, CONTENT)}`);
}

main();
