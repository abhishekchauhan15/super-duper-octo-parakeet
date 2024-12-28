import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { performanceService } from '../services/performanceService';
import { WellPerformingResponse, UnderperformingResponse } from '../types/performance';

export default function PerformancePage() {
  const [timeframe, setTimeframe] = useState('30');
  const [threshold, setThreshold] = useState('5');
  const [loading, setLoading] = useState(true);
  const [wellPerforming, setWellPerforming] = useState<WellPerformingResponse | null>(null);
  const [underperforming, setUnderperforming] = useState<UnderperformingResponse | null>(null);

  useEffect(() => {
    fetchPerformanceData();
  }, [timeframe, threshold]);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const [wellPerformingData, underperformingData] = await Promise.all([
        performanceService.getWellPerformingAccounts(timeframe, threshold),
        performanceService.getUnderperformingAccounts(timeframe, threshold)
      ]);
      
      setWellPerforming(wellPerformingData);
      setUnderperforming(underperformingData);
    } catch (error) {
      toast.error('Failed to fetch performance data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <div className="flex justify-center items-center py-8">Loading performance data...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Performance Overview</h1>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Timeframe (days)</label>
            <Input
              type="number"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-32"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order Threshold</label>
            <Input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-32"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="well-performing">
        <TabsList>
          <TabsTrigger value="well-performing">Well Performing</TabsTrigger>
          <TabsTrigger value="underperforming">Underperforming</TabsTrigger>
        </TabsList>

        <TabsContent value="well-performing">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wellPerforming?.wellPerformingAccounts.map((account) => (
              <Card key={account.lead._id}>
                <CardHeader>
                  <h3 className="font-semibold">{account.lead.name}</h3>
                  <p className="text-sm text-muted-foreground">Status: {account.lead.status}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">{account.orderCount} orders</p>
                  <p className="text-sm text-muted-foreground">
                    in the last {timeframe} days
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          {wellPerforming?.wellPerformingAccounts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No well-performing accounts found for the current criteria
            </p>
          )}
        </TabsContent>

        <TabsContent value="underperforming">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {underperforming?.underperformingAccounts.map((account) => (
              <Card key={account.lead._id}>
                <CardHeader>
                  <h3 className="font-semibold">{account.lead.name}</h3>
                  <p className="text-sm text-muted-foreground">Status: {account.lead.status}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <span className="font-medium">Orders:</span> {account.orderCount}
                  </p>
                  <p>
                    <span className="font-medium">Expected:</span> {Math.round(account.expectedOrders)}
                  </p>
                  <p>
                    <span className="font-medium">Last Order:</span> {formatDate(account.lastOrderDate)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          {underperforming?.underperformingAccounts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No underperforming accounts found for the current criteria
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 