import { Auth } from "./auth.interface";
import { Project } from "./project.interface";

export interface User extends Auth {
  name: string;
  id: string;
  _id: string;
  token: string | null;
  confirm: boolean;
  myProjects?: any[];
  favourite?: any[];
}
