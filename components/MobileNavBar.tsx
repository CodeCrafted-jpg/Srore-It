"use client"
import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { avatarPlaceholderUrl, navItems } from '@/constant'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import FileUpload from './FileUpload'
import { Button } from './ui/button'
import { signOutUser } from '@/action/user.action'

interface Props {
  avatar?: string
  fullName: string
  email: string
  ownerId: string
  accountId: string
}

const MobileNavBar = ({ avatar, fullName, email, ownerId, accountId }: Props) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return (
    <header className='mobile-header'>
      <Image
        src={"/assets/icons/logo-full-brand.svg"}
        alt='logo'
        height={52}
        width={120}
        className='h-auto'
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
           src={"/assets/icons/menu.svg"}
            alt='menu'
            width={30}
            height={30}
            onClick={() => setOpen(true)}
          />
        </SheetTrigger>
        <SheetContent className='shad-sheet h-screen px-3'>

          <SheetTitle className='py-5'>
            <div className='header-user'>
              {avatar ? (<Image src={avatar} alt='avatar' height={30} width={30} className='header-user-avatar' />) :
                <Image src={avatarPlaceholderUrl} alt='avatar' height={30} width={30} className='header-user-avatar' />
              }
               <p>{fullName}</p>
              
            </div>
            <p>{email}</p>
          </SheetTitle>
          <nav className='mobile-nav'>

            <ul className="flex flex-1 flex-col gap-6">
              {navItems.map(({ url, name, icon }) => (
                <Link key={name} href={url} className="lg:w-full">
                  <li
                    className={cn(
                      "mobile-nav-item",
                      pathname === url && "shad-active",
                    )}
                  >
                    <Image
                      src={icon}
                      alt={name}
                      width={24}
                      height={24}
                      className={cn(
                        "nav-icon",
                        pathname === url && "nav-icon-active",
                      )}
                    />
                    <p>{name}</p>
                  </li>
                </Link>
              ))}
            </ul>

          </nav>
          <div className="flex flex-col justify-between gap-5 pb-5">
            <FileUpload ownerId={ownerId} accountId={accountId} className={""}/>
            <Button type='submit' className="mobile-sign-out-button">
              <Image
                src={"/assets/icons/logout.svg"}
                alt='logo'
                width={24}
                height={24}
                onClick={async() =>await signOutUser()}
              />
              Logout
            </Button>

          </div>

        </SheetContent>
      </Sheet>
    </header>
  )
}

export default MobileNavBar