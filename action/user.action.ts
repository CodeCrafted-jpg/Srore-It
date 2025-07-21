"use server"

import { createAdminClient, createSessionClient } from "@/appwrite";
import { appwriteConfig } from "@/appwrite/config";
import { avatarPlaceholderUrl } from "@/constant";
import { HandleError } from "@/helps/error";
import { parseStringify } from "@/lib/utils";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID, Query } from "node-appwrite";


export const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient()
  const result = databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollection,
    [Query.equal("email", [email])],
  )

  return (await result).total > 0 ? (await result).documents[0] : null
}



export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    HandleError(error, "Failed to send email OTP");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send an OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollection,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarPlaceholderUrl,
        accountId,
      },
    );
  }

  return parseStringify({ accountId });
};

export const verifySession = async ({ accountId, password }: {
  accountId: string; password: string
}) => {
  try {
    const { account } = await createAdminClient()
    const session = await account.createSession(accountId, password)
      ; (await cookies()).set("appwrite-session", session.secret, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: true
      })

    return parseStringify({ sessionId: session.$id })
  } catch (error) {
    HandleError(error, "Failed to verify OTP")
  }

}

export const getCurrentUser = async () => {
  const { databases, account } = await createSessionClient()
  const result = await account.get()

  const user = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollection,
    [Query.equal("accountId", result.$id)]
  )
  if (user.total === 0) return redirect('/sign-in')


  return parseStringify(user.documents[0])

}

export const signOutUser = async () => {
  const { account } = await createSessionClient()
  try {
    await account.deleteSession('current');
    (await cookies()).delete('appwrite-session')

  } catch (error) {
    HandleError(error, "Failed to signout")
  }
  finally {
    redirect("/sign-in")
  }
}

export const signInUser=async({email}:{email:string})=>{


  try {
  const existingUser=await getUserByEmail(email)
  if(existingUser){
    await sendEmailOTP({email})
    return parseStringify({accountId:existingUser.accountId})
  }
  return parseStringify({accountId:null,error:"User not found"})
} catch (error) {
  HandleError(error,"Failed to signIn")
}

}