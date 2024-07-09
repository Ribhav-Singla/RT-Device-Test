import { motion } from "framer-motion";
import Device from "/Device.png";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

interface Device {
  _id: string;
  bookedBy: string;
  bookedDate: string;
  company: string;
  createdAt: string;
  image: string;
  isBooked: boolean;
  model: string;
}

export default function CurrentDeviceCard({ device }: { device: Device }) {
  const [btnLoader, setBtnLoader] = useState(false);
  const [isReturn, setIsReturn] = useState(false);

  const handleReturn = async () => {
    setBtnLoader(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/user/returnDevice/${device._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data.message);
      setBtnLoader(false);
    } catch (error) {
      console.log("error occured while return the device: ", error);
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
        className="w-fit bg-white rounded-lg cursor-pointer h-fit flex-col justify-center items-center"
      >
        <motion.div className="w-[190px] h-[180px] flex justify-center items-center">
          <img
            src={
              device.image ? `http://localhost:3000/${device.image}` : Device
            }
            alt="User Image"
            className="text-center object-contain max-h-[180px]"
          />
        </motion.div>
        <motion.h1 className="text-2xl font-bold text-center pb-2 text-black text-box">
          {device.model}
        </motion.h1>
        <motion.h1 className="text-2xl font-bold text-center pb-2 text-black text-box">
          {device.company}
        </motion.h1>
        <div className="w-full flex justify-center items-center p-2">
          <button
            className="text-lg rounded text-white font-bold w-[50%] p-1 bg-red-500 hover:bg-red-600"
            onClick={() => setIsReturn(!isReturn)}
          >
            Return
          </button>
        </div>
      </motion.div>
      {isReturn ? (
        <div className="overlay z-10">
          <div className="whitespace-nowrap font-medium  text-base bg-blackOlive text-floralWhite text-center rounded-md py-5 px-5 delete-btn">
            <p className="text-flame">
              Are you sure you want to return this device?
            </p>
            <div>
              <p>{device.model}</p>
              <p>{device.company}</p>
            </div>
            <div className="flex justify-center items-center gap-5 cursor-pointer mt-4">
              <span
                className="text-blue-500 bg-eerieBlack py-2 px-4 rounded"
                onClick={handleReturn}
              >
                {btnLoader ? "Returning..." : "Yes"}
              </span>
              {btnLoader ? (
                ""
              ) : (
                <span
                  className="text-red-600 bg-eerieBlack py-2 px-4 rounded"
                  onClick={() => setIsReturn(!isReturn)}
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
