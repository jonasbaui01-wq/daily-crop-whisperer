import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommodityData } from "@/types/commodity";
import { TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";

interface CommodityCardProps {
  commodity: CommodityData;
}

export const CommodityCard = ({ commodity }: CommodityCardProps) => {
  const getTrendIcon = () => {
    switch (commodity.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (commodity.trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getBadgeVariant = () => {
    if (Math.abs(commodity.changePercent) > 5) {
      return commodity.changePercent > 0 ? 'default' : 'destructive';
    }
    return 'secondary';
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{commodity.icon}</span>
            <span>{commodity.nameDe}</span>
          </div>
          {getTrendIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {commodity.price.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">
              {commodity.currency}/{commodity.unit}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className={`text-sm font-medium ${getTrendColor()}`}>
              {commodity.change > 0 ? '+' : ''}{commodity.change.toFixed(2)} {commodity.currency}
            </div>
            <Badge variant={getBadgeVariant()}>
              {commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent.toFixed(1)}%
            </Badge>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Aktualisiert: {new Date(commodity.lastUpdated).toLocaleTimeString('de-DE')}
          </div>
          
          {commodity.news.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Aktuelle News
              </div>
              <div className="space-y-2">
                {commodity.news.slice(0, 2).map((newsItem) => (
                  <div key={newsItem.id} className="text-xs p-2 bg-muted/50 rounded border-l-2 border-primary/20">
                    <div className="font-medium text-foreground">{newsItem.title}</div>
                    <div className="text-muted-foreground mt-1">{newsItem.summary}</div>
                    <div className="text-muted-foreground mt-1 flex items-center justify-between">
                      <span>{newsItem.source}</span>
                      <span>{new Date(newsItem.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};