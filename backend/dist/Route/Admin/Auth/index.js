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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const Admin_1 = require("../../../Models/Admin");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.authRouter = express_1.default.Router();
exports.authRouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield Admin_1.Admin.findOne({
            email: req.body.email,
            password: req.body.password
        });
        if (!admin) {
            return res.status(400).json({
                message: "Admin not found!"
            });
        }
        //@ts-ignore
        const token = jsonwebtoken_1.default.sign({ id: admin._id }, process.env.JWT_SECRET);
        res.status(200).json({
            token: token
        });
    }
    catch (error) {
        console.log('error while admin signing up: ', error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}));
