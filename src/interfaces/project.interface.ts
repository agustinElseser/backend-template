import { Schema } from "mongoose";
import { User } from "./user.interface";

export interface Project {
  id: Number;
  _id: string;
  name: String;
  arquitect: String;
  area: Number;
  site: String;
  year: Number;
  user: User;
  projectImg: [];
}
