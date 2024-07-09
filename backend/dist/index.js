"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const Admin_1 = require("./Route/Admin");
const cors_1 = __importDefault(require("cors"));
const User_1 = require("./Route/User");
const upload_1 = require("./Route/upload");
const http_1 = require("http");
const socket_1 = __importDefault(require("./Route/socket"));
const logs_1 = require("./Route/logs");
mongoose_1.default.connect('mongodb://127.0.0.1:27017/deviceWebsite')
    .then(() => console.log('db connected'))
    .catch((error) => console.log('error while connecting to db: ', error));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
(0, socket_1.default)(server);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('uploads/'));
app.use('/api/v1/admin', Admin_1.adminRouter);
app.use('/api/v1/user', User_1.userRouter);
app.use('/api/v1/', upload_1.imageRouter);
app.use('/api/v1/log/', logs_1.logRouter);
server.listen(3000, () => {
    console.log('server started');
});
