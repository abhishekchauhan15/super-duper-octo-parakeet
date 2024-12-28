import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { leadService } from '../../services/leadService';
import { CreateLeadData } from '../../types/lead';

export default function CreateLead() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateLeadData>({
    name: '',
    address: '',
    status: 'New',
    callFrequency: 2,
    preferredTimezone: 'Europe/London'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await leadService.createLead(formData);
      toast.success('Lead created successfully');
      navigate('/leads');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create lead');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-3xl font-bold text-center">Create New Lead</h2>
          <p className="text-center text-muted-foreground">Enter the lead information</p>
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
                Create Lead
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 