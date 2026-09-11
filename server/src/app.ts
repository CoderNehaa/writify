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

  private routes: RouteDefinition[];

  constructor(port: number, routes: RouteDefinition[]) {
    this.express = express();
    this.port = port;
    this.routes = routes;
  }

  // Connect infra first, then wire the app and start listening — so the
  // server never accepts a request before Mongo/Redis are ready.
  async start() {
    await this.initializeDBConnection();
    await this.initializeRedisConnection();
    this.initializeMiddlewares();
    this.initializeRoutes(this.routes);
    this.initializeErrorHandling();
    this.listen();
  }

  async initializeDBConnection() {
    try {
      await mongoose.connect(DB_CONNECTION_URL);
      logger.info("DB Connected successfully!");
    } catch (error) {
      logger.error("Failed to connect DB:", error);
      throw error; // fatal — handled by index.ts
    }
  }

  async initializeRedisConnection() {
    try {
      await connectRedis();
    } catch (error) {
      // Non-fatal: auth still works without the revocation store, and
      // node-redis keeps retrying in the background.
      logger.error(
        "Redis connection failed at startup, continuing without it:",
        error
      );
    }
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

    // Registered before the request-logging middleware below so a load
    // balancer / uptime monitor polling this every few seconds doesn't
    // spam the logs.
    this.express.get("/api/health", (_req: Request, res: Response) => {
      res.status(200).json({
        status: "ok",
        dbConnected: mongoose.connection.readyState === 1,
      });
    });

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
