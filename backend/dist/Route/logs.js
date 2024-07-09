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
exports.logRouter = void 0;
const express_1 = __importDefault(require("express"));
const Logs_1 = require("../Models/Logs");
exports.logRouter = express_1.default.Router();
exports.logRouter.get('/bulk', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filterEmployees = req.query.filterEmployees || [];
    let filterDevices = req.query.filterDevices || [];
    const filterDate = req.query.filterDate || '';
    // Convert filter parameters to arrays if they are not already
    if (typeof filterEmployees === 'string') {
        filterEmployees = filterEmployees.split(',');
    }
    if (typeof filterDevices === 'string') {
        filterDevices = filterDevices.split(',');
    }
    const page = req.query.page || 1;
    const limit = Number(req.query.perPage) || 5;
    const skip = (Number(page) - 1) * limit;
    // Create the filter object conditionally
    const filter = {};
    //@ts-ignore
    if (filterEmployees.length > 0) {
        //@ts-ignore
        filter.employee = { $in: filterEmployees };
    }
    //@ts-ignore
    if (filterDevices.length > 0) {
        //@ts-ignore
        filter.device = { $in: filterDevices };
    }
    if (filterDate) {
        //@ts-ignore
        const startDate = new Date(filterDate);
        startDate.setHours(0, 0, 0, 0); // Start of the day
        const endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999); // End of the day
        //@ts-ignore
        filter.createdAt = {
            $gte: startDate,
            $lt: endDate
        };
    }
    try {
        const logs = yield Logs_1.Logs.find(filter)
            .populate('employee')
            .populate('device')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const totalLogs = yield Logs_1.Logs.countDocuments(filter);
        return res.json({
            totalLogs: totalLogs,
            logs: logs,
        });
    }
    catch (error) {
        console.log('error occurred while getting the logs: ', error);
        return res.status(500).json({
            message: 'Error occurred while getting the logs',
        });
    }
}));
