import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Hamburger() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const location = useLocation()
  console.log(location.pathname)
  return (
    <nav>
      <section className="MOBILE-MENU flex md:hidden">
        <div
          className="HAMBURGER-ICON space-y-2 mt-2 group"
          onClick={() => setIsNavOpen((prev) => !prev)}
        >
          <span className="block h-[3px] w-8  bg-black group-hover:bg-primary transition duration-200"></span>
          <span className="block h-[3px] w-8  bg-black group-hover:bg-primary transition duration-200"></span>
          <span className="block h-[3px] w-8  bg-black group-hover:bg-primary transition duration-200"></span>
        </div>
        <div
          onClick={() => setIsNavOpen((prev) => !prev)}
          className={`w-full h-[100vh] absolute bg-black/80  top-0 left-0 ${
            isNavOpen ? 'opacity-1' : 'opacity-0 invisible'
          }`}
        ></div>

        <div className="block  w-full h-full top-0 left-0 ">
          <ul
            className={`absolute flex flex-col top-[50px] text-xl text-gray-600 items-center justify-between min-h-[250px] h-[50%] w-[300px] py-[10%] rounded-sm shadow-sm shadow-white bg-backg  transition ease-in-out duration-300 ${
              isNavOpen ? 'blur-none opacity-100 ' : '-translate-x-[150%] blur-sm opacity-0'
            }`}
          >
            <div //exit button
              className="absolute top-0 right-0 px-2 py-2"
              onClick={() => setIsNavOpen(false)}
            >
              <svg
                className="h-8 w-8 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            {location.pathname != '/' && (
              <Link
                onClick={() => setIsNavOpen(false)}
                className="self-center cursor-pointer hover:text-primary"
                to="/"
              >
                HOME
              </Link>
            )}
            {location.pathname != '/resume' && (
              <Link
                onClick={() => setIsNavOpen(false)}
                className="self-center cursor-pointer hover:text-primary"
                to="/resume"
              >
                RESUME
              </Link>
            )}
            {location.pathname != '/projects' && (
              <Link
                onClick={() => setIsNavOpen(false)}
                className="self-center cursor-pointer hover:text-primary"
                to="/projects"
              >
                PROJECTS
              </Link>
            )}
            {location.pathname != '/contact' && (
              <Link
                onClick={() => setIsNavOpen(false)}
                className="self-center cursor-pointer hover:text-primary"
                to="/contact"
              >
                CONTACT
              </Link>
            )}
          </ul>
        </div>
      </section>

      <style>{`
      .hideMenuNav {
        display:none;
       opacity:0
      }
      .showMenuNav {
        display: block;
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        opacity:1;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    `}</style>
    </nav>
  )
}
