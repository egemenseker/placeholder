/*
  # Create call_requests table

  1. New Tables
    - `call_requests`
      - `id` (uuid, primary key, auto-generated)
      - `fullName` (text, required) - Full name of the person requesting a call
      - `userType` (text, required) - Either 'Veliyim' (Parent) or 'Öğrenciyim' (Student)
      - `phone` (text, required) - Phone number (11 digits starting with 0)
      - `createdAt` (timestamptz, default now()) - When the request was created
      - `isCalled` (boolean, default false) - Whether the person has been contacted
      - `created_at` (timestamptz, default now()) - Database timestamp

  2. Security
    - Enable RLS on `call_requests` table
    - Add policy for authenticated admins to read all call requests
    - Add policy for authenticated admins to update call request status
    - Add policy for public to insert new call requests (for form submission)

  3. Notes
    - This table stores callback requests from the "Sizi Arayalım" form on the homepage
    - The isCalled field allows admins to track which requests have been handled
    - Public can only insert, not read or update their own records (privacy)
*/

-- Create call_requests table
CREATE TABLE IF NOT EXISTS call_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fullName text NOT NULL,
  userType text NOT NULL CHECK (userType IN ('Veliyim', 'Öğrenciyim')),
  phone text NOT NULL,
  createdAt timestamptz DEFAULT now() NOT NULL,
  isCalled boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE call_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert call requests (for form submission)
CREATE POLICY "Anyone can submit call requests"
  ON call_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Authenticated users can read all call requests (for admin panel)
CREATE POLICY "Authenticated users can view call requests"
  ON call_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can update call request status (for admin marking as called)
CREATE POLICY "Authenticated users can update call requests"
  ON call_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_call_requests_iscalled ON call_requests(isCalled);
CREATE INDEX IF NOT EXISTS idx_call_requests_createdat ON call_requests(createdAt DESC);