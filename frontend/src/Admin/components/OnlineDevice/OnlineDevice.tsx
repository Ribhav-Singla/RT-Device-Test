import axios from "axios";
import { motion } from "framer-motion";
import { TiArrowBack } from "react-icons/ti";
import toast from "react-hot-toast";
import { useState } from "react";

export default function OnlineDevice({id,name,model,company,empImage,deviceImage,bookedDate}:{
  id:string,
  name:string,
  model:string,
  company:string,
  empImage:string,
  deviceImage:string,
  bookedDate:string
}) {

  // handle the return device functionality
  const [btnLoader, setBtnLoader] = useState(false);
  const [isReturn, setIsReturn] = useState(false);

  const handleReturn = async () => {
    setBtnLoader(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/device/returnDevice/${id}`,
        {},
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
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
          transition: {
            duration: 0.5,
            ease: "easeInOut",
          },
        }}
        whileHover={{
          scale: 0.95,
          transition: {
            duration: 0.05,
            ease: "linear",
          },
        }}
        className="flex justify-center border-2 bg-blackOlive rounded-lg w-fit container cursor-pointer"
      >
        <div className="p-1" onClick={()=>setIsReturn(!isReturn)}>
          <TiArrowBack className="text-flame cursor-pointer" size={35}/>
        </div>
        <div className="flex-col justify-center items-center p-4 w-fit">
          <div className="w-[120px] h-[120px] flex justify-center items-center rounded-full image-box">
            <img
              src={ empImage ? `${import.meta.env.VITE_BACKEND_URL}/${empImage}` : "/user.png" }
              alt="Employee Image"
              className="text-center object-contain rounded-full max-h-[120px]"
            />
          </div>
          <div>
            <h1 className="text-floralWhite text-center text-lg font-bold mt-3">
              {name}
            </h1>
            <h1 className="text-floralWhite text-center text-lg font-bold mt-1">
              {(new Date(bookedDate)).toLocaleTimeString()}
            </h1>
          </div>
        </div>
        <div className="flex-col justify-center items-center p-4 w-fit">
          <div className="w-[120px] h-[120px] flex justify-center items-center rounded-full image-box">
            <img
              src={deviceImage ? `${import.meta.env.VITE_BACKEND_URL}/${deviceImage}` :"/device.png"}
              alt="Device Image"
              className="text-center object-contain rounded-full max-h-[120px]"
            />
          </div>
          <div>
            <h1 className="text-floralWhite text-center text-lg font-bold mt-3">
              {model}
            </h1>
            <h1 className="text-floralWhite text-center text-lg font-bold mt-1">
              {company}
            </h1>
          </div>
        </div>
      </motion.div>
      {isReturn ? (
        <div className="overlay z-10">
          <div className="online-model whitespace-nowrap font-medium  text-base bg-blackOlive text-floralWhite text-center rounded-md py-5 px-5 delete-btn">
            <p className="text-flame">
              Are you sure you want to return this device?
            </p>
            <div>
              <p>{model} {company}</p>
            </div>
            <div className="flex justify-center items-center gap-5 cursor-pointer mt-4">
              <span
                className="text-blue-500 bg-eerieBlack py-2 px-4 rounded btn-no"
                onClick={handleReturn}
              >
                {btnLoader ? "Returning..." : "Yes"}
              </span>
              {btnLoader ? (
                ""
              ) : (
                <span
                  className="text-red-600 bg-eerieBlack py-2 px-4 rounded btn-no"
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
