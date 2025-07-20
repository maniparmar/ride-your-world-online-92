import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddVehicleDialog } from "./AddVehicleDialog";

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