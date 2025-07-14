import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import userRoutes from "../src/routes/users.routes";
import customerroutes from "../src/routes/customer.routes";
import protectedRoutes from "./routes/protected.routes";
import noteRoutes from "./routes/notes.routes";
import taskRoutes from "./routes/task.routes";
import interactionRoutes from "./routes/interaction.routes";

//import AccessLogStream from "./routeDoc";

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
		this.app.use("/api/user", userRoutes);
		this.app.use("/api/customer", customerroutes);
		this.app.use("/api/Auth/", protectedRoutes);
		this.app.use("/api/note", noteRoutes);
		this.app.use("/api/commn", interactionRoutes);
		this.app.use("/api/tasks", taskRoutes);
	}

	private routes() {
		this.app.get("/api/health", (req, res) => {
			res.send("good to go");
		});
	}
}
