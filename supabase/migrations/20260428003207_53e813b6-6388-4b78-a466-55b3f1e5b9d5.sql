-- Remove duplicate/recursive policies on user_roles. Keep:
--   "Users can view own roles" (auth.uid() = user_id)
--   "Admins can view all roles" (private.has_role)
--   "Admins manage roles" (private.has_role)
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;