
-- Booking enquiries from category pages
CREATE TABLE public.booking_enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project_type TEXT NOT NULL,
  hours_required TEXT,
  num_shooters TEXT,
  deliverables TEXT[],
  additional_requirements TEXT,
  preferred_date DATE,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.booking_enquiries ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon visitors) can submit an enquiry
CREATE POLICY "Anyone can submit a booking enquiry"
ON public.booking_enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No public read/update/delete — only service role (used by edge functions / dashboard)

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_booking_enquiries_updated_at
BEFORE UPDATE ON public.booking_enquiries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_booking_enquiries_created_at ON public.booking_enquiries(created_at DESC);
CREATE INDEX idx_booking_enquiries_category ON public.booking_enquiries(category);
