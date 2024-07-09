import express from 'express'
import { Logs } from '../Models/Logs'

export const logRouter = express.Router()

logRouter.get('/bulk', async (req, res) => {
    let filterEmployees = req.query.filterEmployees || []
    let filterDevices = req.query.filterDevices || []
    const filterDate = req.query.filterDate || '' 

    // Convert filter parameters to arrays if they are not already
    if (typeof filterEmployees === 'string') {
        filterEmployees = filterEmployees.split(',')
    }
    if (typeof filterDevices === 'string') {
        filterDevices = filterDevices.split(',')
    }

    const page = req.query.page || 1
    const limit = Number(req.query.perPage) || 5
    const skip = (Number(page) - 1) * limit

    // Create the filter object conditionally
    const filter = {}
    //@ts-ignore
    if (filterEmployees.length > 0) {
        //@ts-ignore
        filter.employee = { $in: filterEmployees }
    }
    //@ts-ignore
    if (filterDevices.length > 0) {
        //@ts-ignore
        filter.device = { $in: filterDevices }
    }
    if (filterDate) {
        //@ts-ignore
        const startDate = new Date(filterDate)
        startDate.setHours(0, 0, 0, 0) // Start of the day
        const endDate = new Date(startDate)
        endDate.setHours(23, 59, 59, 999) // End of the day
        //@ts-ignore
        filter.createdAt = {
            $gte: startDate,
            $lt: endDate
        }
    }

    try {
        const logs = await Logs.find(filter)
            .populate('employee')
            .populate('device')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })

        const totalLogs = await Logs.countDocuments(filter)

        return res.json({
            totalLogs: totalLogs,
            logs: logs,
        })
    } catch (error) {
        console.log('error occurred while getting the logs: ', error)
        return res.status(500).json({
            message: 'Error occurred while getting the logs',
        })
    }
})
