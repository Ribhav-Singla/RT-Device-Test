import { useForm, SubmitHandler } from "react-hook-form";
import { useRef, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import toast from "react-hot-toast";
import Spinner from "../../Common/Spinner";
import { useNavigate } from "react-router-dom";

type Inputs = {
  model: string;
  company: string;
  image: string;
};

export default function AddDevice() {
  const navigate = useNavigate();
  const [btnLoader, setBtnLoader] = useState(false);
  const [image, setImage] = useState<File | string>("");
  const imageRef = useRef(null)

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
    try {
      setBtnLoader(true);
      const imageURL = await uploadImage();
      const formData = new FormData();
      formData.append("model", data.model);
      formData.append("company", data.company);
      formData.append("image", imageURL);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/device/create`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      await new Promise((r) => setTimeout(r, 1000));
      setBtnLoader(false);
      toast.success(response.data.message);
      navigate("/admin/devices");
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <>
      <div className="flex justify-center pt-7 px-5">
        <div className="flex flex-col justify-center items-center rounded md:max-w-[450px] lg:max-w-[600px] w-full px-3 pb-5 bg-blackOlive">
          <div className=" p-3 mb-5 text-center w-full">
            <h1 className="text-2xl font-bold w-full text-floralWhite">
              Add a device
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
                  Model
                </label>
                <input
                  {...register("model", {
                    required: "Model is required!",
                    maxLength: {
                      value: 15,
                      message: "Company name cannot exceed 15 characters!",
                    },
                  })}
                  onBlur={(e) => {
                    const trimmedValue = e.target.value.trim();
                    //@ts-ignore
                    setValue(e.target.name, trimmedValue);
                  }}
                  autoFocus={true}
                  placeholder="M-53"
                  className="w-full pl-2 text-floralWhite bg-eerieBlack"
                />
                <p className="text-red-500">{errors.model?.message}</p>
              </div>
              <div className="mt-4 px-1">
                <label className="block text-sm font-medium text-floralWhite">
                  Company
                </label>
                <input
                  {...register("company", {
                    required: "Company is required!",
                    maxLength: {
                      value: 15,
                      message: "Company name cannot exceed 15 characters!",
                    },
                  })}
                  onBlur={(e) => {
                    const trimmedValue = e.target.value.trim();
                    //@ts-ignore
                    setValue(e.target.name, trimmedValue);
                  }}
                  placeholder="Samsung"
                  className="w-full pl-2 text-floralWhite bg-eerieBlack"
                />
                <p className="text-red-500">{errors.company?.message}</p>
              </div>
              <div className="mt-4 px-1">
                <div className="flex justify-center items-center gap-4">
                  <div className="flex justify-center items-center w-[130px] h-[112px]  bg-eerieBlack rounded">
                    {image ? (
                      <img
                        //@ts-ignore
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        className="rounded max-h-[112px]"
                        object-contain
                      />
                    ) : (
                      <p className="text-center p-2 text-blue-600">
                        Image Preview
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col w-full gap-3">
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
                                fileType !== "image/png" &&
                                fileType !== "image/jpeg" &&
                                fileType !== "image/jpg"
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
                          className="w-full bg-eerieBlack rounded-md text-floralWhite"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end items-center">
                      {image ? (
                        <div
                          className="relative cursor-pointer text-red-500 flex flex-col justify-center items-center hover-container"
                          onClick={() => {
                            setImage("")
                            if(imageRef.current){
                              //@ts-ignore
                              imageRef.current.value = ""
                            }
                          }}
                        >
                          <RiDeleteBin6Line size={22} className="ml-2" />
                          <span className="absolute hidden text-floralWhite bg-blackOlive p-1 border-2 ml-1 rounded-lg mt-2 hover-text-content">
                            remove
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 px-1">
                <button
                  type="submit"
                  className=" bg-timerWolf p-2 rounded w-full flex justify-center"
                >
                  {btnLoader ? <Spinner /> : "Add device"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
