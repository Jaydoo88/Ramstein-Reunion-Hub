import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import heroBg from "@assets/attending-hero-bg.jpg";

// Mock Data Structure
interface Attendee {
  id: string;
  full_name: string;
  class_year: number;
  city_state: string;
  status: "Confirmed" | "Bringing Guest" | "Committee" | "VIP";
  created_at: string;
}

const mockAttendees: Attendee[] = [
  { id: "1", full_name: "Jay Schuh", class_year: 1988, city_state: "Dallas, TX", status: "Committee", created_at: "2024-01-01" },
  { id: "2", full_name: "Jason Dousharm", class_year: 1988, city_state: "Austin, TX", status: "Committee", created_at: "2024-01-02" },
  { id: "3", full_name: "Sarah Miller", class_year: 1989, city_state: "Houston, TX", status: "Bringing Guest", created_at: "2024-01-05" },
  { id: "4", full_name: "Michael Chen", class_year: 1987, city_state: "Denver, CO", status: "Confirmed", created_at: "2024-01-10" },
  { id: "5", full_name: "Jessica Taylor", class_year: 1988, city_state: "Seattle, WA", status: "Bringing Guest", created_at: "2024-01-12" },
  { id: "6", full_name: "David Smith", class_year: 1986, city_state: "Chicago, IL", status: "Confirmed", created_at: "2024-01-15" },
  { id: "7", full_name: "Emily Johnson", class_year: 1990, city_state: "Atlanta, GA", status: "Confirmed", created_at: "2024-01-16" },
  { id: "8", full_name: "Robert Williams", class_year: 1988, city_state: "Phoenix, AZ", status: "Bringing Guest", created_at: "2024-01-18" },
  { id: "9", full_name: "Amanda Davis", class_year: 1987, city_state: "Portland, OR", status: "Confirmed", created_at: "2024-01-20" },
  { id: "10", full_name: "James Wilson", class_year: 1989, city_state: "Miami, GA", status: "VIP", created_at: "2024-01-22" },
];

export default function WhoIsAttending() {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [attendees, setAttendees] = useState<Attendee[]>(mockAttendees);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter and sort logic
  const filteredAttendees = attendees.filter(att => {
    const matchesSearch = att.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = yearFilter === "all" || att.class_year.toString() === yearFilter;
    return matchesSearch && matchesYear;
  }).sort((a, b) => {
    if (sortBy === "name-asc") return a.full_name.localeCompare(b.full_name);
    if (sortBy === "name-desc") return b.full_name.localeCompare(a.full_name);
    if (sortBy === "year-asc") return a.class_year - b.class_year;
    if (sortBy === "year-desc") return b.class_year - a.class_year;
    return 0;
  });

  const uniqueYears = Array.from(new Set(mockAttendees.map(a => a.class_year))).sort((a, b) => b - a);
  
  // Calculate stats
  const totalAttendees = mockAttendees.length;
  const guestCount = mockAttendees.filter(a => a.status === "Bringing Guest").length;
  const estimatedTotal = totalAttendees + guestCount; // Basic estimate
  
  const classYearCounts = mockAttendees.reduce((acc, curr) => {
    acc[curr.class_year] = (acc[curr.class_year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const mostRepresentedYear = Object.entries(classYearCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "1988";

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Committee': return 'bg-rhs-navy text-white';
      case 'VIP': return 'bg-amber-500 text-white';
      case 'Bringing Guest': return 'bg-rhs-blue text-white';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-muted pt-28 pb-24">
      {/* Header Area */}
      <div className="bg-rhs-navy text-white py-16 px-4 shadow-md relative overflow-hidden">
        {/* Background Image with blur and overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Alumni reconnecting" 
            className="w-full h-full object-cover object-center opacity-60 blur-[4px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-rhs-navy/80 via-rhs-navy/80 to-rhs-navy/95"></div>
          <div className="absolute inset-0 bg-[#001533] opacity-40"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <Link href="/#memories">
            <Button variant="ghost" className="text-white hover:text-gray-200 hover:bg-white/10 mb-6 -ml-4 backdrop-blur-sm">
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Home
            </Button>
          </Link>
          <h1 className="font-display text-4xl md:text-6xl mb-4 tracking-wider uppercase drop-shadow-md text-white">
            Who Is Attending
          </h1>
          <p className="font-sans text-xl md:text-2xl text-blue-100 max-w-3xl leading-relaxed drop-shadow-sm font-medium">
            See which Ramstein alumni are planning to attend the reunion weekend. 
            Browse by name and class year and reconnect before the event.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl mt-8">
        
        {/* Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center flex flex-col justify-center">
            <span className="text-4xl font-display text-rhs-navy mb-1">{totalAttendees}</span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Registered Alumni</span>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center flex flex-col justify-center">
            <span className="text-4xl font-display text-rhs-blue mb-1">{uniqueYears.length}</span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Class Years Represented</span>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center flex flex-col justify-center">
            <span className="text-4xl font-display text-rhs-red mb-1">Class of '{mostRepresentedYear.toString().slice(2)}</span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Most Represented</span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Search by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-gray-50">
                  <SelectValue placeholder="Class Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {uniqueYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>Class of {year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 bg-gray-50">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="year-desc">Class Year (Newest)</SelectItem>
                  <SelectItem value="year-asc">Class Year (Oldest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Attendee Grid */}
        {filteredAttendees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAttendees.map((attendee) => (
              <div 
                key={attendee.id} 
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex flex-col relative overflow-hidden group"
              >
                {/* Decorative side accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rhs-navy opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-4 pl-2">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900">{attendee.full_name}</h3>
                    <p className="text-rhs-blue font-bold text-sm uppercase tracking-wider mt-1">
                      Class of {attendee.class_year}
                    </p>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-50 pl-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">{attendee.city_state}</span>
                    <Badge variant="secondary" className={`font-semibold border-0 ${getStatusColor(attendee.status)}`}>
                      {attendee.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No attendees found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any attendees matching your current search or filter criteria. 
              Try adjusting your filters or search term.
            </p>
            <Button 
              variant="outline" 
              className="mt-6 text-rhs-navy border-rhs-navy hover:bg-rhs-navy hover:text-white"
              onClick={() => {
                setSearchQuery("");
                setYearFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}