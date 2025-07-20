import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HeroSectionProps {
  onSearch: (filters: any) => void;
}

export const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const [searchData, setSearchData] = useState({
    location: "",
    vehicleType: "",
    priceRange: "",
    sortBy: ""
  });

  const handleSearch = () => {
    onSearch(searchData);
  };

  return (
    <section className="w-full bg-gradient-to-b from-background to-accent/30 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Rent Any <span className="text-primary">Vehicle</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Cars, buses, cycles - find and rent from trusted locals. Safe, affordable, convenient.
        </p>

        {/* Search Form */}
        <div className="bg-card rounded-xl p-6 shadow-lg border border-border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location Search */}
            <div className="md:col-span-2">
              <Input 
                placeholder="Search vehicles or location..."
                className="h-12 text-base border-border"
                value={searchData.location}
                onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            {/* Vehicle Type */}
            <Select value={searchData.vehicleType} onValueChange={(value) => setSearchData(prev => ({ ...prev, vehicleType: value }))}>
              <SelectTrigger className="h-12 border-border">
                <div className="flex items-center gap-2">
                  <span className="text-primary">🚗</span>
                  <SelectValue placeholder="All Types" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="car">🚗 Car</SelectItem>
                <SelectItem value="bus">🚌 Bus</SelectItem>
                <SelectItem value="cycle">🚲 Cycle</SelectItem>
                <SelectItem value="motorcycle">🏍️ Motorcycle</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range */}
            <Select value={searchData.priceRange} onValueChange={(value) => setSearchData(prev => ({ ...prev, priceRange: value }))}>
              <SelectTrigger className="h-12 border-border">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Price</SelectItem>
                <SelectItem value="0-50">$0 - $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100-200">$100 - $200</SelectItem>
                <SelectItem value="200+">$200+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="mt-6">
            <Button size="lg" className="w-full md:w-auto px-12 h-12 text-base" onClick={handleSearch}>
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </div>
        </div>

        {/* Sort Filter */}
        <div className="flex justify-center">
          <Select value={searchData.sortBy} onValueChange={(value) => setSearchData(prev => ({ ...prev, sortBy: value }))}>
            <SelectTrigger className="w-48 bg-background border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};