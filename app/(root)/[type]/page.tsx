import { getFiles } from '@/action/file.action'
import { getCurrentUser } from '@/action/user.action';
import Card from '@/components/Card';
import Sort from '@/components/sort'
import { convertFileSize, getFileTypesParams } from '@/lib/utils';
import { Models } from 'node-appwrite'
import React from 'react'

const Page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";
  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";

  const types = getFileTypesParams(type) as FileType[];

  const files = await getFiles({types,searchText,sort});
  console.log(types)
const totalSize: number = files.documents.reduce((acc: number, file: Models.Document) => {
  // Adjust the key name if your size field is different
  const size = file.size as number | undefined;
  return acc + (size || 0);
}, 0);


  // console.log(files)


  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">{convertFileSize(totalSize)}</span>
          </p>
          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      {/* ✅ Corrected: Checking array length */}
      {files.total > 0 ? (
        <section className="file-list border-b-gray-100 sm:flex-col">
          {files.documents.map((file: Models.Document) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No Files Uploaded</p>
      )}
    </div>
  );
};


export default Page