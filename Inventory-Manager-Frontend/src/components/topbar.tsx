import { Link, useNavigate } from "react-router-dom";
import Hamburger from "./hamburger";

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <div
      className={`relative w-full flex flex-row m-0  px-5  h-10 z-30 bg-slate-300`}
    >
      <Hamburger />
      <div
        id="logo"
        className="flex-none flex flex-col  flex-grow md:flex-none text-center md:text-left cursor-pointer group "
        onClick={() => navigate("/")}
      >
        <h1 className="text-xl md:text-2xl font-Roboto transition duration-300 group-hover:translate-x-1 ">
          Inventory Manager
        </h1>
      </div>
      <div
        id="links"
        className=" flex-grow text-xl pr-10 hidden md:flex flex-row justify-end gap-4   items-stretch "
      >
        {location.pathname != "/" && (
          <Link
            className="self-center cursor-pointer hover:text-primary"
            to="/"
          >
            Home
          </Link>
        )}
        {location.pathname != "/products" && (
          <Link
            className="self-center cursor-pointer hover:text-primary"
            to="/products"
          >
            Products
          </Link>
        )}
        {location.pathname != "/parts" && (
          <Link
            className="self-center cursor-pointer hover:text-primary"
            to="/parts"
          >
            Parts
          </Link>
        )}
        {location.pathname != "/orders" && (
          <Link
            className="self-center cursor-pointer hover:text-primary"
            to="/orders"
          >
            Orders
          </Link>
        )}
      </div>
      <div
        id="social"
        className="flex-none flex flex-row justify-end items-stretch gap-4"
      ></div>
    </div>
  );
};

export default TopBar;
