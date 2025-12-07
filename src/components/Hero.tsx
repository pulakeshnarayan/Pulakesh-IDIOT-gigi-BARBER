import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Scissors } from "lucide-react";
import heroImage from "@/assets/hero-barbershop.jpg";

interface HeroProps {
  onBookClick: () => void;
}

const Hero = ({ onBookClick }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="GG's Barbershop interior with leather chairs and warm lighting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 text-gold text-sm font-medium tracking-widest uppercase mb-6">
              <Scissors className="w-4 h-4" />
              Asian-Owned • Est. 2024
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-foreground">Precision Cuts &</span>
            <br />
            <span className="text-gradient-gold">Stylish Looks</span>
            <br />
            <span className="text-foreground">for Everyone</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 font-body leading-relaxed"
          >
            Step into GG's Barbershop, where tradition meets trend. Our expert 
            barbers and stylists craft precision cuts, fades, and grooming 
            services for men, while providing professional styling, coloring, 
            and treatments for women.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button variant="hero" size="xl" className="group" onClick={onBookClick}>
              <Calendar className="w-5 h-5 transition-transform group-hover:scale-110" />
              Book Appointment
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#services">View Services</a>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl"
      />
    </section>
  );
};

export default Hero;
