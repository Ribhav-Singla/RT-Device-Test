import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [showSideBar, setShowSideBar] = useState(window.innerWidth > 990);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 990);

  const handleSignOut = async () => {
    localStorage.removeItem("token");
    await new Promise((r) => setTimeout(r, 500));
    navigate('/admin/signin');
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 990);
      setShowSideBar(window.innerWidth > 990);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem('userLoginAllowed', 'True');

    return () => {
      sessionStorage.setItem('userLoginAllowed', 'False');
      sessionStorage.setItem('userLoginToken', '/');
    };
  }, []);

  return (
    <>
      <div className="grid grid-cols-12 dev-det">
        <Sidebar showSideBar={showSideBar} />
        <div className="grid col-span-9 lg:col-span-10 ">
          <div className="details-device">
            <div className="set-ht flex justify-end items-center pr-5 font-semibold p-3 border-b-2 border-black bg-flame menu-btn-container" style={{ borderBottomColor: "#CCC5B9" }}>
              {!isLargeScreen && (
                <div className="side-menu cursor-pointer z-10" onClick={() => setShowSideBar(!showSideBar)}>
                  <GiHamburgerMenu color="black" size={35} />
                </div>
              )}
              
              <h1 className="logoff cursor-pointer" onClick={handleSignOut}>Sign out</h1>
            </div>
            <div className="min-h-screen">
              {/* we will render the corresponding components here... */}
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
