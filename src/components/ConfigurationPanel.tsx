import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Mail, Bell, Save } from "lucide-react";
import { commodityData } from "@/data/commodityData";
import { useToast } from "@/hooks/use-toast";

export const ConfigurationPanel = () => {
  const [emailAddress, setEmailAddress] = useState("user@example.com");
  const [reportFrequency, setReportFrequency] = useState("daily");
  const [alertThreshold, setAlertThreshold] = useState("5");
  const [selectedCommodities, setSelectedCommodities] = useState(
    commodityData.map(c => c.id)
  );
  const { toast } = useToast();

  const toggleCommodity = (commodityId: string) => {
    setSelectedCommodities(prev => 
      prev.includes(commodityId) 
        ? prev.filter(id => id !== commodityId)
        : [...prev, commodityId]
    );
  };

  const saveConfiguration = () => {
    // Save email to localStorage for the ReportGenerator to use
    localStorage.setItem('userEmail', emailAddress);
    
    toast({
      title: "Konfiguration gespeichert",
      description: "Ihre Einstellungen wurden erfolgreich aktualisiert.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Systemkonfiguration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <Label className="text-base font-semibold">E-Mail Einstellungen</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail-Adresse für Berichte</Label>
            <Input
              id="email"
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="ihre-email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Berichtshäufigkeit</Label>
            <Select value={reportFrequency} onValueChange={setReportFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Täglich</SelectItem>
                <SelectItem value="weekly">Wöchentlich</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Alert Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <Label className="text-base font-semibold">Alarm-Einstellungen</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="threshold">Alarm-Schwellenwert (%)</Label>
            <Input
              id="threshold"
              type="number"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value)}
              placeholder="5"
              min="1"
              max="50"
            />
            <p className="text-sm text-muted-foreground">
              Alarm bei Preisänderungen größer als dieser Wert
            </p>
          </div>
        </div>

        {/* Commodity Selection */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Überwachte Rohstoffe</Label>
          <div className="space-y-3">
            {commodityData.map(commodity => (
              <div key={commodity.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{commodity.icon}</span>
                  <div>
                    <div className="font-medium">{commodity.nameDe}</div>
                    <div className="text-sm text-muted-foreground">{commodity.name}</div>
                  </div>
                </div>
                <Switch
                  checked={selectedCommodities.includes(commodity.id)}
                  onCheckedChange={() => toggleCommodity(commodity.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <Button onClick={saveConfiguration} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Konfiguration speichern
        </Button>
      </CardContent>
    </Card>
  );
};