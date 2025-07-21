import Link from 'next/link';
import { Models } from 'node-appwrite';
import React from 'react';
import Thumbnail from './Thumbnail';
import { convertFileSize } from '@/lib/utils';
import FormattedDateTIme from './FormattedDateTIme';
import ActionDropdown from './ActionDropdown';

const Card = ({ file }: { file: Models.Document }) => {
  return (
    <Link href={file.url} target="_blank" rel="noopener noreferrer">
      <div className="group flex w-full max-w-xl flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Thumbnail */}
          <div className="flex-shrink-0">
            <Thumbnail
              type={file.type}
              extension={file.extension}
              url={file.url}
              className="size-20 rounded-md bg-gray-100 dark:bg-gray-800"
              imageClassName="size-12"
            />
          </div>

          {/* Right: Actions + Size */}
          <div className="flex flex-1 flex-col items-end justify-between">
            <ActionDropdown file={file} />
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
              {convertFileSize(file.size)}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-gray-800 dark:text-white truncate">
            {file.name}
          </p>
          <FormattedDateTIme
            date={file.$createdAt}
            className="text-xs text-gray-500 dark:text-gray-400"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            <span className="font-medium text-brand-600 dark:text-brand-400">By:</span>{' '}
            {file.owner.fullName}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
