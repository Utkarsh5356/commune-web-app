const AiIcon = () => (
  <div className="w-8 h-8 rounded-full shrink-0
    bg-linear-to-br from-indigo-500 to-violet-600
    flex items-center justify-center">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="white"/>
    </svg>
  </div>
)

export const TypingIndicator = () => (
  <div className="flex items-start gap-3 px-4 py-1">
    <AiIcon />
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-indigo-400 mb-1">CommuneAI</span>
      <div className="flex gap-1 items-center bg-zinc-700/40 rounded-2xl rounded-tl-sm px-3 py-2.5">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  </div>
)