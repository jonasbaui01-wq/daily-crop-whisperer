import { CommodityData } from '@/types/commodity';

class CommodityService {
  constructor() {
    // Using only scraped data from Yahoo Finance
  }

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
      }

      // Check for scraped sugar data
      const scrapedSugar = await scrapedDataService.getLatestSugarPrice();
      if (scrapedSugar) {
        commodities.push(scrapedSugar);
        console.log('Using scraped sugar price data');
      }

      // Check for scraped cocoa data
      const scrapedCocoa = await scrapedDataService.getLatestCocoaPrice();
      if (scrapedCocoa) {
        commodities.push(scrapedCocoa);
        console.log('Using scraped cocoa price data');
      }

      // Check for scraped wheat data
      const scrapedWheat = await scrapedDataService.getLatestWheatPrice();
      if (scrapedWheat) {
        commodities.push(scrapedWheat);
        console.log('Using scraped wheat price data');
      }

      // Check for scraped butter data
      const scrapedButter = await scrapedDataService.getLatestButterPrice();
      if (scrapedButter) {
        commodities.push(scrapedButter);
        console.log('Using scraped butter price data');
      }

    } catch (error) {
      console.error('Error fetching commodities:', error);
    }

    return commodities;
  }

  hasApiKey(): boolean {
    return true; // Always return true since we don't need API key anymore
  }
}

export const commodityService = new CommodityService();