import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import moment from 'moment-timezone';
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextCallDate = (lead: Lead) => {
    if (!lead.lastInteractionDate || !lead.callFrequency) return null;
    const lastCall = moment(lead.lastInteractionDate);
    return lastCall.add(lead.callFrequency, 'days');
  };

  const getNextCallHighlight = (nextCall: moment.Moment | null) => {
    if (!nextCall) return 'bg-gray-100 text-gray-800';
    const today = moment();
    const daysUntilCall = nextCall.diff(today, 'days');

    if (daysUntilCall < 0) return 'bg-red-100 text-red-800';
    if (daysUntilCall === 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
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
            {leads.map((lead) => {
              const nextCall = getNextCallDate(lead);
              return (
                <Card 
                  key={lead._id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleLeadClick(lead._id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{lead.name}</h3>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
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
                        <span className="font-medium">Call Frequency:</span> {lead.callFrequency} days
                      </p>
                    )}
                    {nextCall && (
                      <div className={`mt-2 rounded-md px-2.5 py-1.5 text-sm ${getNextCallHighlight(nextCall)}`}>
                        <span className="font-medium">Next Call:</span>{' '}
                        {nextCall.format('MMM D, YYYY')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
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