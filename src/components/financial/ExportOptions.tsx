import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, FileSpreadsheet, FileImage } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const ExportOptions = () => {
  const [selectedSections, setSelectedSections] = useState({
    budget: true,
    funding: true,
    runway: true,
    scenarios: true,
    metrics: true
  });
  
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'pptx'>('pdf');

  const handleSectionToggle = (section: keyof typeof selectedSections) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleExport = async () => {
    const selectedCount = Object.values(selectedSections).filter(Boolean).length;
    
    if (selectedCount === 0) {
      toast.error("Please select at least one section to export");
      return;
    }

    toast.info(`Preparing ${exportFormat.toUpperCase()} export...`);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const filename = `financial-report-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      toast.success(`${exportFormat.toUpperCase()} report exported successfully as ${filename}`);
    } catch (error) {
      toast.error("Failed to export report. Please try again.");
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'csv': return <FileSpreadsheet className="w-4 h-4" />;
      case 'pptx': return <FileImage className="w-4 h-4" />;
      default: return <Download className="w-4 h-4" />;
    }
  };

  const getFormatDescription = (format: string) => {
    switch (format) {
      case 'pdf': return 'Comprehensive report with charts and tables';
      case 'csv': return 'Raw data export for spreadsheet analysis';
      case 'pptx': return 'Presentation slides for investor meetings';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Format Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Export Format</CardTitle>
          <CardDescription>
            Choose your preferred export format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['pdf', 'csv', 'pptx'] as const).map((format) => (
              <Card 
                key={format}
                className={`cursor-pointer transition-all ${
                  exportFormat === format 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setExportFormat(format)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    {getFormatIcon(format)}
                    <h3 className="font-semibold uppercase">{format}</h3>
                    <p className="text-xs text-muted-foreground text-center">
                      {getFormatDescription(format)}
                    </p>
                    {exportFormat === format && (
                      <Badge variant="default" className="mt-2">Selected</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Report Sections</CardTitle>
          <CardDescription>
            Select which sections to include in your export
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(selectedSections).map(([section, checked]) => (
              <div key={section} className="flex items-center space-x-3">
                <Checkbox
                  id={section}
                  checked={checked}
                  onCheckedChange={() => handleSectionToggle(section as keyof typeof selectedSections)}
                />
                <Label 
                  htmlFor={section} 
                  className="text-sm font-medium cursor-pointer flex-1"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)} {section === 'metrics' ? 'Summary' : 'Analysis'}
                </Label>
                <Badge variant="outline" className="text-xs">
                  {section === 'budget' && 'Budget breakdown & expense tracking'}
                  {section === 'funding' && 'Investment rounds & dilution analysis'}
                  {section === 'runway' && 'Cash flow projections & burn rate'}
                  {section === 'scenarios' && 'Growth scenarios & planning'}
                  {section === 'metrics' && 'Key financial metrics & KPIs'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Export Preview</CardTitle>
          <CardDescription>
            Review your export configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Format:</span>
              <Badge variant="outline">{exportFormat.toUpperCase()}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sections:</span>
              <Badge variant="outline">
                {Object.values(selectedSections).filter(Boolean).length} of {Object.keys(selectedSections).length}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Estimated size:</span>
              <Badge variant="outline">
                {exportFormat === 'pdf' ? '2-5 MB' : exportFormat === 'pptx' ? '1-3 MB' : '< 100 KB'}
              </Badge>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                onClick={handleExport} 
                className="w-full"
                disabled={Object.values(selectedSections).filter(Boolean).length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Financial Report ({exportFormat.toUpperCase()})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Exports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
          <CardDescription>
            Your export history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'financial-report-2024-01-15.pdf', date: '2024-01-15', size: '3.2 MB' },
              { name: 'budget-analysis-2024-01-10.csv', date: '2024-01-10', size: '45 KB' },
              { name: 'investor-deck-2024-01-05.pptx', date: '2024-01-05', size: '2.1 MB' }
            ].map((export_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFormatIcon(export_.name.split('.').pop() || '')}
                  <div>
                    <p className="text-sm font-medium">{export_.name}</p>
                    <p className="text-xs text-muted-foreground">{export_.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">{export_.size}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};