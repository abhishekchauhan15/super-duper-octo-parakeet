import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { contactService } from '../../services/contactService';
import { Contact } from '../../types/contact';

interface ContactsListProps {
  leadId: string;
  onAddContact: () => void;
}

export default function ContactsList({ leadId, onAddContact }: ContactsListProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, [leadId]);

  const fetchContacts = async () => {
    try {
      const data = await contactService.getContactsForLead(leadId);
      setContacts(data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch contacts');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-4">Loading contacts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Points of Contact</h3>
        <Button onClick={onAddContact} size="sm">
          Add Contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">No contacts added yet</p>
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <Card key={contact._id}>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{contact.name}</span>
                    <span className="text-sm text-muted-foreground">{contact.role}</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>Email: {contact.email}</p>
                    <p>Phone: {contact.phoneNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 