import carLogo from "@/assets/car-logo.png";
import bicycleLogo from "@/assets/bicycle-logo.png";

export const VehicleDescriptions = () => {
  const vehicleTypes = [
    {
      logo: carLogo,
      title: "Cars",
      description: "Experience comfort and convenience with our premium car rental service. Our fleet includes economy cars perfect for city driving, spacious SUVs for family trips, and luxury vehicles for special occasions. All vehicles are regularly maintained, fully insured, and equipped with modern safety features. Whether you need transportation for business meetings, weekend getaways, or daily commuting, our cars provide reliable and comfortable travel solutions."
    },
    {
      logo: bicycleLogo,
      title: "Bicycles", 
      description: "Discover eco-friendly urban mobility with our bicycle rental service. Our collection features mountain bikes for adventurous trails, city bikes for comfortable commuting, and electric bikes for effortless rides. Each bicycle is carefully maintained and equipped with safety gear including helmets and lights. Perfect for exploring the city, staying fit, or reducing your carbon footprint while enjoying the freedom of two-wheeled transportation."
    },
    {
      logo: "🚌",
      title: "Buses",
      description: "Travel in comfort with our spacious bus rental service. Perfect for group transportation, corporate events, school trips, and family gatherings. Our modern fleet features air conditioning, comfortable seating, entertainment systems, and professional drivers. From mini-buses for small groups to full-size coaches for large parties, we provide safe and reliable group transportation solutions that make every journey enjoyable and stress-free."
    }
  ];

  return (
    <section className="w-full py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          About Our Vehicle Types
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicleTypes.map((vehicle, index) => (
            <div 
              key={vehicle.title}
              className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-card hover:shadow-[var(--shadow-soft)] hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Logo */}
              <div className="relative z-10 w-28 h-28 mb-6 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                {typeof vehicle.logo === 'string' && vehicle.logo.includes('🚌') ? (
                  <span className="text-6xl">{vehicle.logo}</span>
                ) : (
                  <img 
                    src={vehicle.logo} 
                    alt={`${vehicle.title} logo`}
                    className="w-16 h-16 object-contain filter group-hover:brightness-110 transition-all duration-300"
                  />
                )}
              </div>
              
              {/* Title */}
              <h3 className="relative z-10 text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                {vehicle.title}
              </h3>
              
              {/* Description */}
              <p className="relative z-10 text-muted-foreground leading-relaxed text-sm group-hover:text-foreground/80 transition-colors duration-300">
                {vehicle.description}
              </p>
              
              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};