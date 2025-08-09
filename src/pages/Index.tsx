import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { VehicleGrid } from "@/components/VehicleGrid";
import { VehicleCategories } from "@/components/VehicleCategories";
import { VehicleDescriptions } from "@/components/VehicleDescriptions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [searchFilters, setSearchFilters] = useState({
    location: "",
    vehicleType: "",
    priceRange: "",
    sortBy: ""
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          profiles!vehicles_owner_id_fkey (
            full_name,
            phone
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Convert database format to component format
      const formattedVehicles = (data || []).map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        type: vehicle.type,
        location: vehicle.location,
        price: vehicle.price,
        rating: 4.5, // Default rating since not in schema
        image: vehicle.image_url || `/placeholder-${vehicle.type.toLowerCase()}.jpg`,
        status: vehicle.status as 'available' | 'booked',
        qr_code_url: vehicle.qr_code_url,
        owner: vehicle.profiles
      }));

      setVehicles(formattedVehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load vehicles",
      });
    }
    setLoading(false);
  };

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div>Loading vehicles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection onSearch={handleSearch} />
      <VehicleCategories />
      <VehicleGrid 
        searchFilters={searchFilters} 
        vehicles={vehicles} 
        onAddVehicle={fetchVehicles} 
      />
      <VehicleDescriptions />
    </div>
  );
};

export default Index;