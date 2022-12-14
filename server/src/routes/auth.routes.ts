import express from "express";
import { string, z } from "zod";
import jwt from "jsonwebtoken";
import bycrypt from "bcryptjs";
import { prismaClient } from "../database/prisma-client";
import authVerify from "../middlewares/auth_verify";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const refreshTokenSchema = z.object({
  refresh_token: z.string(),
});

export default express
  .Router()
  .post("/login", async (req, res) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.errors);
    }

    const user = await prismaClient.user.findUnique({
      where: {
        email: result.data.email,
      },
    });

    if (!user) {
      return res.status(403).json({
        code: "invalid_credentials",
        message: "Credentials are invalid",
      });
    }

    const validPassword = await bycrypt.compare(
      result.data.password,
      user.password
    );

    if (!validPassword) {
      return res.status(403).json({
        code: "invalid_credentials",
        message: "Credentials are invalid",
      });
    }

    const token = jwt.sign({}, ACCESS_TOKEN_SECRET || "ACCESS_TOKEN_SECRET", {
      subject: user.id,
      expiresIn: "2d",
    });
    const refresh_token = jwt.sign(
      {},
      REFRESH_TOKEN_SECRET || "REFRESH_TOKEN_SECRET",
      { subject: user.id, expiresIn: "1y" }
    );

    res.status(200).json({ token, refresh_token });
  })

  .get("/validate", authVerify, async (req, res) => {
    const user = req.currentUser;

    if (!user) {
      res.status(401).json({ code: "unauthorazed", message: "Access denied" });
      return;
    }

    res.status(200).json({ id: user.id, name: user.name, email: user.email });
  })

  .post("/refresh-token", (req, res) => {
    const result = refreshTokenSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.errors);
    }

    const verified = jwt.verify(
      result.data.refresh_token,
      REFRESH_TOKEN_SECRET || "REFRESH_TOKEN_SECRET"
    );

    if (typeof verified === "string") {
      return res
        .status(401)
        .json({ code: "expire", message: "Exprired token" });
    }

    console.log("user id", verified.sub);

    const token = jwt.sign({}, ACCESS_TOKEN_SECRET || "ACCESS_TOKEN_SECRET", {
      subject: verified.sub,
      expiresIn: "2d",
    });
    const refresh_token = jwt.sign(
      {},
      REFRESH_TOKEN_SECRET || "REFRESH_TOKEN_SECRET",
      { subject: verified.sub, expiresIn: "1y" }
    );

    res.status(200).json({ token, refresh_token });
  });
