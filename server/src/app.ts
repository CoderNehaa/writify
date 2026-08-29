import express, {
  Application,
  NextFunction,
  Request,
  Response,
  Router,
} from "express";
import mongoose from "mongoose";
import { CORS_ORIGIN, DB_CONNECTION_URL } from "./config/environment";
import cookieParser from "cookie-parser";
import GlobalErrorHandler from "./middlewares/errorHandler.middleware";
import logger from "./utils/logger";
import cors from "cors";
import multer from "multer";

interface RouteDefinition {
  path: string;
  router: Router;
}

class App {
  express: Application;
  port: number;

  constructor(port: number, routes: RouteDefinition[]) {
    this.express = express();
    this.port = port;

    // Initialize DB connection, middlewares, routes and global error handler
    this.initializeDBConnection();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  initializeDBConnection() {
    mongoose
      .connect(DB_CONNECTION_URL)
      .then((mongooseInstance) => {
        console.log("DB Connected successfully!");
        return mongooseInstance;
      })
      .catch((error) => {
        console.log("Failed to connect DB:", error);
        throw error;
      });
  }

  initializeMiddlewares() {
    this.express.use(
      cors({
        origin: CORS_ORIGIN,
        credentials: true,
      })
    );
    this.express.use(multer().any());
    this.express.use(express.json());
    this.express.use(cookieParser());
    this.express.use(express.urlencoded({ extended: true }));
    // Middleware to log all requests
    this.express.use((req: Request, res: Response, next: NextFunction) => {
      res.on("finish", () => {
        logger.info(`${req.method} ${req.url} ${res.statusCode}`);
      });
      next();
    });
  }

  initializeRoutes(routes: RouteDefinition[]) {
    routes.forEach((route) => {
      this.express.use(`/api/${route.path}`, route.router);
    });
  }

  initializeErrorHandling() {
    this.express.use(GlobalErrorHandler);
  }

  listen() {
    this.express.listen(this.port, () => {
      console.log("App listening on port", this.port);
    });
  }
}

export default App;
