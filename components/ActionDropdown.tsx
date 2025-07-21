"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image'
import { Models } from 'node-appwrite'
import { actionsDropdownItems } from '@/constant'
import Link from 'next/link'
import { constructDownloadUrl } from '@/lib/utils'
import { Button } from './ui/button'
import { deleteFile, renameFiles, ShareFile } from '@/action/file.action'
import { usePathname } from 'next/navigation'
import { FileDeatils,ShareInput } from './ActionModalComponent'
import { Input } from './ui/input'
import { useToast } from "@/hooks/use-toast"






const ActionDropdown = ({file}:{file:Models.Document}) => {
   const [ismodelOpen, setIsModelOpen] = useState(false) 
   const [isDropdownOpen, setisDropdownOpen] = useState(false)
   const [action,setAction]=useState<ActionType | null>(null)
   const [name,setName]=useState(file.name)
   const [loading,setLoading]=useState(false)
   const [emails,setEmail]=useState<string[]>([])
   const path=usePathname()
   const toast=useToast()

   const closeAllModels=()=>{
    setIsModelOpen(false)
    setLoading(false)
    setisDropdownOpen(false)
    setAction(null)
    setName(file.name)
   }

   const handleAction=async()=>{
    if(!action) return
     setLoading(true)
    let success=false
    const actions = {
  rename: () => renameFiles({ fileId: file.$id, name, extension: file.extension, path }),
  share:()=>ShareFile({fileId: file.$id,emails,  path}),
  delete:()=>deleteFile({fileId:file.$id,bucketFileId:file.bucketFile,path})
}
  success = !!(await actions[action.value as keyof typeof actions]());



  if(success) {
    closeAllModels()
     if (action.value === 'share') {
     toast.toast({
        title: `➤File Shared successfully to ${emails[0]}`,
       className: "bg-emerald-500 text-white"
      });
    }
      if (action.value === 'delete') {
     toast.toast({
        title: `🗑️${file.name} is deleted succesfully`,
       className: "bg-emerald-500 text-white"
      });
    }
  }
  setLoading(false)

   }

   const handleRemoveUser=async(email:string)=>{
      const updateEmail=emails.filter((e)=>e !==email)
      const  succes=await ShareFile({
        fileId:file.$id,
        emails:updateEmail,
        path

      })
      if(succes){
        setEmail(updateEmail)
        
      }

   }


   const renderDialogContent=()=>{
    if(!action) return null
    const{value,label}=action
       return(
        <DialogContent className='shad-dialog button '>
            <DialogHeader className='flex flex-col gap-3'>
            <DialogTitle className='text-center text-brand-100'>
                {label}
            </DialogTitle>
           {value==="rename"&&(
            <Input className='share-input-field' type='text' placeholder='write the name here'
            value={name} onChange={(e)=>setName(e.target.value)}
            />
           )}
           {value==="details"&&<FileDeatils file={file} />}
           {value==="share"&&(<ShareInput file={file} onInputChange={setEmail} onRemove={handleRemoveUser}/>) }
            {value==="delete"&&
            <><p className=' text-center'>Are you sure you want to delete</p><span className='text-center'>{file.name} ?</span></>
            }

           </DialogHeader>
           {['rename','delete','share'].includes(value)&&(
            <DialogFooter  className='flex flex-col gap-3 md:flex-row'>
              <Button
              onClick={()=>closeAllModels()}
              className='modal-cancel-button'>
                cancel
              </Button>
              <Button
              className='modal-submit-button'
              onClick={()=>handleAction()}
              >
                <p className='capitalize'>{value}</p>
                {loading&&(
                  <Image 
                  src={'/assets/icons/loader.svg'}
                  alt='loader'
                  width={30}
                  height={30}
                  className='animate-spin'
                  />
                )}
              </Button>
            </DialogFooter>
           )}
        </DialogContent>
       )
   }
  return (
    <Dialog open={ismodelOpen} onOpenChange={setIsModelOpen}>
<DropdownMenu open={isDropdownOpen} onOpenChange={setisDropdownOpen}>
  <DropdownMenuTrigger className='shad-no-focus'>
    <Image 
    src={"/assets/icons/dots.svg"}
    alt='dots'
    width={34}
    height={30}
    />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel className='max-w-[200px] truncate'>{file.name}</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {actionsDropdownItems.map((actionItems)=>(
        <DropdownMenuItem key={actionItems.value} className='shad-dropdown-item'
        onClick={()=>{
            setAction(actionItems)
            if(["rename","share","delete","details"].includes(actionItems.value)){
                setIsModelOpen(true)
            }
        }}
        >
         {actionItems.value==="download" ? (<Link href={constructDownloadUrl(file.bucketFile)} 
         className='flex item-center gap-2'
           download={file.name}>
            <Image 
            src={actionItems.icon}
            alt='actionItem'
            width={30}
            height={30}
            />
            {actionItems.label}
           </Link>):(
           <div className='flex item-center gap-2'>
             <Image 
            src={actionItems.icon}
            alt='actionItem'
            width={30}
            height={30}
            />
            {actionItems.label}
           </div>
           )}
        </DropdownMenuItem>
    ))}
    
  </DropdownMenuContent>
</DropdownMenu>
{renderDialogContent()}

    </Dialog>
  )
}

export default ActionDropdown