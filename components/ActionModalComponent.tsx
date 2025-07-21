import React from 'react'
import { Models } from 'node-appwrite'
import Thumbnail from './Thumbnail'
import FormattedDateTIme from './FormattedDateTIme'
import { convertFileSize } from '@/lib/utils'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Image from 'next/image'

export const ImageThumbnail=({file}:{file:Models.Document})=>{
    return(
<div className='file-details-thumbnail'>
    <Thumbnail 
    type={file.type}
    extension={file.extension}
    url={file.url}
    />
    
<div className='flex flex-col'>
<p className='font-semibold'>{file.name}</p>
<FormattedDateTIme className='caption py-1'  date={file.$createdAt}/>
</div>
</div>
)
}

export const DetailRow=({file}:{file:Models.Document})=>{
    const size=convertFileSize(file.size)
    
    return(
<div className='flex flex-col'>
   <p className='flex gap-2 text-light-100'><span className='font-bold text-brand'>Format:</span>{file.extension}</p>
    <p className='flex gap-2 text-light-100'><span className='font-bold text-brand'>Size:</span>{size}</p>
    <p className='flex gap-2 text-light-100'><span className='font-bold text-brand'>Owner:</span>{file.owner.fullName}</p>
    <p className='flex gap-2 text-light-100'><span className='font-bold text-brand'>Format:</span><FormattedDateTIme date={file.$updatedAt} className="text-light-100" /></p>
</div>
    )
}



export const FileDeatils = ({file}:{file:Models.Document}) => {
  return (
    <>
        <ImageThumbnail file={file}/>
        <DetailRow  file={file}/>
        

    </>
  )
}
interface Props{
    file:Models.Document,
    onInputChange:React.Dispatch<React.SetStateAction<string[]>>,
    onRemove:(email:string)=>void
}

 export const ShareInput = ({file,onInputChange,onRemove}:Props) => {
  return (
   <div>
    <ImageThumbnail 
    file={file}
    />
    <div className='share-wrapper'>
        <p className='subtitle-2  p-1 text-light-100 '>Share file with other users</p>
        <Input 
        type="email"
        placeholder='Enter an email'
        onChange={(e)=>onInputChange(e.target.value.trim().split(","))}
        className='share-input-field'
        />
        <div className='p-4 '>
            <div className='flex justify-center'>
                <p className='subtitle-2 text-light-200 pr-10'>Share With</p>
                <p className='subtitle-2 text-light-200 pl-10'>{file.users.length} users</p>
            </div>
            <ul className='p-2'>
                {file.users.map((email:string)=>(
                    <li key={email}
                    className='flex items-center justify-between gap-2'>
                    <p className='subtitle-2'>{email}</p>
                    <Button
                    className='share-remove-user'
                    onClick={()=>onRemove(email)}>
                    <Image 
                    src={"/assets/icons/remove.svg"}
                    alt='remove'
                    width={30}
                    height={30}
                    className='bg-white'
                    />
                    </Button>
                    </li>
                ))}
            </ul>
        </div>
    </div>
   </div>
  )
}
