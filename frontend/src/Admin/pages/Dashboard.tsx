import { useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet , useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate()

  const handleSignOut = async()=>{
    localStorage.removeItem("token");
    await new Promise((r)=>setTimeout(r,500))
    navigate('/admin/signin')
  }

  useEffect(()=>{
    sessionStorage.setItem('userLoginAllowed','True');
    
    return ()=>{
      sessionStorage.setItem('userLoginAllowed','False')
    }
  },[])

  return (
    <>
      <div className="grid grid-cols-12">
        <Sidebar/>
        <div className="grid col-span-9 lg:col-span-10 ">
          <div className="flex justify-end pr-5 font-semibold p-3 border-b-2 border-black bg-flame" style={{borderBottomColor:"#CCC5B9"}}>
            <h1 className="cursor-pointer" onClick={handleSignOut}>Sign out</h1>
          </div>
          <div className=" min-h-screen">
            {/* we will render the corresponding components here... */}
            <Outlet/>
          </div>
        </div>
      </div>
    </>
  );
}
