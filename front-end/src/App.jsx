import Contact from "./pages/Contact";
import Home from "./pages/Home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import About from "./pages/About";
import Reservation from "./pages/Reservation";
import Cars from "./pages/Cars";
import Car from "./pages/Car";
function App() {
    return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/reservation" element={<Reservation/>}/>
          <Route path="/cars" element={<Cars/>}/>
          <Route path="/car" element={<Car/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App
