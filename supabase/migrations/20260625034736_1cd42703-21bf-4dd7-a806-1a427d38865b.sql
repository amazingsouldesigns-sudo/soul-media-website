
-- Anyone can upload attachments (form is public)
CREATE POLICY "Anyone can upload booking attachments"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'booking-attachments');

-- Only admins can view/list attachments
CREATE POLICY "Admins can read booking attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'booking-attachments' AND public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete booking attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'booking-attachments' AND public.has_role(auth.uid(), 'admin'));
