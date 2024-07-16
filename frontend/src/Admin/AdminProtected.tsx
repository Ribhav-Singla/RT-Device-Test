import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function AdminProtected({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/auth/me`, {
          headers: {
            "Authorization": `${localStorage.getItem("token")}`
          }
        });
        if (response.data.message === "success") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.log('Error occurred in checking admin protection:', error);
        setIsAdmin(false);
      }
    }
    getData();
  }, []);

  if (isAdmin === null) {
    return <div className="text-white text-3xl font-semibold flex justify-center items-center bg-eerieBlack min-h-screen">Loading...</div>; 
  }

  return isAdmin ? <>{children}</> : <Navigate to="/admin/signin" />;
}
