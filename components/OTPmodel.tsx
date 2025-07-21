"use client"

import React, { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import Image from 'next/image'
import { Button } from './ui/button'
import { sendEmailOTP, verifySession } from '@/action/user.action'
import { useRouter } from 'next/navigation'

const OTPmodel = ({ email, accountId }: { accountId: string; email: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // ✅ Automatically open modal on mount
  useEffect(() => {
    setIsOpen(true)
  }, [])

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const sessionId = await verifySession({ accountId, password })
      if (sessionId) {
        router.push("/")
      }
    } catch (error) {
      console.error("❌ Failed to verify OTP", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      await sendEmailOTP({ email })
    } catch (error) {
      console.error("❌ OTP sending error", error)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className='shad-alart-dialoge'>
        <AlertDialogHeader className='relative flex justify-center'>
          <AlertDialogTitle className='h2 text-center'>
            Enter your OTP
            <Image
              src={"/assets/icons/close-dark.svg"} // ✅ also make sure path is correct
              alt='close'
              height={20}
              width={20}
              onClick={() => setIsOpen(false)}
              className='otp-close-button cursor-pointer absolute right-2 top-2'
            />
          </AlertDialogTitle>
          <AlertDialogDescription className='subtitle-2 text-center text-light-100'>
            We’ve sent an OTP to <span className='pl-1 text-brand'>{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className='shad-otp'>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot key={index} index={index} className='shad-otp-slot' />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className='flex w-full flex-col gap-4'>
            <AlertDialogAction
              onClick={handleSubmit}
              className='shad-submit-btn'
              disabled={isLoading}
            >
              Continue
              {isLoading && (
                <Image
                  src={'/assets/icons/loader.svg'}
                  alt='loader'
                  width={24}
                  height={24}
                  className='ml-2 animate-spin'
                />
              )}
            </AlertDialogAction>
            <div className='subtitle-2 mt-2 text-center text-light-200'>
              Didn’t get a code?
              <Button
                type='button'
                variant="link"
                className='pl-1 text-brand'
                onClick={handleResendOTP}
              >
                Click to resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default OTPmodel
