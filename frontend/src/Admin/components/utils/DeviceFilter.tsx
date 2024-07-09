import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import Spinner from "../../../Common/Spinner";
import axios from "axios";
import {motion} from 'framer-motion'

export default function ({
  filterselectedDevices,
  setFilterSelectedDevices,
  setPage
}: {
  filterselectedDevices: string[];
  setFilterSelectedDevices: (filterselectedDevices:string[]) => void;
  setPage: (page:number)=>void
}) {
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/admin/device/models`
        );
        setModels(response.data.models);
        setLoading(false);
      } catch (error) {
        console.log("error in devices: ", error);
        setLoading(false);
      }
    }
    getData();
  }, []);

  const handleSelect = (id: string) => {
    //@ts-ignore
    setFilterSelectedDevices((prev) => {
      const newSelectedDevices = prev.includes(id)
      //@ts-ignore
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      return newSelectedDevices;
    });
    //@ts-ignore
    setPage(1)
  };

  return (
    <>
      <motion.div initial={{
                  scale:0.5
                }}
                animate={{
                  scale:1
                }} className="flex-col justify-center items-center max-w-[60%] absolute top-0 left-0 z-10">
        <div className="relative  mt-2">
          <input
            type="text"
            placeholder="Search..."
            className="bg-slate-100 w-full border-none p-2 rounded bg-gray-600 text-floralWhite placeholder:text-floralWhite"
            onChange={(e) => setFilter(e.target.value)}
          />
          <IoIosSearch
            size={22}
            color="floralWhite"
            className="absolute top-3 left-[85%]"
          />
        </div>
        <div className="w-full bg-black rounded max-h-[160px] overflow-y-scroll">
          {loading ? (
            <div className="flex justify-center items-center py-5">
              <Spinner />
            </div>
          ) : (
            models
              .filter((item) =>
                //@ts-ignore
                item.model.toLowerCase().includes(filter.toLowerCase())
              )
              .map((item) => (
                <div
                  //@ts-ignore
                  key={item._id}
                  className="flex justify-start items-center gap-4 p-2"
                >
                  <input
                    type="checkbox"
                    className="rounded text-flame"
                    //@ts-ignore
                    value={item._id}
                    //@ts-ignore
                    onChange={() => handleSelect(item._id)}
                    //@ts-ignore
                    checked={filterselectedDevices.includes(item._id)}
                  />
                  <h1 className="text-floralWhite text-center">
                    {
                      //@ts-ignore
                      item.model
                    }
                  </h1>
                </div>
              ))
          )}
        </div>
      </motion.div>
    </>
  );
}
