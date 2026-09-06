import App from "./app";
import { PORT } from "./config/environment";
import { routers } from "./routes";

// define and start server
const app = new App(PORT, routers);
app.listen();
