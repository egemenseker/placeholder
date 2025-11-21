/*
  # Add isCalled field to trial_sessions table

  1. Changes
    - Add `isCalled` (boolean, default false) column to trial_sessions table
    - This field tracks whether the trial session request has been contacted

  2. Notes
    - Existing records will have isCalled set to false by default
    - This allows admins to track which trial session requests have been handled
*/

-- Add isCalled column to trial_sessions table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trial_sessions' AND column_name = 'iscalled'
  ) THEN
    ALTER TABLE trial_sessions ADD COLUMN isCalled boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_trial_sessions_iscalled ON trial_sessions(isCalled);
CREATE INDEX IF NOT EXISTS idx_trial_sessions_createdat ON trial_sessions(createdAt DESC);