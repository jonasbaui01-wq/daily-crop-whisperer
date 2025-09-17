-- Create table for scraped commodity prices
CREATE TABLE public.scraped_commodity_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  commodity_id TEXT NOT NULL,
  price DECIMAL(10,4) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  change_amount DECIMAL(10,4),
  change_percent DECIMAL(5,2),
  source_url TEXT NOT NULL,
  scraped_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scraped_commodity_prices ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Scraped prices are publicly readable" 
ON public.scraped_commodity_prices 
FOR SELECT 
USING (true);

-- Create index for better performance
CREATE INDEX idx_scraped_commodity_prices_commodity_id ON public.scraped_commodity_prices(commodity_id);
CREATE INDEX idx_scraped_commodity_prices_scraped_at ON public.scraped_commodity_prices(scraped_at DESC);