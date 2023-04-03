import jwt from "jsonwebtoken";
import User from "../models/user";
import { Response, NextFunction, Request } from "express";

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      const userFind = await User.findById(decoded.id).select("-password -token -confirm");
      if (userFind) {
        req.body.user = userFind;
        return next();
      }
    } catch (error) {
      const e = new Error("TOKEN NO VALIDO");
      res.status(403).json({ msg: e.message });
    }
  }
  if (!token) {
    const error = new Error("TOKEN NO VALIDO  O INEXISTENTE");
    res.status(403).json({ msg: error.message });
  }

  next();
};

export default checkAuth;
