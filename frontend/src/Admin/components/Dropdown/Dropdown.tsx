import { useState } from "react";
import { Link } from "react-router-dom";
import {motion} from 'framer-motion'

type dropDownItems = {
  value: string,
  link : string
}

export default function Dropdown({
  dropDown,
  dropDownItem,
}: {
  dropDown: string;
  dropDownItem: dropDownItems[]
}) {
  const [option, setOption] = useState(false);
  return (
    <>
      <div>
        <div
          className="mt-2 pb-2 relative cursor-pointer select-none border-b-2 w-full"
          onClick={() => setOption(!option)}
        >
          <p className="text-lg p-2 font-semibold pl-5 text-flame">{dropDown}</p>
          {option ? (
            <svg
              className="w-6 h-6  absolute top-3 left-[80%] text-floralWhite"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m5 15 7-7 7 7"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 absolute top-3 left-[80%] text-floralWhite"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 9-7 7-7-7"
              />
            </svg>
          )}
        </div>
        {option ? (
          <div>
            {dropDownItem.map((item) => {
              return (
                <motion.h1 initial={{
                  scale:0.5
                }}
                animate={{
                  scale:1
                }} 
                className="text-lg p-2 font-semibold pl-5 bg-blackOlive border-b-2 text-floralWhite">
                  <Link to={item.link}>
                    {item.value}
                  </Link>
                </motion.h1>
              );
            })}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
