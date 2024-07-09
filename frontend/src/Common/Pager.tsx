import { Pagination } from "flowbite-react";

export default function Component({totalObjects,currPage,perPage,setPage}:{totalObjects:number,currPage:number,perPage:number,setPage:()=>void}) {
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
