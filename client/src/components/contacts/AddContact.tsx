import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { contactService } from '../../services/contactService';

interface AddContactProps {
  initialLeadId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface ContactFormData {
  leadId: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
}

export default function AddContact({ initialLeadId, onSuccess, onCancel }: AddContactProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    leadId: initialLeadId,
    name: '',
    email: '',
    role: '',
    phoneNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.role || !formData.phoneNumber || !formData.email) {
      toast.error('All fields are required');
      return;
    }

    try {
      await contactService.addContact(formData);
      toast.success('Contact added successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add contact');
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Add New Contact</h3>
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
              placeholder="Contact name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="contact@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              placeholder="e.g., Manager"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="Phone number"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Add Contact
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 