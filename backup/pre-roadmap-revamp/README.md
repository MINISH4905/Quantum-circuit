# Pre-revamp snapshot — learner roadmap UI

Verbatim copies of the roadmap UI files as they stood immediately before the
learner roadmap was rewired to use `RoadmapRevamp`.

Taken at commit `0679450` ("Show real module names on the roadmap instead of
Overview"), which is pushed to `origin/main` — so this snapshot is a
convenience copy, not the only record. `git show 0679450:src/pages/LearnerModule.tsx`
returns the same bytes.

| File here | Original location |
|---|---|
| `LearnerModule.tsx` | `src/pages/LearnerModule.tsx` |
| `LearnerModule.css` | `src/pages/LearnerModule.css` |
| `RoadmapGraph.tsx` | `src/pages/learning-center/RoadmapGraph.tsx` |
| `RoadmapGraph.css` | `src/pages/learning-center/RoadmapGraph.css` |
| `AppRoot.tsx` | `src/AppRoot.tsx` |

## Restoring

```bash
cp backup/pre-roadmap-revamp/LearnerModule.tsx  src/pages/
cp backup/pre-roadmap-revamp/LearnerModule.css  src/pages/
cp backup/pre-roadmap-revamp/RoadmapGraph.tsx   src/pages/learning-center/
cp backup/pre-roadmap-revamp/RoadmapGraph.css   src/pages/learning-center/
cp backup/pre-roadmap-revamp/AppRoot.tsx        src/
```

## Notes

- This directory sits outside `src/` deliberately: `tsconfig.app.json` has
  `"include": ["src"]`, so these copies are never typechecked or linted and
  cannot break the build.
- `RoadmapGraph.tsx` / `.css` were **not modified** by the revamp — they are
  still live, because `LearningCenter.tsx` continues to use them. They are
  copied here only so this snapshot is self-contained.
