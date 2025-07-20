import { VehicleCard } from "./VehicleCard";

interface VehicleGridProps {
  searchFilters: {
    location: string;
    vehicleType: string;
    priceRange: string;
    sortBy: string;
  };
  vehicles: any[];
  onAddVehicle: (vehicle: any) => void;
}

export const VehicleGrid = ({ searchFilters, vehicles, onAddVehicle }: VehicleGridProps) => {
  // Filter vehicles based on search criteria - ensure vehicles is always an array
  const filteredVehicles = (vehicles || []).filter(vehicle => {
    // Location filter
    const locationMatch = !searchFilters.location || 
      vehicle.location.toLowerCase().includes(searchFilters.location.toLowerCase()) ||
      vehicle.name.toLowerCase().includes(searchFilters.location.toLowerCase());
    
    // Vehicle type filter
    const typeMatch = !searchFilters.vehicleType || 
      searchFilters.vehicleType === 'all' || 
      vehicle.type.toLowerCase() === searchFilters.vehicleType.toLowerCase();
    
    // Price range filter
    let priceMatch = true;
    if (searchFilters.priceRange && searchFilters.priceRange !== 'any') {
      const price = vehicle.price;
      switch (searchFilters.priceRange) {
        case '0-50':
          priceMatch = price <= 50;
          break;
        case '50-100':
          priceMatch = price > 50 && price <= 100;
          break;
        case '100-200':
          priceMatch = price > 100 && price <= 200;
          break;
        case '200+':
          priceMatch = price > 200;
          break;
      }
    }
    
    return locationMatch && typeMatch && priceMatch;
  });

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (searchFilters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return a.location.localeCompare(b.location);
      default:
        return 0;
    }
  });

  return (
    <section className="w-full py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Available Vehicles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVehicles.length > 0 ? (
            sortedVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} {...vehicle} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No vehicles found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary-hover transition-colors font-medium">
            Load More Vehicles
          </button>
        </div>
      </div>
    </section>
  );
};