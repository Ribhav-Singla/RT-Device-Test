import axios from "axios";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Logo from '/vite.png'

type Inputs = {
  email: string;
  password: string;
};

export default function AdminSignin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [btnLoader,setBtnLoader] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setBtnLoader(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/auth/signin`,
        {
          email: data.email,
          password: data.password,
        }
      );
      setBtnLoader(false);
      localStorage.setItem("token", `Bearer ${response.data.token}`);
      toast.success("signed in successfully!");
      navigate("/admin");
    } catch (error) {
      //@ts-ignore
      toast.error(error.response.data.message);
      setBtnLoader(false);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex-col justify-center items-center">
          <div className="flex-col justify-center items-center gap-5 mb-10">
            <div className="flex justify-center items-center gap-5">
              <img src={Logo} alt="Logo" className="max-w-[80px] admin-company-image" />
              <h1 className="text-floralWhite text-5xl font-extrabold admin-company-name">Esfersoft Solutions</h1>
            </div>
            <div className="flex justify-center items-center typewriter w-fit mx-auto">
              <p className="text-2xl text-floralWhite font-semibold admin-company-tagline">Inspiring Digital Excellence</p>
            </div>
          </div>
          <div className="admin-acc border-2 mx-7 rounded min-w-[350px] md:w-[450px] flex flex-col justify-center items-center pb-5 container bg-blackOlive">
            <h1 className="font-bold text-3xl text-slate-700 mb-2 pt-5 text-floralWhite">
              Admin account
            </h1>
            <p className="text-lg mb-3 text-timerWolf">Good to see you back!</p>
            <div className="flex min-w-full">
              <form
                className="flex justify-center items-center flex-col min-w-full"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="min-w-full flex flex-col justify-center items-center pl-9">
                  <div className="mb-3 w-full">
                    <label className="text-floralWhite">Email:</label>
                    <br />
                    <input
                      {...register("email", { required: "Email is required", pattern: {
                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: 'Invalid email address',
                      }, })}
                      className="bg-eerieBlack text-floralWhite admin-input"
                    />
                    <p className="text-red-500">{errors.email?.message}</p>
                  </div>
                  <div className="mb-3 w-full">
                    <label className="text-floralWhite">Password:</label>
                    <br />
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                          required: "Password is required",
                        })}
                        placeholder="xxx"
                        className=" rounded-sm border-none bg-eerieBlack text-floralWhite admin-input"
                      />
                      {showPassword ? (
                        <svg
                          className="w-6 h-6 text-floralWhite absolute top-6 left-[80%] cursor-pointer"
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
                          className="w-6 h-6 text-floralWhite absolute top-6 left-[80%] cursor-pointer"
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
                      <br />
                      <p className="text-red-500">{errors.password?.message}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col justify-center items-center w-full">
                  <button
                    type="submit"
                    className="login-btn bg-timerWolf rounded text-black text-lg font-semibold px-5 py-2 w-[40%]"
                  >
                    {btnLoader ? 'Please wait...' : 'Sign in'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
