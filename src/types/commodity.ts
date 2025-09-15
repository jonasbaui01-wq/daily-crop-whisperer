export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  source: string;
}

export interface CommodityData {
  id: string;
  name: string;
  nameDe: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  unit: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  news: NewsItem[];
}

export interface AlertConfig {
  commodityId: string;
  threshold: number;
  enabled: boolean;
}

export interface UserConfig {
  selectedCommodities: string[];
  alertConfigs: AlertConfig[];
  emailAddress: string;
  reportFrequency: 'daily' | 'weekly';
}

export interface PriceHistory {
  date: string;
  price: number;
}