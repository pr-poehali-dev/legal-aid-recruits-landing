const renderInline = (text: string) => {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, idx) => {
    const match = part.match(/^\*([^*]+)\*$/);
    if (match) {
      return (
        <strong key={idx} className="font-bold text-foreground">
          {match[1]}
        </strong>
      );
    }
    return <span key={idx}>{part}</span>;
  });
};

const stripCta = (text: string) => text.replace(/^\*{0,2}CTA:?\*{0,2}\s*/i, "");

const ArticleContent = ({ content }: { content: string }) => {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n\s*\n/);

  return (
    <>
      {blocks.map((block, i) => {
        const lines = block
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        if (lines.length === 0) return null;

        const joined = lines.join(" ");

        if (/^[-_—]{3,}$/.test(joined)) {
          return <hr key={i} className="my-6 border-t-2 border-ink/15" />;
        }

        const isList = lines.every((l) => /^[-•]\s+/.test(l));
        if (isList) {
          return (
            <ul key={i} className="list-disc pl-5 my-4 space-y-1.5">
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^[-•]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }

        if (/^\*{0,2}CTA:?\*{0,2}\s*/i.test(joined)) {
          return (
            <blockquote
              key={i}
              className="my-6 border-l-4 border-violet bg-violet/5 pl-4 py-3 italic text-foreground/70"
            >
              {renderInline(stripCta(joined))}
            </blockquote>
          );
        }

        return (
          <p key={i} className="mb-4 last:mb-0">
            {renderInline(joined)}
          </p>
        );
      })}
    </>
  );
};

export default ArticleContent;
