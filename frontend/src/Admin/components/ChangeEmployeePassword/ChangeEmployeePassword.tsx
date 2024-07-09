import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useParams } from "react-router-dom";

type Inputs = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

export default function () {
  const { id } = useParams();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit = async (data: Inputs) => {
    const formData = new FormData();
    if (!resetPassword) {
      formData.append("oldPassword", data.oldPassword);
    }
    formData.append("password", data.password);
    try {
      setBtnLoader(true);
      const response = await axios.put(
        `http://localhost:3000/api/v1/admin/employee/changePassword/${id}`,
        formData,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          },
        }
      );

      toast.success(response.data.message);
      console.log(response);
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
    <div className="flex justify-center items-center">

      <div className="flex-col justify-center items-center p-20 md:w-[80%] lg:w-[60%]">
        <h1 className="text-white text-4xl font-extrabold mb-10 text-center">Change Password</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* old password */}
          <div className="mb-5">
            <label className="text-floralWhite">Old password: </label>
            <br />
            <div className="relative">
              <input
                {...register("oldPassword", {
                  required: resetPassword ? false : "Old password is required!",
                })}
                type={showOldPassword ? "text" : "password"}
                placeholder="ribhav-x"
                className="w-full pl-2 text-floralWhite border-none rounded-md bg-blackOlive"
              />
              <div
                className=" cursor-pointer"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {!showOldPassword ? (
                  <FaRegEye className="absolute top-4 left-[95%] text-white" />
                ) : (
                  <FaEyeSlash className="absolute top-4 left-[95%] text-white" />
                )}
              </div>
            </div>
            <p className="text-red-500">{errors.oldPassword?.message}</p>
          </div>

          {/* New Password */}
          <div className="mb-5">
            <label className="text-floralWhite">New password: </label>
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
                className="w-full pl-2 text-floralWhite border-none rounded-md bg-blackOlive"
              />
              <div
                className=" cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <FaRegEye className="absolute top-4 left-[95%] text-white" />
                ) : (
                  <FaEyeSlash className="absolute top-4 left-[95%] text-white" />
                )}
              </div>
            </div>
            <p className="text-red-500">{errors.password?.message}</p>
          </div>

          {/* confirmPassword */}
          <div>
            <label className="text-floralWhite">Confirm password: </label>
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
                className="w-full pl-2 text-floralWhite border-none rounded-md  bg-blackOlive"
              />
              <div
                className=" cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {!showConfirmPassword ? (
                  <FaRegEye className="absolute top-4 left-[95%] text-white" />
                ) : (
                  <FaEyeSlash className="absolute top-4 left-[95%] text-white" />
                )}
              </div>
            </div>
            <p className="text-red-500">{errors.confirmPassword?.message}</p>
          </div>

          <div className="flex justify-center items-center gap-3 mt-5 mb-5">
            <input
              type="checkbox"
              className="rounded text-flame"
              defaultChecked={false}
              onChange={(e) => {
                setResetPassword(e.target.checked);
              }}
            />
            <p className="text-floralWhite">Want to reset the password ?</p>
          </div>

          <button
            type="submit"
            className=" bg-blackOlive text-flame font-semibold p-2 rounded border-2 w-full"
          >
            {btnLoader ? "Please wait..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
