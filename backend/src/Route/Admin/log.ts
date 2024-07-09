import express from 'express'
import { Logs } from '../../Models/Logs'
import { adminAuth } from '../../Middleware/admin';

export const logRouter = express.Router()

logRouter.put('/updateStatus/:id',adminAuth,async(req,res)=>{
    
    const logId = req.params.id
    try {
        //@ts-ignore
        const log = await Logs.findById(logId)
        //@ts-ignore
        log.status = req.body.status
        //@ts-ignore
        await log.save()
        res.status(200).json({message:"Log status updated successfully"})
    } catch (error) {
        console.log('error occured while updating log status: ',error);
        res.status(500).json({message:"Error updating log status"})
    }
})