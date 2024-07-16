import { Table } from "flowbite-react";
import { RiDeleteBin4Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TfiEye } from "react-icons/tfi";
import Device from "/Device.png";

export default function DeviceInfo({
  id,
  index,
  model,
  company,
  image,
  setToggleRender,
}: {
  id: number;
  index: number;
  model: string;
  company: string;
  image: string;
  setToggleRender: Dispatch<SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [deleteBtnLoader, setDeleteBtnLoader] = useState(false);

  const handleDelete = async () => {
    setDeleteBtnLoader(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/device/delete/${id}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      await new Promise((r) => setTimeout(r, 1000));
      setDeleteBtnLoader(false);
      setIsDelete(!isDelete);
      //@ts-ignore
      setToggleRender((prev) => !prev);
    } catch (error) {
      console.log("error occured while deleting the employee: ", error);
    }
  };

  return (
    <>
      <Table.Row>
        <Table.Cell className="whitespace-nowrap font-medium  text-base bg-eerieBlack text-floralWhite">
          {index + 1}
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium  text-base bg-eerieBlack text-floralWhite">
          {model}
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium  text-base bg-eerieBlack text-floralWhite">
          {company}
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium  text-base pt-1 pb-1 bg-eerieBlack">
          <div className="w-[60px] h-[60px] flex justify-center items-center rounded">
            <img
              src={
                image
                  ? `${import.meta.env.VITE_BACKEND_URL}/${image}`
                  : Device
              }
              alt="Device Image"
              className="rounded object-contain max-h-[45px]"
            />
          </div>
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium text-blue-500 text-center text-base bg-eerieBlack">
          <div className="flex justify-center items-center gap-10">
            <div
              className="relative cursor-pointer flex flex-col justify-center items-center hover-container"
              onClick={() => navigate(`/admin/viewDevice/${id}`)}
            >
              <TfiEye size={24} className="ml-2" />
              <span className="absolute hidden text-floralWhite bg-blackOlive p-1 border-2 ml-1 rounded-lg mt-2 hover-text-content">
                view
              </span>
            </div>
            <div
              className="relative cursor-pointer flex flex-col text-green-500 justify-center items-center hover-container"
              onClick={() => navigate(`/admin/updateDevice/${id}`)}
            >
              <FiEdit size={20} className="ml-2" />
              <span className="absolute hidden text-floralWhite bg-blackOlive p-1 border-2 ml-1 rounded-lg mt-2 hover-text-content">
                edit
              </span>
            </div>
            <div
              className="relative cursor-pointer flex flex-col text-red-500 justify-center items-center hover-container"
              onClick={() => setIsDelete(!isDelete)}
            >
              <RiDeleteBin4Line size={20} className="ml-2" />
              <span className="absolute hidden text-floralWhite bg-blackOlive p-1 border-2 ml-1 rounded-lg mt-2 hover-text-content">
                delete
              </span>
            </div>
          </div>
        </Table.Cell>
      </Table.Row>

      <Table.Row>
        <div></div>
      </Table.Row>

      <Table.Row>
        {isDelete ? (
          <div className="overlay">
            <div className="whitespace-nowrap font-medium  text-base bg-blackOlive text-floralWhite text-center rounded-md py-5 px-5 delete-btn">
              <p className="text-flame">
                Are you sure you want to delete this device?
              </p>
              <div>
                <p>{model}</p>
                <p>{company}</p>
              </div>
              <div className="flex justify-center items-center gap-5 cursor-pointer mt-4">
                <span
                  className="text-blue-500 bg-eerieBlack py-2 px-4 rounded"
                  onClick={handleDelete}
                >
                  {deleteBtnLoader ? "Deleting..." : "Yes"}
                </span>
                {deleteBtnLoader ? (
                  ""
                ) : (
                  <span
                    className="text-red-600 bg-eerieBlack py-2 px-4 rounded"
                    onClick={() => setIsDelete(!isDelete)}
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
      </Table.Row>
    </>
  );
}
