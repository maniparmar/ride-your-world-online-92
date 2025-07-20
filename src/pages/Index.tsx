import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { VehicleGrid } from "@/components/VehicleGrid";
import { VehicleCategories } from "@/components/VehicleCategories";

const Index = () => {
  // Sample vehicle data
  const [vehicles, setVehicles] = useState([
    {
      id: "1",
      name: "Toyota Camry",
      type: "Car",
      location: "Airport",
      price: 55,
      rating: 4.7,
      image: "/placeholder-car.jpg",
      status: "available" as const
    },
    {
      id: "2", 
      name: "Honda Civic",
      type: "Car",
      location: "Downtown",
      price: 45,
      rating: 4.5,
      image: "/placeholder-car.jpg",
      status: "available" as const
    },
    {
      id: "3",
      name: "Ford Transit",
      type: "Bus",
      location: "Central Station",
      price: 120,
      rating: 4.8,
      image: "/placeholder-bus.jpg", 
      status: "booked" as const
    },
    {
      id: "4",
      name: "Mountain Bike",
      type: "Cycle",
      location: "Park Entrance",
      price: 15,
      rating: 4.6,
      image: "/placeholder-bike.jpg",
      status: "available" as const
    },
    {
      id: "5",
      name: "Tesla Model 3",
      type: "Car",
      location: "City Center",
      price: 85,
      rating: 4.9,
      image: "/placeholder-tesla.jpg",
      status: "available" as const
    },
    {
      id: "6",
      name: "Volkswagen Bus",
      type: "Bus", 
      location: "Beach Area",
      price: 95,
      rating: 4.4,
      image: "/placeholder-van.jpg",
      status: "available" as const
    }
  ]);

  const [searchFilters, setSearchFilters] = useState({
    location: "",
    vehicleType: "",
    priceRange: "",
    sortBy: ""
  });

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
  };

  const handleAddVehicle = (newVehicle: any) => {
    setVehicles(prev => [...prev, newVehicle]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onAddVehicle={handleAddVehicle} />
      <HeroSection onSearch={handleSearch} />
      <VehicleCategories />
      <VehicleGrid 
        searchFilters={searchFilters} 
        vehicles={vehicles} 
        onAddVehicle={handleAddVehicle} 
      />
    </div>
  );
};

export default Index;
