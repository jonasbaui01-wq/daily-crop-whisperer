import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommodityCard } from "@/components/CommodityCard";
import { PriceChart } from "@/components/PriceChart";
import { AlertPanel } from "@/components/AlertPanel";
import { ReportGenerator } from "@/components/ReportGenerator";
import { ConfigurationPanel } from "@/components/ConfigurationPanel";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { commodityData, generatePriceHistory } from "@/data/commodityData";
import { commodityService } from "@/services/commodityService";
import { CommodityData } from "@/types/commodity";
import { BarChart3, TrendingUp, Activity, Settings, FileText, Bell, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedCommodity, setSelectedCommodity] = useState(commodityData[0]);
  const [currentCommodities, setCurrentCommodities] = useState<CommodityData[]>(commodityData);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(commodityService.hasApiKey());
  const { toast } = useToast();
  
  const totalCommodities = currentCommodities.length;
  const positiveTrends = currentCommodities.filter(c => c.changePercent > 0).length;
  const criticalAlerts = currentCommodities.filter(c => Math.abs(c.changePercent) > 5).length;

  const priceHistory = generatePriceHistory(selectedCommodity.price);

  const handleApiKeySet = (apiKey: string) => {
    commodityService.setApiKey(apiKey);
    setHasApiKey(true);
    refreshData();
  };

  const refreshData = async () => {
    if (!hasApiKey) return;
    
    setIsLoading(true);
    try {
      const freshData = await commodityService.fetchAllCommodities();
      setCurrentCommodities(freshData);
      if (freshData.length > 0) {
        setSelectedCommodity(freshData[0]);
      }
      toast({
        title: 'Daten aktualisiert',
        description: 'Rohstoffpreise wurden erfolgreich geladen',
      });
    } catch (error) {
      toast({
        title: 'Fehler beim Laden',
        description: 'Rohstoffpreise konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasApiKey) {
      refreshData();
    }
  }, [hasApiKey]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                📊 Rohstoff-Monitoring System
              </h1>
              <p className="text-muted-foreground">
                KI-gestütztes Preisüberwachung und Berichtssystem
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {hasApiKey ? 'Live' : 'Demo'}
              </Badge>
              <Badge variant="secondary">
                {new Date().toLocaleDateString('de-DE')}
              </Badge>
              {hasApiKey && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshData}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Lädt...' : 'Aktualisieren'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4" />
                Überwachte Rohstoffe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCommodities}</div>
              <p className="text-sm text-muted-foreground">Aktive Überwachung</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-success" />
                Positive Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{positiveTrends}</div>
              <p className="text-sm text-muted-foreground">von {totalCommodities} Rohstoffen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4 text-destructive" />
                Kritische Alarme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{criticalAlerts}</div>
              <p className="text-sm text-muted-foreground">Preisänderungen {">"}5%</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alarme
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Berichte
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Einstellungen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* API Key Setup */}
            <ApiKeyInput onApiKeySet={handleApiKeySet} hasApiKey={hasApiKey} />
            
            {/* Commodity Cards */}
            {/* Commodity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCommodities.map(commodity => (
                <div 
                  key={commodity.id}
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setSelectedCommodity(commodity)}
                >
                  <CommodityCard commodity={commodity} />
                </div>
              ))}
            </div>

            {/* Price Chart */}
            <PriceChart 
              data={priceHistory}
              title={`${selectedCommodity.nameDe} Preisverlauf`}
              color="hsl(var(--primary))"
            />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertPanel />
          </TabsContent>

          <TabsContent value="reports">
            <ReportGenerator />
          </TabsContent>

          <TabsContent value="settings">
            <ConfigurationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;