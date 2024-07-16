import OnlineDevice from "../components/OnlineDevice/OnlineDevice";
import { socket } from "../../socket";
import { useEffect, useState } from "react";
import Logs from "./Logs";

export default function LiveDashboad() {
  const [adminDevices, setAdminDevices] = useState([]);
  const [isReturnAll,setIsReturnAll] = useState(false)
  const [returnBtnLoader,setReturnBtnLoader] = useState(false); 

  useEffect(() => {
    const authToken = localStorage.getItem("token");

    if (authToken) {
      const token = authToken.split(" ")[1];
      socket.auth = { token };
      socket.connect();
    }
    socket.emit("admin-devices");
    socket.on("admin-device-list", (data) => {
      setAdminDevices(data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleReturnAll = async()=>{
    const data = adminDevices.map((obj)=>{
      return {
        //@ts-ignore
        deviceId: obj._id,
        //@ts-ignore
        employeeId : obj.bookedBy._id
      }
    })
    if(data.length == 0){
      return ;
    }
    if(socket.connected){
      setReturnBtnLoader(true)
      socket.emit('return-devices',data)
      socket.on('returned-all',(data)=>{
        console.log(data)
        setIsReturnAll(false)
        setReturnBtnLoader(false)
      })
    }
  }

  return (
    <>
      <div>
        </div>
        <div className="flex justify-between items-center pr-2 py-1 w-full border-b-2">
          <h1 className="text-xl text-floralWhite pl-3 pt-3 pb-3">
            Online Users
          </h1>
          <button className="text-white bg-blue-600 p-2 rounded-lg" onClick={()=>setIsReturnAll(!isReturnAll)}>Return all</button>
        </div>
        <div className="flex justify-start items-start flex-wrap p-3 gap-x-3 gap-y-5">
          {adminDevices.length >0 ? adminDevices.map((device, index) => {
            //@ts-ignore
            return (
              <OnlineDevice
                //@ts-ignore
                id = {device._id}
                key={index}
                //@ts-ignore
                name={device.bookedBy.name}
                //@ts-ignore
                model={device.model}
                //@ts-ignore
                company={device.company}
                //@ts-ignore
                empImage={device.bookedBy.image}
                //@ts-ignore
                deviceImage={device.image}
                //@ts-ignore
                bookedDate = {device.bookedDate}
              />
            );
          }) :
          <div className="flex justify-center items-center w-full h-full text-2xl text-floralWhite p-4">No Devices Online</div>
          }
        </div>
        <hr />
        <div className="w-full">
          <div className="flex justify-start items-start w-full">
            <Logs/>
          </div>
      </div>
      {isReturnAll ? (
          <div className="overlay z-10">
            <div className="whitespace-nowrap font-medium  text-base bg-blackOlive text-floralWhite text-center rounded-md py-5 px-5 delete-btn">
              <p className="text-flame">
                Are you sure you want to return all devices?
              </p>
              <div className="flex justify-center items-center gap-5 cursor-pointer mt-4">
                <span
                  className="text-blue-500 bg-eerieBlack py-2 px-4 rounded"
                  onClick={handleReturnAll}
                >
                  {returnBtnLoader ? 'Returning...' : 'Yes'}
                </span>
                {returnBtnLoader ? (
                  ""
                ) : (
                  <span
                    className="text-red-600 bg-eerieBlack py-2 px-4 rounded"
                    onClick={() => setIsReturnAll(!isReturnAll)}
                  >
                    No
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
    </>
  );
}
