import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import router from "./routes";
import { createServer } from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import { defaultSocket } from "./socket";

const app = express();

// Apply middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(
  cors({
    origin: "*",
  })
);

app.use(morgan("combined"));

app.use("/api", router);

// const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../client/dist")));

// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, '../client/dist/index.html'))
// );

const httpServer = createServer(app);

// Setup Socket.io
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Set io as a property of the app
app.set("io", io);

defaultSocket(io);
// configureMessageSocket(io);

// Export the Express app instance
export default httpServer;
