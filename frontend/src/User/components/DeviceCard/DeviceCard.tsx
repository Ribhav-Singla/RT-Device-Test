import { motion } from "framer-motion";
import Device from "/Device.png";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Device {
  _id: string;
  bookedBy: boolean;
  company: string;
  createdAt: string;
  image: string;
  isBooked: boolean;
  model: string;
}

export default function DeviceCard({ device }: { device: Device }) {
  const navigate = useNavigate();
  const [btnLoader, setBtnLoader] = useState(false);

  const handleBook = async () => {
    try {
      setBtnLoader(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/bookDevice/${device._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('userLoginAllowed') ? sessionStorage.getItem('userLoginToken') : localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Device booked!");
      setBtnLoader(false);
      navigate("/user/currentDevices");
    } catch (error) {
      console.log("error while booking device: ", error);
      //@ts-ignore
      toast.error(error.response.data.message);
      setBtnLoader(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
          boxShadow: "0 0 2px gray, 0 0 6px gray, 0 0 16px gray",
          transition: {
            duration: 0.5,
            ease: "easeInOut",
          },
        }}
        whileHover={{
          scale: 1.05,
          transition: {
            duration: 0.05,
            ease: "linear",
          },
        }}
        className="w-fit bg-white rounded-lg cursor-pointer h-fit flex-col justify-center items-center dev h-fit-crds"
      >
        <motion.div className="w-[100%] h-[180px] flex justify-center items-center">
          <img
            src={
              device.image ? `${import.meta.env.VITE_BACKEND_URL}/${device.image}` : "/device.png"
            }
            alt="Device Image"
            className="text-center object-contain max-h-[180px] usr"
          />
        </motion.div>
        <motion.h1 className="text-2xl font-bold text-center pb-2 text-black text-box">
          <span className="device-model">{device.model} {device.company}</span>
        </motion.h1>
        <div className="w-full flex justify-center items-center p-2">
          <button
            className="btn-enter text-lg rounded text-white font-bold w-[50%] p-1 bg-red-500"
            onClick={handleBook}
          >
            {btnLoader ? "Booking..." : "Book"}
          </button>
        </div>
      </motion.div>
    </>
  );
}
