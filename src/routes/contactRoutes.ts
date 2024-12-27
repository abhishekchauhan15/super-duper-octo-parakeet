import express from 'express';
import { addContact, getContactsForLead } from "../controllers/contactController";

const router = express.Router();

router.post('/', addContact);
router.get('/:leadId', getContactsForLead);

export default router;
