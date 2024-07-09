import express from 'express'
import { Device } from '../../Models/Device';
import { Employee } from '../../Models/Employee';
import { Logs } from '../../Models/Logs';
import jwt from 'jsonwebtoken'
import { userAuth } from '../../Middleware/user';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { getAdminDevices, getDevices, myDevices } from '../socket';

export const userRouter = express.Router()

userRouter.get('/me', userAuth, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.userId
        const user = await Employee.findById(userId).select({ password: 0 })
        if (!user) {
            return res.status(400).json({ error: "User not found." })
        }
        res.status(200).json(user)
    } catch (error) {
        console.log('error occured in user me: ', error);
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})

userRouter.post('/signin', async (req, res) => {
    const id = req.body.id
    const password = req.body.password

    try {
        const user = await Employee.findById(id)

        if (!user) {
            return res.status(400).json({
                message: "user not found!"
            })
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({
                message: "password is incorrect!"
            })
        }

        //@ts-ignore
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.status(200).json({
            token: token
        })

    } catch (error) {
        console.log('error while user signing up: ', error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

userRouter.get('/users', async (req, res) => {
    const filter = req.query.filter || ''
    try {
        const users = await Employee.find({
            $or: [
                { name: { $regex: filter, $options: "i" } }
            ],
        }).select('-password')
        return res.json({
            users: users
        })
    } catch (error) {
        console.log('something went wrong while getting users in bulk: ', error);
        return res.status(500).json({
            message: 'something went wrong while getting users in bulk'
        })
    }
})

userRouter.get('/myDevices', userAuth, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.userId
        console.log('userId in route: ', userId);

        const myDevices = await Employee.find({ _id: userId }).populate('devices')
        return res.status(200).json({
            myDevices
        })

    } catch (error) {
        console.log('error occured while my devices: ', error);
        return res.status(500).json({
            message: 'something went wrong while getting my devices'
        })
    }
})

userRouter.post('/bookDevice/:id', userAuth, async (req, res) => {
    const deviceId = req.params.id
    //@ts-ignore
    const userId = req.userId
    try {
        const device = await Device.findById(deviceId)
        if (!device) {
            return res.status(404).json({
                message: "Device not found"
            })
        }
        if (device.isBooked) {
            return res.status(400).json({
                message: "Device is already booked"
            })
        }
        device.isBooked = true
        device.bookedBy = userId
        await device.save()

        const user = await Employee.findById(userId)
        if (user) {
            user.devices.push(device._id)
            await user.save()

            const log = new Logs({
                employee: user._id,
                device: device._id,
            })
            await log.save()
            await getDevices();
            await getAdminDevices()
            return res.status(200).json({
                message: "Device booked successfully"
            })
        }
        else {
            return res.status(404).json({
                message: "User not found"
            })
        }
    } catch (error) {
        console.log('error occured while booking a device: ', error);
        return res.status(500).json({
            message: 'error occured while booking a device'
        })
    }
})

userRouter.post('/returnDevice/:id', userAuth, async (req, res) => {
    const deviceId = req.params.id

    //@ts-ignore
    const userId = req.userId

    try {

        const device = await Device.findById(deviceId)
        if (!device) {
            return res.status(404).json({
                message: "Device not found"
            })
        }
        if (!device.isBooked) {
            return res.status(400).json({
                message: "Device is not booked"
            })
        }
        device.isBooked = false
        device.bookedBy = null
        const bookedDate = device.bookedDate
        await device.save()

        const user = await Employee.findById(userId)
        if (user) {
            //@ts-ignore
            user.devices = user.devices.filter((id) => id != deviceId)
            await user.save()
            const log = new Logs({
                employee: user._id,
                device: device._id,
                loginTime: bookedDate,
                logoutTime: new Date()
            })
            await log.save();
            await getDevices();
            await myDevices(userId);
            await getAdminDevices()
            return res.status(200).json({
                message: "Device returned successfully"
            })
        }
        else {
            return res.status(404).json({
                message: "User not found"
            })
        }
    } catch (error) {
        console.log('error occured while returning a device: ', error);
        return res.status(500).json({
            message: 'error occured while returning a device'
        })
    }
})

userRouter.put('/updateProfile/:id', userAuth, async (req, res) => {
    try {
        await Employee.findByIdAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                name: req.body.name,
                image: req.body.image
            }
        })
        return res.status(200).json({
            message: "Profile updated successfully"
        })
    } catch (error) {
        console.log('error occured while updating profile: ', error);
        return res.status(500).json({
            message: 'error occured while updating profile'
        })
    }
})

userRouter.put('/changePassword/:id', userAuth, async (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    try {
        if (req.body.oldPassword) {
            const employee = await Employee.findById(req.params.id)
            const employeeHash = employee?.password as string
            if (!bcrypt.compareSync(req.body.oldPassword, employeeHash)) {
                return res.status(400).json({
                    message: 'Old password is incorrect'
                })
            }
        }
        
        const hash = bcrypt.hashSync(req.body.password, salt)
        await Employee.findByIdAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                password: hash
            }
        })

        return res.status(200).json({
            message: 'Password Changed Successfully'
        })

    } catch (error) {
        console.log('error occured while changing password: ', error);
        return res.status(500).json({
            message: 'something went wrong!'
        })
    }
})
