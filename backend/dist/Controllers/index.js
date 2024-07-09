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
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnAllDevice = void 0;
const Device_1 = require("../Models/Device");
const Employee_1 = require("../Models/Employee");
const Logs_1 = require("../Models/Logs");
const socket_1 = require("../Route/socket");
//@ts-ignore
const returnAllDevice = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield Employee_1.Employee.find({});
        yield Employee_1.Employee.updateMany({}, { $set: { devices: [] } });
        const devices = yield Device_1.Device.find({ isBooked: true });
        yield Device_1.Device.updateMany({}, {
            $set: {
                isBooked: false,
                bookedBy: null,
                bookedDate: undefined,
            }
        });
        for (const device of devices) {
            const log = new Logs_1.Logs({
                //@ts-ignore
                employee: device.bookedBy._id,
                device: device._id,
                loginTime: device.bookedDate,
                logoutTime: new Date()
            });
            yield log.save();
        }
        yield (0, socket_1.getDevices)();
        yield (0, socket_1.getAdminDevices)();
        user.forEach(obj => {
            //@ts-ignore
            (0, socket_1.myDevices)((obj._id).toString());
        });
        return 1;
    }
    catch (error) {
        console.log('error occured while returning a device: ', error);
        return -1;
    }
});
exports.returnAllDevice = returnAllDevice;
