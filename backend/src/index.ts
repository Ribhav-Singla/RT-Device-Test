import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import { adminRouter } from './Route/Admin'
import cors from 'cors'
import { userRouter } from './Route/User'
import { imageRouter } from './Route/upload'
import { createServer } from 'http'
import intializeSocket from './Route/socket'
import { logRouter } from './Route/logs'

mongoose.connect('mongodb://root:esfera%402023@38.242.136.129:27017/device?authSource=admin')
    .then(() => console.log('db connected'))
    .catch((error) => console.log('error while connecting to db: ', error))

const PORT = process.env.PORT || 3000
const app = express()
app.use(cors())
const server = createServer(app)
intializeSocket(server)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('uploads/'))

app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/', imageRouter)
app.use('/api/v1/log/', logRouter)

server.listen(PORT, () => {
    console.log('server started');
})