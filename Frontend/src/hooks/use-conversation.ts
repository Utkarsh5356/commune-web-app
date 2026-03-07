import { useAuth } from "@clerk/clerk-react"
import { useMutation,useQueryClient } from "@tanstack/react-query";
import axios from "axios"

export const getOrCreateConversation=(memberOneId: string | undefined,memberTwoId: string)=>{
  const { getToken } = useAuth()
  const queryClient= useQueryClient()

  const { mutateAsync: createConversation } = useMutation({
    mutationFn: async()=>{
     const token=await getToken()
     const createConversation=await axios.post(`http://localhost:3000/api/v1/conversation/create-conversation`,{
       memberOneId,
       memberTwoId,
       },{ 
       headers:{
         'Authorization':`Bearer ${token}`,
         'Content-Type':'application/json'
       }
       }
      )
     return createConversation.data
    },
    onSuccess: (newConversation) => {
      queryClient.setQueryData(
        ["findConversation", memberOneId, memberTwoId],
        newConversation
      )
    }
  })
  
  const getOrCreate = async()=>{
    const cached=queryClient.getQueryData(["findConversation", memberOneId, memberTwoId])
    if(cached) return cached 

    try{
      const token=await getToken()
      const findConversation=await axios.get(`http://localhost:3000/api/v1/conversation/find-conversation`,{
        headers:{
          'Authorization':`Bearer ${token}`,
          'memberOneId': memberOneId,
          'memberTwoId': memberTwoId,
          'Content-Type':'application/json'
        }
        }
      )
      if(findConversation.data){
       queryClient.setQueryData(["findConversation", memberOneId, memberTwoId],findConversation.data) 
       return findConversation.data 
      } 
    }catch(err){
      if(axios.isAxiosError(err) && err.response?.status === 404) {
       return await createConversation()
      }

      throw err
    }
  }

  return {
    getOrCreate,
  }
}

