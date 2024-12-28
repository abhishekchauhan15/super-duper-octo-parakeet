import { Request, Response } from "express";
import { Contact } from "../models/contact";

// Add Contact
export const addContact = async (req: Request, res: Response) => {
    const { name, email, phoneNumber, role } = req.body;
  // Validate input
  if (!name || !role || !phoneNumber || !email) {
     res.status(400).json({ error: "Missing required fields" });
     return
  }
  
  try {
    const contact = new Contact({ name, email, phoneNumber, role });
    await contact.save();
    res.status(201).json(contact);
  } catch (error: any) {
    res.status(500).json({ error: "Error adding contact", message: error.message });
  }
};

// Get Contacts for a Lead
export const getContactsForLead = async (req: Request, res: Response) => {
  // Validate leadId parameter
  if (!req.params.leadId) {
     res.status(400).json({ error: "Missing leadId parameter" });
     return
  }

  try {
    const contacts = await Contact.find({ leadId: req.params.leadId });
    if (contacts.length === 0) {
       res.status(404).json({ error: "No contacts found for this lead" });
       return
    }
    res.status(200).json(contacts);
  } catch (error: any) {
    res.status(500).json({ error: "Error fetching contacts", message: error.message });
  }
};
