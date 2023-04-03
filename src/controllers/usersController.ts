import User from "../models/user";
import { generateToken } from "../utils/jwt.handle";
import generarId from "../utils/id";
import Project from "../models/project";
import { olvidePW, emailRegister } from "../utils/nodemailer";
import { Request, Response } from "express";
import { RequestExt } from "../interfaces/req-ext";
import { verified } from "../utils/bcrypt.handle";

const register = async (req: Request, res: Response) => {
  const { email, name } = req.body;

  /*Prevenir usuarios duplicados*/
  const userDuplicate = await User.findOne({ email });
  if (userDuplicate) {
    const error = new Error("ALREADY REGISTERED USER");
    return res.status(400).json({ msg: error.message });
  }

  /*Generar nuevo usuario*/
  try {
    const user = new User(req.body);
    const userGuardado = await user.save();

    /*Enviar mail de confirmacion*/
    emailRegister({
      name,
      email,
      token: userGuardado.token,
    });

    res.json({ userGuardado });
  } catch (error) {
    console.log(error);
  }
};

const confirm = async (req: Request, res: Response) => {
  const { token } = req.params;
  const userConfirm = await User.findOne({ token });
  if (!userConfirm) {
    const error = new Error("INVALID TOKEN");
    return res.status(404).json({ msg: error.message });
  }
  try {
    userConfirm.token = null;
    userConfirm.confirm = true;
    await userConfirm.save();

    res.json({ msg: "CONFIRMED USER" });
  } catch (error) {
    console.log(error);
  }
};
//asdfgsdfgsd
const profile = async (req: Request, res: Response) => {
  const { user } = req.body;

  const projects = await Project.find().where("user").equals(user);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user.id),
    myProjects: projects,
    favourite: user.favourite,
  });
};

const autentic = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  /*revisar que esta confirmado*/
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("USER DON'T EXIST");
    return res.status(403).json({ msg: error.message });
  }

  /*revisar pw*/
  if (!user.confirm) {
    const error = new Error("UNCONFIRMED USER");
    return res.status(400).json({ msg: error.message });
  }

  const projects = await Project.find().where("user").equals(user);

  /*autenticando*/
  if (await verified(password, user.password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
      myProjects: projects,
      favourite: user.favourite,
    });
  } else {
    const error = new Error("PASSWORD INCORRECT");
    return res.status(400).json({ msg: "PASSWORD INCORRECT" });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const existUser = await User.findOne({ email });

  if (!existUser) {
    const error = new Error("USER DON'T EXIST");
    return res.status(400).json({ msg: error.message });
  }

  try {
    existUser.token = generarId();
    await existUser.save();

    olvidePW({
      email,
      name: existUser.name,
      token: existUser.token,
    });

    res.json({ msg: "FOLLOW THE INSTRUCTIONS SENT TO EMAIL" });
  } catch (error) {}
};

const comprobarToken = async (req: Request, res: Response) => {
  const { token } = req.params;

  const tokenValue = await User.findOne({ token });

  if (tokenValue) {
    res.json({ msg: "VALID TOKEN AND USER" });
  } else {
    const error = new Error("INVALID TOKEN");
    return res.status(400).json({ msg: error.message });
  }
};

const newPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });
  if (!user) {
    const error = new Error("ERROR");
    return res.status(400).json({ msg: error.message });
  }

  try {
    user.token = "";
    user.password = password;
    await user.save();
    res.json({ msg: "PASSWORD MODIFIED CORRECTLY" });
  } catch (error) {}
};

const actualizarProfile = async (req: Request, res: Response) => {
  const user = await User.findById(req.body.user?._id);

  if (!user) {
    const error = new Error("ERROR");
    return res.status(400).json({ msg: error.message });
  }
  const { email } = req.body.user;
  if (user.email !== req.body.user.email) {
    const existeEmail = await User.findOne({ email });
    if (existeEmail) {
      const error = new Error("THE EMAIL IS ALREADY IN USE");
      return res.status(400).json({ msg: error.message });
    }
  }
  try {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const userActualizado = await user.save();
    res.json(userActualizado);
  } catch (error) {}
};

const actulizarPw = async (req: Request, res: Response) => {
  const { id } = req.body.user;
  const { pw_act, pw_new } = req.body;

  /*comprueba usuario*/
  const user = await User.findById(id);
  if (!user) {
    const error = new Error("USER DON'T EXIST");
    return res.status(400).json({ msg: error.message });
  }

  /*comprueba password viejo*/
  if (await verified(pw_act, user.password)) {
    user.password = pw_new;
    await user.save();
    res.json({ msg: "PASSWORD MODIFIED CORRECTLY" });
  } else {
    const error = new Error("INVALID PASSWORD");
    return res.status(400).json({ msg: error.message });
  }
};

const addFavourite = async (req: Request, res: Response) => {
  const { id } = req.body.user;
  const fav = req.body.id;

  if (!req.body.id) {
    return res.status(400).json({ msg: "PROJECT NOT FOUND" });
  }
  if (req.body.action == "add") {
    try {
      const user = await User.findById(id);
      if (user) {
        user.favourite = [...user.favourite!, fav];
        const userActualizado = await user.save();
        res.json(userActualizado);
      }
    } catch (error) {}
  }
  if (req.body.action == "remove") {
    try {
      const user = await User.findById(id);
      if (user) {
        user.favourite = user.favourite!.filter(function (_id) {
          return _id !== req.body.id;
        });

        const userActualizado = await user.save();
        res.json(userActualizado);
      }
    } catch (error) {}
  }
};

export { addFavourite, register, profile, confirm, autentic, resetPassword, comprobarToken, newPassword, actualizarProfile, actulizarPw };
