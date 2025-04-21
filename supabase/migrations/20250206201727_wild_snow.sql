/*
  # Newsletter System Setup

  1. New Tables
    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `status` (text) - active/unsubscribed
      - `gdpr_consent` (boolean)
      - `gdpr_consent_at` (timestamp)
      - `subscribed_at` (timestamp)
      - `unsubscribed_at` (timestamp)

  2. Security
    - Enable RLS on newsletter_subscribers table
    - Add policies for admin access
*/

-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  gdpr_consent boolean NOT NULL DEFAULT false,
  gdpr_consent_at timestamptz,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admins have full access to newsletter subscribers"
  ON newsletter_subscribers
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com');

-- Add newsletter_id to blog_notifications
ALTER TABLE blog_notifications 
ADD COLUMN IF NOT EXISTS newsletter_sent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS newsletter_sent_at timestamptz;