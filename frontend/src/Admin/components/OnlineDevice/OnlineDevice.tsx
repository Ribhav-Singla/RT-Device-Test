import Device from "/Device.png";
import { motion } from "framer-motion";

export default function OnlineDevice({name,model,company,empImage,deviceImage,bookedDate}:{
  name:string,
  model:string,
  company:string,
  empImage:string,
  deviceImage:string,
  bookedDate:string
}) {
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
        <div className="flex-col justify-center items-center p-4 w-fit">
          <div className="w-[120px] h-[120px] flex justify-center items-center rounded-full image-box">
            <img
              src={ empImage ? `http://localhost:3000/${empImage}` : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=338&ext=jpg&ga=GA1.1.2113030492.1720051200&semt=ais_user" }
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
              src={deviceImage ? `http://localhost:3000/${deviceImage}` :Device}
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
    </>
  );
}
