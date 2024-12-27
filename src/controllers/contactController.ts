import { Request, Response } from "express";
import { Contact } from "../models/contact";

// Add Contact
export const addContact = async (req: Request, res: Response) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (error:any) {
    res.status(500).json({ error: "Error adding contact", message: error.message });
  }
};

// Get Contacts for a Lead
export const getContactsForLead = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find({ leadId: req.params.leadId });
    res.status(200).json(contacts);
  } catch (error: any) {
    res.status(500).json({ error: "Error fetching contacts", message: error.message });
  }
};
