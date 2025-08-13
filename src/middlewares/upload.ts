import multer from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.diskStorage({
	destination: (req: Request, file: Express.Multer.File, cb) => {
		cb(null, process.env.UPLOAD_DIR || "uploads/");
	},
	filename: (req: Request, file: Express.Multer.File, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
		);
	},
});

const fileFilter = (
	req: Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback,
) => {
	const allowedMimeTypes = [
		"image/jpeg",
		"image/png",
		"image/gif",
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/vnd.ms-excel",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"text/csv",
	];

	if (allowedMimeTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Invalid file type"));
	}
};

export const upload = multer({
	storage,
	fileFilter,
	//l am to consider max file size limit
});
