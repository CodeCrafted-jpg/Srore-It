import { getCurrentUser } from '@/action/user.action'
import Header from '@/components/Header'
import MobileNavBar from '@/components/MobileNavBar'
import Sidebar from '@/components/Sidebar'
import { redirect } from 'next/navigation'
import { Toaster } from "@/components/ui/toaster"
 


import React, { ReactNode } from 'react'

const Rootlayout =async ({children}:{children:React.ReactNode}) => {
    const currentUser= await getCurrentUser()

    if(!currentUser)
        return redirect("/sign-in")
  return (
    <main className='flex h-screen'>
         <Sidebar {...currentUser} />
        <section className='flex flex-1 flex-col h-full'>
       <MobileNavBar {...currentUser}  />
       <Header userId={currentUser.$id} accountId={currentUser.accountId} />
        <div className='main-content'>{children}</div>
          <Toaster />
        </section>
        </main>
  )
}

export default Rootlayout