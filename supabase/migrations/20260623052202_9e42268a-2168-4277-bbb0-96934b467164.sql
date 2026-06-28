CREATE OR REPLACE FUNCTION public.get_my_bookings(_email text)
RETURNS TABLE (
  id uuid,
  category text,
  project_type text,
  preferred_date date,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, category, project_type, preferred_date, status, created_at, updated_at
  FROM public.booking_enquiries
  WHERE lower(email) = lower(_email)
  ORDER BY created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_bookings(text) TO anon, authenticated;