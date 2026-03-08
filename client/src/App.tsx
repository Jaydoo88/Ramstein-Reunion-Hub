import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MemoryWall from "@/pages/MemoryWall";
import PhotoGallery from "@/pages/PhotoGallery";
import UploadPhotos from "@/pages/UploadPhotos";
import WhoIsAttending from "@/pages/WhoIsAttending";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/memory-wall" component={MemoryWall} />
          <Route path="/photo-gallery" component={PhotoGallery} />
          <Route path="/upload-photos" component={UploadPhotos} />
          <Route path="/who-is-attending" component={WhoIsAttending} />
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;