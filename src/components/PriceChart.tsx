import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceHistory } from '@/types/commodity';

interface PriceChartProps {
  data: PriceHistory[];
  title: string;
  color?: string;
}

export const PriceChart = ({ data, title, color = "#2563eb" }: PriceChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title} - 30 Tage Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value: any) => new Date(value).toLocaleDateString('de-DE', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              labelFormatter={(value: any) => new Date(value).toLocaleDateString('de-DE')}
              formatter={(value: any) => [value.toFixed(2), 'Preis']}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};