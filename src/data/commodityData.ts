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
    icon: '🧈'
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
    icon: '🌾'
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
    icon: '🍫'
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
    icon: '🍭'
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
    icon: '☕'
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