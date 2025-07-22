import { getFiles, getTotalSpaceUsed } from "@/action/file.action";
import ActionDropdown from "@/components/ActionDropdown";
import FormattedDateTIme from "@/components/FormattedDateTIme";
import StoragePieChart from "@/components/StorageChat";
import Thumbnail from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";


const Home = async () => {


  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);
  const usageSummary = getUsageSummary(totalSpace);
  console.log (`${convertFileSize( totalSpace.used)} out of ${convertFileSize( totalSpace.all)}`)
  const used = totalSpace.used;
const total = totalSpace.all;


  return (
    <div className="dashboard-container">
   
      <section>
           <StoragePieChart used={used} total={total} />
        <ul className="dashboard-summary-list">
          {usageSummary.map((summery) => (
            <Link
              href={summery.url}
              key={summery.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">

                  <Image
                    alt="type"
                    src={summery.icon}
                    width={110}
                    height={100}
                  />
                  <h4 className="summary-type-size text-brand">
                    {convertFileSize(summery.size) || 0}
                  </h4>


                </div>
                <h5 className="summary-type-title">{summery.title}</h5>
                <Separator className="bg-light-400" />
                <FormattedDateTIme
                  date={summery.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}

        </ul>
      </section>


      <section className="dashboard-recent-files">

      <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
        {files.documents.length > 0 ? (
<ul className="mt-5 flex flex-col gap-4 ">
  {files.documents.map((file: Models.Document) => (
    <li
      key={file.$id}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
    >
      <Link
        href={file.url}
        target="_blank"
        className="flex items-start sm:items-center gap-3 w-full sm:w-auto"
      >
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
        />
        <div className="flex flex-col gap-1 max-w-full overflow-hidden">
          <p className="recent-file-name truncate text-sm font-medium text-light-100">
            {file.name}
          </p>
          <FormattedDateTIme
            date={file.$createdAt}
            className="caption text-xs text-gray-400"
          />
        </div>
      </Link>

      <div className="self-end sm:self-center">
        <ActionDropdown file={file} />
      </div>
    </li>
  ))}
</ul>

      ):(
       <p className="cpation text-center">No files uploaded yet</p>
      )
      }





      </section>



    </div>
  );
}

export default Home