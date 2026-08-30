#!/usr/bin/env node
// Fetches every .mdx/.md/.ipynb file under Qiskit/documentation's learning/
// tree via the GitHub REST API and builds a structured roadmap JSON for the
// Learning Center — see src/data/learning-content.json (full content) and
// src/data/learning-manifest.json (titles/ids only, for fast sidebar loads).
//
// GitHub's unauthenticated REST API caps at 60 requests/hour, which a
// file-by-file fetch of ~190 files won't fit into one run. This script is
// resumable: every file it fetches is cached in
// .fetch-cache/learning-content-cache.json (keyed by sha, so unchanged files
// are never re-fetched) and the roadmap JSON is rebuilt from whatever is
// cached so far. If the rate limit is hit mid-run, it saves progress and
// exits cleanly — just run `npm run fetch-content` again later (the limit
// resets hourly), or set a GITHUB_TOKEN env var for the 5000/hour
// authenticated limit.

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const OUTPUT_CONTENT_PATH = path.join(ROOT_DIR, "src/data/learning-content.json");
const OUTPUT_MANIFEST_PATH = path.join(ROOT_DIR, "src/data/learning-manifest.json");
const CACHE_PATH = path.join(ROOT_DIR, ".fetch-cache/learning-content-cache.json");

const REPO = "Qiskit/documentation";
const BRANCH = "main";
const ROOT = "learning";
const TREE_API = `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`;
const contentsApiUrl = (filePath) => `https://api.github.com/repos/${REPO}/contents/${filePath}`;
const TEXT_EXTENSIONS = new Set(["mdx", "md", "ipynb"]);

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const authHeaders = GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {};

class RateLimitedError extends Error {
  constructor(resetAt) {
    super("RATE_LIMITED");
    this.resetAt = resetAt;
  }
}

async function githubFetch(url) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "quantum-circuit-lab-fetch-content",
      ...authHeaders,
    },
  });
  const remaining = Number(res.headers.get("x-ratelimit-remaining") ?? "1");
  const resetAt = Number(res.headers.get("x-ratelimit-reset") ?? "0");
  if (res.status === 403 && remaining === 0) {
    throw new RateLimitedError(resetAt);
  }
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} for ${url}`);
  }
  return { data: await res.json(), remaining };
}

async function loadCache() {
  if (!existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(await readFile(CACHE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

async function saveCache(cache) {
  await mkdir(path.dirname(CACHE_PATH), { recursive: true });
  await writeFile(CACHE_PATH, JSON.stringify(cache), "utf-8");
}

async function fetchTree() {
  console.log(`Fetching repo tree from ${TREE_API} ...`);
  const { data } = await githubFetch(TREE_API);
  if (data.truncated) console.warn("WARNING: tree API response was truncated.");
  const entries = data.tree.filter((t) => t.path.startsWith(`${ROOT}/`) && t.type === "blob");
  console.log(`Found ${entries.length} files under ${ROOT}/`);
  return entries;
}

function extFor(filePath) {
  return filePath.split(".").pop().toLowerCase();
}

// --- Frontmatter / markdown extraction --------------------------------------

function extractFromMarkdown(raw) {
  const { data: frontmatter, content } = matter(raw);
  const heading = content.match(/^#\s+(.+)$/m);
  return { frontmatter, title: frontmatter.title || (heading ? heading[1].trim() : null), content: content.trim() };
}

function extractFromIpynb(raw) {
  let notebook;
  try {
    notebook = JSON.parse(raw);
  } catch {
    return { frontmatter: {}, title: null, content: "" };
  }
  const markdownText = (notebook.cells || [])
    .filter((cell) => cell.cell_type === "markdown")
    .map((cell) => (Array.isArray(cell.source) ? cell.source.join("") : cell.source || ""))
    .join("\n\n");
  // The first markdown cell in these notebooks is typically frontmatter + a heading.
  return extractFromMarkdown(markdownText);
}

function extractContent(filePath, raw) {
  return extFor(filePath) === "ipynb" ? extractFromIpynb(raw) : extractFromMarkdown(raw);
}

// --- Roadmap stage inference -------------------------------------------------
// Real Qiskit folder names don't literally start with "algorithm*"/"advanced*",
// so these match anywhere in the path rather than as a strict prefix.

const STAGE_DEFS = [
  {
    id: "foundations",
    title: "Foundations of Quantum Computing",
    order: 1,
    match: (p) => /basics|getting-started|use-a-qc-today/.test(p),
  },
  { id: "algorithms", title: "Quantum Algorithms", order: 2, match: (p) => /algorithm|circuit|gate/.test(p) },
  {
    id: "advanced-topics",
    title: "Advanced Topics",
    order: 3,
    match: (p) => /advanced|error-correction|optimization|variational/.test(p),
  },
  { id: "exploration", title: "Exploration", order: 4, match: () => true },
];

function inferStage(filePath) {
  const p = filePath.toLowerCase();
  return STAGE_DEFS.find((s) => s.match(p));
}

function moduleIdFor(filePath) {
  // learning/courses/<slug>/... -> "courses/<slug>"; learning/modules/<slug>/... -> "modules/<slug>"
  const parts = filePath.split("/");
  return parts.length >= 3 && parts[0] === ROOT ? `${parts[1]}/${parts[2]}` : null;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// --- Fetch phase ---------------------------------------------------------------

async function fetchAllContent(entries, cache) {
  console.log(`${entries.length} text files to process (${Object.keys(cache).length} already cached).`);

  let fetchedThisRun = 0;
  let rateLimited = false;

  for (const entry of entries) {
    if (cache[entry.path]?.sha === entry.sha) continue; // unchanged, already have it

    try {
      const { data, remaining } = await githubFetch(contentsApiUrl(entry.path));
      const raw = Buffer.from(data.content, data.encoding || "base64").toString("utf-8");
      cache[entry.path] = { sha: entry.sha, raw, ...extractContent(entry.path, raw) };
      fetchedThisRun++;

      if (fetchedThisRun % 10 === 0) {
        console.log(`  ...${fetchedThisRun} fetched this run (${remaining} requests remaining)`);
        await saveCache(cache);
      }
      if (remaining <= 1) {
        console.log("Approaching rate limit — stopping early and saving progress.");
        rateLimited = true;
        break;
      }
    } catch (err) {
      if (err instanceof RateLimitedError) {
        console.log(`Rate limited. Resets at ${new Date(err.resetAt * 1000).toLocaleString()}. Re-run this script after that.`);
        rateLimited = true;
        break;
      }
      console.warn(`  Failed to fetch ${entry.path}: ${err.message}`);
    }
  }

  await saveCache(cache);
  console.log(`Fetched ${fetchedThisRun} files this run.`);
  return rateLimited;
}

// --- Build phase -----------------------------------------------------------------

function buildRoadmap(entries, cache) {
  const modulesById = new Map();

  const makePlaceholderModule = (modId, slug, filePath) => ({
    id: slugify(modId),
    title: slug,
    description: "",
    difficulty: "beginner",
    estimatedTime: "",
    order: null,
    prerequisites: [],
    tags: [],
    concepts: [],
    stageId: inferStage(filePath).id,
  });

  for (const entry of entries) {
    const cached = cache[entry.path];
    if (!cached) continue; // not fetched yet (rate-limited, failed, or first run in progress)

    const modId = moduleIdFor(entry.path);
    if (!modId) continue;
    const slug = modId.split("/")[1];
    const fm = cached.frontmatter || {};
    const isIndex = entry.path.endsWith("/index.mdx") || entry.path.endsWith("/index.md");

    const mod = modulesById.get(modId) || makePlaceholderModule(modId, slug, entry.path);

    if (isIndex) {
      mod.title = fm.title || cached.title || mod.title;
      mod.description = fm.description || mod.description;
      mod.difficulty = fm.difficulty || mod.difficulty;
      mod.estimatedTime = fm.estimatedTime || fm.duration || (fm.hours ? `${fm.hours} hr` : mod.estimatedTime);
      mod.order = typeof fm.order === "number" ? fm.order : mod.order;
      mod.prerequisites = fm.prerequisites || mod.prerequisites;
      mod.tags = fm.tags || mod.tags;
    } else {
      const fileName = entry.path.split("/").pop();
      mod.concepts.push({
        id: slugify(fileName.replace(/\.(mdx|md|ipynb)$/, "")),
        title: cached.title || fm.title || fileName,
        type: fileName.startsWith("exam.") ? "exam" : "concept",
        content: cached.content || "",
        order: typeof fm.order === "number" ? fm.order : null,
        sourceFile: entry.path,
        githubUrl: `https://github.com/${REPO}/blob/${BRANCH}/${entry.path}`,
      });
    }

    modulesById.set(modId, mod);
  }

  for (const mod of modulesById.values()) {
    mod.concepts.sort((a, b) => {
      if (a.order != null && b.order != null) return a.order - b.order;
      if (a.order != null) return -1;
      if (b.order != null) return 1;
      return a.sourceFile.localeCompare(b.sourceFile);
    });
  }

  const stagesById = new Map(
    STAGE_DEFS.map((s) => [s.id, { id: s.id, title: s.title, description: "", order: s.order, modules: [] }])
  );
  for (const mod of modulesById.values()) {
    const { stageId, ...cleanMod } = mod;
    stagesById.get(stageId).modules.push(cleanMod);
  }
  for (const stage of stagesById.values()) {
    stage.modules.sort((a, b) => {
      if (a.order != null && b.order != null) return a.order - b.order;
      if (a.order != null) return -1;
      if (b.order != null) return 1;
      return a.title.localeCompare(b.title);
    });
  }

  return [...stagesById.values()].filter((s) => s.modules.length > 0).sort((a, b) => a.order - b.order);
}

async function main() {
  const cache = await loadCache();
  const entries = await fetchTree();
  const textFiles = entries.filter((e) => TEXT_EXTENSIONS.has(extFor(e.path)));

  const rateLimited = await fetchAllContent(textFiles, cache);

  const cachedCount = textFiles.filter((e) => cache[e.path]).length;
  console.log(`Have content for ${cachedCount}/${textFiles.length} files.`);
  if (cachedCount === 0) {
    console.log("Nothing fetched yet — cannot build output. Re-run once some content is cached.");
    process.exitCode = rateLimited ? 1 : 0;
    return;
  }

  const roadmap = buildRoadmap(textFiles, cache);
  const totalModules = roadmap.reduce((sum, s) => sum + s.modules.length, 0);
  const totalConcepts = roadmap.reduce((sum, s) => sum + s.modules.reduce((n, m) => n + m.concepts.length, 0), 0);

  const metadata = {
    fetchedAt: new Date().toISOString(),
    totalModules,
    totalConcepts,
    source: `https://github.com/${REPO}/tree/${BRANCH}/${ROOT}`,
    filesFetched: cachedCount,
    filesTotal: textFiles.length,
  };

  await mkdir(path.dirname(OUTPUT_CONTENT_PATH), { recursive: true });
  await writeFile(OUTPUT_CONTENT_PATH, JSON.stringify({ roadmap, metadata }, null, 2), "utf-8");

  const manifest = {
    roadmap: roadmap.map((stage) => ({
      id: stage.id,
      title: stage.title,
      order: stage.order,
      modules: stage.modules.map((mod) => ({
        id: mod.id,
        title: mod.title,
        difficulty: mod.difficulty,
        estimatedTime: mod.estimatedTime,
        order: mod.order,
        concepts: mod.concepts.map((c) => ({ id: c.id, title: c.title, type: c.type })),
      })),
    })),
    metadata,
  };
  await writeFile(OUTPUT_MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");

  console.log(`Wrote ${OUTPUT_CONTENT_PATH}`);
  console.log(`Wrote ${OUTPUT_MANIFEST_PATH}`);
  console.log(`Roadmap: ${roadmap.length} stages, ${totalModules} modules, ${totalConcepts} concepts.`);

  if (rateLimited || cachedCount < textFiles.length) {
    console.log(`\n${textFiles.length - cachedCount} file(s) still unfetched. Re-run \`npm run fetch-content\` later to fill them in.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
