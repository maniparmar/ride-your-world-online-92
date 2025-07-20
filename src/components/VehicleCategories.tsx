export const VehicleCategories = () => {
  const categories = [
    {
      icon: "🚗",
      name: "Cars",
      description: "Comfortable rides for any journey",
      bgColor: "bg-accent"
    },
    {
      icon: "🚌",
      name: "Buses", 
      description: "Perfect for group travel",
      bgColor: "bg-accent"
    },
    {
      icon: "🚲",
      name: "Cycles",
      description: "Eco-friendly city exploration",
      bgColor: "bg-accent"
    }
  ];

  return (
    <section className="w-full py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Choose Your Ride
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div 
              key={category.name}
              className="text-center p-8 rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              {/* Icon Circle */}
              <div className={`w-20 h-20 ${category.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <span className="text-4xl">{category.icon}</span>
              </div>
              
              {/* Category Info */}
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {category.name}
              </h3>
              <p className="text-muted-foreground">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};