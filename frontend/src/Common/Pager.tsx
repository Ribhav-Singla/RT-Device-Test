import { Pagination } from "flowbite-react";
import { Dispatch, SetStateAction } from "react";

export default function Component({totalObjects,currPage,perPage,setPage}:{totalObjects:number,currPage:number,perPage:number,setPage:Dispatch<SetStateAction<number>>}) {
  const totalPages = Math.ceil(totalObjects/perPage)
  const onPageChange = (page: number) =>{
    //@ts-ignore
    setPage(page)
  } 
  return (
    <div className="flex overflow-x-auto sm:justify-center">
      <Pagination currentPage={currPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
