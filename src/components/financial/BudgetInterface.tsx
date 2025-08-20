import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BudgetItem } from "@/types/financial";
import { toast } from "sonner";

export const BudgetInterface = () => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      id: "1",
      category: "Salaries",
      subcategory: "Engineering Team",
      amount: 45000,
      frequency: "monthly",
      startDate: "2024-01-01",
      isRecurring: true
    },
    {
      id: "2", 
      category: "Marketing",
      subcategory: "Digital Ads",
      amount: 8000,
      frequency: "monthly",
      startDate: "2024-01-01",
      isRecurring: true
    },
    {
      id: "3",
      category: "Operations",
      subcategory: "Infrastructure",
      amount: 5000,
      frequency: "monthly", 
      startDate: "2024-01-01",
      isRecurring: true
    }
  ]);

  const [newItem, setNewItem] = useState<Partial<BudgetItem>>({
    category: "",
    subcategory: "",
    amount: 0,
    frequency: "monthly",
    isRecurring: true
  });

  const totalMonthlyBudget = budgetItems
    .filter(item => item.frequency === "monthly" && item.isRecurring)
    .reduce((sum, item) => sum + item.amount, 0);

  const handleAddItem = () => {
    if (!newItem.category || !newItem.subcategory || !newItem.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const item: BudgetItem = {
      id: Date.now().toString(),
      category: newItem.category,
      subcategory: newItem.subcategory,
      amount: newItem.amount,
      frequency: newItem.frequency || "monthly",
      startDate: new Date().toISOString().split('T')[0],
      isRecurring: newItem.isRecurring || true
    };

    setBudgetItems([...budgetItems, item]);
    setNewItem({ category: "", subcategory: "", amount: 0, frequency: "monthly", isRecurring: true });
    toast.success("Budget item added successfully");
  };

  const handleRemoveItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
    toast.success("Budget item removed");
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Salaries": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "Marketing": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", 
      "Operations": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "Development": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Budget Overview</CardTitle>
          <CardDescription>
            Manage your monthly expenses and track spending categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Monthly Budget</p>
              <p className="text-2xl font-bold">${totalMonthlyBudget.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Active Categories</p>
              <p className="text-2xl font-bold">{new Set(budgetItems.map(item => item.category)).size}</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Budget Items</p>
              <p className="text-2xl font-bold">{budgetItems.length}</p>
            </div>
          </div>

          {/* Add New Item Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Add New Budget Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Salaries">Salaries</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Input
                    placeholder="e.g. Engineering Team"
                    value={newItem.subcategory}
                    onChange={(e) => setNewItem({...newItem, subcategory: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newItem.amount || ""}
                    onChange={(e) => setNewItem({...newItem, amount: Number(e.target.value)})}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddItem} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Items Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Subcategory</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.subcategory}</TableCell>
                    <TableCell>${item.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.frequency}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
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