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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const Device_1 = require("../../Models/Device");
const Employee_1 = require("../../Models/Employee");
const Logs_1 = require("../../Models/Logs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../../Middleware/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const socket_1 = require("../socket");
exports.userRouter = express_1.default.Router();
exports.userRouter.get('/me', user_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const userId = req.userId;
        const user = yield Employee_1.Employee.findById(userId).select({ password: 0 });
        if (!user) {
            return res.status(400).json({ error: "User not found." });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.log('error occured in user me: ', error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}));
exports.userRouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    const password = req.body.password;
    try {
        const user = yield Employee_1.Employee.findById(id);
        if (!user) {
            return res.status(400).json({
                message: "user not found!"
            });
        }
        if (!bcryptjs_1.default.compareSync(password, user.password)) {
            return res.status(400).json({
                message: "password is incorrect!"
            });
        }
        //@ts-ignore
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({
            token: token
        });
    }
    catch (error) {
        console.log('error while user signing up: ', error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}));
exports.userRouter.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.filter || '';
    try {
        const users = yield Employee_1.Employee.find({
            $or: [
                { name: { $regex: filter, $options: "i" } }
            ],
        }).select('-password');
        return res.json({
            users: users
        });
    }
    catch (error) {
        console.log('something went wrong while getting users in bulk: ', error);
        return res.status(500).json({
            message: 'something went wrong while getting users in bulk'
        });
    }
}));
exports.userRouter.get('/myDevices', user_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const userId = req.userId;
        console.log('userId in route: ', userId);
        const myDevices = yield Employee_1.Employee.find({ _id: userId }).populate('devices');
        return res.status(200).json({
            myDevices
        });
    }
    catch (error) {
        console.log('error occured while my devices: ', error);
        return res.status(500).json({
            message: 'something went wrong while getting my devices'
        });
    }
}));
exports.userRouter.post('/bookDevice/:id', user_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceId = req.params.id;
    //@ts-ignore
    const userId = req.userId;
    try {
        const device = yield Device_1.Device.findById(deviceId);
        if (!device) {
            return res.status(404).json({
                message: "Device not found"
            });
        }
        if (device.isBooked) {
            return res.status(400).json({
                message: "Device is already booked"
            });
        }
        device.isBooked = true;
        device.bookedBy = userId;
        device.bookedDate = new Date();
        yield device.save();
        const user = yield Employee_1.Employee.findById(userId);
        if (user) {
            user.devices.push(device._id);
            yield user.save();
            const log = new Logs_1.Logs({
                employee: user._id,
                device: device._id,
            });
            yield log.save();
            yield (0, socket_1.getDevices)();
            yield (0, socket_1.getAdminDevices)();
            return res.status(200).json({
                message: "Device booked successfully"
            });
        }
        else {
            return res.status(404).json({
                message: "User not found"
            });
        }
    }
    catch (error) {
        console.log('error occured while booking a device: ', error);
        return res.status(500).json({
            message: 'error occured while booking a device'
        });
    }
}));
exports.userRouter.post('/returnDevice/:id', user_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceId = req.params.id;
    //@ts-ignore
    const userId = req.userId;
    try {
        const device = yield Device_1.Device.findById(deviceId);
        if (!device) {
            return res.status(404).json({
                message: "Device not found"
            });
        }
        if (!device.isBooked) {
            return res.status(400).json({
                message: "Device is not booked"
            });
        }
        device.isBooked = false;
        device.bookedBy = null;
        const bookedDate = device.bookedDate;
        yield device.save();
        const user = yield Employee_1.Employee.findById(userId);
        if (user) {
            //@ts-ignore
            user.devices = user.devices.filter((id) => id != deviceId);
            yield user.save();
            const log = new Logs_1.Logs({
                employee: user._id,
                device: device._id,
                loginTime: bookedDate,
                logoutTime: new Date()
            });
            yield log.save();
            yield (0, socket_1.getDevices)();
            yield (0, socket_1.myDevices)(userId);
            yield (0, socket_1.getAdminDevices)();
            return res.status(200).json({
                message: "Device returned successfully"
            });
        }
        else {
            return res.status(404).json({
                message: "User not found"
            });
        }
    }
    catch (error) {
        console.log('error occured while returning a device: ', error);
        return res.status(500).json({
            message: 'error occured while returning a device'
        });
    }
}));
exports.userRouter.put('/updateProfile/:id', user_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Employee_1.Employee.findByIdAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                name: req.body.name,
                image: req.body.image
            }
        });
        return res.status(200).json({
            message: "Profile updated successfully"
        });
    }
    catch (error) {
        console.log('error occured while updating profile: ', error);
        return res.status(500).json({
            message: 'error occured while updating profile'
        });
    }
}));
exports.userRouter.put('/changePassword/:id', user_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = bcryptjs_1.default.genSaltSync(10);
    try {
        if (req.body.oldPassword) {
            const employee = yield Employee_1.Employee.findById(req.params.id);
            const employeeHash = employee === null || employee === void 0 ? void 0 : employee.password;
            if (!bcryptjs_1.default.compareSync(req.body.oldPassword, employeeHash)) {
                return res.status(400).json({
                    message: 'Old password is incorrect'
                });
            }
        }
        const hash = bcryptjs_1.default.hashSync(req.body.password, salt);
        yield Employee_1.Employee.findByIdAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                password: hash
            }
        });
        return res.status(200).json({
            message: 'Password Changed Successfully'
        });
    }
    catch (error) {
        console.log('error occured while changing password: ', error);
        return res.status(500).json({
            message: 'something went wrong!'
        });
    }
}));
