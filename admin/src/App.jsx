import Navbar from './component/Navbar';
import Sadebar from "./component/Sadebar.jsx";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add.jsx";
import List from "./pages/List.jsx";
import Order from "./pages/Order.jsx";
import Edit from "./pages/Edit.jsx";
import { useEffect, useState } from "react";
import Login from "./component/Login.jsx";
import { ToastContainer } from 'react-toastify';


export const backendUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sadebar />
            <div className='w-[70%] mx-auto ml-[max(5vm,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Order token={token} />} />
                <Route path="/edit/:id" element={<Edit token={token} />} />
                <Route path="/edit" element={<Edit token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
