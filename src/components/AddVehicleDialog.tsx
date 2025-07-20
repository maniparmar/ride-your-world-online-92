import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AddVehicleDialogProps {
  children: React.ReactNode;
  onAddVehicle: (vehicle: any) => void;
}

export const AddVehicleDialog = ({ children, onAddVehicle }: AddVehicleDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    price: "",
    description: "",
    image: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.location || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newVehicle = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      location: formData.location,
      price: parseInt(formData.price),
      rating: 4.5,
      image: formData.image || "/placeholder-car.jpg",
      status: "available" as const,
      description: formData.description
    };

    onAddVehicle(newVehicle);
    setFormData({
      name: "",
      type: "",
      location: "",
      price: "",
      description: "",
      image: ""
    });
    setOpen(false);
    
    toast({
      title: "Success",
      description: "Vehicle added successfully!"
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>List Your Vehicle</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Vehicle Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Toyota Camry"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Vehicle Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Car">Car</SelectItem>
                <SelectItem value="Bus">Bus</SelectItem>
                <SelectItem value="Cycle">Cycle</SelectItem>
                <SelectItem value="Motorcycle">Motorcycle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Downtown, Airport"
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price per day ($) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="50"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your vehicle..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <Button type="submit" className="w-full">
            List Vehicle
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};