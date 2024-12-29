import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import moment from 'moment-timezone';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { performanceService } from '../services/performanceService';
import { WellPerformingResponse, UnderperformingResponse, OrderingPattern } from '../types/performance';

export default function PerformancePage() {
  const [timeframe, setTimeframe] = useState('30');
  const [threshold, setThreshold] = useState('5');
  const [loading, setLoading] = useState(true);
  const [wellPerforming, setWellPerforming] = useState<WellPerformingResponse | null>(null);
  const [underperforming, setUnderperforming] = useState<UnderperformingResponse | null>(null);
  const [orderPatterns, setOrderPatterns] = useState<Record<string, OrderingPattern>>({});

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

      // Fetch ordering patterns for all leads
      const allLeads = [
        ...wellPerformingData.wellPerformingAccounts,
        ...underperformingData.underperformingAccounts
      ];

      const patterns: Record<string, OrderingPattern> = {};
      await Promise.all(
        allLeads.map(async (account) => {
          try {
            const pattern = await performanceService.getOrderingPatterns(account.lead._id, timeframe);
            patterns[account.lead._id] = pattern;
          } catch (error) {
            console.error(`Failed to fetch patterns for lead ${account.lead._id}`);
          }
        })
      );
      setOrderPatterns(patterns);
    } catch (error) {
      toast.error('Failed to fetch performance data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return moment(date).format('MMM D, YYYY');
  };

  const renderOrderPattern = (leadId: string) => {
    const pattern = orderPatterns[leadId];
    if (!pattern) return null;

    return (
      <div className="mt-4 space-y-2 border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total Orders:</span>
          <span className="text-sm">{pattern.totalOrders}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Avg. Order Interval:</span>
          <span className="text-sm">
            {pattern.averageOrderInterval.toFixed(1)} days
          </span>
        </div>
        {pattern.orderDates.length > 0 && (
          <div className="text-sm">
            <span className="font-medium">Last Order:</span>{' '}
            {formatDate(pattern.orderDates[pattern.orderDates.length - 1])}
          </div>
        )}
      </div>
    );
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
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{account.lead.name}</h3>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                      Well Performing
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Status:</span>
                      <span className="text-sm">{account.lead.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Order Count:</span>
                      <span className="text-sm">{account.orderCount}</span>
                    </div>
                  </div>
                  {renderOrderPattern(account.lead._id)}
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
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{account.lead.name}</h3>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                      Underperforming
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Status:</span>
                      <span className="text-sm">{account.lead.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Current Orders:</span>
                      <span className="text-sm">{account.orderCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Expected Orders:</span>
                      <span className="text-sm">{Math.round(account.expectedOrders)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Last Order:</span>
                      <span className="text-sm">{formatDate(account.lastOrderDate)}</span>
                    </div>
                  </div>
                  {renderOrderPattern(account.lead._id)}
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