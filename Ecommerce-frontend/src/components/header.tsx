import { useState } from "react";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
const user = { _id: "asdf", roll: "admin" };
const header = () => {
    const [isOpen,setIsOpen] = useState<Boolean>(false);
    const signOutHandler = () =>{
        setIsOpen(false)
    }
  return (
    <nav className="header">
      <Link to={"/"}>Home</Link>
      <Link  to={"/search"}>
        {" "}
        <FaSearch  />{" "}
      </Link>   
      <Link to="/cart">
        <FaShoppingBag />
      </Link>

      {user._id ? (
        <>
          <button>
            <FaUser  onClick={()=> setIsOpen((prev)=> !prev)} />
          </button>
          <dialog open={isOpen}>
            <div>
              {user.roll === "admin" && (
                <Link onClick={()=> setIsOpen(false)} to={"/admin/dashboard"}>Admin</Link>
              )}
              <Link onClick={()=> setIsOpen(false)} to={"/orders"}>Orders</Link>
              <button onClick={signOutHandler} >
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to="/login">
          <FaSignInAlt />
        </Link>
      )}
    </nav>
  );
};

export default header;
