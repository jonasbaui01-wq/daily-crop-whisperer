import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Mail, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { commodityData } from "@/data/commodityData";
import { useToast } from "@/hooks/use-toast";

export const ReportGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const { toast } = useToast();

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
    setReportGenerated(true);
    
    toast({
      title: "Bericht generiert",
      description: "Der tägliche Rohstoffbericht wurde erfolgreich erstellt.",
    });
  };

  const sendReport = () => {
    toast({
      title: "Bericht versendet",
      description: "Der Bericht wurde an die konfigurierten E-Mail-Adressen gesendet.",
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Berichtsgenerierung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={generateReport} 
              disabled={isGenerating}
              className="min-w-32"
            >
              {isGenerating ? "Generiere..." : "Bericht erstellen"}
            </Button>
            
            {reportGenerated && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  PDF herunterladen
                </Button>
                <Button variant="outline" size="sm" onClick={sendReport}>
                  <Mail className="h-4 w-4 mr-2" />
                  Per E-Mail senden
                </Button>
              </div>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Nächster automatischer Bericht: Morgen um 07:00 Uhr
          </div>
        </CardContent>
      </Card>

      {reportGenerated && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Täglicher Rohstoffbericht - {new Date().toLocaleDateString('de-DE')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <h3>Zusammenfassung der Marktlage</h3>
              <p className="text-muted-foreground">
                Der heutige Handel zeigt gemischte Signale bei den wichtigsten Rohstoffen. 
                Während Butterpreise weiter steigen, verzeichnet Kakao einen Rückgang aufgrund 
                verbesserter Erntebedingungen in Westafrika.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Rohstoffpreise im Detail:</h4>
              {commodityData.map(commodity => (
                <div key={commodity.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{commodity.icon}</span>
                    <div>
                      <div className="font-medium">{commodity.nameDe}</div>
                      <div className="text-sm text-muted-foreground">
                        {commodity.price.toFixed(2)} {commodity.currency}/{commodity.unit}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(commodity.trend)}
                    <Badge variant={commodity.changePercent > 0 ? 'default' : commodity.changePercent < 0 ? 'destructive' : 'secondary'}>
                      {commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
              <h4 className="font-semibold mb-2">🔮 Prognose für morgen:</h4>
              <p className="text-sm text-muted-foreground">
                Aufgrund der aktuellen Markttrends erwarten wir eine Stabilisierung der Butterpreise 
                und einen möglichen weiteren Rückgang bei Kakao. Zuckerpreise könnten aufgrund der 
                Dürreschäden in Brasilien weiter steigen.
              </p>
            </div>

            <div className="text-xs text-muted-foreground pt-4 border-t">
              Bericht automatisch generiert am {new Date().toLocaleString('de-DE')} | 
              KI-gestütztes Rohstoff-Monitoring-System
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};