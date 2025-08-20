import { useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BudgetInterface } from "@/components/financial/BudgetInterface";
import { FundingTracker } from "@/components/financial/FundingTracker";
import { RunwayVisualization } from "@/components/financial/RunwayVisualization";
import { ScenarioPlanner } from "@/components/financial/ScenarioPlanner";
import { ExportOptions } from "@/components/financial/ExportOptions";
import { DollarSign, TrendingUp, Clock, Target } from "lucide-react";
import type { ScenarioConfig, FinancialMetrics } from "@/types/financial";

const FinancialHub = () => {
  const [scenarioConfig, setScenarioConfig] = useState<ScenarioConfig>({
    revenue: { current: 25000, growth: 15 },
    expenses: {
      salaries: 45000,
      marketing: 8000,
      operations: 5000,
      development: 12000
    },
    funding: { amount: 500000, timeline: 6 }
  });

  const [metrics] = useState<FinancialMetrics>({
    burnRate: 70000,
    runway: 8.5,
    cashFlow: -45000,
    growthRate: 15,
    efficiency: 72
  });

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              SolFi Financial Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Budget, runway planning, and scenario analysis for Solana founders
            </p>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Monthly Burn</CardTitle>
                <DollarSign className="h-4 w-4 text-red-600 dark:text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-800 dark:text-red-200">
                  ${metrics.burnRate.toLocaleString()}
                </div>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Down 12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Runway</CardTitle>
                <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                  {metrics.runway} months
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Based on current burn rate
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Growth Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {metrics.growthRate}%
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Monthly revenue growth
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Efficiency</CardTitle>
                <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {metrics.efficiency}%
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Capital efficiency score
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="budget" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="funding">Funding</TabsTrigger>
              <TabsTrigger value="runway">Runway</TabsTrigger>
              <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="budget" className="space-y-6">
              <BudgetInterface />
            </TabsContent>

            <TabsContent value="funding" className="space-y-6">
              <FundingTracker />
            </TabsContent>

            <TabsContent value="runway" className="space-y-6">
              <RunwayVisualization scenarioConfig={scenarioConfig} />
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-6">
              <ScenarioPlanner 
                config={scenarioConfig}
                onChange={setScenarioConfig}
              />
            </TabsContent>

            <TabsContent value="export" className="space-y-6">
              <ExportOptions />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default FinancialHub;