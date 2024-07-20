import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiImageAddFill } from "react-icons/ri";
import Spinner from "../../../Common/Spinner";
import { useRecoilValueLoadable, useRecoilRefresher_UNSTABLE } from "recoil";
import { userAtom } from "../../../recoil";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Inputs = {
  name: string;
  image: string;
};

export default function () {
  const userLoadable = useRecoilValueLoadable(userAtom);
  const refresh = useRecoilRefresher_UNSTABLE(userAtom);
  const [user, setUser] = useState(null);
  const [btnLoader, setBtnLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState<File | string>("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    if (userLoadable.state === "hasValue") {
      setUser(userLoadable.contents);
      setImage(userLoadable.contents.image);
      setLoading(false);
    }
  }, [userLoadable]);

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

  const onSubmit = async (data: Inputs) => {
    try {
      setBtnLoader(true);
      const imageURL = await uploadImage();
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("image", imageURL);
      const response = await axios.put(
        //@ts-ignore
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/updateProfile/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${
              sessionStorage.getItem("userLoginAllowed")
                ? sessionStorage.getItem("userLoginToken")
                : localStorage.getItem("token")
            }`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message);
      console.log(response);
      refresh();
      setBtnLoader(false);
    } catch (error) {
      console.log("error: ", error);
      //@ts-ignore
      toast.error(error.response.data.message);
      setBtnLoader(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center items-center bg-white">
        <div className="flex-col justify-center items-center p-14 w-[70%] md:w-[80%] lg:w-[60%] up-img">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Image Div */}

            <div className="flex-col justify-center items-center w-full">
              <div className="flex justify-center items-center">
                <div className="flex justify-center items-center text-center w-[160px] h-[160px] bg-eerieBlack rounded">
                  {image ? (
                    typeof image != "string" ? (
                      <img
                        src={URL.createObjectURL(image)}
                        alt="preview not available"
                        className="object-contain max-h-[160px]"
                      />
                    ) : (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/${image}`}
                        alt="preview not available"
                        className="object-contain max-h-[160px]"
                      />
                    )
                  ) : (
                    <p className="text-center text-floralWhite p-2">
                      Image Preview
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-center items-center gap-3 mt-4">
                <div
                  className="relative cursor-pointer text-red-500 flex flex-col justify-center items-center hover-container"
                  onClick={() => setImage("")}
                >
                  <RiDeleteBin6Line size={22} className="ml-2" />
                  <span className="absolute hidden text-floralWhite bg-blackOlive p-1 border-2 ml-1 rounded-lg mt-2 hover-text-content">
                    remove
                  </span>
                </div>
                <div
                  className="relative cursor-pointer text-blue-600 flex flex-col justify-center items-center hover-container"
                  onClick={() => {
                    //@ts-ignore
                    fileInputRef.current ? fileInputRef.current.click() : "";
                  }}
                >
                  <RiImageAddFill size={22} className="ml-2" />
                  <span className="absolute hidden text-floralWhite bg-blackOlive p-1 border-2 ml-1 rounded-lg mt-2 hover-text-content">
                    Image
                  </span>
                  <div>
                    <input
                      type="file"
                      accept=".png, .jpeg, .jpg"
                      ref={fileInputRef}
                      className="hidden"
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
                            toast.error("Only PNG, JPEG, and JPG files are allowed");
                            return;
                          }

                          if (fileSize > 5 * 1024 * 1024) {
                            toast.error("File size must not exceed 5MB");
                            return;
                          }

                          setImage(file);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-5 mt-10">
              <label className="text-black">Name: </label>
              <br />
              <div className="relative">
                <input
                  {...register("name", {
                    required: "Name is required!",
                    maxLength: {
                      value: 15,
                      message: "Name cannot be longer than 15 characters",
                    },
                  })}
                  onBlur={(e) => {
                    const trimmedValue = e.target.value.trim();
                    //@ts-ignore
                    setValue(e.target.name, trimmedValue);
                  }}
                  placeholder="Name"
                  //@ts-ignore
                  defaultValue={user.name}
                  className="w-full pl-2 text-eerieBlack border-none rounded-md bg-timerWolf"
                />
              </div>
              <p className="text-red-500">{errors.name?.message}</p>
            </div>
            <button
              type="submit"
              className=" btn-enter device-btn bg-timerWolf text-blue-600 font-bold p-2 rounded  w-full"
            >
              {btnLoader ? "Please wait..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
