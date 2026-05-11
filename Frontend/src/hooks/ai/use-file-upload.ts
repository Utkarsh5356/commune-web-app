import { useState, useCallback } from "react";
import { uploadCloudinary } from "@/lib/cloudinary";
import type { MediaType } from "@/ai-types/commune-ai";

export interface PendingMedia {
    url: string
    type: MediaType
    name: string
}

export const useFileUpload = () => {
    const [ pendingMedia, setPendingMedia ] = useState<PendingMedia | null>(null) 
    const [ uploadProgress, setUploadProgress ] = useState(0)
    const [ uploading, setUploading ] = useState(false)

    const handleFile = useCallback(async (file:File) => {
      const isVideo = file.type.startsWith("video/")
      const isImage = file.type.startsWith("image/")
      if(!isVideo && !isImage) return alert("Only images and videos are supported")
      if(file.size > 500 * 1024 * 1024) return alert("File must be under 500MB")
      
      setUploading(true)
      setUploadProgress(0)

      try{
        const url = await uploadCloudinary(file, setUploadProgress)
        setPendingMedia({url, type: isVideo ? "video" : "image", name: file.name})
      }catch{
        alert("Upload failed. Please try again.")
      }finally{
        setUploading(false)
      }
    }, [])

    return {
      pendingMedia,
      uploadProgress,
      uploading,
      handleFile,
      clearMedia: () => setPendingMedia(null) 
    }
}