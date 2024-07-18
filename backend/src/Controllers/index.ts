import { Device } from "../Models/Device"
import { Employee } from "../Models/Employee";
import { Logs } from "../Models/Logs";
import { getAdminDevices, getDevices, myDevices } from '../Route/socket';

//@ts-ignore
export const returnAllDevice = async () => {
    try {
        const user = await Employee.find({})
        await Employee.updateMany({}, { $set: { devices: [] } })

        const devices = await Device.find({ isBooked: true })
        await Device.updateMany({}, {
            $set: {
                isBooked: false,
                bookedBy: null,
                bookedDate: undefined,
            }
        })

        for (const device of devices) {
            const log = await Logs.findOneAndUpdate({
                //@ts-ignore
                employee :  device.bookedBy._id,
                device : device._id,
                logoutTime : null
            },{
                logoutTime : Date.now()
            },{
                new : true
            })
        }

        await getDevices();
        await getAdminDevices()
        user.forEach(obj => {
            //@ts-ignore
            myDevices((obj._id).toString());
        });
        return 1;

    } catch (error) {
        console.log('error occured while returning a device: ', error);
        return -1;
    }
}