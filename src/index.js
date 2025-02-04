import http from "http";
import { config } from "dotenv";
import app from "./app.js";
import * as logger from "./utils/logger.js";

if (process.env.NODE_ENV !== "production") {
  config();
}
const server = http.createServer(app);

const PORT = process.env.PORT || 3333;

server.listen(PORT, () => {
  logger.info(`Local: http://localhost:${PORT}/`);
});
