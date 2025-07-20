import { Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RentVehicleDialog } from "./RentVehicleDialog";

interface VehicleCardProps {
  id: string;
  name: string;
  type: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  status: "available" | "booked";
}

export const VehicleCard = ({ 
  id,
  name, 
  type, 
  location, 
  price, 
  rating, 
  image, 
  status 
}: VehicleCardProps) => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
      {/* Status Badge */}
      <div className="relative">
        <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground relative">
          {/* Placeholder for vehicle image */}
          <span className="text-6xl">📷</span>
          
          {/* Status Badge */}
          <Badge 
            className={`absolute top-3 left-3 ${
              status === "available" 
                ? "bg-available text-white" 
                : "bg-booked text-white"
            }`}
          >
            {status === "available" ? "Available" : "Booked"}
          </Badge>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Vehicle Name & Type */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-card-foreground">{name}</h3>
          <span className="text-sm text-muted-foreground bg-accent px-2 py-1 rounded">
            {type}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-muted-foreground mb-3">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Rating & Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium">{rating}</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">${price}</span>
            <span className="text-muted-foreground">/day</span>
          </div>
        </div>

        {/* Rent Button */}
        {status === "available" ? (
          <RentVehicleDialog vehicle={{ id, name, type, location, price, rating }}>
            <Button className="w-full">
              Rent Now
            </Button>
          </RentVehicleDialog>
        ) : (
          <Button 
            className="w-full" 
            disabled
            variant="secondary"
          >
            Not Available
          </Button>
        )}
      </div>
    </div>
  );
};