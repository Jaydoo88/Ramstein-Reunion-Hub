import { useState, useRef } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, ArrowLeft, UploadCloud, X, ImagePlus, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface UploadResult {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function UploadPhotos() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploaderName, setUploaderName] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Filter out files > 5MB and non-images
      const validFiles = newFiles.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 5MB limit.`,
            variant: "destructive"
          });
          return false;
        }
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a supported image type (JPG, PNG, WEBP).`,
            variant: "destructive"
          });
          return false;
        }
        return true;
      });

      setSelectedFiles(prev => [...prev, ...validFiles]);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadComplete(false);
    
    // Initialize results state
    const initialResults: UploadResult[] = selectedFiles.map(file => ({
      file,
      status: 'pending'
    }));
    setUploadResults(initialResults);

    let successCount = 0;
    
    // Process sequentially or Promise.all - we'll do sequential to update UI progressively
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Update status to uploading
      setUploadResults(prev => prev.map((res, idx) => 
        idx === i ? { ...res, status: 'uploading' } : res
      ));

      try {
        const fileExt = file.name.split('.').pop();
        const uuid = crypto.randomUUID();
        const filePath = `uploads/${uuid}.${fileExt}`;
        
        // 1. Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('gallery-photos')
          .upload(filePath, file);

        if (uploadError) {
          console.error(`Storage upload error for ${file.name}:`, uploadError);
          throw new Error(uploadError.message || "Failed to upload image");
        }

        // 2. Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('gallery-photos')
          .getPublicUrl(filePath);

        // 3. Insert into DB
        const { error: dbError } = await supabase
          .from('gallery_photos')
          .insert([{
            uploader_name: uploaderName.trim() || null,
            caption: caption.trim() || null,
            storage_path: filePath,
            public_url: publicUrl,
            status: 'PENDING'
          }]);

        if (dbError) {
          console.error(`DB insert error for ${file.name}:`, dbError);
          throw new Error(dbError.message || "Database entry failed");
        }

        // Success!
        successCount++;
        setUploadResults(prev => prev.map((res, idx) => 
          idx === i ? { ...res, status: 'success' } : res
        ));

      } catch (err: any) {
        // Handle failure for this specific file, but continue with others
        setUploadResults(prev => prev.map((res, idx) => 
          idx === i ? { ...res, status: 'error', error: err.message } : res
        ));
      }
    }

    setIsUploading(false);
    setUploadComplete(true);
    
    if (successCount === selectedFiles.length) {
      toast({
        title: "Upload Complete!",
        description: `Successfully uploaded ${successCount} photo${successCount > 1 ? 's' : ''}. They will appear in the gallery after review.`,
        className: "bg-green-50 border-green-200 text-green-800",
      });
      // Clear selections on full success
      setTimeout(() => {
        setSelectedFiles([]);
        setUploaderName("");
        setCaption("");
      }, 2000);
    } else if (successCount > 0) {
      toast({
        title: "Partial Success",
        description: `Uploaded ${successCount} of ${selectedFiles.length} photos. See below for details.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Upload Failed",
        description: "None of the photos could be uploaded. Check the errors below.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setUploadResults([]);
    setUploadComplete(false);
  };

  return (
    <div className="min-h-screen bg-muted pt-28 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/photo-gallery">
            <Button variant="ghost" className="text-rhs-navy hover:bg-white/50 pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-border">
          <div className="mb-8 border-b border-gray-100 pb-6">
            <h1 className="font-display text-3xl md:text-4xl text-rhs-navy mb-2 uppercase">
              Upload Photos
            </h1>
            <p className="text-gray-600 font-sans">
              Share your favorite memories. Photos will be reviewed before appearing in the public gallery.
            </p>
          </div>

          {!uploadComplete ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="uploaderName" className="font-bold text-gray-700">Your Name (Optional)</Label>
                  <Input 
                    id="uploaderName"
                    placeholder="e.g., Jane Doe"
                    value={uploaderName}
                    onChange={(e) => setUploaderName(e.target.value)}
                    disabled={isUploading}
                    className="focus:ring-rhs-blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caption" className="font-bold text-gray-700">Caption for these photos (Optional)</Label>
                  <Input 
                    id="caption"
                    placeholder="e.g., Senior trip to the castle"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    disabled={isUploading}
                    className="focus:ring-rhs-blue"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-gray-700">Select Photos</Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    selectedFiles.length > 0 ? 'border-rhs-blue/30 bg-rhs-blue/5' : 'border-gray-300 hover:border-rhs-blue/50 hover:bg-gray-50'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden" 
                    disabled={isUploading}
                  />
                  
                  <ImagePlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Click to browse or drag and drop photos here
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    JPG, PNG, or WEBP up to 5MB each
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="border-rhs-blue text-rhs-blue hover:bg-rhs-blue hover:text-white"
                  >
                    Browse Files
                  </Button>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-700 text-sm">Selected Files ({selectedFiles.length})</h3>
                  </div>
                  <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {selectedFiles.map((file, idx) => (
                      <li key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 text-sm">
                        <span className="truncate max-w-[200px] md:max-w-[400px] text-gray-600">{file.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 text-xs">{(file.size / 1024 / 1024).toFixed(1)}MB</span>
                          <button 
                            onClick={() => removeFile(idx)}
                            disabled={isUploading}
                            className="text-gray-400 hover:text-red-500 disabled:opacity-50"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
                <Link href="/photo-gallery">
                  <Button variant="ghost" disabled={isUploading} className="text-gray-500">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  onClick={handleUpload} 
                  disabled={selectedFiles.length === 0 || isUploading}
                  className="bg-rhs-blue hover:bg-rhs-navy text-white min-w-[150px] font-bold tracking-wider"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="mr-2 h-5 w-5" />
                      Upload {selectedFiles.length > 0 ? selectedFiles.length : ''} Photos
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="space-y-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg mb-6">
                {uploadResults.every(r => r.status === 'success') ? (
                  <>
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Complete!</h2>
                    <p className="text-gray-600">Your photos have been submitted for review.</p>
                  </>
                ) : uploadResults.some(r => r.status === 'success') ? (
                  <>
                    <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Partial Upload</h2>
                    <p className="text-gray-600">Some photos uploaded successfully, but others failed.</p>
                  </>
                ) : (
                  <>
                    <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Failed</h2>
                    <p className="text-gray-600">None of the photos could be uploaded.</p>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-gray-700">Results:</h3>
                <ul className="space-y-2 max-h-80 overflow-y-auto">
                  {uploadResults.map((result, idx) => (
                    <li key={idx} className={`flex items-center justify-between p-3 rounded border ${
                      result.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex flex-col overflow-hidden mr-4">
                        <span className="font-medium text-sm truncate text-gray-900">{result.file.name}</span>
                        {result.status === 'error' && (
                          <span className="text-xs text-red-600 mt-1 line-clamp-2">{result.error}</span>
                        )}
                      </div>
                      <div>
                        {result.status === 'success' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Failed
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 flex justify-center gap-4">
                <Button onClick={resetForm} variant="outline" className="border-gray-300">
                  Upload More
                </Button>
                <Link href="/photo-gallery">
                  <Button className="bg-rhs-blue hover:bg-rhs-navy text-white">
                    Return to Gallery
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}