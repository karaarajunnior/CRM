import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import userRoutes from "../src/users/users.routes";
import customerroutes from "./customers/customer.routes";
import protectedRoutes from "./protectedRoutes/protected.routes";
import noteRoutes from "./note/notes.routes";
import taskRoutes from "./task/task.routes";
import interactionRoutes from "./interaction/interaction.routes";
import dealRoutes from "./Deal/deal.routes";
import contactRoutes from "./contact/contact.routes";
import customerTagRoutes from "./customers/customerTag.routes";
import TagRoutes from "./tag/tag.routes";
import ActivityLogRoutes from "./utils/ActivityLog/activityLog.routes";
import { logActivityMiddleware } from "./middlewares/LogActivityMiddleware";
import ApprovalRoutes from "../src/approvals/approval.routes";
//import { accessLogStream } from "./logstream";

dotenv.config();

export class App {
	private readonly app: Application;
	private readonly APPLICATION_RUNNING = "application is running on";

	constructor(private readonly port: string | number = process.env.PORT!) {
		this.app = express();
		this.middleware();
		this.routes();
	}

	listen() {
		this.app.listen(this.port);
		console.log(`${this.APPLICATION_RUNNING} port ${this.port}`);
	}

	private middleware() {
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(morgan("combined"));
		//this.app.use(logActivityMiddleware);
		this.app.use("/api/approval", ApprovalRoutes);
		this.app.use("/api/user", userRoutes);
		this.app.use("/api/customer", customerroutes);
		this.app.use("/api/Auth/", protectedRoutes);
		this.app.use("/api/note", noteRoutes);
		this.app.use("/api/commn", interactionRoutes);
		this.app.use("/api/tasks", taskRoutes);
		this.app.use("/api/deals", dealRoutes);
		this.app.use("/api/contacts", contactRoutes);
		this.app.use("/api/customerTag", customerTagRoutes);
		this.app.use("/api/Tag", TagRoutes);
		this.app.use("/api/activityLog", ActivityLogRoutes);
	}

	private routes() {
		this.app.get("/api/health", (req, res) => {
			res.send("good to go");
		});
	}
}
