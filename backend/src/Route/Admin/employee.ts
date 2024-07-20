import express from 'express'
import { Employee } from '../../Models/Employee'
import { adminAuth } from '../../Middleware/admin'
import bcrypt from 'bcryptjs'
import { adminEmployeeSchema, adminEmployeeUpdateSchema, userPasswordSchema } from '../../zod'

export const employeeRouter = express.Router()

employeeRouter.get('/names',async(req,res)=>{
    try {
        const names = await Employee.find({},{name:1})
        return res.status(200).json({ names })
    } catch (error) {
        console.log('error occured while getting names: ',error);
        return res.status(500).json({
            message: 'error occured while getting names'
        })
    }
})

employeeRouter.get('/bulk', adminAuth, async (req, res) => {
    const filter = req.query.filter || ''
    const page = req.query.page || ''
    const limit = Number(req.query.perPage) || 5
    const skip = page ? (Number(page) - 1) * limit : 0

    try {
        const employees = await Employee.find({
            $or: [
                { name: { $regex: filter, $options: "i" } }
            ],
        }).select('-password').skip(skip).limit(limit).sort({ 'createdAt': -1 })
        const totalEmployee = await Employee.find({
            $or: [
                { name: { $regex: filter, $options: "i" } }
            ],
        }).countDocuments()
        return res.json({
            totalEmployee: totalEmployee,
            employees: employees
        })
    } catch (error) {
        console.log('something went wrong while getting employees in bulk: ', error);
        return res.status(500).json({
            message: 'something went wrong while getting employees in bulk'
        })
    }
})

employeeRouter.get('/:id', adminAuth, async (req, res) => {
    const id = req.params.id

    try {
        const employee = await Employee.findById(id)
        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found'
            })
        }
        return res.json({ employee })
    } catch (error) {
        console.log('something went wrong while getting employee: ', error);
        return res.status(500).json({
            message: 'something went wrong while getting employee'
        })
    }
})

employeeRouter.post('/create', adminAuth, async (req, res) => {

    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const image = req.body.image
    const {success,error} = adminEmployeeSchema.safeParse({name,email,password,image})
    if(error){
        console.log('error occured while parsing admin employee schema: ',error);
        return res.status(400).json({error:'Invalid Inputs'})
    }
    
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password.trim(), salt);
        const employee = new Employee({
            name: req.body.name.trim(),
            email: req.body.email,
            password: hash,
            image: req.body.image
        })
        await employee.save()

        return res.status(200).json({
            message: 'Employee Created Successfully',
        })

    } catch (error) {
        console.log('error occured while creating employee: ', error);
        //@ts-ignore
        if (error.code == "11000") {
            return res.status(400).json({
                message: 'Email already exists'
            })
        }
        return res.status(500).json({
            message: 'something went wrong!'
        })
    }
})

employeeRouter.put('/update/:id', adminAuth, async (req, res) => {

    const name = req.body.name
    const email = req.body.email
    const image = req.body.image
    const {success,error} = adminEmployeeUpdateSchema.safeParse({name,email,image})
    if(error){
        console.log('error occured while parsing admin employee update schema: ',error);
        return res.status(400).json({error:'Invalid Inputs'})
    }

    try {
        await Employee.findByIdAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                image: req.body.image
            }
        })

        return res.status(200).json({
            message: 'Employee Updated Successfully'
        })

    } catch (error) {
        console.log('error occured while updating employee: ', error);
        //@ts-ignore
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Email already exists'
            })
        }
        return res.status(500).json({
            message: 'something went wrong!'
        })
    }
})

employeeRouter.put('/changePassword/:id', adminAuth, async (req, res) => {

    const oldPassword = req.body.oldPassword
    const password = req.body.password
    const {success,error} = userPasswordSchema.safeParse({oldPassword,password})
    if(error){
        console.log('error occured while parsing admin user password schema: ',error);
        return res.status(400).json({error:'Invalid Inputs'})
    }

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

employeeRouter.delete('/delete/:id', adminAuth, async (req, res) => {
    try {
        await Employee.deleteOne({ _id: req.params.id })
        return res.status(200).json({
            message: 'Employee Deleted Successfully'
        })
    } catch (error) {
        console.log('error occured while deleting employee: ', error);
        return res.status(500).json({
            message: 'something went wrong!'
        })
    }
})

