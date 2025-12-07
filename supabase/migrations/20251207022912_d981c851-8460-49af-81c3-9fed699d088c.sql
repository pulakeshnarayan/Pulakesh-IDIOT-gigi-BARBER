-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('men', 'women', 'all')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stylists table
CREATE TABLE public.stylists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  stylist_id UUID REFERENCES public.stylists(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Services and stylists are publicly readable
CREATE POLICY "Services are publicly readable"
ON public.services FOR SELECT
USING (true);

CREATE POLICY "Stylists are publicly readable"
ON public.stylists FOR SELECT
USING (true);

-- Anyone can create a booking (guest checkout)
CREATE POLICY "Anyone can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (true);

-- Bookings are readable by email (for confirmation page)
CREATE POLICY "Bookings are publicly readable"
ON public.bookings FOR SELECT
USING (true);

-- Insert default services
INSERT INTO public.services (name, description, duration_minutes, price, category) VALUES
('Classic Haircut', 'Traditional precision cut with clippers and scissors', 30, 35.00, 'men'),
('Fade & Taper', 'Seamless fade with clean lines and crisp edges', 45, 45.00, 'men'),
('Beard Trim & Shape', 'Expert beard grooming with hot towel finish', 20, 25.00, 'men'),
('Full Grooming Package', 'Haircut, beard trim, and hot towel shave', 60, 75.00, 'men'),
('Women''s Haircut', 'Precision cut and style tailored to you', 45, 55.00, 'women'),
('Blowout & Style', 'Professional wash, blow dry, and styling', 40, 45.00, 'women'),
('Color & Highlights', 'Full color or balayage highlights', 120, 150.00, 'women'),
('Hair Treatment', 'Deep conditioning and repair treatment', 30, 40.00, 'women');

-- Insert default stylists
INSERT INTO public.stylists (name, specialty) VALUES
('Marcus Chen', 'Fades & Modern Cuts'),
('Sophia Kim', 'Color Specialist'),
('David Park', 'Classic Barbering'),
('Emily Nguyen', 'Styling & Treatments');