import { Car, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddVehicleDialog } from "./AddVehicleDialog";
import { Link } from "react-router-dom";

interface HeaderProps {
  onAddVehicle: (vehicle: any) => void;
}

export const Header = ({ onAddVehicle }: HeaderProps) => {
  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Car className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">Commuto</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/api-demo">
            <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
              <Server className="h-4 w-4 mr-2" />
              API Demo
            </Button>
          </Link>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Sign In
          </Button>
          <AddVehicleDialog onAddVehicle={onAddVehicle}>
            <Button variant="default">
              List Vehicle
            </Button>
          </AddVehicleDialog>
        </div>
      </div>
    </header>
  );
};