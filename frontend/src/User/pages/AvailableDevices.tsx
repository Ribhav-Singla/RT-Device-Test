import DeviceCard from "../components/DeviceCard/DeviceCard";
import { socket, socketState } from "../../socket";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

interface Device {
  _id: string;
  bookedBy: boolean;
  company: string;
  createdAt: string;
  image: string;
  isBooked: boolean;
  model: string;
}

type Devices = Device[]

export default function AvailableDevices() {
  const [devices, setDevices] = useState([]);
  const socketStatus = useRecoilValue(socketState);
  console.log('socket status at available devices: ',socketStatus);
  
  useEffect(() => {
    if (socketStatus) {
      socket.emit("send devices");
      socket.on("device list", (data: Devices) => {
        //@ts-ignore
        setDevices(data);        
      });
    }

    return ()=>{
      socket.off('device list')
    }
  }, [socketStatus]);

  return (
    <>
      <div className="min-h-screen bg-white flex-col justify-center items-center main-sc">
        <div className=" flex justify-center items-center w-full">
          
        </div>
        <div className="p-4 mt-4 flex justify-center items-start flex-wrap gap-5 gap-spc">
          {devices.map((device) => {
            //@ts-ignore
            return <DeviceCard device={device} key={device._id} />;
          })}
        </div>
      </div>
    </>
  );
}
