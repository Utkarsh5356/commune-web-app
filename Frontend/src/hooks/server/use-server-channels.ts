import { useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

interface Channel {
  id: string
  name: string
  type: string
}

export const useServerChannels = () => {
  const { getToken } = useAuth()
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(false)

  const fetchChannels = async (serverId: string) => {
    if (!serverId) { setChannels([]); return }
    setLoading(true)
    try {
      const token = await getToken()
      const res = await axios.get(
        `http://localhost:3000/api/v1/channel/all?serverId=${serverId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setChannels(res.data.filter((ch: Channel) => ch.type === "TEXT"))
    } catch {
      setChannels([])
    } finally {
      setLoading(false)
    }
  }

  const clearChannels = () => setChannels([])

  return { channels, loading, fetchChannels, clearChannels }
}