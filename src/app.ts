import "dotenv/config";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { router } from "./routes";
import db from "./config/mongo";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("No permitido"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
dotenv.config();
app.use(router);
db().then(() => console.log("Conexion establecida"));
app.listen(PORT, () => console.log(`Funcionando en el puerto ${PORT}`));
