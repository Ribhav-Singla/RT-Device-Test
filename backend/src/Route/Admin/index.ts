import express from "express"
import { authRouter } from "./auth"
import { employeeRouter } from "./employee"
import { deviceRouter } from "./device"
import { logRouter } from "./log"

export const adminRouter = express.Router()

adminRouter.use('/auth',authRouter)
adminRouter.use('/employee',employeeRouter)
adminRouter.use('/device',deviceRouter)
adminRouter.use('/log',logRouter)
