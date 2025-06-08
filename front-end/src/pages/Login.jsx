import Footer from "../components/Footer";
import SignInUpForm from "../components/Forms/SignInUpForm";
import Navbar from "../components/Navbar";

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow  px-4 ">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 py-16">
          
          {/* Left: Form */}
          <div>
            <SignInUpForm />
          </div>

          {/* Right: Image */}
          <div className="hidden md:block">
            <img
              src="/images/login.svg"
              alt="Login illustration"
              className="w-full h-auto object-contain"
            />
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
