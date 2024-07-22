import mongoose, { model } from "mongoose";

const deviceSchema = new mongoose.Schema({
    model: {
        type : String,
        required : true
    },
    company:{
        type : String,
        required : true
    },
    image:{
        type : String,
    },
    isBooked :{
        type : Boolean,
        default : false
    },
    bookedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    bookedDate :{
        type : Date
    },
},{timestamps:true})

deviceSchema.pre('save', function(next) {
    if (this.isBooked && !this.bookedDate) {
        this.bookedDate = new Date();
    } else if (!this.isBooked) {
        this.bookedDate = undefined;
    }
    next();
});

export const Device = model('Device',deviceSchema)