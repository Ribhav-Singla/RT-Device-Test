import { useEffect, useState } from "react";
import UserCard from "../components/UserCard/UserCard";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import useDebouce from "../../hooks/useDebounce";

export default function Users() {
  const [users, setUsers] = useState([]);
  console.log(users);
  
  const [filter,setFilter] = useState('')

  const debounceFilter = useDebouce(filter,500) 
  
  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/users?filter=${debounceFilter}`
        );
        setUsers(response.data.users);
      } catch (error) {
        console.log("error: ", error);
      }
    }
    getData();
  }, [debounceFilter]);

  return (
    <>
      <div className="min-h-screen bg-white p-4 flex-col justify-center items-center">
        <div className=" flex justify-center items-center w-full mb-5">
          <div className="relative w-[50%]">
            <input
              type="text"
              placeholder="Search..."
              className="  rounded-full pl-5 bg-gray-100 text-black text-lg w-full"
              onChange={(e)=>setFilter(e.target.value)}
            />
            <FaSearch
              color="gray"
              className="text-black-400 absolute top-4 left-[90%]"
            />
          </div>
        </div>
        <div className="p-6 flex justify-center items-start flex-wrap gap-x-7 gap-y-7">
          {users.map((user) => (
            //@ts-ignore
            <UserCard key={user._id} id={user._id} image={user.image} name={user.name} />
          ))}
        </div>
      </div>
    </>
  );
}
