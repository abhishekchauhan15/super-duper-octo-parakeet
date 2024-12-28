import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { leadService } from '../../services/leadService';
import { Lead } from '../../types/lead';
import LeadInteractions from './LeadInteractions';

export default function LeadsList() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await leadService.getAllLeads();
      setLeads(data);
    } catch (error) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const handleLeadClick = (leadId: string) => {
    setSelectedLeadId(leadId);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[50vh]">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-sm text-muted-foreground">Manage and track your leads</p>
        </div>
        <Button onClick={() => navigate('/leads/new')}>Add New Lead</Button>
      </div>

      {leads.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No leads found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead) => (
            <Card 
              key={lead._id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleLeadClick(lead._id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{lead.name}</h3>
                    <p className="text-sm text-muted-foreground">{lead.address}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                    {lead.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Type:</span> {lead.type || 'Not specified'}
                  </p>
                  <p>
                    <span className="font-medium">Call Frequency:</span> {lead.callFrequency} days
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedLeadId && (
        <LeadInteractions
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
        />
      )}
    </div>
  );
} 