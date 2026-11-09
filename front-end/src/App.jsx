import { lazy, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { loadUserFromToken } from "./app/redux/thunks/authThunks";
import AdminRoute from "./Navigation/AdminRoute";
import ProtectedRoute from "./Navigation/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const About = lazy(() => import("./pages/About"));
const Cars = lazy(() => import("./pages/Cars"));
const Car = lazy(() => import("./pages/Car"));
const Reservation = lazy(() => import("./pages/Reservation"));
const MyReservations = lazy(() => import("./pages/MyReservations"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const Clients = lazy(() => import("./pages/Admin/Clients"));
const CarsList = lazy(() => import("./pages/Admin/Cars"));
const Reservations = lazy(() => import("./pages/Admin/Reservations"));
const Messages = lazy(() => import("./pages/Admin/Messages"));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);

  return (
    <Router>
      <Suspense fallback={<p className="p-8 text-center text-gray-600">Chargement...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/car/:id" element={<Car />} />

          <Route path="/reservation" element={<ProtectedRoute><Reservation /></ProtectedRoute>} />
          <Route path="/reservation/:id" element={<ProtectedRoute><Reservation /></ProtectedRoute>} />
          <Route path="/my-reservations" element={<ProtectedRoute><MyReservations /></ProtectedRoute>} />

          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/clients" element={<AdminRoute><Clients /></AdminRoute>} />
          <Route path="/admin/cars" element={<AdminRoute><CarsList /></AdminRoute>} />
          <Route path="/admin/messages" element={<AdminRoute><Messages /></AdminRoute>} />
          <Route path="/admin/reservations" element={<AdminRoute><Reservations /></AdminRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
