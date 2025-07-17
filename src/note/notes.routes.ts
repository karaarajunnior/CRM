import Router from "express";
import { query, param } from "express-validator";
import { validate } from "../middlewares/validation";
import {
	createNoteValidation,
	updateNoteValidation,
} from "../validations/validations";
import { NoteController } from "../note/note.controller";

const router = Router();

router.post("/", validate(createNoteValidation), NoteController.createNote);
router.get(
	"/",
	validate([query("page").optional().isInt({ min: 1 })]),
	NoteController.getNotes,
);
router.get(
	"/:id",
	validate([param("id").isUUID()]),
	NoteController.getNoteById,
);
router.put("/:id", validate(updateNoteValidation), NoteController.updateNote);
router.delete(
	"/:id",
	validate([param("id").isUUID()]),
	NoteController.deleteNote,
);

// Get notes by entity (contact, deal, etc.)
router.get(
	"/entity/:entityType/:entityId",
	validate([
		param("entityType").isIn(["contact", "deal", "task", "interaction"]),
		param("entityId").isUUID(),
		query("page").optional().isInt({ min: 1 }),
	]),
	NoteController.getNotesByEntity,
);

export default router;
