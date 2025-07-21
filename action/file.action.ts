"use server"

import { createAdminClient } from "@/appwrite"

import {InputFile} from 'node-appwrite/file'
import { appwriteConfig } from "@/appwrite/config"
import { ID, Models, Query } from "node-appwrite"
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { HandleError } from "@/helps/error"
import { getCurrentUser } from "./user.action"


//  export const HandleError = (error: unknown, message: string) => {
//   console.log(error, message)
//   throw error

// }


export const UploadFiles=async({file,ownerId,accountId,path}:UploadFileProps)=>{
const {storages,databases}=await createAdminClient()
try {
   const inputFile=InputFile.fromBuffer(file,file.name)
   const bucketFile=await storages.createFile(appwriteConfig.storageBucket,
    ID.unique(),
    inputFile 
)
const FileDocument={
    type:getFileType(bucketFile.name).type,
    name:bucketFile.name,
    url:constructFileUrl(bucketFile.$id),
    extension:getFileType(bucketFile.name).extension,
    size:bucketFile.sizeOriginal,
    owner:ownerId,
    accountId:accountId,
    users:[],
    bucketFile:bucketFile.$id
    
}
// console.log(accountId)
// console.log(ownerId)

const newFile=await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.fileCollection,
    ID.unique(),
    
    
    FileDocument
).catch(async(error:unknown)=>{
    await storages.deleteFile(appwriteConfig.storageBucket,bucketFile.$id)
    HandleError(error,"Failed to create file document")
})
revalidatePath(path)
return parseStringify(newFile)
} catch (error) {
   HandleError(error,"Error while uploading files !")
}
}

const createQueries = (
  currentUser:any,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number,
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));

  if (sort) {
    const [sortBy, orderBy] = sort.split("-");

    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy),
    );
  }

  return queries;
};

export const getFiles = async (
 { types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit,}:GetFilesProps
 ) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User not found");

    const queries = createQueries(currentUser,types,searchText,sort,limit);
    // console.log(currentUser,queries)

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollection,
      queries,
    );
    

    // console.log({ files });
    return parseStringify(files);
  } catch (error) {
    HandleError(error, "Failed to get files");
  }
};


 export const renameFiles=async({fileId,name,extension,path}:RenameFileProps)=>{
const {databases}= await createAdminClient()
try {
  const newName=`${name}.${extension}`
  const upadatedFile=await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.fileCollection,
    fileId,
   {
     name:newName
   }
  );
  revalidatePath(path)
  return  parseStringify(upadatedFile)
  
} catch (error) {
  HandleError(error,"Failed to rename file")
}
}


export const deleteFile=async({fileId,path,bucketFileId}:DeleteFileProps)=>{
  const {databases,storages}=await createAdminClient()
  try {
    const deleteFileId=await databases.deleteDocument(
     appwriteConfig.databaseId,
    appwriteConfig.fileCollection,
    fileId
    )
        if (deleteFileId) {
      await storages.deleteFile(appwriteConfig.storageBucket, bucketFileId);
    }
    
    revalidatePath(path)
    return ({success:200,message:"File deleted Successfully"})
  } catch (error) {
    HandleError(error,"Error while deleting file")
  }
}

 export const ShareFile=async({fileId,emails,path}:UpdateFileUsersProps)=>{
const {databases}= await createAdminClient()
try {
  
  const upadatedFile=await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.fileCollection,
    fileId,
   {
     users:emails
   }
  );
  revalidatePath(path)
  return  parseStringify(upadatedFile)
  
} catch (error) {
  HandleError(error,"Failed to rename file")
}
}