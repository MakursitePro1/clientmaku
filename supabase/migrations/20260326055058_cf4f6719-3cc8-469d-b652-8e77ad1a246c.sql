
-- Create storage bucket for admin uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('admin-uploads', 'admin-uploads', true);

-- Allow admins to upload files
CREATE POLICY "Admins can upload files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'admin-uploads' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to update files
CREATE POLICY "Admins can update files" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'admin-uploads' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete files
CREATE POLICY "Admins can delete files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'admin-uploads' AND public.has_role(auth.uid(), 'admin'));

-- Allow public read access
CREATE POLICY "Public can view admin uploads" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'admin-uploads');

-- Add RLS policies for user_roles management by admins
CREATE POLICY "Admins can insert roles" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles" ON public.user_roles
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
