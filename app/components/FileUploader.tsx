import React from "react";
import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import {formatFileSize} from '~/lib/utils'

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0] || null;

    onFileSelect?.(file)

  }, [onFileSelect])

  const {getRootProps, getInputProps, acceptedFiles} = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'application/pdf': ['.pdf']},
    maxSize: 20 * 1024 * 1024
  })

  const file = acceptedFiles[0] || null

  return (
    <div className='w-full gradient-border'>
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className='space-y-4 cursor-pointer'>

                {file ? (
                    <div className='uploader-selected-file' onClick={(e) => e.stopPropagation()}>
                        <img src='/images/pdf.png' className='size-10' alt='pdf' />
                        <div className='flex items-center space-x-3'>
                            <div>
                              <p className='text-sm font-medium text-gray-700 truncate max-w-xs'>
                                {file.name}
                              </p>
                              <p className='text-sm text-gray-500'>
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                        </div>

                        <button className='p-2 cursor-pointer' onClick={() => {
                            onFileSelect?.(null)
                        }}>
                            <img src='/icons/cross.svg' alt='remove' className='w-4 h-4'/>
                        </button>
                    </div>
                ) : (
                    <div className='text-center mx-auto'>
                        <div className='flex items-center justify-center mx-auto w-16 h-16 mb-2'>
                            <img src='/icons/info.svg' alt='upload' className='size-20'/>
                        </div>
                        <p className='text-lg text-gray-500'>
                            <span className='semi-bold'>
                              Click to upload
                            </span> or drag and drop
                        </p>

                        <p className='text-lg text-gray-500'>
                            PDF (max 20 MB)
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default FileUploader;
