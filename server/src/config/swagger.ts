import swaggerJsdoc from "swagger-jsdoc";
import { NODE_ENV, PUBLIC_API_URL } from "./environment";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Writify API",
      version: "1.0.0",
      description: "REST API documentation for the Writify backend.",
    },
    servers: [{ url: PUBLIC_API_URL }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis:
    NODE_ENV === "production"
      ? ["./dist/modules/**/*.route.js"]
      : ["./src/modules/**/*.route.ts"],
});
