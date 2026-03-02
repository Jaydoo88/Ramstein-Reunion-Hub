import { useState, useEffect } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Photo {
  id: string;
  public_url: string;
  uploader_name: string | null;
  caption: string | null;
  created_at: string;
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    async function fetchPhotos() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('gallery_photos')
          .select('*')
          .eq('status', 'APPROVED')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching gallery photos:", error);
        } else if (data) {
          setPhotos(data as Photo[]);
        }
      } catch (err) {
        console.error("Failed to load photos", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPhotos();
  }, []);

  return (
    <div className="min-h-screen bg-muted pt-28 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-rhs-navy hover:bg-white/50 pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12 flex flex-col items-center">
          <h1 className="font-display text-5xl md:text-6xl text-rhs-navy mb-4 tracking-wider uppercase drop-shadow-sm">
            Photo Gallery
          </h1>
          <p className="font-sans text-lg text-gray-600 max-w-2xl mb-8">
            A collection of memories from our time at Ramstein and beyond.
          </p>
          
          <Link href="/upload-photos">
            <Button size="lg" className="bg-rhs-red hover:bg-red-700 text-white font-bold uppercase tracking-wider px-8 rounded-none varsity-shadow transition-transform hover:-translate-y-1">
              Upload Photos
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="h-10 w-10 animate-spin text-rhs-blue" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg mb-4">No approved photos yet.</p>
            <p className="text-sm text-gray-400">Be the first to share your memories!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow aspect-square flex flex-col">
                <div className="flex-grow w-full h-full bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={photo.public_url}
                    alt={photo.caption || "Gallery photo"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {(photo.caption || photo.uploader_name) && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      {photo.caption && <p className="text-white text-sm font-medium line-clamp-2 mb-1">{photo.caption}</p>}
                      {photo.uploader_name && <p className="text-gray-300 text-xs">By {photo.uploader_name}</p>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}