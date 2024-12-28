import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { leadService } from '../../services/leadService';
import { Lead } from '../../types/lead';
import TodayCalls from './TodayCalls';
import LeadInteractions from './LeadInteractions';

export default function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const navigate = useNavigate();

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
    return <div className="flex justify-center items-center py-8">Loading leads...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button onClick={() => navigate('/leads/new')}>Add New Lead</Button>
      </div>

      <TodayCalls />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Leads</h2>
        {leads.length === 0 ? (
          <Card>
            <CardContent className="py-4">
              <p className="text-center text-muted-foreground">No leads found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leads.map((lead) => (
              <Card 
                key={lead._id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleLeadClick(lead._id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{lead.name}</h3>
                      <p className="text-sm text-muted-foreground">Status: {lead.status}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Address:</span> {lead.address}
                  </p>
                  {lead.type && (
                    <p className="text-sm">
                      <span className="font-medium">Type:</span> {lead.type}
                    </p>
                  )}
                  {lead.callFrequency && (
                    <p className="text-sm">
                      <span className="font-medium">Call Frequency:</span> {lead.callFrequency}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedLeadId && (
        <LeadInteractions
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
        />
      )}
    </div>
  );
} 