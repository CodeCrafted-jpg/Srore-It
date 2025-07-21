"use client"

import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { getFiles } from '@/action/file.action'
import { Models } from 'node-appwrite'
import Thumbnail from './Thumbnail'
import FormattedDateTIme from './FormattedDateTIme'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'


const Search = () => {
  const [input, setinput] = useState("")
  const searchParams= useSearchParams()
  const searchQueary=searchParams.get("input")||""
  const [result, setresult] = useState<Models.Document[]>([])
  const [open, setopen] = useState(false)
  const router=useRouter()

useEffect(() => {
  const featchFiles=async()=>{
    const files=await getFiles({searchText:input})
    setresult(files.documents)
    setopen(true)
  }
  

 featchFiles()
  }
, [input])



  useEffect(() => {
    if(searchQueary){
     setinput("")
    }
    }, [searchQueary])


    const handleClicKItem=(file:Models.Document)=>{
   setopen(false)
   setresult([])
    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type }?query=${input}`,
    );
    }


    const CloseModel=()=>{
     setopen(false)
     setinput("")
     setresult([])
    }
  
  return (
    <div className='search'>
    <div className='search-input-wrapper'>
      <Image
      src={"assets/icons/search.svg"}
      alt='search'
      width={20}
     height={20}
     />
     

      <Input
      type='text'
      placeholder='Search for files..'
      onChange={(e)=>setinput(e.target.value)}
      />
      <Button
      className='bg-white text-red hover:bg-brand-100'
     onClick={()=>CloseModel()}
      >
      x
      </Button>
      {open &&(
        <ul className='search-result'>
          {result.length>0 ? (
            result.map((file)=>
            <li key={file.$id}
            onClick={()=>handleClicKItem(file)}
            className='felx items-center justify-between'
            >
              <div className='flex cursor-pointer items-center gap-4'>
                <Thumbnail type={file.type} extension={file.extension}
                url={file.url} className='size-9 min-w-9' />
               <p className='subtitle-2 line-clamp-1 text-light-100'>{file.name}</p>  
              </div>
              <FormattedDateTIme date={file.$createdAt} className='caption line-clamp-1 text-light-200'/>
             </li>)
            ):(
              <p className='empty-result'>No files Found</p>
            )}
          
        </ul>
      )}
    </div>

    </div>
  )
}

export default Search