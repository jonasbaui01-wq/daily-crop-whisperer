-- Add cron job for wheat price scraping every 20 minutes
select
  cron.schedule(
    'scrape-wheat-prices',
    '*/20 * * * *', -- Every 20 minutes
    $$
    select
      net.http_post(
          url:='https://evorhaatkaasludhlmeu.supabase.co/functions/v1/scrape-wheat-price',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2b3JoYWF0a2Fhc2x1ZGhsbWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNzM3NDIsImV4cCI6MjA3MTg0OTc0Mn0.Eg2aH3AcEc7OzjlWjDH0KQ-uJC4PPGT9NaRgmC1epiQ"}'::jsonb,
          body:=concat('{"time": "', now(), '"}')::jsonb
      ) as request_id;
    $$
  );