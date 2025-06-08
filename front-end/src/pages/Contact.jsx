import Footer from "../components/Footer";
import ContactUS from "../components/Forms/ContactUS";
import Navbar from "../components/Navbar";

const Contact = () => {
  return (
    <div>
      <Navbar />
      <main className="pt-16 px-4">
          <ContactUS />
      </main>

      <Footer/>
    </div>
  );
};

export default Contact;
