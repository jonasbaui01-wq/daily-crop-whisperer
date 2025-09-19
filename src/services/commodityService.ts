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
  // Removed API functionality - using only scraped data and mock data

  constructor() {
    // Using only scraped data from Yahoo Finance and mock data
  }

  // Removed fetchCommodityPrice method - using only scraped data

  async fetchAllCommodities(): Promise<CommodityData[]> {
    const commodities: CommodityData[] = [];

    try {
      // Import scraped data service
      const { scrapedDataService } = await import('./scrapedDataService');
      
      // Check for scraped coffee data
      const scrapedCoffee = await scrapedDataService.getLatestCoffeePrice();
      if (scrapedCoffee) {
        commodities.push(scrapedCoffee);
        console.log('Using scraped coffee price data');
      } else {
        // Fallback to mock data for coffee
        const coffeeMapping = commodityMappings.find(m => m.id === 'coffee');
        if (coffeeMapping) {
          commodities.push(this.getMockCommodity(coffeeMapping));
        }
      }

      // Check for scraped wheat data
      const scrapedWheat = await scrapedDataService.getLatestWheatPrice();
      if (scrapedWheat) {
        commodities.push(scrapedWheat);
        console.log('Using scraped wheat price data');
      } else {
        // Fallback to mock data for wheat
        const wheatMapping = commodityMappings.find(m => m.id === 'wheat');
        if (wheatMapping) {
          commodities.push(this.getMockCommodity(wheatMapping));
        }
      }

      // Add other commodities with mock data (excluding coffee and wheat)
      for (const mapping of commodityMappings) {
        if (mapping.id !== 'coffee' && mapping.id !== 'wheat') {
          commodities.push(this.getMockCommodity(mapping));
        }
      }
    } catch (error) {
      console.error('Error fetching commodities:', error);
      // Fallback to mock data for all commodities
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
    return true; // Always return true since we don't need API key anymore
  }
}

export const commodityService = new CommodityService();