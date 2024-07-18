import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../Common/Spinner";
import Pager from "../../Common/Pager";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import EmployeeFilter from "../components/utils/EmployeeFilter";
import DeviceFilter from "../components/utils/DeviceFilter";
import { Datepicker } from "flowbite-react";
import {motion} from 'framer-motion'
import LogInfo from "../components/LogInfo/LogInfo";

export default function Logs() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [pageChangeLoader, setPageChangeLoader] = useState(false);  
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [toggleRender,setToggleRender] = useState(false)

  const [showEmployee,setShowEmployee] = useState(false);
  const [showDevice,setShowDevice] = useState(false);
  const [showDate,setShowDate] = useState(false);
  const [filterselectedEmployees,setFilterSelectedEmployees] = useState<String[]>([])
  const [filterselectedDevices,setFilterSelectedDevices] = useState<String[]>([])
  const [filterDate,setFilterDate] = useState("") 

  useEffect(() => {
    async function getData() {
      try {
        setPageChangeLoader(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/log/bulk?perPage=${perPage}&page=${page}&filterEmployees=${filterselectedEmployees}&filterDevices=${filterselectedDevices}&filterDate=${filterDate}`
        );
        setLogs(response.data.logs);
        setTotalLogs(response.data.totalLogs);
        await new Promise((r) => setTimeout(r, 500));
        setPageChangeLoader(false)
        setLoading(false);
    } catch (error) {
        console.log("error in logs: ", error);
        setPageChangeLoader(false)
        setLoading(false);
      }
    }
    getData();
  }, [toggleRender,page, perPage,filterDate,filterselectedDevices,filterselectedEmployees]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <Spinner />
      </div>
    );
  }
  return (
    <>
      <div className="p-5 w-full">
        <div className="flex justify-between items-center mb-1 pb-1">
          <h1 className="text-xl pb-3 pl-2 text-floralWhite">
            Logs({totalLogs})
          </h1>
          <div className="flex-col justify-center items-center gap-2">
            <div className="flex justify-center items-center gap-3">
              <div className="flex justify-center items-center border-2 rounded-lg p-2 gap-4 cursor-pointer w-full" onClick={()=>{
                setShowEmployee(!showEmployee)
                if(showDate) setShowDate(false)
                if(showDevice) setShowDevice(false)
              }}>
                  <h1 className="text-floralWhite rounded-lg">Employee</h1>
                  {
                    !showEmployee ? <IoMdArrowDropdown size={25} color="white"/> : <IoMdArrowDropup size={25} color="white"/>
                  }
              </div>
              <div className="flex justify-center items-center border-2 rounded-lg p-2 gap-4 cursor-pointer" onClick={()=>{
                setShowDevice(!showDevice)
                if(showDate) setShowDate(false)
                if(showEmployee) setShowEmployee(false)
              }}>
                  <h1 className="text-floralWhite rounded-lg">Device</h1>
                  {
                    !showDevice ? <IoMdArrowDropdown size={25} color="white"/> : <IoMdArrowDropup size={25} color="white"/>
                  }
              </div>
              <div className="flex justify-center items-center border-2 rounded-lg p-2 gap-4 cursor-pointer" onClick={()=>{
                setShowDate(!showDate)
                if(showDevice) setShowDevice(false)
                if(showEmployee) setShowEmployee(false)
              }}>
                  <h1 className="text-floralWhite rounded-lg">Date</h1>
                  {
                    !showDate ? <IoMdArrowDropdown size={25} color="white"/> : <IoMdArrowDropup size={25} color="white"/>
                  }
              </div>
            </div>
            <div className="relative flex justify-center w-full">
              {
                //@ts-ignore
                showEmployee ? <EmployeeFilter filterselectedEmployees={filterselectedEmployees} setFilterSelectedEmployees={setFilterSelectedEmployees} setPage={setPage}/> : ""
              }
              {
                //@ts-ignore
                showDevice ? <DeviceFilter filterselectedDevices={filterselectedDevices} setFilterSelectedDevices={setFilterSelectedDevices} setPage={setPage}/> : ""
              }
              {
                showDate ? 
                <motion.div initial={{
                  scale:0.5
                }}
                animate={{
                  scale:1
                }} className="max-w-[60%] mt-2 absolute top-0 left-0 z-10">
                  <Datepicker 
                    defaultValue={Date.now()}
                    onSelectedDateChanged={
                      //@ts-ignore
                      (e:SetStateAction<string>)=>{
                        setFilterDate(e)
                        setPage(1)
                      }
                      
                  }/>
                </motion.div> 
                : ""
              }
            </div>
          </div>
        </div>
        <div className="test">
        <Table striped className="w-[100%] demo">
          <Table.Head>
            <Table.HeadCell className=" text-base bg-blackOlive text-flame">
              S.No
            </Table.HeadCell>
            <Table.HeadCell
              className=" text-base bg-blackOlive text-flame text-center"
              colSpan={2}
            >
              Employee
            </Table.HeadCell>
            <Table.HeadCell
              className="text-base bg-blackOlive text-flame text-center"
              colSpan={2}
            >
              Device
            </Table.HeadCell>
            <Table.HeadCell className="text-base bg-blackOlive text-flame text-center">
              Login
            </Table.HeadCell>
            <Table.HeadCell className="text-base  bg-blackOlive text-flame text-center">
              Logout
            </Table.HeadCell>
            <Table.HeadCell className="text-base  bg-blackOlive text-flame text-center">
              Status
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y relative">
            {pageChangeLoader ? (
                <>
                    <Table.Row>
                        <Table.Cell colSpan={9} className="bg-eerieBlack">
                        <div className="flex justify-center items-center pt-[20%]">
                            <Spinner />
                        </div>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                    </Table.Row>
                </>
            ) : (
              logs.map((log, index) => {
                return (
                  <>
                    <LogInfo log={log} perPage={perPage} page={page} index={index} setToggleRender={setToggleRender} />
                  </>
                );
              })
            )}
          </Table.Body>
        </Table>
        </div>
        
        {
            !pageChangeLoader ?

                <div className="flex justify-between items-center">
                <div className="flex justify-center items-center gap-2 pt-1">
                    <p className="text-flame">per page.</p>
                    <select
                    className="rounded-lg p-[5px] mt-1"
                    value={perPage}
                    onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setPage(1);
                    }}
                    >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    </select>
                </div>
                <Pager
                    totalObjects={totalLogs}
                    currPage={page}
                    perPage={perPage}
                    //@ts-ignore
                    setPage={setPage}
                />
                </div>

                :
                ""
        }
      </div>
    </>
  );
}
