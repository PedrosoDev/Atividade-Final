import express, { response } from "express";
import { map, string, z } from "zod";
import { prismaClient } from "../database/prisma-client";
import bycrypt from "bcryptjs";
import authVerify from "../middlewares/auth_verify";
import { generateRandomCode } from "../utils/utils";

const classSchema = z.object({
  name: z.string().min(5).max(128),
});

export default express
  .Router()

  .post("/", async (req, res) => {
    const result = classSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.errors);
    }

    const user = req.currentUser;
    if (!user) {
      res.status(401).json({ code: "unauthorazed", message: "Access denied" });
      return;
    }

    let code = "";

    do {
      code = generateRandomCode(5);
    } while (await prismaClient.class.findUnique({ where: { code } }));

    let slug = "";

    do {
      slug = generateRandomCode(10);
    } while (await prismaClient.class.findUnique({ where: { slug } }));

    const clazz = await prismaClient.class.create({
      data: {
        name: result.data.name,
        code,
        slug,
      },
    });

    await prismaClient.classOnUsers.create({
      data: {
        userId: user.id,
        classId: clazz.id,
        role: "TEACHER",
      },
    });

    const data = await prismaClient.class.findUnique({
      where: { id: clazz.id },
    });

    res.status(201).json(data);
  })

  .get("/", async (req, res) => {
    const user = req.currentUser;
    if (!user) {
      res.status(401).json({ code: "unauthorazed", message: "Access denied" });
      return;
    }

    const userClasses = await prismaClient.classOnUsers.findMany({
      where: { userId: user.id },
    });

    const classes = await Promise.all(
      userClasses.map(
        async (clazz) =>
          await prismaClient.class.findUnique({
            where: { id: clazz.classId },
            select: {
              id: true,
              code: true,
              slug: true,
              name: true,
              users: {
                select: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                  role: true,
                },
              },
              posts: {
                take: 5,
                select: { id: true, title: true, slug: true },
              },
            },
          })
      )
    );

    const data = classes.map((clazz) => {
      const teacher = clazz?.users.find(
        (classUser) => classUser.role === "TEACHER"
      );

      return { ...clazz, teacherName: teacher?.user.name };
    });

    res.status(200).json(data);
  })

  // .get("/:id", async (req, res) => {
  //   const user = req.currentUser;

  //   if (!user) {
  //     res.status(401).json({ code: "unauthorazed", message: "Access denied" });
  //     return;
  //   }

  //   const id = req.params.id;

  //   const clazz = await prismaClient.class.findUnique({
  //     where: { id },
  //     select: {
  //       id: true,
  //       code: true,
  //       slug: true,
  //       name: true,
  //       users: {
  //         select: {
  //           user: {
  //             select: {
  //               id: true,
  //               name: true,
  //               email: true,
  //             },
  //           },
  //           role: true,
  //         },
  //       },
  //       posts: { select: { title: true, slug: true } },
  //     },
  //   });

  //   if (!clazz) {
  //     res.status(404).json({
  //       code: "not_found",
  //       message: "There is no class with this id",
  //     });
  //     return;
  //   }

  //   const userCanAccess = await prismaClient.classOnUsers.findFirst({
  //     where: {
  //       userId: user.id,
  //       classId: clazz.id,
  //     },
  //   });

  //   if (!userCanAccess) {
  //     res.status(401).json({ code: "unauthorazed", message: "Access denied" });
  //     return;
  //   }

  //   const teacher = clazz.users.find(
  //     (classUser) => classUser.role === "TEACHER"
  //   );

  //   res.status(200).json({ ...clazz, teacherName: teacher?.user.name });
  // })

  .get("/:slug", async (req, res) => {
    const user = req.currentUser;

    if (!user) {
      res.status(401).json({ code: "unauthorazed", message: "Access denied" });
      return;
    }

    const slug = req.params.slug;

    const clazz = await prismaClient.class.findUnique({
      where: { slug },
      select: {
        id: true,
        code: true,
        slug: true,
        name: true,
        users: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            role: true,
          },
        },
        posts: { select: { id: true, title: true, slug: true, content: true } },
      },
    });

    if (!clazz) {
      res.status(404).json({
        code: "not_found",
        message: "There is no class with this id",
      });
      return;
    }

    const userCanAccess = await prismaClient.classOnUsers.findFirst({
      where: {
        userId: user.id,
        classId: clazz.id,
      },
    });

    if (!userCanAccess) {
      res.status(401).json({ code: "unauthorazed", message: "Access denied" });
      return;
    }

    const teacher = clazz.users.find(
      (classUser) => classUser.role === "TEACHER"
    );

    res.status(200).json({ ...clazz, teacherName: teacher?.user.name });
  });
