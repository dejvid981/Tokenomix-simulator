import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, RotateCcw, TrendingUp, DollarSign } from "lucide-react";
import type { ScenarioConfig } from "@/types/financial";
import { toast } from "sonner";

interface ScenarioPlannerProps {
  config: ScenarioConfig;
  onChange: (config: ScenarioConfig) => void;
}

export const ScenarioPlanner = ({ config, onChange }: ScenarioPlannerProps) => {
  const handleRevenueChange = (field: keyof ScenarioConfig['revenue'], value: number) => {
    onChange({
      ...config,
      revenue: {
        ...config.revenue,
        [field]: value
      }
    });
  };

  const handleExpenseChange = (field: keyof ScenarioConfig['expenses'], value: number) => {
    onChange({
      ...config,
      expenses: {
        ...config.expenses,
        [field]: value
      }
    });
  };

  const handleFundingChange = (field: keyof ScenarioConfig['funding'], value: number) => {
    onChange({
      ...config,
      funding: {
        ...config.funding,
        [field]: value
      }
    });
  };

  const resetToDefaults = () => {
    onChange({
      revenue: { current: 25000, growth: 15 },
      expenses: {
        salaries: 45000,
        marketing: 8000,
        operations: 5000,
        development: 12000
      },
      funding: { amount: 500000, timeline: 6 }
    });
    toast.success("Reset to default values");
  };

  const saveScenario = () => {
    localStorage.setItem('financial-scenario', JSON.stringify(config));
    toast.success("Scenario saved successfully");
  };

  const totalExpenses = Object.values(config.expenses).reduce((sum, expense) => sum + expense, 0);
  const netCashFlow = config.revenue.current - totalExpenses;
  const runwayMonths = config.funding.amount / Math.max(totalExpenses - config.revenue.current, 1000);

  return (
    <div className="space-y-6">
      {/* Scenario Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              ${config.revenue.current.toLocaleString()}
            </div>
            <Badge className="mt-1" variant="secondary">
              +{config.revenue.growth}% growth
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Monthly Burn</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800 dark:text-red-200">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Total expenses
            </p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${netCashFlow >= 0 ? 'from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200' : 'from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${netCashFlow >= 0 ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}`}>
              Net Cash Flow
            </CardTitle>
            <TrendingUp className={`h-4 w-4 ${netCashFlow >= 0 ? 'text-green-600' : 'text-orange-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-800 dark:text-green-200' : 'text-orange-800 dark:text-orange-200'}`}>
              ${netCashFlow.toLocaleString()}
            </div>
            <Badge variant={netCashFlow >= 0 ? "default" : "destructive"}>
              {netCashFlow >= 0 ? "Positive" : "Negative"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Runway</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              {runwayMonths.toFixed(1)} months
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              With funding buffer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Controls */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="funding">Funding</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetToDefaults}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={saveScenario}>
              <Save className="w-4 h-4 mr-2" />
              Save Scenario
            </Button>
          </div>
        </div>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Projections</CardTitle>
              <CardDescription>
                Adjust monthly revenue and growth assumptions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Monthly Revenue: ${config.revenue.current.toLocaleString()}</Label>
                <Slider
                  value={[config.revenue.current]}
                  onValueChange={(value) => handleRevenueChange('current', value[0])}
                  min={0}
                  max={100000}
                  step={1000}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$0</span>
                  <span>$100k</span>
                </div>
              </div>
              
              <div>
                <Label>Monthly Growth Rate: {config.revenue.growth}%</Label>
                <Slider
                  value={[config.revenue.growth]}
                  onValueChange={(value) => handleRevenueChange('growth', value[0])}
                  min={0}
                  max={50}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>50%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>
                Adjust monthly spending by category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Salaries: ${config.expenses.salaries.toLocaleString()}</Label>
                <Slider
                  value={[config.expenses.salaries]}
                  onValueChange={(value) => handleExpenseChange('salaries', value[0])}
                  min={0}
                  max={100000}
                  step={1000}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Marketing: ${config.expenses.marketing.toLocaleString()}</Label>
                <Slider
                  value={[config.expenses.marketing]}
                  onValueChange={(value) => handleExpenseChange('marketing', value[0])}
                  min={0}
                  max={50000}
                  step={500}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Operations: ${config.expenses.operations.toLocaleString()}</Label>
                <Slider
                  value={[config.expenses.operations]}
                  onValueChange={(value) => handleExpenseChange('operations', value[0])}
                  min={0}
                  max={30000}
                  step={500}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Development: ${config.expenses.development.toLocaleString()}</Label>
                <Slider
                  value={[config.expenses.development]}
                  onValueChange={(value) => handleExpenseChange('development', value[0])}
                  min={0}
                  max={50000}
                  step={1000}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funding">
          <Card>
            <CardHeader>
              <CardTitle>Funding Assumptions</CardTitle>
              <CardDescription>
                Plan future funding rounds and timeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Next Funding Amount: ${config.funding.amount.toLocaleString()}</Label>
                <Slider
                  value={[config.funding.amount]}
                  onValueChange={(value) => handleFundingChange('amount', value[0])}
                  min={100000}
                  max={5000000}
                  step={50000}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$100k</span>
                  <span>$5M</span>
                </div>
              </div>
              
              <div>
                <Label>Timeline (months): {config.funding.timeline}</Label>
                <Slider
                  value={[config.funding.timeline]}
                  onValueChange={(value) => handleFundingChange('timeline', value[0])}
                  min={1}
                  max={24}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 month</span>
                  <span>24 months</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};