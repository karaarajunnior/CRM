import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
export class App {
    port;
    app;
    APPLICATION_RUNNING = "application is running on";
    constructor(port = process.env.SERVER_PORT || 5000) {
        this.port = port;
        this.app = express();
        this.middleware();
        this.routes();
    }
    listen() {
        this.app.listen(this.port);
        console.log(`${this.APPLICATION_RUNNING} port ${this.port}`);
    }
    middleware() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }
    routes() {
        this.app.get("/api/health", (req, res) => {
            res.send("good to go");
        });
    }
}
