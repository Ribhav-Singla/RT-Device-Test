import { Outlet, useNavigate,Link } from "react-router-dom";
import { Avatar } from "flowbite-react";
import { useRecoilValueLoadable } from "recoil";
import { userAtom } from "../../recoil";
import { Dropdown } from "flowbite-react";
import { useEffect, useState } from "react";

export default function Layout() {
  const userLoadable = useRecoilValueLoadable(userAtom);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userLoadable.state === "hasValue") {
      setUser(userLoadable.contents);     
    }
  }, [userLoadable]);

  return (
    <>
      <div className="flex justify-between items-center w-full bg-floralWhite p-2 border-b-2">
        <button
          className="bg-green-500 text-white text-md font-semibold p-2 rounded"
          onClick={() => {
            navigate("/user/currentDevices");
          }}
        >
          Current Devices
        </button>
        <div className="flex justify-center items-center gap-5">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              //@ts-ignore
              user && user.name ? (
                <div className=" bg-blue-500 px-4 py-2 text-white font-bold text-xl rounded-full">
                  <p>{
                    //@ts-ignore
                  user.name[0].toUpperCase()}</p>
                </div>
              ) : (
                <Avatar
                  img={
                    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b0b4c759-ad9c-4425-a9f4-ab89e2fd9837/de8cefl-35c0bc59-59b9-42ab-b19f-5c73828bb78e.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2IwYjRjNzU5LWFkOWMtNDQyNS1hOWY0LWFiODllMmZkOTgzN1wvZGU4Y2VmbC0zNWMwYmM1OS01OWI5LTQyYWItYjE5Zi01YzczODI4YmI3OGUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.81ixeN9b4cfDmfBlskK9CUyAMDtRhYNU7lfwTI8WI5Q"
                  }
                  alt="Profile"
                  rounded
                  className=" cursor-pointer"
                  onClick={() => navigate("/user/profile")}
                />
              )
            }
          >
            <Link to="/user/updatePassword"><Dropdown.Item  className="text-eerieBlack text-md font-semibold">Change password</Dropdown.Item></Link>
            <Link to="/user/updateImage"><Dropdown.Item  className="text-eerieBlack text-md font-semibold">Profile</Dropdown.Item></Link>
            <Dropdown.Item
              className="text-eerieBlack text-md font-semibold"
              onClick={() => {
                if(sessionStorage.getItem('userLoginAllowed') && sessionStorage.getItem('userLoginToken')){
                  sessionStorage.setItem('userLoginAllowed','False');
                  sessionStorage.setItem('userLoginToken','/');
                }else{
                  localStorage.removeItem("token");
                }
                navigate("/users");
              }}
            >
              Sign out
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
}
