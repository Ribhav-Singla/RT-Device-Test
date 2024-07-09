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
const Employee_1 = require("../../Models/Employee");
const admin_1 = require("../../Middleware/admin");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.employeeRouter = express_1.default.Router();
exports.employeeRouter.get('/names', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const names = yield Employee_1.Employee.find({}, { name: 1 });
        return res.status(200).json({ names });
    }
    catch (error) {
        console.log('error occured while getting names: ', error);
        return res.status(500).json({
            message: 'error occured while getting names'
        });
    }
}));
exports.employeeRouter.get('/bulk', admin_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.filter || '';
    const page = req.query.page || '';
    const limit = Number(req.query.perPage) || 5;
    const skip = page ? (Number(page) - 1) * limit : 0;
    try {
        const employees = yield Employee_1.Employee.find({
            $or: [
                { name: { $regex: filter, $options: "i" } }
            ],
        }).select('-password').skip(skip).limit(limit).sort({ 'createdAt': -1 });
        const totalEmployee = yield Employee_1.Employee.find({
            $or: [
                { name: { $regex: filter, $options: "i" } }
            ],
        }).countDocuments();
        return res.json({
            totalEmployee: totalEmployee,
            employees: employees
        });
    }
    catch (error) {
        console.log('something went wrong while getting employees in bulk: ', error);
        return res.status(500).json({
            message: 'something went wrong while getting employees in bulk'
        });
    }
}));
exports.employeeRouter.get('/:id', admin_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const employee = yield Employee_1.Employee.findById(id);
        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }
        return res.json({ employee });
    }
    catch (error) {
        console.log('something went wrong while getting employee: ', error);
        return res.status(500).json({
            message: 'something went wrong while getting employee'
        });
    }
}));
exports.employeeRouter.post('/create', admin_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hash = bcryptjs_1.default.hashSync(req.body.password, salt);
        const employee = new Employee_1.Employee({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            image: req.body.image
        });
        yield employee.save();
        return res.status(200).json({
            message: 'Employee Created Successfully',
        });
    }
    catch (error) {
        console.log('error occured while creating employee: ', error);
        //@ts-ignore
        if (error.code == "11000") {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }
        return res.status(500).json({
            message: 'something went wrong!'
        });
    }
}));
exports.employeeRouter.put('/update/:id', admin_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Employee_1.Employee.findByIdAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                image: req.body.image
            }
        });
        return res.status(200).json({
            message: 'Employee Updated Successfully'
        });
    }
    catch (error) {
        console.log('error occured while updating employee: ', error);
        //@ts-ignore
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }
        return res.status(500).json({
            message: 'something went wrong!'
        });
    }
}));
exports.employeeRouter.put('/changePassword/:id', admin_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.employeeRouter.delete('/delete/:id', admin_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Employee_1.Employee.deleteOne({ _id: req.params.id });
        return res.status(200).json({
            message: 'Employee Deleted Successfully'
        });
    }
    catch (error) {
        console.log('error occured while deleting employee: ', error);
        return res.status(500).json({
            message: 'something went wrong!'
        });
    }
}));
