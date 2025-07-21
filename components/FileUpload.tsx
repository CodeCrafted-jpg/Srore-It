"use client"
import React, { useState } from 'react'
import  {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { Button } from './ui/button'
import { cn, convertFileToUrl } from '@/lib/utils'
import Image from 'next/image'
import {getFileType} from '@/lib/utils'
import Thumbnail from './Thumbnail'
import { MAX_FILE_SIZE } from '@/constant'
import { useToast } from "@/hooks/use-toast"
import { UploadFiles } from '@/action/file.action'
import { usePathname } from 'next/navigation'


interface Props{
  ownerId:string
  accountId:string
  className:string
}

const FileUpload = ({ownerId,accountId,className}:Props) => {
  const path=usePathname()
  const { toast } = useToast()
  const [file, setFile] = useState<File[]>([])





const onDrop = useCallback(async (acceptedFiles: File[]) => {
  setFile(acceptedFiles);

  const uploadPromises = acceptedFiles.map(async (file) => {
    if (file.size > MAX_FILE_SIZE) {
      setFile((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
      toast({
        title: "❌ File Not Uploaded!",
        description: (
          <p className="body-2 ">
            <span className="font-semibold">{file.name}</span> is too large. Max size is 50MB
          </p>
        ),
        className: "error-toast",
      });
      return;
    }

    try {
      const uploaded = await UploadFiles({ file, ownerId, accountId, path });

      if (uploaded) {
        setFile((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
        toast({
          title: "✅ File Uploaded!",
          description: (
            <p className="body-2 e">
              <span className="font-semibold">{file.name}</span> is uploaded successfully
            </p>
          ),
          className:"bg-emerald-500 text-white"
        });
      }
    } catch (err) {
      toast({
        title: "❌ Upload failed!",
        description: (
          <p className="body-2">
            <span className="font-semibold">{file.name}</span> failed to upload
          </p>
        ),
        className: "error-toast",
      });
    }
  });

  await Promise.all(uploadPromises);
}, [ownerId, accountId, path]);



  const {getRootProps, getInputProps} = useDropzone({onDrop})



const handleRemoveFile=(e:React.MouseEvent<HTMLImageElement,MouseEvent>,fileName:string)=>{
e.stopPropagation()
setFile((prevFiles)=>prevFiles.filter((file) => file.name !== fileName))
}
  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button type='button' className={cn('uploader-button',className)} >
        <Image
        src={'/assets/icons/upload.svg'}
        width={24}
        height={24}
        alt='upload'
        />
        Upload
      </Button>
      {file.length>0&&
      <ul className='uploader-preview-list'>
        <h4 className='h4 text-brand'>
       uploading
        </h4>
       {file.map((file,index)=>{
        const {type,extension}=getFileType(file.name)

        return(
          <li key={`${file.name}-${index}`}
          className='uploader-preview-item'
          >
   <div className='flex items-center'>
    <Thumbnail
    type={type}
    extension={extension} 
    url={convertFileToUrl(file)}
    
     />
     <div className='p-10'>
        {file.name}
        <Image
        src={"/assets/icons/file-loader.gif"} 
        width={82}
        height={26}
        alt="loader"
        className='py-3'
        />
       </div>
   </div>
    <Image
        src={"/assets/icons/remove.svg"} 
        width={30}
        height={24}
        alt="cross"
        className='py-3'
        onClick={(e)=>handleRemoveFile(e,file.name)}
        />
           
     </li>
        )
       })}
      </ul>
} 

    </div>
  )
}

export default FileUpload