
-- Replace permissive policy with one that enforces field length validation
DROP POLICY IF EXISTS "Anyone can submit a booking enquiry" ON public.booking_enquiries;

CREATE POLICY "Anyone can submit a valid booking enquiry"
ON public.booking_enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 100
  AND length(email) BETWEEN 3 AND 255
  AND email LIKE '%@%.%'
  AND length(category) BETWEEN 1 AND 50
  AND length(project_type) BETWEEN 1 AND 100
  AND (phone IS NULL OR length(phone) <= 30)
  AND (hours_required IS NULL OR length(hours_required) <= 50)
  AND (num_shooters IS NULL OR length(num_shooters) <= 50)
  AND (additional_requirements IS NULL OR length(additional_requirements) <= 2000)
);
