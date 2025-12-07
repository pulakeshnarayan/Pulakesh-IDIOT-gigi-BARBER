import { motion } from "framer-motion";
import { Users, Leaf, Sofa, CalendarCheck } from "lucide-react";

const highlights = [
  {
    icon: Users,
    title: "Expert Team",
    description: "Skilled barbers and stylists serving both men and women with precision and care.",
  },
  {
    icon: Leaf,
    title: "Asian-Inspired",
    description: "Traditional techniques fused with modern trends for unique, stunning results.",
  },
  {
    icon: Sofa,
    title: "Welcoming Space",
    description: "Clean, comfortable, and inviting environment designed for your relaxation.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Booking",
    description: "Effortless scheduling with our convenient online booking system.",
  },
];

const Highlights = () => {
  return (
    <section className="py-24 bg-card/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-medium tracking-widest uppercase mb-4 block">
            Why Choose Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            The GG's <span className="text-gradient-gold">Difference</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-gold/20 group-hover:border-gold/40 transition-all duration-300">
                <item.icon className="w-7 h-7 text-gold" />
              </div>
              
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
