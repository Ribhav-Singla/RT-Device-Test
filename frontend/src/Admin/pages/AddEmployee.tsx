import { useForm, SubmitHandler } from "react-hook-form";
import { useRef, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import Spinner from "../../Common/Spinner";
import toast from "react-hot-toast";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Inputs = {
  name: string;
  email: string;
  password: string;
  image: string;
};

export default function AddEmployee() {
  const navigate = useNavigate();
  const [btnLoader, setBtnLoader] = useState(false);
  const [image, setImage] = useState<File | string>("");
  const [showPassword, setShowPassword] = useState(false);
  const imageRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  const uploadImage = async () => {
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/uploadImage`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        await new Promise((r) => setTimeout(r, 1000));
        return response.data.url;
      } catch (error) {
        return error;
      }
    } else {
      return "";
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setBtnLoader(true);
    const imageURL = await uploadImage();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    //@ts-ignore
    formData.append("image", imageURL);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/employee/create`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      await new Promise((r) => setTimeout(r, 1000));
      toast.success(response.data.message);
      setBtnLoader(false);
      navigate("/admin/employees");
    } catch (error) {
      await new Promise((r) => setTimeout(r, 1000));
      setBtnLoader(false);
      console.log("error: ", error);
      //@ts-ignore
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="flex justify-center pt-7 px-5">
        <div className="flex flex-col justify-center items-center rounded md:max-w-[450px] lg:max-w-[600px] w-full px-3 pb-5 bg-blackOlive">
          <div className=" p-3 mb-5 text-center w-full">
            <h1 className="text-2xl font-bold w-full text-floralWhite">
              Add an Employee
            </h1>
          </div>
          <div className="w-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full"
              encType="multipart/form-data"
            >
              <div className="px-1">
                <label className="block text-sm font-medium text-floralWhite">
                  Name
                </label>
                <input
                  {...register("name", {
                    required: "Name is required!",
                    maxLength: {
                      value: 15,
                      message: "Name cannot exceed 15 characters!",
                    },
                  })}
                  onBlur={(e) => {
                    const trimmedValue = e.target.value.trim();
                    //@ts-ignore
                    setValue(e.target.name, trimmedValue);
                  }}
                  autoFocus={true}
                  className="w-full pl-2 bg-eerieBlack text-floralWhite"
                />
                <p className="text-red-500">{errors.name?.message}</p>
              </div>
              <div className="mt-4 px-1">
                <label className="block text-sm font-medium text-floralWhite">
                  Email
                </label>
                <input
                  {...register("email", {
                    required: "Email is required!",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                  onBlur={(e) => {
                    const trimmedValue = e.target.value.trim();
                    //@ts-ignore
                    setValue(e.target.name, trimmedValue);
                  }}
                  className="w-full pl-2 bg-eerieBlack text-floralWhite"
                />
                <p className="text-red-500">{errors.email?.message}</p>
              </div>
              <div className="mt-4 px-1">
                <label className="block text-sm font-medium text-floralWhite">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required!",
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/,
                        message:
                          "Password must contain a capital letter, small letter, a digit, a special charcter and minimum of 6",
                      },
                    })}
                    onBlur={(e) => {
                      const trimmedValue = e.target.value.trim();
                      //@ts-ignore
                      setValue(e.target.name, trimmedValue);
                    }}
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-2 bg-eerieBlack text-floralWhite border-none rounded-md "
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
              <div className="mt-4 px-1">
                <div className="flex justify-center items-center gap-4">
                  <div className="flex flex-col w-full gap-4">
                    <div>
                      <label className="block text-sm font-medium text-floralWhite">
                        Image
                      </label>
                      <div className="w-full">
                        <input
                          ref={imageRef}
                          type="file"
                          accept=".png, .jpeg, .jpg"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              const fileType = file.type;
                              const fileSize = file.size;

                              if (
                                ![
                                  "image/png",
                                  "image/jpeg",
                                  "image/jpg",
                                ].includes(fileType)
                              ) {
                                toast.error(
                                  "Only PNG, JPEG, and JPG files are allowed"
                                );
                                e.target.value = ""; // reset the input value
                                return;
                              }

                              if (fileSize > 5 * 1024 * 1024) {
                                toast.error("File size must not exceed 5MB");
                                e.target.value = ""; // reset the input value
                                return;
                              }

                              setImage(file);
                            }
                          }}
                          className="text-floralWhite w-full bg-eerieBlack rounded-md"
                        />
                        <p className="text-red-500">{}</p>
                      </div>
                    </div>

                    <div className="flex justify-start items-center gap-3">
                      {
                        image ? 
                        <div
                        className="relative cursor-pointer text-red-500 flex flex-col justify-center items-center hover-container"
                        onClick={() => {
                          setImage("")
                          if(imageRef.current){
                            //@ts-ignore
                            imageRef.current.value =""
                          }
                        }}
                      >
                        <RiDeleteBin6Line size={22} className="ml-2" />
                        <span className="absolute hidden text-floralWhite bg-blackOlive p-1 border-2 ml-1 rounded-lg mt-2 hover-text-content">
                          remove
                        </span>
                      </div> : ""
                      }
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-[130px] h-[105px] bg-eerieBlack rounded">
                    {image ? (
                      <img
                        //@ts-ignore
                        src={URL.createObjectURL(image)}
                        alt="preview not available"
                        className="rounded object-contain text-center max-h-[105px]"
                      />
                    ) : (
                      <p className="text-center text-blue-600 p-2">
                        Image Preview
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 px-1">
                <button
                  type="submit"
                  className=" bg-timerWolf p-2 rounded w-full flex justify-center"
                >
                  {btnLoader ? <Spinner /> : "Add employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
