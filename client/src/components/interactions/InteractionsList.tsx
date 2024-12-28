import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { interactionService } from '../../services/interactionService';
import { Interaction } from '../../types/interaction';
import AddInteraction from './AddInteraction';

interface InteractionsListProps {
  leadId: string;
}

export default function InteractionsList({ leadId }: InteractionsListProps) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchInteractions();
  }, [leadId]);

  const fetchInteractions = async () => {
    try {
      const data = await interactionService.getInteractionsByLead(leadId);
      setInteractions(data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch interactions');
      }
      setInteractions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return <div className="flex justify-center items-center py-8">Loading interactions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Interactions History</h2>
        <Button onClick={() => setShowAddForm(true)}>Add Interaction</Button>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <AddInteraction
            leadId={leadId}
            onSuccess={() => {
              setShowAddForm(false);
              fetchInteractions();
            }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {interactions.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No interactions recorded yet</p>
      ) : (
        <div className="grid gap-4">
          {interactions.map((interaction) => (
            <Card key={interaction._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{interaction.type}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(interaction.createdAt)}
                    </p>
                  </div>
                  {interaction.duration && (
                    <span className="text-sm text-muted-foreground">
                      Duration: {interaction.duration} minutes
                    </span>
                  )}
                </div>
              </CardHeader>
              {interaction.notes && (
                <CardContent>
                  <p className="whitespace-pre-wrap">{interaction.notes}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 