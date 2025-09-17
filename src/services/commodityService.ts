import { CommodityData, NewsItem } from '@/types/commodity';

interface CommoditiesApiResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
}

interface CommodityMapping {
  id: string;
  symbol: string;
  name: string;
  nameDe: string;
  icon: string;
  unit: string;
  currency: string;
}

const commodityMappings: CommodityMapping[] = [
  {
    id: 'coffee',
    symbol: 'KC=F', // Coffee futures
    name: 'Coffee',
    nameDe: 'Kaffeepreise',
    icon: '☕',
    unit: 'lb',
    currency: 'USD'
  },
  {
    id: 'sugar',
    symbol: 'SB=F', // Sugar futures
    name: 'Sugar',
    nameDe: 'Zuckerernte',
    icon: '🍭',
    unit: 'ton',
    currency: 'USD'
  },
  {
    id: 'cocoa',
    symbol: 'CC=F', // Cocoa futures
    name: 'Cocoa',
    nameDe: 'Kakaopreise',
    icon: '🍫',
    unit: 'ton',
    currency: 'USD'
  },
  {
    id: 'wheat',
    symbol: 'ZW=F', // Wheat futures
    name: 'Wheat',
    nameDe: 'Mehlpreise',
    icon: '🌾',
    unit: 'kg',
    currency: 'USD'
  }
];

const mockNews: { [key: string]: NewsItem[] } = {
  coffee: [
    {
      id: 'coffee-1',
      title: 'Kolumbianische Kaffeeernte übertrifft Erwartungen',
      summary: 'Ideale Wetterbedingungen sorgen für Qualitätssteigerung',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      source: 'Coffee Trade Journal'
    }
  ],
  sugar: [
    {
      id: 'sugar-1',
      title: 'Dürreschäden in Brasilien treiben Zuckerpreise',
      summary: 'Schlechteste Ernte seit 5 Jahren erwartet',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      source: 'Sugar Market Report'
    }
  ],
  cocoa: [
    {
      id: 'cocoa-1',
      title: 'Kakaopreise fallen nach Entspannung in Ghana',
      summary: 'Politische Stabilität verbessert Exportaussichten',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      source: 'Commodity News Network'
    }
  ],
  wheat: [
    {
      id: 'wheat-1',
      title: 'Weizenpreise bleiben stabil trotz Wettersorgen',
      summary: 'Gute Ernteergebnisse gleichen regionale Ausfälle aus',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: 'Getreide Magazin'
    }
  ]
};

class CommodityService {
  private apiKey: string = 'demo'; // Free tier API key
  private baseUrl = 'https://api.twelvedata.com';

  constructor() {
    // Using Twelve Data API - free tier allows 8 requests per minute
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchCommodityPrice(symbol: string): Promise<{ price: number; change: number; changePercent: number } | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/quote?symbol=${symbol}&apikey=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'error') {
        console.warn('Twelve Data API request failed:', data.message);
        return null;
      }
      
      return {
        price: parseFloat(data.close || data.price),
        change: parseFloat(data.change || '0'),
        changePercent: parseFloat(data.percent_change || '0')
      };
    } catch (error) {
      console.error('Error fetching commodity price:', error);
      return null;
    }
  }

  async fetchAllCommodities(): Promise<CommodityData[]> {
    const commodities: CommodityData[] = [];

    try {
      // First check if we have scraped coffee data
      const { scrapedDataService } = await import('./scrapedDataService');
      const scrapedCoffee = await scrapedDataService.getLatestCoffeePrice();
      
      if (scrapedCoffee) {
        commodities.push(scrapedCoffee);
        console.log('Using scraped coffee price data');
      }

      // Fetch each commodity with a small delay to respect rate limits
      for (const mapping of commodityMappings) {
        // Skip coffee if we already have scraped data
        if (mapping.id === 'coffee' && scrapedCoffee) {
          continue;
        }

        const priceData = await this.fetchCommodityPrice(mapping.symbol);
        
        if (priceData) {
          const commodity: CommodityData = {
            id: mapping.id,
            name: mapping.name,
            nameDe: mapping.nameDe,
            price: priceData.price,
            currency: mapping.currency,
            change: priceData.change,
            changePercent: priceData.changePercent,
            unit: mapping.unit,
            lastUpdated: new Date().toISOString(),
            trend: priceData.changePercent > 0.1 ? 'up' : priceData.changePercent < -0.1 ? 'down' : 'stable',
            icon: mapping.icon,
            news: mockNews[mapping.id] || []
          };
          
          commodities.push(commodity);
        } else {
          // Fallback to mock data if API fails for this commodity
          commodities.push(this.getMockCommodity(mapping));
        }
        
        // Add a small delay between requests to respect rate limits (8 requests per minute)
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error fetching commodities:', error);
      // Fallback to mock data
      for (const mapping of commodityMappings) {
        commodities.push(this.getMockCommodity(mapping));
      }
    }

    // Add butter as it's not available in commodity API
    commodities.push({
      id: 'butter',
      name: 'Butter',
      nameDe: 'Butterbörse',
      price: 6.85,
      currency: 'EUR',
      change: 0.12,
      changePercent: 1.8,
      unit: 'kg',
      lastUpdated: new Date().toISOString(),
      trend: 'up',
      icon: '🧈',
      news: [
        {
          id: 'butter-1',
          title: 'Butterpreise steigen aufgrund geringerer Milchproduktion',
          summary: 'Trockene Witterung führt zu reduzierter Milchleistung der Kühe',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: 'Agrarmarkt News'
        }
      ]
    });

    return commodities;
  }

  private getMockCommodity(mapping: CommodityMapping): CommodityData {
    const mockPrices: { [key: string]: number } = {
      coffee: 1.85,
      sugar: 620,
      cocoa: 2890,
      wheat: 0.65
    };

    const mockChanges: { [key: string]: number } = {
      coffee: 0.03,
      sugar: 15,
      cocoa: -45,
      wheat: 0.00
    };

    const price = mockPrices[mapping.id] || 100;
    const change = mockChanges[mapping.id] || 0;
    const changePercent = (change / price) * 100;

    return {
      id: mapping.id,
      name: mapping.name,
      nameDe: mapping.nameDe,
      price: price,
      currency: mapping.currency,
      change: change,
      changePercent: changePercent,
      unit: mapping.unit,
      lastUpdated: new Date().toISOString(),
      trend: changePercent > 0.1 ? 'up' : changePercent < -0.1 ? 'down' : 'stable',
      icon: mapping.icon,
      news: mockNews[mapping.id] || []
    };
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }
}

export const commodityService = new CommodityService();