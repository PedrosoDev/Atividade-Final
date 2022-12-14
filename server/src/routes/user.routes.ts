import express from "express";
import { z } from "zod";
import bycrypt from "bcryptjs";
import { prismaClient } from "../database/prisma-client";
import authVerify from "../middlewares/auth_verify";

const userSchema = z.object({
  name: z.string().min(3).max(128),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export default express
  .Router()

  .post("/", async (req, res) => {
    const result = userSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.errors);
    }

    const emailExist = await prismaClient.user.findFirst({
      where: {
        email: { equals: result.data.email },
      },
    });

    if (emailExist) {
      return res
        .status(400)
        .json({ code: "invalid_email", message: "Email already exists" });
    }

    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(result.data.password, salt);

    result.data.password = hashedPassword;

    const user = await prismaClient.user.create({
      data: result.data,
      select: {
        id: true,
        name: true,
        email: true,
        classes: true,
      },
    });

    return res.status(201).json(user);
  })

  .post("/class/:code", authVerify, async (req, res) => {
    const user = req.currentUser;

    if (!user) {
      res.status(401).json({ code: "unauthorazed", message: "Access denied" });
      return;
    }

    const code = req.params.code;

    const clazz = await prismaClient.class.findUnique({ where: { code } });

    if (!clazz) {
      res.status(404).json({
        code: "not_found",
        message: "There is no class with this code",
      });
      return;
    }

    await prismaClient.class.update({
      data: {
        users: {
          create: {
            userId: user.id,
            role: "STUDENT",
          },
        },
      },
      where: { code },
    });
  });
