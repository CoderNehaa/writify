import express, {
  Application,
  NextFunction,
  Request,
  Response,
  Router,
} from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import logger from "./utils/logger";
import { CORS_ORIGIN, DB_CONNECTION_URL } from "./config/environment";
import { connectRedis } from "./clients/redis.client";
import { swaggerSpec } from "./config/swagger";
import GlobalErrorHandler from "./middlewares/errorHandler.middleware";

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
    this.initializeRedisConnection();
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

  initializeRedisConnection() {
    connectRedis().catch((error) => {
      console.log("Failed to connect Redis:", error);
    });
  }

  initializeMiddlewares() {
    this.express.use(
      cors({
        origin: CORS_ORIGIN,
        credentials: true,
      })
    );
    this.express.use(express.json());
    this.express.use(cookieParser());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
