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
const Logs_1 = require("../../Models/Logs");
const admin_1 = require("../../Middleware/admin");
exports.logRouter = express_1.default.Router();
exports.logRouter.put('/updateStatus/:id', admin_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const logId = req.params.id;
    try {
        //@ts-ignore
        const log = yield Logs_1.Logs.findById(logId);
        //@ts-ignore
        log.status = req.body.status;
        //@ts-ignore
        yield log.save();
        res.status(200).json({ message: "Log status updated successfully" });
    }
    catch (error) {
        console.log('error occured while updating log status: ', error);
        res.status(500).json({ message: "Error updating log status" });
    }
}));
