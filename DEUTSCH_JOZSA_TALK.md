# Deutsch–Jozsa — Read-Aloud Script

Read this straight through while clicking. No jargon, no jumping around.

---

**"I'm going to show you a quantum algorithm called Deutsch–Jozsa. Here's
the problem it solves, in plain terms:**

**Imagine a magic box. You feed it a number, it gives back 0 or 1. You're
told the box is one of two types — either it always gives the same
answer no matter what you feed it, or it splits exactly 50/50 between 0
and 1 depending on the input. Your job is to figure out which type it is,
without opening the box.**

**A normal computer would have to feed the box input after input, and in
the worst case, check more than half of all possible inputs before it can
be sure. A quantum computer can answer this in a single try. Let me show
you."**

---

**Click: Folders → Deutsch–Jozsa card**

**"This app comes with this algorithm pre-built. I click it once — and
notice, there's no 'Run' button anywhere in this whole app. The moment a
circuit loads, everything on screen is already live and already
computing."**

---

**Point at the canvas**

**"Here's the circuit. Three lines, each one a qubit — think of a qubit as
a coin. Two of these lines are the input to our magic box. The third is
just a helper that lets the box's answer get written onto the other two."**

**"Reading left to right:"**

**"First step — I flip the helper qubit. Just setup, nothing clever yet."**

**"Second step — every qubit gets this gate called Hadamard. This is the
important one. It puts each qubit into a spin — like a coin spinning in
the air, not yet landed on heads or tails. While it's spinning, in a
real sense it's both 0 and 1 at once."**

**"Third step — this pair of gates in the middle is the magic box itself,
wired directly into the circuit. Because the qubits are spinning, asking
the box once here is like asking it about every possible input at the
same time — instead of one at a time."**

**"Fourth step — I spin the input qubits again. This is the step that
turns the box's hidden answer, which got written into how the qubits were
spinning, back into something plain and readable."**

**"Fifth step — I measure. This is where we actually look."**

---

**Point at the Probabilities panel**

**"And here's the result. Watch — instead of a spread of different
possible answers, there's basically one outcome, showing up almost 100%
of the time. And the important part: it's not the all-zero result.**

**If the box had been the 'always the same answer' type, this measurement
would always land on all-zeros. Because it landed on anything else, that
single measurement is proof — not a guess, proof — that this box is the
50/50 type.**

**One click, one run, one measurement. That's the whole trick of quantum
computing shown in one screen."**

---

**Optional — show it's real and editable**

**"And this isn't a fixed animation — it's a live, editable circuit. Watch
what happens if I remove one piece of the magic box wiring."**

*(delete one CX gate)*

**"See how the result changes? That proves the answer was actually coming
from that oracle step, not from anything else on screen. Let me undo
that."**

*(Ctrl+Z)*

---

**Closing line**

**"So in under a minute, with zero code, we loaded a real quantum
algorithm, watched it run live, and got a scientifically certain answer —
visualized instantly, and something you can actually poke at and break to
understand it better. That's the whole point of this lab: make quantum
computing something you can see and touch, not just read about."**
