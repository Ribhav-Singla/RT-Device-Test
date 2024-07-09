import mongoose from 'mongoose'
import { date } from 'zod'
const Schema = mongoose.Schema

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type : String,
        unique : true,
        required : true,
    },
    password: {
        type: String,
        required: true
    },
    image : {
        type : String
    },
    createdAt:{
        type : Date,
        default : Date.now()
    },
    devices:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Device'
        }
    ]
})

export const Employee = mongoose.model('Employee',employeeSchema)