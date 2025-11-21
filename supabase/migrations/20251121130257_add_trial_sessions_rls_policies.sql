/*
  # Add RLS policies for trial_sessions table

  1. Changes
    - Enable RLS on trial_sessions table (if not already enabled)
    - Add INSERT policy for anon users (form submissions)
    - Add INSERT policy for authenticated users
    - Add SELECT policy for authenticated users (admin panel)
    - Add UPDATE policy for authenticated users (marking as called)

  2. Security
    - Anonymous users can only insert trial session requests
    - Authenticated users (admins) can view and update all trial sessions
    - This matches the security model of call_requests table

  3. Notes
    - This allows the "Ücretsiz Ön Görüşme Al" form to work for public users
    - Admins can track and manage trial session requests in the admin panel
*/

-- Enable RLS if not already enabled
ALTER TABLE trial_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anon users to submit trial session requests
CREATE POLICY "Anon users can submit trial sessions"
  ON trial_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users to submit trial session requests
CREATE POLICY "Authenticated users can submit trial sessions"
  ON trial_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can view all trial sessions (for admin panel)
CREATE POLICY "Authenticated users can view trial sessions"
  ON trial_sessions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can update trial sessions (for marking as called)
CREATE POLICY "Authenticated users can update trial sessions"
  ON trial_sessions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);