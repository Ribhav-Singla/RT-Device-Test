import { Link } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";

export default function Sidebar(){
    return (
        <>
        <div className="grid col-span-3 lg:col-span-2 border-r-2 relative" style={{borderRightColor:"#CCC5B9"}}>
          <Link to='/admin'>
            <h1 className="font-semibold p-3 border-b-2 h-fit cursor-pointer border-black bg-flame" style={{borderBottomColor:"#CCC5B9"}}>
              Esferasoft
            </h1>
          </Link>
          <div className="absolute top-12 left-0 w-full" >
            <div className="mt-2 pb-2 cursor-pointer select-none border-b-2">
              <Link to={'/admin/liveDashboard'}>
                <p className="text-lg p-2 font-semibold pl-5 text-flame">Dashboard</p>
              </Link>
            </div>
            <Dropdown dropDown={"Devices"} dropDownItem={[{value:"Add a device",link:"addDevice"},{value:"All devices",link:"devices"}]}/>
            <Dropdown dropDown={"Employees"} dropDownItem={[{value:"Add an employee",link:"addEmployee"},{value:"All employees",link:"employees"}]}/>
            <div className="mt-2 pb-2 cursor-pointer select-none border-b-2">
              <Link to={'logs'}>
                <p className="text-lg p-2 font-semibold pl-5 text-flame">Logs</p>
              </Link>
            </div>
          </div>
        </div>
        </>
    )
}