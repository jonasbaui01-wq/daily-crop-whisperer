-- Set up cron jobs for all commodity price scraping functions to run every 20 minutes

-- Coffee price scraping (new Yahoo Finance version)
select
cron.schedule(
  'scrape-coffee-price-yfinance-every-20-minutes',
  '*/20 * * * *',
  $$
  select
    net.http_post(
        url:='https://evorhaatkaasludhlmeu.supabase.co/functions/v1/scrape-coffee-price-yfinance',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2b3JoYWF0a2Fhc2x1ZGhsbWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNzM3NDIsImV4cCI6MjA3MTg0OTc0Mn0.Eg2aH3AcEc7OzjlWjDH0KQ-uJC4PPGT9NaRgmC1epiQ"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Sugar price scraping
select
cron.schedule(
  'scrape-sugar-price-every-20-minutes',
  '*/20 * * * *',
  $$
  select
    net.http_post(
        url:='https://evorhaatkaasludhlmeu.supabase.co/functions/v1/scrape-sugar-price',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2b3JoYWF0a2Fhc2x1ZGhsbWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNzM3NDIsImV4cCI6MjA3MTg0OTc0Mn0.Eg2aH3AcEc7OzjlWjDH0KQ-uJC4PPGT9NaRgmC1epiQ"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Cocoa price scraping
select
cron.schedule(
  'scrape-cocoa-price-every-20-minutes',
  '*/20 * * * *',
  $$
  select
    net.http_post(
        url:='https://evorhaatkaasludhlmeu.supabase.co/functions/v1/scrape-cocoa-price',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2b3JoYWF0a2Fhc2x1ZGhsbWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNzM3NDIsImV4cCI6MjA3MTg0OTc0Mn0.Eg2aH3AcEc7OzjlWjDH0KQ-uJC4PPGT9NaRgmC1epiQ"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Butter price scraping
select
cron.schedule(
  'scrape-butter-price-every-20-minutes',
  '*/20 * * * *',
  $$
  select
    net.http_post(
        url:='https://evorhaatkaasludhlmeu.supabase.co/functions/v1/scrape-butter-price',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2b3JoYWF0a2Fhc2x1ZGhsbWV1Ciwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNzM3NDIsImV4cCI6MjA3MTg0OTc0Mn0.Eg2aH3AcEc7OzjlWjDH0KQ-uJC4PPGT9NaRgmC1epiQ"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);