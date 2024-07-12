import { useEffect, useState } from "react";
import CurrentDeviceCard from "../components/CurrentDeviceCard/CurrentDeviceCard";
import { Table } from "flowbite-react";
import { socket, socketState } from "../../socket";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import Device from "/Device.png";
import { v4 } from "uuid";

export default function CurrentDevices() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [mylogs, setMylogs] = useState([]);
  const socketStatus = useRecoilValue(socketState);
  
  console.log("socket status at current devices: ", socketStatus);

  useEffect(() => {
    if (socketStatus) {
      socket.emit("my devices");
      socket.on("mydevice list", (data, mylogs) => {
        setDevices(data);
        setMylogs(mylogs);
      });
    }
  }, []);

  return (
    <div className="bg-white">
      <div>
        <div className="flex justify-between items-center p-2">
          <h2 className="font-extrabold text-2xl">
            {
              //@ts-ignore
              devices && devices[0] && devices[0].name
            }
          </h2>
          <button
            className="bg-green-400 p-2 rounded font-semibold text-white"
            onClick={() => navigate("/user/availableDevices")}
          >
            Add Device
          </button>
        </div>
        <hr />
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-5">
          <h1 className="text-lg font-semibold p-1 pl-2 h-fit border-b-2 border-t-2 border-black">
            Current Devices
          </h1>
          <div className="min-h-screen flex justify-center items-start gap-5 px-2 py-4 flex-wrap">
            {
              devices &&
              devices[0] &&
                //@ts-ignore
                devices[0].devices.map((device) => {
                  return (
                    //@ts-ignore
                    <CurrentDeviceCard key={device._id} device={device} />
                  );
                })
            }
          </div>
        </div>
        <div className="col-span-7 bg-gray-100 border-l-2 border-black">
          <h1 className="text-lg font-semibold p-1 pl-2 h-fit border-b-2 border-t-2 border-black">
            History
          </h1>
          <div className="min-h-screen">
            <Table striped className="w-full">
              <Table.Head>
                <Table.HeadCell className="text-base text-center">
                  Date
                </Table.HeadCell>
                <Table.HeadCell className="text-base text-center">
                  Device
                </Table.HeadCell>
                <Table.HeadCell className="text-base text-center">
                  Login Time
                </Table.HeadCell>
                <Table.HeadCell className="text-base text-center">
                  Logout Time
                </Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {mylogs.map((log) => {
                  return (
                    //@ts-ignore
                    <Table.Row key={log._id + v4()}>
                      <Table.Cell className="font-semibold text-center p-0">
                        {
                          //@ts-ignore
                          new Date(log.createdAt).toDateString()
                        }
                      </Table.Cell>
                      <Table.Cell className="font-semibold text-center flex justify-center items-center p-0 py-1">
                        <div className="max-w-[60px] max-h-[60px] flex justify-center items-center rounded">
                          <img
                            //@ts-ignore
                            src={log.device.image ? `${import.meta.env.VITE_BACKEND_URL}/${log.device.image}` : Device}
                            alt="Device Image"
                            className="object-contain max-h-[80px] rounded"
                          />
                        </div>
                      </Table.Cell>
                      <Table.Cell className="font-semibold text-center p-0">
                        {
                          //@ts-ignore
                          new Date(log.loginTime).toLocaleTimeString()
                        }
                      </Table.Cell>
                      <Table.Cell className="font-semibold text-center p-0">
                        {
                          //@ts-ignore
                          log.logoutTime ? new Date(log.logoutTime).toLocaleTimeString() : "---"
                        }
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
