import express from 'express'
import helloRoutes from './hello.routes'

export default express.Router()

.use("/hello", helloRoutes)