import App from "./app";
import { PORT } from "./config/environment";
import { routers } from "./routes";
import logger from "./utils/logger";

// define and start server
const app = new App(PORT, routers);
app.start().catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});
