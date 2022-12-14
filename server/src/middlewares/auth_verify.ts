import { verify } from "crypto";
import { NextFunction, Request, response, Response } from "express";
import jwt from "jsonwebtoken";
import { prismaClient } from "../database/prisma-client";

const { ACCESS_TOKEN_SECRET } = process.env;

export default async function authVerify(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ code: "unauthorazed", message: "Access denied" });
  }

  try {
    const verified = jwt.verify(
      token.split(" ")[1],
      ACCESS_TOKEN_SECRET || "ACCESS_TOKEN_SECRET"
    );

    if (typeof verified === "string") {
      return res
        .status(401)
        .json({ code: "unauthorazed", message: "Access denied" });
    }

    const user = await prismaClient.user.findUniqueOrThrow({
      where: { id: verified.sub },
    });

    req.currentUser = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ code: "unauthorazed", message: "Access denied" });
  }
}
