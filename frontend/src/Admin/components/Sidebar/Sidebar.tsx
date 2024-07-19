import { Link } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import Logo from '/vite.png'


export default function Sidebar({showSideBar}:{showSideBar:boolean}){
    if(!showSideBar){
      return <>
      </>
    }
    else return (
        <>
        <div className="grid side-bar col-span-3 lg:col-span-2 border-r-2 relative" style={{borderRightColor:"#CCC5B9"}}>
          <Link to='/admin'>
            <h1 className="side-mob font-semibold p-3 border-b-2 h-fit cursor-pointer flex gap-3 items-center border-black bg-flame" style={{borderBottomColor:"#CCC5B9"}}>
              <span>
                  <img src={Logo} alt="Logo" className="max-w-[20px]" />
              </span>
              Esferasoft Devices
            </h1>
          </Link>
          <div className="absolute top-[4.5em] left-0 w-full sidebar-setting" >
            <div className="mt-2 pb-2 cursor-pointer select-none border-b-2 bg-eerieBlack">
              <Link to={'/admin/liveDashboard'}>
                <p className="text-lg p-2 font-semibold pl-5 text-flame z-20">Dashboard</p>
              </Link>
            </div>
            <Dropdown dropDown={"Devices"} dropDownItem={[{value:"Add a device",link:"addDevice"},{value:"All devices",link:"devices"}]}/>
            <Dropdown dropDown={"Employees"} dropDownItem={[{value:"Add an employee",link:"addEmployee"},{value:"All employees",link:"employees"}]}/>
            <div className="pb-2 cursor-pointer select-none border-b-2 z-10 bg-eerieBlack">
              <Link to={'logs'}>
                <p className="text-lg p-2 font-semibold pl-5 z-10 text-flame">Logs</p>
              </Link>
            </div>
          </div>
        </div>
        </>
    )
}