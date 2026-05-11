export const renderMarkdown = (text: string) => {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("## "))
      return <h3 key={i} className="text-sm font-semibold text-white mt-3 mb-1 first:mt-0">{line.slice(3)}</h3>
    if (line.startsWith("### "))
      return <h4 key={i} className="text-xs font-semibold text-zinc-300 mt-2 mb-0.5">{line.slice(4)}</h4>
    if (line.startsWith("- ") || line.startsWith("* "))
      return <li key={i} className="text-sm text-zinc-300 ml-4 list-disc leading-relaxed">{line.slice(2)}</li>
    if (/^\d+\.\s/.test(line))
      return <li key={i} className="text-sm text-zinc-300 ml-4 list-decimal leading-relaxed">{line.replace(/^\d+\.\s/, "")}</li>
    if (line.startsWith("**") && line.endsWith("**"))
      return <p key={i} className="text-sm font-semibold text-zinc-100">{line.slice(2, -2)}</p>
    if (line.trim() === "")
      return <div key={i} className="h-1.5" />
    return <p key={i} className="text-sm text-zinc-300 leading-relaxed">{line}</p>
  })
}