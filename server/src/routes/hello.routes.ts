import express from "express";

export default express.Router().get("/", async (req, res) => {
  return res.json({
    message: "Hello World!",
  });
});
