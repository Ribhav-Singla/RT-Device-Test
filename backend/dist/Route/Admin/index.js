"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("./auth");
const employee_1 = require("./employee");
const device_1 = require("./device");
const log_1 = require("./log");
exports.adminRouter = express_1.default.Router();
exports.adminRouter.use('/auth', auth_1.authRouter);
exports.adminRouter.use('/employee', employee_1.employeeRouter);
exports.adminRouter.use('/device', device_1.deviceRouter);
exports.adminRouter.use('/log', log_1.logRouter);
