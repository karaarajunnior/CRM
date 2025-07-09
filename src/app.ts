import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import AccessLogStream from "./routeDoc";

dotenv.config();

export class App {
	private readonly app: Application;
	private readonly APPLICATION_RUNNING = "application is running on";

	constructor(
		private readonly port: string | number = process.env.SERVER_PORT || 5000,
	) {
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
	}

	private routes() {
		this.app.get("/api/health", (req, res) => {
			res.send("good to go");
		});
	}
}
