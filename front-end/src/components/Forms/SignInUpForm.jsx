import { useState ,  useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../app/redux/thunks/userThunks";
import { loginUser } from "../../app/redux/thunks/authThunks";
import SuccessAlert from "../Alerts/SuccessAlert";
import FailureAlert from "../Alerts/FailureAlert";

export default function SignInpForm() {
  const [isSignIn, setIsSignIn] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";


  // Sélection des états pour inscription et connexion
  const userState = useSelector((state) => state.user);
  const authState = useSelector((state) => state.auth);
  

  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    Password: "",
  });

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setFormData({
      FirstName: "",
      LastName: "",
      Email: "",
      Phone: "",
      Password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isSignIn) {
      dispatch(registerUser(formData));
    } else {
      dispatch(loginUser({ Email: formData.Email, Password: formData.Password }));
    }
  };

  const loading = isSignIn ? authState.loading : userState.loading;
  const error = isSignIn ? authState.error : userState.error;
  const success = userState.success; // On ne montre le message de succès que pour l'inscription

  // Local alert UI state
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");


  useEffect(() => {
    if (authState.user && authState.user.role) {
      const { role } = authState.user;

      // Navigate immediately after login
      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [authState.user, navigate, redirectTo]);

  // Watch for success / error to show alerts
  useEffect(() => {
    if (success) {
      setAlertMessage(typeof success === 'string' ? success : 'Account created successfully!');
      setShowSuccess(true);
      // auto-dismiss
      const t = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(t);
    }
    // hide when success becomes false
    if (!success) setShowSuccess(false);
  }, [success]);

  useEffect(() => {
    if (error) {
      setAlertMessage(typeof error === 'string' ? error : 'An error occurred');
      setShowFailure(true);
      const t = setTimeout(() => setShowFailure(false), 5000);
      return () => clearTimeout(t);
    }
    if (!error) setShowFailure(false);
  }, [error]);
  return (
    <div className="isolate bg-slate-50 px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          {isSignIn ? "Sign In" : "Sign Up"}
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          {isSignIn ? "Access your account" : "Create your account to get started"}
        </p>
      </div>

      {/* Alerts */}
      <div className="mx-auto mt-6 max-w-xl">
        {showSuccess && (
          <SuccessAlert message={alertMessage} onClose={() => setShowSuccess(false)} />
        )}
        {showFailure && (
          <FailureAlert message={alertMessage} onClose={() => setShowFailure(false)} />
        )}
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {!isSignIn && (
            <>
              <div>
                <label htmlFor="FirstName" className="block text-sm font-semibold text-gray-900">
                  First Name
                </label>
                <div className="mt-2.5">
                  <input
                    id="FirstName"
                    name="FirstName"
                    type="text"
                    value={formData.FirstName}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="LastName" className="block text-sm font-semibold text-gray-900">
                  Last Name
                </label>
                <div className="mt-2.5">
                  <input
                    id="LastName"
                    name="LastName"
                    type="text"
                    value={formData.LastName}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                  />
                </div>
              </div>
            </>
          )}

          <div className="sm:col-span-2">
            <label htmlFor="Email" className="block text-sm font-semibold text-gray-900">
              Email
            </label>
            <div className="mt-2.5">
              <input
                id="Email"
                name="Email"
                type="email"
                value={formData.Email}
                onChange={handleChange}
                required
                className="block w-full rounded-md px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
              />
            </div>
          </div>

          {!isSignIn && (
            <div className="sm:col-span-2">
              <label htmlFor="Phone" className="block text-sm font-semibold text-gray-900">
                Phone Number
              </label>
              <div className="mt-2.5">
                <input
                  id="Phone"
                  name="Phone"
                  type="text"
                  placeholder="+216 12 345 678"
                  value={formData.Phone}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                />
              </div>
            </div>
          )}

          <div className="sm:col-span-2">
            <label htmlFor="Password" className="block text-sm font-semibold text-gray-900">
              Password
            </label>
            <div className="mt-2.5">
              <input
                id="Password"
                name="Password"
                type="password"
                minLength={isSignIn ? undefined : 8}
                value={formData.Password}
                onChange={handleChange}
                required
                className="block w-full rounded-md px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            {isSignIn ? (loading ? "Signing In..." : "Sign In") : loading ? "Creating..." : "Sign Up"}
          </button>
        </div>

        {loading && <p className="mt-4 text-center text-blue-500">Processing...</p>}

        <p className="mt-6 text-center text-sm text-gray-600">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={toggleForm}
            className="font-semibold text-indigo-600 hover:text-indigo-500 underline"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </form>
    </div>
  );
}
