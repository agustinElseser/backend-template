import { Router } from "express";
import {
  aggregateProject,
  exploreMain,
  myProjects,
  obtenerProject,
  actualizarProject,
  eliminarProject,
  imgProject,
} from "../controllers/projectsController";
import checkAuth from "../middleware/auth";
const router = Router();

router.route("/").post(checkAuth, aggregateProject);
router.route("/explore").get(exploreMain);
router.route("/myprojects").get(checkAuth, myProjects);

router.route("/:id").get(checkAuth, obtenerProject).put(checkAuth, actualizarProject).delete(checkAuth, eliminarProject);

router.route("/img/:id").get(imgProject);

export { router };
