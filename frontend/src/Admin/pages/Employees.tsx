import { Table } from "flowbite-react";
import EmployeeInfo from "../components/EmployeeInfo/EmployeeInfo";
import { IoIosSearch } from "react-icons/io";
import { useEffect, useState } from "react";
import Spinner from "../../Common/Spinner";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import useDebouce from "../../hooks/useDebounce";
import Pager from "../../Common/Pager";
import { FaUserPlus } from "react-icons/fa6";

interface Employee {
  id: string;
  name: string;
  email: string;
  image: string;
}

export default function Employees() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pageChangeLoader, setPageChangeLoader] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [toggleRender, setToggleRender] = useState(false);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const debouncedFilter = useDebouce(filter, 500);

  useEffect(() => {
    async function getData() {
      setPageChangeLoader(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/admin/employee/bulk?perPage=${perPage}&page=${page}&filter=${debouncedFilter}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setEmployees(response.data.employees);
        setTotalEmployee(response.data.totalEmployee);
        await new Promise((r) => setTimeout(r, 500));
        setLoading(false);
        setPageChangeLoader(false);
      } catch (error) {
        console.log("error in employees: ", error);
        //@ts-ignore
        if (error.response.data.message === "Unauthorized") {
          toast.error("unauthorized redirecting to signin");
          await new Promise((r) => setTimeout(r, 1500));
          navigate("/admin/signin");
        }
      }
    }
    getData();
  }, [toggleRender, debouncedFilter, page, perPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="p-5">
        <div className="flex justify-between items-center mb-1 pb-1">
          <h1 className="text-xl pb-3 pl-2 text-floralWhite">
            Employees({totalEmployee})
          </h1>
          <div className="flex justify-center items-center gap-2">
            <div className="relative ">
              <input
                type="text"
                placeholder="Search..."
                className="bg-blackOlive border-none w-full rounded-lg text-floralWhite placeholder:text-floralWhite p-3"
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(1);
                }}
              />
              <IoIosSearch
                size={22}
                color=" floralWhite"
                className="absolute top-3 left-[85%]"
              />
            </div>
            <Link to={`/admin/addEmployee`}>
              <div className="border bg-blackOlive text-floralWhite p-3 rounded-lg flex justify-center items-center cursor-pointer">
                <FaUserPlus size={20} />
              </div>
            </Link>
          </div>
        </div>
        <Table striped className="w-full">
          <Table.Head>
            <Table.HeadCell className="text-base bg-blackOlive text-flame">
              S.No
            </Table.HeadCell>
            <Table.HeadCell className="text-base bg-blackOlive text-flame">
              Name
            </Table.HeadCell>
            <Table.HeadCell className="text-base bg-blackOlive text-flame">
              Email
            </Table.HeadCell>
            <Table.HeadCell className="text-base bg-blackOlive text-flame">
              Image
            </Table.HeadCell>
            <Table.HeadCell
              className="text-base text-center bg-blackOlive text-flame"
              colSpan={1}
            >
              Actions
            </Table.HeadCell>
            <Table.HeadCell className="text-base bg-blackOlive text-flame">
              Login
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y relative">
            {/* we will be rendering the employee info here */}
            {pageChangeLoader ? (
              <Table.Row>
                <Table.Cell colSpan={8} className="bg-eerieBlack">
                  <div className="flex justify-center items-center pt-[20%]">
                    <Spinner />
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : (
              <>
                {employees.map((employee, index) => {
                  return (
                    <EmployeeInfo
                    //@ts-ignore
                      id={employee._id}
                      //@ts-ignore
                      key={employee._id}
                      index={perPage * (page - 1) + index}
                      name={employee.name}
                      email={employee.email}
                      image={employee.image}
                      setToggleRender={setToggleRender}
                    />
                  );
                })}
              </>
            )}
          </Table.Body>
        </Table>
        {!pageChangeLoader ? (
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
              totalObjects={totalEmployee}
              currPage={page}
              perPage={perPage}
              setPage={setPage}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
