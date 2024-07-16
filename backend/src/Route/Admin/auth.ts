import express from "express"
import { Admin } from "../../Models/Admin"
import jwt from 'jsonwebtoken'
import { Employee } from "../../Models/Employee"
import { adminAuth } from "../../Middleware/admin"

export const authRouter = express.Router()

authRouter.get('/me',adminAuth,async(req,res)=>{
    try {
        return res.status(200).json({
            message:"success"
        })        
    } catch (error) {
        console.log('error occured in admin me: ',error);
        return res.status(500).json({
            message:'Internal Server Error'
        })
    }
})

authRouter.post('/signin', async (req, res) => {
    try {
        const admin = await Admin.findOne({
            email: req.body.email,
            password: req.body.password
        })

        if (!admin) {
            return res.status(400).json({
                message: "Admin not found!"
            })
        }

        //@ts-ignore
        const token = jwt.sign({ id: admin._id, isAdmin: true }, process.env.JWT_SECRET)
        res.status(200).json({
            token: token
        })

    } catch (error) {
        console.log('error while admin signing up: ', error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

authRouter.post('/userLogin/:id',adminAuth,async(req,res)=>{
    const userId = req.params.id
    try {
        const user = await Employee.findById(userId)
        //@ts-ignore
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.status(200).json({
            token: token
        })

    } catch (error) {
        console.log('error while admin userLogin: ', error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})