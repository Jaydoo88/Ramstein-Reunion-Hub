import { useState, useEffect } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, ArrowLeft, Heart, MessageCircle, ThumbsUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Photo {
  id: string;
  public_url: string;
  uploader_name: string | null;
  caption: string | null;
  title?: string | null;
  like_count?: number;
  comment_count?: number;
  created_at: string;
}

// Mock interface for comments until backend is ready
interface Comment {
  id: string;
  photo_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  // Local state for mock features
  // localLikes stores whether the current user has liked a photo (true/false)
  const [localLikes, setLocalLikes] = useState<Record<string, boolean>>({});
  const [localComments, setLocalComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

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

  const handleLike = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation(); // Prevent opening modal if clicking like on the card
    setLocalLikes(prev => ({
      ...prev,
      [photoId]: !prev[photoId] // Toggle the boolean state
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhoto || !newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      photo_id: selectedPhoto.id,
      author_name: "Alumni Member", // Mock current user
      content: newComment.trim(),
      created_at: new Date().toISOString()
    };

    setLocalComments(prev => ({
      ...prev,
      [selectedPhoto.id]: [...(prev[selectedPhoto.id] || []), comment]
    }));
    setNewComment("");
  };

  const getLikes = (photo: Photo) => {
    return (photo.like_count || 0) + (localLikes[photo.id] ? 1 : 0);
  };

  const getCommentsCount = (photo: Photo) => {
    return (photo.comment_count || 0) + (localComments[photo.id]?.length || 0);
  };

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Photo Header */}
                {photo.uploader_name && (
                  <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-50">
                    <div className="w-8 h-8 rounded-full bg-rhs-navy text-white flex items-center justify-center font-bold text-sm">
                      {photo.uploader_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 leading-tight">
                        {photo.uploader_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(photo.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Photo Image */}
                <div 
                  className="w-full bg-gray-100 relative overflow-hidden flex items-center justify-center cursor-pointer group"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.public_url}
                    alt={photo.caption || "Gallery photo"}
                    className="w-full h-auto max-h-[600px] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Button variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                      View Full
                    </Button>
                  </div>
                </div>

                {/* Photo Content & Interactions */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Title / Caption */}
                  {(photo.title || photo.caption) && (
                    <div className="mb-3">
                      {photo.title && <h3 className="font-bold text-gray-900 mb-1">{photo.title}</h3>}
                      {photo.caption && (
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Stats Row */}
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <div className="bg-rhs-red w-4 h-4 rounded-full flex items-center justify-center">
                        <ThumbsUp className="w-2 h-2 text-white fill-white" />
                      </div>
                      <span>{getLikes(photo)}</span>
                    </div>
                    <div className="flex gap-3 hover:underline cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                      <span>{getCommentsCount(photo)} Comments</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between mt-auto">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`flex-1 hover:bg-gray-100 ${localLikes[photo.id] ? 'text-rhs-red' : 'text-gray-600'}`}
                      onClick={(e) => handleLike(e, photo.id)}
                    >
                      <ThumbsUp className={`w-4 h-4 mr-2 ${localLikes[photo.id] ? 'fill-current' : ''}`} />
                      Like
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 text-gray-600 hover:bg-gray-100"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Expanded View Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden bg-white border-none shadow-2xl flex flex-col md:flex-row h-[90vh]">
          {selectedPhoto && (
            <>
              {/* Left Side: Image Section */}
              <div className="relative flex-grow flex items-center justify-center p-4 bg-black/95 min-h-[40vh] md:w-2/3">
                <img 
                  src={selectedPhoto.public_url} 
                  alt={selectedPhoto.caption || "Expanded gallery photo"} 
                  className="max-w-full max-h-[85vh] object-contain"
                />
              </div>
              
              {/* Right Side: Details & Comments Section */}
              <div className="bg-white flex flex-col md:w-1/3 border-l border-gray-200 h-full max-h-[50vh] md:max-h-none">
                <DialogTitle className="sr-only">Photo Details</DialogTitle>
                <DialogDescription className="sr-only">Caption, comments and uploader information</DialogDescription>
                
                {/* Header / Uploader Info */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white sticky top-0 z-10">
                  <div className="w-10 h-10 rounded-full bg-rhs-navy text-white flex items-center justify-center font-bold">
                    {selectedPhoto.uploader_name ? selectedPhoto.uploader_name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{selectedPhoto.uploader_name || 'Anonymous Alumni'}</div>
                    <div className="text-xs text-gray-500">{new Date(selectedPhoto.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                  {/* Caption & Metadata */}
                  {(selectedPhoto.title || selectedPhoto.caption) && (
                    <div className="mb-2">
                      {selectedPhoto.title && <h3 className="font-bold text-gray-900 mb-1 text-lg">{selectedPhoto.title}</h3>}
                      {selectedPhoto.caption && <p className="text-gray-700 whitespace-pre-wrap">{selectedPhoto.caption}</p>}
                    </div>
                  )}

                  {/* Stats Summary */}
                  <div className="flex items-center justify-between text-sm text-gray-500 py-2 border-y border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <div className="bg-rhs-red w-5 h-5 rounded-full flex items-center justify-center">
                        <ThumbsUp className="w-3 h-3 text-white fill-white" />
                      </div>
                      <span>{getLikes(selectedPhoto)}</span>
                    </div>
                    <span>{getCommentsCount(selectedPhoto)} Comments</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`flex-1 font-semibold ${localLikes[selectedPhoto.id] ? 'text-rhs-red hover:text-rhs-red hover:bg-red-50' : 'text-gray-600 hover:bg-gray-100'}`} 
                      onClick={(e) => handleLike(e, selectedPhoto.id)}
                    >
                      <ThumbsUp className={`w-4 h-4 mr-2 ${localLikes[selectedPhoto.id] ? 'fill-current' : ''}`} /> 
                      Like
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 text-gray-600 font-semibold" onClick={() => document.getElementById('comment-input')?.focus()}>
                      <MessageCircle className="w-4 h-4 mr-2" /> Comment
                    </Button>
                  </div>

                  {/* Comments Thread */}
                  <div className="flex flex-col gap-4 mt-2">
                    {localComments[selectedPhoto.id]?.map(comment => (
                      <div key={comment.id} className="flex gap-2 text-sm">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-gray-600 mt-1">
                          {comment.author_name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded-2xl px-3 py-2">
                            <span className="font-bold text-gray-900 block">{comment.author_name}</span>
                            <span className="text-gray-800 break-words">{comment.content}</span>
                          </div>
                          <span className="text-xs text-gray-500 ml-3 mt-1 inline-block">Just now</span>
                        </div>
                      </div>
                    ))}
                    
                    {(!localComments[selectedPhoto.id] || localComments[selectedPhoto.id].length === 0) && (
                      <div className="text-center text-gray-400 py-6 text-sm">
                        No comments yet. Be the first to comment!
                      </div>
                    )}
                  </div>
                </div>

                {/* Comment Input */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                  <form onSubmit={handleAddComment} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-rhs-navy flex-shrink-0 flex items-center justify-center font-bold text-white text-xs">
                      ME
                    </div>
                    <div className="flex-1 relative">
                      <Input
                        id="comment-input"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="pr-10 rounded-full bg-white"
                        autoComplete="off"
                      />
                      <Button 
                        type="submit" 
                        size="icon" 
                        variant="ghost" 
                        className="absolute right-1 top-1 h-8 w-8 text-rhs-blue hover:text-rhs-navy hover:bg-transparent"
                        disabled={!newComment.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
