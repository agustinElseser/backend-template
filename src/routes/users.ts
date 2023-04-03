import { Router } from "express";
import { myProjects } from "../controllers/projectsController.js";

import {
  register,
  profile,
  confirm,
  autentic,
  resetPassword,
  comprobarToken,
  newPassword,
  actualizarProfile,
  actulizarPw,
  addFavourite,
} from "../controllers/usersController.js";
import { sendConsulta } from "../utils/nodemailer.js";
import checkAuth from "../middleware/auth";

const router = Router();

/*Area publica*/
router.post("/register", register);
router.get("/confirm/:token", confirm);
router.post("/login", autentic);
router.post("/reset-password", resetPassword);
router.get("/reset-password/:token", comprobarToken);
router.post("/reset-password/:token", newPassword);
router.post("/send-consulta", sendConsulta);

/*Area privada*/
router.get("/profile", checkAuth, profile);
router.put("/profile/:id", checkAuth, actualizarProfile);
router.put("/changepw", checkAuth, actulizarPw);
router.get("/myProyects", checkAuth, myProjects);
router.put("/favourite", checkAuth, addFavourite);

export { router };
