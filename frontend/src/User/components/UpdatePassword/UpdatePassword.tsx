import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useRecoilValueLoadable,useRecoilRefresher_UNSTABLE } from "recoil";
import { userAtom } from "../../../recoil";

type Inputs = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

export default function () {
  const userLoadable = useRecoilValueLoadable(userAtom);
  const refresh = useRecoilRefresher_UNSTABLE(userAtom);
  const [user, setUser] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);

  useEffect(() => {
    if (userLoadable.state === "hasValue") {
      setUser(userLoadable.contents);
    }
  }, [userLoadable]);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => {
    try {
      setBtnLoader(true);
      const formData = new FormData();
      if (!resetPassword) {
        formData.append("oldPassword", data.oldPassword);
      }
      formData.append("password", data.password);
      const response = await axios.put(
        //@ts-ignore
        `http://localhost:3000/api/v1/user/changePassword/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message);
      console.log(response);
      refresh()
      setBtnLoader(false);
    } catch (error) {
      console.log("error: ", error);
      //@ts-ignore
      toast.error(error.response.data.message);
      setBtnLoader(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center bg-white">
        <div className="flex-col justify-center items-center p-14 md:w-[60%] lg:w-[40%]">
          <h1 className="text-4xl font-extrabold text-center text-eerieBlack mb-8">
            Change Password
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* old password */}
            <div className="mb-5">
              <label className="text-black">Old password: </label>
              <br />
              <div className="relative">
                <input
                  {...register("oldPassword", {
                    required: resetPassword
                      ? false
                      : "Old password is required!",
                  })}
                  type={showOldPassword ? "text" : "password"}
                  placeholder="ribhav-x"
                  className="w-full pl-2 text-eerieBlack border-none rounded-md bg-timerWolf"
                />
                <div
                  className=" cursor-pointer"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {!showOldPassword ? (
                    <FaRegEye className="absolute top-4 left-[95%] text-black" />
                  ) : (
                    <FaEyeSlash className="absolute top-4 left-[95%] text-black" />
                  )}
                </div>
              </div>
              <p className="text-red-500">{errors.oldPassword?.message}</p>
            </div>

            {/* New Password */}
            <div className="mb-5">
              <label className="text-black">New password: </label>
              <br />
              <div className="relative">
                <input
                  {...register("password", {
                    required: "New password is required!",
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/,
                      message:
                        "Password must contain a capital letter, small letter, a digit, a special charcter and minimum of 6",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="ribhav-x"
                  className="w-full pl-2 text-eerieBlack border-none rounded-md bg-timerWolf"
                />
                <div
                  className=" cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {!showPassword ? (
                    <FaRegEye className="absolute top-4 left-[95%] text-black" />
                  ) : (
                    <FaEyeSlash className="absolute top-4 left-[95%] text-black" />
                  )}
                </div>
              </div>
              <p className="text-red-500">{errors.password?.message}</p>
            </div>

            {/* confirmPassword */}
            <div>
              <label className="text-black">Confirm password: </label>
              <br />
              <div className="relative">
                <input
                  {...register("confirmPassword", {
                    required: "Confirm password is required!",
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/,
                      message:
                        "Password must contain a capital letter, small letter, a digit, a special charcter and minimum of 6",
                    },
                    validate: (val: string) => {
                      if (watch("password") != val) {
                        return "Password does not match";
                      }
                    },
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="ribhav-x"
                  className="w-full pl-2 text-eerieBlack border-none rounded-md  bg-timerWolf"
                />
                <div
                  className=" cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {!showConfirmPassword ? (
                    <FaRegEye className="absolute top-4 left-[95%] text-black" />
                  ) : (
                    <FaEyeSlash className="absolute top-4 left-[95%] text-black" />
                  )}
                </div>
              </div>
              <p className="text-red-500">{errors.confirmPassword?.message}</p>
            </div>

            <div className="flex justify-center items-center gap-3 mt-5 mb-5">
              <input
                type="checkbox"
                className="rounded text-blue-500"
                defaultChecked={false}
                onChange={(e) => {
                  setResetPassword(e.target.checked);
                }}
              />
              <p className="text-black">Want to reset the password ?</p>
            </div>

            <button
              type="submit"
              className=" bg-timerWolf text-blue-600 font-bold p-2 rounded  w-full"
            >
              {btnLoader ? "Please wait..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
