import express from "express";
import authVerify from "../middlewares/auth_verify";
import authRoutes from "./auth.routes";
import classRoutes from "./class.routes";
import helloRoutes from "./hello.routes";
import userRoutes from "./user.routes";

export default express
  .Router()

  .use("/hello", helloRoutes)
  .use("/user", userRoutes)
  .use("/class", authVerify, classRoutes)
  .use("/auth", authRoutes);
