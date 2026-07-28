export const CommuneAiHeader = () => {
  return (
    <div className="shrink-0 border-b-2 border-neutral-800 bg-[#313338]">
      <div className="flex items-center h-12 px-4 gap-3">
        <div className="w-6 h-6 rounded-full bg-linear-to-br from-indigo-500 to-violet-600
          flex items-center justify-center shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="white"/>
          </svg>
        </div>
 
        <p className="font-mono font-semibold text-md text-white">CommuneAI</p>
      </div>
    </div>
  )
}