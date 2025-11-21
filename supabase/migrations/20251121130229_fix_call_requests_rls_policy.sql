/*
  # Fix call_requests RLS policy for anonymous users

  1. Changes
    - Drop existing INSERT policy
    - Create new INSERT policy that explicitly allows anon role
    - This fixes the issue where anonymous users (form submissions) cannot insert records

  2. Notes
    - Supabase uses 'anon' role for unauthenticated API requests
    - The 'public' role in PostgreSQL doesn't always map to Supabase's anon role
    - We need to explicitly grant INSERT permission to anon role
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Anyone can submit call requests" ON call_requests;

-- Create new policy for anon role (unauthenticated users)
CREATE POLICY "Anon users can submit call requests"
  ON call_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also allow authenticated users to insert (for completeness)
CREATE POLICY "Authenticated users can submit call requests"
  ON call_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);