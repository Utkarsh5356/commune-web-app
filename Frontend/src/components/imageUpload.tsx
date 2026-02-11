import { useState } from "react";
import { uploadCloudinary } from "@/lib/cloudinary";
import { X,Camera } from "lucide-react";

interface imageUploadProps{
    value: string
    onChange: (url:string) => void
    disabled?: boolean
}

export const ImageUpload=({value,onChange,disabled} : imageUploadProps)=>{
  const [isUploading,setIsUploading]=useState(false)
  const [progress,setProgress]=useState(0)

  const onFileChange=async(e: React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0]
    if(!file) return 
     
    setIsUploading(true)
    setProgress(0)

    const url=await uploadCloudinary(file,setProgress)
    onChange(url)
    {e.target.value=""}

    setIsUploading(false)
  }
  
  return(
    <div className="relative">
       <label className="group relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-full overflow-hidden border">
         {value ? (
            <>
             <img 
              src={value} 
              alt="Server"
              className="h-full w-full object-cover" 
             />
            </>
         ):(
            <Camera className="h-6 w-6 text-zinc-500" />
         )}

         <input 
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
          disabled={disabled || isUploading}  
         /> 
       </label>

        {value ? 
         <button
           type="button"
           onClick={()=>onChange("")}
           className="absolute top-1 right-1 bg-black/60 rounded-full p-1 cursor-pointer"
          >
           <X className="h-4 w-4 text-white"/>
         </button>
         : null
        }
       {isUploading && (
        <div className="mt-2 h-5 w-24 bg-zinc-200 rounded">
          <div
           className="h-full bg-indigo-600 rounded"
           style={{ width:`${progress}%` }}
          >        
          </div>
        </div>
       )}
    </div>
  )
}