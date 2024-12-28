import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { leadService } from '../../services/leadService';
import { UpdateLeadData, Lead } from '../../types/lead';
import ContactsList from '../contacts/ContactsList';
import AddContact from '../contacts/AddContact';
import InteractionsList from '../interactions/InteractionsList';

export default function EditLead() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [originalLead, setOriginalLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<UpdateLeadData>({
    name: '',
    address: '',
    status: 'New',
    type: '',
    callFrequency: 0,
    preferredTimezone: '',
    lastInteractionDate: undefined,
    pointsOfContact: []
  });
  const [showAddContact, setShowAddContact] = useState(false);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      if (!id) throw new Error('Lead ID is required');
      const lead = await leadService.getLeadById(id);
      setOriginalLead(lead);
      
      // Ensure all fields are properly set from the fetched data
      setFormData({
        name: lead.name || '',
        address: lead.address || '',
        status: lead.status || 'New',
        type: lead.type || '',
        callFrequency: lead.callFrequency || 0,
        preferredTimezone: lead.preferredTimezone || '',
        lastInteractionDate: lead.lastInteractionDate ? new Date(lead.lastInteractionDate) : undefined,
        pointsOfContact: lead.pointsOfContact || []
      });
    } catch (error) {
      console.error('Error fetching lead:', error);
      toast.error('Failed to fetch lead details');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };

  const handleTypeChange = (value: string) => {
    setFormData({ ...formData, type: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!id) throw new Error('Lead ID is required');
      
      const changedFields: UpdateLeadData = {};
      Object.keys(formData).forEach(key => {
        const k = key as keyof typeof formData;
        if (originalLead && formData[k] !== originalLead[k as keyof Lead]) {
          if (formData[k] !== undefined) {
            (changedFields as any)[k] = formData[k];
          }
        }
      });

      await leadService.updateLead(id, changedFields);
      toast.success('Lead updated successfully');
      navigate('/leads');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update lead');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <h2 className="text-3xl font-bold text-center">Edit Lead</h2>
          <p className="text-center text-muted-foreground">Update lead information</p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter lead name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter address"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type
              </label>
              <Select value={formData.type || ''} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Resturant">Restaurant</SelectItem>
                  <SelectItem value="Dabha">Dhaba</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="callFrequency" className="text-sm font-medium">
                Call Frequency (days)
              </label>
              <Input
                id="callFrequency"
                name="callFrequency"
                type="number"
                min="1"
                value={formData.callFrequency}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="preferredTimezone" className="text-sm font-medium">
                Preferred Timezone
              </label>
              <Input
                id="preferredTimezone"
                name="preferredTimezone"
                value={formData.preferredTimezone}
                onChange={handleChange}
                placeholder="e.g., Europe/London"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastInteractionDate" className="text-sm font-medium">
                Last Interaction Date
              </label>
              <Input
                id="lastInteractionDate"
                name="lastInteractionDate"
                type="date"
                value={formData.lastInteractionDate ? new Date(formData.lastInteractionDate).toISOString().split('T')[0] : ''}
                onChange={handleChange}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="flex gap-4 w-full">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/leads')}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Update Lead
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-8 w-full max-w-2xl mx-auto">
        <InteractionsList leadId={id!} />
      </div>

      <div className="mt-8 w-full max-w-2xl mx-auto">
        {showAddContact ? (
          <AddContact
            initialLeadId={id!}
            onSuccess={() => {
              setShowAddContact(false);
            }}
            onCancel={() => setShowAddContact(false)}
          />
        ) : (
          <ContactsList
            leadId={id!}
            onAddContact={() => setShowAddContact(true)}
          />
        )}
      </div>
    </div>
  );
} 