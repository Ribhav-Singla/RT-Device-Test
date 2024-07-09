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

mongoose.connect('mongodb://127.0.0.1:27017/deviceWebsite')
    .then(() => console.log('db connected'))
    .catch((error) => console.log('error while connecting to db: ', error))

const app = express()
const server = createServer(app)
intializeSocket(server)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('uploads/'))

app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/', imageRouter)
app.use('/api/v1/log/', logRouter)

server.listen(3000, () => {
    console.log('server started');
})