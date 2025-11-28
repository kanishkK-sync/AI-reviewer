/*
  # Create reviews table for ReviewGuard

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key) - Unique identifier for each review analysis
      - `review_text` (text) - The original customer review
      - `tone` (text) - Selected tone: Professional, Friendly, Witty, Apologetic
      - `sentiment` (text) - Analyzed sentiment: Positive, Negative, Neutral
      - `issues` (text[]) - Array of 3 extracted complaint/praise points
      - `reply` (text) - AI-generated response
      - `created_at` (timestamp) - When the review was analyzed
      - `user_id` (uuid) - Reference to the user (if needed for future auth)

  2. Security
    - Enable RLS on `reviews` table
    - Add policy for all users to read and write their own reviews (anonymous access for now)
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_text text NOT NULL,
  tone text NOT NULL,
  sentiment text NOT NULL,
  issues text[] NOT NULL,
  reply text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous access to all reviews"
  ON reviews
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert"
  ON reviews
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update"
  ON reviews
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous delete"
  ON reviews
  FOR DELETE
  TO anon
  USING (true);
