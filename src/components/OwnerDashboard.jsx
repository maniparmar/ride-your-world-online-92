import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { IndianRupee, Calendar, Phone, User, Plus, Upload, Car, Eye } from "lucide-react";

export const OwnerDashboard = ({ profile }) => {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchVehicles();
    fetchBookings();
  }, [profile.id]);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('owner_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load vehicles",
      });
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          vehicles (
            id,
            name,
            type,
            image_url
          ),
          profiles!bookings_customer_id_fkey (
            full_name,
            phone
          )
        `)
        .eq('owner_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load bookings",
      });
    }
    setLoading(false);
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      // Upload vehicle image
      const imageFile = formData.get('image');
      let imageUrl = null;
      
      if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${profile.user_id}/${Date.now()}-vehicle.${fileExt}`;
        
        const { data: imageData, error: imageError } = await supabase.storage
          .from('vehicle-images')
          .upload(fileName, imageFile);

        if (imageError) {
          throw imageError;
        }

        const { data: publicData } = supabase.storage
          .from('vehicle-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicData.publicUrl;
      }

      // Upload QR code
      const qrFile = formData.get('qrCode');
      let qrUrl = null;
      
      if (qrFile && qrFile.size > 0) {
        const fileExt = qrFile.name.split('.').pop();
        const fileName = `${profile.user_id}/${Date.now()}-qr.${fileExt}`;
        
        const { data: qrData, error: qrError } = await supabase.storage
          .from('qr-codes')
          .upload(fileName, qrFile);

        if (qrError) {
          throw qrError;
        }

        const { data: publicData } = supabase.storage
          .from('qr-codes')
          .getPublicUrl(fileName);
          
        qrUrl = publicData.publicUrl;
      }

      // Create vehicle record
      const { error } = await supabase
        .from('vehicles')
        .insert({
          owner_id: profile.id,
          name: formData.get('name'),
          type: formData.get('type'),
          location: formData.get('location'),
          price: parseInt(formData.get('price')),
          description: formData.get('description'),
          image_url: imageUrl,
          qr_code_url: qrUrl,
          status: 'available'
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Vehicle added successfully",
      });

      setAddVehicleOpen(false);
      fetchVehicles();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add vehicle",
      });
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: `Booking status updated to ${newStatus}`,
      });

      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update booking status",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your vehicles and bookings</p>
        </div>
        <Dialog open={addVehicleOpen} onOpenChange={setAddVehicleOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>
                Add a new vehicle to your fleet
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vehicle Name</Label>
                <Input name="name" required placeholder="e.g., Maruti Swift" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Vehicle Type</Label>
                <Select name="type" defaultValue="">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="Bike">Bike</SelectItem>
                    <SelectItem value="Scooter">Scooter</SelectItem>
                    <SelectItem value="Bus">Bus</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input name="location" required placeholder="e.g., Mumbai Central" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Day (₹)</Label>
                <Input name="price" type="number" required placeholder="e.g., 1500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea name="description" placeholder="Vehicle details..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Vehicle Image</Label>
                <Input name="image" type="file" accept="image/*" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qrCode">Payment QR Code</Label>
                <Input name="qrCode" type="file" accept="image/*" />
              </div>
              <Button type="submit" className="w-full">Add Vehicle</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Vehicles Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Vehicles ({vehicles.length})</h2>
        {vehicles.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No vehicles added yet. Add your first vehicle to start renting!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                    <Badge variant={vehicle.status === 'available' ? 'default' : 'secondary'}>
                      {vehicle.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{vehicle.type} • {vehicle.location}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {vehicle.image_url && (
                    <img
                      src={vehicle.image_url}
                      alt={vehicle.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 font-semibold">
                      <IndianRupee className="h-4 w-4" />
                      {vehicle.price}/day
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bookings Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Booking Requests ({bookings.length})</h2>
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No bookings yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {booking.vehicles?.name}
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </CardTitle>
                      <p className="text-muted-foreground">{booking.vehicles?.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 font-semibold">
                        <IndianRupee className="h-4 w-4" />
                        {booking.total_amount}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Customer Details */}
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="font-medium text-sm mb-2">Customer Details:</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          <span>{booking.profiles?.full_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{booking.profiles?.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(booking.start_date).toLocaleDateString()} - 
                            {new Date(booking.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Payment Proof */}
                    {booking.payment_proof_url && (
                      <div>
                        <p className="font-medium text-sm mb-2">Payment Proof:</p>
                        <img
                          src={booking.payment_proof_url}
                          alt="Payment proof"
                          className="w-full max-w-40 h-32 object-cover rounded border cursor-pointer"
                          onClick={() => window.open(booking.payment_proof_url, '_blank')}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => window.open(booking.payment_proof_url, '_blank')}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Full Size
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  {booking.status === 'confirmed' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        size="sm"
                      >
                        Mark Completed
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        size="sm"
                      >
                        Cancel Booking
                      </Button>
                    </div>
                  )}
                  
                  {booking.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        <strong>Notes:</strong> {booking.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};