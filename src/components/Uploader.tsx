'use client'

import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button";
import { FileRejection, useDropzone } from "react-dropzone";
import { useCallback, useState, useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Loader2, Trash2, CheckCircle, AlertCircle } from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  s3Url?: string;
  uploaded: boolean;
}

// FIXED: Removed 'async' - Client Components cannot be async
export function Uploader() {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (file && file.file.type === 'application/pdf') {
      const objectUrl = URL.createObjectURL(file.file);
      setPdfUrl(objectUrl);
      
      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }
  }, [file]);

  const uploadFileWithId = async (fileId: string, fileObj: File) => {
    setFile((prevFile) => {
      if (prevFile && prevFile.id === fileId) {
        return { ...prevFile, uploading: true, error: false };
      }
      return prevFile;
    });

    try {
      const requestBody = {
        filename: fileObj.name,
        contentType: fileObj.type,
        size: fileObj.size,
      };

      const presignedResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestBody),
      });

      if (!presignedResponse.ok) {
        const errorData = await presignedResponse.json();
        toast.error(errorData.error || "Failed to get presigned URL");
        
        setFile((prevFile) => {
          if (prevFile && prevFile.id === fileId) {
            return { ...prevFile, uploading: false, progress: 0, error: true };
          }
          return prevFile;
        });
        return;
      }

      const responseData = await presignedResponse.json();
      const { presignedUrl, key, publicUrl } = responseData;

      setFile((prevFile) => {
        if (prevFile && prevFile.id === fileId) {
          return { ...prevFile, key: key, s3Url: publicUrl };
        }
        return prevFile;
      });

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setFile((prevFile) => {
              if (prevFile && prevFile.id === fileId) {
                return { ...prevFile, progress: percentComplete };
              }
              return prevFile;
            });
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFile((prevFile) => {
              if (prevFile && prevFile.id === fileId) {
                return { 
                  ...prevFile, 
                  progress: 100, 
                  uploading: false, 
                  error: false,
                  uploaded: true
                };
              }
              return prevFile;
            });

            toast.success(`PDF "${fileObj.name}" uploaded successfully`);
            resolve();
          } else {
            setFile((prevFile) => {
              if (prevFile && prevFile.id === fileId) {
                return { ...prevFile, uploading: false, progress: 0, error: true };
              }
              return prevFile;
            });
            
            toast.error(`Failed to upload "${fileObj.name}"`);
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          setFile((prevFile) => {
            if (prevFile && prevFile.id === fileId) {
              return { ...prevFile, uploading: false, progress: 0, error: true };
            }
            return prevFile;
          });
          
          toast.error(`Network error uploading "${fileObj.name}"`);
          reject(new Error("Upload failed due to network error"));
        };

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", fileObj.type);
        xhr.send(fileObj);
      });
    } catch (error) {
      toast.error(`Something went wrong uploading "${fileObj.name}"`);

      setFile((prevFile) => {
        if (prevFile && prevFile.id === fileId) {
          return { ...prevFile, uploading: false, progress: 0, error: true };
        }
        return prevFile;
      });
    }
  };

  const removeFile = async () => {
    if (!file) return;
    
    setFile((prevFile) => {
      if (prevFile) {
        return { ...prevFile, isDeleting: true };
      }
      return prevFile;
    });

    try {
      if (file.key && file.uploaded) {
        const deleteResponse = await fetch("/api/s3/delete", {
          method: "DELETE",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ key: file.key }),
        });

        if (!deleteResponse.ok) {
          let errorData;
          try {
            errorData = await deleteResponse.json();
          } catch (e) {
            errorData = { error: `HTTP ${deleteResponse.status}: ${deleteResponse.statusText}` };
          }
          toast.error(`Failed to delete PDF from storage: ${errorData.error || 'Unknown error'}`);
          
          setFile((prevFile) => {
            if (prevFile) {
              return { ...prevFile, isDeleting: false };
            }
            return prevFile;
          });
          return;
        } else {
          try {
            const successData = await deleteResponse.json();
            toast.success(successData.message || "PDF deleted from storage");
          } catch (e) {
            toast.success("PDF deleted from storage");
          }
        }
      }

      if (file.objectUrl) {
        URL.revokeObjectURL(file.objectUrl);
      }

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
      
      setFile(null);
      
      toast.success("PDF removed");
      
    } catch (error) {
      toast.error("Failed to remove PDF");
      
      setFile((prevFile) => {
        if (prevFile) {
          return { ...prevFile, isDeleting: false };
        }
        return prevFile;
      });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length && !file) {
      const newFile = acceptedFiles[0];
      const fileData = {
        id: uuidv4(),
        file: newFile,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        uploaded: false,
        objectUrl: URL.createObjectURL(newFile),
      };

      setFile(fileData);
      setTimeout(() => uploadFileWithId(fileData.id, fileData.file), 100);
    }
  }, [file]);

  const rejectedFiles = useCallback((fileRejections: FileRejection[]) => {
    fileRejections.forEach((rejection) => {
      const errors = rejection.errors.map(e => e.message).join(", ");
      toast.error(`${rejection.file.name}: ${errors}`);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: rejectedFiles,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 50,
    accept: {
      "application/pdf": [".pdf"],
    },
    disabled: !!file,
  });

  const renderPdfContent = () => {
    if (!pdfUrl) return null;

    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <iframe
          src={pdfUrl}
          className="w-full h-full border-0"
          title="PDF Viewer"
          style={{ minHeight: '600px' }}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 pt-16 flex bg-white overflow-hidden">
      <div className="w-1/2 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden min-h-0">
          <Card
            {...(!file ? getRootProps() : {})}
            className={cn(
              "relative border-2 border-dashed transition-colors duration-200 ease-in-out cursor-pointer overflow-hidden m-0 rounded-none flex-1",
              !file && isDragActive
                ? "border-primary bg-primary/10 border-solid"
                : !file 
                  ? "border-border hover:border-primary"
                  : "border-border cursor-default"
            )}
            style={{ height: '100%', maxHeight: '100%', position: 'relative' }}
          >
            <CardContent className="flex items-center justify-center h-full w-full p-0">
              {!file ? (
                <>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-center text-lg">Drop the PDF here...</p>
                  ) : (
                    <div className="flex flex-col items-center gap-y-4">
                      <div className="text-center">
                        <p className="text-lg mb-2">Drag & drop a PDF here, or click to select</p>
                        <p className="text-sm text-muted-foreground">
                          Supports PDF files only (max 50MB)
                        </p>
                      </div>
                      <Button size="lg">Select PDF</Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  {file.uploading && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
                      <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                      <div className="text-white font-medium text-2xl mb-2">{file.progress}%</div>
                      <div className="text-white text-lg">Uploading {file.file.name}...</div>
                    </div>
                  )}

                  {file.error && (
                    <div className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center z-10">
                      <AlertCircle className="w-12 h-12 text-white mb-4" />
                      <span className="text-white text-xl">Upload Failed</span>
                    </div>
                  )}

                  {file.uploaded && (
                    <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2 z-10">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}

                  {renderPdfContent()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {file && (
          <div className="flex flex-col gap-4 p-4 border-t bg-gray-50 flex-shrink-0">
            <div className="flex justify-center">
              <Button variant="destructive" onClick={removeFile} disabled={file.isDeleting}>
                {file.isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                {file.isDeleting ? 'Removing...' : 'Remove PDF'}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="w-1/2 bg-gray-100 border-l border-gray-300">
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Right panel content goes here</p>
        </div>
      </div>
    </div>
  );
}