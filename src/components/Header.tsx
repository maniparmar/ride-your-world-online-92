import { useState, useEffect } from "react";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Car className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">Commuto</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          {session ? (
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Dashboard
            </Button>
          ) : (
            <Button 
              variant="outline"
              onClick={() => navigate('/auth')}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};