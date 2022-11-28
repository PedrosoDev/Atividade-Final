import express from "express"
export default express.Router()
.get("/", (req, res) => {
    return res.json({
        message: "Hello World!"
    })
})