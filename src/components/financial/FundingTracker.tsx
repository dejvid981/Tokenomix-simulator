import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { FundingRound, TreasuryBalance } from "@/types/financial";
import { toast } from "sonner";

export const FundingTracker = () => {
  const [fundingRounds, setFundingRounds] = useState<FundingRound[]>([
    {
      id: "1",
      name: "Pre-Seed Round",
      amount: 250000,
      date: "2023-06-15",
      type: "pre-seed",
      dilution: 15,
      tokenPrice: 0.05,
      tokensIssued: 5000000
    },
    {
      id: "2", 
      name: "IDO Launch",
      amount: 500000,
      date: "2023-12-01",
      type: "ido",
      dilution: 10,
      tokenPrice: 0.12,
      tokensIssued: 4166667
    }
  ]);

  const [treasury] = useState<TreasuryBalance>({
    fiat: 595000,
    tokens: 15000000,
    tokenValue: 1800000,
    lastUpdated: new Date().toISOString()
  });

  const [newRound, setNewRound] = useState<Partial<FundingRound>>({
    name: "",
    amount: 0,
    type: "seed",
    dilution: 0
  });

  const totalRaised = fundingRounds.reduce((sum, round) => sum + round.amount, 0);
  const totalDilution = fundingRounds.reduce((sum, round) => sum + round.dilution, 0);
  const currentValuation = totalRaised / (totalDilution / 100);

  const handleAddRound = () => {
    if (!newRound.name || !newRound.amount || !newRound.dilution) {
      toast.error("Please fill in all required fields");
      return;
    }

    const round: FundingRound = {
      id: Date.now().toString(),
      name: newRound.name,
      amount: newRound.amount,
      date: new Date().toISOString().split('T')[0],
      type: newRound.type || "seed",
      dilution: newRound.dilution,
      tokenPrice: newRound.tokenPrice,
      tokensIssued: newRound.tokensIssued
    };

    setFundingRounds([...fundingRounds, round]);
    setNewRound({ name: "", amount: 0, type: "seed", dilution: 0 });
    toast.success("Funding round added successfully");
  };

  const getRoundTypeColor = (type: string) => {
    const colors = {
      "pre-seed": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "seed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "series-a": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "ido": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      "token-sale": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Treasury Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Treasury (Fiat)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              ${treasury.fiat.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Token Holdings</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {(treasury.tokens / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              ≈ ${treasury.tokenValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Raised</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              ${totalRaised.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Dilution</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
              {totalDilution.toFixed(1)}%
            </div>
            <Progress value={totalDilution} className="mt-2" max={100} />
          </CardContent>
        </Card>
      </div>

      {/* Add New Funding Round */}
      <Card>
        <CardHeader>
          <CardTitle>Add Funding Round</CardTitle>
          <CardDescription>
            Track new investments and calculate dilution impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="round-name">Round Name</Label>
              <Input
                placeholder="e.g. Seed Round"
                value={newRound.name}
                onChange={(e) => setNewRound({...newRound, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                type="number"
                placeholder="0"
                value={newRound.amount || ""}
                onChange={(e) => setNewRound({...newRound, amount: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="type">Round Type</Label>
              <Select value={newRound.type} onValueChange={(value) => setNewRound({...newRound, type: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="series-a">Series A</SelectItem>
                  <SelectItem value="ido">IDO</SelectItem>
                  <SelectItem value="token-sale">Token Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dilution">Dilution (%)</Label>
              <Input
                type="number"
                placeholder="0"
                value={newRound.dilution || ""}
                onChange={(e) => setNewRound({...newRound, dilution: Number(e.target.value)})}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddRound} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Round
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funding History */}
      <Card>
        <CardHeader>
          <CardTitle>Funding History</CardTitle>
          <CardDescription>
            Complete funding timeline and dilution tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Round</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Dilution</TableHead>
                  <TableHead>Token Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fundingRounds.map((round) => (
                  <TableRow key={round.id}>
                    <TableCell className="font-medium">{round.name}</TableCell>
                    <TableCell>
                      <Badge className={getRoundTypeColor(round.type)}>
                        {round.type.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>${round.amount.toLocaleString()}</TableCell>
                    <TableCell>{new Date(round.date).toLocaleDateString()}</TableCell>
                    <TableCell>{round.dilution}%</TableCell>
                    <TableCell>{round.tokenPrice ? `$${round.tokenPrice}` : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};