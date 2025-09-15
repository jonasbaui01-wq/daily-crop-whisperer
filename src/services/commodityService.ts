import { CommodityData, NewsItem } from '@/types/commodity';

interface AlphaVantageResponse {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
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
    symbol: 'W=F', // Wheat futures (proxy for flour)
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
  private apiKey: string | null = null;
  private baseUrl = 'https://www.alphavantage.co/query';

  constructor() {
    // Try to get API key from localStorage for frontend-only approach
    this.apiKey = localStorage.getItem('ALPHA_VANTAGE_API_KEY');
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('ALPHA_VANTAGE_API_KEY', apiKey);
  }

  async fetchCommodityPrice(symbol: string): Promise<AlphaVantageResponse | null> {
    if (!this.apiKey) {
      console.warn('Alpha Vantage API key not set');
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }
      
      if (data['Note']) {
        throw new Error('API call frequency limit reached');
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return null;
    }
  }

  async fetchAllCommodities(): Promise<CommodityData[]> {
    const commodities: CommodityData[] = [];

    for (const mapping of commodityMappings) {
      try {
        const data = await this.fetchCommodityPrice(mapping.symbol);
        
        if (data && data['Global Quote']) {
          const quote = data['Global Quote'];
          const price = parseFloat(quote['05. price']);
          const change = parseFloat(quote['09. change']);
          const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
          
          const commodity: CommodityData = {
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
          
          commodities.push(commodity);
        } else {
          // Fallback to mock data if API fails
          commodities.push(this.getMockCommodity(mapping));
        }
        
        // Add delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error processing ${mapping.symbol}:`, error);
        // Add mock data as fallback
        commodities.push(this.getMockCommodity(mapping));
      }
    }

    // Add butter as it's not available in commodity futures
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