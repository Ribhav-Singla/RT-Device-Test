import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import Spinner from "../../../Common/Spinner";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MdUploadFile } from "react-icons/md";

type Inputs = {
  model: string;
  company: string;
  image: string;
};

export default function () {
  const navigate = useNavigate();
  const { id } = useParams();
  const [btnLoader, setBtnLoader] = useState(false);
  const [image, setImage] = useState<File | string>("");
  const [deviceData, setDeviceData] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/device/${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setDeviceData(response.data.device);
        setImage(response.data.device.image);
        await new Promise((r) => setTimeout(r, 500));
        setLoading(false);
      } catch (error) {
        console.log("error in update device: ", error);
      }
    }
    getData();
  }, []);

  const uploadImage = async () => {
    if (image && typeof image !== "string") {
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
      return image;
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    
    try {
      setBtnLoader(true)
      const imageURL = await uploadImage();
      const formData = new FormData();
      formData.append("model", data.model);
      formData.append("company", data.company);
      formData.append("image", imageURL);
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/device/update/${id}`,formData,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`
          }
      })
      await new Promise((r) => setTimeout(r, 1000));
      toast.success(response.data.message);
      setBtnLoader(false);
      navigate("/admin/devices")
    } catch (error) {
      await new Promise((r) => setTimeout(r, 1000));
      console.log('error: ',error);
      //@ts-ignore
      toast.error(error.response.data.message);
      setBtnLoader(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center pt-7 px-5">
        <div className="flex flex-col justify-center items-center rounded md:max-w-[450px] lg:max-w-[600px] w-full px-3 pb-5 bg-blackOlive">
          <div className=" p-3 mb-5 text-center w-full">
            <h1 className="text-2xl font-bold w-full text-floralWhite">
              update {deviceData.model} info
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
                  {...register("model", { required: "Model is required!" })}
                  //@ts-ignore
                  defaultValue={deviceData.model}
                  className="w-full pl-2 text-floralWhite bg-eerieBlack"
                />
                <p className="text-red-500">{errors.model?.message}</p>
              </div>
              <div className="mt-4 px-1">
                <label className="block text-sm font-medium text-floralWhite">
                  Company
                </label>
                <input
                  {...register("company", { required: "Company is required!" })}
                  //@ts-ignore
                  defaultValue={deviceData.company}
                  className="w-full pl-2 text-floralWhite bg-eerieBlack"
                />
                <p className="text-red-500">{errors.company?.message}</p>
              </div>
              <div className="mt-4 px-1">
                <div className="flex justify-center items-center gap-4">
                  <div className="flex justify-center items-center w-[130px] h-[112px]  bg-eerieBlack rounded">
                    {image ? (
                      typeof image !== "string" ? (
                        <img
                          src={URL.createObjectURL(image)}
                          alt="preview not available"
                          className="object-contain text-center max-h-[112px]"
                        />
                      ) : (
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/${image}`}
                          alt="preview not available"
                          className="object-contain text-center max-h-[112px]"
                        />
                      )
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
                          type="file"
                          accept=".png, .jpeg, .jpg"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setImage(e.target.files[0]);
                            }
                          }}
                          className="w-full bg-eerieBlack rounded-md text-floralWhite"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end items-center gap-3 pt-2">
                      <div
                        className="relative cursor-pointer text-red-500 flex flex-col justify-center items-center hover-container"
                        onClick={() => setImage("")}
                      >
                        <RiDeleteBin6Line size={22} className="ml-2" />
                        <span className="absolute hidden text-floralWhite bg-blackOlive p-1 border-2 ml-1 rounded-lg mt-2 hover-text-content">
                          remove
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 px-1">
                <button
                  type="submit"
                  className=" bg-timerWolf p-2 rounded w-full flex justify-center"
                >
                  {btnLoader ? <Spinner /> : "Update Device"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
