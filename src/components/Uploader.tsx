'use client';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { toast, Toaster } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export function Uploader() {
    const [file, setFile] = useState<{
      id: string,
      file: File,
      uploading: boolean,
      progress: number,
      key?: string,
      isDeleting: boolean,
      error: boolean,
      objecturl: string
    } | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const uploadedFile = acceptedFiles[0];
        setFile({
            id: uuidv4(), 
            file: uploadedFile,
            uploading: false,
            progress: 0,
            isDeleting: false,
            error: false,
            objecturl: URL.createObjectURL(uploadedFile)
        });
      }

      acceptedFiles.forEach(file => {
        uploadFile(file);
      });
       
    }, [])

    async function uploadFile(file: File) {
      setFile(prev => prev ? {...prev, uploading: true, progress: 0} : null);

      try {
         const preSignedUrlResponse = await fetch('/api/s3/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            fileName: file.name,
            contentType: file.type,
            size: file.size
          })
         })

          if(!preSignedUrlResponse.ok) {
            toast.error("Failed to get pre-signed URL");
            setFile(prev => prev ? {...prev, uploading: false, progress: 0, error: true} : null);
            return;
          }

          const {preSignedUrl, key} = await preSignedUrlResponse.json();

          await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
             
            xhr.upload.onprogress = (event) => {
              if(event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);
                setFile(prev => prev ? {...prev, progress, key: key} : null);
              }
            }

            xhr.onload = () => {
              if(xhr.status == 200 || xhr.status == 204) {
                setFile(prev => prev ? {...prev, uploading: false, progress: 100, error: false} : null);
                toast.success("File uploaded successfully");
                resolve();
              } else {
                reject(new Error("Upload failed with status:  " + xhr.status)); 
              }
            } 

            xhr.onerror = () => {
              reject(new Error("Upload failed due to a network error"));
            }

            xhr.open("PUT", preSignedUrl);
            xhr.setRequestHeader("Content-Type", file.type);
            xhr.send(file);
          })

      } catch {

        toast.error("File upload failed");
        setFile(prev => prev ? {...prev, uploading: false, progress: 0, error: true} : null); 
      } 
    }

    const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
        if(fileRejections.length > 0) {
          // Check for specific error types
          const tooManyFiles = fileRejections.some(
            (fileRejection) => fileRejection.errors.some(error => error.code === "too-many-files")
          );

          const fileTooLarge = fileRejections.some(
            (fileRejection) => fileRejection.errors.some(error => error.code === "file-too-large")
          );

          const invalidType = fileRejections.some(
            (fileRejection) => fileRejection.errors.some(error => error.code === "file-invalid-type")
          );

          // Show appropriate error message
          if(tooManyFiles) {
            toast.error("You can only upload one file at a time.");
          } else if(fileTooLarge) {
            toast.error("File is too large. Maximum size is 10 MB.");
          } else if(invalidType) {
            toast.error("Invalid file type. Please upload PDF or DOCX files only.");
          } else {
            toast.error("File upload failed. Please try again.");
          }
        }
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
      onDrop,
      onDropRejected,
      maxFiles: 1,
      maxSize: 10485760, // 10 MB in bytes
      accept: {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/pdf': ['.pdf'],
      }
    })
    
    return (
        <>
            <Toaster />
            <Card className={cn(
                'relative border-2 border-dashed transition-colors duration-200 ease-in-out w-1/2 h-screen',
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-transparent',
                'hover:border-blue-500', 'm-6 h-[calc(100vh-3rem)]'
            )} {...getRootProps()}>
                <CardContent className={cn(
                    "flex flex-col items-center justify-center h-full w-full"
                )}>
                    <input {...getInputProps()} />
                    {
                        isDragActive ?
                            <p>Drop the files here ...</p> :
                            <div className="flex flex-col items-center h-full w-full justify-center gap-y-3">
                                <p>Drag 'n' drop some files here, or click to select files</p>
                                <Button className="bg-blue-500">Select Files</Button>
                            </div>
                    }
                </CardContent>
            </Card>
        </>
    )
}