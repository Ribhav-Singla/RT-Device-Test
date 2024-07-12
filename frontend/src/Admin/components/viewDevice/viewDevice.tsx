import { useEffect, useState } from "react";
import Spinner from "../../../Common/Spinner";
import { useParams } from "react-router-dom";
import axios from "axios";
import Device from "/Device.png";

export default function ViewDevice() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState("");
  console.log(device);
  

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/device/${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setDevice(response.data.device);
        await new Promise((r) => setTimeout(r, 500));
        setLoading(false);
      } catch (error) {
        console.log("error in view employee: ", error);
      }
    }
    getData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }
  return (
    <>
    <div className="flex justify-center items-center w-full pt-[100px]">
    <div className="flex-col justify-center items-center w-fit">
      <div className="bg-eerieBlack h-[250px] w-[250px] rounded-xl flex justify-center items-center">
        {
            //@ts-ignore
            device.image ? <img src={`${import.meta.env.VITE_BACKEND_URL}/${device.image}`} alt="Device Image" className="object-contain rounded-xl max-h-[250px]" /> : <img src={Device} alt="Device Image" className="object-contain rounded-xl max-h-[200px]" />
        }
      </div>
      <div className="flex justify-center items-center gap-28">
        <div>
          <div className="mt-10 w-fit">
            <h1 className="text-blue-500">Model:</h1>
            {/* @ts-ignore */}
            <p className="text-4xl font-extrabold mt-1 text-floralWhite">{device.model}</p>
          </div>
          <div className="mt-6 w-fit">
            <h1 className="text-blue-500">Company:</h1>
            {/* @ts-ignore */}
            <p className="text-4xl font-extrabold mt-1 text-floralWhite">{device.company}</p>
          </div>
        </div>
        <div>
          <div className="mt-10 w-fit">
            <h1 className="text-blue-500">CreatedAt:</h1>
            {/* @ts-ignore */}
            <span className="text-4xl font-extrabold mt-1 text-floralWhite">{new Date(device.createdAt).toDateString().replace(/^\S+\s/, '')} at {new Date(device.createdAt).toLocaleTimeString()}</span>
            <span className="text-4xl font-extrabold mt-1"></span>
          </div>
          <div className="mt-6 w-fit">
            <h1 className="text-blue-500">isBooked:</h1>
            {/* @ts-ignore */}
            <p className="text-4xl font-extrabold mt-1 text-floralWhite">{device.isBooked ? "True" : "False"}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}
