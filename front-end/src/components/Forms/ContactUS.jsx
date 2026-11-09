import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../app/redux/thunks/messageThunks';
import { clearMessageFeedback } from '../../app/redux/slices/messageSlice';
import SuccessAlert from '../Alerts/SuccessAlert';
import FailureAlert from '../Alerts/FailureAlert';

export default function ContactUS() {
  const dispatch = useDispatch();
  const messageState = useSelector((s) => s.message);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    messageObject: '',
    message: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    dispatch(clearMessageFeedback());
  }, [dispatch]);

  useEffect(() => {
    if (messageState.success) {
      setAlertMessage('Message envoyé avec succès');
      setShowSuccess(true);
      // reset form
      setForm({ firstName: '', lastName: '', email: '', phoneNumber: '', messageObject: '', message: '' });
      const t = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(t);
    }
  }, [messageState.success]);

  useEffect(() => {
    if (messageState.error) {
      setAlertMessage(messageState.error || 'Erreur lors de l\'envoi');
      setShowFailure(true);
      const t = setTimeout(() => setShowFailure(false), 5000);
      return () => clearTimeout(t);
    }
  }, [messageState.error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendMessage(form));
  };

  const loading = messageState.loading;

  return (
    <div className="isolate bg-slate-50 px-6 py-24 sm:py-32 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-1/2 -z-10 aspect-1155/678 w-144.5 max-w-none -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-288.75"
        />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">Contactez-nous</h2>
        <p className="mt-2 text-lg/8 text-gray-600">Décrivez-nous votre demande et notre équipe vous répondra.</p>
      </div>
  {/* Alerts */}
  {showSuccess && <SuccessAlert message={alertMessage} onClose={() => setShowSuccess(false)} />}
  {showFailure && <FailureAlert message={alertMessage} onClose={() => setShowFailure(false)} />}

  <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900">
              Prénom
            </label>
            <div className="mt-2.5">
              <input
                id="first-name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                type="text"
                autoComplete="given-name"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">
              Nom
            </label>
            <div className="mt-2.5">
              <input
                id="last-name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                type="text"
                autoComplete="family-name"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
              Adresse e-mail
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phone-number" className="block text-sm/6 font-semibold text-gray-900">
              Numéro de téléphone
            </label>
            <div className="mt-2.5">
              <div className="flex rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">

                  <input
                    id="phone-number"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    type="text"
                    placeholder="+216 12 345 678"
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                  />
              </div>
            </div>
          </div>

                    <div className="sm:col-span-2">
            <label htmlFor="company" className="block text-sm/6 font-semibold text-gray-900">
              Objet du message
            </label>
            <div className="mt-2.5">
              <input
                id="company"
                name="messageObject"
                value={form.messageObject}
                onChange={handleChange}
                type="text"
                autoComplete="organization"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">
              Message
            </label>
            <div className="mt-2.5">
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>

        </div>
        <div className="mt-10 ">
          <button
            type="submit"
            disabled={loading}
            className={`block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? "Envoi..." : "Envoyer le message"}
          </button>





        </div>
      </form>
    </div>
  )
}
