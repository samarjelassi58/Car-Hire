import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUserFromToken } from "./app/redux/thunks/authThunks";

import AdminRoute from "./Navigation/AdminRoute";
import Contact from "./pages/Contact";
import Home from "./pages/Home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import About from "./pages/About";
import Reservation from "./pages/Reservation";
import Cars from "./pages/Cars";
import Car from "./pages/Car";
import Dashboard from "./pages/Admin/Dashboard";
import NotFound from "./pages/NotFound";
import Clients from "./pages/Admin/Clients";
import Reservations from "./pages/Admin/Reservations";
import Messages from "./pages/Admin/Messages";
import CarsList from "./pages/Admin/Cars";
function App() {
   const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);
    return (
    <Router>
      
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/reservation" element={<Reservation/>}/>
          <Route path="/reservation/:id" element={<Reservation/>}/>
          <Route path="/cars" element={<Cars/>}/>
          <Route path="/car/:id" element={<Car/>}/>
          <Route path="notfound" element={<NotFound/>} />
          
          //Admin
          <Route path="/dashboard" 
          element={<AdminRoute><Dashboard/></AdminRoute>}/>

          <Route path="/admin/clients" 
          element={<AdminRoute><Clients/></AdminRoute>}/>

          <Route path="/admin/cars" 
          element={<AdminRoute><CarsList/></AdminRoute>}/>

          <Route path="/admin/messages" 
          element={<AdminRoute><Messages/></AdminRoute>}/>

          <Route path="/admin/reservations" 
          element={<AdminRoute><Reservations/></AdminRoute>}/>

        </Routes>
    
    </Router>
  );
}

export default App
