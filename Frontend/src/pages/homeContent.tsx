import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, Hash, Plus, LogIn } from "lucide-react"

export const HomeContent = () => {
  const navigate = useNavigate()
  const [inviteCode, setInviteCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleJoin = async (e: React.SubmitEvent) => {
    e.preventDefault()
    const invite = inviteCode.trim()
    if (!invite) return
    setLoading(true)
    setError("")
    const code = invite.slice(22,invite.length)
    navigate(`/${code}`)
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#313338] px-6">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600
            flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="white"/>
              <path d="M19 16L19.8 18.2L22 19L19.8 19.8L19 22L18.2 19.8L16 19L18.2 18.2L19 16Z" fill="white" opacity="0.7"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white font-mono">Welcome to Commune</h1>
          <p className="text-zinc-400 text-sm mt-2">
            Join a server with an invite code or create your own
          </p>
        </div>

        {/* Join via invite code */}
        <div className="bg-[#1E1F22] rounded-2xl p-6 border border-zinc-800/50">
          <div className="flex items-center gap-2 mb-4">
            <LogIn className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white font-mono">Join a Server</h2>
          </div>
          <p className="text-xs text-zinc-500 mb-4">
            Enter an invite link or code to join an existing server
          </p>
          <form onSubmit={handleJoin} className="space-y-3">
            <input
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value)}
              placeholder="https://commune.app/invite/htkSKqUY or htkSKqUY"
              disabled={loading}
              className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-4 py-3
                text-zinc-200 text-sm placeholder:text-zinc-600
                focus:outline-none focus:border-indigo-500/60 transition
                disabled:opacity-50"
            />
            {error && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20
                rounded-lg px-3 py-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !inviteCode.trim()}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-white
                bg-indigo-600 hover:bg-indigo-500 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Joining…</>
                : "Join Server"
              }
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-400/50" />
          <span className="text-xs text-zinc-400">or</span>
          <div className="flex-1 h-px bg-zinc-400/50" />
        </div>

        {/* Create server hint */}
        <div className="bg-[#1E1F22] rounded-2xl p-6 border border-zinc-800/50">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white font-mono">Create a Server</h2>
          </div>
          <p className="text-xs text-zinc-500">
            Use the <span className="text-zinc-300 font-medium">+</span> button in the left sidebar
            to create your own server and invite your team.
          </p>
        </div>

        {/* DM hint */}
        <div className="flex items-center gap-3 px-2">
          <Hash className="w-4 h-4 text-zinc-400 shrink-0" />
          <p className="text-xs text-zinc-400">
            Select a server from the sidebar to start chatting,
            or click on a member to send a direct message.
          </p>
        </div>

      </div>
    </div>
  )
}