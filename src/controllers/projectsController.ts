import { RequestExt } from "../interfaces/req-ext";
import Project from "../models/project";
import { Response, Request } from "express";

const aggregateProject = async (req: Request, res: Response) => {
  const project = new Project(req.body);

  project.user = req.body.user._id;

  /*Prevenir projectos duplicados*/
  const { name } = req.body;
  const projectDuplicate = await Project.findOne({ name });
  if (projectDuplicate) {
    const error = new Error("PROJECT ALREADY REGISTERED");
    return res.status(400).json({ msg: error.message });
  }

  /*guardar projecto*/
  try {
    const projectGuardado = await project.save();

    res.json(projectGuardado);
  } catch (error) {
    console.log(error);
  }
};

const obtenerProjects = async (req: RequestExt, res: Response) => {
  const projects = await Project.find().where("user").equals(req.user);
  res.json(projects);
};

const exploreMain = async (req: Request, res: Response) => {
  const projects = await Project.find();
  console.log("devolviendo projectos");
  res.json(projects);
};

const myProjects = async (req: Request, res: Response) => {
  const projects = await Project.find().where("user").equals(req.body.user);
  res.json(projects);
};

const obtenerProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    return res.status(400).json({ msg: "PROJECT NOT FOUND" });
  }

  if (project.user._id.toString() !== req.body.user._id.toString()) {
    return res.json({ msg: "INVALID ACTION" });
  }

  res.json(project);
};

const actualizarProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    return res.status(400).json({ msg: "PROJECT NOT FOUND" });
  }

  if (project.user._id.toString() !== req.body.user._id.toString()) {
    return res.json({ msg: "INVALID ACTION" });
  }

  /*ACTUALIZANDO*/
  project.id == req.body.id || project.id;
  project.name = req.body.name || project.name;
  project.arquitect = req.body.arquitect || project.arquitect;
  project.area = req.body.area || project.area;
  project.site = req.body.site || project.site;
  project.year = req.body.year || project.year;
  project.projectImg = req.body.projectImg || project.projectImg;
  try {
    const projectActualizado = await project.save();
    res.json(projectActualizado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    return res.status(400).json({ msg: "PROJECT NOT FOUND" });
  }

  if (project.user._id.toString() !== req.body.user._id.toString()) {
    return res.json({ msg: "INVALID ACTION" });
  }
  try {
    await project.deleteOne();
    return res.json({ id: id, delete: true, msg: "DELETED PROJECT" });
  } catch (error) {
    console.log(error);
  }
};

const imgProject = (req, res) => {
  const { id } = req.params;
};

export { aggregateProject, obtenerProjects, myProjects, obtenerProject, actualizarProject, eliminarProject, exploreMain, imgProject };
