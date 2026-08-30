# Learning Deutsch–Jozsa with Quantum Circuit Lab

A simple, step-by-step guide to the Deutsch–Jozsa algorithm — and exactly
how to see it, run it, and understand it using this app. No prior quantum
background assumed.

---

## 1. The problem, in plain English

Imagine someone hands you a **magic box (a "function")**. You can feed it a
number, and it spits out either `0` or `1`. You're told the box is one of
two kinds:

- **Constant** — it always gives the same answer, no matter what you feed
  it. (Always `0`, or always `1`.)
- **Balanced** — it gives `0` for exactly half of all possible inputs, and
  `1` for the other half.

**Your job:** figure out which kind of box it is.

**The catch:** you're *not* allowed to open the box. You can only feed it
inputs and watch what comes out.

### How a normal computer would solve this

You'd have to try inputs one at a time. In the worst case, you might have
to try *more than half of all possible inputs* before you can be sure
whether the box is constant or balanced. If there are a million possible
inputs, that could mean testing 500,001 of them before you're certain.

### How a quantum computer solves this

**In a single try.** Not an approximation, not a probability — one run of
the circuit tells you, with certainty, which kind of box it is. This is
the famous result Deutsch and Jozsa proved in 1992, and it was one of the
first hard proofs that quantum computers can outperform classical ones.

This is exactly what the **Deutsch–Jozsa** worked example in this app
demonstrates, live.

---

## 2. The everyday analogy the app uses

Think of a qubit not as a coin that's landed on heads or tails, but as a
**coin spinning in the air** — it hasn't committed to an answer yet. While
it's spinning, in a sense it's exploring *both* possibilities at once.

The trick behind Deutsch–Jozsa: **put your input qubits into that spinning
state before asking the box anything.** Because they're spinning (in
"superposition"), asking the box once is like asking it about *every
possible input simultaneously*. The box's answer gets baked into how the
qubits are spinning. Then you do one more step that turns "how it's
spinning" back into a plain, readable answer.

That's the entire idea. Everything below is just that idea, made precise.

---

## 3. Where to find it in the app

1. Open the app and go to **Folders**.
2. You'll see a card labeled **"Deutsch–Jozsa"** — *"2 input qubits + 1
   ancilla, balanced oracle."*
3. Click it. You're dropped straight into the circuit editor with the
   algorithm already built and already running — there is no "Run"
   button anywhere in this app; every panel updates live the instant a
   circuit is loaded or changed.

---

## 4. Reading the circuit, left to right

The canvas shows three horizontal lines — one per **qubit** (a quantum
bit). Gates are placed on them like beads on a string, read left to right
in time order:

| # | What's on screen | What it means, simply |
|---|---|---|
| **q0, q1** | "Input" qubits | These represent the input you're feeding the mystery box |
| **q2** | "Ancilla" (helper) qubit | Not part of the input — it's scratch space that lets the box's answer get imprinted onto the input qubits' phase |

**Step-by-step, matching the gates on the canvas:**

1. **X gate on the ancilla (q2).** A simple flip, done first — this sets
   up the helper qubit so the trick in step 3 works correctly.
2. **H gates on all three qubits.** "H" stands for Hadamard — this is the
   "start the coin spinning" gate. After this, q0 and q1 are exploring
   both `0` and `1` at once, and the ancilla is primed to record the
   answer.
3. **Two CX (controlled-NOT) gates — the "oracle".** This is the mystery
   box itself, wired directly into the circuit. In this example the box
   computes `f(x0, x1) = x0 XOR x1` ("exclusive or" — true when the two
   inputs differ), which is a **balanced** function: it outputs 0 for
   half the possible inputs and 1 for the other half. Because the inputs
   were spinning, this one pair of gates effectively asks the box about
   *all four* possible inputs (`00, 01, 10, 11`) at the same time.
4. **H gates on q0 and q1 again.** This is the "let the coin land" step —
   it converts the box's imprinted answer back into something you can
   actually read out.
5. **Measure q0 and q1.** This is where you look at the result.

---

## 5. Reading the result, and why it proves the answer

Look at the **Probabilities panel**. Instead of a spread across many
possible outcomes, you'll see essentially one outcome with (near) 100%
probability — and the key detail is: **it is not `00`.**

- If the box had been **constant**, this measurement would always land on
  `00`.
- Because it lands on anything *other than* `00`, that single measurement
  is proof the box is **balanced** — which matches the oracle wired into
  this example (`x0 XOR x1` is balanced by definition).

One click, one run, one measurement, and a mathematically certain answer.
That's the entire "aha" of Deutsch–Jozsa, and the app shows it to you as
an actual moving bar chart instead of a paragraph in a textbook.

---

## 6. How to actually learn it hands-on in the app (not just watch)

This is the part that makes the app useful beyond a static demo — the
loaded circuit is fully live and editable, exactly like anything you'd
build yourself.

**Try these experiments, in order, watching the Probabilities panel each
time:**

1. **Baseline.** Note the result — one spike, not on `00`.
2. **Delete one of the two CX gates** (the oracle). Now the circuit no
   longer represents a balanced function correctly. Watch the probability
   bars change — this shows you the result is *coming from* the oracle,
   not a coincidence of the circuit shape.
3. **Undo (Ctrl+Z)** to restore it, then **delete one of the middle H
   gates** on q0 or q1. This breaks the superposition step. Notice the
   result becomes messier / less certain — this is the app showing you,
   visually, *why* the spinning-coin step (superposition) is the part
   that makes the "check everything at once" trick work at all.
4. **Undo again**, then open the **AI Tutor panel** below the code editor.
   It will describe the circuit in its own words and flag anything
   structurally off if you've broken it — useful for checking your
   understanding without needing a second person to explain it.
5. Look at the **Qiskit code panel** on the right — the same circuit,
   written out as real code. Useful once you're comfortable with the
   visual version and want to connect it to how the algorithm is
   normally written in textbooks and papers.
6. Look at the **Bloch sphere / Q-sphere views** — these are a picture of
   "which way the qubits are spinning" at each point. Watching the
   ancilla qubit's sphere before and after the H gates is a direct visual
   of the superposition step described in section 2.

---

## 7. One-paragraph summary (for a slide or a jury soundbite)

> Deutsch–Jozsa asks a quantum computer to figure out, in a single run,
> whether a hidden function is "constant" or "balanced" — a task that
> would take a classical computer many tries to be sure of. This app lets
> you load a real, working Deutsch–Jozsa circuit with one click, watch it
> execute live with no "Run" button, and see the answer appear instantly
> as a probability spike that is provably not the all-zero outcome —
> proof the hidden function is balanced. Because the circuit is fully
> editable in place, you can also break individual steps and watch the
> result change, turning a textbook algorithm into something you can
> poke at and build intuition for directly.

---

## 8. Where this lives in the codebase, if asked

- Circuit definition: `src/circuit/examples/worked-examples.ts` —
  `buildDeutschJozsaCircuit()`.
- Loaded from: `src/pages/FoldersPage.tsx` (the worked-examples grid).
- Everything after loading (canvas, code panel, simulation, tutor) is the
  same shared pipeline every hand-built circuit uses — nothing about this
  example is special-cased. See `explain.md` for the full technical
  trace of that pipeline.
