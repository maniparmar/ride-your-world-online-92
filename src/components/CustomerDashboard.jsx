import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { IndianRupee, Calendar, Phone, User, QrCode, Upload } from "lucide-react";

export const CustomerDashboard = ({ profile }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, [profile.id]);

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
            image_url,
            qr_code_url
          ),
          profiles!bookings_owner_id_fkey (
            full_name,
            phone
          )
        `)
        .eq('customer_id', profile.id)
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

  const handleFileUpload = async (bookingId, file) => {
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.user_id}/${bookingId}-${Date.now()}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          payment_proof_url: publicData.publicUrl,
          status: 'confirmed'
        })
        .eq('id', bookingId);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success!",
        description: "Payment proof uploaded successfully",
      });

      fetchBookings();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload payment proof",
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
    return <div>Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Bookings</h1>
        <p className="text-muted-foreground">Manage your vehicle rentals</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No bookings yet. Browse vehicles to make your first booking!</p>
            <Button className="mt-4" onClick={() => window.location.href = '/'}>
              Browse Vehicles
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
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
                  {/* Vehicle Image */}
                  {booking.vehicles?.image_url && (
                    <div>
                      <img
                        src={booking.vehicles.image_url}
                        alt={booking.vehicles.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* Booking Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(booking.start_date).toLocaleDateString()} - 
                        {new Date(booking.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Owner Information */}
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="font-medium text-sm mb-2">Owner Details:</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          <span>{booking.profiles?.full_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{booking.profiles?.phone}</span>
                        </div>
                        {booking.vehicles?.qr_code_url && (
                          <div className="flex items-center gap-2">
                            <QrCode className="h-3 w-3" />
                            <a 
                              href={booking.vehicles.qr_code_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              View Payment QR
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Payment Upload */}
                    {booking.status === 'pending' && (
                      <div className="border-2 border-dashed border-border rounded-lg p-4">
                        <p className="text-sm font-medium mb-2">Upload Payment Proof:</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(booking.id, e.target.files[0])}
                          className="hidden"
                          id={`file-upload-${booking.id}`}
                        />
                        <label htmlFor={`file-upload-${booking.id}`}>
                          <Button variant="outline" size="sm" asChild>
                            <span className="cursor-pointer flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Choose File
                            </span>
                          </Button>
                        </label>
                      </div>
                    )}
                    
                    {booking.payment_proof_url && (
                      <div>
                        <p className="text-sm font-medium mb-2">Payment Proof:</p>
                        <img
                          src={booking.payment_proof_url}
                          alt="Payment proof"
                          className="w-20 h-20 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
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
  );
};