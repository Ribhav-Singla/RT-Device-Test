import { Table } from "flowbite-react";
import { RiDeleteBin4Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { useState } from "react";
import { VscPreview } from "react-icons/vsc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TfiEye } from "react-icons/tfi";
import { FaUnlockAlt } from "react-icons/fa";
import toast from "react-hot-toast";

export default function EmployeeInfo({
  id,
  index,
  name,
  email,
  image,
  setToggleRender,
}: {
  id: string;
  index: number;
  name: string;
  email: string;
  image: string;
  setToogleRender: () => void;
}) {
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [deleteBtnLoader, setDeleteBtnLoader] = useState(false);
  const [userLoginBtnLoader,setUserLoginBtnLoader] = useState(false);

  const handleDelete = async () => {
    setDeleteBtnLoader(true);
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/admin/employee/delete/${id}`,
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
      console.log(response);
    } catch (error) {
      console.log("error occured while deleting the employee: ", error);
    }
  };

  const handleUserLogin = async()=>{
    if(!sessionStorage.getItem('userLoginAllowed')){
      toast.error('user login not allowed');
      return ;
    }
    try {
      setUserLoginBtnLoader(true)
      const response = await axios.post(`http://localhost:3000/api/v1/admin/auth/userLogin/${id}`,{},{
        headers:{
          'Authorization' : `${localStorage.getItem('token')}`
        }
      })
      sessionStorage.setItem('userLoginToken',response.data.token)
      setUserLoginBtnLoader(false)      
    } catch (error) {
      console.log('error occured while admin userLogin: ',error);
      setUserLoginBtnLoader(false);
    }
  }

  return (
    <>
      <Table.Row>
        <Table.Cell className="whitespace-nowrap font-medium  text-base bg-eerieBlack text-floralWhite">
          {index + 1}
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium  text-base bg-eerieBlack text-floralWhite">
          {name}
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium text-base bg-eerieBlack text-floralWhite">
          {email}
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium  text-base pt-1 pb-1 bg-eerieBlack">
          <div className="w-[60px] h-[60px] rounded bg-eerieBlack flex justify-center items-center">
            <img
              src={
                image
                  ? `http://localhost:3000/${image}`
                  : "https://static.vecteezy.com/system/resources/previews/026/960/752/non_2x/invalid-user-profile-important-caution-notice-of-personal-fake-account-internet-person-id-and-fraud-risk-data-alert-male-user-warning-icon-illustration-filled-outline-style-eps10-vector.jpg"
              }
              alt="Employee Image"
              className="rounded object-contain max-h-[40px]"
            />
          </div>
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium text-blue-500 text-center text-base bg-eerieBlack">
          <div className="flex justify-center items-center gap-10">
            <div
              className="relative cursor-pointer flex flex-col justify-center items-center hover-container"
              onClick={() => navigate(`/admin/viewEmployee/${id}`)}
            >
              <TfiEye size={24} className="ml-2" />
              <span className="absolute hidden text-floralWhite bg-blackOlive p-1 border-2 ml-1 rounded-lg mt-2 hover-text-content">
                view
              </span>
            </div>
            <div
              className="relative cursor-pointer text-yellow-500 flex flex-col justify-center items-center hover-container"
              onClick={() => navigate(`/admin/changeEmployeePassword/${id}`)}
            >
              <FaUnlockAlt size={20} className="ml-2" />
              <span className="absolute hidden text-floralWhite bg-blackOlive p-1 border-2 ml-1 rounded-lg mt-2 hover-text-content">
                change password
              </span>
            </div>
            <div
              className="relative cursor-pointer text-green-500 flex flex-col justify-center items-center hover-container"
              onClick={() => navigate(`/admin/updateEmployee/${id}`)}
            >
              <FiEdit size={20} className="ml-2" />
              <span className="absolute hidden text-floralWhite bg-blackOlive p-1 border-2 ml-1 rounded-lg mt-2 hover-text-content">
                edit
              </span>
            </div>
            <div
              className="relative cursor-pointer text-red-500 flex flex-col justify-center items-center hover-container"
              onClick={()=>setIsDelete(!isDelete)}
            >
              <RiDeleteBin4Line size={20} className="ml-2" />
              <span className="absolute hidden text-floralWhite bg-blackOlive p-1 border-2 ml-1 rounded-lg mt-2 hover-text-content">
                delete
              </span>
            </div>
          </div>
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium text-base bg-eerieBlack text-floralWhite">
          <button className="bg-blue-500 p-1 rounded-lg px-2 font-semibold" onClick={handleUserLogin}>{userLoginBtnLoader ? 'wait...' : 'Login'}</button>
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
                Are you sure you want to delete this employee?
              </p>
              <div>
                <p>{name}</p>
                <p>{email}</p>
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
