DROP POLICY IF EXISTS "Anyone can view active programs" ON public.programs;

CREATE POLICY "Anyone can view active programs"
ON public.programs
FOR SELECT
TO public
USING (active = true);

CREATE POLICY "Admins can view all programs"
ON public.programs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));