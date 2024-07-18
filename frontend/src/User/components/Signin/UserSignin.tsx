import axios from "axios";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { motion } from "framer-motion";

type Inputs = {
  email: string;
  password: string;
};

export default function UserSignin({ id ,setShowSignin }: { id :string,setShowSignin: (showSignin:boolean)=>void }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [btnLoader,setBtnLoader] = useState(false)
  const {
    register,
    handleSubmit,
    //@ts-ignore
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData()
    formData.append('password', data.password)
    formData.append('id', id)
    
    try {
      setBtnLoader(true)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signin`,formData,{
        headers: {
          'Content-Type': 'application/json',
          }
      }
      )
      localStorage.setItem('token',response.data.token)
      toast.success('successfully signed in!')
      setBtnLoader(false)
      setShowSignin(false)
      navigate('/user/availableDevices')
    } catch (error) {
      console.log('error: ',error)
      //@ts-ignore
      toast.error(error.response.data.message)
      setBtnLoader(false)
    }
  };
  return (
    <>
      <div className="overlay">
        <motion.div
          initial={{
            scale: 0,
          }}
          animate={{
            scale: 1.2,
          }}
          exit={{
            scale: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="br border-2 mx-7 rounded w-[400px] py-8 flex flex-col justify-center items-center container bg-white relative"
        >
          <IoArrowBack
            className="absolute top-2 left-[3%] font-extrabold text-2xl cursor-pointer"
            onClick={() => setShowSignin(false)}
          />
          <h1 className="font-bold text-3xl text-slate-700 mb-2 pt-5 text-box">
            Password
          </h1>
          <div className="flex min-w-full">
            <form
              className="flex justify-center items-center flex-col min-w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="min-w-full flex flex-col justify-center items-center pl-9">
                <div className="mb-3 w-full">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                      })}
                      placeholder="xxx"
                      autoFocus={true}
                      className=" tb-input rounded-lg border-2 mt-3 bg-timerWolf text-black"
                    />
                    {showPassword ? (
                      <svg
                        className="w-6 h-6 text-black absolute top-6 left-[75%] cursor-pointer"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-black absolute top-6 eye left-[80%] cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                        />
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-col justify-center items-center w-full">
                <button
                  type="submit"
                  className="btn-enter bg-red-500 rounded-lg  text-white text-lg font-bold px-5 py-2 w-[40%]"
                >
                  {btnLoader ? 'please wait...' : 'Enter'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}
