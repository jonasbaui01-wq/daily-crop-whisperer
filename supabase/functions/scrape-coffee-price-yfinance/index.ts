import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface YahooFinanceResponse {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number;
        previousClose: number;
        currency: string;
      };
    }>;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting coffee price scraping with yfinance API...');

    // Fetch coffee price data from Yahoo Finance API
    const yahooResponse = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/KC=F',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );

    if (!yahooResponse.ok) {
      throw new Error(`Yahoo Finance API error: ${yahooResponse.status}`);
    }

    const yahooData: YahooFinanceResponse = await yahooResponse.json();
    
    if (!yahooData.chart?.result?.[0]?.meta) {
      throw new Error('Invalid response structure from Yahoo Finance API');
    }

    const meta = yahooData.chart.result[0].meta;
    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.previousClose;
    const currency = meta.currency || 'USD';
    
    // Calculate change
    const changeAmount = currentPrice - previousClose;
    const changePercent = (changeAmount / previousClose) * 100;

    console.log(`Extracted coffee price: ${currentPrice} ${currency}, change: ${changeAmount.toFixed(2)} (${changePercent.toFixed(2)}%)`);

    // Insert data into Supabase
    const { error } = await supabase
      .from('scraped_commodity_prices')
      .insert({
        commodity_id: 'coffee',
        price: currentPrice,
        currency: currency,
        change_amount: changeAmount,
        change_percent: changePercent,
        source_url: 'https://finance.yahoo.com/quote/KC=F',
        scraped_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error inserting coffee price data:', error);
      throw error;
    }

    console.log('Coffee price data saved successfully');

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          commodity: 'coffee',
          price: currentPrice,
          currency: currency,
          change_amount: changeAmount,
          change_percent: changePercent,
          scraped_at: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in scrape-coffee-price-yfinance function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});