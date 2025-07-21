"use server"

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite"
import { appwriteConfig } from "./config"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"



//lets users do crud on their data
export const createSessionClient=async()=>{
    const client=new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)

    const session=(await cookies()).get('appwrite-session')
    if(!session || !session.value){
        // throw new Error("No Session")
        redirect("/sign-in")
    }
        client.setSession(session?.value)

        return {
            get account(){
                return new Account(client)
            },
            get databases(){
                return new Databases(client)
            }
        }
        
    }

//lets admin management to manage whole appwrite project
export const createAdminClient=async()=>{
  const client=new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.sectectKey)

    

        return {
            get account(){
                return new Account(client)
            },
            get databases(){
                return new Databases(client)
            },
            get storages(){
                return new Storage(client)
            },
            get avatars(){
                return new Avatars(client)
            }
        }
        
    }




