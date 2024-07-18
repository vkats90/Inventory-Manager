import { createContext, useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./components/topbar";

function App() {
  const [inView, setInView] = useState(false);
  const AppContext = createContext({ inView, setInView });
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    <AppContext value={{ inView, setInView }}>
      <div className="bg-slate-200 min-h-[100vh]">
        <TopBar />
        <Outlet />
      </div>
    </AppContext>
  );
}

export default App;
