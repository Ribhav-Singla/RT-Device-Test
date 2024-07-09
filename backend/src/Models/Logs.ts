import mongoose, { model } from "mongoose";

const logsSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device'
    },
    loginTime: {
        type: Date,
        default: Date.now
    },
    logoutTime: {
        type: Date,
    },
    status: {
        type: String,
        default : 'Pending'
    }
}, {
    timestamps: true
})

export const Logs = model('Logs', logsSchema)