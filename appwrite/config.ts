export const appwriteConfig = {
    projectId:process.env. NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
    endpoint:process.env. NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    userCollection: process.env.NEXT_PUBLIC_APPWRITE_USER_ID!,
    fileCollection: process.env.NEXT_PUBLIC_APPWRITE_FILES_ID!,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKETID!,
    sectectKey: process.env.NEXT_APPWRITE_SECRECT_KEY!
}