import { Schema, model } from "mongoose";
import { Project } from "../interfaces/project.interface";

const projectSchema = new Schema<Project>(
  {
    id: {
      type: Number,
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    arquitect: {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: Number,
      required: true,
    },
    site: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    projectImg: {
      type: [],
    },
  },
  {
    timestamps: true,
  }
);

const Proyect = model("project", projectSchema);

export default Proyect;
