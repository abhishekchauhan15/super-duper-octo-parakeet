import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { interactionService } from '../../services/interactionService';
import { CreateInteractionData } from '../../types/interaction';

interface AddInteractionProps {
  leadId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddInteraction({ leadId, onSuccess, onCancel }: AddInteractionProps) {
  const [formData, setFormData] = useState<CreateInteractionData>({
    leadId,
    nextCallDate: '',
    notes: '',
    duration: 0
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'number' 
      ? Number(e.target.value) 
      : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await interactionService.addInteraction(formData);
      toast.success('Interaction added successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add interaction');
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Add New Interaction</h3>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="nextCallDate" className="text-sm font-medium">
              Next Call Date
            </label>
            <Input
              id="nextCallDate"
              name="nextCallDate"
              type="datetime-local"
              value={formData.nextCallDate}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="duration" className="text-sm font-medium">
              Duration (minutes)
            </label>
            <Input
              id="duration"
              name="duration"
              type="number"
              min="0"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter call duration"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter interaction notes"
              rows={4}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Add Interaction
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 