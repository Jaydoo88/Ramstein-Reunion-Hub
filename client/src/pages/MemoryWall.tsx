import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Search, SlidersHorizontal, UserRound, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

// --- Types ---
type MemoryStatus = "APPROVED" | "PENDING";

interface Memory {
  id: string;
  author: string;
  gradYear: string;
  title: string;
  content: string;
  inMemoryOf?: string;
  date: string;
  status: MemoryStatus;
  photoUrl?: string;
}

// --- Mock Data ---
const initialMemories: Memory[] = [
  {
    id: "1",
    author: "Sarah (Johnson) Williams",
    gradYear: "1988",
    title: "Senior Skip Day",
    content: "Does anyone else remember when we all decided to skip and head to the castle ruins? I still have the photos we took sitting on those old walls. We thought we were so sneaky, but Mr. Davis totally knew and just let us have our moment. Those were the days!",
    date: "2024-02-15",
    status: "APPROVED"
  },
  {
    id: "2",
    author: "Mike Peterson",
    gradYear: "1988",
    title: "Friday Night Football",
    content: "Nothing beats the feeling of the crisp fall air during our Friday night games. The whole base seemed to shut down just to come watch us play. That championship game against Frankfurt is still one of my favorite memories of all time. Go Royals!",
    date: "2024-02-10",
    status: "APPROVED"
  },
  {
    id: "3",
    author: "David Chen",
    gradYear: "1987",
    title: "Always smiling",
    content: "Tom was always the one to make us laugh during the hardest final exams. He had this infectious energy that could light up the gloomiest Monday mornings. I'll never forget the road trip we took after graduation. You are missed, my friend.",
    inMemoryOf: "Tom Baker '88",
    date: "2024-01-22",
    status: "APPROVED"
  },
  {
    id: "4",
    author: "Amanda Lewis",
    gradYear: "1989",
    title: "The great cafeteria food fight",
    content: "I was only a junior, but witnessing the legendary food fight of '88 is something I'll never forget. Someone threw a single tater tot, and suddenly the whole room erupted. It took us hours to clean up, but it was completely worth the detention!",
    date: "2023-12-05",
    status: "APPROVED"
  },
  {
    id: "5",
    author: "Chris Evans",
    gradYear: "1988",
    title: "Pending Memory Test",
    content: "This shouldn't show up in the public feed because it's pending.",
    date: "2024-03-01",
    status: "PENDING"
  }
];

export default function MemoryWall() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  useEffect(() => {
    // Ensure we start at the top of the page
    window.scrollTo(0, 0);

    async function fetchMemories() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("memories")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching memories:", error);
          return;
        }

        if (data) {
          const formattedMemories: Memory[] = data.map((row: any) => ({
            id: row.id.toString(),
            author: row.submitter_name,
            gradYear: row.grad_year,
            title: row.title,
            content: row.memory_text,
            inMemoryOf: row.honoree_name || undefined,
            date: row.created_at,
            status: row.status as MemoryStatus,
            photoUrl: row.photo_url || undefined,
          }));
          setMemories(formattedMemories);
        }
      } catch (err) {
        console.error("Failed to load memories", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMemories();
  }, []);

  // --- Filtering & Sorting ---
  const filteredMemories = useMemo(() => {
    let result = memories.filter(m => m.status === "APPROVED");

    if (yearFilter !== "All Years") {
      result = result.filter(m => m.gradYear === yearFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.title.toLowerCase().includes(q) || 
        m.content.toLowerCase().includes(q) || 
        m.author.toLowerCase().includes(q) ||
        (m.inMemoryOf && m.inMemoryOf.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [memories, searchQuery, yearFilter, sortOrder]);

  const handleAddMemory = (newMemory: Memory) => {
    setMemories(prev => [newMemory, ...prev]);
  };

  return (
    <div className="min-h-screen bg-muted pt-28 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-6xl text-rhs-navy mb-4 tracking-wider uppercase drop-shadow-sm">
            Memory Wall
          </h1>
          <p className="font-sans text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Share your favorite moments, stories, and tributes to classmates we've lost.
          </p>
          
          <SubmitMemoryModal onAddMemory={handleAddMemory} />
          <p className="text-sm text-gray-500 mt-3 font-medium">
            Submissions are reviewed before posting.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-border mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search names or keywords..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rhs-blue text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex w-full md:w-auto gap-4">
            {/* Year Filter */}
            <select 
              className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rhs-blue text-sm bg-white"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="All Years">All Years</option>
              {Array.from({ length: 2020 - 1975 + 1 }, (_, i) => 1975 + i).map(year => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>

            {/* Sort */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 bg-white w-full md:w-auto">
              <SlidersHorizontal className="text-gray-400 h-4 w-4" />
              <select 
                className="w-full py-2 bg-transparent focus:outline-none text-sm cursor-pointer"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>
        </div>

        {/* Memories Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-rhs-blue" />
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg">No memories found matching your search.</p>
            <Button 
              variant="link" 
              className="text-rhs-blue mt-2"
              onClick={() => { setSearchQuery(""); setYearFilter("All Years"); }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredMemories.map((memory) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
                >
                  {memory.inMemoryOf && (
                    <div className="mb-3 text-xs font-bold uppercase tracking-wider text-rhs-navy bg-rhs-navy/5 inline-block px-3 py-1 rounded-full w-fit">
                      In memory of {memory.inMemoryOf}
                    </div>
                  )}
                  
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {memory.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                    <UserRound className="h-4 w-4" />
                    <span className="font-medium text-gray-700">{memory.author}</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">Class of '{memory.gradYear.substring(2)}</span>
                  </div>
                  
                  {memory.photoUrl && (
                    <div className="w-full h-48 mb-4 overflow-hidden rounded bg-gray-100 flex-shrink-0">
                      <img 
                        src={memory.photoUrl} 
                        alt="Memory attachment" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <p className="text-gray-600 text-sm flex-grow mb-4 relative">
                    {memory.content.length > 180 
                      ? `${memory.content.substring(0, 180)}...` 
                      : memory.content}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(memory.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <Button 
                      variant="ghost" 
                      className="text-rhs-blue hover:text-rhs-navy hover:bg-rhs-blue/5 p-0 h-auto font-bold text-sm tracking-wide"
                      onClick={() => setSelectedMemory(memory)}
                    >
                      READ MORE
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* Read More Modal */}
      <Dialog open={!!selectedMemory} onOpenChange={(open) => !open && setSelectedMemory(null)}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white border-none shadow-2xl">
          {selectedMemory && (
            <>
              <div className="bg-rhs-navy p-6 text-white">
                {selectedMemory.inMemoryOf && (
                  <div className="mb-3 text-xs font-bold uppercase tracking-wider text-rhs-gold bg-white/10 inline-block px-3 py-1 rounded-full">
                    In memory of {selectedMemory.inMemoryOf}
                  </div>
                )}
                <DialogTitle className="font-serif text-2xl mb-2 text-white">
                  {selectedMemory.title}
                </DialogTitle>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="font-medium text-white">{selectedMemory.author}</span>
                  <span className="w-1 h-1 rounded-full bg-rhs-gold"></span>
                  <span>Class of {selectedMemory.gradYear}</span>
                  <span className="w-1 h-1 rounded-full bg-rhs-gold"></span>
                  <span>{new Date(selectedMemory.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh]">
                {selectedMemory.photoUrl && (
                  <div className="w-full max-h-80 mb-6 overflow-hidden rounded bg-gray-100 flex justify-center">
                    <img 
                      src={selectedMemory.photoUrl} 
                      alt="Memory attachment" 
                      className="max-w-full max-h-80 object-contain"
                    />
                  </div>
                )}
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans text-base">
                  {selectedMemory.content}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}

// --- Submit Memory Modal Component ---
function SubmitMemoryModal({ onAddMemory }: { onAddMemory: (m: Memory) => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    author: "",
    gradYear: "1988",
    title: "",
    content: "",
    inMemoryOf: "",
    email: "",
    confirmed: false
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Debug logging for production env vars
    console.log("Supabase Env Check:", {
      url: import.meta.env.VITE_SUPABASE_URL,
      hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
    });
    
    try {
      let uploadedPhotoUrl = null;

      if (photoFile) {
        try {
          const fileExt = photoFile.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('memory-photos')
            .upload(filePath, photoFile);

          if (uploadError) {
            // Log complete error details including statusCode and the URL being used
            console.error("Storage upload error details:", {
               error: uploadError,
               message: uploadError.message,
               statusCode: (uploadError as any).statusCode || 'N/A',
               endpoint: '.../storage/v1/object/memory-photos',
               url: import.meta.env.VITE_SUPABASE_URL || 'https://plywgbbehmrpsnurhuos.supabase.co'
            });
            
            console.warn(`Photo upload failed: ${uploadError.message}. Proceeding without photo.`);
            toast({
              title: "Photo Upload Failed",
              description: "Your memory will be submitted without the photo.",
              variant: "default",
            });
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('memory-photos')
              .getPublicUrl(filePath);
              
            uploadedPhotoUrl = publicUrl;
          }
        } catch (uploadException: any) {
          console.error("Exception during storage upload (likely CORS/Network):", uploadException);
          toast({
            title: "Photo Upload Exception",
            description: "Network error during photo upload. Proceeding without photo.",
            variant: "default",
          });
        }
      }

      // Proceed with DB insert
      const { error: insertError } = await supabase.from("memories").insert([{
        status: "PENDING",
        submitter_name: formData.author,
        grad_year: parseInt(formData.gradYear, 10),
        honoree_name: formData.inMemoryOf || null,
        title: formData.title,
        memory_text: formData.content,
        photo_url: uploadedPhotoUrl,
        submitter_email: formData.email || null
      }]);

      if (insertError) {
        console.error("Database insert error details:", {
          error: insertError,
          endpoint: '.../rest/v1/memories',
          message: insertError.message,
          details: insertError.details
        });
        
        let errorMessage = insertError.message;
        if (errorMessage.includes("Failed to fetch")) {
          errorMessage = "Network Error (Failed to fetch). This is likely a CORS issue. Please add 'https://www.royals88reunion.com' to your Supabase API allowed origins, or ensure the Supabase project is not paused.";
        }
        
        throw new Error(`DB Error: ${errorMessage} | Details: ${insertError.details || 'none'} | Hint: ${insertError.hint || 'none'}`);
      }

      // Create new pending memory
      const newMemory: Memory = {
        id: Date.now().toString(),
        author: formData.author,
        gradYear: formData.gradYear,
        title: formData.title,
        content: formData.content,
        inMemoryOf: formData.inMemoryOf || undefined,
        photoUrl: uploadedPhotoUrl || undefined,
        date: new Date().toISOString(),
        status: "PENDING" // ALWAYS PENDING!
      };

      onAddMemory(newMemory);
      
      setOpen(false);
      setFormData({
        author: "",
        gradYear: "1988",
        title: "",
        content: "",
        inMemoryOf: "",
        email: "",
        confirmed: false
      });
      setPhotoFile(null);

      toast({
        title: "Submitted!",
        description: "We'll review it before it appears on the wall.",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    } catch (error: any) {
      console.error("Caught exception submitting memory (likely CORS/Network):", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Unknown error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-rhs-blue hover:bg-rhs-navy text-white font-bold uppercase tracking-wider px-8 rounded-none varsity-shadow transition-transform hover:-translate-y-1">
          Submit a Memory
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white text-gray-900 border-gray-200 p-0 overflow-hidden">
        <div className="bg-rhs-navy p-6">
          <DialogTitle className="font-display text-2xl text-white tracking-wide">
            Share a Memory
          </DialogTitle>
          <DialogDescription className="text-gray-300 font-sans mt-2">
            Add your favorite story, moment, or tribute to the wall.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="author" className="text-sm font-bold text-gray-700">Your Name *</label>
              <input
                id="author"
                required
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rhs-blue"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="gradYear" className="text-sm font-bold text-gray-700">Graduation Year *</label>
              <select
                id="gradYear"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rhs-blue bg-white"
                value={formData.gradYear}
                onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
              >
                {Array.from({ length: 2020 - 1975 + 1 }, (_, i) => 1975 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-bold text-gray-700">Memory Title *</label>
            <input
              id="title"
              required
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rhs-blue"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., The Homecoming Game of '88"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-bold text-gray-700">Your Memory *</label>
            <textarea
              id="content"
              required
              minLength={50}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rhs-blue resize-none"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share your story here... (minimum 50 characters)"
            />
            <p className="text-xs text-gray-500 text-right">
              {formData.content.length}/50 min characters
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="photo" className="text-sm font-bold text-gray-700">Photo (Optional)</label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-rhs-blue/10 file:text-rhs-blue hover:file:bg-rhs-blue/20"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setPhotoFile(e.target.files[0]);
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="inMemoryOf" className="text-sm font-bold text-gray-700">In memory of (Optional)</label>
            <input
              id="inMemoryOf"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rhs-blue"
              value={formData.inMemoryOf}
              onChange={(e) => setFormData({ ...formData, inMemoryOf: e.target.value })}
              placeholder="e.g., John Smith '88"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-gray-700">Your Email (Optional, kept private)</label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rhs-blue"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex items-start gap-2 pt-2 pb-4">
            <input
              type="checkbox"
              id="confirmed"
              required
              checked={formData.confirmed}
              onChange={(e) => setFormData({ ...formData, confirmed: e.target.checked })}
              className="mt-1 h-4 w-4 text-rhs-blue rounded border-gray-300 focus:ring-rhs-blue cursor-pointer"
            />
            <label htmlFor="confirmed" className="text-sm text-gray-600 cursor-pointer">
              I confirm this submission is respectful and appropriate.
            </label>
          </div>

          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-none font-bold uppercase tracking-wider"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-rhs-blue hover:bg-rhs-navy text-white rounded-none font-bold uppercase tracking-wider"
              disabled={formData.content.length < 50 || !formData.confirmed || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Memory"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}