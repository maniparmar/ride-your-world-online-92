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
    }
  ];

  return (
    <section className="w-full py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          About Our Vehicle Types
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {vehicleTypes.map((vehicle) => (
            <div 
              key={vehicle.title}
              className="flex flex-col items-center text-center p-8 rounded-xl border border-border hover:shadow-lg transition-shadow duration-300"
            >
              {/* Logo */}
              <div className="w-24 h-24 mb-6 flex items-center justify-center">
                <img 
                  src={vehicle.logo} 
                  alt={`${vehicle.title} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {vehicle.title}
              </h3>
              
              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {vehicle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};