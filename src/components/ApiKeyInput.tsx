import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, ExternalLink, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  hasApiKey: boolean;
}

export const ApiKeyInput = ({ onApiKeySet, hasApiKey }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsLoading(true);
    try {
      onApiKeySet(apiKey);
      toast({
        title: 'API Key gespeichert',
        description: 'Rohstoffpreise werden jetzt von Alpha Vantage geladen',
      });
      setApiKey('');
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'API Key konnte nicht gespeichert werden',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (hasApiKey) {
    return (
      <Card className="border-success/20 bg-success/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-success">
            <Key className="h-4 w-4" />
            API Verbindung aktiv
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline" className="text-success border-success">
                Alpha Vantage verbunden
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                Echte Rohstoffpreise werden geladen
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-warning/20 bg-warning/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertCircle className="h-4 w-4 text-warning" />
          API Key erforderlich
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Für echte Rohstoffpreise benötigen Sie einen kostenlosen Alpha Vantage API Key:</p>
          <a 
            href="https://www.alphavantage.co/support/#api-key" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline mt-2"
          >
            Kostenlosen API Key erhalten <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="Ihr Alpha Vantage API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="font-mono"
          />
          <Button type="submit" disabled={!apiKey.trim() || isLoading} className="w-full">
            {isLoading ? 'Speichere...' : 'API Key speichern'}
          </Button>
        </form>
        
        <div className="text-xs text-muted-foreground">
          <p>Ohne API Key werden Beispieldaten angezeigt.</p>
        </div>
      </CardContent>
    </Card>
  );
};