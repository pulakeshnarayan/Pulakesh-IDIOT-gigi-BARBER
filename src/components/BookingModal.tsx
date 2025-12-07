import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, isBefore, startOfToday } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Clock, User, Scissors, X, ChevronRight, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Service = Tables<"services">;
type Stylist = Tables<"stylists">;

const bookingSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  customer_email: z.string().email("Please enter a valid email"),
  customer_phone: z.string().optional(),
  notes: z.string().max(500).optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<"all" | "men" | "women">("all");

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchServices();
      fetchStylists();
    }
  }, [isOpen]);

  const fetchServices = async () => {
    const { data, error } = await supabase.from("services").select("*");
    if (data) setServices(data);
    if (error) console.error("Error fetching services:", error);
  };

  const fetchStylists = async () => {
    const { data, error } = await supabase.from("stylists").select("*");
    if (data) setStylists(data);
    if (error) console.error("Error fetching stylists:", error);
  };

  const filteredServices = services.filter((s) => {
    if (serviceFilter === "all") return true;
    return s.category === serviceFilter || s.category === "all";
  });

  const handleSubmit = async (data: BookingFormData) => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone || null,
        notes: data.notes || null,
        service_id: selectedService.id,
        stylist_id: selectedStylist?.id || null,
        booking_date: format(selectedDate, "yyyy-MM-dd"),
        booking_time: selectedTime,
      });

      if (error) throw error;

      setIsComplete(true);
      toast.success("Booking confirmed! Check your email for details.");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedStylist(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setIsComplete(false);
    form.reset();
    onClose();
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedService;
      case 2: return !!selectedDate && !!selectedTime;
      case 3: return form.formState.isValid;
      default: return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground flex items-center gap-2">
            <Scissors className="w-6 h-6 text-gold" />
            Book Your Appointment
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        {!isComplete && (
          <div className="flex items-center justify-between mb-6">
            {["Service", "Date & Time", "Details", "Confirm"].map((label, i) => (
              <div key={label} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step > i + 1
                      ? "bg-gold text-primary-foreground"
                      : step === i + 1
                      ? "bg-gold/20 text-gold border border-gold"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={cn(
                  "ml-2 text-sm hidden sm:block",
                  step === i + 1 ? "text-foreground" : "text-muted-foreground"
                )}>
                  {label}
                </span>
                {i < 3 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-display text-2xl text-foreground mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground mb-6">
                Your appointment for {selectedService?.name} on{" "}
                {selectedDate && format(selectedDate, "MMMM d, yyyy")} at {selectedTime} has been booked.
              </p>
              <Button variant="hero" onClick={resetAndClose}>
                Done
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Step 1: Select Service */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex gap-2 mb-4">
                    {(["all", "men", "women"] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setServiceFilter(filter)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize",
                          serviceFilter === filter
                            ? "bg-gold text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {filter === "all" ? "All Services" : filter}
                      </button>
                    ))}
                  </div>

                  <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
                    {filteredServices.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border transition-all text-left",
                          selectedService?.id === service.id
                            ? "border-gold bg-gold/10"
                            : "border-border hover:border-gold/50"
                        )}
                      >
                        <div>
                          <h4 className="font-medium text-foreground">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                          <span className="text-xs text-gold mt-1 inline-block">
                            {service.duration_minutes} min
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-gold">
                          ${Number(service.price).toFixed(0)}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Select Date & Time */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gold" />
                      Select a Date
                    </h4>
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => isBefore(date, startOfToday()) || date > addDays(new Date(), 30)}
                      className="rounded-lg border border-border p-3 pointer-events-auto"
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gold" />
                        Select a Time
                      </h4>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              "py-2 px-3 rounded-md text-sm font-medium transition-colors",
                              selectedTime === time
                                ? "bg-gold text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                            )}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-gold" />
                      Preferred Stylist (Optional)
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedStylist(null)}
                        className={cn(
                          "p-3 rounded-lg border transition-all text-left",
                          !selectedStylist
                            ? "border-gold bg-gold/10"
                            : "border-border hover:border-gold/50"
                        )}
                      >
                        <span className="text-sm font-medium text-foreground">Any Available</span>
                      </button>
                      {stylists.map((stylist) => (
                        <button
                          key={stylist.id}
                          onClick={() => setSelectedStylist(stylist)}
                          className={cn(
                            "p-3 rounded-lg border transition-all text-left",
                            selectedStylist?.id === stylist.id
                              ? "border-gold bg-gold/10"
                              : "border-border hover:border-gold/50"
                          )}
                        >
                          <span className="text-sm font-medium text-foreground">{stylist.name}</span>
                          <p className="text-xs text-muted-foreground">{stylist.specialty}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Contact Details */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Form {...form}>
                    <form className="space-y-4">
                      <FormField
                        control={form.control}
                        name="customer_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your name"
                                className="bg-muted border-border"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customer_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                className="bg-muted border-border"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customer_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="(555) 123-4567"
                                className="bg-muted border-border"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Special Requests (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any specific requests or preferences..."
                                className="bg-muted border-border resize-none"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h4 className="font-medium text-foreground">Review Your Booking</h4>
                  
                  <div className="bg-muted rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service</span>
                      <span className="text-foreground font-medium">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="text-foreground font-medium">
                        {selectedDate && format(selectedDate, "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="text-foreground font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stylist</span>
                      <span className="text-foreground font-medium">
                        {selectedStylist?.name || "Any Available"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-foreground font-medium">{form.getValues("customer_name")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-foreground font-medium">{form.getValues("customer_email")}</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="text-foreground font-medium">Total</span>
                      <span className="text-gold text-lg font-bold">
                        ${Number(selectedService?.price || 0).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6 pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={step === 1 ? resetAndClose : prevStep}
                  className="text-muted-foreground"
                >
                  {step === 1 ? "Cancel" : "Back"}
                </Button>

                {step < 4 ? (
                  <Button
                    variant="hero"
                    onClick={nextStep}
                    disabled={!canProceed()}
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    variant="hero"
                    onClick={form.handleSubmit(handleSubmit)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                )}
              </div>
            </>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
