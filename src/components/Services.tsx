import { motion } from "framer-motion";
import { Scissors, Sparkles, Palette, Wind } from "lucide-react";

const services = [
  {
    icon: Scissors,
    title: "Precision Cuts",
    description: "Classic and modern haircuts tailored to your style. From clean fades to textured crops, we deliver perfection.",
    forWhom: "Men & Women",
  },
  {
    icon: Sparkles,
    title: "Styling & Blowouts",
    description: "Professional styling for any occasion. Let our experts transform your look with the latest techniques.",
    forWhom: "Women",
  },
  {
    icon: Palette,
    title: "Color & Highlights",
    description: "From subtle balayage to bold transformations, our colorists create stunning, personalized results.",
    forWhom: "Women",
  },
  {
    icon: Wind,
    title: "Beard & Grooming",
    description: "Expert beard trims, hot towel shaves, and grooming services to keep you looking sharp.",
    forWhom: "Men",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-medium tracking-widest uppercase mb-4 block">
            Our Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Crafted for <span className="text-gradient-gold">Excellence</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Asian-inspired techniques fused with modern trends. Every service is delivered with precision and care.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-card border border-border/50 rounded-xl p-8 hover:border-gold/30 transition-all duration-500 hover:shadow-gold"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors duration-300">
                  <service.icon className="w-7 h-7 text-gold" />
                </div>
                
                <span className="text-xs font-medium text-gold/70 uppercase tracking-wider">
                  {service.forWhom}
                </span>
                
                <h3 className="font-display text-xl font-semibold text-foreground mt-2 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
