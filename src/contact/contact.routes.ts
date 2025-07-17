import { Router } from "express";
import { ContactController } from "./contact.controller";

const router = Router();

// Create a new contact
router.post("/", ContactController.createContact);

// Get all contacts (with pagination)
router.get("/", ContactController.getAllContacts);

// Search contacts
router.get("/search", ContactController.searchContacts);

// Get contacts by customer ID
router.get("/customer/:customerId", ContactController.getContactsByCustomerId);

// Get contacts by type
router.get("/type/:type", ContactController.getContactsByType);

// Get contact by ID
router.get("/:id", ContactController.getContactById);

// Update contact
router.put("/:id", ContactController.updateContact);

// Delete contact
router.delete("/:id", ContactController.deleteContact);

export default router;
