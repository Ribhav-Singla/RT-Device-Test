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

mongoose.connect('mongodb+srv://ribhavsingla:65fRLQQa1jKtstQr@cluster0.fb6ouk3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('db connected'))
    .catch((error) => console.log('error while connecting to db: ', error))

const PORT = process.env.PORT || 3000
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

server.listen(PORT, () => {
    console.log('server started');
})