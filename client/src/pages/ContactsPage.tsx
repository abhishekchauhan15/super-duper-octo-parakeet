import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { contactService } from '../services/contactService';
import { leadService } from '../services/leadService';
import { Contact } from '../types/contact';
import { Lead } from '../types/lead';
import AddContact from '../components/contacts/AddContact';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (selectedLeadId) {
      fetchContacts();
    }
  }, [selectedLeadId]);

  const fetchLeads = async () => {
    try {
      const data = await leadService.getAllLeads();
      setLeads(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch leads');
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    if (!selectedLeadId) return;
    setLoading(true);
    try {
      const data = await contactService.getContactsForLead(selectedLeadId);
      setContacts(data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch contacts');
      }
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !selectedLeadId) {
    return <div className="flex justify-center items-center min-h-[50vh]">Loading leads...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-sm text-muted-foreground">Manage contacts for leads</p>
        </div>
      </div>

      <div className="mb-8 max-w-md">
        <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a lead to view contacts" />
          </SelectTrigger>
          <SelectContent>
            {leads.map((lead) => (
              <SelectItem key={lead._id} value={lead._id}>
                {lead.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedLeadId && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Contacts for {leads.find(l => l._id === selectedLeadId)?.name}</h2>
            <Button onClick={() => setShowAddForm(true)}>Add Contact</Button>
          </div>

          {showAddForm && (
            <div className="mb-6">
              <AddContact
                initialLeadId={selectedLeadId}
                onSuccess={() => {
                  setShowAddForm(false);
                  fetchContacts();
                }}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">Loading contacts...</div>
          ) : contacts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No contacts found for this lead</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contacts.map((contact) => (
                <Card key={contact._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">{contact.role}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Email:</span> {contact.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {contact.phoneNumber}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
} 