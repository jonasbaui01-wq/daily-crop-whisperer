import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting wheat price scraping with yfinance API...');

    // Use Yahoo Finance API (free endpoint)
    const symbol = 'ZW=F'; // Wheat futures symbol
    const yfinanceUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    
    const response = await fetch(yfinanceUrl);
    const data = await response.json();

    if (!data.chart?.result?.[0]) {
      throw new Error('No wheat price data returned from Yahoo Finance API');
    }

    const result = data.chart.result[0];
    const meta = result.meta;
    const quote = result.indicators.quote[0];
    
    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.previousClose;
    const changeAmount = currentPrice - previousClose;
    const changePercent = (changeAmount / previousClose) * 100;

    console.log(`Extracted wheat price: ${currentPrice} USD, change: ${changeAmount} (${changePercent.toFixed(2)}%)`);

    // Insert the scraped data into the database
    const { error: insertError } = await supabaseClient
      .from('scraped_commodity_prices')
      .insert({
        commodity_id: 'wheat',
        price: currentPrice,
        currency: 'USD',
        change_amount: changeAmount,
        change_percent: changePercent,
        source_url: `https://finance.yahoo.com/quote/${symbol}`,
        scraped_at: new Date().toISOString()
      });

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    console.log('Wheat price data saved successfully');

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          commodity_id: 'wheat',
          price: currentPrice,
          currency: 'USD',
          change_amount: changeAmount,
          change_percent: changePercent,
          source_url: `https://finance.yahoo.com/quote/${symbol}`,
          scraped_at: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in scrape-wheat-price function:', error);
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