import { Schema, model } from "mongoose";
import { User } from "../interfaces/user.interface";
import bcryptjs from "bcryptjs";

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  token: {
    type: String,
    default: null,
  },
  confirm: {
    type: Boolean,
    default: false,
  },
  myProjects: {
    type: Array,
  },
  favourite: Array,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

const User = model("user", userSchema);

export default User;
