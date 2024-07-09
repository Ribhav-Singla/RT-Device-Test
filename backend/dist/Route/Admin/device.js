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
exports.deviceRouter = void 0;
const express_1 = __importDefault(require("express"));
const Device_1 = require("../../Models/Device");
const admin_1 = require("../../Middleware/admin");
exports.deviceRouter = express_1.default.Router();
exports.deviceRouter.get('/models', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const models = yield Device_1.Device.find({}, { model: 1 });
        return res.status(200).json({ models });
    }
    catch (error) {
        console.log('error occured while getting models: ', error);
        return res.status(500).json({
            message: 'error occured while getting models'
        });
    }
}));
exports.deviceRouter.get("/bulk", admin_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.filter || '';
    const page = req.query.page || '';
    const limit = Number(req.query.perPage) || 5;
    const skip = page ? (Number(page) - 1) * limit : 0;
    try {
        const devices = yield Device_1.Device.find({
            $or: [
                { model: { $regex: filter, $options: "i" } },
                {
                    company: { $regex: filter, $options: "i" },
                },
            ],
        })
            .skip(skip)
            .limit(limit)
            .sort({ 'createdAt': -1 });
        const totalDevices = yield Device_1.Device.find({
            $or: [
                { model: { $regex: filter, $options: "i" } },
                {
                    company: { $regex: filter, $options: "i" },
                },
            ],
        }).countDocuments();
        return res.json({
            totalDevices: totalDevices,
            devices: devices,
        });
    }
    catch (error) {
        console.log("something went wrong while getting devices in bulk: ", error);
        return res.status(500).json({
            message: "something went wrong while getting devices in bulk",
        });
    }
}));
exports.deviceRouter.get("/:id", admin_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const device = yield Device_1.Device.findById(id);
        if (!device) {
            return res.status(404).json({
                message: "Device not found",
            });
        }
        return res.json({ device });
    }
    catch (error) {
        console.log("something went wrong while getting device: ", error);
        return res.status(500).json({
            message: "something went wrong while getting device",
        });
    }
}));
exports.deviceRouter.post("/create", admin_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const device = new Device_1.Device({
            model: req.body.model,
            company: req.body.company,
            image: req.body.image
        });
        yield device.save();
        return res.status(200).json({
            message: "Device Created Successfully",
        });
    }
    catch (error) {
        console.log("error occured while creating device: ", error);
        return res.status(500).json({
            message: "something went wrong!",
        });
    }
}));
exports.deviceRouter.put("/update/:id", admin_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Device_1.Device.findByIdAndUpdate({
            _id: req.params.id,
        }, {
            $set: {
                model: req.body.model,
                company: req.body.company,
                image: req.body.image
            },
        });
        return res.status(200).json({
            message: "Device Updated Successfully",
        });
    }
    catch (error) {
        console.log("error occured while updating employee: ", error);
        return res.status(500).json({
            message: "something went wrong!",
        });
    }
}));
exports.deviceRouter.delete("/delete/:id", admin_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Device_1.Device.deleteOne({ _id: req.params.id });
        return res.status(200).json({
            message: "Device Deleted Successfully",
        });
    }
    catch (error) {
        console.log("error occured while deleting device: ", error);
        return res.status(500).json({
            message: "something went wrong!",
        });
    }
}));
