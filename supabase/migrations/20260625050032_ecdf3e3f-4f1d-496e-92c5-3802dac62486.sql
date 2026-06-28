
CREATE TABLE public.category_reels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  video_url TEXT NOT NULL,
  storage_path TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.category_reels TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.category_reels TO authenticated;
GRANT ALL ON public.category_reels TO service_role;

ALTER TABLE public.category_reels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view category reels"
  ON public.category_reels FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert category reels"
  ON public.category_reels FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update category reels"
  ON public.category_reels FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete category reels"
  ON public.category_reels FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX category_reels_category_idx ON public.category_reels(category, sort_order);

-- Storage policies for the public category-reels bucket
CREATE POLICY "Public can read category reel files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'category-reels');

CREATE POLICY "Admins can upload category reel files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'category-reels' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update category reel files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'category-reels' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete category reel files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'category-reels' AND public.has_role(auth.uid(), 'admin'));
