import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import type { ScenarioConfig } from "@/types/financial";

interface RunwayVisualizationProps {
  scenarioConfig: ScenarioConfig;
}

export const RunwayVisualization = ({ scenarioConfig }: RunwayVisualizationProps) => {
  // Generate runway data based on scenario config
  const generateRunwayData = () => {
    const months = [];
    let balance = 595000; // Current treasury
    const monthlyBurn = Object.values(scenarioConfig.expenses).reduce((sum, expense) => sum + expense, 0);
    const monthlyRevenue = scenarioConfig.revenue.current;
    const revenueGrowth = scenarioConfig.revenue.growth / 100;
    
    for (let i = 0; i <= 24; i++) {
      const currentRevenue = monthlyRevenue * Math.pow(1 + revenueGrowth, i);
      const netBurn = monthlyBurn - currentRevenue;
      
      months.push({
        month: `Month ${i}`,
        balance: Math.max(0, balance),
        burn: monthlyBurn,
        revenue: currentRevenue,
        netCashFlow: currentRevenue - monthlyBurn,
        conservative: Math.max(0, balance * 0.8),
        optimistic: Math.max(0, balance * 1.2)
      });
      
      balance -= netBurn;
      if (balance <= 0) break;
    }
    
    return months;
  };

  const runwayData = generateRunwayData();
  const runwayMonths = runwayData.length - 1;
  const cashFlowPositive = runwayData.findIndex(month => month.netCashFlow >= 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`${runwayMonths < 6 ? 'bg-red-50 border-red-200 dark:bg-red-950' : runwayMonths < 12 ? 'bg-orange-50 border-orange-200 dark:bg-orange-950' : 'bg-green-50 border-green-200 dark:bg-green-950'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Runway</CardTitle>
            {runwayMonths < 6 ? <AlertTriangle className="h-4 w-4 text-red-600" /> : <TrendingUp className="h-4 w-4 text-green-600" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {runwayMonths} months
            </div>
            <Badge variant={runwayMonths < 6 ? "destructive" : runwayMonths < 12 ? "secondary" : "default"}>
              {runwayMonths < 6 ? "Critical" : runwayMonths < 12 ? "Warning" : "Healthy"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Burn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Object.values(scenarioConfig.expenses).reduce((sum, expense) => sum + expense, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Net burn after revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow Positive</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cashFlowPositive > 0 ? `Month ${cashFlowPositive}` : "Not projected"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on revenue growth
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Runway Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Treasury Balance Projection</CardTitle>
          <CardDescription>
            Cash runway based on current burn rate and revenue projections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={runwayData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  interval={2}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="optimistic" 
                  stackId="1"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stackId="2"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="conservative" 
                  stackId="3"
                  stroke="hsl(var(--muted-foreground))"
                  fill="hsl(var(--muted-foreground))"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Cash Flow</CardTitle>
          <CardDescription>
            Revenue vs expenses over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={runwayData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  interval={2}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="burn" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  name="Expenses"
                />
                <Line 
                  type="monotone" 
                  dataKey="netCashFlow" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Net Cash Flow"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};