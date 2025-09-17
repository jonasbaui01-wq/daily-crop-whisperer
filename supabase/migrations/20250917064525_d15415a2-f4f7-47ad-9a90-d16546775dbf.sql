-- Enable the required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job to scrape coffee prices every 10 minutes
SELECT cron.schedule(
  'scrape-coffee-price-every-10-minutes',
  '*/10 * * * *', -- Every 10 minutes
  $$
  SELECT
    net.http_post(
        url:='https://evorhaatkaasludhlmeu.supabase.co/functions/v1/scrape-coffee-price',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2b3JoYWF0a2Fhc2x1ZGhsbWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNzM3NDIsImV4cCI6MjA3MTg0OTc0Mn0.Eg2aH3AcEc7OzjlWjDH0KQ-uJC4PPGT9NaRgmC1epiQ"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);