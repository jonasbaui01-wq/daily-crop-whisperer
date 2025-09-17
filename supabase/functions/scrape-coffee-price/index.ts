import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FirecrawlResponse {
  success: boolean;
  data?: {
    markdown?: string;
    html?: string;
  };
  error?: string;
}

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

    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      throw new Error('FIRECRAWL_API_KEY not found');
    }

    console.log('Starting coffee price scraping...');

    // Scrape the coffee price page
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://www.finanzen.net/rohstoffe/kaffeepreis',
        formats: ['markdown'],
        onlyMainContent: true
      }),
    });

    const firecrawlData: FirecrawlResponse = await firecrawlResponse.json();
    
    if (!firecrawlData.success || !firecrawlData.data?.markdown) {
      throw new Error(`Firecrawl failed: ${firecrawlData.error || 'No data returned'}`);
    }

    console.log('Firecrawl successful, parsing price data...');

    // Parse the markdown content to extract price information
    const markdown = firecrawlData.data.markdown;
    
    // Look for price patterns in the markdown
    // Common patterns: "123,45 EUR" or "1.234,56" or similar
    const pricePatterns = [
      /(\d{1,3}(?:\.\d{3})*,\d{2})\s*(?:EUR|€)/gi,
      /(\d+,\d{2})\s*(?:EUR|€)/gi,
      /€\s*(\d{1,3}(?:\.\d{3})*,\d{2})/gi,
      /(\d{1,3}(?:\.\d{3})*,\d{2})/g
    ];

    let extractedPrice: number | null = null;
    let priceText: string = '';

    for (const pattern of pricePatterns) {
      const matches = markdown.match(pattern);
      if (matches && matches.length > 0) {
        // Take the first match
        const match = matches[0];
        priceText = match;
        
        // Extract numeric value and convert German decimal format
        const numericMatch = match.match(/(\d{1,3}(?:\.\d{3})*,\d{2})/);
        if (numericMatch) {
          const germanFormat = numericMatch[1];
          // Convert German format (1.234,56) to English format (1234.56)
          const englishFormat = germanFormat.replace(/\./g, '').replace(',', '.');
          extractedPrice = parseFloat(englishFormat);
          break;
        }
      }
    }

    if (!extractedPrice) {
      console.log('Markdown content (first 500 chars):', markdown.substring(0, 500));
      throw new Error('Could not extract price from scraped content');
    }

    console.log(`Extracted price: ${extractedPrice} EUR from text: ${priceText}`);

    // Look for change information
    let changeAmount: number | null = null;
    let changePercent: number | null = null;

    // Look for change patterns like "+1,23" or "-0,45%" 
    const changePatterns = [
      /([+-]\d+,\d{2})\s*%/g,
      /([+-]\d+,\d{2})/g
    ];

    for (const pattern of changePatterns) {
      const matches = markdown.match(pattern);
      if (matches) {
        for (const match of matches) {
          const numericValue = parseFloat(match.replace(',', '.'));
          if (match.includes('%')) {
            changePercent = numericValue;
          } else {
            changeAmount = numericValue;
          }
        }
        break;
      }
    }

    // Insert the scraped data into the database
    const { error: insertError } = await supabaseClient
      .from('scraped_commodity_prices')
      .insert({
        commodity_id: 'coffee',
        price: extractedPrice,
        currency: 'EUR',
        change_amount: changeAmount,
        change_percent: changePercent,
        source_url: 'https://www.finanzen.net/rohstoffe/kaffeepreis',
        scraped_at: new Date().toISOString()
      });

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    console.log('Coffee price data saved successfully');

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          price: extractedPrice,
          currency: 'EUR',
          change_amount: changeAmount,
          change_percent: changePercent,
          source_url: 'https://www.finanzen.net/rohstoffe/kaffeepreis',
          scraped_at: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in scrape-coffee-price function:', error);
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