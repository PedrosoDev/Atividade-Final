import express from "express";
import cors from "cors";
import routes from "./routes/routes";

const PORT = 8080;

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1", routes)

app.listen(PORT, () => console.log(`⚡ servidor ${PORT}`));
