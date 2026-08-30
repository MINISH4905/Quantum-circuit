// The fetched Qiskit docs markdown embeds custom MDX components
// (IBMVideo, LaunchExamButton, DefinitionTooltip, Figure, Admonition,
// Accordion/AccordionItem) that react-markdown can't render — they were
// leaking through as raw, unrendered JSX-looking text (e.g. literally
// showing `<IBMVideo id="..." title="..."/>` on the page). This converts
// the ones worth preserving into plain markdown and strips the rest,
// applied at the call site (ConceptPage) rather than inside ConceptViewer
// or the data layer, so neither has to change.

function extractAttr(attrs: string, name: string): string | null {
  const m = attrs.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1] : null;
}

const SELF_CLOSING_HANDLERS: Record<string, (attrs: string) => string> = {
  IBMVideo: (attrs) => {
    const title = extractAttr(attrs, "title");
    return title ? `\n\n> 🎥 **Video:** ${title}\n\n` : "";
  },
  LaunchExamButton: (attrs) => {
    const href = extractAttr(attrs, "href");
    return href ? `\n\n[Take the exam →](${href})\n\n` : "";
  },
};

const PAIRED_HANDLERS: Record<string, (attrs: string, inner: string) => string> = {
  Admonition: (attrs, inner) => {
    const title = extractAttr(attrs, "title");
    const body = inner.trim().replace(/\n/g, "\n> ");
    return `\n\n> ${title ? `**${title}**\n>\n> ` : ""}${body}\n\n`;
  },
  AccordionItem: (attrs, inner) => {
    const title = extractAttr(attrs, "title");
    return title ? `\n\n**${title}**\n\n${inner}\n\n` : inner;
  },
  // Layout-only wrappers — just unwrap and keep the inner text.
  DefinitionTooltip: (_attrs, inner) => inner,
  Figure: (_attrs, inner) => inner,
  Accordion: (_attrs, inner) => inner,
};

const SELF_CLOSING_RE = /<([A-Z][A-Za-z0-9]*)((?:\s+[^<>]*?)?)\/>/g;
const MAX_UNWRAP_PASSES = 20;

export function sanitizeLearningContent(content: string): string {
  let out = content.replace(SELF_CLOSING_RE, (_match, name: string, attrs: string) => {
    const handler = SELF_CLOSING_HANDLERS[name];
    return handler ? handler(attrs) : "";
  });

  // Paired components can nest (Accordion > AccordionItem > DefinitionTooltip),
  // so unwrap repeatedly until a pass makes no more changes.
  for (let pass = 0; pass < MAX_UNWRAP_PASSES; pass++) {
    let changed = false;
    for (const name of Object.keys(PAIRED_HANDLERS)) {
      const re = new RegExp(`<${name}((?:\\s+[^<>]*?)?)>([\\s\\S]*?)</${name}>`, "g");
      if (re.test(out)) {
        out = out.replace(new RegExp(re), (_match, attrs: string, inner: string) => {
          changed = true;
          return PAIRED_HANDLERS[name](attrs, inner);
        });
      }
    }
    if (!changed) break;
  }

  // Safety net: drop any remaining unrecognized custom component tags
  // rather than showing raw markup.
  return out.replace(/<\/?[A-Z][A-Za-z0-9]*(?:\s[^<>]*)?>/g, "");
}
