import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { leadService } from '../../services/leadService';
import { CallPlanningLead } from '../../types/lead';

export default function TodayCalls() {
  const [leads, setLeads] = useState<CallPlanningLead[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await leadService.getTodayCallPlanning();
      setLeads(data);
    } catch (error) {
      toast.error('Failed to fetch leads requiring calls');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return <div className="flex justify-center items-center py-4">Loading calls for today...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Calls Due Today</h2>
      </div>

      {leads.length === 0 ? (
        <Card>
          <CardContent className="py-4">
            <p className="text-center text-muted-foreground">No calls scheduled for today</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead) => (
            <Card key={lead._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{lead.name}</h3>
                    <p className="text-sm text-muted-foreground">Status: {lead.status}</p>
                  </div>
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/leads/${lead._id}`)}
                  >
                    View Details
                  </Button> */}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Days Since Last Call:</span>{' '}
                  {lead.daysSinceLastCall}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Next Call Due:</span>{' '}
                  {formatDate(lead.nextCallDue)}
                </p>
                {lead.lastInteractionDate && (
                  <p className="text-sm">
                    <span className="font-medium">Last Interaction:</span>{' '}
                    {formatDate(lead.lastInteractionDate)}
                  </p>
                )}
                {lead.callFrequency && (
                  <p className="text-sm">
                    <span className="font-medium">Call Frequency:</span>{' '}
                    {lead.callFrequency}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 