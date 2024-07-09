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
exports.employeeRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
exports.employeeRouter = express_1.default.Router();
exports.employeeRouter.get('/bulk', (req, res) => {
    res.send('Employee List');
});
exports.employeeRouter.post('/create', upload.single('avatar'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("success");
    console.log(req.body);
    console.log(req.file);
    // try {
    //     const employee = await Employee.create({
    //         name: req.body.name,
    //         email: req.body.email,
    //         password : req.body.password,
    //         image : req.body.password
    //     })
    //     return res.status(200).json({
    //         message: 'Employee Created Successfully',
    //     })
    // } catch (error) {
    //     console.log('error occured while creating employee: ',error);
    //     return res.status(500).json({
    //         message : "something went wrong!"
    //     })
    // }
}));
