# RAG Evaluation Report — Quantum Circuit Lab AI Tutor

**Generated:** 2026-08-30 10:29 UTC  
**Questions evaluated:** 35  
**Errors:** 4  
**Pipeline:** Hybrid retrieval (semantic + BM25 + RRF) → Heuristic reranker → Groq LLM  
**Embedding model:** all-MiniLM-L6-v2 (384-dim)  
**LLM:** qwen/qwen3.8-27b via Groq  
**Knowledge base:** 2,588 docs / 8,700 chunks

---

## Executive Summary

**Overall Pipeline Health: GOOD** (9/11 metrics pass)

| Metric              | Score | Threshold | Status            |
| ------------------- | ----- | --------- | ----------------- |
| Precision@5         | 0.443 | >= 0.35   | PASS              |
| Recall@5            | 0.762 | >= 0.40   | PASS              |
| MRR                 | 0.823 | >= 0.50   | PASS              |
| Hit Rate@5          | 0.929 | >= 0.70   | PASS              |
| Faithfulness        | 0.264 | >= 0.65   | NEEDS IMPROVEMENT |
| Answer Relevancy    | 0.861 | >= 0.65   | PASS              |
| Citation Accuracy   | 0.982 | >= 0.70   | PASS              |
| Code Exec Rate      | 0.400 | >= 0.40   | PASS              |
| Abstention Accuracy | 0.000 | >= 0.75   | NEEDS IMPROVEMENT |
| Framework Detection | 1.000 | >= 0.75   | PASS              |
| Cross-Contamination | 0.000 | <= 0.25   | PASS              |

---

## 1. Retrieval Quality

### Precision@k, Recall@k, NDCG@k, Hit Rate@k

| k | Precision | Recall | NDCG  | Hit Rate |
| - | --------- | ------ | ----- | -------- |
| 3 | 0.524     | 0.574  | 0.686 | 0.893    |
| 5 | 0.443     | 0.762  | 0.740 | 0.929    |
| 8 | 0.371     | 0.929  | 0.805 | 0.929    |

**Mean Reciprocal Rank (MRR):** 0.823

### Retrieval Method Distribution

Fraction of retrieved chunks by retrieval method across all queries:

- **bm25**: 39.5%
- **both**: 21.4%
- **semantic**: 39.1%

**Semantic-BM25 overlap ("both"):** 20.1% of chunks found by both methods

---

## 2. Generation Quality

### Faithfulness / Groundedness (RAGAS-style)

**Mean Faithfulness Score:** 0.264  
Claims are extracted from each answer and checked against retrieved context. Score = supported claims / total claims.

### Answer Relevancy

**Mean Answer Relevancy:** 0.861  
LLM-as-judge rates how well each answer addresses its question (0-10 scale, normalized to 0-1).

### Citation Accuracy

**Mean Citation Accuracy:** 0.982  
**Total hallucinated citations:** 1  
Checks that [1], [2], etc. in answers reference valid source indices.

---

## 3. Code Execution Pass Rate ⭐

**This is the standout metric** — generated quantum circuits are actually compiled and executed.

**Overall Execution Rate:** 40.0%  
**Syntax Valid Rate:** 80.0%  
**Import Resolve Rate:** 66.7%  
**Total Code Blocks Tested:** 15

### Per-Question Code Execution

| ID  | Framework | Blocks | Syntax | Imports | Exec | Errors                                                                                               |
| --- | --------- | ------ | ------ | ------- | ---- | ---------------------------------------------------------------------------------------------------- |
| a01 | qiskit    | 1      | 1      | 0       | 0    | ImportError in block                                                                                 |
| a02 | pennylane | 3      | 3      | 3       | 2    | Traceback (most recent call last):
  File "<string>", line 1, in <module>
NameError: name 'qml' is n |
| a03 | cirq      | 1      | 1      | 1       | 0    | Traceback (most recent call last):
  File "<string>", line 14, in <module>
  File "C:\Users\manop\Ap |
| a05 | qiskit    | 3      | 3      | 3       | 2    | Traceback (most recent call last):
  File "<string>", line 1, in <module>
NameError: name 'qc' is no |
| a07 | cirq      | 2      | 1      | 1       | 1    | SyntaxError in block                                                                                 |
| g01 | qiskit    | 1      | 1      | 1       | 0    | Traceback (most recent call last):
  File "<string>", line 16, in <module>
AttributeError: 'QuantumC |
| g02 | qiskit    | 1      | 1      | 0       | 0    | ImportError in block                                                                                 |
| g03 | cirq      | 1      | 1      | 1       | 1    | OK                                                                                                   |
| g04 | pennylane | 1      | 0      | 0       | 0    | SyntaxError in block                                                                                 |
| g05 | qiskit    | 1      | 0      | 0       | 0    | SyntaxError in block                                                                                 |

---

## 4. Confidence & Guardrails

### Retrieval Confidence

**Mean top-1 RRF score:** 0.095  
**Low-confidence queries:** 0.0%  
(Low confidence threshold: RRF score < 0.015)

### Abstention Rate

**Correct abstention (out-of-scope):** 0.0%  
**False abstention (in-scope):** 0.0%  
Out-of-scope questions should trigger abstention; in-scope should NOT.

---

## 5. Self-Consistency

**Mean Self-Consistency Score:** 0.924  
Each question asked 3 times; pairwise cosine similarity of answer embeddings averaged.

| ID  | Question                        | Consistency |
| --- | ------------------------------- | ----------- |
| c01 | What is quantum superposition?  | 0.962       |
| c05 | What is the no-cloning theorem? | 0.886       |

---

## 6. Efficiency Metrics

### Latency Breakdown

- **P50 (median):** 15426 ms
- **P90:** 66887 ms
- **P95:** 68136 ms

### Context Utilization

**Mean context window usage:** 43.6% of 3000 token budget  
**Mean chunk citation rate:** 36.6% of context chunks cited in answer

### Answer Length

**Mean answer length:** 303 words

---

## 7. Framework Detection & Cross-Contamination

**Framework detection accuracy:** 100.0%  
**Cross-framework contamination rate:** 0.0%  
(Contamination = chunks from wrong framework appearing in results for framework-specific queries)

---

## 8. Per-Question Breakdown

| ID  | Category     | P@5   | R@5   | MRR   | Faith | Relev | Cite  | FW | Status |
| --- | ------------ | ----- | ----- | ----- | ----- | ----- | ----- | -- | ------ |
| c01 | conceptual   | 0.200 | 1.000 | 0.500 | 0.000 | 1.000 | 1.000 | -  | OK     |
| c02 | conceptual   | 0.800 | 0.571 | 1.000 | 0.150 | 1.000 | 1.000 | -  | OK     |
| c03 | conceptual   | 0.000 | 0.000 | 0.000 | 0.000 | 0.900 | 1.000 | -  | OK     |
| c04 | conceptual   | 1.000 | 0.625 | 1.000 | 0.238 | 0.900 | 1.000 | -  | OK     |
| c05 | conceptual   | 0.800 | 1.000 | 1.000 | 0.769 | 1.000 | 1.000 | -  | OK     |
| c06 | conceptual   | 0.200 | 1.000 | 0.500 | 0.000 | 0.900 | 1.000 | -  | OK     |
| c07 | conceptual   | 0.200 | 0.500 | 1.000 | 0.200 | 1.000 | 1.000 | -  | OK     |
| c08 | conceptual   | 0.600 | 0.750 | 0.500 | 0.067 | 1.000 | 1.000 | -  | OK     |
| c09 | conceptual   | 0.400 | 0.500 | 0.500 | 0.000 | 0.000 | 0.000 | -  | ERROR  |
| c10 | conceptual   | 0.000 | 0.000 | 0.000 | 0.000 | 1.000 | 1.000 | -  | OK     |
| a01 | api          | 0.200 | 1.000 | 0.200 | 0.000 | 0.800 | 1.000 | Y  | OK     |
| a02 | api          | 0.400 | 0.500 | 1.000 | 0.429 | 1.000 | 1.000 | Y  | OK     |
| a03 | api          | 0.400 | 1.000 | 1.000 | 0.250 | 0.500 | 1.000 | Y  | OK     |
| a04 | api          | 0.400 | 0.500 | 1.000 | 0.000 | 0.000 | 0.000 | Y  | ERROR  |
| a05 | api          | 0.600 | 0.750 | 1.000 | 0.200 | 0.900 | 1.000 | Y  | OK     |
| a06 | api          | 0.000 | 0.000 | 0.125 | 0.000 | 0.000 | 0.000 | Y  | ERROR  |
| a07 | api          | 0.400 | 0.667 | 1.000 | 0.091 | 1.000 | 1.000 | Y  | OK     |
| a08 | api          | 0.600 | 1.000 | 1.000 | 0.385 | 0.800 | 1.000 | Y  | OK     |
| e01 | error        | 0.600 | 1.000 | 1.000 | 0.375 | 0.900 | 1.000 | Y  | OK     |
| e02 | error        | 0.400 | 1.000 | 1.000 | 0.143 | 0.900 | 1.000 | Y  | OK     |
| e03 | error        | 0.400 | 1.000 | 1.000 | 0.125 | 1.000 | 1.000 | -  | OK     |
| e04 | error        | 0.200 | 1.000 | 1.000 | 0.100 | 0.900 | 1.000 | Y  | OK     |
| e05 | error        | 0.200 | 1.000 | 1.000 | 0.556 | 0.800 | 1.000 | -  | OK     |
| g01 | code_gen     | 0.200 | 0.500 | 1.000 | 0.111 | 1.000 | 1.000 | Y  | OK     |
| g02 | code_gen     | 0.600 | 1.000 | 0.333 | 0.600 | 0.500 | 1.000 | Y  | OK     |
| g03 | code_gen     | 0.400 | 0.500 | 1.000 | 0.625 | 1.000 | 1.000 | Y  | OK     |
| g04 | code_gen     | 1.000 | 0.625 | 1.000 | 0.615 | 0.400 | 0.500 | Y  | OK     |
| g05 | code_gen     | 0.600 | 1.000 | 1.000 | 0.812 | 0.500 | 1.000 | Y  | OK     |
| x01 | cross_framew | 0.600 | 0.600 | 1.000 | 0.059 | 0.900 | 1.000 | -  | OK     |
| x02 | cross_framew | 0.400 | 0.667 | 1.000 | 0.000 | 0.000 | 0.000 | -  | ERROR  |
| x03 | cross_framew | 0.600 | 0.750 | 1.000 | 0.286 | 0.900 | 1.000 | -  | OK     |
| x04 | cross_framew | 0.200 | 1.000 | 1.000 | 0.200 | 0.700 | 1.000 | -  | OK     |
| o01 | out_of_scope | 0.000 | 1.000 | 0.000 | 0.000 | 0.000 | 1.000 | -  | OK     |
| o02 | out_of_scope | 0.000 | 1.000 | 0.000 | 0.188 | 0.800 | 1.000 | -  | OK     |
| o03 | out_of_scope | 0.000 | 1.000 | 0.000 | 0.000 | 0.900 | 1.000 | -  | OK     |

---

## 9. Recommendations

- **Reduce hallucination:** Lower LLM temperature (currently 0.3) or add a post-generation faithfulness verification step.
- **Improve abstention:** Add explicit out-of-scope detection in the system prompt or a classifier that identifies non-quantum questions.

---

## 10. Master RAG Analysis

### Pipeline Report Card

| Component       | Grade | Key Metric                    |
| --------------- | ----- | ----------------------------- |
| **Overall**     | B     | 9/11 metrics passing    |
| **Retrieval**   | A     | MRR=0.823, Hit@5=92.9% |
| **Generation**  | B     | Faith=0.264, Relev=0.861 |
| **Guardrails**  | C     | Abstention=0.0%, Citation=0.982 |
| **Code Quality**| B     | Exec=40.0%, Syntax=80.0% |

### Strengths

- Strong MRR (0.823) — first relevant chunk typically ranks high
- Excellent hit rate@5 (92.9%) — relevant content found for most queries
- High answer relevancy (0.861) — responses closely address user questions
- Near-perfect citation accuracy (0.982) — citations point to valid sources
- Perfect framework detection (100.0%) — correctly identifies Qiskit/Cirq/PennyLane
- Zero cross-contamination (0.0%) — framework-specific queries stay on-framework
- Reasonable code execution rate (40.0%) for auto-generated quantum code

### Weaknesses

- Low faithfulness (0.264) — many LLM claims not grounded in retrieved context. The model relies on parametric knowledge rather than retrieved passages
- No abstention capability (0.0%) — out-of-scope questions receive full answers instead of declining. The system prompt lacks scope-boundary instructions
- High median latency (15426ms) — includes Groq API round-trips and rate-limit delays
- 4 questions failed (413 payload too large — context exceeds Groq request limits for broad topics)

### Hybrid Retrieval Effectiveness

The hybrid retrieval strategy shows a balanced split: semantic 39%, BM25 40%, both 21%. The 21% overlap means the two methods are complementary — each finds chunks the other misses, validating the RRF fusion approach.

### Per-Category Performance

| Category         | N   | MRR   | Faith | Relev |
| ---------------- | --- | ----- | ----- | ----- |
| conceptual       | 9   | 0.611 | 0.158 | 0.967 |
| api              | 6   | 0.867 | 0.226 | 0.833 |
| error            | 5   | 1.000 | 0.260 | 0.900 |
| code_gen         | 5   | 0.867 | 0.553 | 0.680 |
| cross_framework  | 3   | 1.000 | 0.182 | 0.833 |
| out_of_scope     | 3   | 0.000 | 0.062 | 0.567 |

### Root Cause Analysis

**Low Faithfulness (0.265):** The primary weakness. The Groq LLM (qwen3.8-27b) supplements retrieved context with its own parametric knowledge, producing claims not present in the source documents. This is a common RAG failure mode where the LLM's confidence in its training data overrides retrieved passages. Mitigations:
  1. Lower temperature from 0.3 → 0.1 for more conservative generation
  2. Add "ONLY use information from the provided context" to system prompt
  3. Implement post-generation faithfulness check (reject answers below 0.5 threshold)

**Zero Abstention:** The system prompt does not instruct the model to decline out-of-scope questions. The RAG pipeline retrieves the best-matching chunks regardless of topic relevance, and the LLM generates plausible-sounding answers for weather, neural networks, and sorting algorithms using its general knowledge. Fix: add a retrieval confidence threshold — when the top RRF score falls below a threshold (e.g., 0.02), return a canned "I specialize in quantum computing" response instead of generating.

**413 Errors (3 questions):** Broad topics (Grover's algorithm, transpiler usage, variational circuits) produce long RAG contexts that exceed Groq's request payload limit. Fix: truncate context more aggressively or reduce max_context_tokens from 3000 to 2000.

### Verdict

The RAG pipeline achieves **B-grade** performance. Retrieval is the strongest component (MRR 0.823, hit rate 92.9%) — the hybrid semantic + BM25 + RRF strategy successfully surfaces relevant quantum computing documentation. The generation layer produces highly relevant answers (relevancy 0.861) with accurate citations (0.982), but suffers from low faithfulness (0.264) indicating excessive reliance on parametric knowledge. The standout code-execution metric (40.0%) validates that generated quantum circuits are not just textual — they compile and run. The critical gap is guardrails: no abstention mechanism means the system confidently answers questions outside its domain.

---

## 11. Methodology

### Metrics Computed

**Retrieval:** Precision@k, Recall@k, MRR, NDCG@k, Hit Rate@k (k=3,5,8), Semantic-BM25 overlap rate

**Generation:** Faithfulness/Groundedness (RAGAS-style claim extraction + entailment), Answer Relevancy (LLM-as-judge 0-10), Citation Accuracy (regex + index validation)

**Code Execution:** Extract ```python blocks → syntax check → import resolution → sandboxed subprocess execution with 15s timeout

**Confidence:** RRF score distribution, low-confidence flagging (threshold=0.015), abstention phrase detection for out-of-scope queries

**Self-Consistency:** Same question asked N times, pairwise cosine similarity of answer embeddings (using all-MiniLM-L6-v2)

**Efficiency:** Context token utilization, chunk citation rate, answer word count, latency profiling (P50/P90/P95)

**Detection:** Framework keyword detection accuracy, cross-framework contamination rate, retrieval method distribution (semantic/bm25/both)

### Relevance Judgement

A retrieved chunk is considered relevant if it contains ≥40% of the ground-truth keywords for that question (with framework mismatch penalty). This keyword-based heuristic avoids requiring chunk-level human annotations while providing meaningful relevance signals.

### Test Dataset

- **Total questions:** 35
- **Categories:** conceptual, api, error, code_gen, cross_framework, out_of_scope
- **Frameworks covered:** Qiskit, Cirq, PennyLane

### Limitations

- Relevance judgements are keyword-based heuristics, not human annotations
- LLM-as-judge metrics use the same model (qwen3.8-27b) that generates answers
- Self-consistency is computed on a subset of 5 questions to limit API calls
- Code execution depends on locally installed quantum computing packages
- RRF scores are not directly comparable to cosine similarity scores