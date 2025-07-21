"use client"

import { email, minLength, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Image from "next/image"

import Link from "next/link"
import { createAccount, signInUser } from "@/action/user.action"
import OTPmodel from "./OTPmodel"


type FormType = "sign-in" | "sign-up"

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
  })
}


const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setisLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [accountId, setAccountId] = useState(null)
  const formSchema = authFormSchema(type)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: ""
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setisLoading(true)
    setErrorMessage("")
    try {
      const user =
        type === "sign-up" 
        ? 
        await createAccount({
          fullName: values.fullName || "",
          email: values.email,
        }) 
        :
          await signInUser({ email: values.email })
      setAccountId(user.accountId)
      console.log("✅ Account ID:", user.accountId)
    } catch (error) {
      setErrorMessage("Filed to create an account please try again")
    }
    finally {
      setisLoading(false)
    }

  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in" ? "Sign-in" : "Sign-up"}
          </h1>
          {type === "sign-up" && (<FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label py-2">Full Name</FormLabel>


                  <FormControl>
                    <Input className="shad-form-input" placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form-message" />
                </div>
              </FormItem>
            )}
          />)}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label py-2">Email</FormLabel>


                  <FormControl>
                    <Input className="shad-form-input" placeholder="Enter your Email" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form-message" />
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="form-submit-button" disabled={isLoading}>
            {type === "sign-in" ? "Sign In" : "Sign Up"}
            {isLoading && (
              <Image
                src={"assets/icons/loader.svg"}
                height={24}
                width={24}
                alt="loader"
                className="ml-2"
              />
            )}
          </Button>
          {errorMessage && (
            <p className="error-message">{errorMessage}</p>
          )}
          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"
              }

              <Link
                className="m-1 font-medium text-brand"
                href={type === "sign-in" ? "/sign-up"
                  : "/sign-in"
                }
              >
                {type === "sign-in" ? "Sign up"
                  : "Sign in"}
              </Link>
            </p>
          </div>
        </form>
      </Form>


      {accountId && (
        <OTPmodel email={form.getValues("email")} accountId={accountId} />
      )}


    </>
  )
}

export default AuthForm
