import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { commodityData } from "@/data/commodityData";

export const AlertPanel = () => {
  const criticalAlerts = commodityData.filter(item => Math.abs(item.changePercent) > 5);
  const warnings = commodityData.filter(item => Math.abs(item.changePercent) > 2 && Math.abs(item.changePercent) <= 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Preisalarme
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {criticalAlerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Kritische Preisänderungen ({">"}5%)
            </h4>
            {criticalAlerts.map(commodity => (
              <div key={commodity.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <div className="flex items-center gap-2">
                  <span>{commodity.icon}</span>
                  <span className="font-medium">{commodity.nameDe}</span>
                  {commodity.changePercent > 0 ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <Badge variant="destructive">
                  {commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        )}

        {warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-warning flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Warnungen ({">"}2%)
            </h4>
            {warnings.map(commodity => (
              <div key={commodity.id} className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20">
                <div className="flex items-center gap-2">
                  <span>{commodity.icon}</span>
                  <span className="font-medium">{commodity.nameDe}</span>
                  {commodity.changePercent > 0 ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-warning" />
                  )}
                </div>
                <Badge variant="secondary">
                  {commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        )}

        {criticalAlerts.length === 0 && warnings.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Keine kritischen Preisänderungen heute</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};