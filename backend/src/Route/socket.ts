import { Server,Socket  } from "socket.io";
import { Device } from "../Models/Device";
import jwt from 'jsonwebtoken'
import { Employee } from "../Models/Employee";
import { Logs } from "../Models/Logs";
import { returnAllDevice } from "../Controllers";
import { Server as HttpServer } from 'http'

const onlineUsers = {};

interface CustomSocket extends Socket {
    userId?: string;
    isAdmin?: boolean;
}

export default function intializeSocket(server:HttpServer ) {
    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    })

    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token
        if (!token) {
            return next(new Error("No token provided"))
        }        

        try {
            //@ts-ignore
            const response = jwt.verify(token, process.env.JWT_SECRET as string)
            if (!response) {
                return next(new Error("Invalid token"))
            }
            //@ts-ignore
            onlineUsers[response.id] = socket;
            //@ts-ignore
            socket.userId = response.id
            //@ts-ignore
            socket.isAdmin = response.isAdmin
            next()

        } catch (error) {
            console.log('error occured while verify socket token: ', error);
            next(new Error("Invalid token"));
        }
    })

    io.on('connection', (socket) => {
        console.log('new connection', socket.id);
        socket.on('send devices', async () => {
            try {
                const devices = await Device.find({ isBooked: false })
                io.emit('device list', devices)
            } catch (error) {
                console.error('Error fetching devices:', error)
            }
        })

        socket.on('my devices', async () => {
            try {
                //@ts-ignore
                const mydevices = await Employee.find({ _id: socket.userId }).populate('devices')
                //@ts-ignore
                const mylogs = await Logs.find({ employee: socket.userId }).populate('device').sort({ createdAt: -1 })
                socket.emit('mydevice list', mydevices, mylogs)
            } catch (error) {
                console.error('Error fetching my devices:', error)
            }
        })

        socket.on('admin-devices', async () => {
            try {
                const devices = await Device.find({ isBooked: true }).populate('bookedBy')
                //@ts-ignore
                if(socket.isAdmin){
                    socket.emit('admin-device-list', devices)
                }
            } catch (error) {
                console.log('Error fetching admin devices: ', error);
            }
        })

        socket.on('return-devices',async(data)=>{
            returnAllDevice()
            //@ts-ignore
            if(socket.isAdmin){
                const response = 'success'
                socket.emit('returned-all',response)
            }
        })
    })
}

export const getDevices = async () => {
    const devices = await Device.find({ isBooked: false })
    Object.entries(onlineUsers).forEach(i => {
        //@ts-ignore
        const socket: CustomSocket = i[1];
        socket.emit('device list', devices);
    })
}

export const myDevices = async (userId: string) => {
    const mydevices = await Employee.find({ _id: userId }).populate('devices')
    const mylogs = await Logs.find({ employee: userId }).populate('device').sort({ createdAt: -1 })
    Object.entries(onlineUsers).forEach(i => {
        //@ts-ignore
        const socket: CustomSocket = i[1];
        if (socket.userId === userId) {
            socket.emit('mydevice list', mydevices, mylogs)
        }
    })
}

export const getAdminDevices = async () => {
    const devices = await Device.find({ isBooked: true }).populate('bookedBy')
    Object.entries(onlineUsers).forEach(i => {
        //@ts-ignore
        const socket: CustomSocket = i[1];
        if (socket.isAdmin) {
            socket.emit('admin-device-list', devices)
        }
    })

}