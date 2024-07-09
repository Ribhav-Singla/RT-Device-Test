"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDevices = exports.myDevices = exports.getDevices = void 0;
const socket_io_1 = require("socket.io");
const Device_1 = require("../Models/Device");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Employee_1 = require("../Models/Employee");
const Logs_1 = require("../Models/Logs");
const Controllers_1 = require("../Controllers");
const onlineUsers = {};
function intializeSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    });
    io.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("No token provided"));
        }
        try {
            //@ts-ignore
            const response = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!response) {
                return next(new Error("Invalid token"));
            }
            //@ts-ignore
            onlineUsers[response.id] = socket;
            //@ts-ignore
            socket.userId = response.id;
            //@ts-ignore
            socket.isAdmin = response.isAdmin;
            next();
        }
        catch (error) {
            console.log('error occured while verify socket token: ', error);
            next(new Error("Invalid token"));
        }
    }));
    io.on('connection', (socket) => {
        console.log('new connection', socket.id);
        socket.on('send devices', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const devices = yield Device_1.Device.find({ isBooked: false });
                io.emit('device list', devices);
            }
            catch (error) {
                console.error('Error fetching devices:', error);
            }
        }));
        socket.on('my devices', () => __awaiter(this, void 0, void 0, function* () {
            try {
                //@ts-ignore
                const mydevices = yield Employee_1.Employee.find({ _id: socket.userId }).populate('devices');
                //@ts-ignore
                const mylogs = yield Logs_1.Logs.find({ employee: socket.userId }).populate('device').sort({ createdAt: -1 });
                socket.emit('mydevice list', mydevices, mylogs);
            }
            catch (error) {
                console.error('Error fetching my devices:', error);
            }
        }));
        socket.on('admin-devices', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const devices = yield Device_1.Device.find({ isBooked: true }).populate('bookedBy');
                //@ts-ignore
                if (socket.isAdmin) {
                    socket.emit('admin-device-list', devices);
                }
            }
            catch (error) {
                console.log('Error fetching admin devices: ', error);
            }
        }));
        socket.on('return-devices', (data) => __awaiter(this, void 0, void 0, function* () {
            (0, Controllers_1.returnAllDevice)();
            //@ts-ignore
            if (socket.isAdmin) {
                const response = 'success';
                socket.emit('returned-all', response);
            }
        }));
    });
}
exports.default = intializeSocket;
const getDevices = () => __awaiter(void 0, void 0, void 0, function* () {
    const devices = yield Device_1.Device.find({ isBooked: false });
    Object.entries(onlineUsers).forEach(i => {
        //@ts-ignore
        const socket = i[1];
        socket.emit('device list', devices);
    });
});
exports.getDevices = getDevices;
const myDevices = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const mydevices = yield Employee_1.Employee.find({ _id: userId }).populate('devices');
    const mylogs = yield Logs_1.Logs.find({ employee: userId }).populate('device').sort({ createdAt: -1 });
    Object.entries(onlineUsers).forEach(i => {
        //@ts-ignore
        const socket = i[1];
        if (socket.userId === userId) {
            socket.emit('mydevice list', mydevices, mylogs);
        }
    });
});
exports.myDevices = myDevices;
const getAdminDevices = () => __awaiter(void 0, void 0, void 0, function* () {
    const devices = yield Device_1.Device.find({ isBooked: true }).populate('bookedBy');
    Object.entries(onlineUsers).forEach(i => {
        //@ts-ignore
        const socket = i[1];
        if (socket.isAdmin) {
            socket.emit('admin-device-list', devices);
        }
    });
});
exports.getAdminDevices = getAdminDevices;
