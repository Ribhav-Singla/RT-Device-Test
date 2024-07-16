import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function UserProtected({ children }: { children: ReactNode }) {
  const [isUser, setIsUser] = useState<boolean | null>(null);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/routeProtect`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('userLoginAllowed') ? sessionStorage.getItem('userLoginToken') : localStorage.getItem("token")}`,
        }
        });
        if (response.data.message === "success") {
          setIsUser(true);
        } else {
          setIsUser(false);
        }
      } catch (error) {
        console.log('Error occurred in checking user protection:', error);
        setIsUser(false);
      }
    }
    getData();
  }, []);

  if (isUser === null) {
    return <div className="text-white text-3xl font-semibold flex justify-center items-center bg-eerieBlack min-h-screen">Loading...</div>; 
  }

  return isUser ? <>{children}</> : <Navigate to="/users" />;
}
