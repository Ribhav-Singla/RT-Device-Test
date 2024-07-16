import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AdminDashboard from "./Admin/pages/Dashboard"
import AdminSignin from "./Admin/components/Signin/Signin"
import AddDevice from "./Admin/pages/AddDevice"
import Logs from "./Admin/pages/Logs"
import Employees from "./Admin/pages/Employees"
import AddEmployee from "./Admin/pages/AddEmployee"
import Devices from "./Admin/pages/Devices"
import { Toaster } from "react-hot-toast"
import UpdateEmployee from "./Admin/components/UpdateEmployee/UpdateEmployee"
import UpdateDevice from "./Admin/components/UpdateDevice/UpdateDevice"
import ViewEmployee from "./Admin/components/viewEmployee/viewEmployee"
import ViewDevice from "./Admin/components/viewDevice/viewDevice"
import ChangePassword from "./Admin/components/ChangeEmployeePassword/ChangeEmployeePassword"
import Users from "./User/pages/Users"
import AvailableDevices from "./User/pages/AvailableDevices"
import CurrentDevices from "./User/pages/CurrentDevices"
import LiveDashboad from "./Admin/pages/LiveDashboad"
import UserDashboard from "./User/pages/UserDashboard"
import UpdatePassword from "./User/components/UpdatePassword/UpdatePassword"
import UpdateImage from "./User/components/UpdateImage.tsx/UpdateImage"
import UserAccess from "./Admin/pages/userAccess"
import AdminProtected from "./Admin/AdminProtected"
import UserProtected from "./User/UserProtected"

function App() {
  return (
    <BrowserRouter>
    <Toaster/>
        <Routes>
            {/* home route */}
            <Route path="/" element={<Navigate to="/users" />}/>

            {/* admin routes */}
            <Route path="/admin/signin" element={<AdminSignin />} />
            <Route path="/admin" element={<AdminProtected><AdminDashboard /></AdminProtected>}>
              <Route path="liveDashboard" element={<LiveDashboad />} />
              <Route path="addDevice" element={<AddDevice />} />
              <Route path="updateDevice/:id" element={<UpdateDevice />} />
              <Route path="viewDevice/:id" element={<ViewDevice />} />
              <Route path="devices" element={<Devices />} />
              <Route path="addEmployee" element={<AddEmployee />} />
              <Route path="updateEmployee/:id" element={<UpdateEmployee />} />
              <Route path="changeEmployeePassword/:id" element={<ChangePassword />} />
              <Route path="viewEmployee/:id" element={<ViewEmployee />} />
              <Route path="employees" element={<Employees />} />
              <Route path="logs" element={<Logs />} />
            </Route>
            <Route path="/adminAccessUser/:userLoginToken" element={<UserAccess />} />

            {/* user routes */}
            <Route path="/users" element={<Users/>} />
            <Route path="/user" element={<UserProtected><UserDashboard/></UserProtected>} >
              <Route path="availableDevices" element={<AvailableDevices/>} />
              <Route path="currentDevices" element={<CurrentDevices/>} />
              <Route path="updatePassword" element={<UpdatePassword/>}/>
              <Route path="updateImage" element={<UpdateImage/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
