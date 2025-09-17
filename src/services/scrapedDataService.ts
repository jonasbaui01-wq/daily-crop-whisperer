import { supabase } from "@/integrations/supabase/client";
import { CommodityData, NewsItem } from '@/types/commodity';

interface ScrapedCommodityPrice {
  id: string;
  commodity_id: string;
  price: number;
  currency: string;
  change_amount?: number;
  change_percent?: number;
  source_url: string;
  scraped_at: string;
  created_at: string;
}

const mockCoffeeNews: NewsItem[] = [
  {
    id: 'coffee-scraped-1',
    title: 'Kaffeepreise aus aktueller Marktanalyse',
    summary: 'Live-Daten von finanzen.net zeigen aktuelle Marktentwicklung',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    source: 'finanzen.net'
  },
  {
    id: 'coffee-scraped-2',
    title: 'Rohkaffee-Futures zeigen Volatilität',
    summary: 'Schwankende Preise aufgrund internationaler Handelsbedingungen',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: 'Commodities Tracker'
  }
];

class ScrapedDataService {
  async getLatestCoffeePrice(): Promise<CommodityData | null> {
    try {
      const { data, error } = await supabase
        .from('scraped_commodity_prices')
        .select('*')
        .eq('commodity_id', 'coffee')
        .order('scraped_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching scraped coffee price:', error);
        return null;
      }

      if (!data) {
        console.log('No scraped coffee price data found');
        return null;
      }

      const scrapedData = data as ScrapedCommodityPrice;

      // Convert to CommodityData format
      const commodityData: CommodityData = {
        id: 'coffee',
        name: 'Coffee',
        nameDe: 'Kaffeepreise (Live)',
        price: scrapedData.price,
        currency: scrapedData.currency,
        change: scrapedData.change_amount || 0,
        changePercent: scrapedData.change_percent || 0,
        unit: 'kg',
        lastUpdated: scrapedData.scraped_at,
        trend: (scrapedData.change_percent || 0) > 0.1 ? 'up' : (scrapedData.change_percent || 0) < -0.1 ? 'down' : 'stable',
        icon: '☕',
        news: mockCoffeeNews
      };

      return commodityData;
    } catch (error) {
      console.error('Error in getLatestCoffeePrice:', error);
      return null;
    }
  }

  async triggerCoffeePriceScraping(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('scrape-coffee-price', {
        body: {}
      });

      if (error) {
        console.error('Error triggering coffee price scraping:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error invoking scrape function:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const scrapedDataService = new ScrapedDataService();