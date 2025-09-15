import { CommodityData, PriceHistory } from '@/types/commodity';

export const commodityData: CommodityData[] = [
  {
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
      },
      {
        id: 'butter-2',
        title: 'EU-Butterimporte aus Neuseeland steigen',
        summary: 'Handelsabkommen ermöglicht günstigere Importe',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        source: 'Dairy Industry Today'
      }
    ]
  },
  {
    id: 'flour',
    name: 'Flour',
    nameDe: 'Mehlpreise',
    price: 0.65,
    currency: 'EUR',
    change: 0.00,
    changePercent: 0.0,
    unit: 'kg',
    lastUpdated: new Date().toISOString(),
    trend: 'stable',
    icon: '🌾',
    news: [
      {
        id: 'flour-1',
        title: 'Weizenpreise bleiben stabil trotz Wettersorgen',
        summary: 'Gute Ernteergebnisse gleichen regionale Ausfälle aus',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        source: 'Getreide Magazin'
      }
    ]
  },
  {
    id: 'cocoa',
    name: 'Cocoa',
    nameDe: 'Kakaopreise',
    price: 2890,
    currency: 'USD',
    change: -45,
    changePercent: -1.5,
    unit: 'ton',
    lastUpdated: new Date().toISOString(),
    trend: 'down',
    icon: '🍫',
    news: [
      {
        id: 'cocoa-1',
        title: 'Kakaopreise fallen nach Entspannung in Ghana',
        summary: 'Politische Stabilität verbessert Exportaussichten',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        source: 'Commodity News Network'
      },
      {
        id: 'cocoa-2',
        title: 'Neue Nachhaltigkeitsstandards für Kakaobauern',
        summary: 'EU plant strengere Zertifizierungsanforderungen',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        source: 'Sustainable Agriculture Times'
      }
    ]
  },
  {
    id: 'sugar',
    name: 'Sugar',
    nameDe: 'Zuckerernte',
    price: 620,
    currency: 'USD',
    change: 15,
    changePercent: 2.5,
    unit: 'ton',
    lastUpdated: new Date().toISOString(),
    trend: 'up',
    icon: '🍭',
    news: [
      {
        id: 'sugar-1',
        title: 'Dürreschäden in Brasilien treiben Zuckerpreise',
        summary: 'Schlechteste Ernte seit 5 Jahren erwartet',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        source: 'Sugar Market Report'
      }
    ]
  },
  {
    id: 'coffee',
    name: 'Coffee',
    nameDe: 'Kaffeepreise',
    price: 1.85,
    currency: 'USD',
    change: 0.03,
    changePercent: 1.6,
    unit: 'lb',
    lastUpdated: new Date().toISOString(),
    trend: 'up',
    icon: '☕',
    news: [
      {
        id: 'coffee-1',
        title: 'Kolumbianische Kaffeeernte übertrifft Erwartungen',
        summary: 'Ideale Wetterbedingungen sorgen für Qualitätssteigerung',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        source: 'Coffee Trade Journal'
      },
      {
        id: 'coffee-2',
        title: 'Vietnamesische Exporteure senken Preise',
        summary: 'Konkurrenzkampf auf dem Weltmarkt verstärkt sich',
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
        source: 'Asian Coffee Markets'
      }
    ]
  }
];

export const generatePriceHistory = (basePrice: number, days: number = 30): PriceHistory[] => {
  const history: PriceHistory[] = [];
  let currentPrice = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some random variation
    const variation = (Math.random() - 0.5) * 0.1;
    currentPrice = Math.max(0, currentPrice * (1 + variation));
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice * 100) / 100
    });
  }
  
  return history;
};