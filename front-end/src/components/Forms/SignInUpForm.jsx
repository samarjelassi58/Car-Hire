import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../app/redux/userSlice";

export default function SignInpForm() {
  const [isSignIn, setIsSignIn] = useState(true);
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    Password: "",
    role: "client",
  });

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setFormData({
      FirstName: "",
      LastName: "",
      Email: "",
      Phone: "",
      Password: "",
      role: "client",
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
      console.log("Connexion pas encore implémentée");
    }
  };

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          {isSignIn ? "Sign In" : "Sign Up"}
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          {isSignIn ? "Access your account" : "Create your account to get started"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
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
            {isSignIn ? "Sign In" : loading ? "Creating..." : "Sign Up"}
          </button>
        </div>

        {loading && <p className="mt-4 text-center text-blue-500">Processing...</p>}
        {success && <p className="mt-4 text-center text-green-600">Account created successfully!</p>}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}

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
