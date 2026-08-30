const FRAMEWORK_LABELS: Record<string, string> = {
  qiskit: "Qiskit",
  cirq: "Cirq",
  pennylane: "PennyLane",
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function stripLatex(text: string): string {
  let t = text;
  t = t.replace(/\\\[/g, "").replace(/\\\]/g, "");
  t = t.replace(/\\\(/g, "").replace(/\\\)/g, "");
  t = t.replace(/\$\$?/g, "");
  t = t.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "$1/$2");
  t = t.replace(/\\sqrt\{([^}]*)\}/g, "√$1");
  const greek: Record<string, string> = {
    alpha: "α", beta: "β", gamma: "γ", delta: "δ", theta: "θ",
    pi: "π", phi: "φ", psi: "ψ", omega: "ω", sigma: "σ", lambda: "λ",
    Gamma: "Γ", Delta: "Δ", Theta: "Θ", Lambda: "Λ", Sigma: "Σ",
    Phi: "Φ", Psi: "Ψ", Omega: "Ω",
  };
  for (const [cmd, ch] of Object.entries(greek)) {
    t = t.replace(new RegExp(`\\\\${cmd}(?![a-zA-Z])`, "g"), ch);
  }
  t = t.replace(/\\cdot/g, "·").replace(/\\times/g, "×").replace(/\\pm/g, "±");
  t = t.replace(/\\leq/g, "≤").replace(/\\geq/g, "≥").replace(/\\neq/g, "≠");
  t = t.replace(/\\approx/g, "≈").replace(/\\infty/g, "∞");
  t = t.replace(/\\langle/g, "⟨").replace(/\\rangle/g, "⟩");
  t = t.replace(/\\otimes/g, "⊗").replace(/\\oplus/g, "⊕");
  t = t.replace(/\\dagger/g, "†").replace(/\\hbar/g, "ℏ");
  t = t.replace(/\\ket/g, "|").replace(/\\bra/g, "⟨");
  t = t.replace(/\^(\{[^}]*\}|\w)/g, (_, g) => g.replace(/[{}]/g, ""));
  t = t.replace(/_(\{[^}]*\}|\w)/g, (_, g) => g.replace(/[{}]/g, ""));
  t = t.replace(/\\(?:text|mathrm|mathbf|mathit|operatorname)\{([^}]*)\}/g, "$1");
  t = t.replace(/\\[a-zA-Z]+/g, "");
  t = t.replace(/[{}]/g, "");
  t = t.replace(/[ \t]{2,}/g, " ");
  return t.trim();
}

interface FormatOptions {
  showApplyButtons?: boolean;
}

export function formatMarkdown(
  raw: string,
  opts: FormatOptions = {},
): string {
  const { showApplyButtons = true } = opts;
  const text = stripLatex(raw);

  const codeBlocks: string[] = [];
  let processed = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
    const idx = codeBlocks.length;
    const escaped = escapeHtml(code.trimEnd());
    let buttons = `<button class="tutor-code-btn" data-code-action="copy">Copy</button>`;
    if (showApplyButtons) {
      for (const [key, label] of Object.entries(FRAMEWORK_LABELS)) {
        buttons += `<button class="tutor-code-btn tutor-code-apply" data-code-action="apply-${key}">${label}</button>`;
      }
    }
    const html =
      `<div class="tutor-chat-code-wrap">` +
      `<div class="tutor-chat-code-bar"><span>${lang || "code"}</span><span class="tutor-chat-code-btns">${buttons}</span></div>` +
      `<pre><code>${escaped}</code></pre></div>`;
    codeBlocks.push(html);
    return `\x00CODEBLOCK${idx}\x00`;
  });

  const inlineCode: string[] = [];
  processed = processed.replace(/`([^`]+)`/g, (_m, code) => {
    const idx = inlineCode.length;
    inlineCode.push(`<code>${escapeHtml(code)}</code>`);
    return `\x00INLINE${idx}\x00`;
  });

  const lines = processed.split("\n");
  const out: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) { inList = false; out.push("</ul>"); }
      out.push("<br>");
      continue;
    }

    let formatted = escapeHtml(trimmed);
    formatted = formatted.replace(/\x00CODEBLOCK(\d+)\x00/g, (_, i) => codeBlocks[+i]);
    formatted = formatted.replace(/\x00INLINE(\d+)\x00/g, (_, i) => inlineCode[+i]);
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/\*(.+?)\*/g, "<em>$1</em>");

    if (/^#{1,4}\s/.test(trimmed)) {
      if (inList) { inList = false; out.push("</ul>"); }
      const level = trimmed.match(/^(#{1,4})\s/)![1].length;
      const heading = formatted.replace(/^#{1,4}\s+/, "");
      out.push(`<h${level + 1}>${heading}</h${level + 1}>`);
    } else if (/^[-*]\s/.test(trimmed)) {
      if (!inList) { inList = true; out.push("<ul>"); }
      out.push(`<li>${formatted.replace(/^[-*]\s+/, "")}</li>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) { inList = true; out.push("<ol>"); }
      out.push(`<li>${formatted.replace(/^\d+\.\s+/, "")}</li>`);
    } else {
      if (inList) { inList = false; out.push("</ul>"); }
      out.push(`<p>${formatted}</p>`);
    }
  }
  if (inList) out.push("</ul>");

  return out.join("\n");
}
