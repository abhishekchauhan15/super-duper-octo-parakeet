import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lead } from '../../types/lead';
import { leadService } from '../../services/leadService';
import InteractionsList from '../interactions/InteractionsList';
import AddInteraction from '../interactions/AddInteraction';
import OrdersList from '../orders/OrdersList';

interface LeadInteractionsProps {
  leadId: string;
  onClose: () => void;
}

export default function LeadInteractions({ leadId, onClose }: LeadInteractionsProps) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  const fetchLead = async () => {
    try {
      const data = await leadService.getLeadById(leadId);
      setLead(data);
    } catch (error) {
      toast.error('Failed to fetch lead details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-8">Loading...</div>;
  }

  if (!lead) {
    return <div className="text-center py-8">Lead not found</div>;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{lead.name}</h2>
              <p className="text-muted-foreground">{lead.address}</p>
              <div className="mt-2 space-y-1">
                <p><span className="font-medium">Status:</span> {lead.status}</p>
                <p><span className="font-medium">Type:</span> {lead.type}</p>
                <p><span className="font-medium">Call Frequency:</span> {lead.callFrequency} days</p>
                <p><span className="font-medium">Timezone:</span> {lead.preferredTimezone}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>

          <Tabs defaultValue="interactions" className="mt-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="interactions">Interactions</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="interactions">
              {showAddForm ? (
                <AddInteraction
                  leadId={leadId}
                  onSuccess={() => setShowAddForm(false)}
                  onCancel={() => setShowAddForm(false)}
                />
              ) : (
                <InteractionsList leadId={leadId} />
              )}
            </TabsContent>
            <TabsContent value="orders">
              <OrdersList leadId={leadId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 