import { Table } from "flowbite-react";
import { BsSend } from "react-icons/bs";
import Device from "/Device.png";
import { Dispatch, SetStateAction, useState } from "react";
import { LiaHourglassEndSolid } from "react-icons/lia";
import axios from "axios";

interface Log {
  _id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  loginTime: string;
  logoutTime: string;
  device: {
    _id: string;
    bookedBy: string;
    company: string;
    createdAt: string;
    image: string;
    isBooked: boolean;
    model: string;
  };
  employee: {
    _id: string;
    createdAt: string;
    devices: string[];
    email: string;
    image: string;
    name: string;
    password: string;
  };
}

export default function ({
  log,
  perPage,
  page,
  index,
  setToggleRender,
}: {
  log: Log;
  perPage: number;
  page: number;
  index: number;
  setToggleRender: Dispatch<SetStateAction<boolean>>;
}) {

  const [status, setStatus] = useState("pending");
  const [btnLoader, setBtnLoader] = useState(false);

  const handleStatus = async () => {
    if (status === "pending") {
      return;
    }
    setBtnLoader(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/log/updateStatus/${log._id}`,
        {
          status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      setBtnLoader(false);
      //@ts-ignore
      setToggleRender((prev) => !prev);
    } catch (error) {
      console.log("error occured while updating status: ", error);
      setBtnLoader(false);
    }
  };

  return (
    <>
      <Table.Row>
        <Table.Cell className="whitespace-nowrap font-medium  text-base bg-eerieBlack text-floralWhite">
          {perPage * (page - 1) + index + 1}
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium  text-base bg-eerieBlack text-floralWhite">
          {
            //@ts-ignore
            log.employee.name
          }
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium  text-base pt-1 pb-1 bg-eerieBlack">
          <div className="w-[60px] h-[60px] flex justify-center items-center rounded">
            <img
              src={
                //@ts-ignore
                log.employee.image
                  ? //@ts-ignore
                    `${import.meta.env.VITE_BACKEND_URL}/${log.employee.image}`
                  : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=338&ext=jpg&ga=GA1.1.2113030492.1720051200&semt=ais_user"
              }
              alt="Employee Image"
              className="rounded object-contain max-h-[45px]"
            />
          </div>
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium  text-base bg-eerieBlack text-floralWhite">
          {
            //@ts-ignore
            log.device.model
          }
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium  text-base bg-eerieBlack text-floralWhite">
          {
            //@ts-ignore
            log.device.company
          }
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium  text-base pt-1 pb-1 bg-eerieBlack">
          <div className="w-[60px] h-[60px] flex justify-center items-center rounded">
            <img
              src={
                //@ts-ignore
                log.device.image
                  ? `${import.meta.env.VITE_BACKEND_URL}/${log.device.image}`
                  : Device
              }
              alt="Device Image"
              className="rounded object-contain max-h-[50px]"
            />
          </div>
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium  text-base text-center bg-eerieBlack text-floralWhite">
          {
            //@ts-ignore
            new Date(log.loginTime).toLocaleTimeString()
          }
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium  text-base text-center bg-eerieBlack text-floralWhite">
          {
            //@ts-ignore
            log.logoutTime
              ? //@ts-ignore
                new Date(log.logoutTime).toLocaleTimeString()
              : "---"
          }
        </Table.Cell>

        {!log.status || log.status === "Pending" ? (
          <>
            <Table.Cell className="bg-eerieBlack flex justify-center items-center gap-5">
              <select
                className={`rounded-lg bg-blackOlive text-floralWhite`}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option
                  value="Pending"
                  defaultChecked
                  className="text-blue-500"
                >
                  Pending
                </option>
                <option value="Accepted" className="text-green-500">
                  Accepted
                </option>
                <option value="Rejected" className="text-red-600">
                  Rejected
                </option>
              </select>
              {!btnLoader ? (
                <BsSend
                  className="text-flame cursor-pointer"
                  size={20}
                  onClick={handleStatus}
                />
              ) : (
                <LiaHourglassEndSolid className="text-flame" size={20} />
              )}
            </Table.Cell>
          </>
        ) : (
          <Table.Cell className="whitespace-nowrap font-medium  text-base text-center bg-eerieBlack text-floralWhite">
            {log.status === "Accepted" ? (
              <h1 className="text-green-500">Accepted</h1>
            ) : (
              <h1 className="text-red-500">Rejected</h1>
            )}
          </Table.Cell>
        )}
      </Table.Row>
      <Table.Row>
        <div></div>
      </Table.Row>
    </>
  );
}
