import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IndianRupee, Calendar, MapPin, Star, User, Phone, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface RentVehicleDialogProps {
  vehicle: {
    id: string;
    name: string;
    type: string;
    location: string;
    price: number;
    rating: number;
    qr_code_url?: string;
    owner?: {
      full_name: string;
      phone: string;
    };
  };
  children: React.ReactNode;
}

export const RentVehicleDialog = ({ vehicle, children }: RentVehicleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    startDate: "",
    endDate: "",
    notes: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session) {
          fetchProfile(session.user.id);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      setFormData(prev => ({
        ...prev,
        fullName: data.full_name || "",
        phone: data.phone || ""
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book a vehicle.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    // Basic validation
    if (!formData.fullName || !formData.phone || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Calculate rental days and total cost
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
      const totalCost = days * vehicle.price;

      // Get vehicle owner ID
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('owner_id')
        .eq('id', vehicle.id)
        .single();

      if (vehicleError) {
        throw vehicleError;
      }

      // Create booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          vehicle_id: vehicle.id,
          customer_id: profile.id,
          owner_id: vehicleData.owner_id,
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          start_date: formData.startDate,
          end_date: formData.endDate,
          total_amount: totalCost,
          notes: formData.notes,
          status: 'pending'
        });

      if (bookingError) {
        throw bookingError;
      }

      // Update vehicle status to booked
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({ status: 'booked' })
        .eq('id', vehicle.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Booking Submitted!",
        description: `Your booking request for ${vehicle.name} has been submitted. Total cost: ₹${totalCost} for ${days} day(s). Please upload payment proof to confirm.`,
      });

      // Reset form and close dialog
      setFormData({
        fullName: profile?.full_name || "",
        phone: profile?.phone || "",
        startDate: "",
        endDate: "",
        notes: ""
      });
      setOpen(false);
      
      // Redirect to dashboard to see the booking
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rent Vehicle</DialogTitle>
          <DialogDescription>
            Complete your booking details for {vehicle.name}
          </DialogDescription>
        </DialogHeader>

        {/* Vehicle Summary */}
        <div className="bg-muted/50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-lg mb-2">{vehicle.name}</h4>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
            <span className="bg-accent px-2 py-1 rounded">{vehicle.type}</span>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {vehicle.location}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {vehicle.rating}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <IndianRupee className="h-5 w-5 text-primary" />
            <span className="text-xl font-bold text-primary">{vehicle.price}</span>
            <span className="text-muted-foreground">/day</span>
          </div>
        </div>

        {/* Owner Information */}
        {vehicle.owner && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
            <h5 className="font-medium mb-2">Vehicle Owner Details:</h5>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{vehicle.owner.full_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{vehicle.owner.phone}</span>
              </div>
              {vehicle.qr_code_url && (
                <div className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  <a 
                    href={vehicle.qr_code_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Payment QR Code
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any special requests or notes..."
              rows={3}
            />
          </div>

          {!session && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                You need to sign in to complete the booking.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!session}>
              {session ? 'Submit Booking Request' : 'Sign In Required'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};