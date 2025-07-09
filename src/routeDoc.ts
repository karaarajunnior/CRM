import path from "path";
import fs from "fs";

const __dirname = path.resolve();

const accessLogStream = fs.createWriteStream(
	path.join(__dirname, "access.log"),
	{ flags: "a" },
);
export default {
	accessLogStream,
};
