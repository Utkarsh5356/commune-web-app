export const uploadCloudinary=(
    file:File,
    onProgress: (p:number)=>void
):Promise<string>=>{
   return new Promise((resolve,reject)=>{
    const xhr=new XMLHttpRequest()
    const formData=new FormData()

    formData.append("file",file)
    formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    )

    xhr.upload.onprogress=(event)=>{
        if(event.lengthComputable){
            const percent=Math.round((event.loaded / event.total)*100)
            onProgress(percent)
        }
    }
    xhr.onload=()=>{
        const res=JSON.parse(xhr.responseText)
        resolve(res.secure_url)
    }
    xhr.onerror = reject

    xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`

    )

    xhr.send(formData)
   })
}