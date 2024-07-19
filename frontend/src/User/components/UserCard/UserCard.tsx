import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import UserSignin from "../Signin/UserSignin";

export default function UserCard({
  id,
  image,
  name,
}: {
  id: string;
  image: string;
  name: string;
}) {
  const [showSignin, setShowSignin] = useState(false);

  return (
    <>
      <motion.div
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
          boxShadow: "0 0 2px gray, 0 0 6px gray, 0 0 16px gray",
          transition: {
            duration: 0.5,
            ease: "easeInOut",
          },
        }}
        whileHover={{
          scale: 1.05,
          transition: {
            duration: 0.05,
            ease: "linear",
          },
        }}
        className="w-fit card-bg rounded-lg cursor-pointer h-fit-crds"
        onClick={() => setShowSignin(true)}
      >
        <motion.div className="w-[100%] h-[180px] flex justify-center items-center">
          <img
            src={image ? `${import.meta.env.VITE_BACKEND_URL}/${image}` : "/user.png"}
            alt="User Image"
            className="text-center max-h-[180px] object-contain usr profile"
          />
        </motion.div>
        <motion.h1 className="text-3xl font-bold px-2 pt-4 pb-4 max-w-[190px] text-black text-center name-emp">
          {name}
        </motion.h1>
      </motion.div>

      {showSignin ? (
        <AnimatePresence>
          <UserSignin id={id} showSignin={showSignin} setShowSignin={setShowSignin} />
        </AnimatePresence>
      ) : (
        ""
      )}
    </>
  );
}
