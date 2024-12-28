import { Request, Response } from "express";
import { Contact } from "../models/contact";


export const addContact = async (req: Request, res: Response) => {
    const {leadId, name, email, role,phoneNumber } = req.body;

  if (!name || !role || !phoneNumber || !email) {
     res.status(400).json({ error: "Missing required fields" });
     return
  }
  
  try {
    const contact = new Contact({ leadId, name, email, role, phoneNumber });
    await contact.save();
    res.status(201).json({ message: "Contact added successfully"});
  } catch (error: any) {
    res.status(500).json({ error: "Error adding contact", message: error.message });
  }
};


export const getContactsForLead = async (req: Request, res: Response) => {

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
